// Constellation requests land as rows in a Notion database so new
// people can be reviewed and accepted from Notion. Mirrors the mail
// pattern: when NOTION_TOKEN or NOTION_DATABASE_ID is not configured
// this is a quiet no-op and the email path still carries the request.
//
// Notion is also the map's source of truth: rows whose Status is
// "Accepted" become stars on the Constellation map, geocoded from
// their state or region. Flipping the select in Notion is the whole
// workflow. The City column holds the state/region value.
//
// Expected database properties:
//   Name (title), Email (email), Channel (url), City (rich_text),
//   Country (rich_text), Note (rich_text), Status (select)

const NOTION_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
});

export type AcceptedMember = {
  name: string;
  href: string | null;
  state: string;
  country: string;
  lat: number;
  lng: number;
};

// Place name (state, region, or city) to coordinates via the free
// Open-Meteo geocoder. Results are cached for a day; a place that
// cannot be resolved is skipped rather than mapped wrong.
async function geocode(
  place: string,
  country: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=5&language=en`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const results: {
      latitude: number;
      longitude: number;
      country?: string;
      country_code?: string;
    }[] = data.results ?? [];
    if (!results.length) return null;
    const want = country.trim().toLowerCase();
    const aliases: Record<string, string> = {
      usa: "united states",
      us: "united states",
      uk: "united kingdom",
      uae: "united arab emirates",
    };
    const wanted = aliases[want] ?? want;
    const match = wanted
      ? results.find(
          (r) =>
            r.country?.toLowerCase().includes(wanted) ||
            r.country_code?.toLowerCase() === wanted,
        )
      : undefined;
    const hit = match ?? results[0];
    return { lat: hit.latitude, lng: hit.longitude };
  } catch {
    return null;
  }
}

export async function getAcceptedMembers(): Promise<AcceptedMember[]> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) return [];
  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: NOTION_HEADERS(token),
        body: JSON.stringify({
          filter: { property: "Status", select: { equals: "Accepted" } },
          page_size: 100,
        }),
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const members: AcceptedMember[] = [];
    for (const row of data.results ?? []) {
      const p = row.properties ?? {};
      const name: string | undefined = p.Name?.title?.[0]?.plain_text?.trim();
      // the City column carries the state/region value
      const state: string | undefined =
        p.City?.rich_text?.[0]?.plain_text?.trim();
      const country: string =
        p.Country?.rich_text?.[0]?.plain_text?.trim() ?? "";
      if (!name || !state) continue;
      const geo = await geocode(state, country);
      if (!geo) continue;
      members.push({
        name,
        href: p.Channel?.url ?? null,
        state,
        country,
        lat: geo.lat,
        lng: geo.lng,
      });
    }
    return members;
  } catch {
    return [];
  }
}

export async function addConstellationRequest({
  name,
  email,
  handle,
  state,
  country,
  note,
}: {
  name: string;
  email: string;
  handle?: string;
  state: string;
  country?: string;
  note?: string;
}): Promise<boolean> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) return false;

  const text = (s: string) => ({ rich_text: [{ text: { content: s } }] });
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email },
        ...(handle
          ? {
              Channel: {
                url: handle.startsWith("http") ? handle : `https://${handle}`,
              },
            }
          : {}),
        // the City column holds the state/region value
        City: text(state),
        ...(country ? { Country: text(country) } : {}),
        ...(note ? { Note: text(note.slice(0, 1900)) } : {}),
        Status: { select: { name: "New" } },
      },
    }),
  });
  return res.ok;
}
