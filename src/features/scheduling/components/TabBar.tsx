"use client";

interface Props<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}

/** Pill-segmented tab bar, shared by both the client and customer
 * scheduling dashboards. Full-width on mobile so each tab is a comfortable
 * tap target instead of cramped underline text. */
export default function TabBar<T extends string>({ tabs, active, onChange }: Props<T>) {
  return (
    <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === t.id ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
