import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Portal — LJFC",
  robots: { index: false, follow: false },
};

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
