import Link from "next/link";
import { CalendarClock, Users } from "lucide-react";
import { signUpAction, logInAction } from "../actions";
import type { AccountRole } from "../types";

interface Props {
  slug: string;
  role: AccountRole;
  mode: "login" | "signup";
  error?: string;
  businessName: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "That didn't work -- check the details and try again.",
  exists: "An account with that email already exists -- try logging in instead.",
  rate_limited: "Too many attempts. Please wait a few minutes and try again.",
};

/**
 * Shared login/signup form for both account roles (client + customer) --
 * the two screens differ only in copy and which server action they bind to,
 * so this is one component instead of two near-identical ones.
 */
export default function AccountAuthForm({ slug, role, mode, error, businessName }: Props) {
  const isSignup = mode === "signup";
  const action = isSignup ? signUpAction.bind(null, slug, role) : logInAction.bind(null, slug, role);
  const basePath = role === "client" ? `/site/${slug}/portal` : `/site/${slug}/account`;
  const roleLabel = role === "client" ? "Business" : "Customer";

  const Icon = role === "client" ? Users : CalendarClock;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4 py-12 sm:px-6">
      <Link href={`/site/${slug}`} className="text-sm font-medium text-gray-500 hover:text-gray-900">
        ← Back to {businessName}
      </Link>

      <form
        action={action}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg shadow-gray-200/50"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
            <Icon className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-bold">
            {roleLabel} {isSignup ? "sign up" : "login"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {role === "client"
              ? "Manage appointment requests for your business."
              : `Book and track appointments with ${businessName}.`}
          </p>
        </div>

        <div className="space-y-3">
          {isSignup && (
            <input
              type="text"
              name="name"
              required
              autoFocus
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition-colors focus:border-gray-900"
            />
          )}
          <input
            type="email"
            name="email"
            required
            autoFocus={!isSignup}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition-colors focus:border-gray-900"
          />
          <input
            type="password"
            name="password"
            required
            minLength={isSignup ? 8 : undefined}
            placeholder={isSignup ? "Password (8+ characters)" : "Password"}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition-colors focus:border-gray-900"
          />
        </div>

        {error && <p className="text-sm font-medium text-red-600">{ERROR_MESSAGES[error] || "Something went wrong."}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
        >
          {isSignup ? "Create account" : "Log in"}
        </button>

        <p className="text-center text-sm text-gray-500">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <Link
            href={`${basePath}/login?mode=${isSignup ? "login" : "signup"}`}
            className="font-medium text-gray-900 underline"
          >
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </form>
    </main>
  );
}
