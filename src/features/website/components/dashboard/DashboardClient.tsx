"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ExternalLink, Trash2, Download, Plus, Pencil, Sparkles, Copy } from "lucide-react";
import type { SavedSite } from "../../storage";
import { deleteSiteAction, duplicateSiteAction } from "../../actions";
import { buildStaticHtmlDocument } from "../../export";
import ClientTrackingTable from "./ClientTrackingTable";

export default function DashboardClient({
  initialSites,
  persistentStorage,
}: {
  initialSites: SavedSite[];
  /** False when Upstash isn't configured -- sites only live in this server process's memory. */
  persistentStorage: boolean;
}) {
  const router = useRouter();
  const [sites, setSites] = useState<SavedSite[]>(initialSites);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [duplicatingSlug, setDuplicatingSlug] = useState<string | null>(null);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this saved website? This can't be undone.")) return;
    setDeletingSlug(slug);
    try {
      await deleteSiteAction(slug);
      setSites((prev) => prev.filter((s) => s.slug !== slug));
    } finally {
      setDeletingSlug(null);
    }
  }

  async function handleDuplicate(slug: string) {
    setDuplicatingSlug(slug);
    try {
      const { slug: newSlug } = await duplicateSiteAction(slug);
      // Drop straight into the no-code editor for the copy -- swapping in
      // the new client's name/contact info is the very next thing to do.
      router.push(`/edit/${newSlug}/content`);
    } finally {
      setDuplicatingSlug(null);
    }
  }

  function handleDownload(site: SavedSite) {
    const html = buildStaticHtmlDocument(site.website);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${site.slug}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-5xl p-6 sm:p-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your AI-generated websites.</p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Create New Website
        </Link>
      </div>

      {!persistentStorage && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <strong>Persistent storage isn&apos;t configured.</strong> Sites are only kept in this
            server&apos;s memory and can be lost on the next deploy or restart. Add &quot;Upstash for
            Redis&quot; via the Vercel Marketplace to this project (Storage tab → Create Database)
            to fix this before you have real client data on the line.
          </p>
        </div>
      )}

      {sites.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <p className="text-lg font-semibold">No websites yet</p>
          <p className="max-w-sm text-sm text-gray-500">
            Answer a few questions about your business and we&apos;ll generate a full website for you.
          </p>
          <Link href="/create" className="mt-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white">
            Create your first website
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <div key={site.slug} className="flex flex-col rounded-xl border p-5">
              <div
                className="mb-3 h-2 w-10 rounded-full"
                style={{ backgroundColor: site.website.theme.primaryColor }}
              />
              <h2 className="font-semibold">{site.business.name}</h2>
              <p className="text-sm capitalize text-gray-500">
                {site.business.type === "other" && site.business.customType
                  ? site.business.customType
                  : String(site.business.type).replace(/_/g, " ")}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {site.updatedAt
                  ? `Updated ${new Date(site.updatedAt).toLocaleDateString()}`
                  : `Created ${new Date(site.createdAt).toLocaleDateString()}`}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <Link
                  href={`/site/${site.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-medium hover:bg-gray-50"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View
                </Link>
                <Link
                  href={`/edit/${site.slug}/content`}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-medium hover:bg-gray-50"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Content
                </Link>
                <Link
                  href={`/edit/${site.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-medium hover:bg-gray-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Regenerate
                </Link>
                <button
                  onClick={() => handleDownload(site)}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-medium hover:bg-gray-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
                <button
                  onClick={() => handleDuplicate(site.slug)}
                  disabled={duplicatingSlug === site.slug}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {duplicatingSlug === site.slug ? "Duplicating..." : "Duplicate"}
                </button>
                <button
                  onClick={() => handleDelete(site.slug)}
                  disabled={deletingSlug === site.slug}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ClientTrackingTable sites={sites} />
    </main>
  );
}
