import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("q") || "";
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit") || "10"))
  );
  const offset = (page - 1) * limit;

  // Build WHERE clause for all fields
  let where = "";
  let params: any[] = [];
  if (search) {
    where = `WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1 OR brand ILIKE $1 OR CAST(price AS TEXT) ILIKE $1 OR CAST(stock_quantity AS TEXT) ILIKE $1 OR sku ILIKE $1`;
    params.push(`%${search}%`);
  }

  try {
    // Get total count
    const countQuery = `SELECT COUNT(*) FROM products ${where}`;
    const countResult = await sql.query(countQuery, params);
    const total = parseInt((countResult as any)[0]?.count || "0", 10);

    // Get paginated results
    let dataQuery = `SELECT id, name, description, category, brand, price, stock_quantity, sku FROM products ${where} ORDER BY id ASC LIMIT $${
      params.length + 1
    } OFFSET $${params.length + 2}`;
    const dataParams = [...params, limit, offset];
    const result = await sql.query(dataQuery, dataParams);
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
