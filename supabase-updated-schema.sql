-- Supabase SQL Setup for Hospital Management System with Separate Role Tables
-- Run this in the Supabase SQL Editor to set up your database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a base profiles table that extends auth.users
-- This table will store common user information while auth.users handles authentication
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
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create separate table for patients with patient-specific fields
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_group TEXT,
  allergies TEXT[],
  emergency_contact TEXT,
  medical_conditions TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create separate table for doctors with doctor-specific fields
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL,
  qualification TEXT,
  experience_years INTEGER,
  consultation_fee DECIMAL(10, 2),
  available_days TEXT[],
  available_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create separate table for receptionists with receptionist-specific fields
CREATE TABLE IF NOT EXISTS receptionists (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL,
  department TEXT,
  shift TEXT CHECK (shift IN ('morning', 'evening', 'night')),
  joining_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create separate table for admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL DEFAULT 'standard',
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')) DEFAULT 'scheduled',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  visit_date DATE NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  medical_record_id UUID REFERENCES medical_records(id) ON DELETE SET NULL,
  prescription_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescription items table
CREATE TABLE IF NOT EXISTS prescription_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create billing table
CREATE TABLE IF NOT EXISTS billing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  invoice_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receptionists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Profiles can be created during signup" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id OR auth.role() = 'anon');

-- Create policies for patients table
CREATE POLICY "Patients can view their own data" 
ON patients FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Patients can update their own data" 
ON patients FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Doctors can view patient data" 
ON patients FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM doctors WHERE doctors.id = auth.uid()
));

CREATE POLICY "Receptionists can view patient data" 
ON patients FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM receptionists WHERE receptionists.id = auth.uid()
));

CREATE POLICY "Admins can view all patient data" 
ON patients FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
));

-- Create policies for doctors table
CREATE POLICY "Doctors can view their own data" 
ON doctors FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Doctors can update their own data" 
ON doctors FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Patients can view doctor data" 
ON doctors FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM patients WHERE patients.id = auth.uid()
));

CREATE POLICY "Receptionists can view doctor data" 
ON doctors FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM receptionists WHERE receptionists.id = auth.uid()
));

CREATE POLICY "Admins can manage all doctor data" 
ON doctors FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
));

-- Create policies for receptionists table
CREATE POLICY "Receptionists can view their own data" 
ON receptionists FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Receptionists can update their own data" 
ON receptionists FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all receptionist data" 
ON receptionists FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
));

-- Create policies for admins table
CREATE POLICY "Admins can view their own data" 
ON admins FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can update their own data" 
ON admins FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Super admins can manage all admin data" 
ON admins FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.access_level = 'super'
));

-- Create policies for appointments table
CREATE POLICY "Patients can view their own appointments" 
ON appointments FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their appointments" 
ON appointments FOR SELECT 
USING (doctor_id = auth.uid());

CREATE POLICY "Receptionists can manage all appointments" 
ON appointments FOR ALL 
USING (EXISTS (
  SELECT 1 FROM receptionists WHERE receptionists.id = auth.uid()
));

CREATE POLICY "Admins can manage all appointments" 
ON appointments FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
));

-- Create functions for handling user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get the role from the user metadata
  user_role := NEW.raw_user_meta_data->>'role';
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, first_name, last_name, email, role, phone, address)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    user_role,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address'
  );
  
  -- Based on role, insert into the appropriate role-specific table
  IF user_role = 'patient' THEN
    INSERT INTO public.patients (
      id, 
      date_of_birth, 
      gender, 
      blood_group, 
      allergies, 
      emergency_contact, 
      medical_conditions
    )
    VALUES (
      NEW.id,
      (NEW.raw_user_meta_data->>'date_of_birth')::DATE,
      NEW.raw_user_meta_data->>'gender',
      NEW.raw_user_meta_data->>'blood_group',
      string_to_array(NEW.raw_user_meta_data->>'allergies', ','),
      NEW.raw_user_meta_data->>'emergency_contact',
      NEW.raw_user_meta_data->>'medical_conditions'
    );
  ELSIF user_role = 'doctor' THEN
    INSERT INTO public.doctors (
      id, 
      specialization, 
      license_number, 
      qualification, 
      experience_years
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'specialization',
      NEW.raw_user_meta_data->>'license_number',
      NEW.raw_user_meta_data->>'qualification',
      (NEW.raw_user_meta_data->>'experience_years')::INTEGER
    );
  ELSIF user_role = 'receptionist' THEN
    INSERT INTO public.receptionists (
      id, 
      employee_id, 
      department, 
      shift
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'employee_id',
      NEW.raw_user_meta_data->>'department',
      NEW.raw_user_meta_data->>'shift'
    );
  ELSIF user_role = 'admin' THEN
    INSERT INTO public.admins (
      id, 
      access_level, 
      department
    )
    VALUES (
      NEW.id,
      'standard',
      NEW.raw_user_meta_data->>'department'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for handling new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert initial departments data
INSERT INTO departments (name, description)
VALUES 
  ('Cardiology', 'Diagnosis and treatment of heart disorders'),
  ('Neurology', 'Diagnosis and treatment of disorders of the nervous system'),
  ('Orthopedics', 'Diagnosis and treatment of disorders of the musculoskeletal system'),
  ('Pediatrics', 'Medical care of infants, children, and adolescents'),
  ('Dermatology', 'Diagnosis and treatment of skin disorders'),
  ('Ophthalmology', 'Diagnosis and treatment of eye disorders'),
  ('Gynecology', 'Medical care of the female reproductive system'),
  ('Urology', 'Diagnosis and treatment of disorders of the urinary tract and male reproductive system')
ON CONFLICT (name) DO NOTHING;
