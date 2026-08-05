"use client";

import type { FieldSchema } from "./fieldTypes";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none";

interface Props<T> {
  field: FieldSchema<T>;
  value: unknown;
  onChange: (value: unknown) => void;
}

/**
 * Renders one input for one field, based on field.type. This is the single
 * primitive both EditableFields (one object) and EditableList (array of
 * objects) build on, so every content type in the editor gets the same
 * input behavior for free.
 */
export default function FieldInput<T>({ field, value, onChange }: Props<T>) {
  switch (field.type) {
    case "textarea":
      return (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">{field.label}</span>
          <textarea
            rows={3}
            className={inputClass}
            placeholder={field.placeholder}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      );

    case "stringlist":
      return (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">
            {field.label} <span className="font-normal text-gray-400">(one per line)</span>
          </span>
          <textarea
            rows={3}
            className={inputClass}
            placeholder={field.placeholder}
            value={((value as string[]) ?? []).join("\n")}
            onChange={(e) => onChange(e.target.value.split("\n"))}
          />
        </label>
      );

    case "boolean":
      return (
        <label className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          {field.label}
        </label>
      );

    case "number":
      return (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">{field.label}</span>
          <input
            type="number"
            className={inputClass}
            value={typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </label>
      );

    case "select":
      return (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">{field.label}</span>
          <select
            className={inputClass}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      );

    case "text":
    default:
      return (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">{field.label}</span>
          <input
            type="text"
            className={inputClass}
            placeholder={field.placeholder}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      );
  }
}
