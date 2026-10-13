-- Chhun-hong letter subscribers (Cloudflare D1)
-- Run once:  npx wrangler d1 execute minnan --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS subscribers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL UNIQUE,
  source      TEXT,
  country     TEXT,
  created_at  TEXT NOT NULL,
  unsubscribed_at TEXT
);
