export default function ServicesSection({
  description,
}: {
  description: string;
}) {
  return (
    <section className="px-6 py-16">

      <h2 className="text-3xl font-bold text-center">
        Our Services
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-3">

        <div className="rounded-xl border p-6">
          <h3 className="font-semibold">
            Quality Service
          </h3>
          <p className="mt-3 text-gray-600">
            {description}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-semibold">
            Professional Team
          </h3>
          <p className="mt-3 text-gray-600">
            Trusted experts serving customers.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-semibold">
            Customer Focus
          </h3>
          <p className="mt-3 text-gray-600">
            We focus on customer satisfaction.
          </p>
        </div>

      </div>

    </section>
  );
}