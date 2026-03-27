"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import QuestionFormModal from "@/components/admin/QuestionFormModal";

function QuestionRow({ question, onEdit, onDeactivate, deactivatingId }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-medium text-[#F6490D]">
              {question.category?.name || "—"}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {question.category?.category_type || "—"}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                question.is_active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {question.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="text-sm leading-7 text-[#111827]">{question.question_text}</p>

          <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2 xl:grid-cols-3">
            <p>
              <span className="font-medium text-[#111827]">Department:</span>{" "}
              {question.department || "Common"}
            </p>
            <p>
              <span className="font-medium text-[#111827]">Default Weightage:</span>{" "}
              {question.default_weightage}
            </p>
            <p>
              <span className="font-medium text-[#111827]">Question ID:</span>{" "}
              {question.id}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onEdit(question)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDeactivate(question.id)}
            disabled={!question.is_active || deactivatingId === question.id}
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deactivatingId === question.id ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminQuestionsPage() {
  const { accessToken } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);

  async function loadCategories() {
    const res = await fetch("/api/admin/question-categories", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to load categories.");
    }

    setCategories(Array.isArray(data?.results) ? data.results : []);
  }

  async function loadQuestions() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (categoryType) params.set("category_type", categoryType);
      if (activeFilter) params.set("is_active", activeFilter);

      const res = await fetch(`/api/admin/questions?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load questions.");
      }

      setQuestions(Array.isArray(data?.results) ? data.results : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load questions.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function initLoad() {
      try {
        setLoading(true);
        await Promise.all([loadCategories(), loadQuestions()]);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to load question manager.");
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      initLoad();
    }
  }, [accessToken]);

  async function handleFilterSearch() {
    await loadQuestions();
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedQuestion(null);
    setModalOpen(true);
  }

  function openEditModal(question) {
    setModalMode("edit");
    setSelectedQuestion(question);
    setModalOpen(true);
  }

  async function handleSubmit(payload) {
    try {
      setSaving(true);

      const url =
        modalMode === "edit" && selectedQuestion
          ? `/api/admin/questions/${selectedQuestion.id}`
          : "/api/admin/questions";

      const method = modalMode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.question_text?.[0] ||
            data?.category_id?.[0] ||
            "Failed to save question."
        );
      }

      toast.success(
        modalMode === "edit"
          ? "Question updated successfully."
          : "Question created successfully."
      );

      setModalOpen(false);
      setSelectedQuestion(null);
      await loadQuestions();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save question.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(questionId) {
    try {
      setDeactivatingId(questionId);

      const res = await fetch(`/api/admin/questions/${questionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to deactivate question.");
      }

      toast.success("Question deactivated successfully.");
      await loadQuestions();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to deactivate question.");
    } finally {
      setDeactivatingId(null);
    }
  }

  const questionCountLabel = useMemo(() => {
    return `${questions.length} question${questions.length === 1 ? "" : "s"} found`;
  }, [questions]);

  return (
    <>
      <div className="space-y-8">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
                Question Bank
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Add, update, filter, and deactivate behavioural and performance questions.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-xl bg-[#F6490D] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
            >
              Add New Question
            </button>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="mb-5">
            <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
              Filters
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Narrow down questions by text, category type, or active status.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by question text, category, or department"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
            />

            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
            >
              <option value="">All category types</option>
              <option value="behavioral">Behavioral</option>
              <option value="performance">Performance</option>
            </select>

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
            >
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <button
              type="button"
              onClick={handleFilterSearch}
              className="rounded-2xl bg-[#111827] px-5 py-3 text-sm font-medium text-white transition hover:shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
                Questions
              </h2>
              <p className="mt-1 text-sm text-gray-600">{questionCountLabel}</p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
              <p className="text-sm text-gray-600">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
              <p className="text-sm text-gray-600">No questions found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <QuestionRow
                  key={question.id}
                  question={question}
                  onEdit={openEditModal}
                  onDeactivate={handleDeactivate}
                  deactivatingId={deactivatingId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <QuestionFormModal
        open={modalOpen}
        mode={modalMode}
        categories={categories}
        initialData={selectedQuestion}
        saving={saving}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
          setSelectedQuestion(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}