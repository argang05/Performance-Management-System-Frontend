"use client";

import { useEffect, useState } from "react";

const DEFAULT_FORM = {
  name: "",
  start_date: "",
  end_date: "",
  is_active: false,
};

export default function ReviewCycleFormModal({
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
        name: initialData.name || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        is_active:
          typeof initialData.is_active === "boolean" ? initialData.is_active : false,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [open, initialData]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      name: form.name.trim(),
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.is_active,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
              {mode === "edit" ? "Edit Review Cycle" : "Add Review Cycle"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage active and historical review cycles used in the PMS workflow.
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
              Cycle Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Example: Q1 FY 2026-27"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Start Date
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, start_date: e.target.value }))
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                End Date
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, end_date: e.target.value }))
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                required
              />
            </div>
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
              Mark this cycle active
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
                ? "Update Cycle"
                : "Create Cycle"}
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