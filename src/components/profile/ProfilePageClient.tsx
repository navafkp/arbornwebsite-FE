"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type AuthUser } from "@/lib/auth-context";
import { getMyProfile, updateMyProfile, ApiError } from "@/lib/api-client";

function ProfileLoading() {
  return <div className="mx-auto max-w-2xl px-4 py-12" aria-label="Loading your account" aria-busy="true"><div className="h-72 animate-pulse rounded-[2rem] bg-[#f3e5e4] motion-reduce:animate-none" /></div>;
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

  if (!hydrated || (hasBackendSession && loading)) return <ProfileLoading />;

  if (!hasBackendSession || !user) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-12 text-center sm:px-6 sm:py-20">
        <section className="rounded-[2rem] border border-[#ead8d5] bg-white/60 px-6 py-11 shadow-[0_14px_42px_rgba(96,55,62,0.07)]">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7e7e9] text-accent" aria-hidden="true"><svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c1.6-3.3 4.4-5 7.5-5s5.9 1.7 7.5 5" strokeLinecap="round"/></svg></span>
          <h1 className="mt-6 font-serif text-4xl leading-none">Your account, beautifully simple</h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">Sign in securely with Google to manage your profile and keep your wishlist private.</p>
          <Link href="/login?next=%2Fprofile" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-9 text-sm font-semibold text-white hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Continue with Google</Link>
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
      <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">Arborn member</p>
      <h1 className="mt-1 font-serif text-4xl sm:text-5xl">My Account</h1>
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
      <button type="button" onClick={() => { logOut(); router.replace("/login"); }} className="mt-5 min-h-11 w-full text-sm font-semibold text-[var(--muted)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">Log out</button>
    </div>
  );
}
