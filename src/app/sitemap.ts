import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lajollafreediveclub.com";

  const staticPages = [
    { url: base, lastModified: "2026-04-19", changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/programs`, lastModified: "2026-04-10", changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/camp-garibaldi`, lastModified: "2026-04-01", changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/conditions`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/map`, lastModified: "2026-03-15", changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/blog`, lastModified: "2026-04-19", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/calendar`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/saturday-sessions`, lastModified: "2026-04-12", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/tides`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${base}/gear`, lastModified: "2026-03-10", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/about`, lastModified: "2026-04-19", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/education`, lastModified: "2026-04-01", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/contact`, lastModified: "2026-03-01", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/contact/courses`, lastModified: "2026-03-01", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/contact/camp`, lastModified: "2026-03-01", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/community`, lastModified: "2026-03-15", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/waiver`, lastModified: "2026-03-01", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const blogPages = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.isoDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
