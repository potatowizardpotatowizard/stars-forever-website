import { NextResponse } from "next/server";

// Temporary diagnostic: reports what the production server sees when
// it asks Notion for constellation members. No secrets are returned.
// Remove after debugging.
export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  const out: Record<string, unknown> = {
    hasToken: !!token,
    tokenLen: token?.length ?? 0,
    hasDb: !!databaseId,
    dbLen: databaseId?.length ?? 0,
  };
  if (token && databaseId) {
    try {
      const res = await fetch(
        `https://api.notion.com/v1/databases/${databaseId}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: { property: "Status", select: { equals: "Accepted" } },
            page_size: 100,
          }),
          cache: "no-store",
        },
      );
      out.notionStatus = res.status;
      if (res.ok) {
        const data = await res.json();
        out.rows = (data.results ?? []).length;
      } else {
        const err = await res.json().catch(() => ({}));
        out.notionError = err?.code ?? "unknown";
      }
    } catch (e) {
      out.notionThrew = String(e).slice(0, 120);
    }
    try {
      const g = await fetch(
        "https://geocoding-api.open-meteo.com/v1/search?name=California&count=1&language=en",
        { cache: "no-store" },
      );
      out.geocodeStatus = g.status;
    } catch (e) {
      out.geocodeThrew = String(e).slice(0, 120);
    }
  }
  return NextResponse.json(out);
}
