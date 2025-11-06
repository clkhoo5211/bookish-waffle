# Performance Optimization Guide

## 🐌 Slow DOM Loading Issues Identified

### Root Causes of Slow Loading:

1. **Large Web3 Bundle Size**
   - `@reown/appkit` (~500KB)
   - `wagmi + viem` (~300KB)
   - `@privy-io/react-auth` (~200KB)
   - Total Web3 libraries: ~1MB uncompressed

2. **Google Fonts Blocking**
   - Two fonts loading from Google Fonts CDN
   - Network latency before font display
   - No fallback fonts causing FOUT (Flash of Unstyled Text)

3. **Inefficient Webpack Bundling**
   - All packages in single vendor chunk
   - No code splitting for large libraries
   - Module resolution slowness

4. **Heavy Home Page**
   - 609 lines with inline data arrays
   - Multiple useEffect hooks running immediately
   - Auto-scroll timers starting on mount

## ✅ Optimizations Applied

### 1. Webpack Bundle Splitting

**Before:**
```javascript
// Single vendor chunk with everything
splitChunks: {
  chunks: 'all',
  cacheGroups: {
    phosphor: { ... },
    reown: { ... }
  }
}
```

**After:**
```javascript
splitChunks: {
  chunks: 'all',
  cacheGroups: {
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendors',
      priority: 10,
      reuseExistingChunk: true,
    },
    reown: {
      test: /[\\/]node_modules[\\/]@reown/,
      name: 'reown', // Separate 500KB chunk
      priority: 20,
    },
    web3: {
      test: /[\\/]node_modules[\\/](wagmi|viem|@wagmi)/,
      name: 'web3', // Separate 300KB chunk
      priority: 15,
    },
    phosphor: {
      test: /[\\/]node_modules[\\/]phosphor-icons/,
      name: 'phosphor',
      priority: 20,
    },
  },
},
moduleIds: 'deterministic', // Better caching
runtimeChunk: 'single', // Shared runtime
```

**Impact:** Parallel loading of chunks instead of sequential

### 2. Font Loading Optimization

**Before:**
```typescript
const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});
```

**After:**
```typescript
const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true, // Preload font files
  fallback: ['system-ui', 'sans-serif'], // Immediate fallback
});
```

**Impact:** 
- Fonts preloaded in parallel
- Fallback fonts prevent FOUT
- Faster perceived load time

### 3. Experimental Performance Features

```javascript
experimental: {
  optimizeCss: true, // CSS optimization
  optimizePackageImports: ['lucide-react', '@reown/appkit'], // Tree-shaking
},
```

**Impact:** Smaller CSS bundle, unused code removal

### 4. Module Resolution Speed

```javascript
config.resolve.symlinks = false;
```

**Impact:** Faster module resolution during build

## 📊 Performance Metrics

### Expected Improvements:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Bundle Size** | ~1.5MB | ~1.2MB | 20% smaller |
| **Initial Load** | 3-4s | 1.5-2s | 50% faster |
| **Time to Interactive** | 4-5s | 2-3s | 40% faster |
| **Font Loading** | 1-2s | 0.5-1s | 50% faster |
| **Chunks** | 1-2 large | 5 parallel | Better caching |

## 🚀 Further Optimizations (If Still Slow)

### 1. Lazy Load Web3 Providers

```typescript
// Only load Web3 when user clicks "Connect Wallet"
const Web3Providers = dynamic(() => import('@/lib/web3/providers'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
```

### 2. Move Banner Data to Separate File

```typescript
// Move horizontalBanners array to:
// /data/banners.ts
export const horizontalBanners = [ ... ];

// Import only when needed
import { horizontalBanners } from '@/data/banners';
```

### 3. Defer Non-Critical Scripts

```typescript
// In layout.tsx
<Script src="..." strategy="lazyOnload" />
```

### 4. Use Next.js Font Optimization

Consider switching to self-hosted fonts:
```typescript
import localFont from 'next/font/local';

const outfit = localFont({
  src: './fonts/Outfit-Variable.woff2',
  variable: '--font-outfit',
  display: 'swap',
});
```

### 5. Image Optimization

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080],
  imageSizes: [16, 32, 48, 64, 96],
},
```

### 6. Remove Unused Dependencies

Check and remove:
- Unused Privy if only using Reown
- Duplicate Web3 libraries
- Large icon libraries (use selective imports)

## 🔍 Monitoring Performance

### In Development:

```bash
# Build and analyze bundle
npm run build
npx @next/bundle-analyzer
```

### In Browser DevTools:

1. **Network Tab:**
   - Check chunk loading times
   - Identify large files
   - Verify parallel loading

2. **Performance Tab:**
   - Record page load
   - Check "DOM Content Loaded"
   - Measure "Time to Interactive"

3. **Lighthouse Audit:**
   - Run performance audit
   - Check First Contentful Paint (FCP)
   - Check Largest Contentful Paint (LCP)

### Target Metrics:

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Total Blocking Time:** < 300ms

## 🎯 Quick Wins Checklist

- [x] Split Web3 libraries into separate chunks
- [x] Optimize font loading with preload + fallbacks
- [x] Enable CSS optimization
- [x] Enable package import optimization
- [x] Clear Next.js cache (.next folder)
- [ ] Consider lazy loading Web3 providers
- [ ] Move large data arrays to separate files
- [ ] Audit and remove unused dependencies
- [ ] Consider self-hosted fonts
- [ ] Add bundle analyzer to CI/CD

## 📝 Configuration Files

### Current Optimized Config:
- `next.config.js` - Production-ready performance config

### Backup:
- `next.config.old.js` - Previous configuration

### Switching Back:
```bash
mv next.config.js next.config.performance.js
mv next.config.old.js next.config.js
npm run dev
```

## 🔧 Troubleshooting

### If build fails:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### If fonts don't load:
- Check Network tab for font requests
- Verify Google Fonts CDN is accessible
- Consider switching to local fonts

### If chunks fail to load:
- Clear browser cache
- Check webpack splitChunks configuration
- Verify all imports are correct

## 📚 References

- [Next.js Performance](https://nextjs.org/docs/pages/building-your-application/optimizing/performance)
- [Web Vitals](https://web.dev/vitals/)
- [Webpack Optimization](https://webpack.js.org/guides/code-splitting/)
- [Next.js Font Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts)
