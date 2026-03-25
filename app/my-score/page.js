"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/app/context/AuthContext";

export default function MyScorePage() {
  const { user, accessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMyScore() {
      try {
        setLoading(true);

        const statusRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evaluations/self-review-status/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }
        );

        const statusData = await statusRes.json();

        if (!statusRes.ok || !statusData?.questionnaire_id) {
          setMessage("No questionnaire found for your account.");
          setScoreData(null);
          return;
        }

        const scoreRes = await fetch(
          `/api/scoring/my-score/${statusData.questionnaire_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }
        );

        const scoreJson = await scoreRes.json();

        if (!scoreRes.ok) {
          setMessage(scoreJson?.message || "Your score has not been released yet.");
          setScoreData(null);
          return;
        }

        setScoreData(scoreJson);
        setMessage("");
      } catch (error) {
        console.error("Failed to load employee score:", error);
        setMessage("Failed to load your score.");
        setScoreData(null);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadMyScore();
    }
  }, [accessToken]);

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <AppHeader />

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
            My Performance Score
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View your released performance score for the current review cycle.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <p className="text-sm text-gray-600">Loading your score...</p>
          </div>
        ) : scoreData ? (
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <div className="grid gap-4 rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Employee Name
                </p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">
                  {scoreData.employee_name || user?.full_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Review Cycle
                </p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">
                  {scoreData.review_cycle || "—"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-[#FFF7F4] p-8 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
                Final Performance Score
              </p>
              <p className="mt-4 text-5xl font-bold tracking-tight text-[#111827]">
                {scoreData.final_effective_score ?? "—"}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
              <p className="text-sm text-gray-600">
                This score has been released by HR after final review.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <p className="text-sm text-gray-600">
              {message || "Your score is not available yet."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}