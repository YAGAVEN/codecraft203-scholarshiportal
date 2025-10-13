-- ============================================
-- COMPLETE DEMO SETUP SCRIPT
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This will set up all demo users with proper roles and passwords
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- STEP 1: Update passwords for all demo users
-- ============================================

UPDATE auth.users
SET 
  encrypted_password = crypt('Student@123', gen_salt('bf')),
  updated_at = NOW()
WHERE id = '284c277f-e5fb-4fa1-9bdf-42acddcdd748';

UPDATE auth.users
SET 
  encrypted_password = crypt('Provider@123', gen_salt('bf')),
  updated_at = NOW()
WHERE id = '26a068c3-170f-4894-b13d-077f4cc7bc8a';

UPDATE auth.users
SET 
  encrypted_password = crypt('Admin@123', gen_salt('bf')),
  updated_at = NOW()
WHERE id = '1735a2b0-0e00-47c2-ade3-ba7f795f6847';

-- ============================================
-- STEP 2: Ensure users table has required columns
-- ============================================

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'provider', 'admin'));

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS profile_completeness INTEGER DEFAULT 0;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS documents_uploaded INTEGER DEFAULT 0;

-- ============================================
-- STEP 3: Insert/Update user profiles
-- ============================================

-- Student Profile
INSERT INTO public.users (
  id,
  name,
  email,
  role,
  course,
  category,
  economic_background,
  profile_completeness,
  documents_uploaded
) VALUES (
  '284c277f-e5fb-4fa1-9bdf-42acddcdd748',
  'Pritcy Student',
  'pritcy026@rmkcet.ac.in',
  'student',
  'Computer Science',
  'General',
  'Middle Income',
  75,
  3
)
ON CONFLICT (id) 
DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  course = EXCLUDED.course,
  category = EXCLUDED.category,
  economic_background = EXCLUDED.economic_background,
  profile_completeness = EXCLUDED.profile_completeness,
  documents_uploaded = EXCLUDED.documents_uploaded;

-- Provider Profile
INSERT INTO public.users (
  id,
  name,
  email,
  role,
  course,
  category,
  economic_background,
  profile_completeness,
  documents_uploaded
) VALUES (
  '26a068c3-170f-4894-b13d-077f4cc7bc8a',
  'Yagaad Provider',
  'yagaad118@rmkcet.ac.in',
  'provider',
  'N/A',
  'General',
  'N/A',
  100,
  0
)
ON CONFLICT (id) 
DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  course = EXCLUDED.course,
  category = EXCLUDED.category,
  economic_background = EXCLUDED.economic_background,
  profile_completeness = EXCLUDED.profile_completeness,
  documents_uploaded = EXCLUDED.documents_uploaded;

-- Admin Profile
INSERT INTO public.users (
  id,
  name,
  email,
  role,
  course,
  category,
  economic_background,
  profile_completeness,
  documents_uploaded
) VALUES (
  '1735a2b0-0e00-47c2-ade3-ba7f795f6847',
  'Pritto Admin',
  'prittoprogrammer@gmail.com',
  'admin',
  'N/A',
  'General',
  'N/A',
  100,
  0
)
ON CONFLICT (id) 
DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  course = EXCLUDED.course,
  category = EXCLUDED.category,
  economic_background = EXCLUDED.economic_background,
  profile_completeness = EXCLUDED.profile_completeness,
  documents_uploaded = EXCLUDED.documents_uploaded;

-- ============================================
-- STEP 4: Create sample scholarship from provider
-- ============================================

INSERT INTO public.scholarships (
  provider_id,
  title,
  description,
  eligibility_criteria,
  benefits,
  required_documents,
  deadline,
  country,
  language,
  link,
  status
) VALUES (
  '26a068c3-170f-4894-b13d-077f4cc7bc8a',
  'Tech Excellence Scholarship 2025',
  'Supporting outstanding students pursuing degrees in technology and computer science fields. This scholarship aims to reduce financial barriers and promote diversity in tech.',
  'Must be enrolled full-time in Computer Science, Software Engineering, or related field with minimum GPA of 3.5. Open to undergraduate and graduate students.',
  'Full tuition coverage for one academic year + ₹50,000 annual stipend for books and living expenses',
  'Official transcripts, Two letters of recommendation, Personal statement (500 words), Resume/CV, Proof of enrollment',
  '2025-12-31',
  'India',
  'English',
  'https://example.com/tech-excellence-scholarship',
  'approved'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 5: Create sample application
-- ============================================

INSERT INTO public.applications (
  user_id,
  scholarship_id,
  status,
  documents_submitted
)
SELECT 
  '284c277f-e5fb-4fa1-9bdf-42acddcdd748',
  id,
  'pending',
  'Transcripts, Recommendation Letters, Personal Statement'
FROM public.scholarships 
WHERE title = 'Tech Excellence Scholarship 2025'
AND provider_id = '26a068c3-170f-4894-b13d-077f4cc7bc8a'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 6: Create sample notifications
-- ============================================

INSERT INTO public.notifications (user_id, message, is_read)
VALUES 
  ('284c277f-e5fb-4fa1-9bdf-42acddcdd748', 'Welcome to Scholarship Track! Complete your profile to get personalized scholarship recommendations.', false),
  ('284c277f-e5fb-4fa1-9bdf-42acddcdd748', 'New scholarship matching your profile: Tech Excellence Scholarship 2025', false),
  ('26a068c3-170f-4894-b13d-077f4cc7bc8a', 'Your scholarship "Tech Excellence Scholarship 2025" has been approved by admin.', false),
  ('1735a2b0-0e00-47c2-ade3-ba7f795f6847', 'System is running smoothly. No pending approvals at this time.', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION & SUMMARY
-- ============================================

-- Check auth users
SELECT 
  '🔐 AUTH USERS' as section,
  id,
  email,
  email_confirmed_at,
  updated_at
FROM auth.users
WHERE id IN (
  '284c277f-e5fb-4fa1-9bdf-42acddcdd748',
  '26a068c3-170f-4894-b13d-077f4cc7bc8a',
  '1735a2b0-0e00-47c2-ade3-ba7f795f6847'
)
ORDER BY email;

-- Check user profiles
SELECT 
  '👥 USER PROFILES' as section,
  id,
  name,
  email,
  role,
  course,
  profile_completeness
FROM public.users
WHERE id IN (
  '284c277f-e5fb-4fa1-9bdf-42acddcdd748',
  '26a068c3-170f-4894-b13d-077f4cc7bc8a',
  '1735a2b0-0e00-47c2-ade3-ba7f795f6847'
)
ORDER BY role;

-- Summary
SELECT 
  '✅ SETUP COMPLETE!' as status,
  '' as separator,
  '🧑‍🎓 STUDENT LOGIN:' as student_header,
  'pritcy026@rmkcet.ac.in / Student@123' as student_credentials,
  '' as separator2,
  '🏫 PROVIDER LOGIN:' as provider_header,
  'yagaad118@rmkcet.ac.in / Provider@123' as provider_credentials,
  '' as separator3,
  '👨‍💼 ADMIN LOGIN:' as admin_header,
  'prittoprogrammer@gmail.com / Admin@123' as admin_credentials;
