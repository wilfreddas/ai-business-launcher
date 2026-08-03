import HeroSection from "./HeroSection";
import SectionRenderer from "./SectionRenderer";

import { WebsiteContent } from "@/features/generation";

export default function WebsitePreview({
  website,
}: {
  website: WebsiteContent;
}) {
  return (
    <div className="min-h-screen">

      <HeroSection
        title={website.title}
        headline={website.headline}
        description={website.description}
      />

      {website.sections.map((section, index) => (
        <SectionRenderer
          key={index}
          section={section}
        />
      ))}

    </div>
  );
}