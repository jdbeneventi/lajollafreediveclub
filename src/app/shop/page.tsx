import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
};

const products = [
  {
    name: "LJFC Trucker Hat",
    description: "Structured front, navy/cream. Embroidered logo. Richardson 112.",
    price: "$35",
    status: "Coming soon",
    category: "Headwear",
  },
  {
    name: "LJFC Tee — Logo",
    description: "Left chest logo, back print: La Jolla Freedive Club · 32.856°N 117.262°W. 100% cotton.",
    price: "$30",
    status: "Coming soon",
    category: "Apparel",
  },
  {
    name: "LJFC Tee — Breathe. Dive. Belong.",
    description: "Minimal front, full back graphic. Deep navy on salt cream.",
    price: "$30",
    status: "Coming soon",
    category: "Apparel",
  },
  {
    name: "LJFC Sticker Pack",
    description: "3-pack. Logo mark, coordinates, and \"Breathe. Dive. Belong.\" die-cut vinyl, waterproof.",
    price: "$5",
    status: "Coming soon",
    category: "Accessories",
  },
  {
    name: "LJFC Dry Bag — 15L",
    description: "Logo print. Waterproof roll-top. Perfect for Saturday sessions.",
    price: "$40",
    status: "Coming soon",
    category: "Gear",
  },
  {
    name: "LJFC Beach Towel",
    description: "Oversized. Deep navy with teal LJFC branding. Turkish cotton.",
    price: "$45",
    status: "Coming soon",
    category: "Gear",
  },
];

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-deep pt-36 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="relative z-10">
          <Reveal>
            <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-4">
              La Jolla, California
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] text-white font-normal leading-[1.05] tracking-tight mb-4">
              The Shop
            </h1>
            <p className="text-white/40 text-lg max-w-[440px] mx-auto leading-relaxed">
              Rep the crew. Clean gear from La Jolla Freedive Club.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Products */}
      <section className="bg-salt py-20 px-6 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product, i) => (
              <Reveal key={product.name} delay={i * 60}>
                <div className="bg-white rounded-2xl overflow-hidden border border-deep/[0.04] h-full flex flex-col">
                  {/* Placeholder image area */}
                  <div className="aspect-square bg-gradient-to-br from-deep to-ocean flex items-center justify-center relative">
                    <div className="text-center px-8">
                      <div className="font-serif text-[clamp(1.2rem,2.5vw,1.6rem)] text-white/80 italic leading-tight">
                        {product.name.replace("LJFC ", "")}
                      </div>
                      <div className="text-white/20 text-[10px] uppercase tracking-[0.15em] mt-3">
                        La Jolla Freedive Club
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
                      <span className="text-white/60 text-[10px] font-medium">{product.status}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-[10px] text-teal font-medium tracking-[0.15em] uppercase mb-1">
                      {product.category}
                    </div>
                    <h3 className="font-serif text-lg tracking-tight mb-1.5">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#5a6a7a] leading-relaxed mb-4 flex-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xl text-deep">{product.price}</span>
                      <span className="text-xs text-[#5a6a7a]">DM to pre-order</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal>
            <div className="mt-16 text-center">
              <div className="bg-deep rounded-2xl p-10 max-w-[500px] mx-auto">
                <h3 className="font-serif text-2xl text-white mb-3">
                  Want it first?
                </h3>
                <p className="text-white/40 text-sm mb-6 leading-relaxed">
                  Merch drops are announced on Instagram. Follow us to get first access.
                </p>
                <a
                  href="https://instagram.com/lajollafreedive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex px-8 py-3 bg-coral text-white rounded-full font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
                >
                  @lajollafreedive &rarr;
                </a>
                <p className="text-white/20 text-xs mt-4">
                  Or email{" "}
                  <a href="mailto:joshuabeneventi@gmail.com" className="text-seafoam/40 no-underline hover:text-seafoam/60">
                    joshuabeneventi@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </Reveal>

          {/* Stockist note */}
          <Reveal>
            <div className="mt-12 text-center">
              <p className="text-sm text-[#5a6a7a]">
                Local shop owner?{" "}
                <Link href="/contact" className="text-teal no-underline hover:underline">
                  Let&apos;s talk wholesale &rarr;
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
