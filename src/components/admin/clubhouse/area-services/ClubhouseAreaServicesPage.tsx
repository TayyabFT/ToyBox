"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminClubhouseApi } from "@/api/adminClubhouse.api";
import {
  createEmptyAdminClubhouseAreaOverview,
  mapAdminClubhouseAreaOverview,
} from "@/lib/adminClubhouse";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
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
        <p className="font-roboto py-8 text-center text-sm text-secondary">
          Loading…
        </p>
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
