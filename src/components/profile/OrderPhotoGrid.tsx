"use client";

import Image from "next/image";
import { useState } from "react";
import type { Order, OrderItem } from "@/lib/types";
import OrderDetailModal from "@/components/profile/OrderDetailModal";

interface OrderPhoto {
  order: Order;
  item: OrderItem;
}

export default function OrderPhotoGrid({ orders }: { orders: Order[] }) {
  const [selected, setSelected] = useState<OrderPhoto | null>(null);

  const photos: OrderPhoto[] = orders.flatMap((order) =>
    order.items.map((item) => ({ order, item })),
  );

  if (photos.length === 0) {
    return (
      <div>
        <h2 className="mb-3 text-sm font-medium tracking-wide">My Orders</h2>
        <p className="text-xs text-[var(--muted)]">Your ordered items will show up here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium tracking-wide">My Orders</h2>
      <div className="grid grid-cols-3 gap-1">
        {photos.map(({ order, item }, i) => (
          <button
            key={`${order.id}-${item.productId}-${i}`}
            type="button"
            onClick={() => setSelected({ order, item })}
            className="relative aspect-square overflow-hidden bg-[#f4f2ee] transition hover:opacity-90"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="150px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <OrderDetailModal photo={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
