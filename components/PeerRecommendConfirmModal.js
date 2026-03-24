"use client";

export default function PeerRecommendConfirmModal({
  open,
  peer,
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open || !peer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative z-10 w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <h2 className="mb-2 text-lg font-semibold tracking-tight text-[#111827]">
          Confirm Peer Recommendation
        </h2>

        <p className="mb-6 text-sm leading-6 text-gray-600">
          Are you sure you want to send this questionnaire to{" "}
          <span className="font-semibold text-[#111827]">
            {peer.full_name}
          </span>{" "}
          for peer review?
        </p>

        <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
          <p className="text-sm font-medium text-[#111827]">{peer.full_name}</p>
          <p className="mt-1 text-xs text-gray-500">
            {peer.employee_number} • {peer.department || "—"}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-[#111827] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-[#F6490D] px-4 py-2 text-sm font-medium text-white transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Yes, Send"}
          </button>
        </div>
      </div>
    </div>
  );
}