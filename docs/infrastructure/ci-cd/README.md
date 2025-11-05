# CI/CD Pipeline Documentation

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipelines for the RVM Web3 Payment PWA project.

## Pipeline Architecture

### GitHub Actions Workflows

The project uses GitHub Actions for CI/CD automation. All workflows are located in `.github/workflows/`.

#### 1. CI Pipeline (`ci.yml`)

**Trigger**: 
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop` branches

**Jobs**:
- **lint-and-test**: Runs linting, type checking, tests, and build verification
  - Matrix strategy: Node.js 18.x and 20.x
  - Steps:
    1. Checkout code
    2. Setup Node.js
    3. Install dependencies (`npm ci`)
    4. Run linter (`npm run lint`)
    5. Run type check (`npm run type-check`)
    6. Run tests (`npm test`)
    7. Build project (`npm run build`)

**Status**: ✅ Active

#### 2. Deploy to Vercel (`deploy-vercel.yml`)

**Trigger**:
- Push to `main` or `master` branches
- Manual workflow dispatch

**Jobs**:
- **deploy**: Deploys to Vercel production environment
  - Steps:
    1. Checkout code
    2. Setup Node.js 20.x
    3. Install dependencies
    4. Install Vercel CLI
    5. Pull Vercel environment information
    6. Build project artifacts
    7. Deploy to Vercel production

**Required Secrets**:
- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

**Status**: ✅ Active (requires Vercel secrets configuration)

#### 3. Deploy to GitHub Pages (`deploy-pages.yml`)

**Trigger**:
- Push to `main` or `master` branches
- Manual workflow dispatch

**Jobs**:
- **build**: Builds static export for GitHub Pages
  - Steps:
    1. Checkout code
    2. Setup Node.js 20.x
    3. Install dependencies
    4. Build for static export
    5. Setup Pages
    6. Upload artifact
- **deploy**: Deploys to GitHub Pages
  - Runs only if build succeeds
  - Steps:
    1. Wait for build job
    2. Deploy to GitHub Pages

**Required Secrets** (Optional for environment variables):
- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy App ID
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect Project ID

**Status**: ✅ Active (requires GitHub Pages to be enabled in repository settings)

#### 4. Preview Deployment (`deploy-preview.yml`)

**Trigger**:
- Pull requests to `main` or `master` branches

**Jobs**:
- **preview**: Creates preview deployment for PR review
  - Steps:
    1. Checkout code
    2. Setup Node.js 20.x
    3. Install dependencies
    4. Build project
    5. Deploy preview (Vercel or similar)

**Status**: ✅ Active

## Pipeline Status

### Current Status
- ✅ CI Pipeline: Active
- ✅ Vercel Deployment: Configured (requires secrets)
- ✅ GitHub Pages Deployment: Configured (requires Pages enabled)
- ✅ Preview Deployments: Configured

## Environment Variables

### Required for Production
- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy App ID
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect Project ID

### Optional
- `NEXT_PUBLIC_BASE_PATH`: Base path for static exports (e.g., `/bookish-waffle` for GitHub Pages)

### Setting Secrets in GitHub

1. Go to repository Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `NEXT_PUBLIC_PRIVY_APP_ID`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `VERCEL_TOKEN` (for Vercel deployment)
   - `VERCEL_ORG_ID` (for Vercel deployment)
   - `VERCEL_PROJECT_ID` (for Vercel deployment)

## Deployment Environments

### Development
- **Branch**: `develop`
- **Auto-deploy**: No (CI only)
- **URL**: Local development server

### Staging
- **Branch**: `main` (preview deployments)
- **Auto-deploy**: Yes (via PR previews)
- **URL**: Preview URLs (Vercel or GitHub Pages preview)

### Production
- **Branch**: `main` or `master`
- **Auto-deploy**: Yes
- **URL**: 
  - Vercel: [Configured in Vercel dashboard]
  - GitHub Pages: `https://[username].github.io/bookish-waffle`

## Monitoring and Notifications

### Status Checks
- All workflows report status to GitHub
- PR status checks must pass before merge

### Notifications
- GitHub Actions sends notifications on workflow failures
- Configure email/Slack notifications in repository settings

## Troubleshooting

### Common Issues

1. **Build fails with "package.json not found"**
   - Expected during initial setup phase
   - Will resolve once Next.js project is initialized

2. **Vercel deployment fails**
   - Verify Vercel secrets are configured
   - Check Vercel project is linked to repository

3. **GitHub Pages deployment fails**
   - Enable GitHub Pages in repository settings
   - Set source to "GitHub Actions"
   - Verify base path is correct if using repository pages

4. **Environment variables not available**
   - Add secrets in GitHub repository settings
   - For Vercel, configure in Vercel dashboard

## Best Practices

1. **Never commit secrets**: Always use GitHub Secrets
2. **Test locally first**: Run `npm run build` before pushing
3. **Review PR previews**: Test preview deployments before merging
4. **Monitor deployments**: Check deployment status after each push
5. **Use branch protection**: Require status checks before merge

## Next Steps

1. Configure Vercel secrets (if using Vercel)
2. Enable GitHub Pages (if using GitHub Pages)
3. Set up monitoring and alerting
4. Configure branch protection rules
5. Set up automated testing

