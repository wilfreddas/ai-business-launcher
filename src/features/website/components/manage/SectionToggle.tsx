"use client";

import { ArrowUp, ArrowDown, X } from "lucide-react";
import type { SectionName } from "@/features/generation/types";
import { SECTION_LABELS, TOGGLEABLE_SECTIONS } from "../../sectionMeta";

interface Props {
  sections: SectionName[];
  onChange: (sections: SectionName[]) => void;
}

/**
 * Lets a business owner turn sections on/off and reorder them directly --
 * no AI call, just editing the sections array. This is the direct answer to
 * "remove a section" without touching code.
 */
export default function SectionToggle({ sections, onChange }: Props) {
  const active: SectionName[] = sections.filter((s) => s !== "hero" && s !== "contact");
  const inactive = TOGGLEABLE_SECTIONS.filter((s) => !active.includes(s));

  function rebuild(nextActive: SectionName[]) {
    onChange(["hero", ...nextActive, "contact"]);
  }

  function remove(section: SectionName) {
    rebuild(active.filter((s) => s !== section));
  }

  function add(section: SectionName) {
    rebuild([...active, section]);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= active.length) return;
    const next = active.slice();
    [next[index], next[target]] = [next[target], next[index]];
    rebuild(next);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">
        Hero and Contact always show. Reorder or remove anything else, or add a section back.
      </p>

      {active.map((section, idx) => (
        <div
          key={section}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
        >
          <span className="text-sm font-medium">{SECTION_LABELS[section] ?? section}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => move(idx, -1)}
              disabled={idx === 0}
              aria-label="Move up"
              className="rounded p-1 text-gray-400 hover:text-black disabled:opacity-30"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(idx, 1)}
              disabled={idx === active.length - 1}
              aria-label="Move down"
              className="rounded p-1 text-gray-400 hover:text-black disabled:opacity-30"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => remove(section)}
              aria-label="Remove section"
              className="ml-1 rounded p-1 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {inactive.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {inactive.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => add(section)}
              className="rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-black hover:text-black"
            >
              + {SECTION_LABELS[section] ?? section}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
