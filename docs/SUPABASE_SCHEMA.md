# MigraGuide USA — SQL Schema (Supabase)
# Ejecuta estos comandos en el SQL Editor de tu proyecto Supabase

## 1. Tabla de metadatos del sistema (1 fila)
```sql
CREATE TABLE system_metadata (
  id TEXT PRIMARY KEY DEFAULT 'main',
  laws_last_updated TIMESTAMPTZ,
  latest_app_version TEXT,
  last_upload_count INT
);

-- Insertar fila inicial
INSERT INTO system_metadata (id, laws_last_updated, latest_app_version, last_upload_count)
VALUES ('main', NOW(), '1.0.0', 0);
```

## 2. Tabla de leyes (solo metadatos)
```sql
CREATE TABLE laws (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT,
  article_count INT,
  searchable_text TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

## 3. Tabla de artículos
```sql
CREATE TABLE law_items (
  id TEXT PRIMARY KEY,
  law_id TEXT REFERENCES laws(id) ON DELETE CASCADE,
  index INT NOT NULL,
  number INT,
  title TEXT,
  text TEXT NOT NULL,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title,'') || ' ' || text)
  ) STORED
);

-- Índice para Full Text Search
CREATE INDEX law_items_search_idx ON law_items USING GIN(search_vector);
```

## 4. Función RPC para búsqueda global
```sql
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
```

## 5. Row Level Security (RLS) — Acceso público de lectura
```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE law_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metadata ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (la app solo lee datos)
CREATE POLICY "Public read access" ON laws FOR SELECT USING (true);
CREATE POLICY "Public read access" ON law_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON system_metadata FOR SELECT USING (true);
```

## Categorías disponibles (campo `category` en `laws`)
- `asylum` — Asilo
- `visas` — Visas
- `tps` — TPS
- `citizenship` — Ciudadanía
- `daca` — DACA
- `deportation` — Deportación
- `work` — Autorización de Trabajo
- `family` — Familia

## Ejemplo de inserción de una ley
```sql
INSERT INTO laws (id, title, category, type, article_count, searchable_text)
VALUES (
  'ina_section_208',
  'INA Section 208 - Asylum',
  'asylum',
  'Federal Statute',
  10,
  'asylum application requirements eligibility'
);

INSERT INTO law_items (id, law_id, index, number, title, text)
VALUES (
  'ina_208_a',
  'ina_section_208',
  0,
  208,
  'Asylum',
  'Any alien who is physically present in the United States...'
);

-- Actualizar metadata del sistema después de subir leyes
UPDATE system_metadata
SET laws_last_updated = NOW(), last_upload_count = 1
WHERE id = 'main';
```
