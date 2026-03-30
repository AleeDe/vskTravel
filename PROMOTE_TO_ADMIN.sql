-- Promote shiftdeploy@gmail.com to admin
-- Run this in Supabase SQL Editor (Service Role mode)

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'shiftdeploy@gmail.com';

-- Verify
SELECT email, role FROM public.profiles WHERE email = 'shiftdeploy@gmail.com';

-- Should show: admin
