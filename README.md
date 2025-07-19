# React + Vite + Hono + Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

This template provides a minimal setup for building a React application with TypeScript and Vite, designed to run on Cloudflare Workers. It features hot module replacement, ESLint integration, and the flexibility of Workers deployments.

![React + TypeScript + Vite + Cloudflare Workers](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fc7b4b62-442b-4769-641b-ad4422d74300/public)

<!-- dash-content-start -->

🚀 Supercharge your web development with this powerful stack:

- [**React**](https://react.dev/) - A modern UI library for building interactive interfaces
- [**Vite**](https://vite.dev/) - Lightning-fast build tooling and development server
- [**Hono**](https://hono.dev/) - Ultralight, modern backend framework
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform for global deployment

### ✨ Key Features

- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript support out of the box
- 🛠️ ESLint configuration included
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing
- 🔄 Full-stack development setup
- 🔐 **OAuth Authentication** - GitHub and Google login support
- 🛡️ **Secure Sessions** - JWT-based authentication with secure cookies
- 👤 **User Management** - Complete user profile and session handling

Get started in minutes with local development or deploy directly via the Cloudflare dashboard. Perfect for building modern, performant web applications at the edge.

<!-- dash-content-end -->

## Getting Started

To start a new project with this template, run:

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/vite-react-template
```

A live deployment of this template is available at:
[https://react-vite-template.templates.workers.dev](https://react-vite-template.templates.workers.dev)

## Development

Install dependencies:

```bash
npm install
```

Start the development server with:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npm run build && npm run deploy
```

## OAuth Authentication

This template includes a complete OAuth authentication system supporting GitHub and Google login.

### Quick Setup

1. **Set Environment Variables**: Configure OAuth credentials in your Cloudflare Workers environment
2. **Create OAuth Apps**: Set up GitHub and/or Google OAuth applications
3. **Configure Callback URLs**: Use `https://your-domain.com/api/auth/callback/{provider}`

For detailed setup instructions, see [docs/OAUTH_SETUP.md](docs/OAUTH_SETUP.md).

### OAuth Features

- Multiple provider support (GitHub, Google, X)
- Secure JWT-based sessions
- CSRF protection with state parameters
- Automatic session management
- User profile display and logout

### API Endpoints

- `GET /api/auth/login/:provider` - Initiate OAuth login
- `GET /api/auth/callback/:provider` - Handle OAuth callback
- `GET /api/auth/user` - Get current user info
- `POST /api/auth/logout` - Logout user

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
