"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import NineBoxMatrixCard from "@/components/NineBoxMatrixCard";

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
            HR Override Score:{" "}
            <span className="font-semibold">{scoreData.hr_override_score ?? "—"}</span>
          </p>
          <p className="text-sm text-[#111827]">
            Effective Final Score:{" "}
            <span className="font-semibold">{scoreData.final_effective_score ?? "—"}</span>
          </p>
          <p className="mt-2 text-sm text-[#111827]">
            Released To Employee:{" "}
            <span className="font-semibold">
              {scoreData.is_released_to_employee ? "Yes" : "No"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function AppraisalRecommendationCard({ appraisalData }) {
  if (!appraisalData) return null;

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[#111827]">
        Appraisal Recommendation
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Classification Used
          </p>
          <p className="mt-2 text-lg font-semibold text-[#111827]">
            {appraisalData.box_label ?? "—"}
          </p>
          <div className="mt-3 space-y-2 text-sm text-[#111827]">
            <p>
              PPI Score Used:{" "}
              <span className="font-semibold">{appraisalData.ppi_score_used ?? "—"}</span>
            </p>
            <p>
              Potential Score Used:{" "}
              <span className="font-semibold">{appraisalData.potential_score_used ?? "—"}</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Configured Range
          </p>
          <p className="mt-2 text-lg font-semibold text-[#111827]">
            {appraisalData.min_appraisal_percent ?? "—"}% - {appraisalData.max_appraisal_percent ?? "—"}%
          </p>
          <div className="mt-3 space-y-2 text-sm text-[#111827]">
            <p>
              Suggested Appraisal:{" "}
              <span className="font-semibold">
                {appraisalData.suggested_appraisal_percent ?? "—"}%
              </span>
            </p>
            <p>
              Final Effective Appraisal:{" "}
              <span className="font-semibold">
                {appraisalData.final_effective_appraisal_percent ?? "—"}%
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#F6490D]/15 bg-[#FFF7F4] p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Override Status
        </p>
        <div className="mt-3 space-y-2 text-sm text-[#111827]">
          <p>
            HR Override Percent:{" "}
            <span className="font-semibold">{appraisalData.hr_override_percent ?? "—"}</span>
            {appraisalData.hr_override_percent != null ? "%" : ""}
          </p>
          <p>
            Override Reason:{" "}
            <span className="font-semibold">{appraisalData.override_reason ?? "—"}</span>
          </p>
          <p>
            Overridden By:{" "}
            <span className="font-semibold">{appraisalData.overridden_by ?? "—"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function WorkflowActionCard({
  title,
  description,
  badge,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
  primaryDisabled = false,
  secondaryDisabled = false,
  primaryLoading = false,
  secondaryLoading = false,
}) {
  return (
    <div className="group rounded-2xl bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-[#111827]">{title}</h3>

        {/* {badge && (
          <span className="rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-medium text-[#F6490D]">
            {badge}
          </span>
        )} */}
      </div>

      <p className="mb-6 text-sm leading-relaxed text-gray-600">{description}</p>

            <div className="flex items-center gap-6 text-sm font-medium">
        <button
          onClick={onPrimaryClick}
          disabled={primaryDisabled}
          className="group flex items-center gap-1 text-[#F6490D] transition hover:gap-2 disabled:opacity-40"
        >
          {primaryLoading ? "Processing..." : primaryLabel}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>

        <button
          onClick={onSecondaryClick}
          disabled={secondaryDisabled}
          className="group flex items-center gap-1 text-[#111827] transition hover:gap-2 disabled:opacity-40"
        >
          {secondaryLoading ? "Loading..." : secondaryLabel}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
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

  const [overrideScore, setOverrideScore] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [overriding, setOverriding] = useState(false);
  const [releasing, setReleasing] = useState(false);

  const [ppiData, setPpiData] = useState(null);
  const [calculatingPPI, setCalculatingPPI] = useState(false);
  const [fetchingPPI, setFetchingPPI] = useState(false);

  const [potentialData, setPotentialData] = useState(null);
  const [calculatingPotential, setCalculatingPotential] = useState(false);
  const [fetchingPotential, setFetchingPotential] = useState(false);

  const [nineBoxData, setNineBoxData] = useState(null);
  const [generatingNineBox, setGeneratingNineBox] = useState(false);
  const [fetchingNineBox, setFetchingNineBox] = useState(false);

  const [appraisalData, setAppraisalData] = useState(null);
  const [generatingAppraisal, setGeneratingAppraisal] = useState(false);
  const [fetchingAppraisal, setFetchingAppraisal] = useState(false);
  const [appraisalOverridePercent, setAppraisalOverridePercent] = useState("");
  const [appraisalOverrideReason, setAppraisalOverrideReason] = useState("");
  const [overridingAppraisal, setOverridingAppraisal] = useState(false);
    const [showScoreCard, setShowScoreCard] = useState(false);
  const [showPpiCard, setShowPpiCard] = useState(false);
  const [showPotentialCard, setShowPotentialCard] = useState(false);
  const [showNineBoxCard, setShowNineBoxCard] = useState(false);
  const [showAppraisalCard, setShowAppraisalCard] = useState(false);
  const [analyticsReleaseData, setAnalyticsReleaseData] = useState(null);
  const [fetchingAnalyticsRelease, setFetchingAnalyticsRelease] = useState(false);
  const [updatingAnalyticsRelease, setUpdatingAnalyticsRelease] = useState(false);

  const isAdminScoringUser = String(user?.employee_number || "") === "100607";

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

      setQuestionnaires(Array.isArray(data?.results) ? data.results : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load scoring console.");
      setQuestionnaires([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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
      setOverrideScore(data?.hr_override_score ?? "");
      setOverrideReason(data?.override_reason ?? "");
      setShowScoreCard(true);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load score result.");
      setScoreData(null);
      setOverrideScore("");
      setOverrideReason("");
      setShowScoreCard(false);
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
      setOverrideScore(data?.hr_override_score ?? "");
      setOverrideReason(data?.override_reason ?? "");
      await loadQuestionnaires();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to calculate score.");
    } finally {
      setCalculating(false);
    }
  }

  async function calculatePPI(questionnaireId) {
    try {
      setCalculatingPPI(true);

      const res = await fetch(`/api/scoring/ppi/calculate/${questionnaireId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to calculate PPI.");
      }

      toast.success("PPI calculated successfully.");
      await fetchPPIResult(questionnaireId);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to calculate PPI.");
    } finally {
      setCalculatingPPI(false);
    }
  }

  async function fetchPPIResult(questionnaireId) {
    try {
      setFetchingPPI(true);

      const res = await fetch(`/api/scoring/ppi/result/${questionnaireId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "PPI not calculated yet.");
      }

      setPpiData(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load PPI result.");
    } finally {
      setFetchingPPI(false);
    }
  }

  async function calculatePotential(assessmentId) {
    try {
      setCalculatingPotential(true);

      const res = await fetch(`/api/scoring/potential/calculate/${assessmentId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to calculate potential score.");
      }

      toast.success("Potential score calculated successfully.");
      await fetchPotentialResult(assessmentId);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to calculate potential score.");
    } finally {
      setCalculatingPotential(false);
    }
  }

  async function fetchPotentialResult(assessmentId) {
    try {
      setFetchingPotential(true);

      const res = await fetch(`/api/scoring/potential/result/${assessmentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Potential result not available yet.");
      }

      setPotentialData(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load potential result.");
    } finally {
      setFetchingPotential(false);
    }
  }

  async function generateNineBox(questionnaireId) {
    try {
      setGeneratingNineBox(true);

      const res = await fetch(`/api/scoring/ninebox/generate/${questionnaireId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate 9-box placement.");
      }

      toast.success("9-box placement generated successfully.");
      setNineBoxData(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to generate 9-box placement.");
    } finally {
      setGeneratingNineBox(false);
    }
  }

  async function fetchNineBoxResult(questionnaireId) {
    try {
      setFetchingNineBox(true);

      const res = await fetch(`/api/scoring/ninebox/result/${questionnaireId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "9-box result not available yet.");
      }

      setNineBoxData(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load 9-box result.");
    } finally {
      setFetchingNineBox(false);
    }
  }

  async function generateAppraisal(questionnaireId) {
    try {
      setGeneratingAppraisal(true);

      const res = await fetch(`/api/scoring/appraisal/generate/${questionnaireId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate appraisal recommendation.");
      }

      toast.success("Appraisal recommendation generated successfully.");
      setAppraisalData(data);
      setAppraisalOverridePercent(data?.hr_override_percent ?? "");
      setAppraisalOverrideReason(data?.override_reason ?? "");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to generate appraisal recommendation.");
    } finally {
      setGeneratingAppraisal(false);
    }
  }

  async function fetchAppraisalResult(questionnaireId) {
    try {
      setFetchingAppraisal(true);

      const res = await fetch(`/api/scoring/appraisal/result/${questionnaireId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Appraisal recommendation not available yet.");
      }

      setAppraisalData(data);
      setAppraisalOverridePercent(data?.hr_override_percent ?? "");
      setAppraisalOverrideReason(data?.override_reason ?? "");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load appraisal recommendation.");
    } finally {
      setFetchingAppraisal(false);
    }
  }

  async function applyAppraisalOverride() {
    if (!selectedQuestionnaire?.questionnaire_id) return;

    if (appraisalOverridePercent === "" || !appraisalOverrideReason.trim()) {
      toast.error("Please provide both appraisal override percent and reason.");
      return;
    }

    try {
      setOverridingAppraisal(true);

      const res = await fetch(
        `/api/scoring/appraisal/override/${selectedQuestionnaire.questionnaire_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hr_override_percent: Number(appraisalOverridePercent),
            override_reason: appraisalOverrideReason,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to apply appraisal override.");
      }

      toast.success("Appraisal override applied successfully.");
      await fetchAppraisalResult(selectedQuestionnaire.questionnaire_id);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to apply appraisal override.");
    } finally {
      setOverridingAppraisal(false);
    }
  }

  async function applyOverride() {
    if (!selectedQuestionnaire?.questionnaire_id) return;

    if (overrideScore === "" || !overrideReason.trim()) {
      toast.error("Please provide both override score and reason.");
      return;
    }

    try {
      setOverriding(true);

      const res = await fetch(
        `/api/scoring/override/${selectedQuestionnaire.questionnaire_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hr_override_score: Number(overrideScore),
            override_reason: overrideReason,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to apply override.");
      }

      toast.success("Override applied successfully.");
      await fetchScoreResult(selectedQuestionnaire.questionnaire_id);
      await loadQuestionnaires();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to apply override.");
    } finally {
      setOverriding(false);
    }
  }

  async function updateReleaseStatus(isReleased) {
    if (!selectedQuestionnaire?.questionnaire_id) return;

    try {
      setReleasing(true);

      const res = await fetch(
        `/api/scoring/release/${selectedQuestionnaire.questionnaire_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_released_to_employee: isReleased,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update release status.");
      }

      toast.success(
        isReleased
          ? "Score released to employee successfully."
          : "Score unreleased successfully."
      );

      await fetchScoreResult(selectedQuestionnaire.questionnaire_id);
      await loadQuestionnaires();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update release status.");
    } finally {
      setReleasing(false);
    }
  }

  async function fetchAnalyticsReleaseStatus(questionnaireId) {
    try {
      setFetchingAnalyticsRelease(true);
  
      const res = await fetch(`/api/scoring/analytics-release/${questionnaireId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load analytics release status.");
      }
  
      setAnalyticsReleaseData(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load analytics release status.");
      setAnalyticsReleaseData(null);
    } finally {
      setFetchingAnalyticsRelease(false);
    }
  }
  
  async function updateAnalyticsRelease(questionnaireId, isReleased) {
    try {
      setUpdatingAnalyticsRelease(true);
  
      const res = await fetch(`/api/scoring/analytics-release/toggle/${questionnaireId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_released_to_employee: isReleased,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update analytics release status.");
      }
  
      toast.success(data?.message || "Analytics release status updated.");
      await fetchAnalyticsReleaseStatus(questionnaireId);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update analytics release status.");
    } finally {
      setUpdatingAnalyticsRelease(false);
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

  const selectedAssessmentId = selectedQuestionnaire?.assessment_id || null;
  const hasPotentialAssessment = !!selectedAssessmentId;

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <AppHeader />

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
            Scoring Console
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Admin scoring view for score, PPI, potential, 9-box placement, and appraisal recommendation.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
            Questionnaire Selection
          </h2>

          <div className="space-y-4">
            <select
              value={selectedQuestionnaire?.questionnaire_id || ""}
              onChange={async (e) => {
                const selected = questionnaires.find(
                  (q) => String(q.questionnaire_id) === String(e.target.value)
                );

                setSelectedQuestionnaire(selected || null);
                setScoreData(null);
                setOverrideScore("");
                setOverrideReason("");
                setPpiData(null);
                setPotentialData(null);
                setNineBoxData(null);
                setAppraisalData(null);
                setAppraisalOverridePercent("");
                setAppraisalOverrideReason("");
                setShowScoreCard(false);
                setShowPpiCard(false);
                setShowPotentialCard(false);
                setShowNineBoxCard(false);
                setShowAppraisalCard(false);
                setAnalyticsReleaseData(null);

                if (selected?.questionnaire_id) {
                  await fetchAnalyticsReleaseStatus(selected.questionnaire_id);
                }

                // if (selected?.has_score) {
                //   await fetchScoreResult(selected.questionnaire_id);
                // }
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
                  <p>Score Exists: {selectedQuestionnaire.has_score ? "Yes" : "No"}</p>
                  <p>Potential Assessment ID: {selectedAssessmentId || "Not available yet"}</p>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <WorkflowActionCard
                    title="Score Engine"
                    description="Calculate and inspect the weighted performance score using self, RM, skip, and peer review inputs."
                    badge={scoreData ? "Ready" : "Pending"}
                    primaryLabel={calculating ? "Calculating..." : "Calculate Score"}
                    secondaryLabel={fetchingScore ? "Loading..." : "View Score"}
                    onPrimaryClick={() => calculateScore(selectedQuestionnaire.questionnaire_id)}
                    onSecondaryClick={() => fetchScoreResult(selectedQuestionnaire.questionnaire_id)}
                    primaryDisabled={calculating}
                    secondaryDisabled={fetchingScore}
                    primaryLoading={calculating}
                    secondaryLoading={fetchingScore}
                  />

                  <WorkflowActionCard
                    title="PPI Engine"
                    description="Compute the Past Performance Index using current and previous review cycle score history."
                    badge={ppiData ? "Ready" : "Pending"}
                    primaryLabel={calculatingPPI ? "Calculating..." : "Calculate PPI"}
                    secondaryLabel={fetchingPPI ? "Loading..." : "View PPI"}
                    onPrimaryClick={() => calculatePPI(selectedQuestionnaire.questionnaire_id)}
                    onSecondaryClick={() => fetchPPIResult(selectedQuestionnaire.questionnaire_id)}
                    primaryDisabled={!scoreData || calculatingPPI}
                    secondaryDisabled={fetchingPPI}
                    primaryLoading={calculatingPPI}
                    secondaryLoading={fetchingPPI}
                  />

                  <WorkflowActionCard
                    title="Potential Engine"
                    description="Generate the future-readiness score from RM and skip-level potential questionnaire evaluations."
                    badge={potentialData ? "Ready" : hasPotentialAssessment ? "Available" : "Unavailable"}
                    primaryLabel={calculatingPotential ? "Calculating..." : "Calculate Potential"}
                    secondaryLabel={fetchingPotential ? "Loading..." : "View Potential"}
                    onPrimaryClick={() => calculatePotential(selectedAssessmentId)}
                    onSecondaryClick={() => fetchPotentialResult(selectedAssessmentId)}
                    primaryDisabled={!hasPotentialAssessment || calculatingPotential}
                    secondaryDisabled={!hasPotentialAssessment || fetchingPotential}
                    primaryLoading={calculatingPotential}
                    secondaryLoading={fetchingPotential}
                  />

                  <WorkflowActionCard
                    title="9-Box Matrix"
                    description="Map the employee onto the 9-box talent grid using PPI on X-axis and Potential Score on Y-axis."
                    badge={nineBoxData ? "Ready" : "Pending"}
                    primaryLabel={generatingNineBox ? "Generating..." : "Generate 9-Box"}
                    secondaryLabel={fetchingNineBox ? "Loading..." : "View 9-Box"}
                    onPrimaryClick={() => generateNineBox(selectedQuestionnaire.questionnaire_id)}
                    onSecondaryClick={() => fetchNineBoxResult(selectedQuestionnaire.questionnaire_id)}
                    primaryDisabled={!selectedQuestionnaire?.questionnaire_id || generatingNineBox}
                    secondaryDisabled={!selectedQuestionnaire?.questionnaire_id || fetchingNineBox}
                    primaryLoading={generatingNineBox}
                    secondaryLoading={fetchingNineBox}
                  />

                  <WorkflowActionCard
                    title="Appraisal Engine"
                    description="Generate the recommended appraisal percentage using the employee’s 9-box placement and configured range rules."
                    badge={appraisalData ? "Ready" : "Pending"}
                    primaryLabel={generatingAppraisal ? "Generating..." : "Generate Appraisal"}
                    secondaryLabel={fetchingAppraisal ? "Loading..." : "View Appraisal"}
                    onPrimaryClick={() => generateAppraisal(selectedQuestionnaire.questionnaire_id)}
                    onSecondaryClick={() => fetchAppraisalResult(selectedQuestionnaire.questionnaire_id)}
                    primaryDisabled={!selectedQuestionnaire?.questionnaire_id || generatingAppraisal}
                    secondaryDisabled={!selectedQuestionnaire?.questionnaire_id || fetchingAppraisal}
                    primaryLoading={generatingAppraisal}
                    secondaryLoading={fetchingAppraisal}
                  />
                </div>

                {!hasPotentialAssessment && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Potential admin controls need <span className="font-semibold">assessment_id</span> from the backend admin questionnaire list. Once that field is included in the response, these buttons will work.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
          {selectedQuestionnaire && (
            <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
                Analytics Release Controls
              </h2>

              {!analyticsReleaseData ? (
                <p className="text-sm text-gray-600">
                  {fetchingAnalyticsRelease
                    ? "Loading analytics release status..."
                    : "Analytics release status not loaded."}
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Current Status
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#111827]">
                      {analyticsReleaseData.is_released_to_employee ? "Released" : "Not Released"}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-[#111827]">
                      <p>
                        Ready For Release:{" "}
                        <span className="font-semibold">
                          {analyticsReleaseData.is_ready ? "Yes" : "No"}
                        </span>
                      </p>
                      <p>
                        Released At:{" "}
                        <span className="font-semibold">
                          {analyticsReleaseData.released_at
                            ? new Date(analyticsReleaseData.released_at).toLocaleString()
                            : "—"}
                        </span>
                      </p>
                      <p>
                        Released By:{" "}
                        <span className="font-semibold">
                          {analyticsReleaseData.released_by || "—"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Missing Requirements
                    </p>

                    {analyticsReleaseData.missing_requirements?.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-sm text-[#111827]">
                        {analyticsReleaseData.missing_requirements.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-[#111827]">
                        All required analytics components are available.
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateAnalyticsRelease(selectedQuestionnaire.questionnaire_id, true)
                        }
                        disabled={updatingAnalyticsRelease || !analyticsReleaseData.is_ready}
                        className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingAnalyticsRelease ? "Updating..." : "Release Analytics Data to Employee"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateAnalyticsRelease(selectedQuestionnaire.questionnaire_id, false)
                        }
                        disabled={updatingAnalyticsRelease}
                        className="rounded-xl bg-gray-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingAnalyticsRelease ? "Updating..." : "Unrelease Analytics Data"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        {showScoreCard && scoreData && (
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
              HR Controls
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Override Score
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(e.target.value)}
                  placeholder="Enter override score"
                  className="mb-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                />

                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Override Reason
                </label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Enter override reason"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                />

                <button
                  type="button"
                  onClick={applyOverride}
                  disabled={overriding}
                  className="mt-4 rounded-xl bg-[#F6490D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {overriding ? "Applying..." : "Apply Override"}
                </button>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4" hidden>
                <p className="text-sm font-semibold text-[#111827]">
                  Release Controls
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Current Release Status:{" "}
                  <span className="font-semibold text-[#111827]">
                    {scoreData.is_released_to_employee ? "Released" : "Not Released"}
                  </span>
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => updateReleaseStatus(true)}
                    disabled={releasing}
                    className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {releasing ? "Updating..." : "Release To Employee"}
                  </button>

                  <button
                    type="button"
                    onClick={() => updateReleaseStatus(false)}
                    disabled={releasing}
                    className="rounded-xl bg-gray-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {releasing ? "Updating..." : "Unrelease Score"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showScoreCard && <ScoreBreakdownCard scoreData={scoreData} />}

        {ppiData && (
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[#111827]">
              Past Performance Index (PPI)
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Current Cycle Score
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {ppiData.current_cycle_score ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Previous Cycle Score
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {ppiData.previous_cycle_score_1 ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Older Cycle Score
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {ppiData.previous_cycle_score_2 ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#FFF7F4] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Final PPI Score
                </p>
                <p className="mt-2 text-2xl font-bold text-[#111827]">
                  {ppiData.ppi_score ?? "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {potentialData && (
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[#111827]">
              Potential Score
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  RM Potential Score
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {potentialData.rm_score ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Skip Potential Score
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {potentialData.skip_score ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#FFF7F4] p-4 md:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Final Potential Score
                </p>
                <p className="mt-2 text-2xl font-bold text-[#111827]">
                  {potentialData.final_potential_score ?? "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        <NineBoxMatrixCard data={nineBoxData} />

        {appraisalData && (
          <>
            <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
                Appraisal Override Controls
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4">
                  <label className="mb-2 block text-sm font-semibold text-[#111827]">
                    Appraisal Override Percent
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={appraisalOverridePercent}
                    onChange={(e) => setAppraisalOverridePercent(e.target.value)}
                    placeholder="Enter override appraisal percent"
                    className="mb-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                  />

                  <label className="mb-2 block text-sm font-semibold text-[#111827]">
                    Override Reason
                  </label>
                  <textarea
                    value={appraisalOverrideReason}
                    onChange={(e) => setAppraisalOverrideReason(e.target.value)}
                    placeholder="Enter override reason"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
                  />

                  <button
                    type="button"
                    onClick={applyAppraisalOverride}
                    disabled={overridingAppraisal}
                    className="mt-4 rounded-xl bg-[#F6490D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {overridingAppraisal ? "Applying..." : "Apply Appraisal Override"}
                  </button>
                </div>

                <div className="rounded-2xl border border-[#F6490D]/15 bg-[#FFF7F4] p-4">
                  <p className="text-sm font-semibold text-[#111827]">
                    Recommendation Summary
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-[#111827]">
                    <p>
                      Box Label:{" "}
                      <span className="font-semibold">{appraisalData.box_label ?? "—"}</span>
                    </p>
                    <p>
                      Suggested Appraisal:{" "}
                      <span className="font-semibold">
                        {appraisalData.suggested_appraisal_percent ?? "—"}%
                      </span>
                    </p>
                    <p>
                      Final Effective Appraisal:{" "}
                      <span className="font-semibold">
                        {appraisalData.final_effective_appraisal_percent ?? "—"}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <AppraisalRecommendationCard appraisalData={appraisalData} />
          </>
        )}
      </section>
    </main>
  );
}