"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/login/actions";

const TABS = [
  { href: "/dashboard", label: "Home" },
  { href: "/create", label: "Create Website" },
];

export default function AppNav({ userName }: { userName?: string }) {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-1 px-6 sm:px-10">
        <div className="flex items-center gap-1">
          {TABS.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {userName && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>
              Logged in as <span className="font-medium text-gray-900">{userName}</span>
            </span>
            <form action={logoutAction}>
              <button type="submit" className="font-medium text-gray-500 hover:text-gray-900">
                Log out
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
