#!/bin/bash

echo "🔧 Building .NET project..."
cd /Users/caovu/Work/ManagementApp/server-app

# Clean and build
dotnet clean
dotnet build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 You can now run the server with:"
    echo "cd /Users/caovu/Work/ManagementApp/server-app"
    echo "dotnet run"
    echo ""
    echo "📊 Analytics endpoints will be available at:"
    echo "GET /api/analytics/dashboard"
    echo "GET /api/analytics/financial"
    echo "GET /api/analytics/matches"
    echo "GET /api/analytics/personnel"
    echo "GET /api/analytics/trends"
    echo "GET /api/analytics/top-stadiums"
    echo "GET /api/analytics/top-teams"
    echo "GET /api/analytics/status-distribution"
    echo "GET /api/analytics/revenue-profit-trend"
    echo "GET /api/analytics/match-type-distribution"
    echo "GET /api/analytics/cancelled-analysis"
    echo "GET /api/analytics/photographer-cameraman-analysis"
else
    echo "❌ Build failed!"
    echo "Please check the errors above and fix them."
fi

echo ""
echo "🎯 Frontend setup:"
echo "cd /Users/caovu/Work/ManagementApp/client-app"
echo "npm install"
echo "npm run dev"
echo ""
echo "🌐 Then access: http://localhost:3000/analytics"
