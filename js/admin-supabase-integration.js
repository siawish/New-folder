// Admin Dashboard Supabase Integration
// This file extracts and posts all data according to the database schema

// Reference to the Supabase client
const supabase = window.supabaseClient;

// =============================================
// DATA EXTRACTION FUNCTIONS
// =============================================

/**
 * Extract data from all tables in the database
 * This provides a complete snapshot of the database for the admin dashboard
 */
async function extractAllData() {
    try {
        // Extract data from all tables
        const data = {};
        
        // Extract user-related data
        data.patients = await extractPatients();
        data.doctors = await extractDoctors();
        data.receptionists = await extractReceptionists();
        data.profiles = await extractProfiles();
        
        // Extract operational data
        data.appointments = await extractAppointments();
        data.medicalRecords = await extractMedicalRecords();
        data.prescriptions = await extractPrescriptions();
        data.departments = await extractDepartments();
        data.bedrooms = await extractBedrooms();
        
        // Extract financial data
        data.invoices = await extractInvoices();
        data.payments = await extractPayments();
        data.invoiceItems = await extractInvoiceItems();
        
        // Extract system data
        data.auditLogs = await extractAuditLogs();
        
        return data;
    } catch (error) {
        console.error('Error extracting all data:', error);
        return null;
    }
}

/**
 * Extract patients data from the database
 */
async function extractPatients() {
    try {
        // First try to get from patients table if it exists
        try {
            const { data, error } = await supabase
                .from('patients')
                .select('*');
                
            if (!error) {
                return data || [];
            }
        } catch (innerError) {
            console.log('Patients table not found, falling back to profiles');
        }
        
        // Fallback to profiles table with role=patient
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'patient');
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting patients:', error);
        return [];
    }
}

/**
 * Extract doctors data from the database
 */
async function extractDoctors() {
    try {
        // First try to get from doctors table if it exists
        try {
            const { data, error } = await supabase
                .from('doctors')
                .select('*');
                
            if (!error) {
                return data || [];
            }
        } catch (innerError) {
            console.log('Doctors table not found, falling back to profiles');
        }
        
        // Fallback to profiles table with role=doctor
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'doctor');
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting doctors:', error);
        return [];
    }
}

/**
 * Extract receptionists data from the database
 */
async function extractReceptionists() {
    try {
        const { data, error } = await supabase
            .from('receptionists')
            .select(`
                id,
                department_id,
                shift_start,
                shift_end,
                responsibilities,
                created_at,
                updated_at
            `);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting receptionists:', error);
        return [];
    }
}

/**
 * Extract profiles data from the database
 */
