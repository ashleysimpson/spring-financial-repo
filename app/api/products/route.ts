import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit") || "100"))
  );
  const offset = (page - 1) * limit;

  try {
    const result = await sql.query(
      `SELECT id, name, description, category, brand, price, stock_quantity, sku FROM products ORDER BY id ASC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    // neon client may return rows or an array depending on the driver shape
    const rows = (result as any).rows ?? result;
    return NextResponse.json({ ok: true, data: rows });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
