"use client";

import { useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";
import type { SavedSite } from "../../storage";
import { updateSiteAddOnsAction } from "../../actions";

interface Props {
  slug: string;
  initialAddOns: SavedSite["addOns"];
}

/**
 * Turns the scheduling add-on (client + customer logins, appointment
 * requests) on or off for this one site. Off by default -- see
 * features/accounts + features/scheduling for what it actually adds.
 */
export default function AddOnsToggle({ slug, initialAddOns }: Props) {
  const [scheduling, setScheduling] = useState(Boolean(initialAddOns?.scheduling));
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !scheduling;
    setScheduling(next);
    startTransition(async () => {
      await updateSiteAddOnsAction(slug, { ...initialAddOns, scheduling: next });
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4">
      <div>
        <p className="font-medium">Scheduling (client + customer accounts)</p>
        <p className="mt-1 text-sm text-gray-500">
          Adds a business login and a customer login/booking flow to this site. Demo-quality booking
          (requests only, no calendar engine) -- not billed yet.
        </p>
        {scheduling && (
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            <a
              href={`/site/${slug}/portal/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium underline"
            >
              Business login <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={`/site/${slug}/account/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium underline"
            >
              Customer login <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={scheduling}
        disabled={isPending}
        onClick={toggle}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
          scheduling ? "bg-black" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
            scheduling ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
