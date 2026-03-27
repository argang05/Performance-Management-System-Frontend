"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function AppHeader() {
  const { user, logout, accessToken } = useAuth();
  const [showAnalyticsLink, setShowAnalyticsLink] = useState(false);

  const isAdminScoringUser = String(user?.employee_number || "") === "100607";

  useEffect(() => {
    async function checkAnalyticsRelease() {
      try {
        if (!accessToken) return;

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
          setShowAnalyticsLink(false);
          return;
        }

        const releaseRes = await fetch(
          `/api/scoring/my-analytics/${statusData.questionnaire_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }
        );

        setShowAnalyticsLink(releaseRes.ok);
      } catch (error) {
        console.error("Failed to check analytics release:", error);
        setShowAnalyticsLink(false);
      }
    }

    checkAnalyticsRelease();
  }, [accessToken]);

  return (
    <header className="w-full bg-[#0B0B0B] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-3xl font-bold tracking-[-0.04em]">
          tor<span className="text-[#F6490D]">.ai</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm font-semibold uppercase tracking-wide">
          <Link href="/profile" className="transition hover:text-[#F6490D]">
            Your Profile
          </Link>

          <Link href="/dashboard" className="transition hover:text-[#F6490D]">
            Dashboard
          </Link>

          {/* <Link href="/questionnaire" className="transition hover:text-[#F6490D]">
            Questionnaire
          </Link> */}

          {showAnalyticsLink && (
            <Link href="/analytics-result" className="transition hover:text-[#F6490D]">
              Analytics Result
            </Link>
          )}

          {isAdminScoringUser && (
            <Link href="/admin-console/dashboard" className="transition hover:text-[#F6490D]">
              Admin Console
            </Link>
          )}

          <button
            onClick={logout}
            className="rounded-xl bg-[#F6490D] px-5 py-2.5 font-semibold text-white transition hover:scale-105 hover:shadow-lg"
          >
            Log Out
          </button>
        </nav>
      </div>

      {user && (
        <div className="border-t border-white/10 px-6 py-2 text-center text-sm text-white/80">
          Logged in as{" "}
          <span className="font-semibold text-white">
            {user.full_name || `${user.first_name} ${user.last_name || ""}`}
          </span>
        </div>
      )}
    </header>
  );
}