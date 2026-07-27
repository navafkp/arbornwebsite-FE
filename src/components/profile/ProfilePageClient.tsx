"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type AuthUser } from "@/lib/auth-context";
import { getMyProfile, updateMyProfile, getOrders, ApiError, type ApiOrder } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";

function ProfileLoading() {
  return <div className="mx-auto max-w-2xl px-4 py-12" aria-label="Loading your account" aria-busy="true"><div className="h-72 animate-pulse rounded-[2rem] bg-[#f3e5e4] motion-reduce:animate-none" /></div>;
}

// TEMPORARY: the API has no order-status field yet (only a delivery `state`,
// e.g. "Kerala") — showing "Delivered" as a static label until the backend
// exposes real status.
const STATUS_LABEL = "Delivered";

function OrderCard({ order }: { order: ApiOrder }) {
  const firstItem = order.items[0];
  const extraItemCount = order.items.length - 1;
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = Number(order.collected_amount) + Number(order.shipping_charge);
  const placedOn = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-[#f2dfe2] bg-white p-3 shadow-[0_4px_16px_rgba(190,120,130,0.06)]">
      <div className="flex gap-3">
        <div className="relative h-[110px] w-[90px] shrink-0">
          {[...order.items.slice(0, 3)].reverse().map((item, revIndex, arr) => {
            const idxFromFront = arr.length - 1 - revIndex;
            const offset = idxFromFront * 10;
            const rotation = idxFromFront === 0 ? 0 : idxFromFront % 2 === 0 ? -6 : 6;
            return (
              <Link
                key={item.id}
                href={`/products/detail?slug=${encodeURIComponent(item.product.slug)}`}
                className="absolute inset-0 overflow-hidden rounded-xl border-2 border-white bg-[#f4f2ee] shadow-[0_3px_10px_rgba(0,0,0,0.12)]"
                style={{
                  transform: `translate(${offset}px, ${-offset}px) rotate(${rotation}deg)`,
                  zIndex: arr.length - idxFromFront,
                }}
              >
                <Image src={item.image_url} alt={item.product.name} fill sizes="90px" className="object-cover" />
              </Link>
            );
          })}
          {order.items.length > 3 && (
            <span className="absolute -bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center rounded-full bg-accent-soft px-2 py-1 leading-none whitespace-nowrap text-accent shadow-[0_2px_6px_rgba(190,120,130,0.25)]">
              <span className="text-[10px] font-medium">+{order.items.length - 3} more</span>
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="4" y="10" width="16" height="10" rx="1.5" />
                <path d="M4 10h16M12 10v10" />
                <path d="M8 10C6.5 10 5.5 9 5.5 7.8S6.5 5.5 8 6.5 12 10 12 10 9.5 10 8 10z" strokeLinejoin="round" />
                <path d="M16 10c1.5 0 2.5-1 2.5-2.2S17.5 5.5 16 6.5 12 10 12 10 14.5 10 16 10z" strokeLinejoin="round" />
              </svg>
              {STATUS_LABEL}
            </span>
            <span className="shrink-0 text-[11px] text-[var(--muted)]">{placedOn}</span>
          </div>
          <p className="mt-2 truncate text-sm font-semibold">
            {firstItem.product.name}
            {extraItemCount > 0 && ` + ${extraItemCount} more`}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Size: {firstItem.size_display_text} &nbsp;•&nbsp; Qty: {totalQuantity}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--muted)]">
            <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 21s-7-6.2-7-11.2A7 7 0 0112 3a7 7 0 017 6.8C19 14.8 12 21 12 21z" strokeLinejoin="round" />
              <circle cx="12" cy="9.8" r="2.2" />
            </svg>
            {order.state}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end border-t border-[#f2dfe2] pt-3">
        <span className="text-base font-semibold text-accent">{formatPrice(totalAmount)}</span>
      </div>

      <Link
        href={`/orders/detail?id=${encodeURIComponent(order.id)}`}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-accent/30 py-2 text-xs font-medium text-accent"
      >
        View Details
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

export default function ProfilePageClient() {
  const router = useRouter();
  const { hydrated, user, accessToken, hasBackendSession, logOut, setUser, refreshSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [name, setName] = useState("");
  const [orders, setOrders] = useState<ApiOrder[]>([]);

  useEffect(() => {
    if (!hydrated || !hasBackendSession || !accessToken) return;
    let active = true;
    async function sync(token: string, canRefresh = true) {
      try {
        const profile = await getMyProfile(token);
        if (!active) return;
        const next: AuthUser = { id: profile.id, name: profile.name || `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim(), firstName: profile.first_name, lastName: profile.last_name, email: profile.email, phone: "", avatar: profile.profile_image };
        setUser(next);
        setName(next.name);
        setSyncError("");
      } catch (err) {
        if (canRefresh && err instanceof ApiError && err.status === 401) {
          try { await sync(await refreshSession(), false); return; } catch { /* handled below */ }
        }
        if (active) setSyncError("We couldn’t refresh your profile. Showing the last saved account details.");
      } finally { if (active) setLoading(false); }
    }
    // Initialize the editable draft while synchronizing the external backend session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(user?.name ?? "");
    sync(accessToken);
    return () => { active = false; };
    // Sync when the backend session changes, not after each local edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, hasBackendSession, accessToken]);

  useEffect(() => {
    if (!hydrated || !hasBackendSession || !accessToken) return;
    let active = true;
    async function loadOrders(token: string, canRefresh = true) {
      try {
        const orders = await getOrders(token);
        if (active) setOrders(orders);
      } catch (err) {
        if (canRefresh && err instanceof ApiError && err.status === 401) {
          try { await loadOrders(await refreshSession(), false); return; } catch { /* no purchase history shown on failure */ }
        }
      }
    }
    loadOrders(accessToken);
    return () => { active = false; };
  }, [hydrated, hasBackendSession, accessToken, refreshSession]);

  if (!hydrated || (hasBackendSession && loading)) return <ProfileLoading />;

  if (!hasBackendSession || !user) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-12 text-center sm:px-6 sm:py-20">
        <section className="rounded-[2rem] border border-[#ead8d5] bg-white/60 px-6 py-11 shadow-[0_14px_42px_rgba(96,55,62,0.07)]">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7e7e9] text-accent" aria-hidden="true"><svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c1.6-3.3 4.4-5 7.5-5s5.9 1.7 7.5 5" strokeLinecap="round"/></svg></span>
          <h1 className="mt-6 font-serif text-4xl leading-none">Your account, beautifully simple</h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">Sign in securely with Google to manage your profile and keep your wishlist private.</p>
          <Link href="/login?next=%2Fprofile" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-9 text-sm font-semibold text-white hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Continue with Google</Link>
          <p className="mx-auto mt-5 max-w-sm text-xs leading-5 text-[var(--muted)]">
            You&rsquo;ll need to log in to add items to your cart or save them to your wishlist.
          </p>
        </section>
      </div>
    );
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true); setSaveError("");
    const [firstName, ...rest] = name.trim().split(/\s+/);
    try {
      await updateMyProfile(accessToken, { first_name: firstName, last_name: rest.join(" ") });
      setUser({ ...user!, name: name.trim(), firstName, lastName: rest.join(" ") });
      setEditing(false);
    } catch (err) { setSaveError(err instanceof ApiError ? err.message : "We couldn’t save that change. Please try again."); }
    finally { setSaving(false); }
  }

  const initials = (user.name || user.email).split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  // Orders with no items are incomplete/broken records — nothing to show.
  const visibleOrders = orders.filter((order) => order.items.length > 0);
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">Arborn member</p>
          <h1 className="mt-1 font-serif text-4xl sm:text-5xl">My Account</h1>
        </div>
        <button
          type="button"
          onClick={() => { logOut(); router.replace("/login"); }}
          className="mt-1 flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Log out
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {syncError && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">{syncError}</p>}
      <section className="mt-7 rounded-[2rem] border border-[#ead8d5] bg-white/65 p-6 shadow-[0_14px_42px_rgba(96,55,62,0.07)] sm:p-8" aria-labelledby="profile-details-heading">
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f4e1e3] font-serif text-2xl text-accent">
            {user.avatar ? <Image src={user.avatar} alt="" fill sizes="80px" className="object-cover" /> : initials}
          </div>
          <div className="min-w-0"><h2 id="profile-details-heading" className="truncate font-serif text-2xl">{user.name || "Arborn member"}</h2><p className="truncate text-sm text-[var(--muted)]">{user.email}</p></div>
        </div>
        {editing ? (
          <form onSubmit={saveProfile} className="mt-7">
            <label className="block text-xs font-medium text-[var(--muted)]">Full name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-[#dcc9c6] bg-white px-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" autoComplete="name" /></label>
            <p className="mt-3 text-xs text-[var(--muted)]">Your email is managed by your Google account and cannot be edited here.</p>
            {saveError && <p className="mt-3 text-sm text-red-700" role="alert">{saveError}</p>}
            <div className="mt-5 flex gap-3"><button disabled={saving} className="min-h-11 flex-1 rounded-full bg-accent px-5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button><button type="button" onClick={() => { setName(user.name); setEditing(false); setSaveError(""); }} className="min-h-11 flex-1 rounded-full border border-[#dcc9c6] px-5 text-sm font-semibold">Cancel</button></div>
          </form>
        ) : <button type="button" onClick={() => setEditing(true)} className="mt-7 min-h-11 w-full rounded-full border border-[#dcc9c6] text-sm font-semibold text-accent hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Edit name</button>}
      </section>

      {visibleOrders.length > 0 && (
        <section className="mt-8" aria-labelledby="order-history-heading">
          <div className="flex items-center gap-3 text-accent">
            <span className="h-px flex-1 bg-[#d9c6c1]" />
            <h2 id="order-history-heading" className="shrink-0 text-xs font-medium tracking-[0.12em] uppercase sm:text-sm">
              Order History
            </h2>
            <span className="h-px flex-1 bg-[#d9c6c1]" />
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {visibleOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