async function extractProfiles() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                id,
                first_name,
                last_name,
                gender,
                date_of_birth,
                phone_number,
                address,
                city,
                state,
                postal_code,
                country,
                profile_image_url,
                role,
                is_active,
                last_login,
                created_at,
                updated_at
            `);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting profiles:', error);
        return [];
    }
}

/**
 * Extract appointments data from the database
 */
async function extractAppointments() {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*');
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting appointments:', error);
        return [];
    }
}

/**
 * Extract medical records data from the database
 */
async function db_extractMedicalRecords() {
    try {
        const { data, error } = await supabase
            .from('medical_records')
            .select(`
                id,
                patient_id,
                doctor_id,
                visit_date,
                diagnosis,
                symptoms,
                treatment,
                prescription,
                notes,
                follow_up_date,
                created_at,
                updated_at
            `);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting medical records:', error);
        return [];
    }
}

/**
 * Extract prescriptions data from the database
 */
async function extractPrescriptions() {
    try {
        const { data, error } = await supabase
            .from('prescriptions')
            .select(`
                id,
                patient_id,
                doctor_id,
                prescription_date,
                status,
                notes,
                created_at,
                updated_at,
                prescription_items(id, prescription_id, medication_name, dosage, frequency, duration, instructions)
            `);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting prescriptions:', error);
        return [];
    }
}

/**
 * Extract departments data from the database
 */
async function extractDepartments() {
    try {
        const { data, error } = await supabase
            .from('departments')
            .select(`
                id,
                name,
                description,
                location,
                head_doctor_id,
                contact_number,
                email,
                created_at,
                updated_at
            `);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting departments:', error);
        return [];
    }
}

/**
 * Extract bedrooms data from the database
 */
async function extractBedrooms() {
    try {
        // Try to get from bedrooms table first (new schema)
        try {
            const { data: bedroomsData, error: bedroomsError } = await supabase
                .from('bedrooms')
                .select('*');
                
            if (!bedroomsError && bedroomsData) {
                return bedroomsData;
            }
        } catch (innerError) {
            console.debug('Bedrooms table not found, trying rooms table');
        }
        
        // Then try rooms table (old schema)
        try {
            const { data: roomsData, error: roomsError } = await supabase
                .from('rooms')
                .select('*');
                
            if (!roomsError && roomsData) {
                return roomsData;
            }
        } catch (innerError) {
            console.debug('Rooms table not found either');
        }
        
        // Return empty array if no tables found
        console.log('No bedrooms/rooms tables found in database');
        return [];
    } catch (error) {
        console.error('Error extracting bedrooms:', error);
        return [];
    }
}

/**
 * Extract invoices data from the database
 */
async function extractInvoices() {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .select(`
                id,
                invoice_number,
                patient_id,
                invoice_date,
                due_date,
                total_amount,
                paid_amount,
                status,
                notes,
                created_at,
                updated_at
            `);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting invoices:', error);
        return [];
    }
}

/**
 * Extract payments data from the database
 */
async function extractPayments() {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select(`
                id,
                invoice_id,
                payment_number,
                amount,
                payment_date,
                payment_method,
                transaction_id,
                notes,
                created_at,
                updated_at
            `);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting payments:', error);
        return [];
    }
}

/**
 * Extract invoice items data from the database
 */
async function extractInvoiceItems() {
    try {
        const { data, error } = await supabase
            .from('invoice_items')
            .select(`
                id,
                invoice_id,
                item_type,
                description,
                quantity,
                unit_price,
                total_price,
                tax_rate,
                tax_amount,
                discount_percentage,
                discount_amount,
                final_amount,
                created_at,
                updated_at
            `);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting invoice items:', error);
        return [];
    }
}

/**
 * Extract audit logs data from the database
 */
async function extractAuditLogs() {
    try {
        const { data, error } = await supabase
            .from('audit_logs')
            .select(`
                id,
                user_id,
                action,
                table_name,
                record_id,
                old_data,
                new_data,
                ip_address,
                user_agent,
                created_at
            `);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error extracting audit logs:', error);
        return [];
    }
}

// =============================================
// DATA POSTING FUNCTIONS
// =============================================

/**
 * Post patient data to the database
 * @param {Object} patientData - Patient data to post
 */
async function postPatient(patientData) {
    try {
        const { data, error } = await supabase
            .from('patients')
            .insert([patientData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting patient:', error);
        return { success: false, error };
    }
}

/**
 * Post doctor data to the database
 * @param {Object} doctorData - Doctor data to post
 */
async function postDoctor(doctorData) {
    try {
        const { data, error } = await supabase
            .from('doctors')
            .insert([doctorData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting doctor:', error);
        return { success: false, error };
    }
}

/**
 * Post receptionist data to the database
 * @param {Object} receptionistData - Receptionist data to post
 */
async function postReceptionist(receptionistData) {
    try {
        const { data, error } = await supabase
            .from('receptionists')
            .insert([receptionistData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting receptionist:', error);
        return { success: false, error };
    }
}

/**
 * Post profile data to the database
 * @param {Object} profileData - Profile data to post
 */
async function postProfile(profileData) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert([profileData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting profile:', error);
        return { success: false, error };
    }
}

/**
 * Post appointment data to the database
 * @param {Object} appointmentData - Appointment data to post
 */
async function postAppointment(appointmentData) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting appointment:', error);
        return { success: false, error };
    }
}

/**
 * Post medical record data to the database
 * @param {Object} medicalRecordData - Medical record data to post
 */
async function postMedicalRecord(medicalRecordData) {
    try {
        const { data, error } = await supabase
            .from('medical_records')
            .insert([medicalRecordData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting medical record:', error);
        return { success: false, error };
    }
}

/**
 * Post prescription data to the database
 * @param {Object} prescriptionData - Prescription data to post
 */
async function postPrescription(prescriptionData) {
    try {
        const { data, error } = await supabase
            .from('prescriptions')
            .insert([prescriptionData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting prescription:', error);
        return { success: false, error };
    }
}

/**
 * Post prescription item data to the database
 * @param {Object} prescriptionItemData - Prescription item data to post
 */
async function postPrescriptionItem(prescriptionItemData) {
    try {
        const { data, error } = await supabase
            .from('prescription_items')
            .insert([prescriptionItemData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting prescription item:', error);
        return { success: false, error };
    }
}

/**
 * Post department data to the database
 * @param {Object} departmentData - Department data to post
 */
async function postDepartment(departmentData) {
    try {
        const { data, error } = await supabase
            .from('departments')
            .insert([departmentData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting department:', error);
        return { success: false, error };
    }
}

/**
 * Post bedroom data to the database
 * @param {Object} bedroomData - Bedroom data to post
 */
async function postBedroom(bedroomData) {
    try {
        const { data, error } = await supabase
            .from('bedrooms')
            .insert([bedroomData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting bedroom:', error);
        return { success: false, error };
    }
}

/**
 * Post invoice data to the database
 * @param {Object} invoiceData - Invoice data to post
 */
async function postInvoice(invoiceData) {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .insert([invoiceData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting invoice:', error);
        return { success: false, error };
    }
}

/**
 * Post payment data to the database
 * @param {Object} paymentData - Payment data to post
 */
async function postPayment(paymentData) {
    try {
        const { data, error } = await supabase
            .from('payments')
            .insert([paymentData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting payment:', error);
        return { success: false, error };
    }
}

/**
 * Post invoice item data to the database
 * @param {Object} invoiceItemData - Invoice item data to post
 */
async function postInvoiceItem(invoiceItemData) {
    try {
        const { data, error } = await supabase
            .from('invoice_items')
            .insert([invoiceItemData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting invoice item:', error);
        return { success: false, error };
    }
}

/**
 * Post audit log data to the database
 * @param {Object} auditLogData - Audit log data to post
 */
async function postAuditLog(auditLogData) {
    try {
        const { data, error } = await supabase
            .from('audit_logs')
            .insert([auditLogData]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error posting audit log:', error);
        return { success: false, error };
    }
}

// =============================================
// DATA UPDATE FUNCTIONS
// =============================================

/**
 * Update patient data in the database
 * @param {string} patientId - ID of the patient to update
 * @param {Object} updates - Patient data updates
 */
async function updatePatient(patientId, updates) {
    try {
        const { data, error } = await supabase
            .from('patients')
            .update(updates)
            .eq('id', patientId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating patient:', error);
        return { success: false, error };
    }
}

/**
 * Update doctor data in the database
 * @param {string} doctorId - ID of the doctor to update
 * @param {Object} updates - Doctor data updates
 */
async function updateDoctor(doctorId, updates) {
    try {
        const { data, error } = await supabase
            .from('doctors')
            .update(updates)
            .eq('id', doctorId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating doctor:', error);
        return { success: false, error };
    }
}

/**
 * Update receptionist data in the database
 * @param {string} receptionistId - ID of the receptionist to update
 * @param {Object} updates - Receptionist data updates
 */
async function updateReceptionist(receptionistId, updates) {
    try {
        const { data, error } = await supabase
            .from('receptionists')
            .update(updates)
            .eq('id', receptionistId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating receptionist:', error);
        return { success: false, error };
    }
}

/**
 * Update profile data in the database
 * @param {string} profileId - ID of the profile to update
 * @param {Object} updates - Profile data updates
 */
async function updateProfile(profileId, updates) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', profileId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error };
    }
}

/**
 * Update appointment data in the database
 * @param {string} appointmentId - ID of the appointment to update
 * @param {Object} updates - Appointment data updates
 */
async function updateAppointment(appointmentId, updates) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .update(updates)
            .eq('id', appointmentId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating appointment:', error);
        return { success: false, error };
    }
}

/**
 * Update medical record data in the database
 * @param {string} medicalRecordId - ID of the medical record to update
 * @param {Object} updates - Medical record data updates
 */
async function updateMedicalRecord(medicalRecordId, updates) {
    try {
        const { data, error } = await supabase
            .from('medical_records')
            .update(updates)
            .eq('id', medicalRecordId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating medical record:', error);
        return { success: false, error };
    }
}

/**
 * Update prescription data in the database
 * @param {string} prescriptionId - ID of the prescription to update
 * @param {Object} updates - Prescription data updates
 */
async function updatePrescription(prescriptionId, updates) {
    try {
        const { data, error } = await supabase
            .from('prescriptions')
            .update(updates)
            .eq('id', prescriptionId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating prescription:', error);
        return { success: false, error };
    }
}

/**
 * Update department data in the database
 * @param {string} departmentId - ID of the department to update
 * @param {Object} updates - Department data updates
 */
async function updateDepartment(departmentId, updates) {
    try {
        const { data, error } = await supabase
            .from('departments')
            .update(updates)
            .eq('id', departmentId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating department:', error);
        return { success: false, error };
    }
}

/**
 * Update bedroom data in the database
 * @param {string} bedroomId - ID of the bedroom to update
 * @param {Object} updates - Bedroom data updates
 */
async function updateBedroom(bedroomId, updates) {
    try {
        const { data, error } = await supabase
            .from('bedrooms')
            .update(updates)
            .eq('id', bedroomId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating bedroom:', error);
        return { success: false, error };
    }
}

/**
 * Update invoice data in the database
 * @param {string} invoiceId - ID of the invoice to update
 * @param {Object} updates - Invoice data updates
 */
async function updateInvoice(invoiceId, updates) {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .update(updates)
            .eq('id', invoiceId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating invoice:', error);
        return { success: false, error };
    }
}

// =============================================
// DATA DELETION FUNCTIONS
// =============================================

/**
 * Delete a record from the specified table
 * @param {string} table - Table name
 * @param {string} id - ID of the record to delete
 */
async function deleteRecord(table, id) {
    try {
        const { data, error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error(`Error deleting record from ${table}:`, error);
        return { success: false, error };
    }
}

// =============================================
// DASHBOARD STATISTICS FUNCTIONS
// =============================================

/**
 * Get dashboard statistics for the admin dashboard
 */
async function getDashboardStats() {
    try {
        // Get counts from each table
        const [patientsResult, doctorsResult, appointmentsResult, bedroomsResult, departmentsResult, invoicesResult] = await Promise.all([
            supabase.from('patients').select('id', { count: 'exact', head: true }),
            supabase.from('doctors').select('id', { count: 'exact', head: true }),
            supabase.from('appointments').select('id', { count: 'exact', head: true }),
            supabase.from('bedrooms').select('id', { count: 'exact', head: true }),
            supabase.from('departments').select('id', { count: 'exact', head: true }),
            supabase.from('invoices').select('id, total_amount, paid_amount', { count: 'exact' })
        ]);
        
        // Calculate financial statistics
        let totalRevenue = 0;
        let totalPaid = 0;
        let totalPending = 0;
        
        if (invoicesResult.data) {
            totalRevenue = invoicesResult.data.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
            totalPaid = invoicesResult.data.reduce((sum, invoice) => sum + (invoice.paid_amount || 0), 0);
            totalPending = totalRevenue - totalPaid;
        }
        
        return {
            patientCount: patientsResult.count || 0,
            doctorCount: doctorsResult.count || 0,
            appointmentCount: appointmentsResult.count || 0,
            bedroomCount: bedroomsResult.count || 0,
            departmentCount: departmentsResult.count || 0,
            financials: {
                totalRevenue,
                totalPaid,
                totalPending
            }
        };

    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return null;
    }
}

// =============================================
// EXPORT ALL FUNCTIONS
// =============================================

/**
 * Get dashboard statistics from the database
 * This function aggregates data from various tables to provide statistics for the dashboard
 */
async function getDashboardStats() {
    console.log('Getting dashboard statistics from Supabase...');
    try {
        // Get counts from various tables
        const [patients, doctors, appointments, bedrooms, invoices, payments] = await Promise.all([
            extractPatients(),
            extractDoctors(),
            extractAppointments(),
            extractBedrooms(),
            extractInvoices(),
            extractPayments()
        ]);
        
        // Calculate financial statistics
        let totalRevenue = 0;
        let totalPaid = 0;
        let totalPending = 0;
        
        if (invoices && invoices.length > 0) {
            totalRevenue = invoices.reduce((sum, invoice) => sum + (parseFloat(invoice.amount) || 0), 0);
        }
        
        if (payments && payments.length > 0) {
            totalPaid = payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
        }
        
        totalPending = totalRevenue - totalPaid;
        
        // Return dashboard statistics
        return {
            patientCount: patients ? patients.length : 0,
            doctorCount: doctors ? doctors.length : 0,
            appointmentCount: appointments ? appointments.length : 0,
            bedroomCount: bedrooms ? bedrooms.length : 0,
            financials: {
                totalRevenue,
                totalPaid,
                totalPending
            },
            recentPatients: patients ? patients.slice(0, 10) : [],
            recentAppointments: appointments ? appointments.slice(0, 10) : []
        };
    } catch (error) {
        console.error('Error getting dashboard statistics:', error);
        // Return default values in case of error
        return {
            patientCount: 0,
            doctorCount: 0,
            appointmentCount: 0,
            bedroomCount: 0,
            financials: {
                totalRevenue: 0,
                totalPaid: 0,
                totalPending: 0
            },
            recentPatients: [],
            recentAppointments: []
        };
    }
}

// Export all functions for use in the admin dashboard
// Using a unique name to avoid conflicts with existing functions
window.HMSDatabase = {
    // Data extraction functions
    extractAllData,
    extractPatients,
    extractDoctors,
    extractReceptionists,
    extractProfiles,
    extractAppointments,
    db_extractMedicalRecords,
    extractPrescriptions,
    extractDepartments,
    extractBedrooms,
    extractInvoices,
    extractPayments,
    extractInvoiceItems,
    extractAuditLogs,
    
    // Data posting functions
    postPatient,
    postDoctor,
    postReceptionist,
    postProfile,
    postAppointment,
    postMedicalRecord,
    postPrescription,
    postPrescriptionItem,
    postDepartment,
    postBedroom,
    postInvoice,
    postPayment,
    postInvoiceItem,
    postAuditLog,
    
    // Data update functions
    updatePatient,
    updateDoctor,
    updateReceptionist,
    updateProfile,
    updateAppointment,
    updateMedicalRecord,
    updatePrescription,
    updateDepartment,
    updateBedroom,
    updateInvoice,
    
    // Data deletion functions
    deleteRecord,
    
    // Dashboard statistics functions
    getDashboardStats
};

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('HMS Database Integration initialized');
});

// =============================================
// USER MANAGEMENT FUNCTIONS
// =============================================

/**
 * Fetch all doctors from the database
 * @returns {Promise<Array>} Array of doctor profiles
 */
async function fetchDoctors() {
    try {
        // Get doctors with their auth user details
        const { data, error } = await supabase
            .from('doctors')
            .select(`
                id,
                auth.users!inner(email, created_at),
                specialty,
                license_number,
                consultation_fee,
                years_of_experience
            `);
            
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return [];
    }
}

/**
 * Fetch all patients from the database
 * @returns {Promise<Array>} Array of patient profiles
 */
async function fetchPatients() {
    try {
        // Get patients with their auth user details
        const { data, error } = await supabase
            .from('patients')
            .select(`
                id,
                auth.users!inner(email, created_at),
                blood_group,
                height,
                weight,
                allergies,
                medical_conditions
            `);
            
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
}

/**
 * Fetch all receptionists from the database
 * @returns {Promise<Array>} Array of receptionist profiles
 */
async function fetchReceptionists() {
    try {
        // Get receptionists with their auth user details
        const { data, error } = await supabase
            .from('receptionists')
            .select(`
                id,
                auth.users!inner(email, created_at),
                department_id,
                shift_start,
                shift_end
            `);
            
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching receptionists:', error);
        return [];
    }
}

/**
 * Register a new doctor in the system
 * @param {Object} doctorData Doctor registration data
 * @returns {Promise<Object>} Result of the registration
 */
async function registerDoctor(doctorData) {
    try {
        // First, create the auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: doctorData.email,
            password: doctorData.password,
            email_confirm: true
        });
        
        if (authError) throw authError;
        
        // Then create the doctor profile
        const { data, error } = await supabase
            .from('doctors')
            .insert([
                {
                    id: authData.user.id,
                    specialty: doctorData.specialty,
                    license_number: doctorData.licenseNumber,
                    consultation_fee: doctorData.consultationFee,
                    years_of_experience: doctorData.yearsOfExperience
                }
            ]);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error registering doctor:', error);
        return { success: false, error };
    }
}

/**
 * Register a new receptionist in the system
 * @param {Object} receptionistData Receptionist registration data
 * @returns {Promise<Object>} Result of the registration
 */
async function registerReceptionist(receptionistData) {
    try {
        // First, create the auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: receptionistData.email,
            password: receptionistData.password,
            email_confirm: true
        });
        
        if (authError) throw authError;
        
        // Then create the receptionist profile
        const { data, error } = await supabase
            .from('receptionists')
            .insert([
                {
                    id: authData.user.id,
                    department_id: receptionistData.departmentId,
                    shift_start: receptionistData.shiftStart,
                    shift_end: receptionistData.shiftEnd
                }
            ]);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error registering receptionist:', error);
        return { success: false, error };
    }
}

// =============================================
// DEPARTMENT MANAGEMENT FUNCTIONS
// =============================================

/**
 * Fetch all departments from the database
 * @returns {Promise<Array>} Array of departments
 */
async function fetchDepartments() {
    try {
        const { data, error } = await supabase
            .from('departments')
            .select('*');
            
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
    }
}

/**
 * Create a new department
 * @param {Object} departmentData Department data
 * @returns {Promise<Object>} Result of the operation
 */
async function createDepartment(departmentData) {
    try {
        const { data, error } = await supabase
            .from('departments')
            .insert([departmentData]);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error creating department:', error);
        return { success: false, error };
    }
}

/**
 * Update an existing department
 * @param {string} departmentId Department ID
 * @param {Object} updates Department updates
 * @returns {Promise<Object>} Result of the operation
 */
async function updateDepartment(departmentId, updates) {
    try {
        const { data, error } = await supabase
            .from('departments')
            .update(updates)
            .eq('id', departmentId);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error updating department:', error);
        return { success: false, error };
    }
}

// =============================================
// APPOINTMENT MANAGEMENT FUNCTIONS
// =============================================

/**
 * Fetch all appointments with patient and doctor details
 * @returns {Promise<Array>} Array of appointments
 */
async function fetchAppointments() {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id,
                patient_id,
                doctor_id,
                appointment_date,
                end_time,
                status,
                reason,
                notes,
                created_at,
                updated_at
            `)
            .order('appointment_date', { ascending: false });
            
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}

