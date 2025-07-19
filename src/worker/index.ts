import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

// Version info - will be replaced during build
const VERSION_INFO = {
  version: "__VERSION__",
  commitHash: "__COMMIT_HASH__", 
  buildTime: "__BUILD_TIME__"
};

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
}

interface OAuthProvider {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
  authUrl: string;
  tokenUrl: string;
  userUrl: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope?: string;
  expires_in?: number;
}

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string;
  avatar_url: string;
}

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface XUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
  email?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Helper function to get OAuth provider configuration
function getOAuthProvider(provider: string, env: Env): OAuthProvider | null {
  const baseUrl = env.BASE_URL || 'https://your-domain.com';
  
  switch (provider) {
    case 'github':
      if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
        return null;
      }
      return {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        redirectUri: `${baseUrl}/api/auth/callback/github`,
        scope: 'user:email',
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userUrl: 'https://api.github.com/user'
      };
    case 'google':
      if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
        return null;
      }
      return {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        redirectUri: `${baseUrl}/api/auth/callback/google`,
        scope: 'openid email profile',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
      };
    case 'x':
      if (!env.X_CLIENT_ID || !env.X_CLIENT_SECRET) {
        return null;
      }
      return {
        clientId: env.X_CLIENT_ID,
        clientSecret: env.X_CLIENT_SECRET,
        redirectUri: `${baseUrl}/api/auth/callback/x`,
        scope: 'tweet.read users.read offline.access',
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        tokenUrl: 'https://api.twitter.com/2/oauth2/token',
        userUrl: 'https://api.twitter.com/2/users/me'
      };
    default:
      return null;
  }
}

// Generate a random state parameter for CSRF protection
function generateState(): string {
  return crypto.randomUUID();
}

// Create JWT token for user session
async function createUserToken(user: User, env: Env): Promise<string> {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    provider: user.provider,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return await sign(payload, env.JWT_SECRET || 'your-secret-key');
}

// Verify JWT token
async function verifyUserToken(token: string, env: Env): Promise<User | null> {
  try {
    const payload = await verify(token, env.JWT_SECRET || 'your-secret-key');
    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      avatar: payload.avatar as string,
      provider: payload.provider as string
    };
  } catch {
    return null;
  }
}

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/version", (c) => {
  return c.json({
    version: VERSION_INFO.version,
    commitHash: VERSION_INFO.commitHash,
    buildTime: VERSION_INFO.buildTime,
    timestamp: new Date().toISOString()
  });
});

// OAuth login endpoint
app.get("/api/auth/login/:provider", async (c) => {
  const provider = c.req.param('provider');
  const oauthConfig = getOAuthProvider(provider, c.env);
  
  if (!oauthConfig) {
    return c.json({ error: 'Unsupported OAuth provider' }, 400);
  }
  
  const state = generateState();
  
  // Store state in a secure cookie for verification
  setCookie(c, 'oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 600 // 10 minutes
  });
  
  const authUrl = new URL(oauthConfig.authUrl);
  authUrl.searchParams.set('client_id', oauthConfig.clientId);
  authUrl.searchParams.set('redirect_uri', oauthConfig.redirectUri);
  authUrl.searchParams.set('scope', oauthConfig.scope);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('response_type', 'code');
  
  return c.redirect(authUrl.toString());
});

// OAuth callback endpoint
app.get("/api/auth/callback/:provider", async (c) => {
  const provider = c.req.param('provider');
  const code = c.req.query('code');
  const state = c.req.query('state');
  const storedState = getCookie(c, 'oauth_state');
  
  if (!code || !state || state !== storedState) {
    return c.json({ error: 'Invalid OAuth callback' }, 400);
  }
  
  const oauthConfig = getOAuthProvider(provider, c.env);
  if (!oauthConfig) {
    return c.json({ error: 'Unsupported OAuth provider' }, 400);
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch(oauthConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
        code: code,
        redirect_uri: oauthConfig.redirectUri,
        grant_type: 'authorization_code'
      })
    });
    
    const tokenData = await tokenResponse.json() as TokenResponse;
    
    if (!tokenData.access_token) {
      throw new Error('No access token received');
    }
    
    // Get user information
    const userResponse = await fetch(oauthConfig.userUrl, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json'
      }
    });
    
    const userData = await userResponse.json();
    
    // Create user object based on provider
    let user: User;
    if (provider === 'github') {
      const githubUser = userData as GitHubUser;
      user = {
        id: githubUser.id.toString(),
        email: githubUser.email,
        name: githubUser.name || githubUser.login,
        avatar: githubUser.avatar_url,
        provider: 'github'
      };
    } else if (provider === 'google') {
      const googleUser = userData as GoogleUser;
      user = {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
        provider: 'google'
      };
    } else if (provider === 'x') {
      const xUser = userData as XUser;
      user = {
        id: xUser.id,
        email: xUser.email || `${xUser.username}@x.com`, // X doesn't always provide email
        name: xUser.name || xUser.username,
        avatar: xUser.profile_image_url,
        provider: 'x'
      };
    } else {
      throw new Error('Unsupported provider');
    }
    
    // Create JWT token
    const token = await createUserToken(user, c.env);
    
    // Set secure cookie with JWT
    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 // 24 hours
    });
    
    // Clear state cookie
    deleteCookie(c, 'oauth_state');
    
    // Redirect to success page
    return c.redirect('/?auth=success');
    
  } catch (error) {
    console.error('OAuth error:', error);
    return c.redirect('/?auth=error');
  }
});

// Get current user
app.get("/api/auth/user", async (c) => {
  const token = getCookie(c, 'auth_token');
  
  if (!token) {
    return c.json({ user: null });
  }
  
  const user = await verifyUserToken(token, c.env);
  return c.json({ user });
});

// Logout endpoint
app.post("/api/auth/logout", (c) => {
  deleteCookie(c, 'auth_token');
  return c.json({ success: true });
});

export default app;
