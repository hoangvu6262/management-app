-- PostgreSQL-specific migration to fix Fly.io deployment
-- Run this SQL directly in Neon database if EF migration fails

BEGIN;

-- Add missing columns to Users table
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "BackupCodes" TEXT NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "EmailVerificationToken" TEXT NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "EmailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "FailedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LastLoginAt" TIMESTAMP WITHOUT TIME ZONE NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LockoutEnd" TIMESTAMP WITHOUT TIME ZONE NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "TwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "TwoFactorSecretKey" TEXT NULL;

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

-- Update EF Migrations History table
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250818125104_AddProfileSecurityFeatures', '8.0.0')
ON CONFLICT ("MigrationId") DO NOTHING;

COMMIT;
