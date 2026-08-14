import "server-only";
import { getOwnerAccountId } from "@/features/accounts/storage";

/** Single place that answers "can this logged-in client account see/act on
 * this provider's appointments?" -- the owner (first client account created
 * for the site) can see everyone's, every other client account only its
 * own. Shared by the page that decides which appointments to fetch and the
 * action that decides whether a status change is allowed. */
export async function isOwnerOrProvider(slug: string, clientId: string, providerId: string): Promise<boolean> {
  if (clientId === providerId) return true;
  return (await getOwnerAccountId(slug)) === clientId;
}
