"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import NineBoxMatrixCard from "@/components/NineBoxMatrixCard";

function FeedbackCard({ section }) {
  const roleLabelMap = {
    self: "Self",
    rm: "Reporting Manager",
    skip: "Skip-Level Manager",
    peer: "Peer Reviewer",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {roleLabelMap[section.role] || section.role}
          </p>
          <p className="mt-1 text-base font-semibold text-[#111827]">
            {section.evaluator_name || "—"}
          </p>
        </div>

        <p className="text-xs text-gray-500">
          {section.submitted_at
            ? new Date(section.submitted_at).toLocaleString()
            : "—"}
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Feedback
          </p>
          <p className="mt-2 text-sm leading-6 text-[#111827]">
            {section.feedback || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Scope of Improvement
          </p>
          <p className="mt-2 text-sm leading-6 text-[#111827]">
            {section.scope_of_improvement || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsResultPage() {
  const { user, accessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadAnalyticsReport() {
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
          setReportData(null);
          return;
        }

        const res = await fetch(
          `/api/scoring/my-analytics/${statusData.questionnaire_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(data?.message || data?.error || "Analytics report not available yet.");
          setReportData(null);
          return;
        }

        setReportData(data);
        setMessage("");
      } catch (error) {
        console.error(error);
        toast.error("Failed to load analytics report.");
        setMessage("Failed to load analytics report.");
        setReportData(null);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadAnalyticsReport();
    }
  }, [accessToken]);

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <AppHeader />

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
            Performance Analytics Report
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Consolidated analytics report including final performance score, PPI,
            final potential score, 9-box placement, and evaluator feedback.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <p className="text-sm text-gray-600">Loading analytics report...</p>
          </div>
        ) : !reportData ? (
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <p className="text-sm text-gray-600">
              {message || "Analytics report is not available yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Employee Name
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#111827]">
                    {reportData.employee_name || user?.full_name || "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Review Cycle
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#111827]">
                    {reportData.review_cycle || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[#111827]">
                Consolidated Score Summary
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Final Consolidated Performance Score
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#111827]">
                    {reportData.performance_score?.final_effective_score ?? "—"}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Out of 10</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Final PPI
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#111827]">
                    {reportData.ppi?.ppi_score ?? "—"}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Out of 10</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FFF7F4] p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Final Consolidated Potential Score
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#111827]">
                    {reportData.potential?.final_potential_score ?? "—"}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Out of 10</p>
                </div>
              </div>
            </div>

            <NineBoxMatrixCard
              data={{
                ...reportData.nine_box,
                employee_name: reportData.employee_name,
                employee_number: reportData.employee_number,
                review_cycle: reportData.review_cycle,
              }}
            />

            <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[#111827]">
                Feedback & Scope of Improvement
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                {reportData.feedback_sections?.length > 0 ? (
                  reportData.feedback_sections.map((section, index) => (
                    <FeedbackCard key={`${section.role}-${index}`} section={section} />
                  ))
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                    <p className="text-sm text-gray-600">No feedback available.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}