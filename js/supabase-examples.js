// Supabase Examples for Hospital Management System
// This file contains practical examples of how to use the Supabase client
// for common operations in the Hospital Management System

// Make sure to include supabase-config.js before this file

// ===== AUTHENTICATION EXAMPLES =====

// Example 1: Register a new user with role
async function registerUserExample() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'doctor@example.com',
      password: 'securePassword123',
      options: {
        data: {
          first_name: 'John',
          last_name: 'Smith',
          role: 'doctor'
        }
      }
    });
    
    if (error) throw error;
    console.log('User registered successfully:', data);
    
    // Create profile in profiles table (this is also handled by the trigger we set up)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          first_name: 'John',
          last_name: 'Smith',
          email: 'doctor@example.com',
          role: 'doctor',
          specialization: 'Cardiology',
          license_number: 'MD12345'
        }
      ]);
      
    if (profileError) throw profileError;
    console.log('Profile created successfully');
    
  } catch (error) {
    console.error('Error registering user:', error.message);
  }
}

// Example 2: Login and get user role
async function loginAndGetRoleExample() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'doctor@example.com',
      password: 'securePassword123'
    });
    
    if (error) throw error;
    console.log('User logged in successfully:', data);
    
    // Get user profile to determine role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, first_name, last_name')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) throw profileError;
    console.log(`User role: ${profile.role}`);
    console.log(`Welcome, ${profile.first_name} ${profile.last_name}`);
    
    // Redirect based on role
    switch(profile.role) {
      case 'admin':
        // Redirect to admin dashboard
        console.log('Redirecting to admin dashboard...');
        break;
      case 'doctor':
        // Redirect to doctor dashboard
        console.log('Redirecting to doctor dashboard...');
        break;
      case 'patient':
        // Redirect to patient dashboard
        console.log('Redirecting to patient dashboard...');
        break;
      case 'receptionist':
        // Redirect to receptionist dashboard
        console.log('Redirecting to receptionist dashboard...');
        break;
    }
    
  } catch (error) {
    console.error('Error logging in:', error.message);
  }
}

// ===== ADMIN DASHBOARD EXAMPLES =====

// Example 3: Get all users with role filtering
async function getAllUsersExample() {
  try {
    // Get all users
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) throw error;
    console.log('All users:', data);
    
    // Filter by role
    const { data: doctors, error: doctorsError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor');
      
    if (doctorsError) throw doctorsError;
    console.log('Doctors:', doctors);
    
    // Count users by role
    const roles = ['admin', 'doctor', 'patient', 'receptionist'];
    const counts = {};
    
    for (const role of roles) {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', role);
        
      if (error) throw error;
      counts[role] = count;
    }
    
    console.log('User counts by role:', counts);
    
  } catch (error) {
    console.error('Error getting users:', error.message);
  }
}

// Example 4: System statistics for admin dashboard
async function getSystemStatisticsExample() {
  try {
    // Get appointment counts by status
    const statuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'];
    const appointmentCounts = {};
    
    for (const status of statuses) {
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);
        
      if (error) throw error;
      appointmentCounts[status] = count;
    }
    
    console.log('Appointment counts by status:', appointmentCounts);
    
    // Get appointments for today
    const today = new Date().toISOString().split('T')[0];
    const { data: todayAppointments, error: todayError } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', today);
      
    if (todayError) throw todayError;
    console.log(`Today's appointments (${today}):`, todayAppointments);
    
    // Get recent system logs
    const { data: recentLogs, error: logsError } = await supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (logsError) throw logsError;
    console.log('Recent system logs:', recentLogs);
    
  } catch (error) {
    console.error('Error getting system statistics:', error.message);
  }
}

// ===== DOCTOR DASHBOARD EXAMPLES =====

// Example 5: Get doctor's appointments
async function getDoctorAppointmentsExample(doctorId) {
  try {
    // Get all appointments for the doctor
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id (id, first_name, last_name, email, phone)
      `)
      .eq('doctor_id', doctorId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
      
    if (error) throw error;
    console.log('Doctor appointments:', data);
    
    // Get today's appointments
    const today = new Date().toISOString().split('T')[0];
    const { data: todayAppointments, error: todayError } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id (id, first_name, last_name, email, phone)
      `)
      .eq('doctor_id', doctorId)
      .eq('date', today)
      .order('time', { ascending: true });
      
    if (todayError) throw todayError;
    console.log(`Today's appointments (${today}):`, todayAppointments);
    
  } catch (error) {
    console.error('Error getting doctor appointments:', error.message);
  }
}

