import { cn } from "@/lib/utils";
import type { ProductTag } from "@/lib/types";

const LABELS: Record<ProductTag, string> = {
  new: "New",
  bestseller: "Bestseller",
  premium: "Premium",
  limited: "Limited",
};

export default function Badge({ tag, className }: { tag: ProductTag; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-white/90 px-2.5 py-1 text-[10px] font-medium tracking-wide text-black uppercase backdrop-blur-sm",
        className,
      )}
    >
      {LABELS[tag]}
    </span>
  );
}
