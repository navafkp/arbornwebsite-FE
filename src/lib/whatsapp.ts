// Update this if the number changes or isn't an Indian (+91) number.
const WHATSAPP_NUMBER = "918129666880";

// TEMPORARY status tagging until real order tracking (payments + DB) exists.
// This has no backend behind it — the "status" only lives inside the text of
// the WhatsApp message itself, so it can be tracked manually (spreadsheet or
// WhatsApp Business chat labels) until then.
//
// Lifecycle: CONTACTED (set here, automatically) -> ORDERED / ITEM_CHANGED
// (set manually by whoever manages WhatsApp, once the chat is resolved).
export const ORDER_STATUS = {
  CONTACTED: "contacted_whatsapp",
  ORDERED: "ordered",
  ITEM_CHANGED: "item_changed",
} as const;

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function generateOrderRef() {
  return `AB-${Date.now().toString(36).toUpperCase()}`;
}

export function buildOrderInquiryMessage({
  productName,
  color,
  size,
  price,
}: {
  productName: string;
  color: string;
  size: string;
  price: string;
}) {
  return [
    "New order inquiry",
    `Status: ${ORDER_STATUS.CONTACTED}`,
    `Ref: ${generateOrderRef()}`,
    `Product: ${productName}`,
    `Color: ${color}`,
    `Size: ${size}`,
    `Price: ${price}`,
    "",
    "Please share availability and payment details.",
  ].join("\n");
}
