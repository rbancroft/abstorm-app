# OAuth Setup Guide

This guide will help you configure OAuth authentication for your Abstorm app.

## Overview

The OAuth implementation supports multiple providers:
- GitHub
- Google
- X (formerly Twitter)
- Extensible for other providers

## Setup Steps

### 1. Configure Environment Variables

Set the following environment variables in your Cloudflare Workers dashboard:

```bash
BASE_URL=https://your-domain.com
JWT_SECRET=your-super-secure-jwt-secret-key-here
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
X_CLIENT_ID=your-x-client-id
X_CLIENT_SECRET=your-x-client-secret
```

### 2. Create OAuth Applications

#### GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Fill in the application details:
   - **Application name**: Your app name
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/api/auth/callback/github`
3. Click "Register application"
4. Copy the **Client ID** and **Client Secret**

#### Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create credentials (OAuth 2.0 Client ID):
   - **Application type**: Web application
   - **Name**: Your app name
   - **Authorized redirect URIs**: `https://your-domain.com/api/auth/callback/google`
5. Copy the **Client ID** and **Client Secret**

#### X (Twitter) OAuth App
1. Go to [X Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Apply for API access if you haven't already
3. Create a new app or select an existing one
4. Go to your app's settings and find "Authentication settings"
5. Configure OAuth 2.0 settings:
   - **App permissions**: Read users and tweets
   - **Type of App**: Web App
   - **Callback URI**: `https://your-domain.com/api/auth/callback/x`
   - **Website URL**: `https://your-domain.com`
6. Copy the **Client ID** and **Client Secret** from the "Keys and tokens" tab

### 3. Update Cloudflare Workers Environment

1. Go to your Cloudflare Workers dashboard
2. Select your worker
3. Go to Settings → Environment Variables
4. Add all the environment variables from step 1

### 4. Deploy Your Application

```bash
npm run deploy
```

## API Endpoints

The OAuth implementation provides the following endpoints:

- `GET /api/auth/login/:provider` - Initiates OAuth flow
- `GET /api/auth/callback/:provider` - Handles OAuth callback
- `GET /api/auth/user` - Returns current user info
- `POST /api/auth/logout` - Logs out the user

## Security Features

- **JWT-based sessions**: Secure token-based authentication
- **Secure cookies**: HttpOnly, Secure, SameSite protection
- **CSRF protection**: State parameter validation
- **Token verification**: Proper JWT signature validation

## Usage in React

The OAuth functionality is integrated into your React app through:

1. **AuthContext**: Provides authentication state management
2. **LoginButton**: Component for initiating OAuth login
3. **UserProfile**: Component for displaying user info and logout

Example usage:

```tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>;
  }
  
  return <button onClick={() => login('github')}>Login</button>;
}
```

## Troubleshooting

### Common Issues

1. **"Invalid OAuth callback"**: Check that your callback URLs match exactly
2. **"Unsupported OAuth provider"**: Ensure environment variables are set
3. **Login not working**: Verify BASE_URL matches your deployed domain
4. **Session not persisting**: Check JWT_SECRET is set and consistent

### Testing Locally

For local development, you can:
1. Use `wrangler dev` to test the worker locally
2. Set up ngrok or similar for public callback URLs
3. Update OAuth app settings to use your temporary public URL

## Adding New OAuth Providers

To add a new OAuth provider:

1. Update the `getOAuthProvider` function in `worker/index.ts`
2. Add environment variables for the new provider
3. Handle the provider-specific user data format
4. Update the login buttons in the React app

Example for adding Discord:

```typescript
case 'discord':
  return {
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
    redirectUri: `${baseUrl}/api/auth/callback/discord`,
    scope: 'identify email',
    authUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userUrl: 'https://discord.com/api/users/@me'
  };
```
