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
  let body: { marketId: string; marketTitle?: string; amount: number; side: 'yes'|'no'; notes?: string; };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { marketId, marketTitle, amount, side, notes } = body;
  if (!marketId || !amount || !side) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  // Simulate DB insert (replace with your actual db logic)
  const createdAt = new Date().toISOString();
  const bet = {
    id: Math.random().toString(16).slice(2),
    marketId,
    marketTitle,
    userId: "user1",
    amount,
    side,
    status: "open",
    createdAt,
    notes,
  };
  // For demo, you might want to write to a real DB or in-memory store
  // Here we'll just echo the bet back
  return NextResponse.json(bet, { status: 201 });
});
}