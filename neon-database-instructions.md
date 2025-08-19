🎯 HOW TO ADD BackupCodes TO NEON DATABASE
==========================================

📋 **STEP-BY-STEP INSTRUCTIONS:**

1️⃣ **ACCESS NEON CONSOLE:**
   • Go to https://console.neon.tech/
   • Log in to your Neon account
   • Select your project/database

2️⃣ **OPEN SQL EDITOR:**
   • Click on "SQL Editor" tab in the left sidebar
   • You'll see an SQL query interface

3️⃣ **RUN THE SQL COMMANDS:**
   Copy and paste this SQL:

   ```sql
   -- Add BackupCodes column
   ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "BackupCodes" TEXT NULL;
   
   -- Verify it was added
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'Users' AND column_name = 'BackupCodes';
   ```

4️⃣ **EXECUTE THE QUERY:**
   • Click "Run" button
   • Should see: "ALTER TABLE" success message
   • Verification query should return: BackupCodes | text

5️⃣ **ADD OTHER MISSING COLUMNS (RECOMMENDED):**
   ```sql
   ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "EmailVerificationToken" TEXT NULL;
   ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "EmailVerified" BOOLEAN NOT NULL DEFAULT false;
   ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "FailedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
   ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LastLoginAt" TIMESTAMP WITHOUT TIME ZONE NULL;
   ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LockoutEnd" TIMESTAMP WITHOUT TIME ZONE NULL;
   ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "TwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
   ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "TwoFactorSecretKey" TEXT NULL;
   ```

6️⃣ **RESTART FLY.IO APP:**
   ```bash
   fly apps restart management-app-backend
   ```

7️⃣ **TEST THE FIX:**
   ```bash
   curl -X POST https://management-app-backend.fly.dev/api/Auth/login \
     -H 'Content-Type: application/json' \
     -d '{"email":"admin@managementapp.com","password":"admin123"}'
   ```

✅ **EXPECTED RESULT:**
- No more "column u.BackupCodes does not exist" errors
- Login should return 200 OK with JWT token
- Analytics endpoints should work

⚠️ **IF YOU CAN'T ACCESS NEON CONSOLE:**
You can also connect via psql command line:
```bash
psql "postgresql://username:password@host/database?sslmode=require"
```

🔥 **THIS WILL DEFINITELY FIX THE ISSUE!**
The BackupCodes column is the root cause of all errors.
