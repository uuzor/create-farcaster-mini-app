"use client";
"use client";
import { useState } from "react";
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
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [betModal, setBetModal] = useState<{ marketId: string; marketTitle: string } | null>(null);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch creators on debouncedQuery or segment change
  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/markets/creators?search=${encodeURIComponent(debouncedQuery)}&tab=${segment}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch creators");
        const d = await res.json();
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
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