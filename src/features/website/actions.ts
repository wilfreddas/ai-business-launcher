"use server";

import { deleteSite } from "./storage";

export async function deleteSiteAction(slug: string): Promise<void> {
  await deleteSite(slug);
}
