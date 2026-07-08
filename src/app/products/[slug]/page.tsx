import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getReviewsForProduct } from "@/lib/data/reviews";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductReviewsSection from "@/components/reviews/ProductReviewsSection";
import ProductRailSection from "@/components/home/ProductRailSection";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.colors[0].images[0] }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const reviews = getReviewsForProduct(product.id);
  const related = getRelatedProducts(product);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductDetailClient product={product} />
        <ProductReviewsSection product={product} reviews={reviews} />
      </div>

      {related.length > 0 && (
        <ProductRailSection
          title="You May Also Like"
          viewAllHref={`/products?category=${product.categorySlug}`}
          products={related}
          tinted
        />
      )}
    </div>
  );
}
