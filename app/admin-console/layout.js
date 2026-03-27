"use client";

import AppHeader from "@/components/layout/AppHeader";
import AdminTopNav from "@/components/admin/AdminTopNav";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminConsoleLayout({ children }) {
  const { user, loading } = useAuth();

  const isAdminScoringUser = String(user?.employee_number || "") === "100607";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F3F4F6]">
        <AppHeader />
        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <p className="text-sm text-gray-600">Loading admin console...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!isAdminScoringUser) {
    return (
      <main className="min-h-screen bg-[#F3F4F6]">
        <AppHeader />
        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <p className="text-sm font-medium text-red-600">
              You are not authorized to access the admin console.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <AdminTopNav />
        <div>{children}</div>
      </section>
    </main>
  );
}