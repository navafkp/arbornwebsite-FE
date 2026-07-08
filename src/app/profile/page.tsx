import type { Metadata } from "next";
import { user, orders } from "@/lib/data/user";
import ProfileCard from "@/components/profile/ProfileCard";
import RewardCard from "@/components/profile/RewardCard";
import OrderHistoryItem from "@/components/profile/OrderHistoryItem";
import SettingsSection from "@/components/profile/SettingsSection";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your Arborn account, orders and preferences.",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">My Account</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <ProfileCard user={user} />
          <RewardCard user={user} />
        </div>

        <div className="flex flex-col gap-12 lg:col-span-2">
          <section>
            <h2 className="mb-5 text-sm font-medium tracking-wide">Order History</h2>
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <OrderHistoryItem key={order.id} order={order} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-sm font-medium tracking-wide">Settings</h2>
            <SettingsSection addresses={user.addresses} />
          </section>
        </div>
      </div>
    </div>
  );
}
