// Client ID from Google Cloud Console (APIs & Services -> Credentials).
// Must be set as NEXT_PUBLIC_GOOGLE_CLIENT_ID (build-time env var) since
// it's used in the browser. Empty string disables the button gracefully.
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
