import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { ToyBoxLogoMark } from "@/components/common/Svgs";
import type { BulletinDraftPreview, RecentBulletin } from "./types";

function BulletinRowSkeleton() {
  return (
    <li className="rounded-xl border border-accent/20 bg-elevated px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <ShimmerBlock className="h-3 w-32" />
        <ShimmerBlock className="h-2.5 w-10" />
      </div>
      <ShimmerBlock className="mt-2 h-2.5 w-24" />
    </li>
  );
}

type BulletinPreviewProps = {
  draft: BulletinDraftPreview;
  bulletins: RecentBulletin[];
  loading?: boolean;
};

function formatRate(rate: number | null): string {
  return rate == null ? "—" : `${rate}%`;
}

const VISIBLE_RECENT_BULLETINS = 4;
/** Fits ~4 bulletin rows (card + gap). */
const RECENT_BULLETINS_MAX_HEIGHT = "max-h-[308px]";

function BulletinRow({ bulletin }: { bulletin: RecentBulletin }) {
  return (
    <li className="rounded-xl border border-accent/20 bg-elevated px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-copperplate-body text-[12px] font-semibold tracking-[0.08em] text-foreground uppercase">
          {bulletin.title}
        </p>
        <span className="font-copperplate-body shrink-0 text-[10px] tracking-[0.08em] text-secondary">
          {bulletin.time}
        </span>
      </div>

      {bulletin.isDraft ? (
        <p className="mt-1.5 font-copperplate-body text-[10px] tracking-[0.1em] text-accent uppercase">
          Draft · Not sent
        </p>
      ) : (
        <p className="mt-1.5 font-copperplate-body text-[10px] tracking-[0.1em] text-secondary uppercase">
          Open{" "}
          <span className="font-semibold text-accent">
            {formatRate(bulletin.openRate)}
          </span>{" "}
          · Click{" "}
          <span className="font-semibold text-accent">
            {formatRate(bulletin.clickRate)}
          </span>
        </p>
      )}
    </li>
  );
}

function BulletinList({
  bulletins,
  loading,
  emptyLabel,
}: {
  bulletins: RecentBulletin[];
  loading: boolean;
  emptyLabel: string;
}) {
  return (
    <div
      className={`Custom__Scrollbar mt-4 overflow-y-auto pr-1 ${
        !loading && bulletins.length > VISIBLE_RECENT_BULLETINS
          ? RECENT_BULLETINS_MAX_HEIGHT
          : ""
      }`}
    >
      <ul className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }, (_, index) => (
            <BulletinRowSkeleton key={index} />
          ))
        ) : bulletins.length === 0 ? (
          <li className="rounded-xl border border-accent/20 bg-elevated px-4 py-3.5">
            <p className="font-copperplate-body text-[12px] tracking-[0.08em] text-secondary uppercase">
              {emptyLabel}
            </p>
          </li>
        ) : (
          bulletins.map((bulletin) => (
            <BulletinRow key={bulletin.id} bulletin={bulletin} />
          ))
        )}
      </ul>
    </div>
  );
}

function splitPreviewTitle(title: string): { lead: string; accent: string } {
  const trimmed = title.trim();

  if (!trimmed) {
    return { lead: "", accent: "" };
  }

  const separator = " — ";
  const separatorIndex = trimmed.indexOf(separator);

  if (separatorIndex === -1) {
    return { lead: trimmed, accent: "" };
  }

  return {
    lead: trimmed.slice(0, separatorIndex + separator.length),
    accent: trimmed.slice(separatorIndex + separator.length),
  };
}

export function BulletinPreview({
  draft,
  bulletins,
  loading = false,
}: BulletinPreviewProps) {
  const { lead, accent } = splitPreviewTitle(draft.title);
  const previewTitle = draft.title.trim();
  const previewBody = draft.body.trim();

  const sentBulletins = bulletins.filter((bulletin) => !bulletin.isDraft);
  const draftBulletins = bulletins.filter((bulletin) => bulletin.isDraft);
  const showDraftSection = loading || draftBulletins.length > 0;

  return (
    <section className="flex flex-col rounded-2xl border border-accent/20 bg-card p-6">
      <p className="font-copperplate-body text-[10px] tracking-[0.16em] text-secondary uppercase">
        Preview · In-App
      </p>

      <div className="mt-4 rounded-2xl border border-accent/20 bg-surface/60 p-5">
        <div className="flex items-center gap-2.5">
          <ToyBoxLogoMark className="size-[18px]" />
          <span className="font-copperplate-body text-[13px] font-medium tracking-[0.22em] text-foreground uppercase">
            Toy Box
          </span>
          <span className="font-copperplate-body ml-auto text-[10px] tracking-[0.1em] text-secondary lowercase">
            now
          </span>
        </div>

        <h3 className="mt-4 font-copperplate text-[14px] tracking-[0.03em] uppercase">
          {previewTitle ? (
            <>
              <span className="text-foreground">{lead || previewTitle}</span>
              {accent ? <span className="text-accent">{accent}</span> : null}
            </>
          ) : (
            <span className="text-muted">Your bulletin title</span>
          )}
        </h3>

        <p className="mt-2.5 font-copperplate-body line-clamp-4 text-[12px] leading-relaxed tracking-[0.02em] text-secondary">
          {previewBody || "Your bulletin message will appear here as you type."}
        </p>
      </div>

      <p className="mt-7 font-copperplate-body text-[10px] tracking-[0.16em] text-secondary uppercase">
        Recent Bulletins
      </p>

      <BulletinList
        bulletins={sentBulletins}
        loading={loading}
        emptyLabel="No bulletins yet"
      />

      {showDraftSection ? (
        <>
          <p className="mt-7 font-copperplate-body text-[10px] tracking-[0.16em] text-secondary uppercase">
            Draft Bulletins
          </p>

          <BulletinList
            bulletins={draftBulletins}
            loading={loading}
            emptyLabel="No drafts yet"
          />
        </>
      ) : null}
    </section>
  );
}
