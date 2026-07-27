// Reviews from the API carry no user id, only a display name, so there's no
// reliable way to tell "is this review mine" from the list alone. Instead we
// remember locally, right after a successful submit, that this device has a
// review awaiting verification for a given product slug.
const KEY = "arborn_pending_reviews";

function readAll(): string[] {
  try {
    const val = localStorage.getItem(KEY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function markReviewPending(slug: string) {
  try {
    const slugs = new Set(readAll());
    slugs.add(slug);
    localStorage.setItem(KEY, JSON.stringify([...slugs]));
  } catch {
    /* best-effort only */
  }
}

export function hasPendingReview(slug: string): boolean {
  return readAll().includes(slug);
}

export function clearPendingReview(slug: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(readAll().filter((s) => s !== slug)));
  } catch {
    /* best-effort only */
  }
}
