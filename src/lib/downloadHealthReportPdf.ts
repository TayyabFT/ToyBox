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
    ensureSpace(height + 4);
    doc.setFillColor(...COLORS.card);
    doc.setDrawColor(40, 36, 30);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, y, contentWidth, height, 3, 3, "FD");
    return y + 6;
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

  const writeLines = (
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    lineHeight: number,
  ) => {
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    lines.forEach((line, index) => {
      doc.text(line, x, startY + index * lineHeight);
    });
    return startY + lines.length * lineHeight;
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

    return barY + 8;
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

    y += headerHeight + 4;
  }

  // Overdue banner
  if (report.isOverdue && report.overdueDays) {
    const summaryLines = doc.splitTextToSize(
      report.overdueSummary || "Service is overdue.",
      contentWidth - 16,
    ) as string[];
    const bannerHeight = 14 + summaryLines.length * 4;
    ensureSpace(bannerHeight + 4);

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

    y += bannerHeight + 4;
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

    y += overviewHeight + 4;
  }

  // System breakdown card
  if (report.systemMetrics.length > 0) {
    const metrics = report.systemMetrics;
    const criticalCount = metrics.filter((metric) => metric.tone === "pink").length;
    const rowHeight = 12;
    const rows = Math.ceil(metrics.length / 2);
    const sectionHeight = 16 + rows * rowHeight;
    const innerY = drawCard(sectionHeight);

    setText(11, COLORS.foreground, "bold");
    doc.text("SYSTEM BREAKDOWN", margin + 6, innerY + 5);

    if (criticalCount > 0) {
      const badgeText = `+ ${criticalCount} CRITICAL`;
      const badgeWidth = doc.getTextWidth(badgeText) + 8;
      const badgeX = margin + contentWidth - 6 - badgeWidth;

      doc.setFillColor(30, 16, 18);
      doc.setDrawColor(...COLORS.pink);
      doc.setLineWidth(0.2);
      doc.roundedRect(badgeX, innerY + 1, badgeWidth, 6, 2, 2, "FD");

      setText(7, COLORS.pink, "bold");
      doc.text(badgeText, badgeX + 4, innerY + 5);
    }

    const columnWidth = (contentWidth - 18) / 2;
    const leftX = margin + 6;
    const rightX = margin + 6 + columnWidth + 6;
    let leftY = innerY + 14;
    let rightY = innerY + 14;
    const midpoint = Math.ceil(metrics.length / 2);

    metrics.forEach((metric, index) => {
      if (index < midpoint) {
        leftY = drawProgressBar(metric, leftX, leftY, columnWidth);
      } else {
        rightY = drawProgressBar(metric, rightX, rightY, columnWidth);
      }
    });

    y += sectionHeight + 4;
  }

  // Service history card
  if (report.serviceHistory.length > 0) {
    ensureSpace(18);
    setText(11, COLORS.foreground, "bold");
    doc.text("SERVICE HISTORY", margin + 2, y + 4);
    y += 10;

    for (const entry of report.serviceHistory) {
      const detailLines = doc.splitTextToSize(entry.detail, contentWidth - 18) as string[];
      const blockHeight = 18 + detailLines.length * 4;
      ensureSpace(blockHeight + 2);

      doc.setFillColor(...COLORS.card);
      doc.setDrawColor(40, 36, 30);
      doc.roundedRect(margin, y, contentWidth, blockHeight, 2, 2, "FD");

      doc.setFillColor(...COLORS.primary);
      doc.circle(margin + 6, y + 6, 1.2, "F");

      setText(7, COLORS.secondary);
      doc.text(entry.date.toUpperCase(), margin + 12, y + 6);

      setText(10, COLORS.foreground, "bold");
      doc.text(entry.title, margin + 12, y + 11);

      setText(7, COLORS.secondary);
      doc.text(entry.location.toUpperCase(), margin + 12, y + 15);

      setText(8, COLORS.primary);
      detailLines.forEach((line, index) => {
        doc.text(line, margin + 12, y + 19 + index * 4);
      });

      y += blockHeight + 3;
    }
  }

  const filename = `health-report-${sanitizeFilename(report.reference)}-${sanitizeFilename(report.vehicle)}.pdf`;
  doc.save(filename);
}
