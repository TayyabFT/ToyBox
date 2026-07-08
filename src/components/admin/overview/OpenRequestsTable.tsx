import { overviewLabelClass, overviewRowMetaClass, overviewRowTitleClass } from "./panelStyles";

type PriorityTone = "urgent" | "high";

export type OpenRequestRowData = {
  initial: string;
  memberName: string;
  memberMeta: string;
  memberAvatarUrl?: string;
  request: string;
  priority: PriorityTone;
  waiting: string;
};

const priorityClass: Record<PriorityTone, string> = {
  urgent: "bg-[#3D1A1A] text-[#E9CCCC]",
  high: "bg-[#2E2B14] text-[#D4AF37]",
};

const headerClass =
  "font-roboto pb-3 text-left text-[10px] font-medium tracking-[0.16em] text-[#6B665E] uppercase";

function MemberAvatar({
  initial,
  name,
  avatarUrl,
}: {
  initial: string;
  name: string;
  avatarUrl?: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="size-8 shrink-0 rounded-full border border-[#D4AF37]/40 object-cover"
      />
    );
  }

  return (
    <span className="font-roboto flex size-8 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#1C1917] text-[11px] font-semibold text-[#D4AF37] uppercase">
      {initial}
    </span>
  );
}

export function OpenRequestsTable({ rows }: { rows: OpenRequestRowData[] }) {
  return (
    <div className="min-w-0 w-full overflow-hidden">
      <p className={`${overviewLabelClass} mb-4 text-[#E7E5E4]`}>Open Requests</p>
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[30%]" />
          <col className="w-[36%]" />
          <col className="w-[16%]" />
          <col className="w-[18%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-white/5">
            {["Member", "Request", "Priority", "Waiting"].map((col) => (
              <th key={col} className={`${headerClass} pr-2`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.memberMeta}-${index}`}
              className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-[#1A1A1A]"
            >
              <td className="min-w-0 py-3 pr-2">
                <div className="flex min-w-0 items-center gap-2">
                  <MemberAvatar
                    initial={row.initial}
                    name={row.memberName}
                    avatarUrl={row.memberAvatarUrl}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-roboto truncate text-[11px] font-semibold tracking-[0.06em] text-[#D4AF37] uppercase">
                      {row.memberName}
                    </p>
                    <p className={`${overviewRowMetaClass} truncate text-[9px]`}>
                      {row.memberMeta}
                    </p>
                  </div>
                </div>
              </td>
              <td className="min-w-0 py-3 pr-2">
                <p className={`${overviewRowTitleClass} truncate text-[12px]`}>{row.request}</p>
              </td>
              <td className="min-w-0 py-3 pr-2">
                <span
                  className={`font-roboto inline-flex max-w-full truncate rounded-full px-2.5 py-1 text-[8px] font-semibold tracking-[0.12em] uppercase ${priorityClass[row.priority]}`}
                >
                  {row.priority}
                </span>
              </td>
              <td className="min-w-0 py-3">
                <span className="font-roboto block truncate text-[11px] tracking-[0.04em] text-[#C5A059]">
                  {row.waiting}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
