"use client";
import { useState } from "react";
import Link from "next/link";
import { MobileShell } from "~/components/ui/MobileShell";
import { TopBar } from "~/components/ui/TopBar";
import { PillButton } from "~/components/ui/PillButton";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import { ListItem } from "~/components/ui/ListItem";
import { BETS_OPEN, BETS_COMPLETED } from "~/lib/mock";

const PlusIcon = (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 6v12M6 12h12"/>
  </svg>
);

export default function BetsPage() {
  const [segment, setSegment] = useState(0);
  return (
    <MobileShell
      activeTab="bets"
      topBar={
        <TopBar
          title="Bets"
          actionSlot={
            <Link href="/bets/polls" aria-label="Bets Polls">
              {PlusIcon}
            </Link>
          }
        />
      }
    >
      <div className="p-4 pb-24">
        <SegmentedControl
          options={["Open", "Completed"]}
          value={segment}
          onChange={setSegment}
        />
        <div className="mt-1 flex flex-col gap-2">
          {segment === 0
            ? BETS_OPEN.map((b, i) => (
                <ListItem
                  key={b.title + i}
                  avatar={{ initials: b.avatarInitials }}
                  title={b.title}
                  subtitle={b.subtitle}
                  right={<PillButton>Bet</PillButton>}
                />
              ))
            : BETS_COMPLETED.map((b, i) => (
                <ListItem
                  key={b.title + i}
                  avatar={{ initials: b.avatarInitials }}
                  title={b.title}
                  subtitle={b.status}
                  right={
                    <span className={b.amount > 0 ? "text-success" : "text-danger"}>
                      {b.amount > 0 ? "+" : "-"}${Math.abs(b.amount)}
                    </span>
                  }
                />
              ))}
        </div>
      </div>
    </MobileShell>
  );
}