import AppNav from "@/components/AppNav";
import { getCurrentUser } from "@/lib/auth/session";

// Shared chrome for the logged-in app surface (dashboard, create, edit).
// Deliberately not applied to "/", "/login", or "/site/[slug]" -- those are
// either the public marketing site or meant to look like the customer's own
// website, not this app's UI.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <>
      <AppNav userName={user?.name} />
      {children}
    </>
  );
}
