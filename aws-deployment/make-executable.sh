#!/bin/bash
# Make all deployment scripts executable

echo "🔧 Making deployment scripts executable..."

chmod +x *.sh

echo "✅ All scripts are now executable!"
echo ""
echo "📋 Available scripts:"
ls -la *.sh
