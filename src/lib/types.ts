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
  marketTitle?: string;
  bettorAddress: string;
  outcome: number;
  amountWei: string;
  txHash?: string;
  // ...other fields
};
export type ApiResponse<T> = { data: T; error?: string };