import type { MetadataRoute } from "next";
import { getExplore, getProducts } from "@/lib/api-client";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-static";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
  { url: `${SITE_URL}/products/`, changeFrequency: "daily", priority: 0.9 },
  { url: `${SITE_URL}/categories/`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${SITE_URL}/contact/`, changeFrequency: "monthly", priority: 0.3 },
];

// Pulled from the live catalog API at build time — the catalog changes
// often, so this only stays accurate as of the last deploy/rebuild.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [{ categories, tags }, products] = await Promise.all([getExplore(), getProducts()]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${SITE_URL}/products/?category=${category.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
      url: `${SITE_URL}/products/?tag=${tag.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${SITE_URL}/products/detail/?slug=${product.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...productRoutes];
  } catch {
    // Catalog API unreachable at build time — ship the static routes rather
    // than fail the whole build.
    return staticRoutes;
  }
}
