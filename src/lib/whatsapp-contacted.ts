const KEY = "arborn_whatsapp_contacted_cart_items";

function readIds(): number[] {
  try {
    const val = localStorage.getItem(KEY);
    return val ? val.split(",").map(Number).filter((n) => !isNaN(n)) : [];
  } catch {
    return [];
  }
}

export function markContactedViaWhatsApp(cartItemId: number) {
  try {
    const ids = readIds();
    if (!ids.includes(cartItemId)) {
      localStorage.setItem(KEY, [...ids, cartItemId].join(","));
    }
  } catch {
    // ignore write failures (e.g. private browsing)
  }
}

export function wasContactedViaWhatsApp(cartItemId: number): boolean {
  return readIds().includes(cartItemId);
}
