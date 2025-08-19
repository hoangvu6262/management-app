-- SOLUTION 1: Complete Database Reset and Migration Fix
-- This will properly set up the database schema

-- Connect to your Neon database and run this script

-- Step 1: Drop and recreate __EFMigrationsHistory to reset migration state
DROP TABLE IF EXISTS "__EFMigrationsHistory";
CREATE TABLE "__EFMigrationsHistory" (
    "MigrationId" varchar(150) NOT NULL,
    "ProductVersion" varchar(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

-- Step 2: Add missing columns to existing Users table
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "BackupCodes" TEXT NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "EmailVerificationToken" TEXT NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "EmailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "FailedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LastLoginAt" TIMESTAMP WITHOUT TIME ZONE NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LockoutEnd" TIMESTAMP WITHOUT TIME ZONE NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "TwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "TwoFactorSecretKey" TEXT NULL;

-- Step 3: Create missing SystemConfigurations table
CREATE TABLE IF NOT EXISTS "SystemConfigurations" (
    "Id" SERIAL PRIMARY KEY,
    "RequireEmailVerification" BOOLEAN NOT NULL DEFAULT false,
    "EnableTwoFactor" BOOLEAN NOT NULL DEFAULT false,
    "MaxLoginAttempts" INTEGER NOT NULL DEFAULT 5,
    "SessionTimeoutMinutes" INTEGER NOT NULL DEFAULT 30,
    "MaintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "SystemMessage" VARCHAR(500) NOT NULL DEFAULT '',
    "CreatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Step 4: Mark ALL migrations as applied (simulate they ran successfully)
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES
('20250726175442_InitialCreate', '8.0.0'),
('20250726175954_update', '8.0.0'), 
('20250727095807_AddTeamColumnToFootballMatch', '8.0.0'),
('20250818125104_AddProfileSecurityFeatures', '8.0.0');

-- Step 5: Verify the fix worked
SELECT 'Migration History:' as status;
SELECT * FROM "__EFMigrationsHistory" ORDER BY "MigrationId";

SELECT 'Users table columns:' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Users' 
AND column_name IN ('BackupCodes', 'EmailVerificationToken', 'TwoFactorEnabled')
ORDER BY column_name;
