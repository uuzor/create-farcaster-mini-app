export type Creator = {
  id: string;
  name: string;
  followers: number;
  avatarInitials: string;
};
export type Channel = {
  id: string;
  name: string;
  followers: number;
  growth: number;
  avatarInitials: string;
};
export type Bet = {
  id: string;
  marketId: string;
  userId: string;
  amount: number;
  side: "yes" | "no";
  status: "open" | "completed";
  result?: "won" | "lost";
  payout?: number;
  createdAt: string;
  notes?: string;
};
export type ApiResponse<T> = { data: T; error?: string };