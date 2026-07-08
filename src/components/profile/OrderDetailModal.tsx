"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Order, OrderItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_STYLES, ORDER_STATUS_LABELS } from "@/lib/order-status";

interface OrderDetailModalProps {
  photo: { order: Order; item: OrderItem } | null;
  onClose: () => void;
}

export default function OrderDetailModal({ photo, onClose }: OrderDetailModalProps) {
  useEffect(() => {
    if (!photo) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [photo, onClose]);

  if (!photo) return null;

  const { order, item } = photo;
  const date = new Date(order.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-1.5 text-black shadow-sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative aspect-square w-full bg-[#f4f2ee]">
          <Image src={item.image} alt={item.name} fill sizes="450px" className="object-cover" />
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-xl">{item.name}</h2>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${ORDER_STATUS_STYLES[order.status]}`}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>

          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Order ID</dt>
              <dd>#{order.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Ordered On</dt>
              <dd>{date}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Size</dt>
              <dd>{item.size}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Quantity</dt>
              <dd>{item.quantity}</dd>
            </div>
            <div className="flex justify-between border-t border-black/5 pt-2 font-medium">
              <dt>Item Total</dt>
              <dd>{formatPrice(item.price * item.quantity)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