// Example 6: Create a medical record and prescription
async function createMedicalRecordExample(doctorId, patientId, appointmentId) {
  try {
    // Create medical record
    const { data: record, error: recordError } = await supabase
      .from('medical_records')
      .insert([
        {
          patient_id: patientId,
          doctor_id: doctorId,
          appointment_id: appointmentId,
          diagnosis: 'Hypertension',
          symptoms: ['headache', 'dizziness', 'fatigue'],
          treatment: 'Prescribed medication and lifestyle changes',
          notes: 'Patient should monitor blood pressure daily'
        }
      ])
      .select()
      .single();
      
    if (recordError) throw recordError;
    console.log('Medical record created:', record);
    
    // Create prescription
    const { data: prescription, error: prescriptionError } = await supabase
      .from('prescriptions')
      .insert([
        {
          patient_id: patientId,
          doctor_id: doctorId,
          medical_record_id: record.id,
          medications: [
            {
              name: 'Lisinopril',
              dosage: '10mg',
              frequency: 'Once daily',
              duration: '30 days'
            },
            {
              name: 'Hydrochlorothiazide',
              dosage: '12.5mg',
              frequency: 'Once daily',
              duration: '30 days'
            }
          ],
          instructions: 'Take in the morning with food. Avoid alcohol.',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
        }
      ])
      .select()
      .single();
      
    if (prescriptionError) throw prescriptionError;
    console.log('Prescription created:', prescription);
    
    // Update appointment status to completed
    const { error: appointmentError } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', appointmentId);
      
    if (appointmentError) throw appointmentError;
    console.log('Appointment marked as completed');
    
  } catch (error) {
    console.error('Error creating medical record and prescription:', error.message);
  }
}

// ===== PATIENT DASHBOARD EXAMPLES =====

// Example 7: Book a new appointment
async function bookAppointmentExample(patientId, doctorId) {
  try {
    // Get doctor's available time slots (simplified example)
    const appointmentDate = '2025-06-15';
    const appointmentTime = '14:30:00';
    
    // Check if the slot is available (simplified)
    const { count, error: checkError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctorId)
      .eq('date', appointmentDate)
      .eq('time', appointmentTime);
      
    if (checkError) throw checkError;
    
    if (count > 0) {
      console.log('This time slot is already booked');
      return;
    }
    
    // Book the appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: patientId,
          doctor_id: doctorId,
          date: appointmentDate,
          time: appointmentTime,
          duration: 30,
          status: 'scheduled',
          reason: 'Regular checkup'
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    console.log('Appointment booked successfully:', data);
    
    // Create a system log
    await supabase
      .from('system_logs')
      .insert([
        {
          user_id: patientId,
          log_type: 'appointment_created',
          description: `Appointment booked with doctor ${doctorId} on ${appointmentDate} at ${appointmentTime}`
        }
      ]);
    
  } catch (error) {
    console.error('Error booking appointment:', error.message);
  }
}

// Example 8: View patient medical history
async function getPatientMedicalHistoryExample(patientId) {
  try {
    // Get medical records
    const { data: records, error: recordsError } = await supabase
      .from('medical_records')
      .select(`
        *,
        doctor:doctor_id (id, first_name, last_name, specialization)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
      
    if (recordsError) throw recordsError;
    console.log('Patient medical records:', records);
    
    // Get prescriptions
    const { data: prescriptions, error: prescriptionsError } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:doctor_id (id, first_name, last_name, specialization)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
      
    if (prescriptionsError) throw prescriptionsError;
    console.log('Patient prescriptions:', prescriptions);
    
    // Get past appointments
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctor_id (id, first_name, last_name, specialization)
      `)
      .eq('patient_id', patientId)
      .eq('status', 'completed')
      .order('date', { ascending: false });
      
    if (appointmentsError) throw appointmentsError;
    console.log('Patient past appointments:', appointments);
    
  } catch (error) {
    console.error('Error getting patient medical history:', error.message);
  }
}

// ===== RECEPTIONIST DASHBOARD EXAMPLES =====

// Example 9: Schedule appointment for a patient
async function scheduleAppointmentExample(patientId, doctorId, receptionistId) {
  try {
    // Schedule the appointment
    const appointmentDate = '2025-06-20';
    const appointmentTime = '10:00:00';
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: patientId,
          doctor_id: doctorId,
          date: appointmentDate,
          time: appointmentTime,
          duration: 30,
          status: 'confirmed', // Receptionist can directly confirm
          reason: 'Follow-up appointment',
          notes: 'Scheduled by receptionist'
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    console.log('Appointment scheduled successfully:', data);
    
    // Create a system log
    await supabase
      .from('system_logs')
      .insert([
        {
          user_id: receptionistId,
          log_type: 'appointment_scheduled',
          description: `Receptionist scheduled appointment for patient ${patientId} with doctor ${doctorId}`
        }
      ]);
    
    // Send notification (this would be implemented with a separate service)
    console.log('Notification sent to patient and doctor');
    
  } catch (error) {
    console.error('Error scheduling appointment:', error.message);
  }
}

