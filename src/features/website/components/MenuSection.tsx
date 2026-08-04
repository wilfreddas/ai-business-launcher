export default function MenuSection() {
  return (
    <section className="px-6 py-16">

      <h2 className="text-3xl font-bold text-center">
        Our Menu
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-3">

        <div className="rounded-xl border p-6">
          <h3 className="font-bold">
            Signature Burger
          </h3>
          <p className="mt-2 text-gray-600">
            Fresh ingredients and house sauce.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-bold">
            Fries
          </h3>
          <p className="mt-2 text-gray-600">
            Crispy golden fries.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-bold">
            Drinks
          </h3>
          <p className="mt-2 text-gray-600">
            Refreshing beverages.
          </p>
        </div>

      </div>

    </section>
  );
}