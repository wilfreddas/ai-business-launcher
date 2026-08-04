import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">

      <h1 className="text-5xl font-bold text-center">
        Build Your Business Website With AI
      </h1>

      <p className="mt-6 max-w-xl text-center text-lg text-gray-600">
        Tell us about your business and AI will create
        a professional website for you in minutes.
      </p>

      <div className="mt-8">
        <Button>
          Create Website
        </Button>
      </div>

    </main>
  );
}