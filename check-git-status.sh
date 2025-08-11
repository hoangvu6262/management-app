#!/bin/bash
# Kiểm tra files đã được tracked
echo "🔍 Checking tracked files that should be ignored..."

# Kiểm tra các file đã tracked nhưng nên được ignore
git ls-files -i --exclude-standard

echo ""
echo "📋 Files currently tracked:"
git ls-files | head -20

echo ""
echo "📝 Current .gitignore patterns:"
if [ -f ".gitignore" ]; then
    head -20 .gitignore
else
    echo "❌ .gitignore file not found!"
fi
