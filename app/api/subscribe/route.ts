import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ sent: true });

  const email = body.email?.trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }

  const sent = await sendMail({
    subject: `New mission updates subscriber`,
    text: `Add to the mission updates list:\n\n${email}`,
    replyTo: email,
  });

  return NextResponse.json({ sent });
}
