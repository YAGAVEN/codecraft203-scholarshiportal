-- ============================================
-- Setup Demo Users with Real User IDs
-- ============================================
-- This script adds role and profile data for existing users
-- ============================================

-- First, ensure the users table has the role column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'provider', 'admin'));

-- ============================================
-- STUDENT USER
-- User ID: 284c277f-e5fb-4fa1-9bdf-42acddcdd748
-- Email: pritcy026@rmkcet.ac.in
-- ============================================

-- Insert or update student profile
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
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  course = EXCLUDED.course,
  category = EXCLUDED.category,
  economic_background = EXCLUDED.economic_background,
  profile_completeness = EXCLUDED.profile_completeness,
  documents_uploaded = EXCLUDED.documents_uploaded;

-- ============================================
-- PROVIDER USER
-- User ID: 26a068c3-170f-4894-b13d-077f4cc7bc8a
-- Email: yagaad118@rmkcet.ac.in
-- ============================================

-- Insert or update provider profile
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
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  course = EXCLUDED.course,
  category = EXCLUDED.category,
  economic_background = EXCLUDED.economic_background,
  profile_completeness = EXCLUDED.profile_completeness,
  documents_uploaded = EXCLUDED.documents_uploaded;

-- ============================================
-- ADMIN USER
-- User ID: 1735a2b0-0e00-47c2-ade3-ba7f795f6847
-- Email: prittoprogrammer@gmail.com
-- ============================================

-- Insert or update admin profile
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
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  course = EXCLUDED.course,
  category = EXCLUDED.category,
  economic_background = EXCLUDED.economic_background,
  profile_completeness = EXCLUDED.profile_completeness,
  documents_uploaded = EXCLUDED.documents_uploaded;

-- ============================================
-- Verify the users were set up correctly
-- ============================================
SELECT 
  id,
  name,
  email,
  role,
  course,
  category,
  economic_background,
  profile_completeness,
  documents_uploaded,
  created_at
FROM public.users
WHERE id IN (
  '284c277f-e5fb-4fa1-9bdf-42acddcdd748',
  '26a068c3-170f-4894-b13d-077f4cc7bc8a',
  '1735a2b0-0e00-47c2-ade3-ba7f795f6847'
)
ORDER BY role;

-- ============================================
-- OPTIONAL: Create sample scholarship from provider
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
  '26a068c3-170f-4894-b13d-077f4cc7bc8a', -- Provider user ID
  'Tech Excellence Scholarship 2025',
  'Supporting outstanding students pursuing degrees in technology and computer science fields. This scholarship aims to reduce financial barriers and promote diversity in tech.',
  'Must be enrolled full-time in Computer Science, Software Engineering, or related field with minimum GPA of 3.5. Open to undergraduate and graduate students.',
  'Full tuition coverage for one academic year + ₹50,000 annual stipend for books and living expenses',
  'Official transcripts, Two letters of recommendation, Personal statement (500 words), Resume/CV, Proof of enrollment',
  '2025-12-31',
  'India',
  'English',
  'https://example.com/tech-excellence-scholarship',
  'approved' -- Set to approved so students can see it
)
ON CONFLICT DO NOTHING;

-- ============================================
-- OPTIONAL: Create sample application from student
-- ============================================
INSERT INTO public.applications (
  user_id,
  scholarship_id,
  status,
  documents_submitted
)
SELECT 
  '284c277f-e5fb-4fa1-9bdf-42acddcdd748', -- Student user ID
  id,
  'pending',
  'Transcripts, Recommendation Letters, Personal Statement'
FROM public.scholarships 
WHERE title = 'Tech Excellence Scholarship 2025'
AND provider_id = '26a068c3-170f-4894-b13d-077f4cc7bc8a'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- OPTIONAL: Create sample notifications
-- ============================================
INSERT INTO public.notifications (user_id, message, is_read)
VALUES 
  ('284c277f-e5fb-4fa1-9bdf-42acddcdd748', 'Welcome to Scholarship Track! Complete your profile to get personalized scholarship recommendations.', false),
  ('284c277f-e5fb-4fa1-9bdf-42acddcdd748', 'New scholarship matching your profile: Tech Excellence Scholarship 2025', false),
  ('26a068c3-170f-4894-b13d-077f4cc7bc8a', 'Your scholarship "Tech Excellence Scholarship 2025" has been approved by admin.', false),
  ('1735a2b0-0e00-47c2-ade3-ba7f795f6847', 'System is running smoothly. No pending approvals at this time.', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Summary
-- ============================================
SELECT 
  '✅ Demo users setup complete!' as status,
  (SELECT COUNT(*) FROM public.users WHERE id IN (
    '284c277f-e5fb-4fa1-9bdf-42acddcdd748',
    '26a068c3-170f-4894-b13d-077f4cc7bc8a',
    '1735a2b0-0e00-47c2-ade3-ba7f795f6847'
  )) as users_configured,
  (SELECT COUNT(*) FROM public.scholarships WHERE provider_id = '26a068c3-170f-4894-b13d-077f4cc7bc8a') as sample_scholarships,
  (SELECT COUNT(*) FROM public.applications WHERE user_id = '284c277f-e5fb-4fa1-9bdf-42acddcdd748') as sample_applications,
  (SELECT COUNT(*) FROM public.notifications WHERE user_id IN (
    '284c277f-e5fb-4fa1-9bdf-42acddcdd748',
    '26a068c3-170f-4894-b13d-077f4cc7bc8a',
    '1735a2b0-0e00-47c2-ade3-ba7f795f6847'
  )) as sample_notifications;
