import {
  overviewRowMetaClass,
  overviewRowTitleClass,
} from "@/components/admin/overview/panelStyles";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import type { ServiceQueueItem } from "./types";

type ServiceQueueTableProps = {
  rows: ServiceQueueItem[];
  loading?: boolean;
};

function ServiceQueueRowSkeleton() {
  return (
    <tr className="border-b border-white/5 last:border-b-0">
      <td className="py-4 pr-3">
        <ShimmerBlock className="h-3 w-16" />
      </td>
      <td className="py-4 pr-3">
        <div className="flex items-center gap-3">
          <ShimmerBlock className="size-9 shrink-0 rounded-full" />
          <div className="min-w-0 space-y-1.5">
            <ShimmerBlock className="h-3 w-24" />
            <ShimmerBlock className="h-2.5 w-16" />
          </div>
        </div>
      </td>
      <td className="py-4 pr-3">
        <ShimmerBlock className="h-3 w-28" />
      </td>
      <td className="max-w-[200px] py-4 pr-3">
        <ShimmerBlock className="h-3 w-32" />
      </td>
      <td className="py-4 pr-3">
        <ShimmerBlock className="h-3 w-20" />
      </td>
      <td className="py-4">
        <ShimmerBlock className="h-3 w-14" />
      </td>
    </tr>
  );
}

export function ServiceQueueTable({
  rows,
  loading = false,
}: ServiceQueueTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b border-white/5">
            {["Date", "Member", "Vehicle", "Service", "Engineer", "Est."].map(
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
          {loading ? (
            Array.from({ length: 5 }, (_, index) => (
              <ServiceQueueRowSkeleton key={index} />
            ))
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-[#1A1A1A]"
              >
                <td className="py-4 pr-3">
                  <span className="font-roboto text-[12px] font-semibold tracking-[0.06em] text-[#C5A059] uppercase">
                    {row.date}
                  </span>
                </td>
                <td className="py-4 pr-3">
                  <div className="flex items-center gap-3">
                    <span className="font-roboto flex size-9 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37] text-[12px] font-semibold text-[#000] uppercase">
                      {row.memberInitial}
                    </span>
                    <div className="min-w-0">
                      <p className="font-roboto truncate text-[12px] font-semibold tracking-[0.06em] text-[#D4AF37] uppercase">
                        {row.memberName}
                      </p>
                      <p className={overviewRowMetaClass}>{row.memberNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 pr-3">
                  <p className="font-roboto text-[12px] font-semibold tracking-[0.04em] uppercase">
                    <span className="text-[#E7E5E4]">{row.vehicleMake} </span>
                    <span className="text-[#C5A059]">{row.vehicleModel}</span>
                  </p>
                </td>
                <td className="max-w-[200px] py-4 pr-3">
                  <p className={overviewRowTitleClass}>{row.service}</p>
                </td>
                <td className="py-4 pr-3">
                  <p className="font-roboto text-[12px] tracking-[0.03em] text-[#E7E5E4]">
                    {row.engineer}
                  </p>
                </td>
                <td className="py-4">
                  <span className="font-roboto text-[12px] tracking-[0.04em] text-[#E7E5E4]">
                    {row.estimate}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>
                <p className="font-roboto py-8 text-center text-[11px] tracking-[0.06em] text-[#6B665E] uppercase">
                  No scheduled services
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
