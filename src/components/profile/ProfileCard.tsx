"use client";

import Image from "next/image";
import { useState } from "react";
import type { UserProfile } from "@/lib/types";

export default function ProfileCard({ user }: { user: UserProfile }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone });

  const defaultAddress = user.addresses.find((a) => a.isDefault) ?? user.addresses[0];

  return (
    <div className="rounded-2xl border border-black/[0.06] p-6">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#f4f2ee]">
          <Image src={user.avatar} alt={user.name} fill className="object-cover" sizes="64px" />
        </div>
        <div>
          <h2 className="font-serif text-xl">{form.name}</h2>
          <p className="text-xs text-[var(--muted)]">Member since {new Date(user.memberSince).getFullYear()}</p>
        </div>
      </div>

      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEditing(false);
          }}
          className="mt-6 flex flex-col gap-3"
        >
          <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
            Full Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
            Mobile Number
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-accent"
            />
          </label>
          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-accent py-2.5 text-xs font-medium tracking-wide text-white transition hover:bg-accent-dark"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({ name: user.name, email: user.email, phone: user.phone });
                setEditing(false);
              }}
              className="flex-1 rounded-full border border-black/15 py-2.5 text-xs font-medium tracking-wide"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <dl className="mt-6 flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Email</dt>
              <dd className="text-right text-black">{form.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Mobile</dt>
              <dd className="text-right text-black">{form.phone}</dd>
            </div>
            {defaultAddress && (
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-[var(--muted)]">Address</dt>
                <dd className="text-right text-black">
                  {defaultAddress.line1}, {defaultAddress.city}, {defaultAddress.state}{" "}
                  {defaultAddress.pincode}
                </dd>
              </div>
            )}
          </dl>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-6 w-full rounded-full border border-black/15 py-2.5 text-xs font-medium tracking-wide text-black transition hover:border-black"
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
}
