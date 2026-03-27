"use client";

import { useEffect, useState } from "react";

const DEFAULT_FORM = {
  question_text: "",
  weightage: "1",
  is_active: true,
};

export default function PotentialQuestionFormModal({
  open,
  mode = "create",
  initialData = null,
  saving = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        question_text: initialData.question_text || "",
        weightage:
          initialData.weightage != null ? String(initialData.weightage) : "1",
        is_active:
          typeof initialData.is_active === "boolean" ? initialData.is_active : true,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [open, initialData]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      question_text: form.question_text.trim(),
      weightage: Number(form.weightage),
      is_active: form.is_active,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
              {mode === "edit" ? "Edit Potential Question" : "Add Potential Question"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage questions used in the future readiness and potential assessment engine.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Question Text
            </label>
            <textarea
              value={form.question_text}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, question_text: e.target.value }))
              }
              rows={4}
              placeholder="Enter potential question text"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Weightage
            </label>
            <input
              type="number"
              step="0.01"
              value={form.weightage}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, weightage: e.target.value }))
              }
              placeholder="Enter question weightage"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
              required
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#FCFCFD] px-4 py-3">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, is_active: e.target.checked }))
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-[#111827]">
              Keep this question active
            </span>
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#F6490D] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                ? "Update Question"
                : "Create Question"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}