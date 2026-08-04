export default function GallerySection() {
  return (
    <section className="px-6 py-16">

      <h2 className="text-3xl font-bold text-center">
        Gallery
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">

        <div className="aspect-square rounded-xl bg-gray-200 flex items-center justify-center">
          Image
        </div>

        <div className="aspect-square rounded-xl bg-gray-200 flex items-center justify-center">
          Image
        </div>

        <div className="aspect-square rounded-xl bg-gray-200 flex items-center justify-center">
          Image
        </div>

      </div>

    </section>
  );
}