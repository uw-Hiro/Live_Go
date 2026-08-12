/*
# Add location column to trips

## Changes
- Added `location` (text, nullable) to `trips` — stores the venue name or
  address for the live, used to display an embedded Google Map, compute
  straight-line distance from the user's current location, and link to
  Google Maps turn-by-turn route directions.

## Notes
- Nullable so existing trips are unaffected; they simply have no map.
- Idempotent via DO $$ ... IF NOT EXISTS ... END $$.
- No RLS policy changes needed — existing anon/authenticated policies on
  trips already cover the new column.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'location'
  ) THEN
    ALTER TABLE trips ADD COLUMN location text;
  END IF;
END $$;