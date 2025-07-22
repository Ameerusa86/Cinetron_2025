-- Simple test to verify Supabase connection and tables
-- Run this in Supabase SQL Editor to check if everything is set up correctly

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'accounts', 'sessions', 'verification_tokens');

-- Check users table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check accounts table structure  
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'accounts' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test inserting a user (this will help us see if RLS policies are working)
-- INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com');
-- SELECT * FROM users WHERE email = 'test@example.com';
-- DELETE FROM users WHERE email = 'test@example.com';
