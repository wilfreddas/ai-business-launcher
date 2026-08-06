"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SavedSite, ClientStatus } from "../../storage";
import { updateSiteTrackingAction } from "../../actions";
import { resolveIndustryLabel } from "@/lib/ai/industryProfiles";
import { extractState } from "@/lib/format";

type SortKey = "client" | "category" | "status" | "createdAt" | "state";
type SortDirection = "asc" | "desc";

interface Row {
  slug: string;
  client: string;
  category: string;
  createdAt: string;
  state: string;
  status: ClientStatus;
  notes: string;
}

const STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "in_progress", label: "In Progress" },
  { value: "live", label: "Live" },
];

const STATUS_LABELS: Record<ClientStatus, string> = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label])
) as Record<ClientStatus, string>;

function buildRows(sites: SavedSite[]): Row[] {
  return sites.map((site) => ({
    slug: site.slug,
    client: site.business.name || "Untitled",
    category: resolveIndustryLabel(site.business),
    createdAt: site.createdAt,
    state: extractState(site.business.address),
    status: site.status ?? "lead",
    notes: site.notes ?? "",
  }));
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "client", label: "Client" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created" },
  { key: "state", label: "State" },
];

export default function ClientTrackingTable({ sites }: { sites: SavedSite[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [direction, setDirection] = useState<SortDirection>("desc");
  // Optimistic local edits, keyed by slug -- saved to the server in the
  // background so the table feels instant without waiting on a round trip.
  const [overrides, setOverrides] = useState<Record<string, { status?: ClientStatus; notes?: string }>>({});
  const [, startTransition] = useTransition();

  const rows = useMemo(() => {
    const data = buildRows(sites).map((row) => ({ ...row, ...overrides[row.slug] }));
    const sorted = [...data].sort((a, b) => {
      if (sortKey === "createdAt") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return String(a[sortKey]).localeCompare(String(b[sortKey]));
    });
    return direction === "asc" ? sorted : sorted.reverse();
  }, [sites, sortKey, direction, overrides]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection(key === "createdAt" ? "desc" : "asc");
    }
  }

  function handleStatusChange(slug: string, status: ClientStatus) {
    setOverrides((prev) => ({ ...prev, [slug]: { ...prev[slug], status } }));
    startTransition(() => {
      updateSiteTrackingAction(slug, { status }).catch(() => {});
    });
  }

  function handleNotesChange(slug: string, notes: string) {
    setOverrides((prev) => ({ ...prev, [slug]: { ...prev[slug], notes } }));
  }

  function handleNotesBlur(slug: string, notes: string) {
    startTransition(() => {
      updateSiteTrackingAction(slug, { notes }).catch(() => {});
    });
  }

  if (sites.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-semibold">Client Tracking</h2>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
          Internal only
        </span>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Who each site was built for, and where things stand. Not visible on any customer-facing page.
      </p>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="inline-flex items-center gap-1 hover:text-gray-900"
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      direction === "asc" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-gray-300" />
                    )}
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.slug} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.client}</td>
                <td className="px-4 py-3 capitalize text-gray-600">{row.category}</td>
                <td className="px-4 py-3">
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.slug, e.target.value as ClientStatus)}
                    aria-label={`Status for ${row.client}`}
                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {STATUS_LABELS[opt.value]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(row.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.state}</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={row.notes}
                    onChange={(e) => handleNotesChange(row.slug, e.target.value)}
                    onBlur={(e) => handleNotesBlur(row.slug, e.target.value)}
                    placeholder="Add a note..."
                    aria-label={`Notes for ${row.client}`}
                    className="w-full min-w-[160px] rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-200 focus:border-gray-200 focus:bg-white focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
