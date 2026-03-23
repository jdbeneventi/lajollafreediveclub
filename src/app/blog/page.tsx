import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "The Journal — Freediving Tips, Guides & Stories",
  description:
    "Freediving guides, training tips, local dive spot reviews, and stories from the La Jolla Freedive Club community.",
  openGraph: {
    title: "The Journal — Freediving Tips, Guides & Stories",
    description: "Freediving guides, training tips, local dive spot reviews, and stories from the La Jolla Freedive Club community.",
    url: "https://lajollafreediveclub.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Journal — Freediving Tips, Guides & Stories",
    description: "Freediving guides, training tips, local dive spot reviews, and stories from La Jolla Freedive Club.",
  },
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <div className="section-label text-seafoam before:bg-seafoam justify-center">
          The Journal
        </div>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
          Depth, knowledge &amp; stories
        </h1>
        <p className="text-lg text-white/60 max-w-[520px] mx-auto leading-relaxed">
          Freediving guides, training science, local spot intel, and stories from
          our community.
        </p>
      </section>

      <section className="py-20 px-6 bg-salt">
        <div className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`block bg-white rounded-2xl overflow-hidden no-underline text-deep hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(10,22,40,0.08)] transition-all ${
                i === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div
                className={`${
                  i === 0 ? "h-[300px]" : "h-[200px]"
                } relative bg-gradient-to-br ${post.gradient} overflow-hidden`}
              >
                {post.heroImage && (
                  <img src={post.heroImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-md text-white text-[0.7rem] font-semibold tracking-wide uppercase">
                  {post.category}
                </span>
              </div>
              <div className="p-7">
                <h2
                  className={`font-serif ${
                    i === 0 ? "text-2xl" : "text-xl"
                  } leading-tight mb-3 tracking-tight`}
                >
                  {post.title}
                </h2>
                <p className="text-sm text-[#5a6a7a] leading-relaxed mb-5">
                  {post.description}
                </p>
                <div className="flex justify-between items-center text-xs text-[#5a6a7a]">
                  <span>{post.date}</span>
                  <span className="text-teal font-medium">{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
