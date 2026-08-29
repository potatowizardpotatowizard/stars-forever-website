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

  const { name, email, handle, state, country, note, consent } = body;
  if (!name?.trim() || !email?.includes("@") || !state?.trim()) {
    return NextResponse.json(
      { error: "Name, a valid email, and your state are required." },
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
    `State: ${state.trim()}`,
    `Country: ${country?.trim() || "not provided"}`,
    `Consented to public map: yes`,
    ``,
    note?.trim() || "",
  ].join("\n");

  const [sent, stored] = await Promise.all([
    sendMail({
      subject: `Constellation request: ${name.trim()} (${state.trim()})`,
      text,
      replyTo: email.trim(),
    }),
    addConstellationRequest({
      name: name.trim(),
      email: email.trim(),
      handle: handle?.trim() || undefined,
      state: state.trim(),
      country: country?.trim() || undefined,
      note: note?.trim() || undefined,
    }),
  ]);

  return NextResponse.json({ sent, stored, body: text });
}