/**
 * Create a new appointment
 * @param {Object} appointmentData Appointment data
 * @returns {Promise<Object>} Result of the operation
 */
async function createAppointment(appointmentData) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData]);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error creating appointment:', error);
        return { success: false, error };
    }
}

/**
 * Update an existing appointment
 * @param {string} appointmentId Appointment ID
 * @param {Object} updates Appointment updates
 * @returns {Promise<Object>} Result of the operation
 */
async function updateAppointment(appointmentId, updates) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .update(updates)
            .eq('id', appointmentId);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error updating appointment:', error);
        return { success: false, error };
    }
}

// =============================================
// MEDICAL RECORDS FUNCTIONS
// =============================================

/**
 * Fetch medical records with patient and doctor details
 * @returns {Promise<Array>} Array of medical records
 */
async function fetchMedicalRecords() {
    try {
        const { data, error } = await supabase
            .from('medical_records')
            .select(`
                id,
                patient_id,
                doctor_id,
                visit_date,
                diagnosis,
                symptoms,
                treatment,
                prescription,
                notes,
                follow_up_date,
                created_at,
                updated_at
            `)
            .order('visit_date', { ascending: false });
            
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching medical records:', error);
        return [];
    }
}

// =============================================
// INVOICE AND PAYMENT FUNCTIONS
// =============================================

