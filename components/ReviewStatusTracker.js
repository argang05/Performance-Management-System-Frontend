"use client";

import { useAuth } from "@/app/context/AuthContext";

const DEFAULT_TRACKER_STEPS = [
  "Self Submitted",
  "Under RM Review",
  "Reviewed by RM",
  "Under Skip Review",
  "Reviewed by Skip Manager",
];

const SM_TRACKER_STEPS = [
  "Self Submitted",
  "Under RM Review",
  "Reviewed by RM",
];

function getCurrentStep(status, skipReviewRequired) {
  if (!skipReviewRequired) {
    switch (status) {
      case "self_submitted":
        return 1;
      case "under_rm_review":
        return 2;
      case "under_peer_review":
        return 2;
      case "rm_reviewed":
        return 3;
      case "completed":
        return 3;
      default:
        return 0;
    }
  }

  switch (status) {
    case "self_submitted":
      return 1;
    case "under_rm_review":
      return 2;
    case "under_peer_review":
      return 2;
    case "rm_reviewed":
      return 3;
    case "under_skip_review":
      return 4;
    case "skip_reviewed":
      return 5;
    case "completed":
      return 5;
    default:
      return 0;
  }
}

export default function ReviewStatusTracker({
  status,
  compact = false,
  skipReviewRequired: skipReviewRequiredProp,
}) {
  const { user } = useAuth();

  const rmBand = String(user?.reporting_manager?.band || "")
    .toUpperCase()
    .trim();

  const derivedSkipReviewRequired = !rmBand.startsWith("SM");

  const skipReviewRequired =
    typeof skipReviewRequiredProp === "boolean"
      ? skipReviewRequiredProp
      : derivedSkipReviewRequired;

  const trackerSteps = skipReviewRequired
    ? DEFAULT_TRACKER_STEPS
    : SM_TRACKER_STEPS;

  const currentStep = getCurrentStep(status, skipReviewRequired);

  const progressPercent =
    currentStep <= 1
      ? 0
      : ((currentStep - 1) / (trackerSteps.length - 1)) * 100;

  return (
    <div
      className={`mt-5 rounded-2xl border border-gray-200 bg-[#FCFCFD] ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="relative">
        <div className="absolute left-[6%] right-[6%] top-4 h-1 rounded-full bg-gray-200" />
        <div
          className="absolute left-[6%] top-4 h-1 rounded-full bg-[#F6490D] transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercent * 0.88}%` }}
        />

        <div className="relative flex items-start justify-between gap-2">
          {trackerSteps.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const isHighlighted = isCompleted || isActive;

            return (
              <div
                key={label}
                className="flex w-full flex-col items-center text-center"
              >
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300",
                    isHighlighted
                      ? "bg-[#F6490D] text-white shadow-[0_6px_18px_rgba(246,73,13,0.28)]"
                      : "bg-gray-300 text-white",
                    isActive ? "scale-110" : "scale-100",
                  ].join(" ")}
                >
                  {stepNumber}
                </div>

                <p className="mt-3 text-[11px] font-medium leading-5 text-gray-600">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}