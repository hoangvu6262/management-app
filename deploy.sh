#!/bin/bash

# 🚀 Deploy script for ManagementApp MVP
# Usage: ./deploy.sh [frontend|backend|all]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if flyctl is installed
    if ! command -v flyctl &> /dev/null; then
        print_error "flyctl is not installed. Please install it first:"
        echo "brew install flyctl"
        exit 1
    fi
    
    # Check if vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "vercel CLI is not installed. Installing globally..."
        npm install -g vercel
    fi
    
    print_success "Prerequisites check passed!"
}

# Deploy backend to Fly.io
deploy_backend() {
    print_status "Deploying backend to Fly.io..."
    
    cd server-app
    
    # Check if fly.toml exists
    if [ ! -f "fly.toml" ]; then
        print_error "fly.toml not found. Please run 'fly launch' first."
        exit 1
    fi
    
    # Deploy
    flyctl deploy --remote-only
    
    print_success "Backend deployed successfully!"
    
    # Show status
    flyctl status
    flyctl logs --no-follow
    
    cd ..
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    cd client-app
    
    # Install dependencies
    npm ci
    
    # Build locally to check for errors
    print_status "Building locally..."
    npm run build
    
    # Deploy to Vercel
    vercel --prod --yes
    
    print_success "Frontend deployed successfully!"
    
    cd ..
}

# Main deployment logic
main() {
    check_prerequisites
    
    case "${1:-all}" in
        "backend")
            deploy_backend
            ;;
        "frontend")
            deploy_frontend
            ;;
        "all")
            deploy_backend
            deploy_frontend
            ;;
        *)
            print_error "Invalid option. Use: frontend, backend, or all"
            exit 1
            ;;
    esac
    
    print_success "Deployment completed! 🎉"
    echo ""
    echo "URLs:"
    echo "  Backend:  https://management-app-api.fly.dev"
    echo "  Frontend: Check Vercel output above"
    echo ""
    echo "Health Check:"
    echo "  curl https://management-app-api.fly.dev/health"
}

# Run main function
main "$@"