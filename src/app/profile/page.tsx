import type { Metadata } from "next";
import ProfilePageClient from "@/components/profile/ProfilePageClient";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your Arborn account, orders and preferences.",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
