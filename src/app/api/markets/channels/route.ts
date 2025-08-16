import { NextRequest, NextResponse } from "next/server";
import { kv } from "~/lib/kv";
import { Channel } from "~/lib/types";
import { CHANNELS } from "~/lib/mock";

function fuzzyMatch(q: string, name: string) {
  return name.toLowerCase().includes(q.toLowerCase());
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search")?.trim();
  let channels: Channel[] = CHANNELS.map((c, i) => ({
    id: String(i + 1),
    ...c,
  }));

  if (search) {
    channels = channels.filter((c) => fuzzyMatch(search, c.name));
  }
  return NextResponse.json({ data: channels });
}