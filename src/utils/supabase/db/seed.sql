-- 1. Table for Admins (dedicated admin accounts)
CREATE TABLE admins (
  user_id uuid PRIMARY KEY,
  -- additional admin-specific columns if needed
  CONSTRAINT fk_admin_user FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- 2. Classes table
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL,
  class_code char(10) NOT NULL UNIQUE,  -- 10-character unique key (not the same as id)
  created_at timestamptz DEFAULT now(),
  -- additional class-specific fields can be added here (e.g., name, description)
  CONSTRAINT fk_class_created_by FOREIGN KEY (created_by)
    REFERENCES admins(user_id)
    ON DELETE RESTRICT
);

-- 3. Join table for assigning teachers to classes
CREATE TABLE class_teachers (
  class_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  PRIMARY KEY (class_id, teacher_id),
  CONSTRAINT fk_class_teacher_class FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_class_teacher_teacher FOREIGN KEY (teacher_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- 4. Join table for enrolling students in classes
CREATE TABLE class_students (
  class_id uuid NOT NULL,
  student_id uuid NOT NULL,
  PRIMARY KEY (class_id, student_id),
  CONSTRAINT fk_class_student_class FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_class_student_student FOREIGN KEY (student_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- 5. Trigger function to prevent admin accounts from being assigned as teachers
CREATE OR REPLACE FUNCTION prevent_admin_as_teacher()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM admins WHERE user_id = NEW.teacher_id
  ) THEN
    RAISE EXCEPTION 'Admin user % cannot be assigned as a teacher.', NEW.teacher_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on class_teachers to enforce the rule
CREATE TRIGGER check_admin_teacher
BEFORE INSERT ON class_teachers
FOR EACH ROW
EXECUTE FUNCTION prevent_admin_as_teacher();

-- 6. Trigger function to prevent admin accounts from being assigned as students
CREATE OR REPLACE FUNCTION prevent_admin_as_student()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM admins WHERE user_id = NEW.student_id
  ) THEN
    RAISE EXCEPTION 'Admin user % cannot be assigned as a student.', NEW.student_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on class_students to enforce the rule
CREATE TRIGGER check_admin_student
BEFORE INSERT ON class_students
FOR EACH ROW
EXECUTE FUNCTION prevent_admin_as_student();
