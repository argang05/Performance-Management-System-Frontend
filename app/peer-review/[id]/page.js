"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AppHeader from "@/components/layout/AppHeader";
import PeerSelfResponsesModal from "@/components/PeerSelfResponsesModal";
import { toast } from "sonner";

function RatingInput({ value, onChange }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-28 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-[#111827] shadow-sm outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
    >
      <option value="">Select</option>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>
  );
}

function formatPeerQuestion(text, name) {
  if (!text) return "";

  const target = name || "this employee";

  return text
    .replace(/^On a scale of 1-10,\s*how effectively do I\s+/i, `On a scale of 1-10, how effectively does ${target} `)
    .replace(/^On a scale of 1–10,\s*how effectively do I\s+/i, `On a scale of 1–10, how effectively does ${target} `)
    .replace(/\bdo I\b/gi, `does ${target}`)
    .replace(/\bI\b/g, target)
    .replace(/\bmy\b/gi, `${target}'s`)
    .replace(/\bme\b/gi, target);
}

function QuestionSection({
  title,
  items,
  responses,
  updateScore,
  employeeName,
}) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
          {title}
        </h2>

        <span className="rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-semibold text-[#F6490D]">
          1–10 Rating
        </span>
      </div>

      <div className="space-y-4">
        {items.map((q, index) => (
          <div
            key={q.item_id}
            className="rounded-[24px] bg-[#FCFCFD] p-5 shadow-[0_8px_22px_rgba(0,0,0,0.06)] transition hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]"
          >
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-medium leading-7 text-[#111827]">
                  Q{index + 1}. {formatPeerQuestion(q.question_text, employeeName)}
                </p>
              </div>

              <RatingInput
                value={responses[q.item_id]}
                onChange={(score) => updateScore(q.item_id, score)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PeerReviewPage() {
  const params = useParams();
  const questionnaireId = params?.id;
  const router = useRouter();
  const { accessToken } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [feedback, setFeedback] = useState("");
  const [scope, setScope] = useState("");
  const [selfModalOpen, setSelfModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (!questionnaireId || !accessToken) return;
    loadForm();
  }, [questionnaireId, accessToken]);

  async function loadForm() {
    try {
      const res = await fetch(`/api/evaluations/peer/review-form/${questionnaireId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      console.log("peer review form data =", data);

      if (!res.ok) {
        throw new Error(data?.error || data?.detail || "Failed to load peer review form.");
      }

      const fetchedQuestions = Array.isArray(data?.questions) ? data.questions : [];
      setQuestions(fetchedQuestions);
      console.log("fetchedQuestions =", fetchedQuestions);
      setEmployeeName(data?.employee_name || "");
      setDepartment(data?.department || "");

      const initialResponses = {};
      fetchedQuestions.forEach((q) => {
        initialResponses[q.item_id] = "";
      });
      setResponses(initialResponses);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load peer review form.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  function updateScore(itemId, score) {
    setResponses((prev) => ({
      ...prev,
      [itemId]: score ? Number(score) : "",
    }));
  }

  const groupedQuestions = useMemo(() => {
    const behavioral = questions.filter((q) => {
      const category = String(q.category || "").toLowerCase();
      const categoryType = String(q.category_type || "").toLowerCase();
  
      return (
        categoryType === "behavioral" ||
        category.includes("behavior") ||
        category.includes("behaviour") ||
        category.includes("skillset")
      );
    });
  
    const performance = questions.filter((q) => {
      const category = String(q.category || "").toLowerCase();
      const categoryType = String(q.category_type || "").toLowerCase();
  
      return (
        categoryType === "performance" ||
        category.includes("performance")
      );
    });
  
    const uncategorized = questions.filter(
      (q) => !behavioral.includes(q) && !performance.includes(q)
    );
  
    return {
      behavioral,
      performance,
      uncategorized,
    };
  }, [questions]);

  async function saveDraft() {
    try {
      setSaving(true);

      const res = await fetch("/api/evaluations/peer/save-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          questionnaire_id: questionnaireId,
          responses: Object.entries(responses)
            .filter(([, score]) => score !== "" && score !== null && score !== undefined)
            .map(([item_id, score]) => ({
              item_id,
              score,
            })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save draft");
      }

      toast.success("Draft saved");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  }

  function confirmSubmitReview() {
    const unanswered = questions.some((q) => !responses[q.item_id]);

    if (unanswered) {
      toast.error("Please answer all questions before submission.");
      return;
    }

    if (!feedback.trim()) {
      toast.error("Please add feedback before submission.");
      return;
    }

    if (!scope.trim()) {
      toast.error("Please add scope of improvement before submission.");
      return;
    }

    setConfirmOpen(true);
  }

  async function submitReview() {
    try {
      setSubmitting(true);

      const res = await fetch("/api/evaluations/peer/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          questionnaire_id: questionnaireId,
          responses: Object.entries(responses).map(([item_id, score]) => ({
            item_id,
            score,
          })),
          feedback,
          scope_of_improvement: scope,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit peer review");
      }

      toast.success("Peer review submitted successfully.");

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit peer review");
    } finally {
      setSubmitting(false);
    }
  }

  if (!questionnaireId) {
    return (
      <main className="min-h-screen bg-[#F3F4F6]">
        <AppHeader />
        <section className="mx-auto max-w-5xl px-6 py-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-red-600">Invalid questionnaire id.</p>
          </div>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F3F4F6]">
        <AppHeader />
        <section className="mx-auto max-w-5xl px-6 py-8">
          <div className="rounded-[28px] bg-white p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#F6490D]" />
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">
                  Loading Peer Review Form
                </h2>
                <p className="text-sm text-gray-500">
                  Please wait while we fetch questionnaire details...
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <AppHeader />

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
              Peer Review Questionnaire
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Review the employee self questionnaire and provide your peer rating.
            </p>
            {department ? (
              <p className="mt-1 text-sm text-gray-500">
                Department: <span className="font-medium text-[#111827]">{department}</span>
              </p>
            ) : null}
          </div>

          <button
            onClick={() => setSelfModalOpen(true)}
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
          >
            View Employee Self Responses
          </button>
        </div>

        <div className="space-y-8">
          <QuestionSection
            title="Skillset & Behavioural Parameters"
            items={groupedQuestions.behavioral}
            responses={responses}
            updateScore={updateScore}
            employeeName={employeeName}
          />

          <QuestionSection
            title="Performance Parameters"
            items={groupedQuestions.performance}
            responses={responses}
            updateScore={updateScore}
            employeeName={employeeName}
          />

          {groupedQuestions.uncategorized.length > 0 && (
            <QuestionSection
              title="Additional Parameters"
              items={groupedQuestions.uncategorized}
              responses={responses}
              updateScore={updateScore}
              employeeName={employeeName}
            />
          )}

          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <h2 className="mb-5 text-xl font-semibold tracking-tight text-[#111827]">
              Peer Summary
            </h2>

            <textarea
              placeholder="Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mb-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#111827] shadow-sm outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
            />

            <textarea
              placeholder="Scope of Improvement"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#111827] shadow-sm outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={saveDraft}
              disabled={saving || submitting}
              className="rounded-xl bg-gray-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              onClick={confirmSubmitReview}
              disabled={saving || submitting}
              className="rounded-xl bg-[#F6490D] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </section>

      <PeerSelfResponsesModal
        open={selfModalOpen}
        onClose={() => setSelfModalOpen(false)}
        questionnaireId={questionnaireId}
      />

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h2 className="mb-2 text-lg font-semibold tracking-tight text-[#111827]">
              Confirm Submission
            </h2>

            <p className="mb-6 text-sm leading-6 text-gray-600">
              Are you sure you want to submit this peer review?
              <br />
              <span className="font-medium text-red-500">
                Once submitted, it cannot be edited again.
              </span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-[#111827] transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setConfirmOpen(false);
                  submitReview();
                }}
                className="rounded-xl bg-[#F6490D] px-4 py-2 text-sm font-medium text-white transition hover:shadow-md"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}