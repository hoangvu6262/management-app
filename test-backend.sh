#!/bin/bash

echo "🔧 Testing Backend Analytics..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test backend health
echo -e "${YELLOW}1. Testing backend health...${NC}"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Backend is running (HTTP $HEALTH_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Backend is not running (HTTP $HEALTH_RESPONSE)${NC}"
    echo "Please start the backend first:"
    echo "cd /Users/caovu/Work/ManagementApp/server-app"
    echo "dotnet run"
    exit 1
fi

# Test database info
echo -e "${YELLOW}2. Testing database info...${NC}"
DB_RESPONSE=$(curl -s http://localhost:5000/db-info)
echo "Database info: $DB_RESPONSE"

# Test analytics endpoint (should return 401 without auth)
echo -e "${YELLOW}3. Testing analytics endpoint...${NC}"
ANALYTICS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/analytics/dashboard)
echo "Analytics endpoint status: $ANALYTICS_RESPONSE"

if [ "$ANALYTICS_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✅ Analytics endpoint requires authentication (as expected)${NC}"
elif [ "$ANALYTICS_RESPONSE" = "500" ]; then
    echo -e "${RED}❌ Analytics endpoint has server error${NC}"
    echo "Check server logs for SQL errors"
else
    echo -e "${YELLOW}⚠️ Unexpected response: $ANALYTICS_RESPONSE${NC}"
fi

echo ""
echo -e "${YELLOW}📊 To test with authentication:${NC}"
echo "1. Go to http://localhost:3000/login"
echo "2. Login with admin/admin123"
echo "3. Go to http://localhost:3000/analytics"
echo ""
echo -e "${YELLOW}🔍 To check swagger documentation:${NC}"
echo "http://localhost:5000/swagger"
