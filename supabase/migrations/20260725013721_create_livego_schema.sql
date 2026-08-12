/*
# Live Go — initial schema (single-tenant, no auth)

## Purpose
Live Go is a trip-planning app for live concert / festival fans. It combines a
packing checklist and a budget tracker in one screen so fans can see where their
money goes (transport, lodging, food, goods) and prepare for day-trips or
overnight tours. The app has no sign-in screen, so this is a single-tenant
schema: the anon-key client reads and writes its own shared data.

## New Tables
- `trips`
  - `id` (uuid, PK)
  - `title` (text, not null) — e.g. "Tokyo Dome Live"
  - `trip_date` (date, nullable) — the day of the live
  - `trip_type` (text, not null, default 'day') — 'day' | 'overnight' | 'festival'
  - `budget_limit` (integer, nullable) — optional spending cap in yen
  - `created_at` (timestamptz, default now())
- `packing_items`
  - `id` (uuid, PK)
  - `trip_id` (uuid, FK -> trips.id ON DELETE CASCADE)
  - `name` (text, not null)
  - `category` (text, not null, default 'essentials')
    — essentials | tickets | electronics | clothes | toiletries | optional
  - `checked` (boolean, not null, default false)
  - `sort_order` (integer, not null, default 0)
  - `created_at` (timestamptz, default now())
- `budget_items`
  - `id` (uuid, PK)
  - `trip_id` (uuid, FK -> trips.id ON DELETE CASCADE)
  - `label` (text, not null) — e.g. "Shinkansen round trip"
  - `category` (text, not null, default 'transport')
    — transport | lodging | food | goods | other
  - `amount` (integer, not null, default 0) — yen amount
  - `created_at` (timestamptz, default now())

## Security
- RLS enabled on all three tables.
- Single-tenant: policies are `TO anon, authenticated` with `USING (true)` /
  `WITH CHECK (true)` because the data is intentionally shared within this
  no-auth app. This is documented and intentional, not a fallback.

## Important Notes
1. `ON DELETE CASCADE` on the child tables so deleting a trip removes its
   packing list and budget items automatically.
2. Amounts are stored as integer yen (no decimals) to avoid float rounding.
3. `trip_type` drives the auto-generated packing template when a new trip is
   created on the client.
4. Idempotent: uses `IF NOT EXISTS` and drops policies before re-creating.
*/

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  trip_date date,
  trip_type text NOT NULL DEFAULT 'day'
    CHECK (trip_type IN ('day', 'overnight', 'festival')),
  budget_limit integer,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS packing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'essentials'
    CHECK (category IN ('essentials','tickets','electronics','clothes','toiletries','optional')),
  checked boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  label text NOT NULL,
  category text NOT NULL DEFAULT 'transport'
    CHECK (category IN ('transport','lodging','food','goods','other')),
  amount integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_packing_items_trip_id ON packing_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_trip_id ON budget_items(trip_id);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

-- trips policies
DROP POLICY IF EXISTS "anon_select_trips" ON trips;
CREATE POLICY "anon_select_trips" ON trips FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_trips" ON trips;
CREATE POLICY "anon_insert_trips" ON trips FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_trips" ON trips;
CREATE POLICY "anon_update_trips" ON trips FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_trips" ON trips;
CREATE POLICY "anon_delete_trips" ON trips FOR DELETE
  TO anon, authenticated USING (true);

-- packing_items policies
DROP POLICY IF EXISTS "anon_select_packing_items" ON packing_items;
CREATE POLICY "anon_select_packing_items" ON packing_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_packing_items" ON packing_items;
CREATE POLICY "anon_insert_packing_items" ON packing_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_packing_items" ON packing_items;
CREATE POLICY "anon_update_packing_items" ON packing_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_packing_items" ON packing_items;
CREATE POLICY "anon_delete_packing_items" ON packing_items FOR DELETE
  TO anon, authenticated USING (true);

-- budget_items policies
DROP POLICY IF EXISTS "anon_select_budget_items" ON budget_items;
CREATE POLICY "anon_select_budget_items" ON budget_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_budget_items" ON budget_items;
CREATE POLICY "anon_insert_budget_items" ON budget_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_budget_items" ON budget_items;
CREATE POLICY "anon_update_budget_items" ON budget_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_budget_items" ON budget_items;
CREATE POLICY "anon_delete_budget_items" ON budget_items FOR DELETE
  TO anon, authenticated USING (true);