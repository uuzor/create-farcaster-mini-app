"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MobileShell } from "~/components/ui/MobileShell";
import { TopBar } from "~/components/ui/TopBar";
import { PillButton } from "~/components/ui/PillButton";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import { ListItem } from "~/components/ui/ListItem";
import { BetModal } from "~/components/ui/BetModal";
import { ListSkeleton } from "~/components/ui/ListSkeleton";
import { EmptyState } from "~/components/ui/EmptyState";

const PlusIcon = (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 6v12M6 12h12"/>
  </svg>
);

export default function BetsPage() {
  const [segment, setSegment] = useState(0);
  const [openBets, setOpenBets] = useState<any[]>([]);
  const [completedBets, setCompletedBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ marketId: string; marketTitle: string } | null>(null);

  // Fetch bets when segment changes
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetch(`/api/bets?status=${segment === 0 ? "open" : "completed"}`)
      .then(r => r.json())
      .then(resp => {
        if (!active) return;
        if (segment === 0) setOpenBets(resp.data || []);
        else setCompletedBets(resp.data || []);
        setLoading(false);
      })
      .catch(e => {
        setError("Failed to fetch bets");
        setLoading(false);
      });
    return () => { active = false; };
    // eslint-disable-next-line
  }, [segment]);

  // Listen for new-bet events
  useEffect(() => {
    function handleNewBet(e: any) {
      if (segment === 0 && e.detail) {
        setOpenBets(prev => [e.detail, ...prev]);
      }
    }
    window.addEventListener("new-bet", handleNewBet);
    return () => window.removeEventListener("new-bet", handleNewBet);
  }, [segment]);

  const list = segment === 0 ? openBets : completedBets;

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
        {loading ? (
          <ListSkeleton count={6} />
        ) : error ? (
          <div className="bg-danger/10 text-danger rounded p-2 mb-2">{error}</div>
        ) : list.length === 0 ? (
          <EmptyState label={segment === 0 ? "No open bets." : "No completed bets."} />
        ) : (
          <div className="mt-1 flex flex-col gap-2">
            {list.map((b, i) => (
              <ListItem
                key={b.id || i}
                avatar={{ initials: b.marketTitle?.charAt(0) || "?" }}
                title={b.marketTitle || b.title}
                subtitle={segment === 0 ? b.notes : b.status}
                right={
                  segment === 0 ? (
                    <PillButton onClick={() => setModal({ marketId: b.marketId, marketTitle: b.marketTitle })}>Bet</PillButton>
                  ) : (
                    <span className={b.amount > 0 ? "text-success" : "text-danger"}>
                      {b.amount > 0 ? "+" : "-"}${Math.abs(b.amount)}
                    </span>
                  )
                }
              />
            ))}
          </div>
        )}
        {modal && (
          <BetModal
            open={!!modal}
            onClose={() => setModal(null)}
            market={modal}
            onSubmit={async (payload) => {
              const resp = await fetch("/api/bets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  marketId: modal.marketId,
                  marketTitle: modal.marketTitle,
                  ...payload,
                }),
              });
              const bet = await resp.json();
              window.dispatchEvent(new CustomEvent("new-bet", { detail: bet }));
              setModal(null);
              setOpenBets(prev => [bet, ...prev]);
            }}
          />
        )}
      </div>
    </MobileShell>
  );
}