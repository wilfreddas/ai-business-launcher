"use client";

interface QuestionCardProps {
  title: string;
  placeholder: string;
  value: string;
  required?: boolean;
  inputType?: "text" | "textarea" | "tel" | "email" | "select";

  options?: {
    label: string;
    value: string;
  }[];

  onChange: (value: string) => void;
}

export default function QuestionCard({
  title,
  placeholder,
  value,
  required,
  inputType = "text",
  options,
  onChange,
}: QuestionCardProps) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">
        {title}
        {!required && <span className="ml-2 text-sm font-normal text-gray-400">(optional)</span>}
      </h2>

      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border p-3"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : inputType === "textarea" ? (
        <textarea
          value={value}
          placeholder={placeholder}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      ) : (
        <input
          type={inputType === "tel" || inputType === "email" ? inputType : "text"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      )}
    </div>
  );
}
