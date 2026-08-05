"use client";

import { Plus, Trash2 } from "lucide-react";
import FieldInput from "./FieldInput";
import type { FieldSchema } from "./fieldTypes";

interface Props<T> {
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldSchema<T>[];
  itemLabel: string;
  /** Template used when "Add" is clicked -- a blank version of T. */
  emptyItem: T;
}

/**
 * Generic editor for a list of objects -- services, pricing tiers, stats,
 * FAQ entries, etc. Every list-based section in the app is driven by this
 * one component plus a field schema, so adding editing support for a new
 * list-based content type is config, not a new component.
 */
export default function EditableList<T extends object>({
  items,
  onChange,
  fields,
  itemLabel,
  emptyItem,
}: Props<T>) {
  function updateItem(index: number, key: keyof T, value: unknown) {
    const next = items.slice();
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, { ...emptyItem }]);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
          No {itemLabel.toLowerCase()} entries yet.
        </p>
      )}

      {items.map((item, idx) => (
        <div key={idx} className="rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {itemLabel} {idx + 1}
            </span>
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={String(field.key)}
                className={field.type === "textarea" || field.type === "stringlist" ? "sm:col-span-2" : ""}
              >
                <FieldInput
                  field={field}
                  value={item[field.key]}
                  onChange={(v) => updateItem(idx, field.key, v)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        <Plus className="h-4 w-4" />
        Add {itemLabel}
      </button>
    </div>
  );
}
