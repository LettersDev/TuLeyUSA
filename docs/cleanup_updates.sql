-- ============================================================
-- cleanup_updates.sql — MigraGuide USA
-- Cleans up all laws and items in the 'updates' category
-- ============================================================

-- 1. Delete all items belonging to 'updates' laws
DELETE FROM law_items 
WHERE law_id IN (SELECT id FROM laws WHERE category = 'updates');

-- 2. Delete the laws themselves
DELETE FROM laws 
WHERE category = 'updates';

-- 3. Reset metadata so the app knows data has changed
UPDATE system_metadata 
SET laws_last_updated = NOW(), 
    last_upload_count = 0 
WHERE id = 'main';

-- Optional: If you only want to delete the scraped ones (fr-*) 
-- use: DELETE FROM laws WHERE category = 'updates' AND id LIKE 'fr-%';
