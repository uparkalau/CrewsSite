# Deploy CrewsSite to Vercel

## Quick Start (Recommended)

### 1. Push to GitHub
```bash
git add .
git commit -m "Add authentication and app structure"
git push origin master
```

### 2. Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your CrewsSite repository
4. Click "Import"

### 3. Add Environment Variables
In the Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add these variables:
   ```
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
3. Click "Deploy"

That's it! Vercel will automatically:
- Build your project
- Deploy to production
- Set up automatic deployments on `git push`

## Manual Deployment

### Option 1: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Using Docker
```bash
docker build -t crewssite .
docker run -p 3000:3000 crewssite
```

## Current Route Structure

**Landing Page:**
- `/` - Main landing page with features

**Authentication:**
- `/login` - User login
- `/signup` - User registration

**App Pages (Protected):**
- `/dashboard` - Main dashboard

## Next Steps After Deployment

1. **Set Up Firebase:**
   - Create Firebase project
   - Enable Authentication
   - Create Firestore database
   - Add credentials to `.env.local` and Vercel

2. **Uncomment Firebase Code:**
   - In `src/services/firebase.js`
   - Replace mock functions with real Firebase calls

3. **Build Features:**
   - Follow the [FEATURE_ROADMAP.md](../FEATURE_ROADMAP.md)
   - Start with Phase 1: Authentication

## Vercel Features Enabled

✅ **Automatic SSL** - HTTPS by default  
✅ **CDN** - Global edge network  
✅ **Auto Deploy** - Deploys on every `git push`  
✅ **Preview URLs** - Preview PRs before merging  
✅ **Serverless Functions** - Ready for API routes  
✅ **Custom Domain** - Easy domain setup  

## Testing Deployment

After deployment, visit your Vercel URL and test:
1. [ ] Landing page loads
2. [ ] Navigation works
3. [ ] `/login` page accessible
4. [ ] `/signup` page accessible
5. [ ] Form submission works

## Rollback Deployment

If something goes wrong:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." and select "Promote to Production"

## Monitoring & Debugging

Vercel provides logs:
- Build logs: Shown during deployment
- Runtime logs: Available in dashboard under "Functions"
- Error tracking: Can integrate with Sentry

## Performance Optimization

Vercel automatically optimizes:
- Image compression
- Code splitting
- Minification
- Caching headers

Monitor performance:
```
Vercel Dashboard → Analytics
```

## Support

- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vite.dev)
- [React Docs](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)

---

**Your app is ready to deploy!** 🚀
