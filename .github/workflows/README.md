# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD and deployment.

## Available Workflows

### 1. CI (`ci.yml`)
**Trigger**: On push/PR to main, master, or develop branches

**Purpose**: 
- Runs linting, type checking, and tests
- Builds the project to verify it compiles
- Runs on multiple Node.js versions (18.x, 20.x)

**Status**: Configured to continue on error until project setup is complete

### 2. Deploy to Vercel (`deploy-vercel.yml`)
**Trigger**: On push to main/master or manual trigger

**Purpose**: 
- Deploys the Next.js application to Vercel
- Best option for Next.js applications with SSR support

**Required Secrets**:
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

**Setup**:
1. Create a Vercel project at https://vercel.com
2. Get your tokens from Vercel dashboard
3. Add secrets to GitHub repository settings

### 3. Deploy to GitHub Pages (`deploy-pages.yml`)
**Trigger**: On push to main/master or manual trigger

**Purpose**: 
- Deploys a static export of the Next.js app to GitHub Pages
- Requires Next.js to be configured for static export

**Required Configuration**:
- Enable GitHub Pages in repository settings
- Set source to "GitHub Actions"
- Configure `next.config.js` for static export if using Next.js

**Note**: For Next.js apps, you may need to configure static export in `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/bookish-waffle', // Your repository name
  images: {
    unoptimized: true,
  },
}
```

### 4. Deploy Preview (`deploy-preview.yml`)
**Trigger**: On pull requests

**Purpose**: 
- Builds the project for preview
- Can be extended to create preview deployments

## Setup Instructions

### For Vercel Deployment (Recommended for Next.js)

1. **Create Vercel Project**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

2. **Get Vercel Tokens**:
   - Go to Vercel Settings → Tokens
   - Create a new token
   - Copy the token

3. **Add GitHub Secrets**:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel API token
     - `VERCEL_ORG_ID`: Found in Vercel project settings
     - `VERCEL_PROJECT_ID`: Found in Vercel project settings

4. **Push to main branch**:
   - The workflow will automatically deploy to Vercel

### For GitHub Pages Deployment

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Select "GitHub Actions"

2. **Configure Next.js for Static Export** (if using Next.js):
   - Update `next.config.js` with static export configuration
   - See note in `deploy-pages.yml` section above

3. **Push to main branch**:
   - The workflow will automatically deploy to GitHub Pages
   - Your site will be available at: `https://clkhoo5211.github.io/bookish-waffle/`

## Environment Variables

For both deployment methods, you'll need to configure environment variables:

### Required for Production:
- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy application ID
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID

### Optional:
- RPC URLs for different blockchain networks
- API keys for third-party services

**Add to GitHub Secrets**:
- Go to repository Settings → Secrets and variables → Actions
- Add each environment variable as a secret

**For Vercel**: Add environment variables in Vercel dashboard
**For GitHub Pages**: Add to workflow file or use GitHub Secrets

## Manual Deployment

You can manually trigger deployments:
- Go to Actions tab in GitHub
- Select the workflow
- Click "Run workflow"

## Troubleshooting

### Build Fails
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

### Deployment Fails
- Verify secrets are correctly configured
- Check Vercel project settings
- Review GitHub Pages settings
- Check workflow logs for specific errors

### Environment Variables Not Working
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Verify secrets are added to GitHub repository settings
- Check workflow file for correct variable usage

---

**Last Updated**: 2025-11-05  
**Project**: RVM Web3 Payment PWA

