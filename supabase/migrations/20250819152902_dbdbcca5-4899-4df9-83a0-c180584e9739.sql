-- Drop unused search text index to improve performance
DROP INDEX IF EXISTS idx_stores_search_text;