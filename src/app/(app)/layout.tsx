import AppNav from "@/components/AppNav";

// Shared chrome for the logged-in app surface (dashboard, create, edit).
// Deliberately not applied to "/", "/login", or "/site/[slug]" -- those are
// either pre-login or meant to look like the customer's own website, not
// this app's UI.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      {children}
    </>
  );
}