/**
 * Fetch all invoices with patient details
 * @returns {Promise<Array>} Array of invoices
 */
async function fetchInvoices() {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .select(`
                id,
                invoice_number,
                patient_id,
                invoice_date,
                due_date,
                total_amount,
                paid_amount,
                status,
                notes,
                created_at,
                updated_at
            `)
            .order('invoice_date', { ascending: false });
            
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return [];
    }
}

/**
 * Create a new invoice
 * @param {Object} invoiceData Invoice data
 * @returns {Promise<Object>} Result of the operation
 */
async function createInvoice(invoiceData) {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .insert([invoiceData]);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error creating invoice:', error);
        return { success: false, error };
    }
}

/**
 * Fetch all payments with invoice details
 * @returns {Promise<Array>} Array of payments
 */
async function fetchPayments() {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select(`
                id,
                invoice_id,
                payment_number,
                amount,
                payment_date,
                payment_method,
                transaction_id,
                notes,
                created_at,
                updated_at
            `)
            .order('payment_date', { ascending: false });
            
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching payments:', error);
        return [];
    }
}

/**
 * Record a new payment
 * @param {Object} paymentData Payment data
 * @returns {Promise<Object>} Result of the operation
 */
async function recordPayment(paymentData) {
    try {
        const { data, error } = await supabase
            .from('payments')
            .insert([paymentData]);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error recording payment:', error);
        return { success: false, error };
    }
}

