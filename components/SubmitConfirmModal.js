"use client";

export default function SubmitConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Black translucent background */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        
        <h2 className="text-lg font-semibold text-[#111827] mb-2">
          Confirm Submission
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to submit your self evaluation?
          <br />
          <span className="font-medium text-red-500">
            Once submitted, it cannot be updated again.
          </span>
        </p>

        <div className="flex justify-end gap-3">
          
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-[#F6490D] px-4 py-2 text-sm text-white hover:bg-[#e63f07] transition"
          >
            Yes, Submit
          </button>

        </div>
      </div>
    </div>
  );
}