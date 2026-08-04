export default function Footer({
  businessName,
}: {
  businessName: string;
}) {
  return (
    <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} {businessName}
    </footer>
  );
}