export default function Navbar({
  businessName,
}: {
  businessName: string;
}) {
  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <div className="text-xl font-bold">
        {businessName}
      </div>

      <div className="flex gap-6 text-sm">
        <span>Home</span>
        <span>Services</span>
        <span>Contact</span>
      </div>
    </nav>
  );
}