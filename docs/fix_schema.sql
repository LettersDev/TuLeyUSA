-- ============================================================
-- fix_schema.sql — MigraGuide USA
-- Adds bilingual columns and RPC functions for smart updates
-- ============================================================

-- 1. Add missing bilingual columns to laws
ALTER TABLE laws ADD COLUMN IF NOT EXISTS title_es TEXT;
ALTER TABLE laws ADD COLUMN IF NOT EXISTS searchable_text_es TEXT;

-- 2. Add missing bilingual columns to law_items
ALTER TABLE law_items ADD COLUMN IF NOT EXISTS title_es TEXT;
ALTER TABLE law_items ADD COLUMN IF NOT EXISTS text_es TEXT;

-- 3. Update the search function to be bilingual
CREATE OR REPLACE FUNCTION search_laws(query TEXT, lang TEXT DEFAULT 'english')
RETURNS TABLE(
  law_id TEXT,
  law_title TEXT,
  item_id TEXT,
  item_title TEXT,
  item_text TEXT,
  rank REAL
)
LANGUAGE sql AS $$
  SELECT
    li.law_id,
    COALESCE(CASE WHEN lang = 'spanish' THEN l.title_es ELSE l.title END, l.title) AS law_title,
    li.id AS item_id,
    COALESCE(CASE WHEN lang = 'spanish' THEN li.title_es ELSE li.title END, li.title) AS item_title,
    COALESCE(CASE WHEN lang = 'spanish' THEN li.text_es ELSE li.text END, li.text) AS item_text,
    ts_rank(li.search_vector, plainto_tsquery('english', query)) AS rank
  FROM law_items li
  JOIN laws l ON l.id = li.law_id
  WHERE li.search_vector @@ plainto_tsquery('english', query)
  ORDER BY rank DESC
  LIMIT 30;
$$;

-- 4. Function to safely increment article count
CREATE OR REPLACE FUNCTION increment_article_count(law_id_param TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE laws
  SET article_count = COALESCE(article_count, 0) + 1
  WHERE id = law_id_param;
END;
$$ LANGUAGE plpgsql;
