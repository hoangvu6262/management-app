-- Migration script to add security-related columns to User table and create SystemConfiguration table

-- Add new columns to Users table
ALTER TABLE Users ADD COLUMN TwoFactorEnabled INTEGER DEFAULT 0;
ALTER TABLE Users ADD COLUMN TwoFactorSecretKey TEXT;
ALTER TABLE Users ADD COLUMN BackupCodes TEXT;
ALTER TABLE Users ADD COLUMN EmailVerified INTEGER DEFAULT 0;
ALTER TABLE Users ADD COLUMN EmailVerificationToken TEXT;
ALTER TABLE Users ADD COLUMN LastLoginAt TEXT;
ALTER TABLE Users ADD COLUMN FailedLoginAttempts INTEGER DEFAULT 0;
ALTER TABLE Users ADD COLUMN LockoutEnd TEXT;

-- Create SystemConfigurations table
CREATE TABLE IF NOT EXISTS SystemConfigurations (
    Id INTEGER PRIMARY KEY,
    RequireEmailVerification INTEGER DEFAULT 0,
    EnableTwoFactor INTEGER DEFAULT 1,
    MaxLoginAttempts INTEGER DEFAULT 5,
    SessionTimeoutMinutes INTEGER DEFAULT 60,
    MaintenanceMode INTEGER DEFAULT 0,
    SystemMessage TEXT DEFAULT '',
    CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert default system configuration
INSERT OR IGNORE INTO SystemConfigurations (Id, RequireEmailVerification, EnableTwoFactor, MaxLoginAttempts, SessionTimeoutMinutes, MaintenanceMode, SystemMessage)
VALUES (1, 0, 1, 5, 60, 0, '');
