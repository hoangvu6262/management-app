#!/bin/bash
# Test .gitignore patterns

echo "🧪 Testing .gitignore patterns..."

# Create test files to check if they're ignored
echo "Creating test files..."

# Test Node.js patterns
mkdir -p test-ignore/node_modules/test
echo "test" > test-ignore/node_modules/test/index.js
echo "test" > test-ignore/.env
echo "test" > test-ignore/.env.local
echo "test" > test-ignore/package-lock.json

# Test .NET patterns  
mkdir -p test-ignore/bin/Debug
mkdir -p test-ignore/obj/Debug
echo "test" > test-ignore/bin/Debug/test.dll
echo "test" > test-ignore/obj/Debug/test.obj
echo "test" > test-ignore/management.db

# Test log files
echo "test" > test-ignore/app.log
mkdir -p test-ignore/logs
echo "test" > test-ignore/logs/error.log

# Test OS files
echo "test" > test-ignore/.DS_Store

echo ""
echo "📋 Files that should be ignored:"
find test-ignore -type f

echo ""
echo "🔍 Checking git status for test files..."
git add test-ignore/ 2>/dev/null
git status --porcelain | grep test-ignore

echo ""
echo "🧹 Cleaning up test files..."
rm -rf test-ignore/

echo ""
echo "💡 If any test files appeared in git status, those patterns need fixing in .gitignore"
