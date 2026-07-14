import type { HealthReport } from "@/components/staff/health-reports/types";
import type { HealthMetric, VehicleStatus } from "@/components/staff/vehicles/types";

const COLORS = {
  background: [7, 6, 5] as const,
  card: [17, 16, 12] as const,
  surface: [13, 12, 10] as const,
  foreground: [242, 234, 213] as const,
  secondary: [125, 116, 96] as const,
  label: [74, 67, 56] as const,
  primary: [201, 168, 76] as const,
  pink: [216, 153, 153] as const,
  teal: [125, 191, 160] as const,
  border: [212, 168, 71] as const,
};

const CARD_INNER_PAD = 6;
const METRIC_ROW_HEIGHT = 14;
const SECTION_GAP = 3;

const STATUS_LABELS: Record<VehicleStatus, string> = {
  "in-service": "IN SERVICE",
  ready: "READY",
  overdue: "OVERDUE",
  dispatched: "DISPATCHED",
  away: "AWAY",
  "in-progress": "IN PROGRESS",
  pending: "PENDING",
  done: "DONE",
  critical: "CRITICAL",
  "due-service": "DUE SERVICE",
  good: "GOOD",
  excellent: "EXCELLENT",
};

const METRIC_TONE_RGB = {
  pink: COLORS.pink,
  gold: COLORS.primary,
  teal: COLORS.teal,
} as const;

function healthScoreColor(value: number): readonly [number, number, number] {
  if (value < 50) return COLORS.pink;
  if (value < 70) return COLORS.primary;
  return COLORS.teal;
}

function sanitizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/^-|-$/g, "") || "report";
}

function formatGeneratedDate() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function calcSystemBreakdownHeight(metricCount: number) {
  const rows = Math.ceil(metricCount / 2);
  const headerArea = 18;
  return CARD_INNER_PAD + headerArea + rows * METRIC_ROW_HEIGHT + CARD_INNER_PAD;
}

function calcHistoryBlockHeight(detailLineCount: number, compact: boolean) {
  if (compact) {
    return 13 + detailLineCount * 3.5;
  }

  return 16 + detailLineCount * 4;
}

function simulateVerticalLayout(
  startY: number,
  blockHeights: number[],
  gap: number,
  pageHeight: number,
  margin: number,
) {
  let y = startY;
  let pageCount = 1;
  const bottom = pageHeight - margin;

  for (const height of blockHeights) {
    if (y + height > bottom) {
      pageCount += 1;
      y = margin;
    }

    y += height + gap;
  }

  return {
    endY: y,
    pageCount,
    lastPageUsed: y - margin,
  };
}

function shouldUseCompactHistory(
  startY: number,
  detailLineCounts: number[],
  pageHeight: number,
  margin: number,
) {
  const normalHeights = detailLineCounts.map((lineCount) =>
    calcHistoryBlockHeight(lineCount, false),
  );
  const normal = simulateVerticalLayout(startY, normalHeights, 2, pageHeight, margin);

  if (normal.pageCount <= 1) {
    return false;
  }

  const compactHeights = detailLineCounts.map((lineCount) =>
    calcHistoryBlockHeight(lineCount, true),
  );
  const compact = simulateVerticalLayout(startY, compactHeights, 1.5, pageHeight, margin);
  const usablePage = pageHeight - margin * 2;

  if (compact.pageCount < normal.pageCount) {
    return true;
  }

  if (normal.lastPageUsed < usablePage * 0.35) {
    return true;
  }

  return compact.lastPageUsed > normal.lastPageUsed;
}

