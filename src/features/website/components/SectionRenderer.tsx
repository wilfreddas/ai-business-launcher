import { WebsiteSection } from "@/features/generation";

export default function SectionRenderer({
  section,
}: {
  section: WebsiteSection;
}) {
  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold">
        {section.heading}
      </h2>

      <p className="mt-3 text-gray-600">
        {section.content}
      </p>
    </section>
  );
}