"use client";
import { useState } from "react";
import { MobileShell } from "~/components/ui/MobileShell";
import { TopBar } from "~/components/ui/TopBar";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import { ListItem } from "~/components/ui/ListItem";
import { PillButton } from "~/components/ui/PillButton";
import { TimeTiles } from "~/components/ui/TimeTiles";
import { CHANNELS } from "~/lib/mock";

export default function FarcasterMarketsPage() {
  const [segment, setSegment] = useState(0);

  return (
    <MobileShell
      activeTab="markets"
      topBar={<TopBar title="Farcaster Bets" backHref="/markets" />}
    >
      <div className="p-4 pb-24">
        <div className="mb-1">
          <div className="font-bold text-xl">Channel Growth Bets</div>
          <div className="text-textSecondary text-base">
            Bet on which Farcaster channels will grow fastest this week.
          </div>
        </div>
        <SegmentedControl
          options={["Followers", "Engagement", "Other"]}
          value={segment}
          onChange={setSegment}
        />
        <div className="mt-1 flex flex-col gap-2">
          {CHANNELS.map((c) => (
            <ListItem
              key={c.name}
              avatar={{ initials: c.avatarInitials }}
              title={c.name}
              subtitle={`${c.followers.toLocaleString()} followers`}
              right={
                <span className="font-semibold text-success">+{c.growth}%</span>
              }
            />
          ))}
        </div>
        <TimeTiles
          tiles={[
            { label: "Days", value: "2" },
            { label: "Hours", value: "12" },
            { label: "Minutes", value: "30" },
            { label: "Seconds", value: "45" },
            { label: "Bonus", value: "1" },
          ]}
        />
        <PillButton className="w-full mt-4">Place Bet</PillButton>
      </div>
    </MobileShell>
  );
}