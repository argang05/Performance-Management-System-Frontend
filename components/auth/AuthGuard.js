"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  const publicRoutes = ["/login"];

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
    }

    if (isAuthenticated && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] text-[#111827]">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  const isPublicRoute = publicRoutes.includes(pathname);

  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  if (isAuthenticated && pathname === "/login") {
    return null;
  }

  return children;
}