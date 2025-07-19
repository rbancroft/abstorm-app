# OAuth Implementation

This commit adds OAuth callback URL functionality to the abstorm-app.

## Changes Made

### 1. Worker OAuth Routes
- Added `/api/auth/login/:provider` - Initiates OAuth flow
- Added `/api/auth/callback/:provider` - Handles OAuth callback
- Added `/api/auth/logout` - Handles user logout
- Added `/api/auth/user` - Returns current user info

### 2. React App Updates
- Added OAuth context provider for state management
- Added login/logout components
- Added protected route wrapper
- Updated main App component to include auth UI

### 3. Environment Variables
- Added OAuth provider configuration (GitHub, Google, etc.)
- Client ID and Client Secret management
- JWT secret for session management

## Supported OAuth Providers
- GitHub
- Google
- Can be extended for other providers

## Usage
1. Set environment variables in Cloudflare Workers
2. Configure OAuth app settings with your callback URLs
3. Use the login/logout components in your React app

## Security Features
- JWT-based session management
- Secure cookie handling
- CSRF protection
- State parameter validation