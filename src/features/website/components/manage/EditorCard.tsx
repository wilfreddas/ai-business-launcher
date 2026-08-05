"use client";

import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

/** Consistent titled container used for every section of the content editor. */
export default function EditorCard({ title, description, children }: Props) {
  return (
    <section className="rounded-xl border border-gray-200 p-5 sm:p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
