#!/bin/bash

# 🛠️ Quick Setup Script for ManagementApp MVP Deployment
# This script helps you set up the deployment environment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_header() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                 ManagementApp MVP Setup                  ║"
    echo "║              Next.js 14 + .NET 8 + Postgres             ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "${BLUE}📋 Step $1:${NC} $2"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Function to install prerequisites
install_prerequisites() {
    print_step "1" "Installing Prerequisites"
    
    # Check OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command -v brew &> /dev/null; then
            print_error "Homebrew is required. Install it from https://brew.sh/"
            exit 1
        fi
        
        # Install flyctl
        if ! command -v flyctl &> /dev/null; then
            echo "Installing Fly.io CLI..."
            brew install flyctl
        fi
        
    else
        # Linux/WSL
        if ! command -v flyctl &> /dev/null; then
            echo "Installing Fly.io CLI..."
            curl -L https://fly.io/install.sh | sh
            export PATH="$HOME/.fly/bin:$PATH"
        fi
    fi
    
    # Install Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Install .NET 8 (if not exists)
    if ! command -v dotnet &> /dev/null; then
        print_warning ".NET 8 SDK not found. Please install from https://dotnet.microsoft.com/download"
    fi
    
    print_success "Prerequisites installed!"
}

# Function to setup database
setup_database() {
    print_step "2" "Database Setup (Neon)"
    
    echo "1. Go to https://neon.tech and create a free account"
    echo "2. Create a new project"
    echo "3. Copy the connection string"
    echo "4. It should look like: postgresql://user:pass@hostname:5432/db?sslmode=require"
    echo ""
    read -p "Press Enter when you have your connection string ready..."
    
    print_success "Database setup instructions provided!"
}

# Function to setup backend
setup_backend() {
    print_step "3" "Backend Setup (Fly.io)"
    
    cd server-app
    
    # Login to Fly.io
    echo "Logging into Fly.io..."
    flyctl auth login
    
    # Create app (but don't deploy yet)
    echo "Creating Fly.io app..."
    flyctl launch --no-deploy --copy-config --name management-app-api
    
    print_success "Fly.io app created!"
    
    # Set environment variables
    echo ""
    echo "Now we need to set some environment variables..."
    
    read -p "Enter your Neon database URL: " DATABASE_URL
    flyctl secrets set DATABASE_URL="$DATABASE_URL"
    
    read -p "Enter a strong JWT secret (32+ characters): " JWT_SECRET
    flyctl secrets set JWT_SECRET="$JWT_SECRET"
    
    flyctl secrets set JWT_ISSUER="ManagementApp"
    flyctl secrets set JWT_AUDIENCE="ManagementApp-Users"
    
    # We'll set CORS later after frontend is deployed
    flyctl secrets set ALLOWED_ORIGINS="http://localhost:3000"
    
    print_success "Backend environment variables set!"
    
    cd ..
}

# Function to setup frontend
setup_frontend() {
    print_step "4" "Frontend Setup (Vercel)"
    
    cd client-app
    
    # Install dependencies
    echo "Installing frontend dependencies..."
    npm ci
    
    # Login to Vercel
    echo "Logging into Vercel..."
    vercel login
    
    print_success "Frontend setup complete!"
    
    cd ..
}

# Function to deploy everything
deploy_all() {
    print_step "5" "Deploying Everything"
    
    # Deploy backend first
    echo "Deploying backend..."
    cd server-app
    flyctl deploy --remote-only
    cd ..
    
    # Get backend URL
    BACKEND_URL="https://management-app-api.fly.dev"
    
    # Update frontend environment
    cd client-app
    echo "NEXT_PUBLIC_API_URL=$BACKEND_URL" > .env.production
    echo "NEXT_PUBLIC_APP_ENV=production" >> .env.production
    
    # Deploy frontend
    echo "Deploying frontend..."
    vercel --prod --yes
    
    cd ..
    
    print_success "Deployment complete!"
}

# Function to update CORS
update_cors() {
    print_step "6" "Updating CORS Settings"
    
    echo "After frontend deployment, you'll get a Vercel URL."
    echo "You need to update the CORS settings in your backend."
    echo ""
    read -p "Enter your Vercel app URL (e.g., https://your-app.vercel.app): " FRONTEND_URL
    
    cd server-app
    flyctl secrets set ALLOWED_ORIGINS="$FRONTEND_URL,http://localhost:3000"
    
    # Redeploy backend with new CORS
    flyctl deploy --remote-only
    
    print_success "CORS updated!"
    
    cd ..
}

# Function to run health checks
health_check() {
    print_step "7" "Health Check"
    
    echo "Checking backend health..."
    sleep 10
    
    if curl -f https://management-app-api.fly.dev/health; then
        print_success "Backend is healthy!"
    else
        print_error "Backend health check failed!"
    fi
    
    echo ""
    echo "🎉 Deployment Summary:"
    echo "  Backend:  https://management-app-api.fly.dev"
    echo "  Frontend: Check Vercel output above"
    echo "  Database: Your Neon dashboard"
    echo ""
    echo "Next steps:"
    echo "  1. Test your application"
    echo "  2. Set up custom domains (optional)"
    echo "  3. Configure monitoring"
    echo "  4. Set up CI/CD pipelines"
}

# Main function
main() {
    print_header
    
    echo "This script will help you deploy your ManagementApp MVP to:"
    echo "  • Frontend: Vercel (free)"
    echo "  • Backend: Fly.io (free tier)"
    echo "  • Database: Neon Postgres (free)"
    echo ""
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    
    install_prerequisites
    setup_database
    setup_backend
    setup_frontend
    deploy_all
    update_cors
    health_check
    
    print_success "🚀 MVP deployment complete! Your app is live!"
}

# Check if running from correct directory
if [ ! -f "ManagementApp.sln" ]; then
    print_error "Please run this script from the ManagementApp root directory!"
    exit 1
fi

# Run main function
main