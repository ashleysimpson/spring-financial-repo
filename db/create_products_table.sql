-- Run this in your Neon (Postgres) database to create the products table

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  brand TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sku TEXT UNIQUE
);

-- Example psql command (replace connection string):
-- psql "postgresql://<user>:<pass>@<host>:<port>/<db>?sslmode=require" -f db/create_products_table.sql
