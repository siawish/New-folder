-- HMS Database Schema for Supabase
-- This script creates the necessary tables for the Hospital Management System

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for additional security functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own appointments
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
CREATE POLICY "Users can view their own appointments" ON public.appointments
    USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Allow users to insert their own appointments
DROP POLICY IF EXISTS "Patients can create appointments" ON public.appointments;
CREATE POLICY "Patients can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Allow doctors to update appointments they're assigned to
DROP POLICY IF EXISTS "Doctors can update their appointments" ON public.appointments;
CREATE POLICY "Doctors can update their appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = doctor_id);

-- Add specialty column to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'specialty'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN specialty VARCHAR(100);
    END IF;
END $$;

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    location VARCHAR(100),
    head_doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for departments
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view departments
DROP POLICY IF EXISTS "Authenticated users can view departments" ON public.departments;
CREATE POLICY "Authenticated users can view departments" ON public.departments
    USING (auth.role() = 'authenticated');

-- Allow admin to manage departments
DROP POLICY IF EXISTS "Admin can manage departments" ON public.departments;
CREATE POLICY "Admin can manage departments" ON public.departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create doctor_departments junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.doctor_departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(doctor_id, department_id)
);

-- Add RLS policies for doctor_departments
ALTER TABLE public.doctor_departments ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view doctor_departments
DROP POLICY IF EXISTS "Authenticated users can view doctor_departments" ON public.doctor_departments;
CREATE POLICY "Authenticated users can view doctor_departments" ON public.doctor_departments
    USING (auth.role() = 'authenticated');

-- Allow admin to manage doctor_departments
DROP POLICY IF EXISTS "Admin can manage doctor_departments" ON public.doctor_departments;
CREATE POLICY "Admin can manage doctor_departments" ON public.doctor_departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create indexes for doctor_departments
CREATE INDEX IF NOT EXISTS idx_doctor_departments_doctor_id ON public.doctor_departments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_departments_department_id ON public.doctor_departments(department_id);

-- Create bedrooms table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bedrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(20) NOT NULL UNIQUE,
    room_type VARCHAR(50) NOT NULL,
    floor INTEGER NOT NULL,
    is_occupied BOOLEAN DEFAULT false,
    patient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for bedrooms
ALTER TABLE public.bedrooms ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view bedrooms
DROP POLICY IF EXISTS "Authenticated users can view bedrooms" ON public.bedrooms;
CREATE POLICY "Authenticated users can view bedrooms" ON public.bedrooms
    USING (auth.role() = 'authenticated');

-- Allow admin and staff to manage bedrooms
DROP POLICY IF EXISTS "Admin and staff can manage bedrooms" ON public.bedrooms;
CREATE POLICY "Admin and staff can manage bedrooms" ON public.bedrooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role = 'admin' OR profiles.role = 'receptionist')
        )
    );

