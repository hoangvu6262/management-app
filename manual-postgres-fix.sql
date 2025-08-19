-- Quick fix: Manually add missing columns to Neon PostgreSQL database
-- Connect to your Neon database and run this SQL:

BEGIN;

-- Check if columns exist first
DO $$
BEGIN
    -- Add BackupCodes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Users' AND column_name = 'BackupCodes') THEN
        ALTER TABLE "Users" ADD COLUMN "BackupCodes" TEXT NULL;
    END IF;

    -- Add other missing security columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Users' AND column_name = 'EmailVerificationToken') THEN
        ALTER TABLE "Users" ADD COLUMN "EmailVerificationToken" TEXT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Users' AND column_name = 'EmailVerified') THEN
        ALTER TABLE "Users" ADD COLUMN "EmailVerified" BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Users' AND column_name = 'FailedLoginAttempts') THEN
        ALTER TABLE "Users" ADD COLUMN "FailedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Users' AND column_name = 'LastLoginAt') THEN
        ALTER TABLE "Users" ADD COLUMN "LastLoginAt" TIMESTAMP WITHOUT TIME ZONE NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Users' AND column_name = 'LockoutEnd') THEN
        ALTER TABLE "Users" ADD COLUMN "LockoutEnd" TIMESTAMP WITHOUT TIME ZONE NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Users' AND column_name = 'TwoFactorEnabled') THEN
        ALTER TABLE "Users" ADD COLUMN "TwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Users' AND column_name = 'TwoFactorSecretKey') THEN
        ALTER TABLE "Users" ADD COLUMN "TwoFactorSecretKey" TEXT NULL;
    END IF;
END $$;

-- Create SystemConfigurations table if not exists
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

-- Mark migration as applied in EF history
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250818125104_AddProfileSecurityFeatures', '8.0.0')
ON CONFLICT ("MigrationId") DO NOTHING;

COMMIT;

-- Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Users' 
AND column_name IN ('BackupCodes', 'EmailVerificationToken', 'TwoFactorEnabled')
ORDER BY column_name;
