# X (Twitter) OAuth Quick Setup Guide

## Prerequisites
- X Developer Account with API access
- Approved X OAuth 2.0 app

## Setup Steps

### 1. Create X OAuth App
1. Go to [X Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use existing one
3. In app settings, go to "Authentication settings"
4. Enable OAuth 2.0 and configure:
   - **App permissions**: Read users and tweets  
   - **Type of App**: Web App
   - **Callback URI**: `https://your-domain.com/api/auth/callback/x`
   - **Website URL**: `https://your-domain.com`

### 2. Get Credentials
1. Go to "Keys and tokens" tab
2. Copy **Client ID** and **Client Secret**

### 3. Set Environment Variables
In your Cloudflare Workers environment:
```
X_CLIENT_ID=your-x-client-id
X_CLIENT_SECRET=your-x-client-secret
```

### 4. Test Integration
- Users can now click "Login with X"
- After successful auth, user profile will show X data
- Username is used as fallback if display name unavailable
- Email may not always be available from X

## X OAuth Specifics

**Scopes**: `tweet.read users.read offline.access`
- `tweet.read`: Access to read tweets
- `users.read`: Access to user profile information
- `offline.access`: Refresh token support

**User Data Available**:
- User ID
- Username (@handle)
- Display name
- Profile image
- Email (if provided by user)

**Note**: X doesn't always provide email addresses, so the system uses `username@x.com` as a fallback email format.

## Troubleshooting

- **"Invalid callback URI"**: Ensure the callback URL in X app settings exactly matches your domain
- **"Insufficient permissions"**: Check that your X app has the required scopes enabled
- **"Rate limited"**: X has strict rate limits for OAuth requests
- **No email**: This is normal - X users can choose not to share their email