// Example 10: Manage daily appointment queue
async function manageDailyQueueExample() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's appointments
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id (id, first_name, last_name),
        doctor:doctor_id (id, first_name, last_name, specialization)
      `)
      .eq('date', today)
      .order('time', { ascending: true });
      
    if (error) throw error;
    console.log(`Today's appointment queue (${today}):`, data);
    
    // Update an appointment status (e.g., patient arrived)
    const appointmentId = data[0]?.id;
    if (appointmentId) {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'in-progress', notes: 'Patient has arrived' })
        .eq('id', appointmentId);
        
      if (updateError) throw updateError;
      console.log(`Appointment ${appointmentId} updated to in-progress`);
    }
    
  } catch (error) {
    console.error('Error managing daily queue:', error.message);
  }
}

// ===== REAL-TIME SUBSCRIPTION EXAMPLES =====

// Example 11: Real-time appointment updates
function subscribeToAppointmentsExample() {
  const subscription = supabase
    .channel('public:appointments')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'appointments' 
    }, (payload) => {
      console.log('Appointment change received:', payload);
      
      // Handle different types of changes
      switch (payload.eventType) {
        case 'INSERT':
          console.log('New appointment created:', payload.new);
          // Update UI to show new appointment
          break;
        case 'UPDATE':
          console.log('Appointment updated:', payload.new);
          // Update UI to reflect changes
          break;
        case 'DELETE':
          console.log('Appointment deleted:', payload.old);
          // Remove appointment from UI
          break;
      }
    })
    .subscribe();
    
  // Return subscription so it can be unsubscribed later
  return subscription;
}

// Example 12: Real-time medical records updates (for doctors)
function subscribeToPatientRecordsExample(patientId) {
  const subscription = supabase
    .channel(`public:medical_records:patient_id=eq.${patientId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'medical_records',
      filter: `patient_id=eq.${patientId}`
    }, (payload) => {
      console.log('Medical record change received:', payload);
      
      // Update UI based on the change
      if (payload.eventType === 'INSERT') {
        console.log('New medical record created:', payload.new);
      } else if (payload.eventType === 'UPDATE') {
        console.log('Medical record updated:', payload.new);
      }
    })
    .subscribe();
    
  return subscription;
}

// ===== UTILITY FUNCTIONS =====

// Example 13: Create a system log entry
async function createLogEntryExample(userId, logType, description) {
  try {
    const { data, error } = await supabase
      .from('system_logs')
      .insert([
        {
          user_id: userId,
          log_type: logType,
          description: description,
          ip_address: '192.168.1.1', // In a real app, you'd get the actual IP
          user_agent: navigator.userAgent
        }
      ]);
      
    if (error) throw error;
    console.log('Log entry created successfully');
    
  } catch (error) {
    console.error('Error creating log entry:', error.message);
  }
}

// Example 14: Get available doctors by department
async function getDoctorsByDepartmentExample(departmentId) {
  try {
    const { data, error } = await supabase
      .from('doctor_departments')
      .select(`
        doctor:doctor_id (
          id, 
          first_name, 
          last_name, 
          specialization, 
          email, 
          phone
        )
      `)
      .eq('department_id', departmentId);
      
    if (error) throw error;
    
    // Extract the doctor objects from the nested structure
    const doctors = data.map(item => item.doctor);
    console.log(`Doctors in department ${departmentId}:`, doctors);
    
    return doctors;
    
  } catch (error) {
    console.error('Error getting doctors by department:', error.message);
    return [];
  }
}

// Export all example functions
window.SupabaseExamples = {
  registerUserExample,
  loginAndGetRoleExample,
  getAllUsersExample,
  getSystemStatisticsExample,
  getDoctorAppointmentsExample,
  createMedicalRecordExample,
  bookAppointmentExample,
  getPatientMedicalHistoryExample,
  scheduleAppointmentExample,
  manageDailyQueueExample,
  subscribeToAppointmentsExample,
  subscribeToPatientRecordsExample,
  createLogEntryExample,
  getDoctorsByDepartmentExample
};
