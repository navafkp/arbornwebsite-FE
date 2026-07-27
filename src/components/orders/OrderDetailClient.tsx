"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { HeartIcon, LeafIcon } from "@/components/ui/decor";
import { useAuth } from "@/lib/auth-context";
import { getOrders, ApiError, type ApiOrder } from "@/lib/api-client";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import AddReviewModal from "@/components/orders/AddReviewModal";

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
      {children}
    </span>
  );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#f2dfe2] bg-white shadow-[0_4px_16px_rgba(190,120,130,0.06)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function OrderDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12" aria-busy="true">
      <div className="h-72 animate-pulse rounded-2xl bg-[#f3e5e4] motion-reduce:animate-none" />
    </div>
  );
}

export default function OrderDetailClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { hydrated, hasBackendSession, accessToken, refreshSession } = useAuth();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [reviewTarget, setReviewTarget] = useState<{ name: string; slug: string } | null>(null);

  useEffect(() => {
    if (!hydrated || !hasBackendSession || !accessToken || !orderId) return;
    let active = true;
    async function load(token: string, canRefresh = true) {
      try {
        const orders = await getOrders(token);
        if (!active) return;
        const match = orders.find((o) => String(o.id) === orderId && o.items.length > 0) ?? null;
        setOrder(match);
        setLoadState(match ? "ready" : "error");
      } catch (err) {
        if (canRefresh && err instanceof ApiError && err.status === 401) {
          try {
            await load(await refreshSession(), false);
            return;
          } catch {
            /* falls through to error state below */
          }
        }
        if (active) setLoadState("error");
      }
    }
    load(accessToken);
    return () => {
      active = false;
    };
  }, [hydrated, hasBackendSession, accessToken, orderId, refreshSession]);

  if (!hydrated || (hasBackendSession && loadState === "loading")) return <OrderDetailLoading />;

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-sm text-[var(--muted)]">We couldn&rsquo;t find that order.</p>
        <Link href="/profile" className="mt-4 inline-block text-sm font-medium text-accent">
          Back to profile
        </Link>
      </div>
    );
  }

  const placedOn = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const totalAmount = Number(order.collected_amount) + Number(order.shipping_charge);

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="fixed top-0 right-0 left-0 z-50 flex h-[67px] items-center justify-center bg-[#fcf0ef] px-4">
        <BackButton variant="bare" className="absolute left-2" />
        <h1 className="font-serif text-xl">Order Details</h1>
        <HeartIcon className="absolute right-4 h-5 w-5 text-accent/25" />
      </header>

      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 pt-[83px]">
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <IconBadge>
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 3h12v18l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3V3z" strokeLinejoin="round" />
                <path d="M9 8h6M9 12h6" strokeLinecap="round" />
              </svg>
            </IconBadge>
            <div>
              <p className="text-xs text-[var(--muted)]">Order ID</p>
              <p className="mt-0.5 text-sm font-semibold">#{order.id}</p>
            </div>
          </div>
        </Card>

        <Card className="flex items-center p-4">
          <div className="flex flex-1 items-center gap-3">
            <IconBadge>
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M4 9h16M8 3v3M16 3v3" strokeLinecap="round" />
              </svg>
            </IconBadge>
            <div>
              <p className="text-xs text-[var(--muted)]">Placed on</p>
              <p className="mt-0.5 text-sm font-medium">{placedOn}</p>
            </div>
          </div>
          <span className="mx-2 h-10 w-px shrink-0 bg-[#f2dfe2]" aria-hidden="true" />
          <div className="flex flex-1 items-center gap-3">
            <IconBadge>
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 7h11v9H3z" strokeLinejoin="round" />
                <path d="M14 10h4l3 3v3h-7z" strokeLinejoin="round" />
                <circle cx="7" cy="18" r="1.6" />
                <circle cx="17" cy="18" r="1.6" />
              </svg>
            </IconBadge>
            <div>
              <p className="text-xs text-[var(--muted)]">Transport Mode</p>
              <p className="mt-0.5 text-sm font-medium uppercase">{order.transport_mode}</p>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 p-4">
          <IconBadge>
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 21s-7-6.2-7-11.2A7 7 0 0112 3a7 7 0 017 6.8C19 14.8 12 21 12 21z" strokeLinejoin="round" />
              <circle cx="12" cy="9.8" r="2.2" />
            </svg>
          </IconBadge>
          <div>
            <p className="text-xs text-[var(--muted)]">Delivery State</p>
            <p className="mt-0.5 text-sm font-medium">{order.state}</p>
          </div>
        </Card>

        <Card>
          <LeafIcon className="pointer-events-none absolute -top-2 -right-2 h-14 w-14 text-accent-soft" />
          {order.items.map((item, i) => (
            <div
              key={item.id}
              className={`relative flex items-center gap-3 p-4 ${i > 0 ? "border-t border-[#f2dfe2]" : ""}`}
            >
              <Link
                href={`/products/detail?slug=${encodeURIComponent(item.product.slug)}`}
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f4f2ee]"
              >
                <Image src={item.image_url} alt={item.product.name} fill sizes="56px" className="object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.product.name}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  Size: {item.size_display_text} &nbsp;•&nbsp; Color: {item.color} &nbsp;•&nbsp; Qty: {item.quantity}
                </p>
                <button
                  type="button"
                  onClick={() => setReviewTarget({ name: item.product.name, slug: item.product.slug })}
                  className="mt-1.5 flex items-center gap-1 text-xs font-medium text-accent"
                >
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
                  </svg>
                  Add Review
                </button>
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-4">
          <LeafIcon className="pointer-events-none absolute -top-2 -right-2 h-12 w-12 text-accent-soft" />
          <p className="relative flex items-center gap-1.5 text-sm font-semibold text-accent">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20 12L12 20l-9-9V4h7z" strokeLinejoin="round" />
              <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
            </svg>
            Price Details
          </p>
          <div className="relative mt-3 flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Price</span>
              <span>{formatPrice(Number(order.collected_amount))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Shipping Charge</span>
              <span>{formatPrice(Number(order.shipping_charge))}</span>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-[#f2dfe2] pt-2 font-semibold">
              <span>Total Amount</span>
              <span className="text-accent">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </Card>

        <a
          href={buildWhatsAppLink(`Hi Arborn! I need help with my order #${order.id}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl bg-accent-soft px-4 py-3.5 text-sm font-medium text-accent"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.8A8 8 0 1121 12z" strokeLinejoin="round" />
            </svg>
            Need Help? Contact Us
          </span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {reviewTarget && (
        <AddReviewModal
          productName={reviewTarget.name}
          productSlug={reviewTarget.slug}
          onClose={() => setReviewTarget(null)}
        />
      )}
    </div>
  );
}
