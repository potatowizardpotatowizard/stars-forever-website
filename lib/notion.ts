// Constellation requests land as rows in a Notion database so new
// people can be reviewed and accepted from Notion. Mirrors the mail
// pattern: when NOTION_TOKEN or NOTION_DATABASE_ID is not configured
// this is a quiet no-op and the email path still carries the request.
//
// Notion is also the map's source of truth: rows whose Status is
// "Accepted" become stars on the Constellation map, geocoded from
// their city. Flipping the select in Notion is the whole workflow.
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
  city: string;
  country: string;
  lat: number;
  lng: number;
};

// City name to coordinates via the free Open-Meteo geocoder. Results
// are cached for a day; a city that cannot be resolved is skipped
// rather than mapped wrong.
async function geocode(
  city: string,
  country: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en`,
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

// The Wall of Light: every anonymous tap on /lights becomes a row.
// Coordinates are 0..1 fractions of the sky.
export async function addLight(x: number, y: number): Promise<boolean> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_LIGHTS_DB_ID;
  if (!token || !databaseId) return false;
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: NOTION_HEADERS(token),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Light: { title: [{ text: { content: "light" } }] },
        X: { number: Math.round(x * 1000) / 1000 },
        Y: { number: Math.round(y * 1000) / 1000 },
      },
    }),
  });
  return res.ok;
}

export async function getLights(): Promise<{
  points: { x: number; y: number }[];
  count: number;
  capped: boolean;
}> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_LIGHTS_DB_ID;
  if (!token || !databaseId) return { points: [], count: 0, capped: false };
  const points: { x: number; y: number }[] = [];
  let cursor: string | undefined;
  let pages = 0;
  try {
    // Paginate up to 1,000 lights; beyond that the count shows as "+".
    while (pages < 10) {
      const res = await fetch(
        `https://api.notion.com/v1/databases/${databaseId}/query`,
        {
          method: "POST",
          headers: NOTION_HEADERS(token),
          body: JSON.stringify({
            page_size: 100,
            ...(cursor ? { start_cursor: cursor } : {}),
          }),
          cache: "no-store",
        },
      );
      if (!res.ok) break;
      const data = await res.json();
      for (const row of data.results ?? []) {
        const x = row.properties?.X?.number;
        const y = row.properties?.Y?.number;
        if (typeof x === "number" && typeof y === "number") {
          points.push({ x, y });
        }
      }
      pages += 1;
      if (!data.has_more) return { points, count: points.length, capped: false };
      cursor = data.next_cursor;
    }
    return { points, count: points.length, capped: true };
  } catch {
    return { points, count: points.length, capped: false };
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
      const city: string | undefined =
        p.City?.rich_text?.[0]?.plain_text?.trim();
      const country: string =
        p.Country?.rich_text?.[0]?.plain_text?.trim() ?? "";
      if (!name || !city) continue;
      const geo = await geocode(city, country);
      if (!geo) continue;
      members.push({
        name,
        href: p.Channel?.url ?? null,
        city,
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
  city,
  country,
  note,
}: {
  name: string;
  email: string;
  handle?: string;
  city: string;
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
        City: text(city),
        ...(country ? { Country: text(country) } : {}),
        ...(note ? { Note: text(note.slice(0, 1900)) } : {}),
        Status: { select: { name: "New" } },
      },
    }),
  });
  return res.ok;
}
