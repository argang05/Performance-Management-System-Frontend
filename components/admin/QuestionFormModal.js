"use client";

import { useEffect, useState } from "react";

const DEFAULT_FORM = {
  question_text: "",
  category_id: "",
  department: "",
  default_weightage: "1",
  is_active: true,
};

export default function QuestionFormModal({
  open,
  mode = "create",
  categories = [],
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
        category_id: initialData.category?.id ? String(initialData.category.id) : "",
        department: initialData.department || "",
        default_weightage:
          initialData.default_weightage != null
            ? String(initialData.default_weightage)
            : "1",
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
      category_id: Number(form.category_id),
      department: form.department.trim() || null,
      default_weightage: Number(form.default_weightage),
      is_active: form.is_active,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
              {mode === "edit" ? "Edit Question" : "Add New Question"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage behavioural and performance questions used in employee questionnaires.
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
              placeholder="Enter question text"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Category
              </label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category_id: e.target.value }))
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.category_type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Default Weightage
              </label>
              <input
                type="number"
                step="0.01"
                value={form.default_weightage}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    default_weightage: e.target.value,
                  }))
                }
                placeholder="Enter default weightage"
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Department
            </label>
            <input
              type="text"
              value={form.department}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, department: e.target.value }))
              }
              placeholder="Leave blank for common behavioural questions"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
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