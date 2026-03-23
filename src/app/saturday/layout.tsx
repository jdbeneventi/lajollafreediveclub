import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saturday Blast — Admin",
  robots: { index: false, follow: false },
};

export default function SaturdayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
