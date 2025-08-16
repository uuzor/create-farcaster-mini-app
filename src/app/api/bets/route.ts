import { NextRequest, NextResponse } from "next/server";
import { kv } from "~/lib/kv";
import { Bet } from "~/lib/types";
import { randomUUID } from "crypto";
const userId = "user-demo";
function getKey(status: "open"|"completed") { return `bets:${userId}:${status}`; }

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") === "completed" ? "completed" : "open";
  const bets: Bet[] = (await kv.get(getKey(status))) || [];
  return NextResponse.json({ data: bets });
}

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { marketId, marketTitle, amount, side, notes } = body || {};
  if (!marketId || !amount || !side || !["yes", "no"].includes(side))
    return NextResponse.json({ error: "Invalid bet data" }, { status: 400 });
  const bet: Bet = {
    id: randomUUID(),
    marketId,
    marketTitle,
    userId,
    amount: Number(amount),
    side,
    status: "open",
    createdAt: new Date().toISOString(),
    notes,
  };
  const openBets: Bet[] = (await kv.get(getKey("open"))) || [];
  openBets.unshift(bet);
  await kv.set(getKey("open"), openBets);
  return NextResponse.json(bet, { status: 201 });
}