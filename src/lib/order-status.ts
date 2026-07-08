import type { OrderStatus } from "@/lib/types";

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  Delivered: "bg-[#eaf3ea] text-[#2f6b3a]",
  Shipped: "bg-[#eaf0f7] text-[#2f5a8f]",
  Processing: "bg-[#f7f1e3] text-[#9a7620]",
  Cancelled: "bg-[#f7eaea] text-[#a13a3a]",
  contacted_whatsapp: "bg-[#e7f8ec] text-[#1f8a4c]",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  Delivered: "Delivered",
  Shipped: "Shipped",
  Processing: "Processing",
  Cancelled: "Cancelled",
  contacted_whatsapp: "Contacted via WhatsApp",
};
