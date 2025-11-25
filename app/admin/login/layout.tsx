// Simple layout - no client-side checks to avoid conflicts
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

