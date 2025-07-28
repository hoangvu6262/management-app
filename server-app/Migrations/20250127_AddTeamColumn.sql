-- Migration to add Team column to FootballMatches table
-- Date: 2025-01-27 Add Team column

-- Add Team column to FootballMatches table
ALTER TABLE FootballMatches 
ADD Team NVARCHAR(100) NOT NULL DEFAULT '';

-- Update existing records with placeholder team data (optional)
-- You can update with actual team names if you have the data
UPDATE FootballMatches 
SET Team = 'Team ' + CAST(MatchNumber AS NVARCHAR(10))
WHERE Team = '' OR Team IS NULL;

-- Add index for better performance on Team filtering
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_FootballMatches_Team')
BEGIN
    CREATE INDEX IX_FootballMatches_Team ON FootballMatches (Team);
END

-- Verify the changes
SELECT TOP 5
    Id,
    Date,
    Time,
    Stadium,
    Team,
    MatchNumber,
    Type,
    Status,
    CreatedAt
FROM FootballMatches 
ORDER BY Date DESC;

-- Check table structure
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'FootballMatches'
ORDER BY ORDINAL_POSITION;

-- Migration completed successfully!
-- Team column added with:
-- 1. NVARCHAR(100) data type
-- 2. NOT NULL constraint with default empty string
-- 3. Performance index for filtering
-- 4. Sample data for existing records
