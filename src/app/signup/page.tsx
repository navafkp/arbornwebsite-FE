"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    signUp({ name: form.name, phone: form.phone, email: form.email });
    router.push("/profile");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-14 sm:px-6">
      <h1 className="font-serif text-3xl">Create Account</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Sign up to track your orders and save your details.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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

      <p className="mt-6 text-center text-xs text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-accent underline underline-offset-2">
          Log In
        </Link>
      </p>
    </div>
  );
}
