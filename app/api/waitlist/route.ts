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

  const { name, email, handle, list } = body;
  if (!name?.trim() || !email?.includes("@")) {
    return NextResponse.json(
      { error: "Name and a valid email are required." },
      { status: 400 },
    );
  }

  const listName = list?.trim() || "Revolutionary Cohort 2";
  const text = [
    `${listName} waitlist signup`,
    ``,
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    `Channel: ${handle?.trim() || "not provided"}`,
  ].join("\n");

  const sent = await sendMail({
    subject: `${listName} waitlist: ${name.trim()}`,
    text,
    replyTo: email.trim(),
  });

  return NextResponse.json({ sent, body: text });
}
