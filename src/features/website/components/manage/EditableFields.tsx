"use client";

import FieldInput from "./FieldInput";
import type { FieldSchema } from "./fieldTypes";

interface Props<T> {
  value: T;
  onChange: (value: T) => void;
  fields: FieldSchema<T>[];
}

/**
 * Generic editor for a single object (hero copy, about section, etc). Add a
 * new editable field anywhere in the app by adding a FieldSchema entry --
 * never by writing a new form.
 */
export default function EditableFields<T extends object>({
  value,
  onChange,
  fields,
}: Props<T>) {
  function setField(key: keyof T, fieldValue: unknown) {
    onChange({ ...value, [key]: fieldValue });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={String(field.key)}
          className={field.type === "textarea" || field.type === "stringlist" ? "sm:col-span-2" : ""}
        >
          <FieldInput field={field} value={value[field.key]} onChange={(v) => setField(field.key, v)} />
        </div>
      ))}
    </div>
  );
}
