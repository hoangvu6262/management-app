# 🚀 ManagementApp MVP Deployment Guide

## Quick Start (Auto Setup)

```bash
# Make scripts executable
chmod +x setup-mvp.sh deploy.sh

# Run the automated setup
./setup-mvp.sh
```

## Manual Setup

### 1. Prerequisites
```bash
# Install Fly.io CLI
brew install flyctl  # macOS
# or
curl -L https://fly.io/install.sh | sh  # Linux

# Install Vercel CLI
npm install -g vercel
```

### 2. Database (Neon)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

### 3. Backend (Fly.io)
```bash
cd server-app
fly auth login
fly launch --no-deploy
fly secrets set DATABASE_URL="your-neon-connection-string"
fly secrets set JWT_SECRET="your-strong-jwt-secret"
fly deploy
```

### 4. Frontend (Vercel)
```bash
cd client-app
vercel login
vercel --prod
```

## Files Created
- `server-app/fly.toml` - Fly.io configuration
- `client-app/vercel.json` - Vercel configuration
- `setup-mvp.sh` - Automated setup script
- `deploy.sh` - Quick deployment script
- `.github/workflows/deploy-backend.yml` - CI/CD pipeline

## URLs
- **Backend**: https://management-app-api.fly.dev
- **Frontend**: https://your-app.vercel.app (after deployment)

## Costs
- **Free tier**: $0/month
- **After limits**: ~$5-10/month

Need help? Check the full deployment plan artifact above! 🎯