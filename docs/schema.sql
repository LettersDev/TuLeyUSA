-- ============================================================
-- MigraGuide USA — Schema Supabase
-- Ejecutar en orden en el SQL Editor de Supabase
-- ============================================================

-- 1. Tabla de metadatos del sistema (1 fila, 1 lectura/dia)
CREATE TABLE IF NOT EXISTS system_metadata (
  id TEXT PRIMARY KEY DEFAULT 'main',
  laws_last_updated TIMESTAMPTZ,
  latest_app_version TEXT,
  last_upload_count INT
);

INSERT INTO system_metadata (id, laws_last_updated, latest_app_version, last_upload_count)
VALUES ('main', NOW(), '1.0.0', 0)
ON CONFLICT (id) DO NOTHING;

-- 2. Tabla de leyes (solo metadatos, sin articulos)
CREATE TABLE IF NOT EXISTS laws (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT,
  article_count INT,
  searchable_text TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de articulos con Full Text Search
CREATE TABLE IF NOT EXISTS law_items (
  id TEXT PRIMARY KEY,
  law_id TEXT REFERENCES laws(id) ON DELETE CASCADE,
  index INT NOT NULL,
  number INT,
  title TEXT,
  text TEXT NOT NULL,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || text)
  ) STORED
);

-- Indice GIN para Full Text Search eficiente
CREATE INDEX IF NOT EXISTS law_items_search_idx ON law_items USING GIN(search_vector);

-- 4. Funcion RPC para busqueda global (Full Text Search)
CREATE OR REPLACE FUNCTION search_laws(query TEXT)
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
    l.title AS law_title,
    li.id AS item_id,
    li.title AS item_title,
    li.text AS item_text,
    ts_rank(li.search_vector, plainto_tsquery('english', query)) AS rank
  FROM law_items li
  JOIN laws l ON l.id = li.law_id
  WHERE li.search_vector @@ plainto_tsquery('english', query)
  ORDER BY rank DESC
  LIMIT 30;
$$;

-- 5. Habilitar Row Level Security
ALTER TABLE laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE law_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metadata ENABLE ROW LEVEL SECURITY;

-- 6. Politicas de lectura publica
CREATE POLICY "Public read laws" ON laws FOR SELECT USING (true);
CREATE POLICY "Public read law_items" ON law_items FOR SELECT USING (true);
CREATE POLICY "Public read system_metadata" ON system_metadata FOR SELECT USING (true);
