import { WebsiteSectionType } from "../types";

export type WebsiteTemplateType =
  | "restaurant"
  | "service";

export interface WebsiteBlueprint {
  template: WebsiteTemplateType;

  sections: WebsiteSectionType[];

  theme: WebsiteTheme;
}

export interface WebsiteTheme {
  style: "modern" | "classic" | "minimal";

  primaryColor: string;
}