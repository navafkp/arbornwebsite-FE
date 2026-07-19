"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api-client";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import BackButton from "@/components/ui/BackButton";

export default function SignUpPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [googleError, setGoogleError] = useState("");

  // TEMP: normal email/mobile signup disabled to reduce fraud. Restore later if needed.
  // const { signUp } = useAuth();
  // const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  // function handleSubmit(e: FormEvent) {
  //   e.preventDefault();
  //   signUp({ name: form.name, phone: form.phone, email: form.email });
  //   router.push("/profile");
  // }

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
      <BackButton className="mb-4" />
      <h1 className="font-serif text-3xl">Create Account</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Sign up with Google to track your orders and save your details.
      </p>

      <div className="mt-8">
        <GoogleSignInButton onCredential={handleGoogleCredential} />
        {googleError && (
          <p className="mt-2 text-center text-xs text-red-600">{googleError}</p>
        )}
      </div>

      {/*
      <div className="my-6 flex items-center gap-3 text-[11px] text-[var(--muted)] uppercase">
        <span className="h-px flex-1 bg-black/10" />
        or
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
          Full Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
            placeholder="Your name"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
          Mobile Number
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
            placeholder="+91 98765 43210"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
            placeholder="you@example.com"
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
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-full bg-accent py-3.5 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
        >
          Sign Up
        </button>
      </form>
      */}

      <p className="mt-8 text-center text-xs text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-accent underline underline-offset-2">
          Log In
        </Link>
      </p>
    </div>
  );
}
