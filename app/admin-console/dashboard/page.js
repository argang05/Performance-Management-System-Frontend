"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

function StatCard({ title, value, subtle = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        subtle
          ? "border-gray-200 bg-[#FCFCFD]"
          : "border-[#F6490D]/10 bg-[#FFF7F4]"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {title}
      </p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">
        {value ?? 0}
      </p>
    </div>
  );
}

export default function AdminConsoleDashboardPage() {
  const { accessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
    
        const res = await fetch("/api/admin/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });
    
        const data = await res.json();
    
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load dashboard.");
        }
    
        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard load error:", error);
        toast.error(error.message || "Failed to load dashboard.");
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadDashboard();
    }
  }, [accessToken]);

  if (loading) {
    return (
      <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <p className="text-sm text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <p className="text-sm text-gray-600">Dashboard data not available.</p>
      </div>
    );
  }

  const questionnaireProgress = dashboardData.questionnaire_progress || {};
  const scoreEngine = dashboardData.score_engine || {};
  const analyticsRelease = dashboardData.analytics_release || {};

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of review progress, scoring engine execution, and analytics release.
        </p>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
            Questionnaire Progress
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Current distribution of employee questionnaires across review stages.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Questionnaires" value={questionnaireProgress.total} />
          <StatCard title="Draft" value={questionnaireProgress.draft} subtle />
          <StatCard title="Self Submitted" value={questionnaireProgress.self_submitted} subtle />
          <StatCard title="Under RM Review" value={questionnaireProgress.under_rm_review} subtle />
          <StatCard title="Under Skip Review" value={questionnaireProgress.under_skip_review} subtle />
          <StatCard title="Under Peer Review" value={questionnaireProgress.under_peer_review} subtle />
          <StatCard title="Completed" value={questionnaireProgress.completed} />
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
            Score Engine Progress
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Snapshot of downstream scoring and analytics generation coverage.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Scores Generated" value={scoreEngine.scores_generated} subtle />
          <StatCard title="PPI Generated" value={scoreEngine.ppi_generated} subtle />
          <StatCard title="Potential Generated" value={scoreEngine.potential_generated} subtle />
          <StatCard title="9-Box Generated" value={scoreEngine.ninebox_generated} subtle />
          <StatCard title="Appraisal Generated" value={scoreEngine.appraisal_generated} />
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
            Analytics Release Status
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Employee-facing analytics release overview for the active review population.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-[#FFF7F4] p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Released
              </p>
              <p className="mt-3 text-3xl font-bold text-[#111827]">
                {dashboardData?.analytics_release?.released ?? 0}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Ready But Not Released
              </p>
              <p className="mt-3 text-3xl font-bold text-[#111827]">
                {dashboardData?.analytics_release?.ready_not_released ?? 0}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Not Ready Yet
              </p>
              <p className="mt-3 text-3xl font-bold text-[#111827]">
                {dashboardData?.analytics_release?.not_ready ?? 0}
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}