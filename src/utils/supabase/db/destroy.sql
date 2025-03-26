-- Drop join tables first (which depend on other tables)
DROP TABLE IF EXISTS class_students CASCADE;
DROP TABLE IF EXISTS class_teachers CASCADE;

-- Drop the main tables
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Drop the trigger functions (they may have been used by the dropped tables)
DROP FUNCTION IF EXISTS prevent_admin_as_teacher() CASCADE;
DROP FUNCTION IF EXISTS prevent_admin_as_student() CASCADE;
