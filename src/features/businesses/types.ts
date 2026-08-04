export type BusinessField =
  | "name"
  | "type"
  | "description"
  | "address";

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
  description: string;
  phone: string;
  email: string;
  website?: string;
  address: string;
}

export interface InterviewQuestion {
  id: number;
  field: BusinessField;
  title: string;
  placeholder: string;
  required: boolean;

  options?: {
    label: string;
    value: string;
  }[];
}