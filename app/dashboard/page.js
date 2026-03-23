"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/app/context/AuthContext";
import ReviewStatusTracker from "@/components/ReviewStatusTracker";
import { useRouter } from "next/navigation";
import SubordinateResponsesModal from "@/components/SubordinateResponsesModal";

export default function DashboardPage() {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [statusData, setStatusData] = useState(null);
  const [rmQueue, setRmQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        const [statusRes, rmQueueRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evaluations/self-review-status/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evaluations/rm/pending-reviews/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }),
        ]);

        const statusJson = await statusRes.json();
        const rmQueueJson = await rmQueueRes.json();

        if (statusRes.ok) {
          setStatusData(statusJson);
        } else {
          setStatusData({ exists: false });
        }

        if (rmQueueRes.ok && Array.isArray(rmQueueJson)) {
          setRmQueue(rmQueueJson);
        } else {
          setRmQueue([]);
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
        setStatusData({ exists: false });
        setRmQueue([]);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadDashboardData();
    }
  }, [accessToken]);

  const showQuestionnaireCard =
    !statusData?.exists || statusData?.status === "draft";

  const showStatusTracker =
    statusData?.exists && statusData?.status && statusData?.status !== "draft";

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <AppHeader />

      <section className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-[#111827]">
          Welcome, {user?.full_name || user?.first_name}
        </h1>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {showQuestionnaireCard && (
              <div className="max-w-md">
                <Link href="/questionnaire">
                  <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h2 className="text-xl font-semibold text-[#111827]">
                        Self Questionnaire
                      </h2>

                      <span className="rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-medium text-[#F6490D]">
                        Active
                      </span>
                    </div>

                    <p className="mb-6 text-sm leading-relaxed text-gray-600">
                      Fill your behavioural and performance self-evaluation form
                      for the current review cycle.
                    </p>

                    <div className="text-sm font-medium text-[#F6490D] transition group-hover:translate-x-1">
                      Open Module →
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {showStatusTracker && (
              <div className="mx-auto max-w-4xl rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
                      Review Progress
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Track the progress of your submitted performance questionnaire.
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-medium text-[#F6490D]">
                    {statusData?.status?.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="grid gap-4 rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Employee Name
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#111827]">
                      {statusData?.employee_name || user?.full_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Department
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#111827]">
                      {statusData?.department || user?.department || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Review Cycle
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#111827]">
                      {statusData?.cycle || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Peer Reviewer
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#111827]">
                      {statusData?.peer_reviewer || "Not recommended yet"}
                    </p>
                  </div>
                </div>

                <ReviewStatusTracker status={statusData?.status} />

                <div className="mt-6 rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                  <h3 className="text-sm font-semibold text-[#111827]">
                    Peer Recommendation
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Peer recommendation will be enabled here. Only one peer can be recommended.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <input
                      type="text"
                      disabled
                      placeholder="Search employee name or employee number"
                      className="min-w-[280px] flex-1 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 outline-none"
                    />

                    <button
                      disabled
                      className="rounded-xl bg-gray-300 px-4 py-2.5 text-sm font-medium text-white"
                    >
                      Recommend Peer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {rmQueue.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
                Team Review Status
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                {rmQueue.map((item) => {
                  const canReview =
                    item.status === "self_submitted" || item.status === "under_rm_review";

                  return (
                    <div
                      key={item.questionnaire_id}
                      className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[#111827]">
                            {item.employee_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Employee No: {item.employee_number}
                          </p>
                        </div>

                        <span className="rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-medium text-[#F6490D]">
                          {item.status == "draft" ? "Not Submitted Yet".toUpperCase() : String(item.status || "").replaceAll("_", " ").toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4 space-y-1 text-sm text-gray-600">
                        <p>Department: {item.department}</p>
                        <p>Cycle: {item.cycle}</p>
                        <p>
                          Submitted At:{" "}
                          {item.submitted_at
                            ? new Date(item.submitted_at).toLocaleString()
                            : "—"}
                        </p>
                      </div>

                      <div className="mb-4">
                        <ReviewStatusTracker status={item.status || "self_submitted"} compact />
                      </div>

                      {canReview && (
                        <button
                          onClick={() => router.push(`/rm-review/${item.questionnaire_id}`)}
                          className="rounded-xl bg-[#F6490D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
                        >
                          Review Questionnaire
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}