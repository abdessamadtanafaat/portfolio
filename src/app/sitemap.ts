import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const BASE_URL = process.env.NEXTAUTH_URL || "https://portfolio.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/projects"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
