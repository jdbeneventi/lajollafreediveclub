import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllPosts } from "@/lib/blog";
import { ShareButtons } from "@/components/ShareButtons";

type Props = { params: Promise<{ slug: string }> };

// Exclude posts that have dedicated interactive pages
const CUSTOM_PAGES = new Set(["state-anchors"]);

export async function generateStaticParams() {
  return getAllPosts()
    .filter((p) => !CUSTOM_PAGES.has(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `https://lajollafreediveclub.com/blog/${post.slug}`;
  const ogImage = post.heroImage
    ? `https://lajollafreediveclub.com${post.heroImage}`
    : "https://lajollafreediveclub.com/images/hero.jpg";

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: "Joshua Beneventi" }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.isoDate,
      authors: ["Joshua Beneventi"],
      section: post.category,
      images: [{ url: ogImage, width: 1200, height: 800, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

/* Grain texture inline style */
const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.heroImage
      ? `https://lajollafreediveclub.com${post.heroImage}`
      : "https://lajollafreediveclub.com/images/hero.jpg",
    datePublished: post.isoDate,
    author: {
      "@type": "Person",
      name: "Joshua Beneventi",
      url: "https://lajollafreediveclub.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "La Jolla Freedive Club",
      url: "https://lajollafreediveclub.com",
    },
    mainEntityOfPage: `https://lajollafreediveclub.com/blog/${post.slug}`,
    articleSection: post.category,
    wordCount: post.content.replace(/<[^>]+>/g, "").split(/\s+/).length,
  };

  /* Extract first paragraph for the editorial lede */
  const firstPMatch = post.content.match(/<p>([\s\S]*?)<\/p>/);
  const firstParagraph = firstPMatch ? firstPMatch[1] : "";
  const remainingContent = firstPMatch
    ? post.content.replace(firstPMatch[0], "")
    : post.content;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ── */}
      <header className="relative min-h-[70vh] flex items-end overflow-hidden">
        {/* Background */}
        {post.heroImage ? (
          <>
            <img
              src={post.heroImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/60 to-deep/30" />
          </>
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-b ${post.gradient}`}
          />
        )}
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-20 max-w-[1200px] mx-auto">
          <div className="text-sm text-white/30 mb-8">
            <Link
              href="/"
              className="text-white/40 no-underline hover:text-seafoam transition-colors"
            >
              Home
            </Link>
            {" / "}
            <Link
              href="/blog"
              className="text-white/40 no-underline hover:text-seafoam transition-colors"
            >
              Journal
            </Link>
            {" / "}
            {post.category}
          </div>

          <span className="inline-block px-4 py-1.5 bg-seafoam/15 text-seafoam rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
            {post.category}
          </span>

          <h1 className="font-serif text-[clamp(2.4rem,6vw,4.5rem)] text-white font-normal leading-[1.08] tracking-tight max-w-[800px] mb-6">
            {post.title}
          </h1>

          <div className="flex gap-8 text-white/35 text-sm">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      {/* ── LEDE ── */}
      {firstParagraph && (
        <section className="bg-salt py-16 md:py-24 px-6 relative">
          <div className="absolute inset-0 opacity-[0.02]" style={grain} />
          <div className="max-w-[680px] mx-auto relative z-10">
            <p
              className="font-serif text-[clamp(1.15rem,2.5vw,1.45rem)] text-deep leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: firstParagraph }}
            />
          </div>
        </section>
      )}

      {/* ── ARTICLE BODY ── */}
      <article className="bg-white relative">
        <div className="absolute inset-0 opacity-[0.015]" style={grain} />
        <div className="max-w-[680px] mx-auto px-6 py-16 md:py-24 relative z-10">
          <div
            className="prose prose-editorial"
            dangerouslySetInnerHTML={{ __html: remainingContent }}
          />
        </div>
      </article>

      {/* ── AUTHOR + CTA ── */}
      <section className="bg-salt py-16 md:py-20 px-6 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          {/* Author card */}
          <div className="flex items-center gap-5 mb-12 pb-12 border-b border-deep/10">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-ocean to-teal shrink-0">
              <img
                src="/images/photos/joshua-red-sea.jpg"
                alt="Joshua Beneventi"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-semibold text-deep text-sm">
                Joshua Beneventi
              </div>
              <div className="text-xs text-[#5a6a7a] leading-relaxed mt-0.5">
                AIDA Instructor &middot; AIDA Youth Instructor &middot; AIDA 4
                Freediver
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="mb-12">
            <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-ocean to-teal rounded-2xl p-10 text-center">
            <h3 className="font-serif text-2xl text-white mb-3">
              {post.category === "Training" || post.category === "Science"
                ? "Ready to train?"
                : post.category === "Beginner Guide" || post.category === "Local Guide"
                ? "Ready to try it?"
                : "Go deeper"}
            </h3>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              {post.category === "Training" || post.category === "Science"
                ? "Put this into practice. AIDA courses run year-round in La Jolla."
                : post.category === "Beginner Guide"
                ? "Start with a half-day AIDA 1 introduction — no experience needed."
                : "Join the LJFC community for courses, ocean sessions, and weekly dives."}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/contact/courses"
                className="inline-flex px-8 py-3 bg-coral text-white rounded-full font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(232,115,74,0.4)] transition-all"
              >
                View Courses &rarr;
              </Link>
              <Link
                href="/conditions"
                className="inline-flex px-6 py-3 border border-white/20 text-white/80 rounded-full font-medium text-sm no-underline hover:bg-white/10 transition-all"
              >
                Check Conditions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
