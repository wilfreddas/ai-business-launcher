import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/") ? params.next : "/dashboard";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <Link href="/" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
        ← Back to {COMPANY.name}
      </Link>

      <form
        action={loginAction}
        className="w-full max-w-sm space-y-4 rounded-xl border border-gray-200 p-8 shadow-sm"
      >
        <div>
          <h1 className="text-xl font-bold">Team login</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in with your account to reach the portal.</p>
        </div>

        <input type="hidden" name="next" value={next} />

        <input
          type="email"
          name="email"
          required
          autoFocus
          placeholder="Email"
          className="w-full rounded-lg border p-3"
        />

        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="w-full rounded-lg border p-3"
        />

        {params.error && (
          <p className="text-sm font-medium text-red-600">That email or password isn&apos;t right.</p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
