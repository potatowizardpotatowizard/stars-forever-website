import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { addConstellationRequest } from "@/lib/notion";

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real people never fill this field.
  if (body.website) return NextResponse.json({ sent: true });

  const { name, email, handle, city, country, note, consent } = body;
  if (!name?.trim() || !email?.includes("@") || !city?.trim()) {
    return NextResponse.json(
      { error: "Name, a valid email, and your city are required." },
      { status: 400 },
    );
  }
  if (consent !== "yes") {
    return NextResponse.json(
      { error: "The map consent box is required to join." },
      { status: 400 },
    );
  }

  const text = [
    `Constellation request`,
    ``,
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    `Channel: ${handle?.trim() || "not provided"}`,
    `City: ${city.trim()}`,
    `Country: ${country?.trim() || "not provided"}`,
    `Consented to public map: yes`,
    ``,
    note?.trim() || "",
  ].join("\n");

  const [sent, stored] = await Promise.all([
    sendMail({
      subject: `Constellation request: ${name.trim()} (${city.trim()})`,
      text,
      replyTo: email.trim(),
    }),
    addConstellationRequest({
      name: name.trim(),
      email: email.trim(),
      handle: handle?.trim() || undefined,
      city: city.trim(),
      country: country?.trim() || undefined,
      note: note?.trim() || undefined,
    }),
  ]);

  return NextResponse.json({ sent, stored, body: text });
}
