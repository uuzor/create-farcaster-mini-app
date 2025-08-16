import { NextRequest, NextResponse } from "next/server";
import { kv } from "~/lib/kv";
import { Bet } from "~/lib/types";
import { randomUUID } from "crypto";

// Use a mock user for now
const userId = "user-demo";

function getKey(status: "open" | "completed") {
  return `bets:${userId}:${status}`;
}

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") as "open" | "completed";
  if (!status || (status !== "open" && status !== "completed")) {
    return NextResponse.json({ data: [], error: "Invalid status" }, { status: 400 });
  }
  let bets: Bet[] = (await kv.get(getKey(status))) || [];
  return NextResponse.json({ data: bets });
}

export async function POST(req: NextRequest) {
  const { marketId, amount, side, notes } = await req.json();
  if (!marketId || !amount || !side || !["yes", "no"].includes(side)) {
    return NextResponse.json({ error: "Invalid bet data" }, { status: 400 });
  }
  const bet: Bet = {
    id: randomUUID(),
    marketId,
    userId,
    amount: Number(amount),
    side,
    status: "open",
    createdAt: new Date().toISOString(),
    notes,
  };
  let openBets: Bet[] = (await kv.get(getKey("open"))) || [];
  openBets.unshift(bet);
  await kv.set(getKey("open"), openBets);
  return NextResponse.json(bet);
}