-- Set all stores as approved to make them visible
UPDATE stores SET approved = true WHERE approved = false OR approved IS NULL;