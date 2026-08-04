import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/") ? params.next : "/";

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        action={loginAction}
        className="w-full max-w-sm space-y-4 rounded-xl border border-gray-200 p-8 shadow-sm"
      >
        <div>
          <h1 className="text-xl font-bold">This site is private</h1>
          <p className="mt-1 text-sm text-gray-500">Enter the password to continue.</p>
        </div>

        <input type="hidden" name="next" value={next} />

        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="Password"
          className="w-full rounded-lg border p-3"
        />

        {params.error && (
          <p className="text-sm font-medium text-red-600">That password isn&apos;t right.</p>
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
