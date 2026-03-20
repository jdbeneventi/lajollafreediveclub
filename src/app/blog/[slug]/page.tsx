import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllPosts } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: "2026-03-14",
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      {/* Header */}
      <header className={`bg-gradient-to-b from-deep to-ocean pt-36 pb-16 px-6 text-center`}>
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
