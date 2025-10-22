import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const limit = Math.min(
    20,
    Math.max(1, Number(url.searchParams.get("limit") || "20"))
  );
  const offset = (page - 1) * limit;

  try {
    // Get total count
    const countResult = await sql.query("SELECT COUNT(*) FROM products");
    const total = parseInt((countResult as any)[0]?.count || "0", 10);

    // Get paginated results
    const result = await sql.query(
      `SELECT id, name, description, category, brand, price, stock_quantity, sku FROM products ORDER BY id ASC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const rows = (result as any).rows ?? result;
    return NextResponse.json({ ok: true, data: rows, total });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
