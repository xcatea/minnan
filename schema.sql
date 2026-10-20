-- minnan.org database (Cloudflare D1). Safe to run more than once:
--   D1 console → paste this file → Execute
-- or: npx wrangler d1 execute minnan --remote --file=schema.sql

-- Chhun-hong letter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL UNIQUE,
  source      TEXT,
  country     TEXT,
  created_at  TEXT NOT NULL,
  unsubscribed_at TEXT
);

-- Order requests and service enquiries from the shop
CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ref         TEXT NOT NULL UNIQUE,
  item        TEXT NOT NULL,
  qty         INTEGER NOT NULL DEFAULT 1,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  im          TEXT,
  country     TEXT,
  message     TEXT,
  visitor_country TEXT,
  status      TEXT NOT NULL DEFAULT 'new',   -- new → confirmed → paid → shipped → done / cancelled
  amount_usd  REAL,
  note        TEXT,
  created_at  TEXT NOT NULL
);

-- Chat rate limiting and a daily count (no message text is stored)
CREATE TABLE IF NOT EXISTS chat_usage (
  bucket      TEXT PRIMARY KEY,
  n           INTEGER NOT NULL DEFAULT 0
);

-- Questions asked in the 問 panel, first message only, to learn what people want.
-- Turn off by setting CHAT_LOG_QUESTIONS=0.
CREATE TABLE IF NOT EXISTS chat_questions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  question    TEXT NOT NULL,
  page        TEXT,
  visitor_country TEXT,
  created_at  TEXT NOT NULL
);
