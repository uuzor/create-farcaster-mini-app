"use client";
import { useState } from "react";
import Link from "next/link";
import { MobileShell } from "~/components/ui/MobileShell";
import { TopBar } from "~/components/ui/TopBar";
import { PillButton } from "~/components/ui/PillButton";
import { SearchBar } from "~/components/ui/SearchBar";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import { ListItem } from "~/components/ui/ListItem";
import { CREATOR_LIST } from "~/lib/mock";

export default function MarketsPage() {
  const [segment, setSegment] = useState(0);

  return (
    <MobileShell
      activeTab="markets"
      topBar={
        <TopBar
          title="Creator Bets"
          actionSlot={
            <Link href="/markets/farcaster">
              <PillButton className="px-3 py-1 text-sm">Farcaster</PillButton>
            </Link>
          }
        />
      }
    >
      <div className="p-4 pb-24">
        <SearchBar placeholder="Search creators" />
        <SegmentedControl
          options={["Trending", "Popular", "New"]}
          value={segment}
          onChange={setSegment}
        />
        <div className="mt-1 flex flex-col gap-2">
          {CREATOR_LIST.map((c) => (
            <ListItem
              key={c.name}
              avatar={{ initials: c.avatarInitials }}
              title={c.name}
              subtitle={`${c.followers.toLocaleString()} followers`}
              right={<PillButton>Bet</PillButton>}
            />
          ))}
        </div>
      </div>
    </MobileShell>
  );
}