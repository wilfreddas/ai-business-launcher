import { WebsiteSectionType } from "@/features/generation";

export interface WebsiteTemplate {
  name: string;
  sections: WebsiteSectionType[];
}