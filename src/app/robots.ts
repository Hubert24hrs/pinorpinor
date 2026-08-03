import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/discover", "/women", "/locations", "/about", "/safety", "/privacy", "/terms"],
        disallow: ["/dashboard", "/admin", "/messages", "/settings", "/api/", "/join"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
