export type BusinessField =
  | "name"
  | "type"
  | "customType"
  | "description"
  | "phone"
  | "email"
  | "address"
  | "hours";

export type BusinessType =
  | "plumber"
  | "electrician"
  | "hvac"
  | "landscaping"
  | "lawn_care"
  | "cleaning"
  | "restaurant"
  | "dentist"
  | "lawyer"
  | "other";

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  /** Free-text industry label used when type === "other", e.g. "Bakery", "Yoga Studio". */
  customType?: string;
  description: string;
  phone: string;
  email: string;
  website?: string;
  address: string;
  /** Optional business hours, e.g. "Mon-Fri 9am-5pm, Sat 9am-2pm". */
  hours?: string;
}

export interface InterviewQuestion {
  id: number;
  field: BusinessField;
  title: string;
  placeholder: string;
  required: boolean;
  inputType?: "text" | "textarea" | "tel" | "email" | "select";

  /** Dynamic placeholder chosen based on prior answers (falls back to `placeholder`). */
  dynamicPlaceholder?: (answers: Record<string, string>) => string | undefined;

  /** Only show/require this question if this returns true. Defaults to always shown. */
  showIf?: (answers: Record<string, string>) => boolean;

  options?: {
    label: string;
    value: string;
  }[];
}
