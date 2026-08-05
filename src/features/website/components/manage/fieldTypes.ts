// src/features/website/components/manage/fieldTypes.ts
//
// Shared schema type for the generic manual content editor (EditableFields /
// EditableList). The whole point of these components is reusability: adding
// support for editing some new piece of content is "add a FieldSchema row",
// not "write a new form component" -- so future edit requests (a new field,
// a new list-based section) don't need new code, just a new schema entry.

export type FieldType = "text" | "textarea" | "stringlist" | "boolean" | "number" | "select";

export interface FieldSchema<T> {
  key: keyof T;
  label: string;
  type: FieldType;
  placeholder?: string;
  /** Only used when type is "select". */
  options?: { label: string; value: string }[];
}
