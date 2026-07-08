import type { UserProfile } from "@/lib/types";

export default function RewardCard({ user }: { user: UserProfile }) {
  const stats = [
    { label: "Reward Points", value: user.rewardPoints.toLocaleString("en-IN") },
    { label: "Reward Level", value: user.rewardLevel },
    { label: "Total Orders", value: user.totalOrders },
    {
      label: "Member Since",
      value: new Date(user.memberSince).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      }),
    },
  ];

  return (
    <div className="rounded-2xl bg-accent p-6 text-white">
      <p className="text-xs tracking-widest text-white/70 uppercase">Arborn Rewards</p>
      <div className="mt-5 grid grid-cols-2 gap-5">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-serif text-2xl">{stat.value}</p>
            <p className="mt-0.5 text-[11px] text-white/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
