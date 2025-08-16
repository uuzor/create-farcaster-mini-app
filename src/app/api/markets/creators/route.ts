import { NextRequest, NextResponse } from "next/server";
import { kv } from "~/lib/kv";
import { Creator } from "~/lib/types";
import { CREATOR_LIST } from "~/lib/mock";

function fuzzyMatch(q: string, name: string) {
  return name.toLowerCase().includes(q.toLowerCase());
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search")?.trim();
  let creators: Creator[] = CREATOR_LIST.map((c, i) => ({
    id: String(i + 1),
    ...c,
  }));

  // TODO: integrate Neynar API if available, fallback to fuzzy
  if (search) {
    creators = creators.filter((c) => fuzzyMatch(search, c.name));
  }
  return NextResponse.json({ data: creators });
}