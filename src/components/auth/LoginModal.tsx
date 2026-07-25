"use client";

import { useEffect } from "react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/lib/auth-context";
import { HeartIcon, SparkleIcon } from "@/components/ui/decor";

export default function LoginModal({
  open,
  onClose,
  onSuccess,
  message = "Sign in to add this to your cart.",
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (accessToken: string) => void;
  message?: string;
}) {
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleCredential(idToken: string) {
    const accessToken = await loginWithGoogle(idToken);
    onSuccess(accessToken);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-[28px] bg-white px-8 py-9 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-accent/25 text-accent transition hover:bg-accent-soft"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-accent-soft text-accent">
          <SparkleIcon className="absolute -top-1 -left-2 h-3.5 w-3.5 text-accent/50" />
          <SparkleIcon className="absolute top-1 -right-3 h-[18px] w-[18px] text-accent/60" />
          <span className="absolute -right-1 bottom-2 h-1.5 w-1.5 rounded-full bg-accent/40" />
          <span className="absolute -left-2 bottom-4 h-1 w-1 rounded-full bg-accent/40" />
          <svg className="h-11 w-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 8h12l-1 11a2 2 0 01-2 1.8H9A2 2 0 017 19L6 8z" strokeLinejoin="round" />
            <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
            <path
              d="M12 13.1c-.9-1-2.3-1-2.9-.1-.6.8-.2 1.9.6 2.6l2.3 2 2.3-2c.8-.7 1.2-1.8.6-2.6-.6-.9-2-.9-2.9.1z"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </div>

        <h2 className="mt-5 font-serif text-2xl">Log in to continue</h2>
        <p className="mt-1.5 text-sm text-[var(--muted)]">{message}</p>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-black/10" />
          <HeartIcon filled className="h-3.5 w-3.5 text-accent" />
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <div className="mt-5">
          <GoogleSignInButton onCredential={handleCredential} />
        </div>
      </div>
    </div>
  );
}
