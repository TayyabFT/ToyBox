import type { ReactNode } from "react";
import { MemberGarageSourcingReviewIcon } from "@/components/common/Svgs";
import {
  formatSourcingColourReview,
  formatSourcingKeySpecs,
  formatSourcingMakeModel,
  formatSourcingYearRange,
  formatSourcingBudgetReview,
  getSourcingCategory,
  getSourcingCondition,
  getSourcingTimeline,
} from "./sourcingOptions";
import type { VehicleSourcingDetailsFormState } from "./types";

function ReviewSearchIcon() {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/35 bg-primary/10">
      <MemberGarageSourcingReviewIcon className="size-[18px]" />
    </span>
  );
}

function ReviewRow({
  label,
  children,
  valueClassName = "font-roboto text-[12px] font-semibold text-foreground",
}: {
  label: string;
  children: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-accent/8 py-3 last:border-b-0">
      <span className="font-roboto shrink-0 text-[11px] text-secondary">{label}</span>
      <div className={`min-w-0 flex-1 text-right ${valueClassName}`}>{children}</div>
    </div>
  );
}

type VehicleSourcingReviewStepProps = {
  form: VehicleSourcingDetailsFormState;
};

export function VehicleSourcingReviewStep({ form }: VehicleSourcingReviewStepProps) {
  const category = getSourcingCategory(form.category);
  const condition = getSourcingCondition(form.condition);
  const timeline = getSourcingTimeline(form.timeline);

  return (
    <div className="overflow-hidden rounded-2xl border border-accent/12 bg-[#141310]">
      <div className="flex items-center gap-3 border-b border-accent/8 px-4 py-3.5">
        <ReviewSearchIcon />
        <div className="min-w-0">
          <p className="font-roboto text-[12px] font-semibold tracking-[0.06em] text-foreground uppercase">
            Sourcing Brief
          </p>
          <p className="font-roboto mt-0.5 text-[10px] text-secondary">
            Please review before submitting
          </p>
        </div>
      </div>

      <div className="px-4 py-1">
        <ReviewRow label="Make &amp; Model">
          {formatSourcingMakeModel(form.make, form.model)}
        </ReviewRow>

        <ReviewRow label="Category">{category.label}</ReviewRow>

        <ReviewRow label="Year">
          {formatSourcingYearRange(form.yearFrom, form.yearTo)}
        </ReviewRow>

        <ReviewRow label="Budget">
          {formatSourcingBudgetReview(form.budget)}
        </ReviewRow>

        <ReviewRow label="Colour">
          {formatSourcingColourReview(form.preferredColour)}
        </ReviewRow>

        <ReviewRow label="Condition">{condition.title}</ReviewRow>

        <ReviewRow label="Timeline">{timeline.label}</ReviewRow>

        <ReviewRow
          label="Key specs"
          valueClassName="font-roboto text-[11px] text-secondary"
        >
          {formatSourcingKeySpecs(form.keySpecifications)}
        </ReviewRow>
      </div>
    </div>
  );
}
