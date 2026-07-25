"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type AuthUser } from "@/lib/auth-context";
import { getMyProfile, updateMyProfile, getOrders, ApiError, type ApiOrder } from "@/lib/api-client";

function ProfileLoading() {
  return <div className="mx-auto max-w-2xl px-4 py-12" aria-label="Loading your account" aria-busy="true"><div className="h-72 animate-pulse rounded-[2rem] bg-[#f3e5e4] motion-reduce:animate-none" /></div>;
}

interface PurchasedCollection {
  productId: number;
  productSlug: string;
  name: string;
  imageUrl: string;
  itemCount: number;
}

// Orders come back as one row per line item — group them by product so
// each purchased product shows once, with its total quantity bought.
function groupOrdersByProduct(orders: ApiOrder[]): PurchasedCollection[] {
  const byProduct = new Map<number, PurchasedCollection>();
  for (const order of orders) {
    const existing = byProduct.get(order.product.id);
    if (existing) {
      existing.itemCount += order.quantity;
    } else {
      byProduct.set(order.product.id, {
        productId: order.product.id,
        productSlug: order.product.slug,
        name: order.product.name,
        imageUrl: order.image_url,
        itemCount: order.quantity,
      });
    }
  }
  return Array.from(byProduct.values());
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
  const [collections, setCollections] = useState<PurchasedCollection[]>([]);

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
        if (active) setCollections(groupOrdersByProduct(orders));
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

      {collections.length > 0 && (
        <section className="mt-8" aria-labelledby="purchased-collections-heading">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M6 8h12l-1 12a1.5 1.5 0 01-1.5 1.4h-7A1.5 1.5 0 017 20L6 8z" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
            </svg>
            <h2 id="purchased-collections-heading" className="font-serif text-xl">Your Purchased Collections</h2>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">Pieces you&rsquo;ve bought and loved</p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.productId}
                href={`/products/detail?slug=${encodeURIComponent(collection.productSlug)}`}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f4f2ee]">
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 640px) 33vw, 200px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
                    {collection.itemCount}
                  </span>
                </div>
                <p className="mt-2 truncate text-sm font-medium">{collection.name}</p>
                <p className="text-xs text-[var(--muted)]">{collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
