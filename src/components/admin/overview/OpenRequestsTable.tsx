import { overviewLabelClass, overviewRowMetaClass, overviewRowTitleClass } from "./panelStyles";

type PriorityTone = "urgent" | "high";

export type OpenRequestRowData = {
  initial: string;
  memberName: string;
  memberMeta: string;
  request: string;
  priority: PriorityTone;
  waiting: string;
  assignedName: string;
  assignedSuffix?: string;
  assignedTone?: "human" | "ai";
};

const priorityClass: Record<PriorityTone, string> = {
  urgent: "bg-[#3D1A1A] text-[#E9CCCC]",
  high: "bg-[#2E2B14] text-[#D4AF37]",
};

export function OpenRequestsTable({ rows }: { rows: OpenRequestRowData[] }) {
  return (
    <div className="overflow-x-auto">
      <p className={`${overviewLabelClass} mb-4 text-[#E7E5E4]`}>Open Requests</p>
      <table className="w-full min-w-[480px] border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              {["Member", "Request", "Priority", "Waiting", "Assigned"].map(
                (col) => (
                  <th
                    key={col}
                    className="font-roboto pb-3 text-left text-[10px] font-medium tracking-[0.16em] text-[#6B665E] uppercase"
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.memberMeta}-${index}`}
                className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-[#1A1A1A]"
              >
                <td className="py-4 pr-3">
                  <div className="flex items-center gap-3">
                    <span className="font-roboto flex size-9 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#1C1917] text-[12px] font-semibold text-[#D4AF37] uppercase">
                      {row.initial}
                    </span>
                    <div className="min-w-0">
                      <p className="font-roboto truncate text-[12px] font-semibold tracking-[0.06em] text-[#D4AF37] uppercase">
                        {row.memberName}
                      </p>
                      <p className={overviewRowMetaClass}>{row.memberMeta}</p>
                    </div>
                  </div>
                </td>
                <td className="max-w-[220px] py-4 pr-3">
                  <p className={overviewRowTitleClass}>{row.request}</p>
                </td>
                <td className="py-4 pr-3">
                  <span
                    className={`font-roboto inline-flex rounded-full px-3 py-1 text-[9px] font-semibold tracking-[0.12em] uppercase ${priorityClass[row.priority]}`}
                  >
                    {row.priority}
                  </span>
                </td>
                <td className="py-4 pr-3">
                  <span className="font-roboto text-[12px] tracking-[0.04em] text-[#C5A059]">
                    {row.waiting}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 shrink-0 rounded-full ${
                        row.assignedTone === "ai" ? "bg-[#9E8AD4]" : "bg-teal"
                      }`}
                    />
                    <span className="font-roboto text-[12px] tracking-[0.03em] text-[#E7E5E4]">
                      {row.assignedName}
                      {row.assignedSuffix && (
                        <span className="text-[#6B665E]">{row.assignedSuffix}</span>
                      )}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
