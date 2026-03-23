"use client";

import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/app/context/AuthContext";
import SubmitConfirmModal from "@/components/SubmitConfirmModal";
import {
  fetchCurrentQuestionnaire,
  saveQuestionnaireDraft,
  submitQuestionnaire,
} from "@/services/questionnaire";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function RatingInput({ value, onChange, disabled }) {
    
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-28 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-[#111827] shadow-sm outline-none transition focus:border-[#F6490D] focus:ring-2 focus:ring-[#F6490D]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
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

function SectionCard({ title, items, responses, setResponses, disabled }) {
  const handleScoreChange = (itemId, score) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: score ? Number(score) : "",
    }));
  };

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
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <p className="mb-1 text-sm font-semibold text-[#111827]">
                  Q{index + 1}. {item.question_text}
                </p>
                {/* <p className="text-xs text-gray-500">
                  Weightage: {item.weightage}
                </p> */}
              </div>

              <RatingInput
                value={responses[item.id]}
                onChange={(score) => handleScoreChange(item.id, score)}
                disabled={disabled}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuestionnairePage() {
  const { accessToken, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [questionnaireId, setQuestionnaireId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [feedback, setFeedback] = useState("");
  const [scopeOfImprovement, setScopeOfImprovement] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function loadQuestionnaire() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCurrentQuestionnaire(accessToken);

        const questionList = data?.questions || [];
        setQuestionnaireId(data?.questionnaire_id || null);
        setQuestions(questionList);

        const initialResponses = {};
        questionList.forEach((q) => {
          initialResponses[q.id] = "";
        });
        setResponses(initialResponses);
      } catch (err) {
        setError(err.message || "Failed to load questionnaire.");
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadQuestionnaire();
    }
  }, [accessToken]);

  const groupedQuestions = useMemo(() => {
    const behavioral = questions.filter((q) => q.category_type === "behavioral");
    const performance = questions.filter((q) => q.category_type === "performance");
  
    return { behavioral, performance };
  }, [questions]);

  const buildPayload = () => ({
    questionnaire_id: questionnaireId,
    feedback,
    scope_of_improvement: scopeOfImprovement,
    responses: Object.entries(responses)
      .filter(([, score]) => score !== "" && score !== null && score !== undefined)
      .map(([itemId, score]) => ({
        item_id: Number(itemId),
        score: Number(score),
      })),
  });

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = buildPayload();
      const data = await saveQuestionnaireDraft(accessToken, payload);

      setSuccess(data?.message || "Draft saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
  
      const unanswered = questions.some((q) => !responses[q.id]);
      if (unanswered) {
        throw new Error("Please answer all questions before final submission.");
      }
  
      if (!feedback.trim()) {
        throw new Error("Please add feedback before submission.");
      }
  
      if (!scopeOfImprovement.trim()) {
        throw new Error("Please add scope of improvement before submission.");
      }
  
      await saveQuestionnaireDraft(accessToken, buildPayload());
  
      const data = await submitQuestionnaire(accessToken, {
        questionnaire_id: questionnaireId,
      });
  
      setSuccess(data?.message || "Questionnaire submitted successfully.");
      setIsSubmitted(true);
  
      toast.success("Questionnaire submitted successfully.");
  
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to submit questionnaire.");
      toast.error(err.message || "Failed to submit questionnaire.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <AppHeader />

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
            Self Questionnaire
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill your self-evaluation form carefully. Once submitted, it will move
            to the next review stage.
          </p>
          {user?.department ? (
            <p className="mt-1 text-sm text-gray-500">
              Department: <span className="font-medium text-[#111827]">{user.department}</span>
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="rounded-[28px] bg-white p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <p className="text-sm text-gray-600">Loading questionnaire...</p>
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            {success ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 shadow-sm">
                {success}
              </div>
            ) : null}

            <SectionCard
              title="Skillset & Behavioural Parameters"
              items={groupedQuestions.behavioral}
              responses={responses}
              setResponses={setResponses}
              disabled={isSubmitted}
            />

            <SectionCard
              title="Performance Parameters"
              items={groupedQuestions.performance}
              responses={responses}
              setResponses={setResponses}
              disabled={isSubmitted}
            />

            <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-[#111827]">
                Self Summary
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111827]">
                    Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    disabled={isSubmitted}
                    placeholder="Write your overall feedback for this review cycle..."
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] shadow-sm outline-none transition focus:border-[#F6490D] focus:ring-2 focus:ring-[#F6490D]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111827]">
                    Scope of Improvement
                  </label>
                  <textarea
                    value={scopeOfImprovement}
                    onChange={(e) => setScopeOfImprovement(e.target.value)}
                    rows={4}
                    disabled={isSubmitted}
                    placeholder="Mention areas where you want to improve further..."
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] shadow-sm outline-none transition focus:border-[#F6490D] focus:ring-2 focus:ring-[#F6490D]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSaveDraft}
                disabled={saving || submitting || isSubmitted}
                className="rounded-2xl border border-[#F6490D] bg-white px-6 py-3 text-sm font-semibold text-[#F6490D] shadow-sm transition hover:scale-[1.01] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Draft"}
              </button>

              <button
                onClick={() => setConfirmOpen(true)}
                disabled={saving || submitting || isSubmitted}
                className="rounded-2xl bg-[#F6490D] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(246,73,13,0.22)] transition hover:scale-[1.01] hover:shadow-[0_16px_30px_rgba(246,73,13,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                {submitting ? "Submitting..." : isSubmitted ? "Submitted" : "Submit Final"}
                </button>
            </div>
          </div>
        )}
        <SubmitConfirmModal
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={() => {
                setConfirmOpen(false);
                handleSubmit();
            }}
            />
      </section>
    </main>
  );
}