// =============================================
// BEDROOM MANAGEMENT FUNCTIONS
// =============================================

/**
 * Fetch all bedrooms with department details
 * @returns {Promise<Array>} Array of bedrooms
 */
async function fetchBedrooms() {
    try {
        const { data, error } = await supabase
            .from('bedrooms')
            .select(`
                id,
                room_number,
                room_type,
                floor,
                is_occupied,
                patient_id,
                department_id,
                daily_rate,
                amenities,
                max_capacity,
                current_occupancy,
                status,
                last_maintenance_date,
                created_at,
                updated_at
            `);
            
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching bedrooms:', error);
        return [];
    }
}

/**
 * Create a new bedroom
 * @param {Object} bedroomData Bedroom data
 * @returns {Promise<Object>} Result of the operation
 */
async function createBedroom(bedroomData) {
    try {
        const { data, error } = await supabase
            .from('bedrooms')
            .insert([bedroomData]);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error creating bedroom:', error);
        return { success: false, error };
    }
}

/**
 * Update an existing bedroom
 * @param {string} bedroomId Bedroom ID
 * @param {Object} updates Bedroom updates
 * @returns {Promise<Object>} Result of the operation
 */
async function updateBedroom(bedroomId, updates) {
    try {
        const { data, error } = await supabase
            .from('bedrooms')
            .update(updates)
            .eq('id', bedroomId);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error updating bedroom:', error);
        return { success: false, error };
    }
}

