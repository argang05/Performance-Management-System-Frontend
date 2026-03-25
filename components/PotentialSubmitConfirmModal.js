"use client";

export default function PotentialSubmitConfirmModal({
  open,
  employeeName,
  evaluatorLabel,
  loading,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
            Submit Potential Questionnaire?
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            You are about to submit the <span className="font-semibold text-[#111827]">{evaluatorLabel}</span>{" "}
            potential questionnaire for{" "}
            <span className="font-semibold text-[#111827]">{employeeName || "this employee"}</span>.
            After submission, this assessment will be treated as final.
          </p>
        </div>

        <div className="rounded-2xl border border-[#F6490D]/20 bg-[#FFF7F4] px-4 py-3 text-sm text-[#9A3412]">
          Please make sure all ratings are correct before continuing.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-[#F6490D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Yes, Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}