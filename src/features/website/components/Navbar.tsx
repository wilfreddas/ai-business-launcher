
export default function Navbar({
  businessName,
}: {
  businessName: string;
}) {
  return (
    <nav className="flex items-center justify-between px-6 py-5 border-b">

      <div className="text-xl font-bold">
        {businessName}
      </div>

      <div className="hidden md:flex gap-6 text-sm">
        <span>Home</span>
        <span>Services</span>
        <span>Contact</span>
      </div>

    </nav>
  );
}