// =============================================
// AUDIT LOGS FUNCTIONS
// =============================================

/**
 * Fetch audit logs for the admin dashboard
 * @returns {Promise<Array>} Array of audit logs
 */
async function fetchAuditLogs() {
    try {
        const { data, error } = await supabase
            .from('audit_logs')
            .select(`
                id,
                user_id,
                action,
                table_name,
                record_id,
                old_data,
                new_data,
                ip_address,
                user_agent,
                created_at
            `)
            .order('created_at', { ascending: false })
            .limit(100);
            
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        return [];
    }
}

// =============================================
// INITIALIZATION AND EVENT LISTENERS
// =============================================

// Initialize the admin dashboard with data from Supabase
function initializeAdminDashboard() {
    // Fetch initial data
    if (typeof window.fetchDashboardStats === 'function') {
        window.fetchDashboardStats();
    } else if (typeof fetchDashboardStats === 'function') {
        fetchDashboardStats();
    } else {
        console.error('fetchDashboardStats function not found');
    }
    
    // Set up event listeners for the admin dashboard
    setupEventListeners();
    
    // Initialize the HMS Database
    initHMSDatabase();
}

// Initialize the HMS Database integration
function initHMSDatabase() {
    console.log('HMS Database Integration initialized');
    console.log('Available HMS Database functions:', Object.keys(window.HMSDatabase));
    // Set up real-time subscriptions
    setupRealtimeSubscriptions();
}

