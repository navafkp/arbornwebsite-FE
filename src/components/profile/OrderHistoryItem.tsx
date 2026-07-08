import Image from "next/image";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Delivered: "bg-[#eaf3ea] text-[#2f6b3a]",
  Shipped: "bg-[#eaf0f7] text-[#2f5a8f]",
  Processing: "bg-[#f7f1e3] text-[#9a7620]",
  Cancelled: "bg-[#f7eaea] text-[#a13a3a]",
  contacted_whatsapp: "bg-[#e7f8ec] text-[#1f8a4c]",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  Delivered: "Delivered",
  Shipped: "Shipped",
  Processing: "Processing",
  Cancelled: "Cancelled",
  contacted_whatsapp: "Contacted via WhatsApp",
};

export default function OrderHistoryItem({ order }: { order: Order }) {
  const date = new Date(order.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-black/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-3">
          {order.items.slice(0, 3).map((item) => (
            <div
              key={item.productId}
              className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-white bg-[#f4f2ee]"
            >
              <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-medium">
            {order.items[0].name}
            {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}
          </p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Order #{order.id} · {date}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-medium ${STATUS_STYLES[order.status]}`}
        >
          {STATUS_LABELS[order.status]}
        </span>
        <span className="text-sm font-medium">{formatPrice(order.total)}</span>
      </div>
    </div>
  );
}
