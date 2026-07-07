import type { InspectionPhoto } from "./types";

type InspectionPhotoEvidenceProps = {
  photos: InspectionPhoto[];
};

export function InspectionPhotoEvidence({
  photos,
}: InspectionPhotoEvidenceProps) {
  return (
    <section className="space-y-3">
      <h3 className="font-roboto text-[10px] tracking-[0.1em] text-section-label uppercase">
        Photo Evidence {photos.length > 0 ? `(${photos.length})` : ""}
      </h3>

      {photos.length === 0 ? (
        <p className="font-roboto rounded-xl border border-dashed border-accent/20 bg-elevated/50 px-4 py-6 text-center text-sm text-secondary">
          No photos yet. Use{" "}
          <span className="text-primary">Take Photo</span> below to add
          evidence.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <a
              key={photo.id}
              href={photo.url}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-xl border border-accent/15 bg-surface"
            >
              <div className="aspect-[4/3] overflow-hidden bg-elevated">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || "Inspection photo evidence"}
                  className="size-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              {(photo.caption || photo.itemKey) && (
                <div className="space-y-0.5 px-3 py-2">
                  {photo.caption ? (
                    <p className="font-roboto truncate text-[11px] text-foreground">
                      {photo.caption}
                    </p>
                  ) : null}
                  {photo.itemKey ? (
                    <p className="font-roboto truncate text-[9px] tracking-[0.08em] text-secondary uppercase">
                      Item {photo.itemKey}
                    </p>
                  ) : null}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
