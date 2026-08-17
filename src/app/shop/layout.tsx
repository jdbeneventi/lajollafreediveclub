import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "LJFC merch. Hats, tees, stickers, and gear from La Jolla Freedive Club.",
  robots: { index: false, follow: false },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
