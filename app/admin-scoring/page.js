"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

function ScoreBreakdownCard({ scoreData }) {
  if (!scoreData) return null;

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[#111827]">
        Score Result
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Self Scores
          </p>
          <p className="mt-2 text-sm text-[#111827]">
            Behavioural: {scoreData.self_behavioural_score ?? "—"}
          </p>
          <p className="text-sm text-[#111827]">
            Performance: {scoreData.self_performance_score ?? "—"}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#111827]">
            Total: {scoreData.self_score ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            RM Scores
          </p>
          <p className="mt-2 text-sm text-[#111827]">
            Behavioural: {scoreData.rm_behavioural_score ?? "—"}
          </p>
          <p className="text-sm text-[#111827]">
            Performance: {scoreData.rm_performance_score ?? "—"}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#111827]">
            Total: {scoreData.rm_score ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Skip Scores
          </p>
          <p className="mt-2 text-sm text-[#111827]">
            Behavioural: {scoreData.skip_behavioural_score ?? "—"}
          </p>
          <p className="text-sm text-[#111827]">
            Performance: {scoreData.skip_performance_score ?? "—"}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#111827]">
            Total: {scoreData.skip_score ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Peer Scores
          </p>
          <p className="mt-2 text-sm text-[#111827]">
            Behavioural: {scoreData.peer_behavioural_score ?? "—"}
          </p>
          <p className="text-sm text-[#111827]">
            Performance: {scoreData.peer_performance_score ?? "—"}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#111827]">
            Total: {scoreData.peer_score ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Effective Weights Used
          </p>
          <div className="mt-2 space-y-1 text-sm text-[#111827]">
            <p>Self: {scoreData.effective_self_weight ?? "—"}</p>
            <p>RM: {scoreData.effective_rm_weight ?? "—"}</p>
            <p>Skip: {scoreData.effective_skip_weight ?? "—"}</p>
            <p>Peer: {scoreData.effective_peer_weight ?? "—"}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#FFF7F4] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Final Scores
          </p>
          <p className="mt-2 text-sm text-[#111827]">
            System Final Score:{" "}
            <span className="font-semibold">{scoreData.system_final_score ?? "—"}</span>
          </p>
          <p className="text-sm text-[#111827]">
            Effective Final Score:{" "}
            <span className="font-semibold">{scoreData.final_effective_score ?? "—"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminScoringPage() {
  const { user, accessToken, loading: authLoading } = useAuth();

  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [fetchingScore, setFetchingScore] = useState(false);

  const isAdminScoringUser = String(user?.employee_number || "") === "100607";

  useEffect(() => {
    async function loadQuestionnaires() {
      try {
        setLoading(true);

        const res = await fetch("/api/scoring/admin/questionnaires", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load questionnaires.");
        }

        const rows = Array.isArray(data?.results) ? data.results : [];
        setQuestionnaires(rows);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to load scoring console.");
        setQuestionnaires([]);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken && isAdminScoringUser) {
      loadQuestionnaires();
    }
  }, [accessToken, isAdminScoringUser]);

  async function fetchScoreResult(questionnaireId) {
    try {
      setFetchingScore(true);

      const res = await fetch(`/api/scoring/result/${questionnaireId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load score result.");
      }

      setScoreData(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load score result.");
      setScoreData(null);
    } finally {
      setFetchingScore(false);
    }
  }

  async function calculateScore(questionnaireId) {
    try {
      setCalculating(true);

      const res = await fetch(`/api/scoring/calculate/${questionnaireId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to calculate score.");
      }

      toast.success("Score calculated successfully.");
      setScoreData(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to calculate score.");
    } finally {
      setCalculating(false);
    }
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#F3F4F6]">
        <AppHeader />
        <section className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Loading scoring console...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!isAdminScoringUser) {
    return (
      <main className="min-h-screen bg-[#F3F4F6]">
        <AppHeader />
        <section className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-red-600">
              You are not authorized to access this page.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <AppHeader />

      <section className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
            Scoring Console
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Admin scoring view for Module 1 calculation and result verification.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
            Questionnaire Selection
          </h2>

          <div className="space-y-4">
            <select
              value={selectedQuestionnaire?.questionnaire_id || ""}
              onChange={(e) => {
                const selected = questionnaires.find(
                  (q) => String(q.questionnaire_id) === String(e.target.value)
                );
                setSelectedQuestionnaire(selected || null);
                setScoreData(null);
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
            >
              <option value="">Select questionnaire</option>
              {questionnaires.map((q) => (
                <option key={q.questionnaire_id} value={q.questionnaire_id}>
                  {q.employee_name} ({q.employee_number}) • {q.department || "—"} • {q.cycle || "—"}
                </option>
              ))}
            </select>

            {selectedQuestionnaire && (
              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
                <p className="text-sm font-medium text-[#111827]">
                  {selectedQuestionnaire.employee_name} ({selectedQuestionnaire.employee_number})
                </p>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Questionnaire ID: {selectedQuestionnaire.questionnaire_id}</p>
                  <p>Department: {selectedQuestionnaire.department || "—"}</p>
                  <p>Cycle: {selectedQuestionnaire.cycle || "—"}</p>
                  <p>Status: {selectedQuestionnaire.status || "—"}</p>
                  <p>
                    Score Exists: {selectedQuestionnaire.has_score ? "Yes" : "No"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => calculateScore(selectedQuestionnaire.questionnaire_id)}
                    disabled={calculating}
                    className="rounded-xl bg-[#F6490D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {calculating ? "Calculating..." : "Calculate Score"}
                  </button>

                  <button
                    type="button"
                    onClick={() => fetchScoreResult(selectedQuestionnaire.questionnaire_id)}
                    disabled={fetchingScore}
                    className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {fetchingScore ? "Loading..." : "View Score Result"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <ScoreBreakdownCard scoreData={scoreData} />
      </section>
    </main>
  );
}