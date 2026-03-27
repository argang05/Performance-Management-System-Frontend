"use client";

import { useRef, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-gray-200 py-4 md:grid-cols-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-[#111827]">{value || "—"}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { user, accessToken } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [jdFileUrl, setJdFileUrl] = useState(user?.jd_file_url || "");

  const fileInputRef = useRef(null);

  async function handleJDUpload() {
    if (!selectedFile) {
      toast.error("Please select a JD PDF file first.");
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are allowed.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/employees/jd/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to upload JD.");
      }

      setJdFileUrl(data?.jd_file_url || "");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success(data?.message || "JD uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to upload JD.");
    } finally {
      setUploading(false);
    }
  }

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

          <div className="mt-8 rounded-2xl border border-gray-200 bg-[#FAFAFA] p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#111827]">Job Description (JD)</h2>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">Current JD File</p>

                {jdFileUrl ? (
                  <a
                    href={jdFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-xl border border-[#F6490D] bg-white px-4 py-2 text-sm font-medium text-[#F6490D] transition hover:bg-[#FFF7F4]"
                  >
                    View Current JD PDF
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">No JD uploaded yet.</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Upload / Replace JD PDF
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] file:mr-4 file:rounded-lg file:border-0 file:bg-[#FFF1EC] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#F6490D]"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Upload your latest JD PDF. Uploading a new file will replace the previous one safely.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleJDUpload}
                  disabled={!selectedFile || uploading}
                  className="rounded-xl bg-[#F6490D] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : jdFileUrl ? "Replace JD" : "Upload JD"}
                </button>

                {selectedFile ? (
                  <span className="text-sm text-gray-600">
                    Selected: {selectedFile.name}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

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