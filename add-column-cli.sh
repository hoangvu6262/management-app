#!/bin/bash

echo "🔧 Alternative: Add BackupCodes via Command Line"
echo "=============================================="
echo ""

echo "If you have the Neon connection string, you can run:"
echo ""

echo "1️⃣ **Get your Neon connection string from Fly secrets:**"
echo "   fly secrets list -a management-app-backend"
echo "   # Look for DATABASE_URL"
echo ""

echo "2️⃣ **Connect to database and run SQL:**"
echo "   psql \"\$DATABASE_URL\" -c \"ALTER TABLE \\\"Users\\\" ADD COLUMN IF NOT EXISTS \\\"BackupCodes\\\" TEXT NULL;\""
echo ""

echo "3️⃣ **Verify column was added:**"
echo "   psql \"\$DATABASE_URL\" -c \"SELECT column_name FROM information_schema.columns WHERE table_name = 'Users' AND column_name = 'BackupCodes';\""
echo ""

echo "🎯 **Expected output:**"
echo "   column_name"
echo "   -----------"
echo "   BackupCodes"
echo ""

echo "📝 **Full example with connection string:**"
echo "   # Replace with your actual connection string"
echo "   export DB_URL=\"postgresql://user:pass@host:5432/db?sslmode=require\""
echo "   psql \"\$DB_URL\" -c \"ALTER TABLE \\\"Users\\\" ADD COLUMN IF NOT EXISTS \\\"BackupCodes\\\" TEXT NULL;\""
echo ""

echo "🚀 **After adding column, restart Fly app:**"
echo "   fly apps restart management-app-backend"
