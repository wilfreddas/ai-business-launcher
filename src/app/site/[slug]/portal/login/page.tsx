import { notFound } from "next/navigation";
import { getSite } from "@/features/website/storage";
import AccountAuthForm from "@/features/accounts/components/AccountAuthForm";

export default async function ClientPortalLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string; error?: string }>;
}) {
  const { slug } = await params;
  const { mode, error } = await searchParams;
  const site = await getSite(slug);

  if (!site || !site.addOns?.scheduling) notFound();

  return (
    <AccountAuthForm
      slug={slug}
      role="client"
      mode={mode === "signup" ? "signup" : "login"}
      error={error}
      businessName={site.website.title}
    />
  );
}
