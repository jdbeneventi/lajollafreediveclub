import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal surfaces and licensed course materials — none of these
      // belong in a search index. (noindex on the pages covers HTML;
      // this also keeps crawlers off the PDFs under /documents.)
      disallow: ["/admin", "/portal", "/students", "/saturday", "/partners/", "/documents/"],
    },
    sitemap: "https://www.lajollafreediveclub.com/sitemap.xml",
  };
}
