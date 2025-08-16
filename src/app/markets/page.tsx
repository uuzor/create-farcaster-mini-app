"use client";
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MobileShell } from "~/components/ui/MobileShell";
import { TopBar } from "~/components/ui/TopBar";
import { PillButton } from "~/components/ui/PillButton";
import { SearchBar } from "~/components/ui/SearchBar";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import { ListItem } from "~/components/ui/ListItem";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";
import { ListSkeleton } from "~/components/ui/ListSkeleton";
import { EmptyState } from "~/components/ui/EmptyState";
import { BetModal } from "~/components/ui/BetModal";

export default function MarketsPage() {
  const [segment, setSegment] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/markets/creators?search=${encodeURIComponent(debouncedSearch)}`)
      .then(res => res.json())
      .then(d => {
        setData(d.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load creators.");
        setLoading(false);
      });
  }, [debouncedSearch]);

  const handleBetSubmit = async (payload: { amount: number; side: 'yes'|'no'; notes?: string }) => {
    if (!modal) return;
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
  };

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
      <div className="p-4 pb-24 transition-opacity duration-200">
        <SearchBar placeholder="Search creators" value={search} onChange={e => setSearch(e.target.value)} />
        <SegmentedControl
          options={["Trending", "Popular", "New"]}
          value={segment}
          onChange={setSegment}
        />
        <div className="mt-1 flex flex-col gap-2">
          {loading ? (
            <ListSkeleton count={6} />
          ) : error ? (
            <div className="text-danger font-medium mb-2">{error}</div>
          ) : data.length === 0 ? (
            <EmptyState label="No creators found." />
          ) : (
            data.map((c) => (
              <ListItem
                key={c.name}
                avatar={{ initials: c.avatarInitials }}
                title={c.name}
                subtitle={`${c.followers.toLocaleString()} followers`}
                right={
                  <PillButton onClick={() => setModal({ id: `creator:${c.name}`, title: c.name })}>
                    Bet
                  </PillButton>
                }
              />
            ))
          )}
        </div>
        <BetModal
          open={!!modal}
          onClose={() => setModal(null)}
          market={modal ? { id: modal.id, title: modal.title } : undefined}
          onSubmit={async (payload) => {
            await handleBetSubmit(payload);
            setModal(null);
          }}
        />
      </div>
    </MobileShell>
  );
}, [debouncedSearch]);

  const handleBetSubmit = async (payload: { amount: number; side: 'yes'|'no'; notes?: string }) => {
    if (!modal) return;
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
  };

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
      <div className="p-4 pb-24 transition-opacity duration-200">
        <SearchBar placeholder="Search creators" value={search} onChange={e => setSearch(e.target.value)} />
        <SegmentedControl
          options={["Trending", "Popular", "New"]}
          value={segment}
          onChange={setSegment}
        />
        <div className="mt-1 flex flex-col gap-2">
          {loading ? (
            <ListSkeleton count={6} />
          ) : error ? (
            <div className="text-danger font-medium mb-2">{error}</div>
          ) : data.length === 0 ? (
            <EmptyState label="No creators found." />
          ) : (
            data.map((c) => (
              <ListItem
                key={c.name}
                avatar={{ initials: c.avatarInitials }}
                title={c.name}
                subtitle={`${c.followers.toLocaleString()} followers`}
                right={
                  <PillButton onClick={() => setModal({ id: `creator:${c.name}`, title: c.name })}>
                    Bet
                  </PillButton>
                }
              />
            ))
          )}
        </div>
        <BetModal
          open={!!modal}
          onClose={() => setModal(null)}
          market={modal ? { id: modal.id, title: modal.title } : undefined}
          onSubmit={async (payload) => {
            await handleBetSubmit(payload);
            setModal(null);
          }}
        />
      </div>
    </MobileShell>
  );
}, [debouncedQuery, segment]);

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
      <div className="p-4 pb-24 transition-opacity duration-200">
        <SearchBar
          placeholder="Search creators"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <SegmentedControl
          options={["Trending", "Popular", "New"]}
          value={segment}
          onChange={setSegment}
        />
        {loading ? (
          <ListSkeleton count={6} />
        ) : error ? (
          <div className="bg-danger/10 text-danger rounded p-2 mb-3">{error}</div>
        ) : data.length === 0 ? (
          <EmptyState label="No creators found" />
        ) : (
          <div className="mt-1 flex flex-col gap-2">
            {data.map((c) => (
              <ListItem
                key={c.name}
                avatar={{ initials: c.avatarInitials }}
                title={c.name}
                subtitle={`${c.followers.toLocaleString()} followers`}
                right={
                  <PillButton onClick={() => setBetModal({ marketId: `creator:${c.name}`, marketTitle: c.name })}>
                    Bet
                  </PillButton>
                }
              />
            ))}
          </div>
        )}
        {betModal && (
          <BetModal
            open={!!betModal}
            marketId={betModal.marketId}
            marketTitle={betModal.marketTitle}
            onClose={() => setBetModal(null)}
          />
        )}
      </div>
    </MobileShell>
  );
}