"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api-client";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function LoginPage() {
  const router = useRouter();
  const { logIn, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [googleError, setGoogleError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    logIn(form.phone);
    router.push("/profile");
  }

  async function handleGoogleCredential(idToken: string) {
    setGoogleError("");
    try {
      await loginWithGoogle(idToken);
      router.push("/profile");
    } catch (err) {
      setGoogleError(
        err instanceof ApiError ? err.message : "Google sign-in failed. Please try again.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-14 sm:px-6">
      <h1 className="font-serif text-3xl">Log In</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Welcome back to Arborn.</p>

      <div className="mt-6">
        <GoogleSignInButton onCredential={handleGoogleCredential} />
        {googleError && (
          <p className="mt-2 text-center text-xs text-red-600">{googleError}</p>
        )}
      </div>

      <div className="my-6 flex items-center gap-3 text-[11px] text-[var(--muted)] uppercase">
        <span className="h-px flex-1 bg-black/10" />
        or
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
          Username
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
            placeholder="Username"
            autoComplete="username"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
          Password
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-full bg-accent py-3.5 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
        >
          Log In
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[var(--muted)]">
        New to Arborn?{" "}
        <Link href="/signup" className="text-accent underline underline-offset-2">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
