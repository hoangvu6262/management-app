#!/bin/bash

echo "🔧 Fixing Analytics Dashboard DbContext Concurrency Issue"
echo "========================================================"
echo ""

echo "✅ **Root Cause Fixed:**"
echo "- Changed parallel Task.WhenAll() to sequential await calls"
echo "- Added try-catch error handling"
echo "- This prevents DbContext threading conflicts"
echo ""

echo "🚀 **Deploying Fix:**"
cd /Users/caovu/Work/ManagementApp/server-app

echo "Building and deploying..."
fly deploy

echo ""
echo "⏳ **Expected Results After Deploy:**"
echo "✅ Analytics dashboard API returns 200 OK"
echo "✅ No more DbContext threading errors"
echo "✅ Frontend analytics page displays data"
echo "✅ All charts work properly"
echo ""

echo "🧪 **Test Commands:**"
echo "# 1. Test dashboard endpoint"
echo "curl -H 'Authorization: Bearer [TOKEN]' \\"
echo "     https://management-app-backend.fly.dev/api/analytics/dashboard"
echo ""

echo "# 2. Test individual endpoints"
echo "curl -H 'Authorization: Bearer [TOKEN]' \\"
echo "     https://management-app-backend.fly.dev/api/analytics/status-distribution"
echo ""

echo "📊 **Why This Fix Works:**"
echo "- Sequential execution eliminates DbContext conflicts"
echo "- Proper error handling prevents 500 errors"
echo "- Each method gets its own DbContext scope"
echo "- No concurrent database operations"
echo ""

echo "⚡ **Performance Impact:**"
echo "- Slightly slower (sequential vs parallel)"
echo "- But much more reliable and stable"
echo "- Trade-off for correct functionality"
