"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import ScoreConfigFormModal from "@/components/admin/ScoreConfigFormModal";
import PotentialConfigFormModal from "@/components/admin/PotentialConfigFormModal";
import AppraisalConfigFormModal from "@/components/admin/AppraisalConfigFormModal";

function SectionHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[#111827]">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>

      <button
        type="button"
        onClick={onAction}
        className="rounded-xl bg-[#F6490D] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function ScoreConfigRow({ item, onEdit, onActivate, activatingId }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-medium text-[#F6490D]">
              Score Config
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                item.is_active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="text-base font-semibold text-[#111827]">{item.name}</p>

          <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2 xl:grid-cols-4">
            <p><span className="font-medium text-[#111827]">Behavioural:</span> {item.behavioural_weight}</p>
            <p><span className="font-medium text-[#111827]">Performance:</span> {item.performance_weight}</p>
            <p><span className="font-medium text-[#111827]">Self:</span> {item.self_weight}</p>
            <p><span className="font-medium text-[#111827]">RM:</span> {item.rm_weight}</p>
            <p><span className="font-medium text-[#111827]">Skip:</span> {item.skip_weight}</p>
            <p><span className="font-medium text-[#111827]">Peer:</span> {item.peer_weight}</p>
            <p><span className="font-medium text-[#111827]">Created:</span> {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onActivate(item.id)}
            disabled={item.is_active || activatingId === item.id}
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {activatingId === item.id ? "Activating..." : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PotentialConfigRow({ item, onEdit, onActivate, activatingId }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-medium text-[#F6490D]">
              Potential Config
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                item.is_active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="text-base font-semibold text-[#111827]">{item.name}</p>

          <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2 xl:grid-cols-3">
            <p><span className="font-medium text-[#111827]">RM Weight:</span> {item.rm_weight}</p>
            <p><span className="font-medium text-[#111827]">Skip Weight:</span> {item.skip_weight}</p>
            <p><span className="font-medium text-[#111827]">Created:</span> {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onActivate(item.id)}
            disabled={item.is_active || activatingId === item.id}
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {activatingId === item.id ? "Activating..." : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppraisalConfigRow({ item, onEdit }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-medium text-[#F6490D]">
              Appraisal Config
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                item.is_active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="text-base font-semibold text-[#111827]">{item.box_label}</p>

          <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2 xl:grid-cols-4">
            <p><span className="font-medium text-[#111827]">Min %:</span> {item.min_percent}</p>
            <p><span className="font-medium text-[#111827]">Max %:</span> {item.max_percent}</p>
            <p><span className="font-medium text-[#111827]">Created:</span> {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}</p>
            <p><span className="font-medium text-[#111827]">Updated:</span> {item.updated_at ? new Date(item.updated_at).toLocaleString() : "—"}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-gray-50"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminConfigurationsPage() {
  const { accessToken } = useAuth();

  const [scoreConfigs, setScoreConfigs] = useState([]);
  const [potentialConfigs, setPotentialConfigs] = useState([]);
  const [appraisalConfigs, setAppraisalConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [scoreModalMode, setScoreModalMode] = useState("create");
  const [selectedScoreConfig, setSelectedScoreConfig] = useState(null);
  const [savingScore, setSavingScore] = useState(false);
  const [activatingScoreId, setActivatingScoreId] = useState(null);

  const [potentialModalOpen, setPotentialModalOpen] = useState(false);
  const [potentialModalMode, setPotentialModalMode] = useState("create");
  const [selectedPotentialConfig, setSelectedPotentialConfig] = useState(null);
  const [savingPotential, setSavingPotential] = useState(false);
  const [activatingPotentialId, setActivatingPotentialId] = useState(null);

  const [appraisalModalOpen, setAppraisalModalOpen] = useState(false);
  const [appraisalModalMode, setAppraisalModalMode] = useState("create");
  const [selectedAppraisalConfig, setSelectedAppraisalConfig] = useState(null);
  const [savingAppraisal, setSavingAppraisal] = useState(false);

  async function loadAllConfigs() {
    try {
      setLoading(true);

      const [scoreRes, potentialRes, appraisalRes] = await Promise.all([
        fetch("/api/admin/config/score", {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        }),
        fetch("/api/admin/config/potential", {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        }),
        fetch("/api/admin/config/appraisal", {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        }),
      ]);

      const scoreData = await scoreRes.json();
      const potentialData = await potentialRes.json();
      const appraisalData = await appraisalRes.json();

      if (!scoreRes.ok) {
        throw new Error(scoreData?.error || "Failed to load score configurations.");
      }
      if (!potentialRes.ok) {
        throw new Error(potentialData?.error || "Failed to load potential configurations.");
      }
      if (!appraisalRes.ok) {
        throw new Error(appraisalData?.error || "Failed to load appraisal configurations.");
      }

      setScoreConfigs(Array.isArray(scoreData?.results) ? scoreData.results : []);
      setPotentialConfigs(Array.isArray(potentialData?.results) ? potentialData.results : []);
      setAppraisalConfigs(Array.isArray(appraisalData?.results) ? appraisalData.results : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load configurations.");
      setScoreConfigs([]);
      setPotentialConfigs([]);
      setAppraisalConfigs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (accessToken) {
      loadAllConfigs();
    }
  }, [accessToken]);

  async function handleScoreSubmit(payload) {
    try {
      setSavingScore(true);

      const url =
        scoreModalMode === "edit" && selectedScoreConfig
          ? `/api/admin/config/score/${selectedScoreConfig.id}`
          : "/api/admin/config/score";

      const method = scoreModalMode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save score configuration.");
      }

      toast.success(
        scoreModalMode === "edit"
          ? "Score configuration updated successfully."
          : "Score configuration created successfully."
      );

      setScoreModalOpen(false);
      setSelectedScoreConfig(null);
      await loadAllConfigs();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save score configuration.");
    } finally {
      setSavingScore(false);
    }
  }

  async function handlePotentialSubmit(payload) {
    try {
      setSavingPotential(true);

      const url =
        potentialModalMode === "edit" && selectedPotentialConfig
          ? `/api/admin/config/potential/${selectedPotentialConfig.id}`
          : "/api/admin/config/potential";

      const method = potentialModalMode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save potential configuration.");
      }

      toast.success(
        potentialModalMode === "edit"
          ? "Potential configuration updated successfully."
          : "Potential configuration created successfully."
      );

      setPotentialModalOpen(false);
      setSelectedPotentialConfig(null);
      await loadAllConfigs();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save potential configuration.");
    } finally {
      setSavingPotential(false);
    }
  }

  async function handleAppraisalSubmit(payload) {
    try {
      setSavingAppraisal(true);

      const url =
        appraisalModalMode === "edit" && selectedAppraisalConfig
          ? `/api/admin/config/appraisal/${selectedAppraisalConfig.id}`
          : "/api/admin/config/appraisal";

      const method = appraisalModalMode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save appraisal configuration.");
      }

      toast.success(
        appraisalModalMode === "edit"
          ? "Appraisal configuration updated successfully."
          : "Appraisal configuration created successfully."
      );

      setAppraisalModalOpen(false);
      setSelectedAppraisalConfig(null);
      await loadAllConfigs();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save appraisal configuration.");
    } finally {
      setSavingAppraisal(false);
    }
  }

  async function handleActivateScore(configId) {
    try {
      setActivatingScoreId(configId);

      const res = await fetch(`/api/admin/config/score/${configId}/activate`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to activate score configuration.");
      }

      toast.success("Score configuration activated successfully.");
      await loadAllConfigs();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to activate score configuration.");
    } finally {
      setActivatingScoreId(null);
    }
  }

  async function handleActivatePotential(configId) {
    try {
      setActivatingPotentialId(configId);

      const res = await fetch(`/api/admin/config/potential/${configId}/activate`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to activate potential configuration.");
      }

      toast.success("Potential configuration activated successfully.");
      await loadAllConfigs();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to activate potential configuration.");
    } finally {
      setActivatingPotentialId(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <p className="text-sm text-gray-600">Loading configurations...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
            Configurations
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage score, potential, and appraisal engine configuration settings.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <SectionHeader
            title="Score Configurations"
            description="Configure behavioural/performance category weights and self/RM/skip/peer contribution weights."
            actionLabel="Add Score Config"
            onAction={() => {
              setScoreModalMode("create");
              setSelectedScoreConfig(null);
              setScoreModalOpen(true);
            }}
          />

          <div className="space-y-4">
            {scoreConfigs.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                <p className="text-sm text-gray-600">No score configurations found.</p>
              </div>
            ) : (
              scoreConfigs.map((item) => (
                <ScoreConfigRow
                  key={item.id}
                  item={item}
                  onEdit={(config) => {
                    setScoreModalMode("edit");
                    setSelectedScoreConfig(config);
                    setScoreModalOpen(true);
                  }}
                  onActivate={handleActivateScore}
                  activatingId={activatingScoreId}
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <SectionHeader
            title="Potential Configurations"
            description="Configure contribution weights for RM and skip-level potential evaluation."
            actionLabel="Add Potential Config"
            onAction={() => {
              setPotentialModalMode("create");
              setSelectedPotentialConfig(null);
              setPotentialModalOpen(true);
            }}
          />

          <div className="space-y-4">
            {potentialConfigs.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                <p className="text-sm text-gray-600">No potential configurations found.</p>
              </div>
            ) : (
              potentialConfigs.map((item) => (
                <PotentialConfigRow
                  key={item.id}
                  item={item}
                  onEdit={(config) => {
                    setPotentialModalMode("edit");
                    setSelectedPotentialConfig(config);
                    setPotentialModalOpen(true);
                  }}
                  onActivate={handleActivatePotential}
                  activatingId={activatingPotentialId}
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <SectionHeader
            title="Appraisal Configurations"
            description="Manage min and max appraisal percentage bands mapped to 9-box labels."
            actionLabel="Add Appraisal Config"
            onAction={() => {
              setAppraisalModalMode("create");
              setSelectedAppraisalConfig(null);
              setAppraisalModalOpen(true);
            }}
          />

          <div className="space-y-4">
            {appraisalConfigs.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
                <p className="text-sm text-gray-600">No appraisal configurations found.</p>
              </div>
            ) : (
              appraisalConfigs.map((item) => (
                <AppraisalConfigRow
                  key={item.id}
                  item={item}
                  onEdit={(config) => {
                    setAppraisalModalMode("edit");
                    setSelectedAppraisalConfig(config);
                    setAppraisalModalOpen(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ScoreConfigFormModal
        open={scoreModalOpen}
        mode={scoreModalMode}
        initialData={selectedScoreConfig}
        saving={savingScore}
        onClose={() => {
          if (savingScore) return;
          setScoreModalOpen(false);
          setSelectedScoreConfig(null);
        }}
        onSubmit={handleScoreSubmit}
      />

      <PotentialConfigFormModal
        open={potentialModalOpen}
        mode={potentialModalMode}
        initialData={selectedPotentialConfig}
        saving={savingPotential}
        onClose={() => {
          if (savingPotential) return;
          setPotentialModalOpen(false);
          setSelectedPotentialConfig(null);
        }}
        onSubmit={handlePotentialSubmit}
      />

      <AppraisalConfigFormModal
        open={appraisalModalOpen}
        mode={appraisalModalMode}
        initialData={selectedAppraisalConfig}
        saving={savingAppraisal}
        onClose={() => {
          if (savingAppraisal) return;
          setAppraisalModalOpen(false);
          setSelectedAppraisalConfig(null);
        }}
        onSubmit={handleAppraisalSubmit}
      />
    </>
  );
}