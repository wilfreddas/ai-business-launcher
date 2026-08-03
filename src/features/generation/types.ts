export interface WebsiteContent {
  title: string;
  headline: string;
  description: string;

  sections: WebsiteSection[];
}

export interface WebsiteSection {
  type: WebsiteSectionType;
  heading: string;
  content: string;
}

export type WebsiteSectionType =
  | "hero"
  | "services"
  | "menu"
  | "about"
  | "contact";