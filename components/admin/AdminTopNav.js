"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin-console/dashboard",
  },
  {
    label: "Score & Analytics",
    href: "/admin-console/score-analytics",
  },
  {
    label: "Question Bank",
    href: "/admin-console/questions",
  },
  {
    label: "Potential Questions",
    href: "/admin-console/questions/potential",
  },
  {
    label: "Score Configurations",
    href: "/admin-console/configurations",
  },
  {
    label: "Review Cycles",
    href: "/admin-console/cycles",
  },
  {
    label: "PMS Reset",
    href: "/admin-console/reset-pms",
  },
];

export default function AdminTopNav() {
  const pathname = usePathname();

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          Admin Console
        </p>
        <p className="mt-1 text-sm text-gray-600">
          HR operations, configurations, review controls, and reset tools.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[#FFF1EC] text-[#F6490D]"
                  : "bg-[#FCFCFD] text-[#111827] hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}