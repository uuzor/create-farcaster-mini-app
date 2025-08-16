"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MobileShell } from "~/components/ui/MobileShell";
import { TopBar } from "~/components/ui/TopBar";
import { PillButton } from "~/components/ui/PillButton";
import { SearchBar } from "~/components/ui/SearchBar";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import { ListItem } from "~/components/ui/ListItem";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";
import { BetModal } from "~/components/ui/BetModal";
import { ListSkeleton } from "~/components/ui/ListSkeleton";
import { EmptyState } from "~/components/ui/EmptyState";

export default function MarketsPage() {
  const [segment, setSegment] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetch(`/api/markets/creators?search=${encodeURIComponent(debouncedSearch)}`)
      .then(r => r.json())
      .then(resp => {
        if (!active) return;
        setData(resp.data ?? []);
        setLoading(false);
      })
      .catch(e => {
        setError("Failed to fetch creators");
        setLoading(false);
      });
    return () => { active = false; };
  }, [debouncedSearch]);

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
        <SearchBar
          placeholder="Search creators"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <SegmentedControl
          options={["Trending", "Popular", "New"]}
          value={segment}
          onChange={setSegment}
        />
        {loading ? (
          <ListSkeleton count={6} />
        ) : error ? (
          <div className="bg-danger/10 text-danger rounded p-2 mb-2">{error}</div>
        ) : data.length === 0 ? (
          <EmptyState label="No creators found." />
        ) : (
          <div className="mt-1 flex flex-col gap-2">
            {data.map((c) => (
              <ListItem
                key={c.id || c.name}
                avatar={{ initials: c.avatarInitials }}
                title={c.name}
                subtitle={`${c.followers?.toLocaleString?.() ?? c.followers} followers`}
                right={
                  <PillButton onClick={() => setModal({ id: c.id || c.name, title: c.name })}>Bet</PillButton>
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
                  marketId: modal.id,
                  marketTitle: modal.title,
                  ...payload,
                }),
              });
              const bet = await resp.json();
              window.dispatchEvent(new CustomEvent("new-bet", { detail: bet }));
              setModal(null);
            }}
          />
        )}
      </div>
    </MobileShell>
  );
}