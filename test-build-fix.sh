#!/bin/bash

echo "🔧 Testing Build Fix"
echo "==================="
echo ""

cd /Users/caovu/Work/ManagementApp/server-app

echo "🔄 Building project..."
dotnet build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ BUILD SUCCESSFUL!"
    echo ""
    echo "🚀 Ready to deploy:"
    echo "fly deploy"
    echo ""
    echo "📋 Changes made:"
    echo "- Fixed indentation in AnalyticsService"
    echo "- Removed problematic DbContext configuration"
    echo "- Sequential execution for dashboard analytics"
    echo ""
    echo "🎯 Expected result:"
    echo "- Analytics dashboard API will work without threading errors"
    echo "- Frontend charts will display data"
else
    echo ""
    echo "❌ Build still failing. Let's check the specific errors..."
    echo ""
    echo "Common issues to check:"
    echo "1. Missing using directives"
    echo "2. Syntax errors in AnalyticsService"
    echo "3. Compilation errors in Program.cs"
    echo ""
    echo "Run this to see specific errors:"
    echo "dotnet build --verbosity detailed"
fi
