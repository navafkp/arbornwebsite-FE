import type { Metadata } from "next";
import { Suspense } from "react";
import OrderDetailClient from "@/components/orders/OrderDetailClient";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View your order details, delivery status, and price breakdown.",
};

// Static-export equivalent of a `/orders/[id]` page — reads `?id=`
// client-side, same pattern as /products/detail.
export default function OrderDetailPage() {
  return (
    <Suspense fallback={null}>
      <OrderDetailClient />
    </Suspense>
  );
}
