import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real people never fill this field.
  if (body.website) return NextResponse.json({ sent: true });

  const { name, email, event, date, location, audience, format, message } =
    body;
  if (!name?.trim() || !email?.includes("@") || !event?.trim()) {
    return NextResponse.json(
      { error: "Name, a valid email, and the event are required." },
      { status: 400 },
    );
  }

  const text = [
    `Speaking inquiry`,
    ``,
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    `Event: ${event.trim()}`,
    `Date: ${date?.trim() || "not provided"}`,
    `Location: ${location?.trim() || "not provided"}`,
    `Audience: ${audience?.trim() || "not provided"}`,
    `Format: ${format?.trim() || "not provided"}`,
    ``,
    message?.trim() || "",
  ].join("\n");

  const sent = await sendMail({
    subject: `Speaking inquiry: ${event.trim()}`,
    text,
    replyTo: email.trim(),
  });

  return NextResponse.json({ sent, body: text });
}
