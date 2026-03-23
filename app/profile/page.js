"use client";

import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/app/context/AuthContext";

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-gray-200 py-4 md:grid-cols-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-[#111827]">{value || "—"}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <AppHeader />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-extrabold text-[#111827]">Your Profile</h1>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <InfoRow label="Employee Number" value={user?.employee_number} />
          <InfoRow label="Full Name" value={user?.full_name} />
          <InfoRow label="Department" value={user?.department} />
          <InfoRow label="Designation" value={user?.designation} />
          <InfoRow label="Old Designation" value={user?.old_designation} />
          <InfoRow label="Old BU" value={user?.old_bu} />
          <InfoRow label="Band" value={user?.band} />
          <InfoRow label="Date of Joining" value={user?.date_of_joining} />
          <InfoRow label="Experience (Years)" value={user?.experience_years} />
          <InfoRow label="Role" value={user?.role} />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-[#111827]">Reporting Manager</h2>
              <InfoRow label="Name" value={user?.reporting_manager?.full_name} />
              <InfoRow
                label="Employee Number"
                value={user?.reporting_manager?.employee_number}
              />
              <InfoRow label="Department" value={user?.reporting_manager?.department} />
              <InfoRow label="Designation" value={user?.reporting_manager?.designation} />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-[#111827]">Skip Level Manager</h2>
              <InfoRow label="Name" value={user?.skip_level_manager?.full_name} />
              <InfoRow
                label="Employee Number"
                value={user?.skip_level_manager?.employee_number}
              />
              <InfoRow label="Department" value={user?.skip_level_manager?.department} />
              <InfoRow label="Designation" value={user?.skip_level_manager?.designation} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}