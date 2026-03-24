import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OHPC Action Plan",
  robots: { index: false, follow: false },
};

export default function OHPCPlanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
