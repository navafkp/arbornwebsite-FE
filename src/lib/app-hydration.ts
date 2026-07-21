// Shared across every component that needs to know "has this app's very
// first client hydration already happened" — e.g. to safely read
// localStorage-derived state without mismatching the static-export markup
// (which always renders as if hydration hasn't happened yet).
export const appHydration = { done: false };
