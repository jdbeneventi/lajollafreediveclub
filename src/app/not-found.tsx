import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">404</p>
      <h1 className="font-serif text-5xl md:text-6xl text-deep mb-6">Off the line.</h1>
      <p className="text-slate text-lg mb-12">This page doesn&apos;t exist — or it drifted. Try one of these instead.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/" className="border border-deep/20 px-4 py-3 text-sm no-underline hover:bg-deep hover:text-salt transition rounded-lg">Home</Link>
        <Link href="/programs" className="border border-deep/20 px-4 py-3 text-sm no-underline hover:bg-deep hover:text-salt transition rounded-lg">Programs</Link>
        <Link href="/conditions" className="border border-deep/20 px-4 py-3 text-sm no-underline hover:bg-deep hover:text-salt transition rounded-lg">Conditions</Link>
        <Link href="/blog" className="border border-deep/20 px-4 py-3 text-sm no-underline hover:bg-deep hover:text-salt transition rounded-lg">Journal</Link>
      </div>
    </div>
  );
}
