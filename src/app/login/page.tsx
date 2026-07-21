"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api-client";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/profile";
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const handleCredential = useCallback(async (idToken: string) => {
    setError("");
    setSigningIn(true);
    try {
      await loginWithGoogle(idToken);
      router.replace(safeNext(searchParams.get("next")));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Google sign-in failed. Please try again.");
      setSigningIn(false);
    }
  }, [loginWithGoogle, router, searchParams]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 items-center px-4 py-12 sm:px-6 sm:py-20">
      <section className="relative w-full overflow-hidden rounded-[2rem] border border-[#ead8d5] bg-white/60 px-6 py-10 text-center shadow-[0_18px_50px_rgba(96,55,62,0.08)] sm:px-10 sm:py-12" aria-labelledby="login-heading">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7e7e9] text-accent" aria-hidden="true"><svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c1.6-3.3 4.4-5 7.5-5s5.9 1.7 7.5 5" strokeLinecap="round"/></svg></span>
        <p className="mt-5 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">Your Arborn account</p>
        <h1 id="login-heading" className="mt-2 font-serif text-4xl leading-none sm:text-5xl">Welcome back</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">Continue with Google to keep your wishlist private and your profile safely connected.</p>
        <div className="mt-7 min-h-11" aria-busy={signingIn}>
          <GoogleSignInButton onCredential={handleCredential} />
          {signingIn && <p className="mt-3 text-xs text-[var(--muted)]" role="status">Signing you in…</p>}
          {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
        </div>
        <p className="mt-7 text-xs leading-5 text-[var(--muted)]">We only use your Google account to securely identify you. We never receive your Google password.</p>
        <Link href="/products" className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-accent underline decoration-accent/30 underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">Continue browsing</Link>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="mx-auto mt-20 h-80 w-[calc(100%-2rem)] max-w-lg animate-pulse rounded-[2rem] bg-[#f3e5e4] motion-reduce:animate-none" aria-label="Loading sign in" />}><LoginContent /></Suspense>;
}
