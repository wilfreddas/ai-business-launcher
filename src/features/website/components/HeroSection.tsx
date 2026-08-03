import { WebsiteProps } from "../types";

export default function HeroSection({
  title,
  headline,
  description,
}: WebsiteProps) {
  return (
    <section className="px-6 py-12 text-center">
      <h1 className="text-4xl font-bold">
        {title}
      </h1>

      <h2 className="mt-4 text-2xl">
        {headline}
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-gray-600">
        {description}
      </p>

      <button
        className="
          mt-8
          rounded-lg
          bg-black
          px-6
          py-3
          text-white
        "
      >
        Contact Us
      </button>
    </section>
  );
}