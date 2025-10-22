import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

// Helper to generate random product data (simple, deterministic-ish)
function randomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProduct(i: number) {
  const categories = [
    "Electronics",
    "Home",
    "Garden",
    "Toys",
    "Books",
    "Clothing",
  ];
  const brands = ["Acme", "Zenith", "Nimbus", "Solace", "Orion", "Hearth"];
  const nameAdjectives = ["Ultra", "Pro", "Mini", "Max", "Eco", "Smart"];

  const name = `${randomElement(nameAdjectives)} ${randomElement(
    brands
  )} Product ${Date.now().toString().slice(-4)}-${i}`;
  const description = `A ${name} from ${randomElement(
    brands
  )} in ${randomElement(categories)}.`;
  const category = randomElement(categories);
  const brand = randomElement(brands);
  const price = (Math.random() * 200 + 5).toFixed(2);
  const stock_quantity = Math.floor(Math.random() * 200);
  const sku = `SKU-${Date.now().toString().slice(-6)}-${i}`;

  return { name, description, category, brand, price, stock_quantity, sku };
}

export async function POST(request: Request) {
  // Generate 100 unique products and insert into the DB
  const products = Array.from({ length: 100 }, (_, i) =>
    generateProduct(i + 1)
  );

  // Build a parameterized insert
  // We'll use a single INSERT ... VALUES with multiple rows
  const values: any[] = [];
  const valuePlaceholders: string[] = [];
  products.forEach((p, idx) => {
    const base = idx * 7;
    valuePlaceholders.push(
      `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${
        base + 5
      }, $${base + 6}, $${base + 7})`
    );
    values.push(
      p.name,
      p.description,
      p.category,
      p.brand,
      p.price,
      p.stock_quantity,
      p.sku
    );
  });

  const query = `INSERT INTO products (name, description, category, brand, price, stock_quantity, sku) VALUES ${valuePlaceholders.join(
    ","
  )} RETURNING id`;

  try {
    await sql.query(query, values);
    return NextResponse.json({ ok: true, inserted: products.length });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