-- Create dedicated receptionists table
CREATE TABLE IF NOT EXISTS public.receptionists (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    desk_number VARCHAR(20),
    shift_hours VARCHAR(50),
    responsibilities TEXT,
    supervisor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for receptionists
ALTER TABLE public.receptionists ENABLE ROW LEVEL SECURITY;

-- Allow receptionists to view and edit their own data
DROP POLICY IF EXISTS "Receptionists can view their own data" ON public.receptionists;
CREATE POLICY "Receptionists can view their own data" ON public.receptionists
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Receptionists can update their own data" ON public.receptionists;
CREATE POLICY "Receptionists can update their own data" ON public.receptionists
    FOR UPDATE USING (auth.uid() = id);

-- Allow admin to manage all receptionist data
DROP POLICY IF EXISTS "Admin can manage all receptionist data" ON public.receptionists;
CREATE POLICY "Admin can manage all receptionist data" ON public.receptionists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create dedicated doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE,
    education TEXT,
    experience_years INTEGER,
    consultation_fee DECIMAL(10, 2),
    available_days VARCHAR(100),
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for doctors
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Allow doctors to view and edit their own data
DROP POLICY IF EXISTS "Doctors can view their own data" ON public.doctors;
CREATE POLICY "Doctors can view their own data" ON public.doctors
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Doctors can update their own data" ON public.doctors;
CREATE POLICY "Doctors can update their own data" ON public.doctors
    FOR UPDATE USING (auth.uid() = id);

-- Allow admin to manage all doctor data
DROP POLICY IF EXISTS "Admin can manage all doctor data" ON public.doctors;
CREATE POLICY "Admin can manage all doctor data" ON public.doctors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create dedicated patients table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    blood_group VARCHAR(5),
    height DECIMAL(5, 2),
    weight DECIMAL(5, 2),
    allergies TEXT,
    medical_history TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for patients
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Allow patients to view and edit their own data
DROP POLICY IF EXISTS "Patients can view their own data" ON public.patients;
CREATE POLICY "Patients can view their own data" ON public.patients
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Patients can update their own data" ON public.patients;
CREATE POLICY "Patients can update their own data" ON public.patients
    FOR UPDATE USING (auth.uid() = id);

-- Allow doctors to view their patients' data
DROP POLICY IF EXISTS "Doctors can view their patients' data" ON public.patients;
CREATE POLICY "Doctors can view their patients' data" ON public.patients
    USING (
        EXISTS (
            SELECT 1 FROM public.appointments 
            WHERE appointments.doctor_id = auth.uid() 
            AND appointments.patient_id = patients.id
        )
    );

-- Allow admin to manage all patient data
DROP POLICY IF EXISTS "Admin can manage all patient data" ON public.patients;
CREATE POLICY "Admin can manage all patient data" ON public.patients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create medical records table
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    record_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    diagnosis TEXT,
    symptoms TEXT,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for medical records
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Allow patients to view their own medical records
DROP POLICY IF EXISTS "Patients can view their own medical records" ON public.medical_records;
CREATE POLICY "Patients can view their own medical records" ON public.medical_records
    USING (auth.uid() = patient_id);

-- Allow doctors to view and create medical records for their patients
DROP POLICY IF EXISTS "Doctors can view medical records for their patients" ON public.medical_records;
CREATE POLICY "Doctors can view medical records for their patients" ON public.medical_records
    USING (
        auth.uid() = doctor_id OR
        EXISTS (
            SELECT 1 FROM public.appointments 
            WHERE appointments.doctor_id = auth.uid() 
            AND appointments.patient_id = medical_records.patient_id
        )
    );

DROP POLICY IF EXISTS "Doctors can create medical records" ON public.medical_records;
CREATE POLICY "Doctors can create medical records" ON public.medical_records
    FOR INSERT WITH CHECK (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can update their own medical records" ON public.medical_records;
CREATE POLICY "Doctors can update their own medical records" ON public.medical_records
    FOR UPDATE USING (auth.uid() = doctor_id);

-- Create medications table
CREATE TABLE IF NOT EXISTS public.medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    dosage VARCHAR(50),
    manufacturer VARCHAR(100),
    price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for medications
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view medications
DROP POLICY IF EXISTS "Authenticated users can view medications" ON public.medications;
CREATE POLICY "Authenticated users can view medications" ON public.medications
    USING (auth.role() = 'authenticated');

-- Allow admin and pharmacist to manage medications
DROP POLICY IF EXISTS "Admin and pharmacist can manage medications" ON public.medications;
CREATE POLICY "Admin and pharmacist can manage medications" ON public.medications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role = 'admin' OR profiles.role = 'pharmacist')
        )
    );

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prescription_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for prescriptions
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Allow patients to view their own prescriptions
DROP POLICY IF EXISTS "Patients can view their own prescriptions" ON public.prescriptions;
CREATE POLICY "Patients can view their own prescriptions" ON public.prescriptions
    USING (auth.uid() = patient_id);

-- Allow doctors to manage prescriptions they created
DROP POLICY IF EXISTS "Doctors can manage their prescriptions" ON public.prescriptions;
CREATE POLICY "Doctors can manage their prescriptions" ON public.prescriptions
    FOR ALL USING (auth.uid() = doctor_id);

-- Create prescription_items table
CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50),
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for prescription_items
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;

-- Allow access to prescription items based on prescription access
DROP POLICY IF EXISTS "Access prescription items based on prescription access" ON public.prescription_items;
CREATE POLICY "Access prescription items based on prescription access" ON public.prescription_items
    USING (
        EXISTS (
            SELECT 1 FROM public.prescriptions 
            WHERE prescriptions.id = prescription_items.prescription_id 
            AND (prescriptions.patient_id = auth.uid() OR prescriptions.doctor_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role = 'admin' OR profiles.role = 'pharmacist')
        )
    );

-- Create invoice table (renamed from billing for clarity)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    due_date TIMESTAMP WITH TIME ZONE,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    discount_reason TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'unpaid',
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Allow patients to view their own invoices
DROP POLICY IF EXISTS "Patients can view their own invoices" ON public.invoices;
CREATE POLICY "Patients can view their own invoices" ON public.invoices
    USING (auth.uid() = patient_id);

