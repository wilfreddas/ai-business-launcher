type QuestionCardProps = {
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export default function QuestionCard({
  title,
  placeholder,
  value,
  onChange,
}: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border p-3"
      />
    </div>
  );
}