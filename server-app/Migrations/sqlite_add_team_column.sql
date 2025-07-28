-- SQLite Migration Script for Adding Team Column
-- Run this in SQLite database browser or via command line

-- 1. Add Team column to FootballMatches table
ALTER TABLE FootballMatches ADD COLUMN Team TEXT NOT NULL DEFAULT '';

-- 2. Update existing records with sample data
UPDATE FootballMatches 
SET Team = 'Team ' || MatchNumber 
WHERE Team = '' OR Team IS NULL;

-- 3. Create index for better performance
CREATE INDEX IF NOT EXISTS IX_FootballMatches_Team ON FootballMatches(Team);

-- 4. Verify the changes
.schema FootballMatches

-- 5. Check sample data
SELECT Id, Stadium, Team, MatchNumber, Type, CreatedAt 
FROM FootballMatches 
LIMIT 5;

-- Migration completed for SQLite!
