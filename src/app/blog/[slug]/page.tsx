import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllPosts } from "@/lib/blog";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="relative pt-36 pb-16 px-6 text-center overflow-hidden">
        {/* Background: hero image or gradient */}
        {post.heroImage ? (
          <>
            <img src={post.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/70 to-deep/40" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-b ${post.gradient}`} />
        )}

        <div className="relative z-10">
          <div className="text-sm text-white/40 mb-8">
            <Link href="/" className="text-white/50 no-underline hover:text-seafoam">
              Home
            </Link>
            {" / "}
            <Link href="/blog" className="text-white/50 no-underline hover:text-seafoam">
              Journal
            </Link>
            {" / "}
            {post.category}
          </div>

          <span className="inline-block px-4 py-1.5 bg-seafoam/15 text-seafoam rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
            {post.category}
          </span>

          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-normal leading-tight max-w-[740px] mx-auto mb-6">
            {post.title}
          </h1>

          <div className="flex justify-center gap-8 text-white/45 text-sm">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      {/* Article body */}
      <article className="max-w-[720px] mx-auto px-6 py-16">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="bg-gradient-to-br from-ocean to-teal rounded-2xl p-10 text-center mt-12">
          <h3 className="font-serif text-2xl text-white mb-3">Ready to try it?</h3>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            Join our email list for upcoming courses, dive schedules, and
            community events.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-3 bg-coral text-white rounded-full font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(232,115,74,0.4)] transition-all"
          >
            Get on the List →
          </Link>
        </div>
      </article>
    </>
  );
}
