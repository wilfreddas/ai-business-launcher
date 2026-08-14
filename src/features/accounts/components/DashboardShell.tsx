import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  /** Business name, shown as a small "back to site" link. */
  siteName: string;
  slug: string;
  title: string;
  subtitle: string;
  roleLabel: string;
  logoutAction: () => void;
  children: ReactNode;
}

/**
 * Shared page frame for the business portal and customer account pages --
 * was previously the same header JSX copy-pasted into both page files. One
 * component now owns the sticky header, back-to-site link, role pill, and
 * logout form, so the two pages only differ in the title/subtitle text and
 * whatever dashboard content they render inside it.
 */
export default function DashboardShell({ siteName, slug, title, subtitle, roleLabel, logoutAction, children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <Link href={`/site/${slug}`} className="text-xs font-medium text-gray-400 hover:text-gray-700">
              ← {siteName}
            </Link>
            <h1 className="mt-1 truncate text-xl font-bold sm:text-2xl">{title}</h1>
            <p className="mt-0.5 truncate text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline-flex">
              {roleLabel}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
