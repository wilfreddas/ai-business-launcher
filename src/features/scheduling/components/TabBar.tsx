"use client";

interface Props<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}

/** Small underline-style tab bar, shared by both the client and customer
 * scheduling dashboards. */
export default function TabBar<T extends string>({ tabs, active, onChange }: Props<T>) {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
            active === t.id ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
