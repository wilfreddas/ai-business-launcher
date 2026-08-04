"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SavedSite } from "../../storage";
import { resolveIndustryLabel } from "@/lib/ai/industryProfiles";
import { extractState } from "@/lib/format";

type SortKey = "client" | "category" | "createdAt" | "state";
type SortDirection = "asc" | "desc";

interface Row {
  slug: string;
  client: string;
  category: string;
  createdAt: string;
  state: string;
}

function buildRows(sites: SavedSite[]): Row[] {
  return sites.map((site) => ({
    slug: site.slug,
    client: site.business.name || "Untitled",
    category: resolveIndustryLabel(site.business),
    createdAt: site.createdAt,
    state: extractState(site.business.address),
  }));
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "client", label: "Client" },
  { key: "category", label: "Category" },
  { key: "createdAt", label: "Created" },
  { key: "state", label: "State" },
];

export default function ClientTrackingTable({ sites }: { sites: SavedSite[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const rows = useMemo(() => {
    const data = buildRows(sites);
    const sorted = [...data].sort((a, b) => {
      if (sortKey === "createdAt") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return a[sortKey].localeCompare(b[sortKey]);
    });
    return direction === "asc" ? sorted : sorted.reverse();
  }, [sites, sortKey, direction]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection(key === "createdAt" ? "desc" : "asc");
    }
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
        Who each site was built for. Not visible on any customer-facing page.
      </p>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[480px] text-left text-sm">
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
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.slug} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.client}</td>
                <td className="px-4 py-3 capitalize text-gray-600">{row.category}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(row.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
