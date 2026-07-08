import Image from "next/image";
import type { Review } from "@/lib/types";
import RatingStars from "@/components/ui/RatingStars";

export default function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-black/[0.06] p-6">
      <RatingStars rating={review.rating} size="md" />
      <h3 className="text-sm font-medium">{review.title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-[var(--muted)]">{review.comment}</p>
      <div className="mt-2 flex items-center gap-3">
        <div className="relative h-9 w-9 overflow-hidden rounded-full bg-[#f4f2ee]">
          <Image src={review.avatar} alt={review.author} fill className="object-cover" sizes="36px" />
        </div>
        <div>
          <p className="text-xs font-medium">{review.author}</p>
          <p className="text-[11px] text-[var(--muted)]">{date}</p>
        </div>
      </div>
    </div>
  );
}
