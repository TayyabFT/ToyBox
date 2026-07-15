"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCommunicationsApi } from "@/api/adminCommunications.api";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import {
  createPlaceholderAudienceSegments,
  mapAudiencePreview,
} from "@/lib/communicationsAudience";
import { mapCommunicationsBulletins } from "@/lib/communicationsBulletins";
import {
  createPlaceholderCommunicationStats,
  mapCommunicationsStats,
} from "@/lib/communicationsStats";
import { BulletinPreview } from "./BulletinPreview";
import { CommunicationsStatsRow } from "./CommunicationsStatsRow";
import { ComposeBulletin } from "./ComposeBulletin";
import type {
  AudienceSegment,
  BulletinDraftPreview,
  CommunicationStatItem,
  RecentBulletin,
} from "./types";

const EMPTY_DRAFT: BulletinDraftPreview = {
  title: "",
  body: "",
  mode: "bulletin",
};

export function CommunicationsPage() {
  useSetAdminPageSubtitle("Communications");

  const [stats, setStats] = useState<CommunicationStatItem[]>(
    createPlaceholderCommunicationStats,
  );
  const [bulletins, setBulletins] = useState<RecentBulletin[]>([]);
  const [draftPreview, setDraftPreview] =
    useState<BulletinDraftPreview>(EMPTY_DRAFT);
  const [audienceSegments, setAudienceSegments] = useState<AudienceSegment[]>(
    createPlaceholderAudienceSegments,
  );
  const [loadingBulletins, setLoadingBulletins] = useState(true);
  const [loadingAudience, setLoadingAudience] = useState(true);

  const loadCommunicationsData = useCallback(async () => {
    setLoadingBulletins(true);
    setLoadingAudience(true);

    try {
      const [statsResponse, bulletinsResponse, audienceResponse] =
        await Promise.all([
          adminCommunicationsApi.getStats(),
          adminCommunicationsApi.getBulletins({ limit: 20, offset: 0 }),
          adminCommunicationsApi.getAudiencePreview(),
        ]);

      setStats(mapCommunicationsStats(statsResponse.data));
      setBulletins(mapCommunicationsBulletins(bulletinsResponse.data.items));
      setAudienceSegments(mapAudiencePreview(audienceResponse.data));
    } catch {
      setStats(createPlaceholderCommunicationStats());
      setBulletins([]);
      setAudienceSegments(createPlaceholderAudienceSegments());
    } finally {
      setLoadingBulletins(false);
      setLoadingAudience(false);
    }
  }, []);

  useEffect(() => {
    void loadCommunicationsData();
  }, [loadCommunicationsData]);

  return (
    <div className="space-y-7 p-8">
      <div>
        <p className="font-roboto text-[10px] tracking-[0.18em] text-accent uppercase">
          — Member Communications
        </p>
        <h1 className="mt-2 font-copperplate text-[36px] leading-none tracking-[0.04em] text-foreground uppercase">
          Communications
        </h1>
      </div>

      <CommunicationsStatsRow stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]">
        <ComposeBulletin
          audienceSegments={audienceSegments}
          loadingAudience={loadingAudience}
          onBulletinCreated={loadCommunicationsData}
          onDraftChange={setDraftPreview}
        />
        <BulletinPreview
          draft={draftPreview}
          bulletins={bulletins}
          loading={loadingBulletins}
        />
      </div>
    </div>
  );
}
