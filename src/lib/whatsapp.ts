// Update this if the number changes or isn't an Indian (+91) number.
const WHATSAPP_NUMBER = "918129666880";

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
