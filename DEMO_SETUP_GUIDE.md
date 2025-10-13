# 🚀 Demo Users Setup Instructions

## Quick Fix for "Invalid login credentials" Error

### Option 1: Run the Complete Setup Script (RECOMMENDED)

1. **Open Supabase SQL Editor**
   - Go to your Supabase Dashboard
   - Click on "SQL Editor" in the left sidebar

2. **Run the complete setup script**
   ```bash
   # Copy the contents of complete-demo-setup.sql
   cat complete-demo-setup.sql
   ```
   - Paste the entire contents into the SQL Editor
   - Click "Run" button

3. **Verify the setup**
   - Check the output at the bottom
   - You should see all three users with updated passwords

### Option 2: Update Passwords Only (Quick Fix)

If you just need to fix the password issue:

1. **Open Supabase SQL Editor**

2. **Run this quick script**:
   ```sql
   -- Enable pgcrypto
   CREATE EXTENSION IF NOT EXISTS pgcrypto;

   -- Update Student password
   UPDATE auth.users
   SET encrypted_password = crypt('Student@123', gen_salt('bf'))
   WHERE id = '284c277f-e5fb-4fa1-9bdf-42acddcdd748';

   -- Update Provider password
   UPDATE auth.users
   SET encrypted_password = crypt('Provider@123', gen_salt('bf'))
   WHERE id = '26a068c3-170f-4894-b13d-077f4cc7bc8a';

   -- Update Admin password
   UPDATE auth.users
   SET encrypted_password = crypt('Admin@123', gen_salt('bf'))
   WHERE id = '1735a2b0-0e00-47c2-ade3-ba7f795f6847';
   ```

3. **Test the login**

## 🔑 Demo Login Credentials

After running the setup script, you can login with:

### 🧑‍🎓 Student Account
- **Email:** `pritcy026@rmkcet.ac.in`
- **Password:** `Student@123`
- **Role:** Student (can browse and apply for scholarships)

### 🏫 Provider Account
- **Email:** `yagaad118@rmkcet.ac.in`
- **Password:** `Provider@123`
- **Role:** Provider (can create and manage scholarships)

### 👨‍💼 Admin Account
- **Email:** `prittoprogrammer@gmail.com`
- **Password:** `Admin@123`
- **Role:** Admin (full system access and moderation)

## ✨ Features After Setup

Once setup is complete, you'll have:

✅ **3 demo users** with proper roles
✅ **1 sample scholarship** from the provider
✅ **1 sample application** from the student
✅ **4 sample notifications** across all users
✅ **Working quick-fill buttons** on login/signup pages

## 🧪 Testing the Setup

1. **Go to the login page** (`/login`)
2. **Click on any demo account button** (Student, Provider, or Admin)
3. **Or click "📝 Fill Form Only"** to see the credentials filled in
4. **Click "Sign in"**
5. **You should be redirected** to the appropriate role-based dashboard

## 🐛 Troubleshooting

### Still getting "Invalid login credentials"?

1. **Check if pgcrypto extension is enabled:**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pgcrypto';
   ```

2. **Verify user exists in auth.users:**
   ```sql
   SELECT id, email, email_confirmed_at 
   FROM auth.users 
   WHERE email IN (
     'pritcy026@rmkcet.ac.in',
     'yagaad118@rmkcet.ac.in',
     'prittoprogrammer@gmail.com'
   );
   ```

3. **Check if users table has the role column:**
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'users' AND column_name = 'role';
   ```

4. **Ensure email is confirmed:**
   ```sql
   UPDATE auth.users 
   SET email_confirmed_at = NOW() 
   WHERE email IN (
     'pritcy026@rmkcet.ac.in',
     'yagaad118@rmkcet.ac.in',
     'prittoprogrammer@gmail.com'
   ) AND email_confirmed_at IS NULL;
   ```

### Password not working?

Try resetting the password manually in Supabase Dashboard:
1. Go to Authentication > Users
2. Find the user
3. Click the three dots (•••)
4. Select "Reset Password"
5. Or run the password update SQL again

## 📝 Files Created

- `complete-demo-setup.sql` - Complete setup (passwords + profiles + sample data)
- `update-demo-passwords.sql` - Just password updates
- `setup-demo-users.sql` - Profile and sample data setup

## 🎯 What Each File Does

| File | Purpose |
|------|---------|
| `complete-demo-setup.sql` | **USE THIS** - Everything in one script |
| `update-demo-passwords.sql` | Quick password reset only |
| `setup-demo-users.sql` | Profile setup without password changes |

## ✅ Success Checklist

- [ ] Ran SQL script in Supabase
- [ ] Saw success messages in SQL output
- [ ] Verified users exist with correct roles
- [ ] Tested login with student account
- [ ] Tested login with provider account
- [ ] Tested login with admin account
- [ ] Each role shows different dashboard

---

**Need help?** Check the SQL output for error messages and verify all steps were completed.
