# Deployment Guide - RVM Web3 Payment PWA

## Overview

This guide provides step-by-step instructions for deploying the RVM Web3 Payment PWA to various platforms.

## Prerequisites

- Node.js 18+ and npm 9+
- Git repository access
- Platform accounts (Vercel, GitHub, etc.)
- Environment variables configured

## Deployment Platforms

### 1. Vercel (Recommended for Next.js)

Vercel is the recommended platform for Next.js applications, offering:
- Automatic deployments
- Edge network optimization
- Built-in analytics
- Preview deployments

#### Setup Steps

1. **Install Vercel CLI** (optional for manual deployment):
   ```bash
   npm install -g vercel
   ```

2. **Link Project**:
   ```bash
   vercel link
   ```

3. **Configure Environment Variables**:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_PRIVY_APP_ID`
     - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

4. **Deploy**:
   ```bash
   vercel --prod
   ```

   Or use GitHub Actions workflow (automatic on push to main).

#### GitHub Actions Integration

The project includes automatic Vercel deployment via GitHub Actions. Configure these secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### 2. GitHub Pages

GitHub Pages provides free static hosting for GitHub repositories.

#### Setup Steps

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Save

2. **Configure Environment Variables** (if needed):
   - Go to repository Settings → Secrets and variables → Actions
   - Add secrets:
     - `NEXT_PUBLIC_PRIVY_APP_ID`
     - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

3. **Update next.config.js** (if using repository pages):
   ```javascript
   const nextConfig = {
     basePath: '/bookish-waffle',
     assetPrefix: '/bookish-waffle',
     output: 'export',
   };
   ```

4. **Deploy**:
   - Push to `main` branch
   - GitHub Actions will automatically deploy
   - Or manually trigger workflow in Actions tab

#### URL Structure

- Repository Pages: `https://[username].github.io/bookish-waffle`
- User Pages: `https://[username].github.io`

### 3. Netlify

Netlify is another excellent option for Next.js static exports.

#### Setup Steps

1. **Connect Repository**:
   - Go to Netlify Dashboard
   - Add new site from Git
   - Select repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `20.x`

3. **Set Environment Variables**:
   - Go to Site settings → Environment variables
   - Add:
     - `NEXT_PUBLIC_PRIVY_APP_ID`
     - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

4. **Deploy**:
   - Automatic on push to main branch
   - Or trigger manual deploy

## Environment Configuration

### Required Environment Variables

| Variable | Description | Required For |
|----------|-------------|--------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy App ID for embedded wallets | All environments |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID | All environments |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_PATH` | Base path for static exports | `/` |
| `NODE_ENV` | Node environment | `production` |

### Getting Credentials

1. **Privy App ID**:
   - Sign up at https://privy.io
   - Create a new app
   - Copy App ID from dashboard

2. **WalletConnect Project ID**:
   - Sign up at https://cloud.reown.com
   - Create a new project
   - Copy Project ID from dashboard

## Build Configuration

### Static Export (for GitHub Pages, Netlify)

For static hosting, update `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
};
```

### Server-Side Rendering (for Vercel)

For Vercel, use default Next.js configuration (no static export needed).

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Tests pass (if applicable)

### Deployment

- [ ] Push to main branch
- [ ] Verify CI pipeline passes
- [ ] Check deployment status
- [ ] Verify deployment URL

### Post-Deployment

- [ ] Test application in production
- [ ] Verify wallet connections work
- [ ] Check all pages load correctly
- [ ] Verify PWA functionality
- [ ] Test on mobile devices

## Troubleshooting

### Build Failures

1. **Check Node.js version**: Ensure Node.js 18+ is used
2. **Check dependencies**: Run `npm ci` to ensure clean install
3. **Check environment variables**: Verify all required variables are set
4. **Check build logs**: Review build output for errors

### Deployment Failures

1. **Vercel**:
   - Check Vercel dashboard for errors
   - Verify environment variables are set
   - Check build logs

2. **GitHub Pages**:
   - Verify Pages is enabled
   - Check Actions workflow status
   - Verify base path configuration

### Runtime Issues

1. **Environment variables not loading**:
   - Ensure variables start with `NEXT_PUBLIC_`
   - Verify variables are set in platform settings
   - Restart deployment after adding variables

2. **Wallet connection issues**:
   - Verify Privy App ID is correct
   - Verify WalletConnect Project ID is correct
   - Check browser console for errors

## Rollback Procedure

### Vercel

1. Go to Vercel Dashboard → Deployments
2. Select previous deployment
3. Click "Promote to Production"

### GitHub Pages

1. Go to repository → Actions
2. Find previous successful deployment
3. Re-run the workflow

### Manual Rollback

```bash
# Checkout previous version
git checkout [previous-commit-hash]

# Push to main (will trigger deployment)
git push origin main --force-with-lease
```

## Monitoring

### Vercel Analytics

- Built-in analytics in Vercel dashboard
- Performance metrics
- Error tracking

### GitHub Pages

- Monitor via GitHub Actions
- Check deployment status in Actions tab

### Custom Monitoring

- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor API endpoints
- Track user analytics

## Security Considerations

1. **Never commit secrets**: Always use environment variables
2. **Use HTTPS**: All platforms provide HTTPS by default
3. **Enable security headers**: Configure in platform settings
4. **Monitor for vulnerabilities**: Regular dependency updates
5. **Use branch protection**: Prevent direct pushes to main

## Performance Optimization

1. **Enable caching**: Configure CDN caching
2. **Optimize images**: Use Next.js Image component
3. **Code splitting**: Automatic with Next.js
4. **Minimize bundle size**: Use production build
5. **Enable compression**: Configure in platform settings

## Support

For deployment issues:
1. Check platform documentation
2. Review build logs
3. Check GitHub Issues
4. Contact platform support

