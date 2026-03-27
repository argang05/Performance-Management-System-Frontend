"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import ReviewCycleFormModal from "@/components/admin/ReviewCycleFormModal";

function ReviewCycleRow({ item, onEdit, onActivate, activatingId }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-medium text-[#F6490D]">
              Review Cycle
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
            <p>
              <span className="font-medium text-[#111827]">Cycle ID:</span> {item.id}
            </p>
            <p>
              <span className="font-medium text-[#111827]">Start Date:</span>{" "}
              {item.start_date || "—"}
            </p>
            <p>
              <span className="font-medium text-[#111827]">End Date:</span>{" "}
              {item.end_date || "—"}
            </p>
            <p>
              <span className="font-medium text-[#111827]">Status:</span>{" "}
              {item.is_active ? "Active" : "Inactive"}
            </p>
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

export default function AdminReviewCyclesPage() {
  const { accessToken } = useAuth();

  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activatingId, setActivatingId] = useState(null);

  async function loadCycles() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/cycles", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load review cycles.");
      }

      setCycles(Array.isArray(data?.results) ? data.results : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load review cycles.");
      setCycles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (accessToken) {
      loadCycles();
    }
  }, [accessToken]);

  async function handleSubmit(payload) {
    try {
      setSaving(true);

      const url =
        modalMode === "edit" && selectedCycle
          ? `/api/admin/cycles/${selectedCycle.id}`
          : "/api/admin/cycles";

      const method = modalMode === "edit" ? "PUT" : "POST";

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
        throw new Error(data?.error || "Failed to save review cycle.");
      }

      toast.success(
        modalMode === "edit"
          ? "Review cycle updated successfully."
          : "Review cycle created successfully."
      );

      setModalOpen(false);
      setSelectedCycle(null);
      await loadCycles();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save review cycle.");
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate(cycleId) {
    try {
      setActivatingId(cycleId);

      const res = await fetch(`/api/admin/cycles/${cycleId}/activate`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to activate review cycle.");
      }

      toast.success("Review cycle activated successfully.");
      await loadCycles();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to activate review cycle.");
    } finally {
      setActivatingId(null);
    }
  }

  return (
    <>
      <div className="space-y-8">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
                Review Cycles
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage active and historical review cycles used by the performance management system.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setModalMode("create");
                setSelectedCycle(null);
                setModalOpen(true);
              }}
              className="rounded-xl bg-[#F6490D] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
            >
              Add Review Cycle
            </button>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="mb-5">
            <h2 className="text-xl font-semibold tracking-tight text-[#111827]">
              Cycle List
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Activate one cycle at a time and maintain historical cycle records.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
              <p className="text-sm text-gray-600">Loading review cycles...</p>
            </div>
          ) : cycles.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
              <p className="text-sm text-gray-600">No review cycles found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cycles.map((item) => (
                <ReviewCycleRow
                  key={item.id}
                  item={item}
                  onEdit={(cycle) => {
                    setModalMode("edit");
                    setSelectedCycle(cycle);
                    setModalOpen(true);
                  }}
                  onActivate={handleActivate}
                  activatingId={activatingId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ReviewCycleFormModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedCycle}
        saving={saving}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
          setSelectedCycle(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}