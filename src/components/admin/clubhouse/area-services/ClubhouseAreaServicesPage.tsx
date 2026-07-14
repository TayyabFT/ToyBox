"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminClubhouseApi } from "@/api/adminClubhouse.api";
import {
  createEmptyAdminClubhouseAreaOverview,
  mapAdminClubhouseAreaOverview,
} from "@/lib/adminClubhouse";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { showError } from "@/lib/toast";
import { ClubhouseAreaCategoryCard } from "./ClubhouseAreaCategoryCard";
import { ClubhouseAreaFilterTabs } from "./ClubhouseAreaFilterTabs";
import { ClubhouseAreaServicesTable } from "./ClubhouseAreaServicesTable";
import { CLUBHOUSE_AREA_STATIC_CONFIG } from "./config";
import type { ClubhouseAreaId, ClubhouseAreaOverviewDisplay } from "./types";

type ClubhouseAreaServicesPageProps = {
  areaId: ClubhouseAreaId;
};

const ALL_FILTER_ID = "all";

function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-accent/12 bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <ShimmerBlock className="h-3.5 w-32" />
        <ShimmerBlock className="h-5 w-20 rounded-full" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <ShimmerBlock className="h-2.5 w-16" />
        <ShimmerBlock className="h-2.5 w-16" />
      </div>
      <div className="mt-4 space-y-2.5 border-t border-accent/8 pt-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <ShimmerBlock className="h-2.5 w-24" />
            <ShimmerBlock className="h-2.5 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceRowSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <tr className="border-b border-accent/8 last:border-b-0">
      <td className="px-5 py-4">
        <ShimmerBlock className="h-3 w-32" />
        <ShimmerBlock className="mt-1.5 h-2.5 w-24" />
      </td>
      {Array.from({ length: columnCount }, (_, index) => (
        <td key={index} className="px-5 py-4">
          <ShimmerBlock className="h-3 w-20" />
        </td>
      ))}
      <td className="px-5 py-4">
        <ShimmerBlock className="h-5 w-16 rounded-full" />
      </td>
    </tr>
  );
}

export function ClubhouseAreaServicesPage({
  areaId,
}: ClubhouseAreaServicesPageProps) {
  const staticConfig = CLUBHOUSE_AREA_STATIC_CONFIG[areaId];
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER_ID);
  const [overview, setOverview] = useState<ClubhouseAreaOverviewDisplay>(
    createEmptyAdminClubhouseAreaOverview(),
  );

  useSetAdminPageSubtitle(staticConfig.pageTitle);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setActiveFilter(ALL_FILTER_ID);

    try {
      const response = await adminClubhouseApi.getAreaOverview(areaId);
      setOverview(mapAdminClubhouseAreaOverview(areaId, response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load clubhouse area";

      showError(message);
      setOverview(createEmptyAdminClubhouseAreaOverview());
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const tabs = useMemo(
    () => [
      { id: ALL_FILTER_ID, label: "All" },
      ...overview.categories.map((category) => ({
        id: category.id,
        label: category.tabLabel,
      })),
    ],
    [overview.categories],
  );

  const filteredRows = useMemo(
    () =>
      activeFilter === ALL_FILTER_ID
        ? overview.items
        : overview.items.filter((item) => item.categoryId === activeFilter),
    [activeFilter, overview.items],
  );

  return (
    <div className="space-y-7 p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-copperplate text-[22px] leading-tight tracking-[0.05em] uppercase">
            {staticConfig.title.before ? (
              <span className="text-foreground">{staticConfig.title.before}</span>
            ) : null}
            <span className="text-accent">{staticConfig.title.highlight}</span>
            {staticConfig.title.after ? (
              <span className="text-foreground">{staticConfig.title.after}</span>
            ) : null}
          </h1>
          <p className="font-roboto text-[10px] tracking-[0.16em] text-secondary uppercase">
            {overview.areaCountLabel}
          </p>
        </div>

        <Link
          href="/admin/clubhouse"
          className="font-roboto shrink-0 rounded-full border border-accent/25 px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:border-primary/40"
        >
          Back to Clubhouse
        </Link>
      </div>

      {loading ? (
        <div aria-busy="true" aria-live="polite" className="space-y-7">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-accent/12 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-accent/8">
                    <th className="px-5 py-4 text-left">
                      <ShimmerBlock className="h-2.5 w-20" />
                    </th>
                    {staticConfig.columns.map((column) => (
                      <th key={column.key} className="px-5 py-4 text-left">
                        <ShimmerBlock className="h-2.5 w-16" />
                      </th>
                    ))}
                    <th className="px-5 py-4 text-left">
                      <ShimmerBlock className="h-2.5 w-14" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }, (_, index) => (
                    <ServiceRowSkeleton
                      key={index}
                      columnCount={staticConfig.columns.length}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {overview.categories.map((category) => (
              <ClubhouseAreaCategoryCard
                key={category.id}
                category={category}
                active={activeFilter === category.id}
                onSelect={() =>
                  setActiveFilter((current) =>
                    current === category.id ? ALL_FILTER_ID : category.id,
                  )
                }
              />
            ))}
          </div>

          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-copperplate text-[18px] leading-none tracking-[0.06em] uppercase">
                  {staticConfig.listTitle.before ? (
                    <span className="text-foreground">
                      {staticConfig.listTitle.before}
                    </span>
                  ) : null}
                  <span className="text-accent">
                    {staticConfig.listTitle.highlight}
                  </span>
                  {staticConfig.listTitle.after ? (
                    <span className="text-foreground">
                      {staticConfig.listTitle.after}
                    </span>
                  ) : null}
                </h2>
                <p className="font-roboto text-[10px] tracking-[0.12em] text-secondary uppercase">
                  {staticConfig.itemCountLabel(overview.items.length)}
                </p>
              </div>

              <ClubhouseAreaFilterTabs
                tabs={tabs}
                activeId={activeFilter}
                onSelect={setActiveFilter}
              />
            </div>

            <ClubhouseAreaServicesTable
              nameColumnLabel={staticConfig.nameColumnLabel}
              columns={staticConfig.columns}
              rows={filteredRows}
            />
          </section>
        </>
      )}
    </div>
  );
}
