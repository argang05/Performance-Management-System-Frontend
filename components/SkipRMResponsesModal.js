"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

export default function SkipRMResponsesModal({
  open,
  onClose,
  questionnaireId,
}) {
  const { accessToken } = useAuth();

  const [data, setData] = useState({
    responses: [],
    feedback: "",
    scope_of_improvement: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && questionnaireId && accessToken) {
      load();
    }
  }, [open, questionnaireId, accessToken]);

  async function load() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/evaluations/skip/rm-responses/${questionnaireId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to load RM responses.");
      }

      setData({
        responses: Array.isArray(json?.responses) ? json.responses : [],
        feedback: json?.feedback || "",
        scope_of_improvement: json?.scope_of_improvement || "",
      });
    } catch (error) {
      console.error("Failed to load RM responses:", error);
      toast.error(error.message || "Failed to load RM responses.");
      setData({
        responses: [],
        feedback: "",
        scope_of_improvement: "",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827]">
          Reporting Manager Responses
        </h2>

        {loading ? (
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-[#FCFCFD] p-6">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#F6490D]" />
            <div>
              <p className="text-sm font-semibold text-[#111827]">
                Loading Responses
              </p>
              <p className="text-sm text-gray-500">
                Fetching submitted RM ratings and comments...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {data.responses.length > 0 ? (
                data.responses.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4 shadow-sm"
                  >
                    <p className="text-sm font-medium text-[#111827]">
                      {r.question}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Rating:{" "}
                      <span className="font-semibold text-[#111827]">
                        {r.score}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4 shadow-sm">
                  <p className="text-sm text-gray-600">
                    No RM question-wise scores available.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#111827]">Feedback</p>
              <p className="mt-2 text-sm text-gray-600">
                {data.feedback || "No feedback provided."}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-[#FCFCFD] p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#111827]">
                Scope of Improvement
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {data.scope_of_improvement || "No scope of improvement provided."}
              </p>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-6 rounded-xl bg-[#F6490D] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
        >
          OK
        </button>
      </div>
    </div>
  );
}