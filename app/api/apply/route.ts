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

  const { name, email, platform, audience, dream } = body;
  if (!name?.trim() || !email?.includes("@") || !dream?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and your God dream are required." },
      { status: 400 },
    );
  }

  const text = [
    `Partner Project application`,
    ``,
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    `Platform: ${platform?.trim() || "not provided"}`,
    `Audience: ${audience?.trim() || "not provided"}`,
    ``,
    `The God dream:`,
    dream.trim(),
  ].join("\n");

  const sent = await sendMail({
    subject: `Partner Project application: ${name.trim()}`,
    text,
    replyTo: email.trim(),
  });

  return NextResponse.json({ sent, body: text });
}
