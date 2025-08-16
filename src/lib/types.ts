export type Bet = {
  id: string;
  marketId: string;
  marketTitle?: string;
  userId: string;
  amount: number;
  side: "yes" | "no";
  status: "open" | "completed";
  result?: "won" | "lost";
  payout?: number;
  createdAt: string;
  notes?: string;
};