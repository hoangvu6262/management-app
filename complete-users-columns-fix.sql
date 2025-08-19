-- COMPLETE FIX: Add ALL missing User Model columns to Neon PostgreSQL
-- Run this in Neon SQL Editor to add all security columns from Users Model

-- =========================================================================
-- ADD ALL MISSING SECURITY COLUMNS TO USERS TABLE
-- =========================================================================

-- 1. TwoFactorEnabled - Boolean for 2FA status
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "TwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- 2. TwoFactorSecretKey - Secret key for 2FA
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "TwoFactorSecretKey" TEXT NULL;

-- 3. BackupCodes - JSON array of backup codes
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "BackupCodes" TEXT NULL;

-- 4. EmailVerified - Email verification status
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "EmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- 5. EmailVerificationToken - Token for email verification
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "EmailVerificationToken" TEXT NULL;

-- 6. LastLoginAt - Timestamp of last login
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LastLoginAt" TIMESTAMP WITHOUT TIME ZONE NULL;

-- 7. FailedLoginAttempts - Counter for failed login attempts
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "FailedLoginAttempts" INTEGER NOT NULL DEFAULT 0;

-- 8. LockoutEnd - Timestamp when lockout ends
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LockoutEnd" TIMESTAMP WITHOUT TIME ZONE NULL;

-- =========================================================================
-- VERIFY ALL COLUMNS WERE ADDED
-- =========================================================================

-- Check if all security columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Users' 
AND column_name IN (
    'TwoFactorEnabled',
    'TwoFactorSecretKey', 
    'BackupCodes',
    'EmailVerified',
    'EmailVerificationToken',
    'LastLoginAt',
    'FailedLoginAttempts',
    'LockoutEnd'
)
ORDER BY column_name;

-- =========================================================================
-- OPTIONAL: CREATE MISSING SYSTEMCONFIGURATIONS TABLE
-- =========================================================================

-- Create SystemConfigurations table if it doesn't exist
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

-- =========================================================================
-- FINAL VERIFICATION - CHECK COMPLETE USERS TABLE STRUCTURE
-- =========================================================================

-- Show all columns in Users table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Users' 
ORDER BY ordinal_position;

-- Expected columns should include:
-- Id, Username, Email, PasswordHash, FullName, Role, IsActive, CreatedAt, UpdatedAt
-- + TwoFactorEnabled, TwoFactorSecretKey, BackupCodes, EmailVerified, 
--   EmailVerificationToken, LastLoginAt, FailedLoginAttempts, LockoutEnd
