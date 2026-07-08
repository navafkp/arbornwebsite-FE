"use client";

import { useState } from "react";
import type { Address } from "@/lib/types";
import { cn } from "@/lib/utils";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-accent" : "bg-black/15",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

const NOTIFICATION_PREFS = [
  { key: "new-arrivals", label: "New Arrivals & Restocks" },
  { key: "offers", label: "Offers & Promotions" },
];

export default function SettingsSection({ addresses }: { addresses: Address[] }) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    "new-arrivals": true,
    offers: false,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-4 text-sm font-medium tracking-wide">Notifications</h3>
        <div className="flex flex-col gap-4 rounded-xl border border-black/[0.06] p-5">
          {NOTIFICATION_PREFS.map((pref) => (
            <div key={pref.key} className="flex items-center justify-between">
              <span className="text-sm">{pref.label}</span>
              <Toggle
                checked={prefs[pref.key]}
                onChange={() => setPrefs((p) => ({ ...p, [pref.key]: !p[pref.key] }))}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium tracking-wide">Saved Addresses</h3>
        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <div
              key={address.label}
              className="flex items-start justify-between gap-4 rounded-xl border border-black/[0.06] p-5"
            >
              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  {address.label}
                  {address.isDefault && (
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-normal text-[var(--muted)]">
                      Default
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {address.line1}, {address.city}, {address.state} {address.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium tracking-wide">Privacy</h3>
        <div className="flex flex-col overflow-hidden rounded-xl border border-black/[0.06]">
          {["Privacy Policy", "Data & Permissions", "Delete Account"].map((item, i, arr) => (
            <button
              key={item}
              type="button"
              className={cn(
                "flex items-center justify-between px-5 py-3.5 text-left text-sm transition hover:bg-black/[0.02]",
                i !== arr.length - 1 && "border-b border-black/[0.06]",
              )}
            >
              {item}
              <svg className="h-3.5 w-3.5 text-black/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
