# Development and Production Environment Setup

This commit adds comprehensive environment configuration for development and production deployments with secure JWT secrets and OAuth provider configurations.

## Changes Made

### 1. Environment Files Created

#### `.dev.vars` - Wrangler Development Environment
- **Purpose**: Used when running `wrangler dev` for local worker development
- **Base URL**: `http://localhost:8787` (wrangler dev default port)
- **JWT Secret**: `9a811bb002503c7e7f85e04c5806e8fb480f0f9c3cd4f2cf382e6b5b88d45c82` (32-byte secure random)
- **OAuth Placeholders**: Template values for GitHub, Google, and X OAuth apps

#### `.env.local` - Local React Development  
- **Purpose**: Used for local React development with `npm run dev`
- **Base URL**: `http://localhost:5173` (Vite dev server default port)
- **JWT Secret**: `2fd56a16e62447cf9228a35b3c150a1beff76f8f998d9566190e534802548e8a` (32-byte secure random)
- **OAuth Placeholders**: Template values for local development OAuth apps

#### `.env.production` - Production Deployment
- **Purpose**: Reference for Cloudflare Workers environment variables
- **Base URL**: `https://abstorm-app.rbancroft.workers.dev` (production domain)
- **JWT Secret**: `f32d44f99e6a95aa9f46436a6953f0099613f5ee2664b1bd3c00d33aa4b6c27a` (32-byte secure random)
- **X OAuth**: Pre-configured with actual X OAuth credentials
- **Other OAuth**: Placeholders for GitHub and Google production apps

### 2. JWT Secret Generation

Used Node.js crypto module to generate cryptographically secure JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Security Features**:
- 32-byte random secrets (64 hex characters)
- Different secrets per environment for security isolation
- Cryptographically secure random generation
- Never committed to version control (protected by .gitignore)

### 3. Environment Variable Structure

Each environment file includes:
- `BASE_URL`: Application base URL for OAuth redirects
- `JWT_SECRET`: Secure token signing secret
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: GitHub OAuth app credentials
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth app credentials  
- `X_CLIENT_ID` & `X_CLIENT_SECRET`: X (Twitter) OAuth app credentials

### 4. GitIgnore Protection

All environment files are protected in `.gitignore`:
```
# Environment files with secrets
.env
.env.local
.env.production
.dev.vars
```

## Usage Instructions

### Development Workflow

#### Local React Development
1. Use `.env.local` for environment variables
2. Run `npm run dev` (uses Vite on port 5173)
3. Configure OAuth apps with `http://localhost:5173/api/auth/callback/{provider}`

#### Local Worker Development  
1. Use `.dev.vars` for environment variables
2. Run `wrangler dev` (uses port 8787)
3. May need ngrok for public OAuth callbacks

### Production Deployment

1. **Copy Environment Variables**:
   - Go to Cloudflare Workers Dashboard
   - Select `abstorm-app` worker
   - Navigate to Settings → Environment Variables
   - Copy all values from `.env.production`

2. **OAuth App Configuration**:
   - Set callback URLs to `https://abstorm-app.rbancroft.workers.dev/api/auth/callback/{provider}`
   - Use production OAuth app credentials
   - Update environment variables in Cloudflare Workers

3. **Deploy**:
   ```bash
   npm run build && npm run deploy
   ```

## Security Best Practices Implemented

### JWT Secret Security
- ✅ Different secrets per environment
- ✅ 32-byte cryptographically secure random generation
- ✅ Never committed to version control
- ✅ Proper hex encoding for compatibility

### OAuth Security
- ✅ Environment-specific OAuth app configurations
- ✅ Secure callback URL validation
- ✅ Separate development/production credentials
- ✅ CSRF protection with state parameters

### Environment Isolation
- ✅ Development environments use localhost URLs
- ✅ Production uses actual domain
- ✅ No credential mixing between environments
- ✅ Clear documentation for each environment

## OAuth Provider Callback URLs

### Development (Local)
- **GitHub**: `http://localhost:8787/api/auth/callback/github`
- **Google**: `http://localhost:8787/api/auth/callback/google`
- **X**: `http://localhost:8787/api/auth/callback/x`

### Production
- **GitHub**: `https://abstorm-app.rbancroft.workers.dev/api/auth/callback/github`
- **Google**: `https://abstorm-app.rbancroft.workers.dev/api/auth/callback/google`
- **X**: `https://abstorm-app.rbancroft.workers.dev/api/auth/callback/x`

## Environment File Reference

| File | Purpose | JWT Secret | Base URL | OAuth Apps |
|------|---------|------------|----------|------------|
| `.dev.vars` | Wrangler dev | `9a811bb0...` | localhost:8787 | Development |
| `.env.local` | Local React | `2fd56a16...` | localhost:5173 | Development |
| `.env.production` | Production | `f32d44f9...` | workers.dev | Production |

## Next Steps

1. **Configure OAuth Apps**: Create development and production OAuth applications
2. **Update Credentials**: Replace placeholder values with actual OAuth credentials
3. **Set Production Variables**: Copy `.env.production` values to Cloudflare Workers
4. **Test Authentication**: Verify OAuth flows work in both development and production
5. **Monitor Security**: Regularly rotate JWT secrets and OAuth credentials

This setup provides a secure, scalable foundation for OAuth authentication across all deployment environments.
