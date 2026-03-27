"use client";

import { useEffect, useState } from "react";

const DEFAULT_FORM = {
  name: "",
  behavioural_weight: "0.40",
  performance_weight: "0.60",
  self_weight: "0.10",
  rm_weight: "0.50",
  skip_weight: "0.25",
  peer_weight: "0.15",
  is_active: false,
};

export default function ScoreConfigFormModal({
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
        behavioural_weight:
          initialData.behavioural_weight != null
            ? String(initialData.behavioural_weight)
            : "0.40",
        performance_weight:
          initialData.performance_weight != null
            ? String(initialData.performance_weight)
            : "0.60",
        self_weight:
          initialData.self_weight != null ? String(initialData.self_weight) : "0.10",
        rm_weight:
          initialData.rm_weight != null ? String(initialData.rm_weight) : "0.50",
        skip_weight:
          initialData.skip_weight != null ? String(initialData.skip_weight) : "0.25",
        peer_weight:
          initialData.peer_weight != null ? String(initialData.peer_weight) : "0.15",
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
      behavioural_weight: Number(form.behavioural_weight),
      performance_weight: Number(form.performance_weight),
      self_weight: Number(form.self_weight),
      rm_weight: Number(form.rm_weight),
      skip_weight: Number(form.skip_weight),
      peer_weight: Number(form.peer_weight),
      is_active: form.is_active,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
              {mode === "edit" ? "Edit Score Configuration" : "Add Score Configuration"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage category and evaluator contribution weights for the score engine.
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
              Configuration Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter configuration name"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Behavioural Weight
              </label>
              <input
                type="number"
                step="0.01"
                value={form.behavioural_weight}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, behavioural_weight: e.target.value }))
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Performance Weight
              </label>
              <input
                type="number"
                step="0.01"
                value={form.performance_weight}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, performance_weight: e.target.value }))
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Self Weight
              </label>
              <input
                type="number"
                step="0.01"
                value={form.self_weight}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, self_weight: e.target.value }))
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                RM Weight
              </label>
              <input
                type="number"
                step="0.01"
                value={form.rm_weight}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, rm_weight: e.target.value }))
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Skip Weight
              </label>
              <input
                type="number"
                step="0.01"
                value={form.skip_weight}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, skip_weight: e.target.value }))
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Peer Weight
              </label>
              <input
                type="number"
                step="0.01"
                value={form.peer_weight}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, peer_weight: e.target.value }))
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
              Mark this configuration active
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
                ? "Update Configuration"
                : "Create Configuration"}
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