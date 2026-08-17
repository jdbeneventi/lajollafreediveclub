import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.lajollafreediveclub.com";
  // Deploy time is a truthful, self-maintaining lastModified for static pages
  // (the old hardcoded dates froze in March and rotted).
  const deployed = new Date();

  const staticPages = [
    { url: base, lastModified: deployed, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/programs`, lastModified: deployed, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/camp-garibaldi`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/conditions`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/map`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/blog`, lastModified: deployed, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/calendar`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/saturday-sessions`, lastModified: deployed, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/tides`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${base}/gear`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/about`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/contact`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/contact/courses`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/contact/camp`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/community`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/waiver`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/policies`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/camp-garibaldi/register`, lastModified: deployed, changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const blogPages = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.isoDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
