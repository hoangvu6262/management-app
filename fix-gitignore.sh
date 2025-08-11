#!/bin/bash
# Make gitignore fix scripts executable

echo "🔧 Making .gitignore fix scripts executable..."

chmod +x check-git-status.sh
chmod +x untrack-files.sh
chmod +x test-gitignore.sh

echo "✅ All scripts are now executable!"
echo ""
echo "🚀 Quick fix workflow:"
echo "1. bash check-git-status.sh     # Kiểm tra vấn đề"
echo "2. bash untrack-files.sh        # Untrack files không mong muốn"
echo "3. bash test-gitignore.sh       # Test .gitignore patterns"
echo "4. git commit -m 'Fix .gitignore'"
echo "5. git push"
