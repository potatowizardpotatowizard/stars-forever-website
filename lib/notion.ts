// Constellation requests land as rows in a Notion database so new
// people can be reviewed and accepted from Notion. Mirrors the mail
// pattern: when NOTION_TOKEN or NOTION_DATABASE_ID is not configured
// this is a quiet no-op and the email path still carries the request.
//
// Expected database properties:
//   Name (title), Email (email), Channel (url), City (rich_text),
//   Country (rich_text), Note (rich_text), Status (select)

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
