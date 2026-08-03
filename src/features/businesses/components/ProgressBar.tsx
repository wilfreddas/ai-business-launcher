type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-8">
      <p className="mb-2 text-sm text-gray-600">
        Question {current} of {total}
      </p>

      <div className="h-2 rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-black transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}