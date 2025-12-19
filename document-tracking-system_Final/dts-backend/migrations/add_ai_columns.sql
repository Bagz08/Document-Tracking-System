-- Migration: Add AI categorization columns to office_docs table
-- Run this SQL script to add the necessary columns for AI categorization
-- Note: Remove the IF NOT EXISTS clauses if your MySQL version doesn't support them

-- Check if columns exist before adding (MySQL 5.7+ compatible)
SET @dbname = DATABASE();
SET @tablename = 'office_docs';
SET @columnname1 = 'ai_category';
SET @columnname2 = 'ai_confidence';

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname1)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname1, " VARCHAR(100) DEFAULT NULL")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname2)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname2, " DECIMAL(5,2) DEFAULT NULL")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add index for faster queries on ai_category (if it doesn't exist)
CREATE INDEX idx_ai_category ON office_docs(ai_category);

-- Optional: Update existing documents with AI categorization
-- This will be done automatically by the recategorize endpoint

