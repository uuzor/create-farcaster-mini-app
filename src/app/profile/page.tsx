"use client";
import Image from "next/image";
import { MobileShell } from "~/components/ui/MobileShell";
import { TopBar } from "~/components/ui/TopBar";
import { StatCard } from "~/components/ui/StatCard";
import { ListItem } from "~/components/ui/ListItem";
import { PROFILE_HISTORY } from "~/lib/mock";

export default function ProfilePage() {
  return (
    <MobileShell
      activeTab="profile"
      topBar={<TopBar title="Profile" />}
    >
      <div className="p-4 pb-24 flex flex-col items-center">
        <Image
          src="/avatars/avatar1.svg"
          alt="Profile Avatar"
          width={72}
          height={72}
          className="rounded-full border-2 border-accent mb-2"
        />
        <div className="font-bold text-lg mt-1">Ava Lane</div>
        <div className="text-textSecondary">@avalane</div>
        <div className="text-textSecondary mb-2">Joined Jan 2024</div>
        <div className="flex gap-3 w-full mb-4 justify-center">
          <StatCard value={23} label="Bets" />
          <StatCard value={14} label="Wins" />
          <StatCard value={9} label="Losses" />
        </div>
        <div className="font-semibold text-base mb-2 w-full">Betting History</div>
        <div className="w-full flex flex-col gap-2">
          {PROFILE_HISTORY.map((h, i) => (
            <ListItem
              key={h.title + i}
              avatar={{ initials: h.title.charAt(0) }}
              title={h.title}
              subtitle={h.status}
              right={
                <span className={h.amount > 0 ? "text-success" : "text-danger"}>
                  {h.amount > 0 ? "+" : "-"}${Math.abs(h.amount)}
                </span>
              }
            />
          ))}
        </div>
      </div>
    </MobileShell>
  );
}