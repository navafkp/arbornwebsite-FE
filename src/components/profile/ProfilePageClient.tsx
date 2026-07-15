"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getMyProfile, updateMyProfile } from "@/lib/api-client";
import { user as mockUser, orders } from "@/lib/data/user";
import ProfileCard from "@/components/profile/ProfileCard";
import RewardCard from "@/components/profile/RewardCard";
import OrderPhotoGrid from "@/components/profile/OrderPhotoGrid";
import SettingsSection from "@/components/profile/SettingsSection";

export default function ProfilePageClient() {
  const router = useRouter();
  const { isLoggedIn, user: authUser, accessToken, hasBackendSession, logOut, setUser } = useAuth();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!hasBackendSession || !accessToken) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSyncing(true);
    getMyProfile(accessToken)
      .then((profile) => {
        setUser({
          id: profile.id,
          name: profile.name || `${profile.first_name} ${profile.last_name}`.trim(),
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          phone: authUser?.phone || "",
          avatar: profile.profile_image,
        });
      })
      .catch(() => {
        // keep last-known local user if the refresh fails
      })
      .finally(() => setSyncing(false));
    // Only re-sync when the backend session identity changes, not on every
    // local user edit (that would refetch right after a save and overwrite it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasBackendSession, accessToken]);

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-24 text-center sm:px-6">
        <svg className="h-12 w-12 text-black/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20c1.6-3.3 4.4-5 7.5-5s5.9 1.7 7.5 5" strokeLinecap="round" />
        </svg>
        <h1 className="mt-5 font-serif text-2xl">Log in to view your account</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sign in to see your orders, rewards and saved details.
        </p>
        <div className="mt-6 flex w-full flex-col gap-3">
          <Link
            href="/login"
            className="rounded-full bg-accent py-3 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-black/15 py-3 text-xs font-medium tracking-widest uppercase transition hover:border-black"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const displayUser = {
    ...mockUser,
    name: authUser?.name || mockUser.name,
    phone: authUser?.phone || mockUser.phone,
    email: authUser?.email || mockUser.email,
    avatar: authUser?.avatar || mockUser.avatar,
  };

  async function handleSave(data: { name: string; email: string; phone: string }) {
    if (hasBackendSession && accessToken) {
      const [firstName, ...rest] = data.name.trim().split(" ");
      await updateMyProfile(accessToken, {
        first_name: firstName,
        last_name: rest.join(" "),
      });
    }
    setUser({ ...(authUser ?? { name: "", phone: "", email: "" }), ...data });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">
        My Account{syncing && <span className="ml-2 text-xs font-sans text-[var(--muted)]">Syncing…</span>}
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <ProfileCard user={displayUser} onSave={handleSave} />
          <RewardCard user={displayUser} />
          <OrderPhotoGrid orders={orders} />
          <button
            type="button"
            onClick={() => {
              logOut();
              router.push("/");
            }}
            className="rounded-full border border-black/15 py-3 text-xs font-medium tracking-widest uppercase transition hover:border-black"
          >
            Log Out
          </button>
        </div>

        <div className="flex flex-col gap-12 lg:col-span-2">
          <section>
            <h2 className="mb-5 text-sm font-medium tracking-wide">Settings</h2>
            <SettingsSection addresses={displayUser.addresses} />
          </section>
        </div>
      </div>
    </div>
  );
}
