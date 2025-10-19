-- ========================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- ========================================
-- This script fixes the "infinite recursion detected in policy for relation 'users'" error
-- by using direct subqueries instead of EXISTS clauses that cause circular dependencies.
--
-- HOW TO USE:
-- 1. Copy this entire file
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and click "Run"
-- 4. Verify "Success. No rows returned" message
--
-- Last Updated: 2025-10-14
-- ========================================

-- ========================================
-- CLEAN UP: Drop ALL existing policies
-- ========================================

-- Drop Users table policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;

-- Drop Scholarships table policies
DROP POLICY IF EXISTS "Anyone can view approved scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Providers can view their own scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Providers can insert their own scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Providers can update their own scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Providers can delete their own scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Admins can view all scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Admins can insert scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Admins can update all scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Admins can delete all scholarships" ON public.scholarships;

-- Drop Applications table policies
DROP POLICY IF EXISTS "Students can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Students can insert their own applications" ON public.applications;
DROP POLICY IF EXISTS "Students can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Providers can view applications for their scholarships" ON public.applications;
DROP POLICY IF EXISTS "Providers can update applications for their scholarships" ON public.applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can insert applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can delete all applications" ON public.applications;

-- Drop Notifications table policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Providers can create notifications for applicants" ON public.notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can update all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can delete all notifications" ON public.notifications;

-- ========================================
-- USERS TABLE POLICIES (Fixed for recursion)
-- ========================================

-- CRITICAL FIX: Allow all authenticated users to read users table
-- This prevents recursion when checking admin role
CREATE POLICY "Authenticated users can view all users" ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own data
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can insert users (using direct subquery to avoid recursion)
CREATE POLICY "Admins can insert users" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can update all users (using direct subquery to avoid recursion)
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can delete users (using direct subquery to avoid recursion)
CREATE POLICY "Admins can delete users" ON public.users
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ========================================
-- SCHOLARSHIPS TABLE POLICIES
-- ========================================

-- Anyone can view approved scholarships
CREATE POLICY "Anyone can view approved scholarships" ON public.scholarships
  FOR SELECT
  USING (status = 'approved');

-- Providers can view their own scholarships (all statuses)
CREATE POLICY "Providers can view their own scholarships" ON public.scholarships
  FOR SELECT
  TO authenticated
  USING (
    provider_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider'
  );

-- Providers can insert their own scholarships
CREATE POLICY "Providers can insert their own scholarships" ON public.scholarships
  FOR INSERT
  TO authenticated
  WITH CHECK (
    provider_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider'
  );

-- Providers can update their own scholarships
CREATE POLICY "Providers can update their own scholarships" ON public.scholarships
  FOR UPDATE
  TO authenticated
  USING (
    provider_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider'
  )
  WITH CHECK (
    provider_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider'
  );

-- Providers can delete their own scholarships
CREATE POLICY "Providers can delete their own scholarships" ON public.scholarships
  FOR DELETE
  TO authenticated
  USING (
    provider_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider'
  );

-- Admins can view all scholarships
CREATE POLICY "Admins can view all scholarships" ON public.scholarships
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can insert scholarships
CREATE POLICY "Admins can insert scholarships" ON public.scholarships
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can update all scholarships
CREATE POLICY "Admins can update all scholarships" ON public.scholarships
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can delete all scholarships
CREATE POLICY "Admins can delete all scholarships" ON public.scholarships
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ========================================
-- APPLICATIONS TABLE POLICIES
-- ========================================

-- Students can view their own applications
CREATE POLICY "Students can view their own applications" ON public.applications
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'student'
  );

-- Students can insert their own applications
CREATE POLICY "Students can insert their own applications" ON public.applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'student'
  );

-- Students can update their own applications (before submission)
CREATE POLICY "Students can update their own applications" ON public.applications
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'student'
  )
  WITH CHECK (
    user_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'student'
  );

-- Providers can view applications for their scholarships
CREATE POLICY "Providers can view applications for their scholarships" ON public.applications
  FOR SELECT
  TO authenticated
  USING (
    scholarship_id IN (
      SELECT id FROM public.scholarships WHERE provider_id = auth.uid()
    ) AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider'
  );

-- Providers can update applications for their scholarships (status changes)
CREATE POLICY "Providers can update applications for their scholarships" ON public.applications
  FOR UPDATE
  TO authenticated
  USING (
    scholarship_id IN (
      SELECT id FROM public.scholarships WHERE provider_id = auth.uid()
    ) AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider'
  )
  WITH CHECK (
    scholarship_id IN (
      SELECT id FROM public.scholarships WHERE provider_id = auth.uid()
    ) AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider'
  );

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" ON public.applications
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can insert applications (for any user)
CREATE POLICY "Admins can insert applications" ON public.applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can update all applications
CREATE POLICY "Admins can update all applications" ON public.applications
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can delete all applications
CREATE POLICY "Admins can delete all applications" ON public.applications
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ========================================
-- NOTIFICATIONS TABLE POLICIES
-- ========================================

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Providers can create notifications for applicants
CREATE POLICY "Providers can create notifications for applicants" ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider'
  );

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications" ON public.notifications
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can insert notifications (for any user)
CREATE POLICY "Admins can insert notifications" ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can update all notifications
CREATE POLICY "Admins can update all notifications" ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can delete all notifications
CREATE POLICY "Admins can delete all notifications" ON public.notifications
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ========================================
-- VERIFICATION
-- ========================================
-- If you see "Success. No rows returned", the policies have been updated successfully!
-- Now test your application - the infinite recursion error should be gone.
