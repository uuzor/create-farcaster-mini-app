"use client";
import { MobileShell } from "~/components/ui/MobileShell";
import { TopBar } from "~/components/ui/TopBar";
import { ProgressBar } from "~/components/ui/ProgressBar";
import { PillButton } from "~/components/ui/PillButton";
import { POLL_BETS } from "~/lib/mock";

export default function BetsPollsPage() {
  return (
    <MobileShell
      activeTab="bets"
      topBar={<TopBar title="Bets" backHref="/bets" />}
    >
      <div className="p-4 pb-24 flex flex-col gap-4">
        {POLL_BETS.map((poll, i) => (
          <div key={poll.question + i} className="bg-card rounded-md p-4 border border-borderSubtle shadow">
            <div className="font-semibold mb-1">{poll.question}</div>
            <div className="text-textSecondary mb-2">Poll by {poll.handle}</div>
            <ProgressBar percent={poll.percent} />
            <div className="flex justify-between mt-2 mb-1">
              <span className="font-semibold">Yes</span>
              <span className="text-textSecondary">{poll.yesOdds}x</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">No</span>
              <span className="text-textSecondary">{poll.noOdds}x</span>
            </div>
            <div className="text-xs text-textSecondary mb-2">
              {poll.percent}% voted &bull; {poll.time} left
            </div>
            <PillButton className="w-full">Place Bet</PillButton>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}