export async function downloadHealthReportPdf(report: HealthReport) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const drawPageBackground = () => {
    doc.setFillColor(...COLORS.background);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      drawPageBackground();
      y = margin;
    }
  };

  const drawCard = (height: number) => {
    ensureSpace(height + SECTION_GAP);
    doc.setFillColor(...COLORS.card);
    doc.setDrawColor(40, 36, 30);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, y, contentWidth, height, 3, 3, "FD");
    return y + CARD_INNER_PAD;
  };

  const setText = (
    size: number,
    color: readonly [number, number, number],
    style: "normal" | "bold" = "normal",
  ) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const drawProgressBar = (
    metric: HealthMetric,
    x: number,
    startY: number,
    width: number,
  ) => {
    const barHeight = 2;
    const labelY = startY;
    const barY = startY + 5;

    setText(8, COLORS.secondary);
    doc.text(metric.label.toUpperCase(), x, labelY);

    const valueText = `${metric.value}%`;
    const valueWidth = doc.getTextWidth(valueText);
    setText(8, METRIC_TONE_RGB[metric.tone], "bold");
    doc.text(valueText, x + width - valueWidth, labelY);

    doc.setFillColor(40, 36, 30);
    doc.roundedRect(x, barY, width, barHeight, 1, 1, "F");

    const fillWidth = Math.max(0, Math.min(width, (metric.value / 100) * width));
    if (fillWidth > 0) {
      const [r, g, b] = METRIC_TONE_RGB[metric.tone];
      doc.setFillColor(r, g, b);
      doc.roundedRect(x, barY, fillWidth, barHeight, 1, 1, "F");
    }

    return startY + METRIC_ROW_HEIGHT;
  };

  const drawHistoryEntry = (
    entry: HealthReport["serviceHistory"][number],
    blockHeight: number,
    compact: boolean,
  ) => {
    const detailLines = doc.splitTextToSize(entry.detail, contentWidth - 18) as string[];
    const dateY = compact ? y + 5 : y + 6;
    const titleY = compact ? y + 9 : y + 11;
    const locationY = compact ? y + 12.5 : y + 15;
    const detailY = compact ? y + 16 : y + 19;
    const detailLineHeight = compact ? 3.5 : 4;
    const dotY = compact ? y + 4.5 : y + 6;

    ensureSpace(blockHeight + (compact ? 1.5 : 2));

    doc.setFillColor(...COLORS.card);
    doc.setDrawColor(40, 36, 30);
    doc.roundedRect(margin, y, contentWidth, blockHeight, 2, 2, "FD");

    doc.setFillColor(...COLORS.primary);
    doc.circle(margin + 6, dotY, 1.2, "F");

    setText(7, COLORS.secondary);
    doc.text(entry.date.toUpperCase(), margin + 12, dateY);

    setText(compact ? 9 : 10, COLORS.foreground, "bold");
    doc.text(entry.title, margin + 12, titleY);

    setText(7, COLORS.secondary);
    doc.text(entry.location.toUpperCase(), margin + 12, locationY);

    setText(8, COLORS.primary);
    detailLines.forEach((line, index) => {
      doc.text(line, margin + 12, detailY + index * detailLineHeight);
    });

    y += blockHeight + (compact ? 1.5 : 2);
  };

  drawPageBackground();

  // Header card
  {
    const headerHeight = 22;
    const innerY = drawCard(headerHeight);

    setText(13, COLORS.foreground, "bold");
    doc.text(`HEALTH REPORT · ${report.reference}`, margin + 6, innerY + 4);

    setText(8, COLORS.secondary);
    doc.text(`Generated ${formatGeneratedDate()}`, margin + 6, innerY + 11);

    y += headerHeight + SECTION_GAP;
  }

  // Overdue banner
  if (report.isOverdue && report.overdueDays) {
    const summaryLines = doc.splitTextToSize(
      report.overdueSummary || "Service is overdue.",
      contentWidth - 16,
    ) as string[];
    const bannerHeight = 14 + summaryLines.length * 4;
    ensureSpace(bannerHeight + SECTION_GAP);

    doc.setFillColor(20, 12, 14);
    doc.setDrawColor(...COLORS.pink);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, bannerHeight, 3, 3, "FD");

    setText(9, COLORS.pink, "bold");
    doc.text(`SERVICE OVERDUE — ${report.overdueDays} DAYS`, margin + 6, y + 7);

    setText(8, COLORS.secondary);
    summaryLines.forEach((line, index) => {
      doc.text(line, margin + 6, y + 12 + index * 4);
    });

    y += bannerHeight + SECTION_GAP;
  }

  // Overview card
  {
    const overviewHeight = 58;
    const innerY = drawCard(overviewHeight);
    const leftX = margin + 6;
    const rightX = margin + contentWidth - 34;

    setText(16, COLORS.foreground, "bold");
    doc.text(report.vehicle, leftX, innerY + 6);

    setText(9, COLORS.secondary);
    doc.text(report.yearColorBay, leftX, innerY + 12);

    setText(8, COLORS.primary, "bold");
    doc.text(STATUS_LABELS[report.healthStatus] ?? report.healthStatus.toUpperCase(), leftX, innerY + 18);

    if (report.isOverdue) {
      const statusWidth = doc.getTextWidth(STATUS_LABELS[report.healthStatus] ?? "");
      setText(8, COLORS.pink, "bold");
      doc.text("OVERDUE", leftX + statusWidth + 6, innerY + 18);
    }

    const scoreColor = healthScoreColor(report.healthPercent);
    setText(28, scoreColor, "bold");
    doc.text(String(report.healthPercent), rightX, innerY + 10);
    setText(8, COLORS.secondary);
    doc.text("HEALTH %", rightX, innerY + 16);

    const gridY = innerY + 28;
    const colWidth = (contentWidth - 12) / 4;
    const infoFields = [
      { label: "MILEAGE", value: report.mileage },
      { label: "LAST SERVICE", value: report.lastService },
      { label: "MEMBER", value: report.member },
      { label: "SERVICE DUE", value: report.serviceDue },
    ];

    infoFields.forEach((field, index) => {
      const x = leftX + index * colWidth;
      setText(7, COLORS.label);
      doc.text(field.label, x, gridY);
      setText(10, COLORS.foreground, "bold");
      const valueLines = doc.splitTextToSize(field.value, colWidth - 2) as string[];
      doc.text(valueLines[0] ?? "—", x, gridY + 5);
    });

    setText(8, scoreColor, "bold");
    const conditionText = report.overallCondition.toUpperCase();
    const conditionWidth = doc.getTextWidth(conditionText);
    doc.text(conditionText, margin + contentWidth - 6 - conditionWidth, innerY + 52);

    y += overviewHeight + SECTION_GAP;
  }

  // System breakdown card
  if (report.systemMetrics.length > 0) {
    const metrics = report.systemMetrics;
    const criticalCount = metrics.filter((metric) => metric.tone === "pink").length;
    const sectionHeight = calcSystemBreakdownHeight(metrics.length);
    const innerY = drawCard(sectionHeight);
    const headerBaseline = innerY + 6;

    setText(11, COLORS.foreground, "bold");
    doc.text("SYSTEM BREAKDOWN", margin + 6, headerBaseline);

    if (criticalCount > 0) {
      const badgeText = `+ ${criticalCount} CRITICAL`;
      setText(7, COLORS.pink, "bold");
      const badgeWidth = doc.getTextWidth(badgeText) + 8;
      const badgeX = margin + contentWidth - 6 - badgeWidth;
      const badgeY = innerY + 2;

      doc.setFillColor(30, 16, 18);
      doc.setDrawColor(...COLORS.pink);
      doc.setLineWidth(0.2);
      doc.roundedRect(badgeX, badgeY, badgeWidth, 7, 2, 2, "FD");
      doc.text(badgeText, badgeX + 4, headerBaseline);
    }

    const columnWidth = (contentWidth - 18) / 2;
    const leftX = margin + 6;
    const rightX = margin + 6 + columnWidth + 6;
    const metricsStartY = innerY + 18;
    let leftY = metricsStartY;
    let rightY = metricsStartY;
    const midpoint = Math.ceil(metrics.length / 2);

    metrics.forEach((metric, index) => {
      if (index < midpoint) {
        leftY = drawProgressBar(metric, leftX, leftY, columnWidth);
      } else {
        rightY = drawProgressBar(metric, rightX, rightY, columnWidth);
      }
    });

    y += sectionHeight + SECTION_GAP;
  }

  // Service history
  if (report.serviceHistory.length > 0) {
    const historyTitleHeight = 8;
    ensureSpace(historyTitleHeight);
    setText(11, COLORS.foreground, "bold");
    doc.text("SERVICE HISTORY", margin + 2, y + 4);
    y += historyTitleHeight;

    const detailLineCounts = report.serviceHistory.map((entry) => {
      const detailLines = doc.splitTextToSize(entry.detail, contentWidth - 18) as string[];
      return detailLines.length;
    });

    const useCompactHistory = shouldUseCompactHistory(
      y,
      detailLineCounts,
      pageHeight,
      margin,
    );

    report.serviceHistory.forEach((entry, index) => {
      const lineCount = detailLineCounts[index] ?? 1;
      const blockHeight = calcHistoryBlockHeight(lineCount, useCompactHistory);
      drawHistoryEntry(entry, blockHeight, useCompactHistory);
    });
  }

  const filename = `health-report-${sanitizeFilename(report.reference)}-${sanitizeFilename(report.vehicle)}.pdf`;
  doc.save(filename);
}
