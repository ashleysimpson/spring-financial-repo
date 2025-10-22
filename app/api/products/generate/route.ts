import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Disabled for demo" },
    { status: 503 }
  );
}
