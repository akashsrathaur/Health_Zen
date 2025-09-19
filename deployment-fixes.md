# Health_Zen Deployment Troubleshooting Guide

## Issues Found & Solutions

### 1. Environment Variables Missing
**Problem:** Firebase configuration is incomplete during deployment
**Solution:** 
- Set these environment variables on your deployment platform (Vercel/Netlify/etc.):
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  ```

### 2. Large Bundle Size Optimization
**Problem:** Large pack files (100MB+) causing deployment timeouts
**Solutions:**
- Clean build cache: `npm run clean` then `npm run build`
- Add bundle analyzer to identify large dependencies
- Consider code splitting for heavy components

### 3. Deployment Platform Configuration

#### For Vercel:
Create `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

#### For Netlify:
Create `netlify.toml`:
```toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. Next.js Configuration Issues
**Current config looks good, but ensure:**
- TypeScript errors are properly handled in production
- Image domains are correctly configured
- Build optimizations are enabled

### 5. Firebase Deployment (if using Firebase Hosting)
**Create firebase.json:**
```json
{
  "hosting": {
    "public": ".next",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Recommended Deployment Steps:

1. **Clean build:**
   ```bash
   rm -rf .next
   rm -rf node_modules
   npm install
   npm run build
   ```

2. **Test production locally:**
   ```bash
   npm run start
   ```

3. **Set environment variables** on your deployment platform

4. **Deploy with specific platform:**
   - **Vercel:** `npx vercel --prod`
   - **Netlify:** Connect GitHub repo in Netlify dashboard
   - **Firebase:** `firebase deploy`

## Quick Fixes to Try:

1. Clean the git cache of large files:
   ```bash
   git filter-branch --index-filter 'git rm -rf --cached --ignore-unmatch .next' HEAD
   ```

2. Add to .gitignore if missing:
   ```
   .next/
   node_modules/
   .env.local
   .env*.local
   ```

3. Optimize bundle size by adding this to next.config.ts:
   ```typescript
   const nextConfig = {
     experimental: {
       bundlePagesExternals: true
     },
     webpack: (config, { isServer }) => {
       if (!isServer) {
         config.resolve.fallback = {
           fs: false,
         };
       }
       return config;
     }
   };
   ```