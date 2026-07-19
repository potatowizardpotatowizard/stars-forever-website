import { NextResponse } from "next/server";
import { addLight } from "@/lib/notion";

// One anonymous point of light per tap. No names, no messages, no
// tracking: just coordinates in a shared sky.
export async function POST(request: Request) {
  let body: { x?: unknown; y?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const x = Number(body.x);
  const y = Number(body.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return NextResponse.json({ error: "Invalid light" }, { status: 400 });
  }
  const ok = await addLight(
    Math.min(1, Math.max(0, x)),
    Math.min(1, Math.max(0, y)),
  );
  return NextResponse.json({ ok });
}
