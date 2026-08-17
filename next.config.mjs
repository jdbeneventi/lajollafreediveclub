/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Legacy WordPress URL shapes from before the Next.js migration —
    // residual backlinks and indexed tag/category pages 301 to the Journal
    // instead of dead-ending on the 404 page.
    return [
      { source: "/tag/:slug*", destination: "/blog", permanent: true },
      { source: "/category/:slug*", destination: "/blog", permanent: true },
      { source: "/author/:slug*", destination: "/about", permanent: true },
      { source: "/feed", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;
