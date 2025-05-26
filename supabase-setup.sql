-- Supabase SQL Setup for Hospital Management System
-- Run this in the Supabase SQL Editor to set up your database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table that extends auth.users
-- This table will store additional user information while auth.users handles authentication
CREATE TABLE IF NOT EXISTS profiles (
  -- Link to auth.users table with CASCADE to ensure data consistency
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  -- Email is stored in auth.users, but we keep a reference here for convenience
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'patient', 'receptionist')),
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  profile_image_url TEXT,
  specialization TEXT, -- For doctors
  license_number TEXT, -- For doctors
  blood_group TEXT, -- For patients
  allergies TEXT[], -- For patients
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Policy for users to view their own profile
DROP POLICY IF EXISTS profiles_select_policy ON public.profiles;
CREATE POLICY profiles_select_policy ON public.profiles 
    FOR SELECT USING (auth.uid() = id);

-- Policy for users to update their own profile
DROP POLICY IF EXISTS profiles_update_policy ON public.profiles;
CREATE POLICY profiles_update_policy ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

-- Policy for inserting profiles (during registration)
DROP POLICY IF EXISTS profiles_insert_policy ON public.profiles;
CREATE POLICY profiles_insert_policy ON public.profiles 
    FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'anon');

-- Policy for service role to manage all profiles
DROP POLICY IF EXISTS profiles_service_policy ON public.profiles;
CREATE POLICY profiles_service_policy ON public.profiles 
    USING (auth.role() = 'service_role');

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.raw_user_meta_data->>'role'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile when a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctor_departments junction table
CREATE TABLE IF NOT EXISTS doctor_departments (
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, department_id)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30, -- Duration in minutes
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')) DEFAULT 'scheduled',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  diagnosis TEXT,
  symptoms TEXT[],
  treatment TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  medical_record_id UUID REFERENCES medical_records(id) ON DELETE SET NULL,
  medications JSONB NOT NULL, -- Array of medication objects with name, dosage, frequency, etc.
  instructions TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  log_type TEXT NOT NULL,
  description TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at
BEFORE UPDATE ON departments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at
BEFORE UPDATE ON medical_records
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
BEFORE UPDATE ON prescriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user creation
-- This function automatically creates a profile entry when a new user registers
-- It extracts user metadata from the auth.users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table using data from auth.users
  INSERT INTO public.profiles (id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  
  -- Log the new user creation
  INSERT INTO public.system_logs (user_id, log_type, description)
  VALUES (
    NEW.id,
    'user_created',
    'New user registered with email ' || NEW.email
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Conditionally create trigger for new user creation
-- First, check if the trigger already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    -- Create the trigger if it doesn't exist
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;
  
-- Create a function to track email verification status
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- If email is confirmed, log it
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    INSERT INTO public.system_logs (user_id, log_type, description)
    VALUES (
      NEW.id,
      'email_verified',
      'User verified email: ' || NEW.email
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Conditionally create trigger for email confirmation
-- First, check if the trigger already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_email_confirmed'
  ) THEN
    -- Create the trigger if it doesn't exist
    CREATE TRIGGER on_email_confirmed
      AFTER UPDATE ON auth.users
      FOR EACH ROW
      WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
      EXECUTE FUNCTION public.handle_email_confirmation();
  END IF;
END
$$;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Admin can view and edit all profiles
CREATE POLICY admin_all_profiles ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Users can view and edit their own profile
CREATE POLICY user_own_profile ON profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid());

-- Doctors can view patient profiles
CREATE POLICY doctor_view_patients ON profiles
  FOR SELECT
  TO authenticated
  USING (
    (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
      )
    ) AND profiles.role = 'patient'
  );

-- Receptionists can view patient and doctor profiles
CREATE POLICY receptionist_view_users ON profiles
  FOR SELECT
  TO authenticated
  USING (
    (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'receptionist'
      )
    ) AND (profiles.role = 'patient' OR profiles.role = 'doctor')
  );

-- Departments RLS Policies
-- Admin can manage departments
CREATE POLICY admin_all_departments ON departments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Everyone can view departments
CREATE POLICY view_departments ON departments
  FOR SELECT
  TO authenticated
  USING (true);

-- Doctor Departments RLS Policies
-- Admin can manage doctor departments
CREATE POLICY admin_all_doctor_departments ON doctor_departments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Doctors can view their own department associations
CREATE POLICY doctor_own_departments ON doctor_departments
  FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

-- Appointments RLS Policies
-- Admin and receptionist can manage all appointments
CREATE POLICY admin_receptionist_all_appointments ON appointments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'receptionist')
    )
  );

-- Doctors can view and update their own appointments
CREATE POLICY doctor_own_appointments ON appointments
  FOR ALL
  TO authenticated
  USING (
    doctor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

-- Patients can view and update their own appointments
CREATE POLICY patient_own_appointments ON appointments
  FOR ALL
  TO authenticated
  USING (
    patient_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'patient'
    )
  );

-- Medical Records RLS Policies
-- Admin can view all medical records
CREATE POLICY admin_all_medical_records ON medical_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Doctors can manage medical records they created
CREATE POLICY doctor_own_medical_records ON medical_records
  FOR ALL
  TO authenticated
  USING (
    doctor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

-- Patients can view their own medical records
CREATE POLICY patient_own_medical_records ON medical_records
  FOR SELECT
  TO authenticated
  USING (
    patient_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'patient'
    )
  );

-- Prescriptions RLS Policies
-- Admin can view all prescriptions
CREATE POLICY admin_all_prescriptions ON prescriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Doctors can manage prescriptions they created
CREATE POLICY doctor_own_prescriptions ON prescriptions
  FOR ALL
  TO authenticated
  USING (
    doctor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

-- Patients can view their own prescriptions
CREATE POLICY patient_own_prescriptions ON prescriptions
  FOR SELECT
  TO authenticated
  USING (
    patient_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'patient'
    )
  );

-- System Logs RLS Policies
-- Only admins can view system logs
CREATE POLICY admin_all_logs ON system_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Insert some initial data

-- Create default admin user (you'll need to create this user in Auth first)
-- INSERT INTO profiles (id, first_name, last_name, email, role)
-- VALUES ('ADMIN_USER_ID', 'Admin', 'User', 'admin@example.com', 'admin');

-- Create departments
INSERT INTO departments (name, description)
VALUES 
  ('Cardiology', 'Diagnosis and treatment of heart disorders'),
  ('Neurology', 'Diagnosis and treatment of disorders of the nervous system'),
  ('Orthopedics', 'Diagnosis and treatment of disorders of the musculoskeletal system'),
  ('Pediatrics', 'Medical care of infants, children, and adolescents'),
  ('Dermatology', 'Diagnosis and treatment of skin disorders'),
  ('Ophthalmology', 'Diagnosis and treatment of eye disorders'),
  ('Gynecology', 'Medical practice dealing with the health of the female reproductive system'),
  ('Urology', 'Diagnosis and treatment of disorders of the urinary tract and male reproductive system'),
  ('Psychiatry', 'Diagnosis and treatment of mental disorders'),
  ('Radiology', 'Medical imaging to diagnose and treat diseases');
