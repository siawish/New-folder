// Supabase Configuration for Hospital Management System

// Supabase credentials
// Use window object to prevent duplicate declarations
if (!window.SUPABASE_URL) {
    window.SUPABASE_URL = 'https://vqlevlvqxwwofnecitxo.supabase.co';
}

if (!window.SUPABASE_ANON_KEY) {
    window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbGV2bHZxeHd3b2ZuZWNpdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDk1NzMsImV4cCI6MjA2MzMyNTU3M30.haGyIaB50jdZKBHS9rRE-7ULf-3fAYeFYwe-5bONmKE';
}

// Default admin credentials for easy login
window.DEFAULT_ADMIN_EMAIL = 'admin@hospital.com';
window.DEFAULT_ADMIN_PASSWORD = 'admin123';

// Initialize Supabase client
// Use window.supabaseClient to avoid variable name conflicts
window.supabaseClient = null;

// Initialize the Supabase client if it's not already initialized
function initSupabase() {
    if (!window.supabaseClient) {
        // Check if using the CDN version or the npm package
        if (window.supabase) {
            // Using the CDN version
            window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: false // IMPORTANT: This prevents the default redirect behavior
                }
            });
        } else {
            // Using the npm package
            window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: false // IMPORTANT: This prevents the default redirect behavior
                }
            });
        }
    }
    return window.supabaseClient;
}

// Initialize immediately when this script loads
window.supabaseClient = initSupabase();

/**
 * Database Schema and Table Creation
 * 
 * This section contains functions to create all necessary tables
 * for the Hospital Management System.
 * 
 * Note: These functions should be run only once during initial setup.
 * You can run them from the browser console or a setup script.
 */

// Create profiles table
async function createProfilesTable() {
  const { error } = await supabase.rpc('create_profiles_table');
  if (error) console.error('Error creating profiles table:', error);
  else console.log('Profiles table created successfully');
}

// Create appointments table
async function createAppointmentsTable() {
  const { error } = await supabase.rpc('create_appointments_table');
  if (error) console.error('Error creating appointments table:', error);
  else console.log('Appointments table created successfully');
}

// Create medical records table
async function createMedicalRecordsTable() {
  const { error } = await supabase.rpc('create_medical_records_table');
  if (error) console.error('Error creating medical records table:', error);
  else console.log('Medical records table created successfully');
}

// Create prescriptions table
async function createPrescriptionsTable() {
  const { error } = await supabase.rpc('create_prescriptions_table');
  if (error) console.error('Error creating prescriptions table:', error);
  else console.log('Prescriptions table created successfully');
}

// Create departments table
async function createDepartmentsTable() {
  const { error } = await supabase.rpc('create_departments_table');
  if (error) console.error('Error creating departments table:', error);
  else console.log('Departments table created successfully');
}

// Create system logs table
async function createSystemLogsTable() {
  const { error } = await supabase.rpc('create_system_logs_table');
  if (error) console.error('Error creating system logs table:', error);
  else console.log('System logs table created successfully');
}

/**
 * Row-Level Security (RLS) Policies
 * 
 * These functions set up RLS policies for each table to restrict
 * access based on user roles.
 */

// Apply RLS policies to profiles table
async function applyProfilesRLS() {
  const { error } = await supabase.rpc('apply_profiles_rls');
  if (error) console.error('Error applying profiles RLS:', error);
  else console.log('Profiles RLS applied successfully');
}

// Apply RLS policies to appointments table
async function applyAppointmentsRLS() {
  const { error } = await supabase.rpc('apply_appointments_rls');
  if (error) console.error('Error applying appointments RLS:', error);
  else console.log('Appointments RLS applied successfully');
}

// Apply RLS policies to medical records table
async function applyMedicalRecordsRLS() {
  const { error } = await supabase.rpc('apply_medical_records_rls');
  if (error) console.error('Error applying medical records RLS:', error);
  else console.log('Medical records RLS applied successfully');
}

// Apply RLS policies to prescriptions table
async function applyPrescriptionsRLS() {
  const { error } = await supabase.rpc('apply_prescriptions_rls');
  if (error) console.error('Error applying prescriptions RLS:', error);
  else console.log('Prescriptions RLS applied successfully');
}

/**
 * Data Access Functions
 * 
 * These functions provide a clean API for accessing and manipulating
 * data in the Supabase database.
 */

// User Profile Functions
const ProfileService = {
  // Get current user profile
  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Get profile by ID
  async getProfileById(profileId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update profile
  async updateProfile(profileId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profileId);
      
    if (error) throw error;
    return data;
  },
  
  // Get all profiles (admin only)
  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) throw error;
    return data;
  },
  
  // Get profiles by role
  async getProfilesByRole(role) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role);
      
    if (error) throw error;
    return data;
  }
};

