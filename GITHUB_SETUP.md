# GitHub Repository Setup Guide

This guide will help you set up the GitHub repository and deployment workflows for the RVM Web3 Payment PWA project.

## Repository Information

- **Repository URL**: https://github.com/clkhoo5211/bookish-waffle
- **Repository Name**: bookish-waffle
- **Project Name**: RVM Web3 Payment PWA

## Initial Setup

### 1. Add GitHub Remote

```bash
cd /Users/khoo/Downloads/project4/projects/project-20251105-101145-rvm-web3-pwa

# Add the GitHub remote
git remote add origin https://github.com/clkhoo5211/bookish-waffle.git

# Verify remote
git remote -v
```

### 2. Push to GitHub

```bash
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Why Vercel?**
- Optimized for Next.js applications
- Automatic HTTPS
- Global CDN
- Serverless functions support
- Easy environment variable management

**Setup Steps**:

1. **Create Vercel Account**:
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Repository**:
   - Click "Add New Project"
   - Select the `bookish-waffle` repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   - In Vercel project settings, add:
     - `NEXT_PUBLIC_PRIVY_APP_ID`
     - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
     - Any other required environment variables

4. **Get Vercel Tokens** (for GitHub Actions):
   - Go to Vercel Settings → Tokens
   - Create a new token
   - Copy the token

5. **Add GitHub Secrets**:
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Add secrets:
     - `VERCEL_TOKEN`: Your Vercel API token
     - `VERCEL_ORG_ID`: From Vercel project settings → General
     - `VERCEL_PROJECT_ID`: From Vercel project settings → General

6. **Deploy**:
   - Push to main branch, or
   - Manual deployment via GitHub Actions

**Your site will be available at**: `https://your-project.vercel.app`

### Option 2: GitHub Pages

**Why GitHub Pages?**
- Free hosting
- Simple setup
- Integrated with GitHub

**Setup Steps**:

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Select "GitHub Actions"

2. **Configure Next.js for Static Export**:
   - Update `next.config.js` when you create it:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     basePath: '/bookish-waffle',
     images: {
       unoptimized: true,
     },
   }
   
   module.exports = nextConfig
   ```

3. **Configure Environment Variables**:
   - Add to `.github/workflows/deploy-pages.yml`:
   ```yaml
   env:
     NEXT_PUBLIC_PRIVY_APP_ID: ${{ secrets.NEXT_PUBLIC_PRIVY_APP_ID }}
     NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID }}
   ```

4. **Add GitHub Secrets**:
   - Go to repository Settings → Secrets and variables → Actions
   - Add required environment variables

5. **Deploy**:
   - Push to main branch
   - Workflow will automatically deploy

**Your site will be available at**: `https://clkhoo5211.github.io/bookish-waffle/`

**Note**: GitHub Pages requires static export, which means no SSR. This is fine for PWAs, but you may need to adjust Next.js configuration.

## GitHub Actions Workflows

### Available Workflows

1. **CI** (`.github/workflows/ci.yml`)
   - Runs on every push/PR
   - Lints, tests, and builds the project

2. **Deploy to Vercel** (`.github/workflows/deploy-vercel.yml`)
   - Deploys to Vercel on push to main

3. **Deploy to GitHub Pages** (`.github/workflows/deploy-pages.yml`)
   - Deploys to GitHub Pages on push to main

4. **Deploy Preview** (`.github/workflows/deploy-preview.yml`)
   - Builds previews for pull requests

### Workflow Status Badge

Add to your README.md:

```markdown
![CI](https://github.com/clkhoo5211/bookish-waffle/workflows/CI/badge.svg)
![Deploy](https://github.com/clkhoo5211/bookish-waffle/workflows/Deploy%20to%20Vercel/badge.svg)
```

## Environment Variables Setup

### Required Environment Variables

For production deployment, you'll need:

1. **Privy Configuration**:
   - `NEXT_PUBLIC_PRIVY_APP_ID`: Get from https://privy.io

2. **WalletConnect Configuration**:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Get from https://cloud.walletconnect.com

3. **Optional RPC URLs**:
   - `NEXT_PUBLIC_ETHEREUM_RPC_URL`
   - `NEXT_PUBLIC_POLYGON_RPC_URL`
   - `NEXT_PUBLIC_BSC_RPC_URL`

### Adding Secrets to GitHub

1. Go to repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each environment variable:
   - Name: `NEXT_PUBLIC_PRIVY_APP_ID`
   - Secret: `your-actual-value`
4. Repeat for all required variables

### Local Development

Create `.env.local` file:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-key
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/your-key
```

**Note**: Never commit `.env.local` to Git (already in `.gitignore`)

## Repository Structure

```
bookish-waffle/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-vercel.yml
│   │   ├── deploy-pages.yml
│   │   └── deploy-preview.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
├── public/
├── docs/
├── README.md
└── ...
```

## Next Steps

1. **Complete Initial Setup**:
   ```bash
   git remote add origin https://github.com/clkhoo5211/bookish-waffle.git
   git branch -M main
   git push -u origin main
   ```

2. **Choose Deployment Option**:
   - Vercel (recommended) or GitHub Pages

3. **Configure Secrets**:
   - Add required environment variables to GitHub Secrets
   - Configure in deployment platform (Vercel/GitHub Pages)

4. **Test Deployment**:
   - Make a small change
   - Push to main branch
   - Verify deployment works

5. **Set Up Development Workflow**:
   - Create feature branches
   - Use pull requests
   - Let CI/CD handle testing and deployment

## Troubleshooting

### Push Fails
- Check if repository exists on GitHub
- Verify GitHub credentials
- Check repository permissions

### Deployment Fails
- Check workflow logs in GitHub Actions tab
- Verify secrets are correctly configured
- Check environment variable names match
- Ensure Next.js project is properly configured

### Workflow Not Triggering
- Check workflow file syntax
- Verify branch names match (main/master)
- Check workflow permissions

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Last Updated**: 2025-11-05  
**Project**: RVM Web3 Payment PWA

