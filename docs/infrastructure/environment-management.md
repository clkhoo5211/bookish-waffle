# Environment Management Guide

## Overview

This document describes the environment management strategy for the RVM Web3 Payment PWA project.

## Environment Strategy

### Development
- **Purpose**: Local development and testing
- **Configuration**: Local `.env` file
- **Access**: Developers only
- **Features**: Hot reload, debugging, development tools

### Staging
- **Purpose**: Pre-production testing
- **Configuration**: Platform environment variables
- **Access**: Team members
- **Features**: Production-like environment, preview deployments

### Production
- **Purpose**: Live application
- **Configuration**: Platform environment variables (secrets)
- **Access**: Production deployment only
- **Features**: Optimized builds, CDN, monitoring

## Environment Variables

### Required Variables

#### `NEXT_PUBLIC_PRIVY_APP_ID`
- **Description**: Privy App ID for embedded wallet functionality
- **Required**: Yes
- **Environment**: All
- **Source**: Privy Dashboard (https://privy.io)
- **Example**: `clp1234567890abcdef`

#### `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- **Description**: WalletConnect Project ID for external wallet connections
- **Required**: Yes
- **Environment**: All
- **Source**: Reown Dashboard (https://cloud.reown.com)
- **Example**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### Optional Variables

#### `NEXT_PUBLIC_BASE_PATH`
- **Description**: Base path for static exports (e.g., GitHub Pages)
- **Required**: No (only for static exports with subpath)
- **Environment**: Production (GitHub Pages)
- **Example**: `/bookish-waffle`

#### `NODE_ENV`
- **Description**: Node.js environment
- **Required**: No (auto-set by build tools)
- **Environment**: All
- **Values**: `development`, `production`, `test`

## Local Development Setup

### 1. Create `.env.local` File

```bash
cp .env.example .env.local
```

### 2. Configure Variables

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Verify Configuration

- Check browser console for errors
- Test wallet connection
- Verify environment variables are loaded

## Platform Configuration

### Vercel

1. **Go to Project Settings → Environment Variables**
2. **Add Variables**:
   - `NEXT_PUBLIC_PRIVY_APP_ID` (Production, Preview, Development)
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (Production, Preview, Development)
3. **Redeploy** after adding variables

### GitHub Pages (via GitHub Actions)

1. **Go to Repository Settings → Secrets and variables → Actions**
2. **Add Secrets**:
   - `NEXT_PUBLIC_PRIVY_APP_ID`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
3. **Update Workflow** to use secrets:
   {% raw %}
   ```yaml
   env:
     NEXT_PUBLIC_PRIVY_APP_ID: ${{ secrets.NEXT_PUBLIC_PRIVY_APP_ID }}
     NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID }}
   ```
   {% endraw %}

### Netlify

1. **Go to Site Settings → Environment Variables**
2. **Add Variables**:
   - `NEXT_PUBLIC_PRIVY_APP_ID`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
3. **Redeploy** after adding variables

## Security Best Practices

### 1. Never Commit Secrets

- ❌ Don't commit `.env` files
- ✅ Use `.env.example` for templates
- ✅ Use `.gitignore` to exclude `.env*` files
- ✅ Use platform secrets for production

### 2. Use Platform Secrets

- ✅ Store secrets in platform secret management
- ✅ Use different secrets per environment
- ✅ Rotate secrets regularly
- ✅ Limit access to secrets

### 3. Validate Variables

- ✅ Check for required variables at startup
- ✅ Provide clear error messages
- ✅ Fail fast if variables are missing

## Variable Validation

### Runtime Validation

Add validation in `lib/env.ts`:

```typescript
export const env = {
  NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
};

// Validate required variables
if (!env.NEXT_PUBLIC_PRIVY_APP_ID) {
  console.warn('NEXT_PUBLIC_PRIVY_APP_ID is not set');
}

if (!env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}
```

## Environment-Specific Configurations

### Development
- Hot reload enabled
- Debug logging enabled
- Development tools enabled
- Local testing wallets

### Staging
- Production-like build
- Limited debugging
- Preview deployments
- Test credentials

### Production
- Optimized builds
- Error tracking
- Analytics enabled
- Production credentials

## Troubleshooting

### Variables Not Loading

1. **Check variable names**: Must start with `NEXT_PUBLIC_` for client-side
2. **Restart server**: After adding variables, restart dev server
3. **Check build**: Variables must be available at build time
4. **Verify platform**: Check platform settings for variable configuration

### Missing Variables

1. **Check `.env.local`**: Verify file exists and is configured
2. **Check platform**: Verify variables are set in platform settings
3. **Check workflow**: Verify GitHub Actions workflow uses secrets
4. **Redeploy**: Redeploy after adding variables

### Wrong Values

1. **Verify credentials**: Check Privy/WalletConnect dashboards
2. **Check environment**: Ensure correct environment is selected
3. **Clear cache**: Clear browser cache and rebuild
4. **Check logs**: Review build/deployment logs

## Migration Guide

### Adding New Variables

1. **Update `.env.example`**: Add new variable with description
2. **Update documentation**: Add to this guide
3. **Update validation**: Add to `lib/env.ts` if needed
4. **Update workflows**: Add to GitHub Actions if needed
5. **Update platforms**: Add to Vercel/Netlify/etc.

### Removing Variables

1. **Remove from code**: Remove all references
2. **Update `.env.example`**: Remove variable
3. **Update documentation**: Remove from this guide
4. **Update platforms**: Remove from platform settings

## Support

For environment variable issues:
1. Check this documentation
2. Review platform documentation
3. Check GitHub Issues
4. Contact platform support

