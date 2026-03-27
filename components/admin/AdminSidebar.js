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
    label: "Configurations",
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

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit w-full rounded-[28px] bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)] lg:w-72">
      <div className="mb-4 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          Admin Console
        </p>
        <p className="mt-1 text-sm text-gray-600">
          HR operations, configurations, review controls, and reset tools.
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#FFF1EC] text-[#F6490D]"
                  : "text-[#111827] hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}