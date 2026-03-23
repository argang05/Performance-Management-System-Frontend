"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login({
        employee_number: employeeNumber,
        password,
      });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-4xl font-extrabold text-[#111827]">Employee Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-lg font-semibold text-[#111827]">
              Employee ID
            </label>
            <input
              type="text"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              placeholder="Enter Employee Number"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827] outline-none transition focus:border-[#F6490D] focus:ring-2 focus:ring-[#F6490D]/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-lg font-semibold text-[#111827]">
              Password
            </label>
            <div className="flex items-center rounded-xl border border-gray-300 bg-white pr-3 focus-within:border-[#F6490D] focus-within:ring-2 focus-within:ring-[#F6490D]/20">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full rounded-xl px-4 py-3 text-[#111827] outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-sm font-semibold text-gray-500 hover:text-[#F6490D]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#F6490D] py-3 text-lg font-bold text-white transition hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}