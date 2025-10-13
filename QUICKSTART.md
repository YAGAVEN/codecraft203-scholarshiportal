# ⚡ Quick Start Guide - Get Running in 5 Minutes

## Prerequisites
- Node.js 18+ installed
- Supabase account created

## Step 1: Install Dependencies (1 min)
```bash
npm install
```

## Step 2: Configure Supabase (2 mins)

### Create Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Wait for setup to complete

### Get Credentials
1. Go to **Settings** > **API**
2. Copy your **Project URL** and **anon public** key

### Add to Environment
Create `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Set Up Database (1 min)
1. In Supabase, go to **SQL Editor**
2. Copy everything from `supabase-schema.sql`
3. Paste and click "Run"

## Step 4: Run the App (1 min)
```bash
npm run dev
```

Open http://localhost:3000

## Test It Out!

### 1. Create Account
- Click "Get Started"
- Fill in signup form
- Submit

### 2. Explore Dashboard
- View matched scholarships
- Check readiness score
- See notifications

### 3. Apply to Scholarship
- Click "Apply" on any scholarship
- Check "Applied" page

### 4. Browse All
- Go to "Scholarships"
- Try search
- Use filters

### 5. Update Profile
- Go to "Profile"
- Update information
- Save changes

## That's It! 🎉

You now have a fully functional scholarship tracking portal.

## Optional: Enable Google OAuth

See `SETUP.md` for detailed Google OAuth configuration (adds ~15 mins).

## Need Help?

- Check browser console (F12) for errors
- Review `SETUP.md` for detailed troubleshooting
- Verify `.env.local` has correct values
- Ensure Supabase project is not paused

## What's Working

✅ Email authentication  
✅ User registration  
✅ Dashboard with stats  
✅ Browse scholarships  
✅ Apply to scholarships  
✅ Track applications  
✅ Update profile  
✅ Dark/light mode  
✅ Mobile responsive  

## Next Steps

1. Add real scholarship data to `src/data/scholarships.ts`
2. Configure Google OAuth (optional)
3. Deploy to Vercel
4. Customize theme colors in `globals.css`

Happy coding! 🚀