// Appointment Functions
const AppointmentService = {
  // Create new appointment
  async createAppointment(appointmentData) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData]);
      
    if (error) throw error;
    return data;
  },
  
  // Get appointment by ID
  async getAppointmentById(appointmentId) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patient:patient_id(first_name, last_name), doctor:doctor_id(first_name, last_name)')
      .eq('id', appointmentId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update appointment
  async updateAppointment(appointmentId, updates) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', appointmentId);
      
    if (error) throw error;
    return data;
  },
  
  // Delete appointment
  async deleteAppointment(appointmentId) {
    const { data, error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);
      
    if (error) throw error;
    return data;
  },
  
  // Get appointments for patient
  async getPatientAppointments(patientId) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, doctor:doctor_id(first_name, last_name)')
      .eq('patient_id', patientId);
      
    if (error) throw error;
    return data;
  },
  
  // Get appointments for doctor
  async getDoctorAppointments(doctorId) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patient:patient_id(first_name, last_name)')
      .eq('doctor_id', doctorId);
      
    if (error) throw error;
    return data;
  },
  
  // Get all appointments (admin/receptionist)
  async getAllAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patient:patient_id(first_name, last_name), doctor:doctor_id(first_name, last_name)');
      
    if (error) throw error;
    return data;
  },
  
  // Get appointments by date
  async getAppointmentsByDate(date) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patient:patient_id(first_name, last_name), doctor:doctor_id(first_name, last_name)')
      .eq('date', date);
      
    if (error) throw error;
    return data;
  },
  
  // Get appointments by status
  async getAppointmentsByStatus(status) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patient:patient_id(first_name, last_name), doctor:doctor_id(first_name, last_name)')
      .eq('status', status);
      
    if (error) throw error;
    return data;
  }
};

// Medical Records Functions
const MedicalRecordService = {
  // Create new medical record
  async createMedicalRecord(recordData) {
    const { data, error } = await supabase
      .from('medical_records')
      .insert([recordData]);
      
    if (error) throw error;
    return data;
  },
  
  // Get medical record by ID
  async getMedicalRecordById(recordId) {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*, patient:patient_id(first_name, last_name), doctor:doctor_id(first_name, last_name)')
      .eq('id', recordId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update medical record
  async updateMedicalRecord(recordId, updates) {
    const { data, error } = await supabase
      .from('medical_records')
      .update(updates)
      .eq('id', recordId);
      
    if (error) throw error;
    return data;
  },
  
  // Get medical records for patient
  async getPatientMedicalRecords(patientId) {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*, doctor:doctor_id(first_name, last_name)')
      .eq('patient_id', patientId);
      
    if (error) throw error;
    return data;
  },
  
  // Get medical records created by doctor
  async getDoctorMedicalRecords(doctorId) {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*, patient:patient_id(first_name, last_name)')
      .eq('doctor_id', doctorId);
      
    if (error) throw error;
    return data;
  }
};

// Prescription Functions
const PrescriptionService = {
  // Create new prescription
  async createPrescription(prescriptionData) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([prescriptionData]);
      
    if (error) throw error;
    return data;
  },
  
  // Get prescription by ID
  async getPrescriptionById(prescriptionId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, patient:patient_id(first_name, last_name), doctor:doctor_id(first_name, last_name)')
      .eq('id', prescriptionId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update prescription
  async updatePrescription(prescriptionId, updates) {
    const { data, error } = await supabase
      .from('prescriptions')
      .update(updates)
      .eq('id', prescriptionId);
      
    if (error) throw error;
    return data;
  },
  
  // Get prescriptions for patient
  async getPatientPrescriptions(patientId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, doctor:doctor_id(first_name, last_name)')
      .eq('patient_id', patientId);
      
    if (error) throw error;
    return data;
  },
  
  // Get prescriptions created by doctor
  async getDoctorPrescriptions(doctorId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, patient:patient_id(first_name, last_name)')
      .eq('doctor_id', doctorId);
      
    if (error) throw error;
    return data;
  }
};

// System Logs Functions
const LogService = {
  // Create new log entry
  async createLogEntry(logData) {
    const { data, error } = await supabase
      .from('system_logs')
      .insert([logData]);
      
    if (error) console.error('Error creating log entry:', error);
    return data;
  },
  
  // Get all logs (admin only)
  async getAllLogs() {
    const { data, error } = await supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get logs by type
  async getLogsByType(logType) {
    const { data, error } = await supabase
      .from('system_logs')
      .select('*')
      .eq('log_type', logType)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get logs by user
  async getLogsByUser(userId) {
    const { data, error } = await supabase
      .from('system_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
const RealtimeService = {
  // Subscribe to appointments changes
  subscribeToAppointments(callback) {
    return supabase
      .channel('public:appointments')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'appointments' 
      }, callback)
      .subscribe();
  },
  
  // Subscribe to profile changes
  subscribeToProfiles(callback) {
    return supabase
      .channel('public:profiles')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles' 
      }, callback)
      .subscribe();
  },
  
  // Subscribe to medical records changes
  subscribeToMedicalRecords(callback) {
    return supabase
      .channel('public:medical_records')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'medical_records' 
      }, callback)
      .subscribe();
  },
  
  // Subscribe to prescriptions changes
  subscribeToPrescriptions(callback) {
    return supabase
      .channel('public:prescriptions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'prescriptions' 
      }, callback)
      .subscribe();
  }
};

// Export all services
const SupabaseService = {
  supabase,
  ProfileService,
  AppointmentService,
  MedicalRecordService,
  PrescriptionService,
  LogService,
  RealtimeService
};

// Export for use in other files
window.SupabaseService = SupabaseService;
