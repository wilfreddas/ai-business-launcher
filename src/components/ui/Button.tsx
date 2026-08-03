type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 transition"
    >
      {children}
    </button>
  );
}