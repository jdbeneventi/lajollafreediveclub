import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Camp Garibaldi — Kids Ocean Camp",
  description:
    "Week-long ocean camp for kids ages 8-16 in La Jolla. Freediving, surf survival, and water confidence through breath-first training. The ocean camp that starts from the inside out.",
};

export default function CampGaribaldiPage() {
  redirect("/education#camp-garibaldi");
}
