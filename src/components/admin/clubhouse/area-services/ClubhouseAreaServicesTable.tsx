import { ClubhouseVenueStatusBadge } from "../ClubhouseVenueStatusBadge";
import type { ClubhouseAreaServiceColumn, ClubhouseAreaServiceRow } from "./types";

type ClubhouseAreaServicesTableProps = {
  nameColumnLabel: string;
  columns: ClubhouseAreaServiceColumn[];
  rows: ClubhouseAreaServiceRow[];
};

function alignClass(align?: "left" | "center" | "right"): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export function ClubhouseAreaServicesTable({
  nameColumnLabel,
  columns,
  rows,
}: ClubhouseAreaServicesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/12 bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-accent/8">
              <th className="font-roboto px-5 py-4 text-left text-[10px] font-medium tracking-[0.16em] text-secondary uppercase">
                {nameColumnLabel}
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`font-roboto px-5 py-4 text-[10px] font-medium tracking-[0.16em] text-secondary uppercase ${alignClass(column.align)}`}
                >
                  {column.label}
                </th>
              ))}
              <th className="font-roboto px-5 py-4 text-left text-[10px] font-medium tracking-[0.16em] text-secondary uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-accent/8 last:border-b-0">
                <td className="px-5 py-4">
                  <p className="font-roboto text-[12px] font-semibold tracking-[0.03em] text-foreground uppercase">
                    {row.name}
                  </p>
                  {row.locationLabel ? (
                    <p className="mt-0.5 font-roboto text-[10px] tracking-[0.03em] text-secondary">
                      {row.locationLabel}
                    </p>
                  ) : null}
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-5 py-4 font-roboto text-[12px] tracking-[0.02em] text-foreground ${alignClass(column.align)}`}
                  >
                    {row.cells[column.key] ?? "—"}
                  </td>
                ))}
                <td className="px-5 py-4">
                  <ClubhouseVenueStatusBadge
                    label={row.statusLabel}
                    tone={row.statusTone}
                  />
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-5 py-10 text-center font-roboto text-sm text-secondary"
                >
                  No records for this category.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
