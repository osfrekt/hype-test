import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/admin/",
          "/account",
          "/dashboard",
          "/password",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: "https://hypetest.ai/sitemap.xml",
  };
}
