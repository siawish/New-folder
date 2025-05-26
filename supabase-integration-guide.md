# Supabase Integration Guide for Hospital Management System

This guide explains how to integrate the Supabase backend with your Hospital Management System frontend.

## Supabase Project Configuration

Your Supabase project is already set up with the following credentials:

- **Supabase URL**: `https://vqlevlvqxwwofnecitxo.supabase.co`
- **Supabase Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbGV2bHZxeHd3b2ZuZWNpdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDk1NzMsImV4cCI6MjA2MzMyNTU3M30.haGyIaB50jdZKBHS9rRE-7ULf-3fAYeFYwe-5bONmKE`

## Database Setup

1. **Run the SQL Setup Script**:
   - Log into the [Supabase Dashboard](https://app.supabase.com)
   - Navigate to your project
   - Go to the SQL Editor
   - Copy and paste the contents of `supabase-setup.sql` into the editor
   - Run the script to create all tables, triggers, and RLS policies

2. **Verify Table Creation**:
   - Go to the Table Editor in your Supabase dashboard
   - Confirm that the following tables have been created:
     - profiles
     - departments
     - doctor_departments
     - appointments
     - medical_records
     - prescriptions
     - system_logs

## Authentication Integration

The authentication system is already set up in `js/auth.js`. Here's how it works:

1. **User Registration**:
   ```javascript
   // Example: Register a new user
   const { data, error } = await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'password123',
     options: {
       data: {
         first_name: 'John',
         last_name: 'Doe',
         role: 'patient'
       }
     }
   });
   ```

2. **User Login**:
   ```javascript
   // Example: Log in a user
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'user@example.com',
     password: 'password123'
   });
   ```

3. **Logout**:
   ```javascript
   // Example: Log out a user
   const { error } = await supabase.auth.signOut();
   ```

## Using the Supabase Service

The `js/supabase-config.js` file provides a comprehensive service for interacting with your Supabase backend. Here's how to use it:

### Profile Management

```javascript
// Get current user profile
const profile = await SupabaseService.ProfileService.getCurrentProfile();

// Update profile
await SupabaseService.ProfileService.updateProfile(profileId, {
  phone: '123-456-7890',
  address: '123 Main St'
});

// Get all profiles (admin only)
const allProfiles = await SupabaseService.ProfileService.getAllProfiles();
```

### Appointment Management

```javascript
// Create a new appointment
await SupabaseService.AppointmentService.createAppointment({
  patient_id: 'patient-uuid',
  doctor_id: 'doctor-uuid',
  date: '2025-06-01',
  time: '14:30:00',
  reason: 'Annual checkup'
});

// Get appointments for a doctor
const doctorAppointments = await SupabaseService.AppointmentService.getDoctorAppointments('doctor-uuid');

// Get appointments for a patient
const patientAppointments = await SupabaseService.AppointmentService.getPatientAppointments('patient-uuid');
```

### Medical Records

```javascript
// Create a medical record
await SupabaseService.MedicalRecordService.createMedicalRecord({
  patient_id: 'patient-uuid',
  doctor_id: 'doctor-uuid',
  diagnosis: 'Common cold',
  symptoms: ['fever', 'cough', 'headache'],
  treatment: 'Rest and fluids'
});

// Get patient medical records
const records = await SupabaseService.MedicalRecordService.getPatientMedicalRecords('patient-uuid');
```

### Prescriptions

```javascript
// Create a prescription
await SupabaseService.PrescriptionService.createPrescription({
  patient_id: 'patient-uuid',
  doctor_id: 'doctor-uuid',
  medications: [
    {
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      duration: '7 days'
    }
  ],
  instructions: 'Take with food',
  start_date: '2025-06-01',
  end_date: '2025-06-08'
});

// Get patient prescriptions
const prescriptions = await SupabaseService.PrescriptionService.getPatientPrescriptions('patient-uuid');
```

## Real-time Updates

Supabase provides real-time functionality that you can use to update your UI when data changes:

```javascript
// Subscribe to appointment changes
const subscription = SupabaseService.RealtimeService.subscribeToAppointments((payload) => {
  console.log('Appointment changed:', payload);
  // Update UI based on the change
});

// Later, unsubscribe when component unmounts
subscription.unsubscribe();
```

## Row-Level Security (RLS)

The SQL setup script has already configured RLS policies for all tables. These policies ensure that:

1. **Admins** can access all data
2. **Doctors** can only access their own data and their patients' data
3. **Patients** can only access their own data
4. **Receptionists** can manage appointments and view patient/doctor profiles

## Dashboard Integration

Each role-based dashboard should use the appropriate Supabase service functions:

### Admin Dashboard

```javascript
// Get all users
const users = await SupabaseService.ProfileService.getAllProfiles();

// Get system logs
const logs = await SupabaseService.LogService.getAllLogs();

// Get all appointments
const appointments = await SupabaseService.AppointmentService.getAllAppointments();
```

### Doctor Dashboard

```javascript
// Get doctor's appointments
const appointments = await SupabaseService.AppointmentService.getDoctorAppointments(doctorId);

// Get doctor's patients
const patientRecords = await SupabaseService.MedicalRecordService.getDoctorMedicalRecords(doctorId);
```

### Patient Dashboard

```javascript
// Get patient's appointments
const appointments = await SupabaseService.AppointmentService.getPatientAppointments(patientId);

// Get patient's medical records
const records = await SupabaseService.MedicalRecordService.getPatientMedicalRecords(patientId);

// Get patient's prescriptions
const prescriptions = await SupabaseService.PrescriptionService.getPatientPrescriptions(patientId);
```

### Receptionist Dashboard

```javascript
// Get all appointments
const appointments = await SupabaseService.AppointmentService.getAllAppointments();

// Get appointments by date
const todaysAppointments = await SupabaseService.AppointmentService.getAppointmentsByDate('2025-06-01');
```

## Troubleshooting

If you encounter issues with Supabase integration:

1. **Check Console Errors**: Most Supabase errors will appear in the browser console
2. **Verify Credentials**: Ensure your Supabase URL and anon key are correct
3. **Check RLS Policies**: If you're getting permission errors, review your RLS policies
4. **Inspect Network Requests**: Use browser dev tools to see the actual API requests and responses

## Next Steps

1. Complete the dashboard implementations for each role
2. Implement the real-time functionality for immediate updates
3. Add form validation before sending data to Supabase
4. Implement error handling and user feedback
5. Add data visualization for statistics and reports