-- Allow admin and receptionist to manage invoices
DROP POLICY IF EXISTS "Admin and receptionist can manage invoices" ON public.invoices;
CREATE POLICY "Admin and receptionist can manage invoices" ON public.invoices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role = 'admin' OR profiles.role = 'receptionist')
        )
    );

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_id UUID,
    service_date TIMESTAMP WITH TIME ZONE,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    tax_percent DECIMAL(5, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for invoice_items
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Allow access to invoice items based on invoice access
DROP POLICY IF EXISTS "Access invoice items based on invoice access" ON public.invoice_items;
CREATE POLICY "Access invoice items based on invoice access" ON public.invoice_items
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND (invoices.patient_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE profiles.id = auth.uid() 
                    AND (profiles.role = 'admin' OR profiles.role = 'receptionist')
                )
            )
        )
    );

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    payment_number VARCHAR(20) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'completed',
    notes TEXT,
    receipt_generated BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow patients to view their own payments
DROP POLICY IF EXISTS "Patients can view their own payments" ON public.payments;
CREATE POLICY "Patients can view their own payments" ON public.payments
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices 
            WHERE invoices.id = payments.invoice_id 
            AND invoices.patient_id = auth.uid()
        )
    );

-- Allow admin and receptionist to manage payments
DROP POLICY IF EXISTS "Admin and receptionist can manage payments" ON public.payments;
CREATE POLICY "Admin and receptionist can manage payments" ON public.payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role = 'admin' OR profiles.role = 'receptionist')
        )
    );

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    requires_verification BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for payment_methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view payment methods
DROP POLICY IF EXISTS "All users can view payment methods" ON public.payment_methods;
CREATE POLICY "All users can view payment methods" ON public.payment_methods
    USING (auth.role() = 'authenticated');

-- Allow admin to manage payment methods
DROP POLICY IF EXISTS "Admin can manage payment methods" ON public.payment_methods;
CREATE POLICY "Admin can manage payment methods" ON public.payment_methods
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create service_catalog table
CREATE TABLE IF NOT EXISTS public.service_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    tax_applicable BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for service_catalog
ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view service catalog
DROP POLICY IF EXISTS "All users can view service catalog" ON public.service_catalog;
CREATE POLICY "All users can view service catalog" ON public.service_catalog
    USING (auth.role() = 'authenticated');

-- Allow admin to manage service catalog
DROP POLICY IF EXISTS "Admin can manage service catalog" ON public.service_catalog;
CREATE POLICY "Admin can manage service catalog" ON public.service_catalog
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create tax_rates table
CREATE TABLE IF NOT EXISTS public.tax_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    rate DECIMAL(5, 2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for tax_rates
ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view tax rates
DROP POLICY IF EXISTS "All users can view tax rates" ON public.tax_rates;
CREATE POLICY "All users can view tax rates" ON public.tax_rates
    USING (auth.role() = 'authenticated');

-- Allow admin to manage tax rates
DROP POLICY IF EXISTS "Admin can manage tax rates" ON public.tax_rates;
CREATE POLICY "Admin can manage tax rates" ON public.tax_rates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create discount_types table
CREATE TABLE IF NOT EXISTS public.discount_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    rate DECIMAL(5, 2),
    is_percentage BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for discount_types
ALTER TABLE public.discount_types ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view discount types
DROP POLICY IF EXISTS "All users can view discount types" ON public.discount_types;
CREATE POLICY "All users can view discount types" ON public.discount_types
    USING (auth.role() = 'authenticated');

-- Allow admin to manage discount types
DROP POLICY IF EXISTS "Admin can manage discount types" ON public.discount_types;
CREATE POLICY "Admin can manage discount types" ON public.discount_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create audit_logs table for tracking sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow admin to view audit logs
DROP POLICY IF EXISTS "Admin can view audit logs" ON public.audit_logs;
CREATE POLICY "Admin can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Function to log changes to sensitive tables
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs(user_id, action, table_name, record_id, old_data, new_data)
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        CASE
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE
            WHEN TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN row_to_json(OLD)
            ELSE NULL
        END,
        CASE
            WHEN TG_OP = 'UPDATE' OR TG_OP = 'INSERT' THEN row_to_json(NEW)
            ELSE NULL
        END
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_medical_records_trigger ON public.medical_records;
CREATE TRIGGER audit_medical_records_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.medical_records
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_prescriptions_trigger ON public.prescriptions;
CREATE TRIGGER audit_prescriptions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.prescriptions
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_invoices_trigger ON public.invoices;
CREATE TRIGGER audit_invoices_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_payments_trigger ON public.payments;
CREATE TRIGGER audit_payments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Add indexes for frequently queried columns to improve performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
-- Index on appointment date removed due to column name issue
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor_id ON public.medical_records(doctor_id);
-- Index on medical records date removed due to column name issue

CREATE INDEX IF NOT EXISTS idx_invoices_patient_id ON public.invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON public.invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);

CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments(payment_date);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
