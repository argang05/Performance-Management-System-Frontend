"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

function SummaryCard({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-[#F6490D]/15 bg-[#FFF7F4]"
          : "border-gray-200 bg-[#FCFCFD]"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-[#111827]">{value}</p>
    </div>
  );
}

export default function ResetPMSPage() {
  const { accessToken } = useAuth();

  const [employeeNumber, setEmployeeNumber] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [scope, setScope] = useState("cycle");

  const [cycles, setCycles] = useState([]);
  const [loadingCycles, setLoadingCycles] = useState(true);

  const [previewData, setPreviewData] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    async function loadCycles() {
      try {
        setLoadingCycles(true);

        const res = await fetch("/api/admin/cycles/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load review cycles.");
        }

        const results = Array.isArray(data?.results) ? data.results : [];
        setCycles(results);

        if (results.length > 0) {
          const activeCycle = results.find((cycle) => cycle.is_active);
          setCycleId(String(activeCycle?.id || results[0].id));
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to load review cycles.");
        setCycles([]);
      } finally {
        setLoadingCycles(false);
      }
    }

    if (accessToken) {
      loadCycles();
    }
  }, [accessToken]);

  async function handlePreview() {
    if (!employeeNumber.trim()) {
      toast.error("Please enter employee number.");
      return;
    }

    if (scope === "cycle" && !cycleId) {
      toast.error("Please select a review cycle.");
      return;
    }

    try {
      setLoadingPreview(true);
      setPreviewData(null);

      const query = new URLSearchParams({
        employee_number: employeeNumber.trim(),
        ...(scope === "cycle" ? { review_cycle_id: cycleId } : {}),
        ...(scope === "all" ? { scope: "all" } : {}),
      });

      const res = await fetch(`/api/admin/reset/preview?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load reset preview.");
      }

      setPreviewData(data);

      if (data?.safe_to_reset) {
        toast.success("Reset preview loaded successfully.");
      } else {
        toast.warning("Preview loaded, but no resettable PMS data was found.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load reset preview.");
      setPreviewData(null);
    } finally {
      setLoadingPreview(false);
    }
  }

  async function executeReset() {
    try {
      setExecuting(true);

      const res = await fetch("/api/admin/reset/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          employee_number: employeeNumber.trim(),
          review_cycle_id: scope === "cycle" ? cycleId : null,
          scope,
          reason: "Admin reset via console",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || data?.details || "Reset failed.");
      }

      toast.success("PMS reset completed successfully.");

      setPreviewData(null);
      setEmployeeNumber("");

      if (scope === "cycle" && cycles.length > 0) {
        const activeCycle = cycles.find((cycle) => cycle.is_active);
        setCycleId(String(activeCycle?.id || cycles[0].id));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to reset PMS data.");
    } finally {
      setExecuting(false);
    }
  }

  function handleExecute() {
    if (!previewData?.safe_to_reset) {
      toast.error("Nothing is available to reset for this selection.");
      return;
    }

    const resetLabel =
      scope === "all"
        ? `all PMS data for employee ${employeeNumber}`
        : `selected cycle PMS data for employee ${employeeNumber}`;

    toast.warning("Confirm PMS Reset", {
      description: `This will permanently delete ${resetLabel}. This action cannot be undone.`,
      duration: 10000,
      action: {
        label: executing ? "Resetting..." : "Confirm Reset",
        onClick: async () => {
          if (!executing) {
            await executeReset();
          }
        },
      },
    });
  }

  const deleteSummary = previewData?.delete_summary || {};

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
          PMS Reset Console
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Reset employee PMS transaction data safely for testing and authorized
          correction workflows.
        </p>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        ⚠ This tool permanently deletes employee PMS transaction data only. It
        does not delete employee master records, question banks, weightages, or
        configurations.
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
          Reset Selection
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Employee Number
            </label>
            <input
              type="text"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              placeholder="Enter employee number"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Reset Scope
            </label>
            <select
              value={scope}
              onChange={(e) => {
                setScope(e.target.value);
                setPreviewData(null);
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8"
            >
              <option value="cycle">Cycle Reset</option>
              <option value="all">Full Employee PMS Reset</option>
            </select>
          </div>

          {scope === "cycle" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Review Cycle
              </label>
              <select
                value={cycleId}
                onChange={(e) => setCycleId(e.target.value)}
                disabled={loadingCycles}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#F6490D]/25 focus:ring-4 focus:ring-[#F6490D]/8 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {loadingCycles ? (
                  <option value="">Loading review cycles...</option>
                ) : cycles.length === 0 ? (
                  <option value="">No review cycles available</option>
                ) : (
                  cycles.map((cycle) => (
                    <option key={cycle.id} value={cycle.id}>
                      {cycle.name}
                      {cycle.is_active ? " (Active)" : ""}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handlePreview}
              disabled={loadingPreview || (scope === "cycle" && loadingCycles)}
              className="rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingPreview ? "Loading Preview..." : "Preview Reset"}
            </button>

            {previewData && (
              <button
                type="button"
                onClick={handleExecute}
                disabled={!previewData?.safe_to_reset || executing}
                className="rounded-xl bg-[#F6490D] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {executing ? "Resetting..." : "Confirm Reset"}
              </button>
            )}
          </div>
        </div>
      </div>

      {previewData && (
        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
                Reset Preview
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Review the impact carefully before confirming deletion.
              </p>
            </div>

            <div
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                previewData.safe_to_reset
                  ? "bg-[#FFF1EC] text-[#F6490D]"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {previewData.safe_to_reset ? "Safe To Reset" : "Nothing To Reset"}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SummaryCard
              label="Employee Name"
              value={previewData.employee?.full_name || "—"}
            />
            <SummaryCard
              label="Employee Number"
              value={previewData.employee?.employee_number || "—"}
            />
            <SummaryCard
              label="Department"
              value={previewData.employee?.department || "—"}
            />
            <SummaryCard
              label="Scope"
              value={scope === "all" ? "Full Employee PMS Reset" : "Cycle Reset"}
              accent
            />
          </div>

          {previewData.review_cycle && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <SummaryCard
                label="Review Cycle"
                value={previewData.review_cycle?.name || "—"}
              />
              <SummaryCard
                label="Review Cycle ID"
                value={previewData.review_cycle?.id || "—"}
              />
            </div>
          )}

          {previewData.questionnaire && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <SummaryCard
                label="Questionnaire ID"
                value={previewData.questionnaire?.id || "—"}
              />
              <SummaryCard
                label="Questionnaire Status"
                value={previewData.questionnaire?.status || "—"}
              />
            </div>
          )}

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-[#111827]">
              Delete Summary
            </h3>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(deleteSummary).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {key.replaceAll("_", " ")}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#111827]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {previewData.warnings?.length > 0 && (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-800">
                Warnings
              </h3>
              <div className="mt-3 space-y-2 text-sm text-amber-700">
                {previewData.warnings.map((warning, index) => (
                  <p key={index}>• {warning}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}