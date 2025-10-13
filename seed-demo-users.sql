-- Demo User Accounts for Testing Different Roles
-- Note: These accounts should be created in Supabase Auth first, then reference them here

-- Instructions:
-- 1. Create these users in your Supabase Dashboard > Authentication > Users
-- 2. Use the passwords as shown
-- 3. Then run this SQL to add their profile data

-- Demo Account Credentials:
-- 
-- 🧑‍🎓 STUDENT
-- Email: student@demo.com
-- Password: Student@123
--
-- 🏫 SCHOLARSHIP PROVIDER  
-- Email: provider@demo.com
-- Password: Provider@123
--
-- 👨‍💼 ADMIN
-- Email: admin@demo.com
-- Password: Admin@123

-- After creating users in Supabase Auth, insert their profile data:
-- Replace the UUIDs below with the actual auth.users IDs from Supabase

-- Example: Insert demo user profiles (UPDATE WITH ACTUAL USER IDs)
-- 
-- INSERT INTO users (id, name, email, role, course, category, economic_background, profile_completeness, documents_uploaded)
-- VALUES 
--   ('<student-uuid>', 'Demo Student', 'student@demo.com', 'student', 'Computer Science', 'General', 'Middle Income', 75, 3),
--   ('<provider-uuid>', 'Demo Provider', 'provider@demo.com', 'provider', NULL, NULL, NULL, 100, 0),
--   ('<admin-uuid>', 'System Admin', 'admin@demo.com', 'admin', NULL, NULL, NULL, 100, 0);

-- Sample scholarship from provider (UPDATE WITH ACTUAL PROVIDER ID)
-- INSERT INTO scholarships (provider_id, title, description, eligibility_criteria, benefits, required_documents, deadline, country, language, link, status)
-- VALUES 
--   ('<provider-uuid>', 
--    'Tech Excellence Scholarship', 
--    'Supporting outstanding students in technology fields', 
--    'Must be enrolled in Computer Science or related field with GPA above 3.5',
--    'Full tuition coverage + $5000 stipend',
--    'Transcripts, Recommendation Letters, Personal Statement',
--    '2025-12-31',
--    'USA',
--    'English',
--    'https://example.com/scholarship',
--    'approved');
