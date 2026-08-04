export default function LocationSection({
  address,
}: {
  address?: string;
}) {
  return (
    <section className="px-6 py-16 text-center">

      <h2 className="text-3xl font-bold">
        Find Us
      </h2>

      <p className="mt-4 text-gray-600">
        {address || "Business location"}
      </p>

    </section>
  );
}