// Set up event listeners for the admin dashboard
function setupEventListeners() {
    console.log('Setting up event listeners for admin dashboard...');
    // Add event listeners for forms and buttons here
    // This is just a placeholder - actual event listeners will be added as needed
    
    // Doctor form event listener (if it exists)
    // The doctor form is now handled in admin-dashboard.js
    const doctorForm = document.getElementById('add-doctor-form');
    if (doctorForm && !window.doctorFormHandled) {
        // Mark the form as handled to prevent duplicate event handlers
        window.doctorFormHandled = true;
        console.log('Doctor form found in admin-supabase-integration.js');
        
        // We'll only handle this if we're not on the dashboard page
        if (!window.location.pathname.includes('/dashboard.html')) {
            doctorForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('Doctor form submitted in admin-supabase-integration.js');
                
                // Use optional chaining to prevent null reference errors
                const doctorData = {
                    email: document.getElementById('doctor_email')?.value || document.getElementById('email')?.value || '',
                    password: document.getElementById('password')?.value || '',
                    specialty: document.getElementById('specialty')?.value || '',
                    licenseNumber: document.getElementById('license_number')?.value || ''
                };
                
                const result = await registerDoctor(doctorData);
                
                if (result.success) {
                    alert('Doctor registered successfully!');
                    doctorForm.reset();
                } else {
                    alert(`Error registering doctor: ${result.error.message}`);
                }
            });
        }
    }
    
    // Receptionist registration form
    const receptionistForm = document.getElementById('add-receptionist-form');
    if (receptionistForm) {
        receptionistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const receptionistData = {
                email: document.getElementById('receptionist-email').value,
                password: document.getElementById('receptionist-password').value,
                departmentId: document.getElementById('receptionist-department').value,
                shiftStart: document.getElementById('receptionist-shift-start').value,
                shiftEnd: document.getElementById('receptionist-shift-end').value
            };
            
            const result = await registerReceptionist(receptionistData);
            
            if (result.success) {
                alert('Receptionist registered successfully!');
                receptionistForm.reset();
            } else {
                alert(`Error registering receptionist: ${result.error.message}`);
            }
        });
    }
}

