"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/app/context/AuthContext";
import ReviewStatusTracker from "@/components/ReviewStatusTracker";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PeerRecommendConfirmModal from "@/components/PeerRecommendConfirmModal";

export default function DashboardPage() {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [statusData, setStatusData] = useState(null);
  const [rmQueue, setRmQueue] = useState([]);
  const [skipQueue, setSkipQueue] = useState([]);
  const [peerQueue, setPeerQueue] = useState([]);
  const [rmPotentialQueue, setRmPotentialQueue] = useState([]);
  const [skipPotentialQueue, setSkipPotentialQueue] = useState([]);

  const [loading, setLoading] = useState(true);
  const [peerQuery, setPeerQuery] = useState("");
  const [peerResults, setPeerResults] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [recommendingPeer, setRecommendingPeer] = useState(false);
  const [confirmPeerOpen, setConfirmPeerOpen] = useState(false);
  const [peerTab, setPeerTab] = useState("pending");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        const [
          statusRes,
          rmQueueRes,
          skipQueueRes,
          peerQueueRes,
          rmPotentialRes,
          skipPotentialRes,
        ] = await Promise.all([
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
          fetch(`/api/evaluations/skip/pending-reviews/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }),
          fetch(`/api/evaluations/peer/pending-reviews/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }),
          fetch(`/api/scoring/potential/rm/pending/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }),
          fetch(`/api/scoring/potential/skip/pending/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }),
        ]);

        const statusJson = await statusRes.json();
        const rmQueueJson = await rmQueueRes.json();
        const skipQueueJson = await skipQueueRes.json();
        const peerQueueJson = await peerQueueRes.json();
        const rmPotentialJson = await rmPotentialRes.json();
        const skipPotentialJson = await skipPotentialRes.json();

        if (statusRes.ok) {
          setStatusData(statusJson);
        } else {
          setStatusData({ exists: false });
        }

        if (rmQueueRes.ok && Array.isArray(rmQueueJson)) {
          setRmQueue(rmQueueJson);
        } else if (rmQueueRes.ok && Array.isArray(rmQueueJson?.results)) {
          setRmQueue(rmQueueJson.results);
        } else {
          setRmQueue([]);
        }

        if (skipQueueRes.ok && Array.isArray(skipQueueJson?.results)) {
          setSkipQueue(skipQueueJson.results);
        } else if (skipQueueRes.ok && Array.isArray(skipQueueJson)) {
          setSkipQueue(skipQueueJson);
        } else {
          setSkipQueue([]);
        }

        if (peerQueueRes.ok && Array.isArray(peerQueueJson?.results)) {
          setPeerQueue(peerQueueJson.results);
        } else if (peerQueueRes.ok && Array.isArray(peerQueueJson)) {
          setPeerQueue(peerQueueJson);
        } else {
          setPeerQueue([]);
        }

        if (rmPotentialRes.ok && Array.isArray(rmPotentialJson?.results)) {
          setRmPotentialQueue(rmPotentialJson.results);
        } else {
          setRmPotentialQueue([]);
        }

        if (skipPotentialRes.ok && Array.isArray(skipPotentialJson?.results)) {
          setSkipPotentialQueue(skipPotentialJson.results);
        } else {
          setSkipPotentialQueue([]);
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
        setStatusData({ exists: false });
        setRmQueue([]);
        setSkipQueue([]);
        setPeerQueue([]);
        setRmPotentialQueue([]);
        setSkipPotentialQueue([]);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadDashboardData();
    }
  }, [accessToken]);

  async function searchPeers(value) {
    setPeerQuery(value);
    setSelectedPeer(null);

    if (value.trim().length < 2) {
      setPeerResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/evaluations/peer/search?q=${encodeURIComponent(value)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to search employees.");
      }

      setPeerResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to search employees.");
      setPeerResults([]);
    }
  }

  async function recommendPeer() {
    if (!selectedPeer || !statusData?.questionnaire_id) return;

    try {
      setRecommendingPeer(true);

      const res = await fetch("/api/evaluations/peer/recommend", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionnaire_id: statusData.questionnaire_id,
          peer_employee_id: selectedPeer.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to recommend peer.");
      }

      toast.success("Peer review request sent successfully.");
      setConfirmPeerOpen(false);

      setStatusData((prev) => ({
        ...prev,
        status: "under_peer_review",
        peer_reviewer: selectedPeer.full_name,
      }));

      setPeerQuery("");
      setPeerResults([]);
      setSelectedPeer(null);

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to recommend peer.");
    } finally {
      setRecommendingPeer(false);
    }
  }

  const showQuestionnaireCard =
    !statusData?.exists || statusData?.status === "draft";

  const showStatusTracker =
    statusData?.exists && statusData?.status && statusData?.status !== "draft";

  const hasActualPeerReviewer =
    !!statusData?.peer_reviewer &&
    String(statusData.peer_reviewer).trim().toLowerCase() !== "not recommended yet";

  const canRecommendPeer =
    showStatusTracker &&
    !!statusData?.questionnaire_id &&
    !hasActualPeerReviewer;

  const pendingPeerReviews = useMemo(
    () => peerQueue.filter((item) => !item.peer_completed),
    [peerQueue]
  );

  const completedPeerReviews = useMemo(
    () => peerQueue.filter((item) => item.peer_completed),
    [peerQueue]
  );

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
                      {hasActualPeerReviewer ? statusData.peer_reviewer : "Not recommended yet"}
                    </p>
                  </div>
                </div>

                <ReviewStatusTracker status={statusData?.status} />

                <div className="mt-6 rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                  <h3 className="text-sm font-semibold text-[#111827]">
                    Peer Recommendation
                  </h3>

                  {!hasActualPeerReviewer ? (
                    <p className="mt-1 text-sm text-gray-600">
                      Search and select any employee for peer questionnaire review.
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-600">
                      {statusData?.status === "under_peer_review"
                        ? "Awaiting review from peer."
                        : "Peer review request has been processed."}
                    </p>
                  )}

                  {canRecommendPeer ? (
                    <div className="mt-4 space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          value={peerQuery}
                          onChange={(e) => searchPeers(e.target.value)}
                          placeholder="Search employee name or employee number"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                        />

                        {peerResults.length > 0 && !selectedPeer && (
                          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                            {peerResults.map((peer) => (
                              <button
                                key={peer.id}
                                type="button"
                                onClick={() => {
                                  setSelectedPeer(peer);
                                  setPeerQuery(`${peer.full_name} (${peer.employee_number})`);
                                  setPeerResults([]);
                                }}
                                className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 last:border-b-0"
                              >
                                <div>
                                  <p className="text-sm font-medium text-[#111827]">
                                    {peer.full_name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {peer.employee_number}
                                    {peer.department ? ` • ${peer.department}` : ""}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={!selectedPeer}
                          onClick={() => setConfirmPeerOpen(true)}
                          className="rounded-xl bg-[#F6490D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Recommend Peer
                        </button>

                        {selectedPeer && (
                          <div className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#111827] shadow-sm">
                            Selected: {selectedPeer.full_name} ({selectedPeer.employee_number})
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                      {hasActualPeerReviewer
                        ? statusData?.status === "under_peer_review"
                          ? "Awaiting Peer Review Completion"
                          : "Peer review request has been processed."
                        : "No peer reviewer has been recommended yet."}
                    </div>
                  )}
                </div>
              </div>
            )}

            {rmQueue.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
                  Team Review (Direct Subordinate) Status
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  {rmQueue.map((item) => {
                    const canReview =
                      item.status === "self_submitted" ||
                      item.status === "under_rm_review";

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
                            {item.status === "draft"
                              ? "NOT SUBMITTED YET"
                              : String(item.status || "").replaceAll("_", " ").toUpperCase()}
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
                          <ReviewStatusTracker
                            status={item.status || "self_submitted"}
                            compact
                          />
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

            {rmPotentialQueue.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
                  RM Potential Questionnaires
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  {rmPotentialQueue.map((item) => (
                    <div
                      key={item.assessment_id}
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
                          {String(item.status || "").replaceAll("_", " ").toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4 space-y-1 text-sm text-gray-600">
                        <p>Department: {item.department}</p>
                        <p>Cycle: {item.cycle}</p>
                        <p>RM Submitted: {item.rm_submitted ? "Yes" : "No"}</p>
                        <p>Skip Submitted: {item.skip_submitted ? "Yes" : "No"}</p>
                      </div>

                      {!item.rm_submitted && (
                        <button
                          onClick={() => router.push(`/potential/rm/${item.assessment_id}`)}
                          className="rounded-xl bg-[#F6490D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
                        >
                          Fill Potential Questionnaire
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skipQueue.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
                  Pending Skip-Level Reviews
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  {skipQueue.map((item) => {
                    const canReview = item.status === "under_skip_review";

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
                            {String(item.status || "").replaceAll("_", " ").toUpperCase()}
                          </span>
                        </div>

                        <div className="mb-4 space-y-1 text-sm text-gray-600">
                          <p>Department: {item.department}</p>
                          <p>
                            Submitted At:{" "}
                            {item.submitted_at
                              ? new Date(item.submitted_at).toLocaleString()
                              : "—"}
                          </p>
                        </div>

                        <div className="mb-4">
                          <ReviewStatusTracker
                            status={item.status || "under_skip_review"}
                            compact
                          />
                        </div>

                        {canReview && (
                          <button
                            onClick={() => router.push(`/skip-review/${item.questionnaire_id}`)}
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

            {skipPotentialQueue.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
                  Skip-Level Potential Questionnaires
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  {skipPotentialQueue.map((item) => (
                    <div
                      key={item.assessment_id}
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
                          {String(item.status || "").replaceAll("_", " ").toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4 space-y-1 text-sm text-gray-600">
                        <p>Department: {item.department}</p>
                        <p>Cycle: {item.cycle}</p>
                        <p>RM Submitted: {item.rm_submitted ? "Yes" : "No"}</p>
                        <p>Skip Submitted: {item.skip_submitted ? "Yes" : "No"}</p>
                      </div>

                      {!item.skip_submitted && item.rm_submitted && (
                        <button
                          onClick={() => router.push(`/potential/skip/${item.assessment_id}`)}
                          className="rounded-xl bg-[#F6490D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
                        >
                          Fill Potential Questionnaire
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {peerQueue.length > 0 && (
              <div className="mt-10">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
                    Peer Review Requests
                  </h2>

                  <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setPeerTab("pending")}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        peerTab === "pending"
                          ? "bg-[#F6490D] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Pending Reviews
                    </button>

                    <button
                      type="button"
                      onClick={() => setPeerTab("completed")}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        peerTab === "completed"
                          ? "bg-[#F6490D] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Completed Reviews
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {(peerTab === "pending" ? pendingPeerReviews : completedPeerReviews).map((item) => (
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
                          {item.peer_completed ? "COMPLETED" : "PENDING"}
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

                      {!item.peer_completed && (
                        <button
                          onClick={() => router.push(`/peer-review/${item.questionnaire_id}`)}
                          className="rounded-xl bg-[#F6490D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
                        >
                          Review Peer Questionnaire
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {peerTab === "pending" && pendingPeerReviews.length === 0 && (
                  <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">No pending peer reviews.</p>
                  </div>
                )}

                {peerTab === "completed" && completedPeerReviews.length === 0 && (
                  <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">No completed peer reviews.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <PeerRecommendConfirmModal
        open={confirmPeerOpen}
        peer={selectedPeer}
        loading={recommendingPeer}
        onCancel={() => setConfirmPeerOpen(false)}
        onConfirm={recommendPeer}
      />
    </main>
  );
}