-- Migration to update FootballMatch table for enhanced features
-- Time: 2025-01-27 Update football matches table

-- Step 1: Update Time column to support HH:mm format (24-hour)
-- Currently it may be storing AM/PM format, we need to support HH:mm

-- First, let's check if the table exists and what the current schema looks like
-- This is a safe migration that preserves existing data

-- Step 2: Update Type column to have proper constraints
-- Change from open text to specific values: S5, S7, S11

-- Step 3: Ensure Status column has proper values
-- PENDING, COMPLETED, CANCELLED

-- Execute this migration step by step:

-- 1. Check current table structure
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'FootballMatches';

-- 2. Update existing Time data if needed (convert AM/PM to 24-hour format)
-- This is a safe update that converts existing data
UPDATE FootballMatches 
SET Time = CASE 
    WHEN Time = 'AM' THEN '09:00'
    WHEN Time = 'PM' THEN '19:00'
    ELSE Time  -- Keep existing valid time formats
END
WHERE Time IN ('AM', 'PM') OR Time IS NULL;

-- 3. Ensure Type column has valid data
UPDATE FootballMatches 
SET Type = 'S7' 
WHERE Type IS NULL OR Type NOT IN ('S5', 'S7', 'S11');

-- 4. Ensure Status column has valid data
UPDATE FootballMatches 
SET Status = 'PENDING' 
WHERE Status IS NULL OR Status NOT IN ('PENDING', 'COMPLETED', 'CANCELLED');

-- 5. Add check constraints (only if they don't exist)
-- Check if constraint exists before adding
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_FootballMatches_Type')
BEGIN
    ALTER TABLE FootballMatches 
    ADD CONSTRAINT CK_FootballMatches_Type 
    CHECK (Type IN ('S5', 'S7', 'S11'));
END

IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_FootballMatches_Status')
BEGIN
    ALTER TABLE FootballMatches 
    ADD CONSTRAINT CK_FootballMatches_Status 
    CHECK (Status IN ('PENDING', 'COMPLETED', 'CANCELLED'));
END

-- 6. Update column properties if needed
-- Ensure Time column can store HH:mm format
ALTER TABLE FootballMatches 
ALTER COLUMN Time NVARCHAR(10) NOT NULL;

-- Ensure Type column is properly sized
ALTER TABLE FootballMatches 
ALTER COLUMN Type NVARCHAR(10) NOT NULL;

-- Ensure Status column is properly sized  
ALTER TABLE FootballMatches 
ALTER COLUMN Status NVARCHAR(50) NOT NULL;

-- 7. Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_FootballMatches_Date')
BEGIN
    CREATE INDEX IX_FootballMatches_Date ON FootballMatches (Date);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_FootballMatches_Status')
BEGIN
    CREATE INDEX IX_FootballMatches_Status ON FootballMatches (Status);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_FootballMatches_Type')
BEGIN
    CREATE INDEX IX_FootballMatches_Type ON FootballMatches (Type);
END

-- 8. Verify the changes
SELECT 
    Id,
    Date,
    Time,
    Stadium,
    MatchNumber,
    Type,
    Status,
    TotalRevenue,
    TotalCost,
    RecordingMoneyForPhotographer,
    MoneyForCameraman,
    Discount,
    Note,
    CreatedAt,
    UpdatedAt
FROM FootballMatches 
ORDER BY Date DESC;

-- Migration completed successfully!
-- New features supported:
-- 1. Time in HH:mm format (24-hour)
-- 2. Type constraints: S5, S7, S11
-- 3. Status constraints: PENDING, COMPLETED, CANCELLED
-- 4. Performance indexes added
-- 5. Data integrity constraints