// Set up real-time subscriptions for the admin dashboard
function setupRealtimeSubscriptions() {
    // Subscribe to appointments changes
    const appointmentsSubscription = supabase
        .channel('public:appointments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, payload => {
            console.log('Appointments change received:', payload);
            // Refresh appointments data
            window.HMSDatabase.getDashboardStats();
        })
        .subscribe();
        
    // Subscribe to patients changes
    const patientsSubscription = supabase
        .channel('public:patients')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, payload => {
            console.log('Patients change received:', payload);
            // Refresh patients data
            window.HMSDatabase.getDashboardStats();
        })
        .subscribe();
        
    // Subscribe to invoices changes
    const invoicesSubscription = supabase
        .channel('public:invoices')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, payload => {
            console.log('Invoices change received:', payload);
            // Refresh financial data
            window.HMSDatabase.getDashboardStats();
        })
        .subscribe();
}

// Export all functions for use in the admin dashboard
window.AdminSupabaseService = {
    // Dashboard functions
    fetchDashboardStats: window.fetchDashboardStats || function() {
        console.log('Using fallback fetchDashboardStats');
        return Promise.resolve();
    },
    
    // User management
    fetchDoctors,
    fetchPatients,
    fetchReceptionists,
    registerDoctor,
    registerReceptionist,
    
    // Department management
    fetchDepartments,
    createDepartment,
    updateDepartment,
    
    // Appointment management
    fetchAppointments,
    createAppointment,
    updateAppointment,
    
    // Medical records
    fetchMedicalRecords,
    
    // Financial management
    fetchInvoices,
    createInvoice,
    fetchPayments,
    recordPayment,
    
    // Bedroom management
    fetchBedrooms,
    createBedroom,
    updateBedroom,
    
    // Audit logs
    fetchAuditLogs,
    
    // Initialization
    initializeAdminDashboard
};

// Initialize the admin dashboard when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the admin dashboard
    window.AdminSupabaseService.initializeAdminDashboard();
});
