# 🚀 Scholarship Track Portal - Complete Setup Guide

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Supabase Configuration](#supabase-configuration)
3. [Google OAuth Setup](#google-oauth-setup)
4. [Running the Application](#running-the-application)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### 1. Prerequisites Check

Verify you have the following installed:

```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
git --version   # Any recent version
```

### 2. Project Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd internshiportal

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

---

## Supabase Configuration

### Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: scholarship-track-portal
   - **Database Password**: (Generate strong password and save it)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

### Step 2: Get API Credentials

1. In your Supabase project, go to **Settings** (⚙️ icon) > **API**
2. Copy the following:
   - **Project URL** (under Project URL)
   - **anon public** key (under Project API keys)

### Step 3: Configure Environment Variables

Create `.env.local` file in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual credentials!

### Step 4: Set Up Database Schema

1. In Supabase Dashboard, go to **SQL Editor** (</> icon)
2. Click "New Query"
3. Copy the entire content from `supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press `Ctrl/Cmd + Enter`
6. Verify success (you should see "Success. No rows returned")

### Step 5: Verify Tables Created

1. Go to **Table Editor** (📊 icon)
2. You should see these tables:
   - users
   - scholarships
   - applications
   - notifications

### Step 6: Enable Email Auth

1. Go to **Authentication** > **Providers**
2. Email provider should be enabled by default
3. Under **Email** settings:
   - ✅ Enable email confirmations (optional for production)
   - ✅ Enable email change confirmations (optional)

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click "Select a project" → "New Project"
3. Enter project name: "Scholarship Track Portal"
4. Click "Create"

### Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (unless you have Google Workspace)
3. Click "Create"
4. Fill in:
   - **App name**: Scholarship Track Portal
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Click "Save and Continue"
6. Skip "Scopes" → Click "Save and Continue"
7. Add test users (optional for development)
8. Click "Save and Continue"

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click "+ CREATE CREDENTIALS" > "OAuth client ID"
3. Application type: **Web application**
4. Name: "Scholarship Track Portal Web Client"
5. Add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/callback
   https://your-project.supabase.co/auth/v1/callback
   ```
7. Click "Create"
8. Copy **Client ID** and **Client Secret** (you'll need these)

### Step 4: Configure Google OAuth in Supabase

1. Go to your Supabase project
2. Navigate to **Authentication** > **Providers**
3. Find **Google** and click to expand
4. Toggle "Enable Google" to ON
5. Paste:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
6. Copy the **Callback URL** shown (should be `https://your-project.supabase.co/auth/v1/callback`)
7. Go back to Google Cloud Console and ensure this URL is in your authorized redirect URIs
8. Click "Save" in Supabase

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

### First Time Setup Flow

1. Open http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create an account with:
   - Email and password OR
   - Google sign-in
4. Fill in your profile:
   - Full Name
   - Course/Field of Study
   - Category (General, OBC, SC, ST, EWS)
   - Economic Background
5. You'll be redirected to the dashboard

---

## Testing

### Test User Authentication

1. **Email Sign Up**:
   - Go to `/signup`
   - Enter test details
   - Check email for confirmation (if enabled)
   - Login at `/login`

2. **Google Sign In**:
   - Click "Sign in with Google" on `/login`
   - Select Google account
   - Authorize the app
   - Should redirect to dashboard

### Test Core Features

1. **Dashboard**:
   - Verify readiness score displays
   - Check matched scholarships appear
   - Verify stats cards show correct numbers

2. **Apply to Scholarship**:
   - Click "Apply" on a scholarship card
   - Verify success message
   - Check `/applied` page shows the application

3. **Profile Update**:
   - Go to `/profile`
   - Update any field
   - Click "Save Changes"
   - Verify success message

4. **Search Scholarships**:
   - Go to `/scholarships`
   - Use search bar
   - Use country filter
   - Verify results update

### Verify Database

In Supabase Table Editor:

1. **users table**: Should have your profile
2. **applications table**: Should show applied scholarships
3. **notifications table**: Should have notifications

---

## Deployment

### Deploy to Vercel

1. Push code to GitHub

2. Go to https://vercel.com

3. Click "New Project"

4. Import your GitHub repository

5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

6. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

7. Click "Deploy"

8. Update Google OAuth:
   - Add your Vercel URL to authorized origins
   - Add `https://your-app.vercel.app/auth/callback` to redirect URIs

---

## Troubleshooting

### Common Issues

#### 1. "Supabase client has not been configured"

**Solution**:
- Check `.env.local` exists and has correct values
- Restart dev server: `npm run dev`
- Ensure no spaces around `=` in env file

#### 2. "Auth error: Invalid login credentials"

**Solution**:
- Verify email/password is correct
- Check Supabase Auth logs: **Authentication** > **Users** > **Logs**
- Ensure user exists in users table

#### 3. "Google OAuth redirect mismatch"

**Solution**:
- Verify redirect URI in Google Cloud Console matches exactly:
  - Development: `http://localhost:3000/auth/callback`
  - Production: `https://your-domain.com/auth/callback`
  - Supabase: `https://your-project.supabase.co/auth/v1/callback`

#### 4. "Row Level Security policy error"

**Solution**:
- Re-run the SQL schema from `supabase-schema.sql`
- Check policies are created: **Database** > **Policies**
- Verify RLS is enabled on tables

#### 5. "Can't connect to Supabase"

**Solution**:
- Check internet connection
- Verify Supabase project is not paused
- Check project URL is correct (no trailing slash)
- Test connection in Supabase dashboard

#### 6. No scholarships showing

**Solution**:
- Mock data is hardcoded in `src/data/scholarships.ts`
- Scholarships will always show unless filtered out
- Check browser console for errors

#### 7. Dark mode not working

**Solution**:
- Clear browser cache
- Check `next-themes` is installed: `npm list next-themes`
- Verify ThemeProvider wraps app in `layout.tsx`

### Debug Mode

Enable verbose logging:

```bash
# In your terminal before running dev
export NODE_ENV=development
npm run dev
```

Check browser console (F12) for:
- Network errors
- API response errors
- React warnings

### Getting Help

1. Check browser console (F12)
2. Check terminal output
3. Review Supabase logs: **Logs** section
4. Search existing issues
5. Create new issue with:
   - Error message
   - Steps to reproduce
   - Browser/Node version
   - Screenshots

---

## Production Checklist

Before deploying to production:

- [ ] Environment variables configured in hosting platform
- [ ] Google OAuth redirect URIs updated for production domain
- [ ] Email confirmations enabled in Supabase
- [ ] RLS policies verified and tested
- [ ] Database backups enabled in Supabase
- [ ] Error monitoring set up (e.g., Sentry)
- [ ] Replace mock scholarship data with real data
- [ ] Test all auth flows (email, Google)
- [ ] Test all CRUD operations
- [ ] Mobile responsiveness verified
- [ ] Performance optimization (images, bundle size)
- [ ] SEO meta tags updated
- [ ] Analytics configured (Google Analytics, etc.)
- [ ] Terms of Service and Privacy Policy added

---

## Next Steps

After setup:

1. **Customize scholarship data**: Edit `src/data/scholarships.ts` or import into Supabase
2. **Add real scholarship sources**: Integrate with scholarship APIs or web scraping
3. **Implement document uploads**: Use Supabase Storage for resume/transcript uploads
4. **Set up email notifications**: Use Supabase Edge Functions or third-party service
5. **Enhance matching algorithm**: Improve scholarship matching logic
6. **Add analytics**: Track user engagement and application success rates

---

**Need Help?** Open an issue on GitHub or check the main README.md

Happy coding! 🎉
