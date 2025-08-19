-- STEP-BY-STEP: Add BackupCodes column on Neon Database
-- Copy and paste this SQL script into Neon SQL Editor

-- Step 1: Add the missing BackupCodes column
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "BackupCodes" TEXT NULL;

-- Step 2: Add other missing security columns (while we're at it)
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "EmailVerificationToken" TEXT NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "EmailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "FailedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LastLoginAt" TIMESTAMP WITHOUT TIME ZONE NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LockoutEnd" TIMESTAMP WITHOUT TIME ZONE NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "TwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "TwoFactorSecretKey" TEXT NULL;

-- Step 3: Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Users' 
ORDER BY column_name;

-- Step 4: Check Users table structure
\d "Users"
