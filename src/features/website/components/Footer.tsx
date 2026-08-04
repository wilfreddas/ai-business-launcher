
export default function Footer({
  businessName,
}: {
  businessName: string;
}) {
  return (
    <footer className="border-t px-6 py-6 text-center text-sm text-gray-500">

      © {new Date().getFullYear()} {businessName}

    </footer>
  );
}