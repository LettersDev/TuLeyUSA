-- ============================================================
-- full_schema.sql — MigraGuide USA
-- COMPLETE DATABASE RESTORATION SCRIPT
-- WARNING: This script drops and recreates tables!
-- ============================================================

-- 0. CLEANUP (Uncomment if you want a complete reset)
-- DROP FUNCTION IF EXISTS search_laws(text, text);
-- DROP TABLE IF EXISTS law_items;
-- DROP TABLE IF EXISTS laws;
-- DROP TABLE IF EXISTS system_metadata;

-- 1. System Metadata Table
CREATE TABLE IF NOT EXISTS system_metadata (
  id TEXT PRIMARY KEY DEFAULT 'main',
  laws_last_updated TIMESTAMPTZ,
  latest_app_version TEXT,
  last_upload_count INT
);

INSERT INTO system_metadata (id, laws_last_updated, latest_app_version, last_upload_count)
VALUES ('main', NOW(), '1.0.0', 0)
ON CONFLICT (id) DO NOTHING;

-- 2. Laws Table (With Bilingual Support)
CREATE TABLE IF NOT EXISTS laws (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_es TEXT,
  category TEXT NOT NULL,
  type TEXT,
  article_count INT DEFAULT 0,
  searchable_text TEXT,
  searchable_text_es TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Law Items Table (With Bilingual Support)
CREATE TABLE IF NOT EXISTS law_items (
  id TEXT PRIMARY KEY,
  law_id TEXT REFERENCES laws(id) ON DELETE CASCADE,
  index INT NOT NULL,
  number INT,
  title TEXT,
  title_es TEXT,
  text TEXT NOT NULL,
  text_es TEXT,
  search_vector_en TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || text)
  ) STORED,
  search_vector_es TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(title_es, '') || ' ' || coalesce(text_es, ''))
  ) STORED
);

-- GIN Indexes for efficiency
CREATE INDEX IF NOT EXISTS law_items_search_en_idx ON law_items USING GIN(search_vector_en);
CREATE INDEX IF NOT EXISTS law_items_search_es_idx ON law_items USING GIN(search_vector_es);

-- 4. BILINGUAL Search Function
DROP FUNCTION IF EXISTS search_laws(text, text);
CREATE OR REPLACE FUNCTION search_laws(query TEXT, lang_param TEXT DEFAULT 'english')
RETURNS TABLE(
  law_id TEXT,
  law_title TEXT,
  item_id TEXT,
  item_title TEXT,
  item_text TEXT,
  rank REAL
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    li.law_id,
    COALESCE(CASE WHEN lang_param = 'spanish' THEN l.title_es ELSE l.title END, l.title) AS law_title,
    li.id AS item_id,
    COALESCE(CASE WHEN lang_param = 'spanish' THEN li.title_es ELSE li.title END, li.title) AS item_title,
    COALESCE(CASE WHEN lang_param = 'spanish' THEN li.text_es ELSE li.text END, li.text) AS item_text,
    ts_rank(
      CASE WHEN lang_param = 'spanish' THEN li.search_vector_es ELSE li.search_vector_en END,
      websearch_to_tsquery(CASE WHEN lang_param = 'spanish' THEN 'spanish' ELSE 'english' END, query)
    ) AS rank
  FROM law_items li
  JOIN laws l ON l.id = li.law_id
  WHERE (
    CASE WHEN lang_param = 'spanish' THEN li.search_vector_es @@ websearch_to_tsquery('spanish', query)
    ELSE li.search_vector_en @@ websearch_to_tsquery('english', query) END
  )
  ORDER BY rank DESC
  LIMIT 30;
END;
$$;

-- 5. Helper Function for Smart Updates (Increments article count)
CREATE OR REPLACE FUNCTION increment_article_count(law_id_param TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE laws
  SET article_count = COALESCE(article_count, 0) + 1
  WHERE id = law_id_param;
END;
$$ LANGUAGE plpgsql;

-- 6. SECURITY: Enable Row Level Security (RLS)
ALTER TABLE laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE law_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metadata ENABLE ROW LEVEL SECURITY;

-- 7. SECURITY: Public Read Policies
DROP POLICY IF EXISTS "Public read laws" ON laws;
CREATE POLICY "Public read laws" ON laws FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read law_items" ON law_items;
CREATE POLICY "Public read law_items" ON law_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read system_metadata" ON system_metadata;
CREATE POLICY "Public read system_metadata" ON system_metadata FOR SELECT USING (true);
