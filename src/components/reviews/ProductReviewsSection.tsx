import type { Product, Review } from "@/lib/types";
import RatingStars from "@/components/ui/RatingStars";
import ReviewCard from "./ReviewCard";

export default function ProductReviewsSection({
  product,
  reviews,
}: {
  product: Product;
  reviews: Review[];
}) {
  return (
    <section className="border-t border-black/5 py-14">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-2xl">Customer Reviews</h2>
        <RatingStars rating={product.rating} count={product.reviewCount} size="md" />
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No reviews yet for this product.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
