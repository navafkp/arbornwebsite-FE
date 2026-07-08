"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { logIn } = useAuth();
  const [form, setForm] = useState({ phone: "", password: "" });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    logIn(form.phone);
    router.push("/profile");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-14 sm:px-6">
      <h1 className="font-serif text-3xl">Log In</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Welcome back to Arborn.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
