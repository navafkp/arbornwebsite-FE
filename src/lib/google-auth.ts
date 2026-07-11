// Client ID from Google Cloud Console (APIs & Services -> Credentials).
// Must be set as NEXT_PUBLIC_GOOGLE_CLIENT_ID (build-time env var) since
// it's used in the browser. Empty string disables the button gracefully.
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export interface GoogleProfile {
  name: string;
  email: string;
  picture?: string;
}

// Decodes the JWT payload Google sends back. This is NOT signature
// verification — fine for a demo/no-backend login, not for real security.
// A real backend must re-verify this token before trusting it.
export function decodeGoogleCredential(credential: string): GoogleProfile | null {
  try {
    const payload = credential.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    };
  } catch {
    return null;
  }
}
