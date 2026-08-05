import Link from "next/link";
import { getSite } from "@/features/website/storage";
import ContentEditor from "@/features/website/components/manage/ContentEditor";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSite(slug);

  if (!site) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">Site not found</h1>
        <p className="max-w-sm text-gray-600">No saved site matches this link.</p>
        <Link href="/dashboard" className="text-sm font-semibold underline">
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 sm:p-10">
      <ContentEditor slug={slug} initialWebsite={site.website} />
    </main>
  );
}
