"use client";

import { useState, type FormEvent } from "react";

interface ContactFormProps {
  defaultMessage?: string;
}

export default function ContactForm({ defaultMessage = "" }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: defaultMessage });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-black/[0.06] p-8 text-center">
        <p className="font-serif text-2xl">Thank you, {form.name.split(" ")[0] || "there"}.</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          We&rsquo;ve received your message and will get back to you within 24 hours to help
          with your order.
        </p>
      </div>
    );
  }

  return (
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          Mobile Number
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
            placeholder="+91 98765 43210"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
        Message
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="resize-none rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
          placeholder="Tell us what you'd like to order…"
        />
      </label>

      <button
        type="submit"
        className="mt-2 rounded-full bg-accent py-3.5 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
      >
        Send Message
      </button>
    </form>
  );
}
