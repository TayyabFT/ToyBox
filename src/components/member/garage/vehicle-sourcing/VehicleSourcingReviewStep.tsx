import { MemberGarageSourcingReviewIcon } from "@/components/common/Svgs";
import { ReviewRow } from "../shared/requestFormUi";
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
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {formatSourcingMakeModel(form.make, form.model)}
          </span>
        </ReviewRow>

        <ReviewRow label="Category">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {category.label}
          </span>
        </ReviewRow>

        <ReviewRow label="Year">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {formatSourcingYearRange(form.yearFrom, form.yearTo)}
          </span>
        </ReviewRow>

        <ReviewRow label="Budget">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {formatSourcingBudgetReview(form.budget)}
          </span>
        </ReviewRow>

        <ReviewRow label="Colour">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {formatSourcingColourReview(form.preferredColour)}
          </span>
        </ReviewRow>

        <ReviewRow label="Condition">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {condition.title}
          </span>
        </ReviewRow>

        <ReviewRow label="Timeline">
          <span className="font-roboto text-[12px] font-semibold text-foreground">
            {timeline.label}
          </span>
        </ReviewRow>

        <ReviewRow label="Key specs">
          <span className="font-roboto text-[11px] text-secondary">
            {formatSourcingKeySpecs(form.keySpecifications)}
          </span>
        </ReviewRow>
      </div>
    </div>
  );
}
