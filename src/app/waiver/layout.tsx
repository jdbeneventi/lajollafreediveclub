import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Waiver — La Jolla Freedive Club",
  description:
    "Complete the LJFC liability waiver and medical questionnaire online. Required before participating in any La Jolla Freedive Club activity.",
};

export default function WaiverLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
