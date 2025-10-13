-- ============================================
-- Update Passwords for Demo Users
-- ============================================
-- This script updates the passwords for existing users
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- Update STUDENT password
-- Email: pritcy026@rmkcet.ac.in
-- New Password: Student@123
-- ============================================
UPDATE auth.users
SET 
  encrypted_password = crypt('Student@123', gen_salt('bf')),
  updated_at = NOW()
WHERE id = '284c277f-e5fb-4fa1-9bdf-42acddcdd748';

-- ============================================
-- Update PROVIDER password
-- Email: yagaad118@rmkcet.ac.in
-- New Password: Provider@123
-- ============================================
UPDATE auth.users
SET 
  encrypted_password = crypt('Provider@123', gen_salt('bf')),
  updated_at = NOW()
WHERE id = '26a068c3-170f-4894-b13d-077f4cc7bc8a';

-- ============================================
-- Update ADMIN password
-- Email: prittoprogrammer@gmail.com
-- New Password: Admin@123
-- ============================================
UPDATE auth.users
SET 
  encrypted_password = crypt('Admin@123', gen_salt('bf')),
  updated_at = NOW()
WHERE id = '1735a2b0-0e00-47c2-ade3-ba7f795f6847';

-- ============================================
-- Verify passwords were updated
-- ============================================
SELECT 
  id,
  email,
  updated_at,
  'Password updated successfully' as status
FROM auth.users
WHERE id IN (
  '284c277f-e5fb-4fa1-9bdf-42acddcdd748',
  '26a068c3-170f-4894-b13d-077f4cc7bc8a',
  '1735a2b0-0e00-47c2-ade3-ba7f795f6847'
)
ORDER BY email;

-- ============================================
-- Summary
-- ============================================
SELECT 
  '✅ Passwords updated for demo users!' as message,
  'Student: pritcy026@rmkcet.ac.in / Student@123' as student,
  'Provider: yagaad118@rmkcet.ac.in / Provider@123' as provider,
  'Admin: prittoprogrammer@gmail.com / Admin@123' as admin;
