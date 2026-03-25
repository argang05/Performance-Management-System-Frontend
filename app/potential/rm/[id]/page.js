"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import PotentialSubmitConfirmModal from "@/components/PotentialSubmitConfirmModal";

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

export default function RMPotentialPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken } = useAuth();

  const assessmentId = params?.id;

  const [formData, setFormData] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function loadForm() {
      try {
        const res = await fetch(`/api/scoring/potential/rm/form/${assessmentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load potential form.");
        }

        setFormData(data);
        setResponses(data?.responses || {});
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to load potential form.");
      } finally {
        setLoading(false);
      }
    }

    if (assessmentId && accessToken) {
      loadForm();
    }
  }, [assessmentId, accessToken]);

  function updateScore(parameterId, score) {
    setResponses((prev) => ({
      ...prev,
      [parameterId]: score ? Number(score) : "",
    }));
  }

  async function saveDraft() {
    try {
      setSaving(true);

      const payload = {
        assessment_id: assessmentId,
        responses: Object.entries(responses)
          .filter(([, score]) => score !== "" && score !== null && score !== undefined)
          .map(([parameter_id, score]) => ({
            parameter_id,
            score,
          })),
      };

      const res = await fetch("/api/scoring/potential/rm/save", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save draft.");
      }

      toast.success("Potential draft saved.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save draft.");
    } finally {
      setSaving(false);
    }
  }

  function handleSubmitClick() {
    const unanswered = formData?.questions?.some((q) => !responses[q.parameter_id]);

    if (unanswered) {
      toast.error("Please answer all questions before submission.");
      return;
    }

    setConfirmOpen(true);
  }

  async function submitForm() {
    try {
      setSubmitting(true);

      const payload = {
        assessment_id: assessmentId,
        responses: Object.entries(responses).map(([parameter_id, score]) => ({
          parameter_id,
          score,
        })),
      };

      const res = await fetch("/api/scoring/potential/rm/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit form.");
      }

      toast.success("RM potential questionnaire submitted.");
      setConfirmOpen(false);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit form.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F3F4F6]">
        <AppHeader />
        <section className="mx-auto max-w-5xl px-6 py-8">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <p className="text-sm text-gray-600">Loading RM potential form...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <AppHeader />

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
            RM Potential Questionnaire
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Assess future readiness for {formData?.employee_name}.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="mb-4 rounded-2xl border border-[#F6490D]/15 bg-[#FFF7F4] px-4 py-3 text-sm text-gray-700">
            Please rate the employee on a scale of <span className="font-semibold text-[#111827]">1–10</span> for the following parameters.
          </div>

          <div className="space-y-4">
            {formData?.questions?.map((q, index) => (
              <div
                key={q.parameter_id}
                className="rounded-[24px] bg-[#FCFCFD] p-5 shadow-[0_8px_22px_rgba(0,0,0,0.06)]"
              >
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-sm font-medium leading-7 text-[#111827]">
                      Q{index + 1}. {q.question_text}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Weightage: {q.weightage}
                    </p>
                  </div>

                  <RatingInput
                    value={responses[q.parameter_id]}
                    onChange={(score) => updateScore(q.parameter_id, score)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={saveDraft}
              disabled={saving || submitting}
              className="rounded-xl bg-gray-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              onClick={handleSubmitClick}
              disabled={saving || submitting}
              className="rounded-xl bg-[#F6490D] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Questionnaire"}
            </button>
          </div>
        </div>
      </section>

      <PotentialSubmitConfirmModal
        open={confirmOpen}
        employeeName={formData?.employee_name}
        evaluatorLabel="RM"
        loading={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={submitForm}
      />
    </main>
  );
}