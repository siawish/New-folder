// User Tabs Management
// This file handles the tab system for active and pending doctors, patients, and receptionists

// Use a self-executing function to create a module scope and prevent global namespace pollution
(function() {
// Check if we've already initialized this module to prevent duplicate declarations
if (window.doctorTabsInitialized) {
    return; // Already initialized, don't redefine functions
}
window.doctorTabsInitialized = true;

/**
 * PENDING DOCTORS LOGIC EXPLANATION:
 * 
 * Pending doctors are doctors who have been added to the system but are not yet fully registered in Supabase.
 * They are stored in localStorage with the key 'pendingDoctors' until they are fully registered.
 * 
 * The different statuses for pending doctors are:
 * 
 * 1. offline_pending: Doctor information has been collected but not yet submitted to Supabase
 * 2. pending_invitation: Doctor has been added to the system and is waiting for an invitation email
 * 3. pending_manual_invitation: System failed to send an automatic invitation, requires manual invitation
 * 4. auth_created_only: Auth record created in Supabase but profile record failed to create
 * 5. invited: Doctor has been invited but has not yet completed registration
 * 
 * Once a doctor completes registration or is manually verified by an admin, they are moved from
 * the pendingDoctors list to the active doctors list in Supabase.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Set up doctor tabs
    setupDoctorTabs();
    setupPendingDoctorsTable();
    
    // Create and set up patient tabs
    createPatientTabsStructure();
    setupPatientTabs();
    setupPendingPatientsTable();
    
    // Create and set up receptionist tabs
    createReceptionistTabsStructure();
    setupReceptionistTabs();
    setupPendingReceptionistsTable();
});

// Create the patient tabs structure dynamically
const createPatientTabsStructure = () => {
    const patientsContent = document.getElementById('patients-content');
    if (!patientsContent) {
        console.error('Patients content section not found');
        return;
    }
    
    // Get the existing content
    const existingContent = patientsContent.innerHTML;
    
    // Create the new structure with tabs
    const newContent = `
        <div class="bg-white shadow rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-800">Patients Management</h2>
                <button id="add-patient-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <i class="fas fa-plus mr-2"></i> Add Patient
                </button>
            </div>
            
            <!-- Patient Tabs -->
            <div class="flex justify-between items-center mb-4">
                <div class="border-b border-gray-200">
                    <ul class="flex flex-wrap -mb-px" id="patient-tabs">
                        <li class="mr-2">
                            <button id="active-patients-tab" class="inline-block py-2 px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active" aria-current="page">
                                Active Patients
                            </button>
                        </li>
                        <li class="mr-2">
                            <button id="pending-patients-tab" class="inline-block py-2 px-4 text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg border-b-2 border-transparent">
                                Pending Patients
                                <span id="pending-patients-count" class="ml-1 h-2 w-2 rounded-full bg-blue-500 animate-pulse inline-block align-middle hidden"></span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            
            <!-- Active Patients Content -->
            <div id="active-patients-content" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="patients-table-body" class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                                <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                Loading active patients...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Pending Patients Content -->
            <div id="pending-patients-content" class="overflow-x-auto hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="pending-patients-table-body" class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                                <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                Loading pending patients...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Replace the content
    patientsContent.innerHTML = newContent;
    
    // Use only the strategy pattern for patient registration
    const addPatientBtn = document.getElementById('add-patient-btn');
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', function() {
            console.log('Add Patient button clicked - using strategy pattern');
            
            // Use the patient registration strategy pattern
            if (typeof initDashboard !== 'undefined' && typeof initDashboard.showPatientRegistrationModal === 'function') {
                // Use the strategy pattern from admin-dashboard.js
                initDashboard.showPatientRegistrationModal();
            } else {
                console.error('Patient registration strategy not available');
                alert('Patient registration is not available at this time.');
            }
        });
    }
    
    console.log('Patient tabs structure created dynamically');
    
    // Load the active patients data immediately
    loadActivePatients();
};

// Create the receptionist tabs structure dynamically
const createReceptionistTabsStructure = () => {
    const receptionistsContent = document.getElementById('receptionists-content');
    if (!receptionistsContent) {
        console.error('Receptionists content section not found');
        return;
    }
    
    // Get the existing content
    const existingContent = receptionistsContent.innerHTML;
    
    // Create the new structure with tabs
    const newContent = `
        <div class="bg-white shadow rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-800">Receptionists Management</h2>
                <button id="add-receptionist-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <i class="fas fa-plus mr-2"></i> Add Receptionist
                </button>
            </div>
            
            <!-- Receptionist Tabs -->
            <div class="flex justify-between items-center mb-4">
                <div class="border-b border-gray-200">
                    <ul class="flex flex-wrap -mb-px" id="receptionist-tabs">
                        <li class="mr-2">
                            <button id="active-receptionists-tab" class="inline-block py-2 px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active" aria-current="page">
                                Active Receptionists
                            </button>
                        </li>
                        <li class="mr-2">
                            <button id="pending-receptionists-tab" class="inline-block py-2 px-4 text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg border-b-2 border-transparent">
                                Pending Receptionists
                                <span id="pending-receptionists-count" class="ml-1 h-2 w-2 rounded-full bg-blue-500 animate-pulse inline-block align-middle hidden"></span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            
            <!-- Active Receptionists Content -->
            <div id="active-receptionists-content" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="receptionists-table-body" class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                                <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                Loading active receptionists...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Pending Receptionists Content -->
            <div id="pending-receptionists-content" class="overflow-x-auto hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="pending-receptionists-table-body" class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                                <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                Loading pending receptionists...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Replace the content
    receptionistsContent.innerHTML = newContent;
    
    // Use the strategy pattern for receptionist registration
    const addReceptionistBtn = document.getElementById('add-receptionist-btn');
    if (addReceptionistBtn) {
        addReceptionistBtn.addEventListener('click', function() {
            console.log('Add Receptionist button clicked - using strategy pattern');
            
            // Use the receptionist registration strategy pattern
            if (typeof initDashboard !== 'undefined' && typeof initDashboard.showReceptionistRegistrationModal === 'function') {
                // Use the strategy pattern from admin-dashboard.js
                initDashboard.showReceptionistRegistrationModal();
            } else {
                console.error('Receptionist registration strategy not available');
                alert('Receptionist registration is not available at this time.');
            }
        });
    }
    
    console.log('Receptionist tabs structure created dynamically');
    
    // Load the active receptionists data immediately
    loadActiveReceptionists();
};

// Load active patients from the profiles table
const loadActivePatients = async () => {
    const patientsTableBody = document.getElementById('patients-table-body');
    if (!patientsTableBody) {
        console.warn('Active patients table body not found');
        return;
    }
    
    try {
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                console.error('Admin client not available. Cannot fetch patients.');
                patientsTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-4 py-3 text-center text-red-500">
                            Error: Admin client not available. Cannot fetch patients.
                        </td>
                    </tr>
                `;
                return;
            }
        }
        
        // Get all users from Supabase auth to check verification status
        const { data: authUsers, error: authError } = await window.supabaseAdmin.auth.admin.listUsers();
        
        if (authError) {
            console.error('Error fetching auth users:', authError);
            patientsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-red-500">
                        Error fetching users: ${authError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Create a map of verified users by ID
        const verifiedUsersMap = {};
        authUsers.users.forEach(user => {
            // Consider a user verified if email is confirmed
            if (user.email_confirmed_at) {
                verifiedUsersMap[user.id] = user;
            }
        });
        
        // Get all patient profiles from the profiles table
        const { data: profilesData, error: profilesError } = await window.supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('role', 'patient');
            
        if (profilesError) {
            console.error('Error fetching patient profiles:', profilesError);
            patientsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-red-500">
                        Error fetching patient profiles: ${profilesError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Filter for verified patients only - using email_verified field from profiles table
        const activePatients = profilesData.filter(profile => {
            // Only include patients where email_verified is true in the profiles table
            return profile.email_verified === true;
        });
        
        // If no active patients, show empty state
        if (activePatients.length === 0) {
            patientsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                        No active patients found.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Build the table rows
        let tableHtml = '';
        
        for (const patient of activePatients) {
            const patientId = patient.id;
            const patientEmail = patient.email || 'No email';
            const patientName = `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown';
            const patientPhone = patient.phone || 'No phone';
            
            // Determine status
            let status = 'Active';
            let statusClass = 'bg-green-100 text-green-800';
            
            tableHtml += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patientName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patientEmail}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patientPhone}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                            ${status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                            onclick="viewPatientDetails('${patientId}')"
                            class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button 
                            onclick="editPatient('${patientId}')"
                            class="text-green-600 hover:text-green-900 mr-3">Edit</button>
                        <button 
                            onclick="deletePatient('${patientId}', '${patientEmail}')"
                            class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                </tr>
            `;
        }
        
        patientsTableBody.innerHTML = tableHtml;
        
    } catch (error) {
        console.error('Error in loadActivePatients:', error);
        patientsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-3 text-center text-red-500">
                    Error: ${error.message || 'Unknown error'}
                </td>
            </tr>
        `;
    }
};

// Load active doctors from the profiles table
const loadActiveDoctors = async () => {
    const doctorsTableBody = document.getElementById('doctors-table-body');
    if (!doctorsTableBody) {
        console.warn('Active doctors table body not found');
        return;
    }
    
    try {
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                console.error('Admin client not available. Cannot fetch doctors.');
                doctorsTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-4 py-3 text-center text-red-500">
                            Error: Admin client not available. Cannot fetch doctors.
                        </td>
                    </tr>
                `;
                return;
            }
        }
        
        // Get all users from Supabase auth to check verification status
        const { data: authUsers, error: authError } = await window.supabaseAdmin.auth.admin.listUsers();
        
        if (authError) {
            console.error('Error fetching auth users:', authError);
            doctorsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-3 text-center text-red-500">
                        Error fetching users: ${authError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Create a map of verified users by ID
        const verifiedUsersMap = {};
        authUsers.users.forEach(user => {
            // Consider a user verified if email is confirmed
            if (user.email_confirmed_at) {
                verifiedUsersMap[user.id] = user;
            }
        });
        
        // Get all doctor profiles from the profiles table
        const { data: profilesData, error: profilesError } = await window.supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('role', 'doctor');
            
        if (profilesError) {
            console.error('Error fetching doctor profiles:', profilesError);
            doctorsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-3 text-center text-red-500">
                        Error fetching doctor profiles: ${profilesError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Get departments for doctors
        const { data: departmentsData, error: departmentsError } = await window.supabaseAdmin
            .from('departments')
            .select('*');
            
        if (departmentsError) {
            console.error('Error fetching departments:', departmentsError);
        }
        
        // Create a map of departments by ID
        const departmentsMap = {};
        if (departmentsData) {
            departmentsData.forEach(dept => {
                departmentsMap[dept.id] = dept.name;
            });
        }
        
        // Filter for verified doctors only
        const activeDoctors = profilesData.filter(profile => {
            return verifiedUsersMap[profile.id] !== undefined;
        });
        
        // If no active doctors, show empty state
        if (activeDoctors.length === 0) {
            doctorsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-3 text-center text-gray-500">
                        No active doctors found.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Build the table rows
        let tableHtml = '';
        
        for (const doctor of activeDoctors) {
            const doctorId = doctor.id;
            const doctorEmail = doctor.email || 'No email';
            const doctorName = `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() || 'Unknown';
            const doctorPhone = doctor.phone || 'No phone';
            const doctorSpecialization = doctor.specialization || 'Not specified';
            const departmentId = doctor.department_id;
            const departmentName = departmentId ? (departmentsMap[departmentId] || 'Unknown') : 'Not assigned';
            
            // Determine status
            let status = 'Active';
            let statusClass = 'bg-green-100 text-green-800';
            
            tableHtml += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctorName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${doctorEmail}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${doctorPhone}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${doctorSpecialization}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${departmentName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                            onclick="viewDoctorDetails('${doctorId}')"
                            class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button 
                            onclick="editDoctor('${doctorId}')"
                            class="text-green-600 hover:text-green-900 mr-3">Edit</button>
                        <button 
                            onclick="deleteDoctor('${doctorId}', '${doctorEmail}')"
                            class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                </tr>
            `;
        }
        
        doctorsTableBody.innerHTML = tableHtml;
        
    } catch (error) {
        console.error('Error in loadActiveDoctors:', error);
        doctorsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-3 text-center text-red-500">
                    Error: ${error.message || 'Unknown error'}
                </td>
            </tr>
        `;
    }
};

// Load active receptionists from the profiles table
const loadActiveReceptionists = async () => {
    const receptionistsTableBody = document.getElementById('receptionists-table-body');
    if (!receptionistsTableBody) {
        console.warn('Active receptionists table body not found');
        return;
    }
    
    try {
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                console.error('Admin client not available. Cannot fetch receptionists.');
                receptionistsTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-4 py-3 text-center text-red-500">
                            Error: Admin client not available. Cannot fetch receptionists.
                        </td>
                    </tr>
                `;
                return;
            }
        }
        
        // Get all users from Supabase auth to check verification status
        const { data: authUsers, error: authError } = await window.supabaseAdmin.auth.admin.listUsers();
        
        if (authError) {
            console.error('Error fetching auth users:', authError);
            receptionistsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-red-500">
                        Error fetching users: ${authError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Create a map of verified users by ID
        const verifiedUsersMap = {};
        authUsers.users.forEach(user => {
            // Consider a user verified if email is confirmed
            if (user.email_confirmed_at) {
                verifiedUsersMap[user.id] = user;
            }
        });
        
        // Get all receptionist profiles from the profiles table
        const { data: profilesData, error: profilesError } = await window.supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('role', 'receptionist');
            
        if (profilesError) {
            console.error('Error fetching receptionist profiles:', profilesError);
            receptionistsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-red-500">
                        Error fetching receptionist profiles: ${profilesError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Filter for verified receptionists only
        const activeReceptionists = profilesData.filter(profile => {
            return verifiedUsersMap[profile.id] !== undefined;
        });
        
        // If no active receptionists, show empty state
        if (activeReceptionists.length === 0) {
            receptionistsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                        No active receptionists found.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Build the table rows
        let tableHtml = '';
        
        for (const receptionist of activeReceptionists) {
            const receptionistId = receptionist.id;
            const receptionistEmail = receptionist.email || 'No email';
            const receptionistName = `${receptionist.first_name || ''} ${receptionist.last_name || ''}`.trim() || 'Unknown';
            const receptionistPhone = receptionist.phone || 'No phone';
            
            // Determine status
            let status = 'Active';
            let statusClass = 'bg-green-100 text-green-800';
            
            tableHtml += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${receptionistName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${receptionistEmail}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${receptionistPhone}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                            ${status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                            onclick="viewReceptionistDetails('${receptionistId}')"
                            class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button 
                            onclick="editReceptionist('${receptionistId}')"
                            class="text-green-600 hover:text-green-900 mr-3">Edit</button>
                        <button 
                            onclick="deleteReceptionist('${receptionistId}', '${receptionistEmail}')"
                            class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                </tr>
            `;
        }
        
        receptionistsTableBody.innerHTML = tableHtml;
        
    } catch (error) {
        console.error('Error in loadActiveReceptionists:', error);
        receptionistsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-3 text-center text-red-500">
                    Error: ${error.message || 'Unknown error'}
                </td>
            </tr>
        `;
    }
};

// This function is defined below

// This function is defined below

// Set up the doctor tabs functionality
const setupDoctorTabs = () => {
    const activeDoctorsTab = document.getElementById('active-doctors-tab');
    const pendingDoctorsTab = document.getElementById('pending-doctors-tab');
    const activeDoctorsContent = document.getElementById('active-doctors-content');
    const pendingDoctorsContent = document.getElementById('pending-doctors-content');
    
    if (!activeDoctorsTab || !pendingDoctorsTab || !activeDoctorsContent || !pendingDoctorsContent) {
        console.log('Doctor tabs elements not found');
        return;
    }
    
    console.log('Setting up doctor tabs...');
    
    // Switch to active doctors tab
    activeDoctorsTab.addEventListener('click', () => {
        // Update tab styles
        activeDoctorsTab.classList.add('text-blue-600', 'border-blue-600');
        activeDoctorsTab.classList.remove('text-gray-500', 'border-transparent');
        pendingDoctorsTab.classList.add('text-gray-500', 'border-transparent');
        pendingDoctorsTab.classList.remove('text-blue-600', 'border-blue-600');
        
        // Show/hide content
        activeDoctorsContent.classList.remove('hidden');
        pendingDoctorsContent.classList.add('hidden');
        
        // Refresh active doctors table
        loadActiveDoctors();
    });
    
    // Switch to pending doctors tab
    pendingDoctorsTab.addEventListener('click', () => {
        // Update tab styles
        pendingDoctorsTab.classList.add('text-blue-600', 'border-blue-600');
        pendingDoctorsTab.classList.remove('text-gray-500', 'border-transparent');
        activeDoctorsTab.classList.add('text-gray-500', 'border-transparent');
        activeDoctorsTab.classList.remove('text-blue-600', 'border-blue-600');
        
        // Show/hide content
        pendingDoctorsContent.classList.remove('hidden');
        activeDoctorsContent.classList.add('hidden');
        
        // Refresh pending doctors table
        refreshPendingDoctorsTable();
    });
    
    // Update pending doctors count badge
    updatePendingDoctorsCount();
    
    // Load active doctors data immediately
    loadActiveDoctors();
};

// This is the main implementation of setupPendingDoctorsTable
// It's called from the DOMContentLoaded event handler at the top of the file
const setupPendingDoctorsTable = () => {
    // Initial population of the table
    refreshPendingDoctorsTable();
    
    // Set up a timer to periodically refresh the count
    setInterval(updatePendingDoctorsCount, 5000);
};

// Function to update the pending doctors count badge
const updatePendingDoctorsCount = async () => {
    const pendingDoctorsCountBadge = document.getElementById('pending-doctors-count');
    if (!pendingDoctorsCountBadge) {
        console.warn('Pending doctors count badge not found');
        return;
    }
    
    try {
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                console.error('Admin client not available. Cannot fetch doctors.');
                return;
            }
        }
        
        // Get all users from Supabase auth
        const { data: authUsers, error: authError } = await window.supabaseAdmin.auth.admin.listUsers();
        
        if (authError) {
            console.error('Error fetching auth users:', authError);
            return;
        }
        
        // Create a map of unverified users by ID
        const unverifiedUsersMap = {};
        authUsers.users.forEach(user => {
            // Consider a user unverified if email is not confirmed
            if (!user.email_confirmed_at) {
                unverifiedUsersMap[user.id] = user;
            }
        });
        
        // Get all doctor profiles from the profiles table
        const { data: profilesData, error: profilesError } = await window.supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('role', 'doctor');
            
        if (profilesError) {
            console.error('Error fetching doctor profiles:', profilesError);
            return;
        }
        
        // Filter for unverified doctors only
        const pendingDoctors = profilesData.filter(profile => {
            return unverifiedUsersMap[profile.id] !== undefined;
        });
        
        // Update the badge visibility based on pending count
        if (pendingDoctors.length > 0) {
            pendingDoctorsCountBadge.classList.remove('hidden');
            
            // Also update the sidebar notification if it exists
            const sidebarDoctorNotification = document.querySelector('.sidebar-item[href="#doctors"] .notification-dot');
            if (sidebarDoctorNotification) {
                sidebarDoctorNotification.classList.remove('hidden');
            }
        } else {
            pendingDoctorsCountBadge.classList.add('hidden');
            
            // Also update the sidebar notification if it exists
            const sidebarDoctorNotification = document.querySelector('.sidebar-item[href="#doctors"] .notification-dot');
            if (sidebarDoctorNotification) {
                sidebarDoctorNotification.classList.add('hidden');
            }
        }
    } catch (error) {
        console.error('Error in updatePendingDoctorsCount:', error);
    }
};

// Set up the patient tabs functionality
const setupPatientTabs = () => {
    const activePatientsTab = document.getElementById('active-patients-tab');
    const pendingPatientsTab = document.getElementById('pending-patients-tab');
    const activePatientsContent = document.getElementById('active-patients-content');
    const pendingPatientsContent = document.getElementById('pending-patients-content');
    
    if (!activePatientsTab || !pendingPatientsTab || !activePatientsContent || !pendingPatientsContent) {
        console.log('Patient tabs elements not found, will be initialized dynamically');
        return;
    }
    
    console.log('Setting up patient tabs...');
    
    // Switch to active patients tab
    activePatientsTab.addEventListener('click', () => {
        // Update tab styles
        activePatientsTab.classList.add('text-blue-600', 'border-blue-600');
        activePatientsTab.classList.remove('text-gray-500', 'border-transparent');
        pendingPatientsTab.classList.add('text-gray-500', 'border-transparent');
        pendingPatientsTab.classList.remove('text-blue-600', 'border-blue-600');
        
        // Show/hide content
        activePatientsContent.classList.remove('hidden');
        pendingPatientsContent.classList.add('hidden');
    });
    
    // Switch to pending patients tab
    pendingPatientsTab.addEventListener('click', () => {
        // Update tab styles
        pendingPatientsTab.classList.add('text-blue-600', 'border-blue-600');
        pendingPatientsTab.classList.remove('text-gray-500', 'border-transparent');
        activePatientsTab.classList.add('text-gray-500', 'border-transparent');
        activePatientsTab.classList.remove('text-blue-600', 'border-blue-600');
        
        // Show/hide content
        pendingPatientsContent.classList.remove('hidden');
        activePatientsContent.classList.add('hidden');
        
        // Refresh pending patients table
        refreshPendingPatientsTable();
    });
    
    // Update pending patients count badge
    updatePendingPatientsCount();
};

// Set up the pending patients table
const setupPendingPatientsTable = () => {
    // Initial population of the table
    refreshPendingPatientsTable();
};

// Set up the receptionist tabs functionality
const setupReceptionistTabs = () => {
    const activeReceptionistsTab = document.getElementById('active-receptionists-tab');
    const pendingReceptionistsTab = document.getElementById('pending-receptionists-tab');
    const activeReceptionistsContent = document.getElementById('active-receptionists-content');
    const pendingReceptionistsContent = document.getElementById('pending-receptionists-content');
    
    if (!activeReceptionistsTab || !pendingReceptionistsTab || !activeReceptionistsContent || !pendingReceptionistsContent) {
        console.log('Receptionist tabs elements not found, will be initialized dynamically');
        return;
    }
    
    console.log('Setting up receptionist tabs...');
    
    // Switch to active receptionists tab
    activeReceptionistsTab.addEventListener('click', () => {
        // Update tab styles
        activeReceptionistsTab.classList.add('text-blue-600', 'border-blue-600');
        activeReceptionistsTab.classList.remove('text-gray-500', 'border-transparent');
        pendingReceptionistsTab.classList.add('text-gray-500', 'border-transparent');
        pendingReceptionistsTab.classList.remove('text-blue-600', 'border-blue-600');
        
        // Show/hide content
        activeReceptionistsContent.classList.remove('hidden');
        pendingReceptionistsContent.classList.add('hidden');
    });
    
    // Switch to pending receptionists tab
    pendingReceptionistsTab.addEventListener('click', () => {
        // Update tab styles
        pendingReceptionistsTab.classList.add('text-blue-600', 'border-blue-600');
        pendingReceptionistsTab.classList.remove('text-gray-500', 'border-transparent');
        activeReceptionistsTab.classList.add('text-gray-500', 'border-transparent');
        activeReceptionistsTab.classList.remove('text-blue-600', 'border-blue-600');
        
        // Show/hide content
        pendingReceptionistsContent.classList.remove('hidden');
        activeReceptionistsContent.classList.add('hidden');
        
        // Refresh pending receptionists table
        refreshPendingReceptionistsTable();
    });
    
    // Update pending receptionists count badge
    updatePendingReceptionistsCount();
};

// Set up the pending receptionists table
const setupPendingReceptionistsTable = () => {
    // Initial population of the table
    refreshPendingReceptionistsTable();
};

// Refresh the pending doctors table with data from both localStorage and unverified doctors in Supabase
const refreshPendingDoctorsTable = async () => {
    const pendingDoctorsTableBody = document.getElementById('pending-doctors-table-body');
    if (!pendingDoctorsTableBody) {
        console.error('Pending doctors table body not found');
        return;
    }
    
    // Show loading state
    pendingDoctorsTableBody.innerHTML = `
        <tr>
            <td colspan="6" class="px-4 py-3 text-center text-gray-500">
                <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Loading pending doctors...
            </td>
        </tr>
    `;
    
    // Get pending doctors from localStorage
    const localPendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
    
    // Fetch unverified doctors from Supabase
    let unverifiedDoctors = [];
    try {
        const { data: doctors, error } = await supabaseClient
            .from('doctors')
            .select('id, specialization, license_number, qualification, experience_years, consultation_fee, department, profiles (id, first_name, last_name, email, phone, department, email_verified)');
            
        if (!error && doctors) {
            // Filter for doctors whose email is not verified
            unverifiedDoctors = doctors.filter(doctor => 
                doctor.profiles && doctor.profiles.email_verified === false
            ).map(doctor => ({
                id: doctor.id,
                first_name: doctor.profiles.first_name,
                last_name: doctor.profiles.last_name,
                email: doctor.profiles.email,
                phone: doctor.profiles.phone,
                specialization: doctor.specialization,
                department: doctor.department || doctor.profiles.department,
                status: 'email_unverified'
            }));
        }
    } catch (error) {
        console.error('Error fetching unverified doctors:', error);
    }
    
    // Combine both sources of pending doctors
    const pendingDoctors = [...localPendingDoctors, ...unverifiedDoctors];
    
    // Clear the table
    pendingDoctorsTableBody.innerHTML = '';
    
    if (pendingDoctors.length === 0) {
        // No pending doctors
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="6" class="px-4 py-3 text-center text-gray-500">
                No pending doctors found
            </td>
        `;
        pendingDoctorsTableBody.appendChild(tr);
        return;
    }
    
    // Add each pending doctor to the table
    pendingDoctors.forEach(doctor => {
        const tr = document.createElement('tr');
        tr.classList.add('border-b', 'hover:bg-gray-50', 'bg-yellow-50');
        
        // Get status display
        let statusDisplay = '';
        switch(doctor.status) {
            case 'offline_pending':
                statusDisplay = '<span class="inline-block px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">Offline Pending</span>';
                break;
            case 'pending_invitation':
                statusDisplay = '<span class="inline-block px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pending Invitation</span>';
                break;
            case 'pending_manual_invitation':
                statusDisplay = '<span class="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">Manual Invitation</span>';
                break;
            case 'auth_created_only':
                statusDisplay = '<span class="inline-block px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">Auth Created</span>';
                break;
            case 'invited':
                statusDisplay = '<span class="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Invited</span>';
                break;
            case 'email_unverified':
                statusDisplay = '<span class="inline-block px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Email Unverified</span>';
                break;
            default:
                statusDisplay = '<span class="inline-block px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">Unknown</span>';
        }
        
        tr.innerHTML = `
            <td class="px-4 py-3">${doctor.first_name} ${doctor.last_name}</td>
            <td class="px-4 py-3">${doctor.email}</td>
            <td class="px-4 py-3">${doctor.phone || '-'}</td>
            <td class="px-4 py-3">${doctor.specialization || '-'}</td>
            <td class="px-4 py-3">${statusDisplay}</td>
            <td class="px-4 py-3">
                <div class="flex flex-col space-y-2 items-start">
                    <div class="flex space-x-2">
                        <button class="text-blue-500 hover:text-blue-700 edit-pending-doctor w-20 text-left" 
                                data-id="${doctor.id}" data-email="${doctor.email}">
                            <i class="fas fa-edit mr-1"></i> Edit
                        </button>
                        <button class="text-red-500 hover:text-red-700 delete-pending-doctor w-20 text-left" 
                                data-id="${doctor.id}" data-email="${doctor.email}">
                            <i class="fas fa-trash mr-1"></i> Delete
                        </button>
                    </div>
                    ${doctor.status === 'email_unverified' ? 
                        `<div class="flex flex-col space-y-2 w-full">
                            <button class="text-blue-500 hover:text-blue-700 resend-verification-email w-full text-left" 
                                    data-id="${doctor.id}" data-email="${doctor.email}">
                                <i class="fas fa-envelope mr-1"></i> Resend Verification
                            </button>
                            <button class="text-green-500 hover:text-green-700 manually-verify-doctor w-full text-left" 
                                    data-id="${doctor.id}" data-email="${doctor.email}">
                                <i class="fas fa-check-circle mr-1"></i> Manually Verify
                            </button>
                        </div>` : 
                        doctor.status !== 'invited' ? 
                        `<div>
                            <button class="text-green-500 hover:text-green-700 register-pending-doctor w-full text-left" 
                                    data-id="${doctor.id}" data-email="${doctor.email}">
                                <i class="fas fa-user-plus mr-1"></i> Register
                            </button>
                        </div>` : 
                        ''
                    }
                </div>
            </td>
        `;
        
        pendingDoctorsTableBody.appendChild(tr);
    });
    
    // Add event listeners for the buttons
    document.querySelectorAll('.edit-pending-doctor').forEach(button => {
        button.addEventListener('click', () => {
            const doctorId = button.getAttribute('data-id');
            editDoctor(doctorId, 'local');
        });
    });
    
    document.querySelectorAll('.delete-pending-doctor').forEach(button => {
        button.addEventListener('click', () => {
            const doctorId = button.getAttribute('data-id');
            deleteDoctor(doctorId, 'local');
        });
    });
    
    document.querySelectorAll('.register-pending-doctor').forEach(button => {
        button.addEventListener('click', () => {
            const doctorId = button.getAttribute('data-id');
            const email = button.getAttribute('data-email');
            inviteDoctor(doctorId, email);
        });
    });
    
    // Add event listeners for resend verification email buttons
    document.querySelectorAll('.resend-verification-email').forEach(button => {
        button.addEventListener('click', () => {
            const doctorId = button.getAttribute('data-id');
            const email = button.getAttribute('data-email');
            resendVerificationEmail(doctorId, email);
        });
    });
    
    // Add event listeners for manually verify doctor buttons
    document.querySelectorAll('.manually-verify-doctor').forEach(button => {
        button.addEventListener('click', () => {
            const doctorId = button.getAttribute('data-id');
            const email = button.getAttribute('data-email');
            manuallyVerifyDoctor(doctorId, email);
        });
    });
    
    // Update the count
    updatePendingDoctorsCount();
};

// Refresh the pending patients table with data from Supabase
const refreshPendingPatientsTable = async () => {
    const pendingPatientsTableBody = document.getElementById('pending-patients-table-body');
    if (!pendingPatientsTableBody) {
        console.warn('Pending patients table body not found');
        return;
    }
    
    // Show loading state
    pendingPatientsTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Loading pending patients...
            </td>
        </tr>
    `;
    
    try {
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                console.error('Admin client not available. Cannot fetch unverified patients.');
                pendingPatientsTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-4 py-3 text-center text-red-500">
                            Error: Admin client not available. Cannot fetch unverified patients.
                        </td>
                    </tr>
                `;
                return;
            }
        }
        
        // Get all users from Supabase auth
        const { data: authUsers, error: authError } = await window.supabaseAdmin.auth.admin.listUsers();
        
        if (authError) {
            console.error('Error fetching auth users:', authError);
            pendingPatientsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-red-500">
                        Error fetching users: ${authError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Create a map of unverified users by ID
        const unverifiedUsersMap = {};
        authUsers.users.forEach(user => {
            // Check if user has patient role and is not confirmed
            const isPatient = user.user_metadata && user.user_metadata.role === 'patient';
            const isUnverified = !user.email_confirmed_at;
            
            if (isPatient && isUnverified) {
                unverifiedUsersMap[user.id] = user;
            }
        });
        
        // Get all patient profiles from the profiles table
        const { data: profilesData, error: profilesError } = await window.supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('role', 'patient');
            
        if (profilesError) {
            console.error('Error fetching patient profiles:', profilesError);
            pendingPatientsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-red-500">
                        Error fetching patient profiles: ${profilesError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Create a map of profile data by user ID for easy lookup
        const profilesMap = {};
        profilesData.forEach(profile => {
            profilesMap[profile.id] = profile;
        });
        
        // Get all pending patients - using email_verified field from profiles table
        const pendingPatients = [];
        
        // Add patients from profiles table where email_verified is false
        for (const profile of profilesData) {
            // Only include patients where email_verified is false in the profiles table
            if (profile.role === 'patient' && profile.email_verified === false) {
                // Get the auth user data if available
                const user = authUsers.users.find(u => u.id === profile.id);
                
                if (user) {
                    pendingPatients.push({
                        id: profile.id,
                        email: profile.email,
                        created_at: profile.created_at,
                        profile: profile,
                        user_metadata: user.user_metadata
                    });
                }
            }
        }
        
        console.log('Pending patients:', pendingPatients.length);
        
        // Update the count badge
        updatePendingPatientsCount(pendingPatients.length);
        
        // If no pending patients, show empty state
        if (pendingPatients.length === 0) {
            pendingPatientsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                        No pending patients found.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Build the table rows
        let tableHtml = '';
        
        for (const patient of pendingPatients) {
            const patientId = patient.id;
            const patientEmail = patient.email || 'No email';
            const profile = patient.profile;
            
            // Get name from profile if available, otherwise from metadata
            const patientName = profile ? 
                `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 
                (patient.user_metadata?.name || 'Unknown');
                
            const createdAt = new Date(patient.created_at).toLocaleString();
            
            // Determine status
            let status = 'Unverified';
            let statusClass = 'bg-yellow-100 text-yellow-800';
            
            tableHtml += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patientName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patientEmail}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${createdAt}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                            ${status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                            onclick="manuallyVerifyPatient('${patientId}', '${patientEmail}')"
                            class="text-blue-600 hover:text-blue-900 mr-3">Verify</button>
                        <button 
                            onclick="deletePatient('${patientId}', '${patientEmail}')"
                            class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                </tr>
            `;
        }
        
        pendingPatientsTableBody.innerHTML = tableHtml;
        
    } catch (error) {
        console.error('Error in refreshPendingPatientsTable:', error);
        pendingPatientsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-3 text-center text-red-500">
                    Error: ${error.message || 'Unknown error'}
                </td>
            </tr>
        `;
    }
};

// Update the pending users counts (doctors, patients, receptionists)
const updatePendingUsersCounts = async () => {
    try {
        console.log('Checking for unverified users...');
        
        // Make sure supabaseAdmin is available
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                console.error('No admin client available for checking unverified users');
                return;
            }
        }
        
        // Get all unverified users from Supabase
        const { data: users, error } = await window.supabaseAdmin.auth.admin.listUsers();
        
        if (error) {
            console.error('Error fetching users:', error);
            return;
        }
        
        if (!users || !users.users) {
            console.warn('No users data returned from Supabase');
            return;
        }
        
        // Log the total number of users for debugging
        console.log(`Total users found: ${users.users.length}`);
        
        // Filter unverified users by role
        const unverifiedUsers = users.users.filter(user => !user.email_confirmed_at && user.user_metadata);
        console.log(`Total unverified users: ${unverifiedUsers.length}`);
        
        // Count by role
        const unverifiedDoctors = unverifiedUsers.filter(user => 
            user.user_metadata && user.user_metadata.role === 'doctor'
        );
        const unverifiedPatients = unverifiedUsers.filter(user => 
            user.user_metadata && user.user_metadata.role === 'patient'
        );
        const unverifiedReceptionists = unverifiedUsers.filter(user => 
            user.user_metadata && user.user_metadata.role === 'receptionist'
        );
        
        console.log(`Unverified counts - Doctors: ${unverifiedDoctors.length}, Patients: ${unverifiedPatients.length}, Receptionists: ${unverifiedReceptionists.length}`);
        
        // Update doctor count
        updatePendingDoctorsCount(unverifiedDoctors);
        
        // Update sidebar indicators for all roles
        updateSidebarRoleIndicator('doctor', unverifiedDoctors.length);
        updateSidebarRoleIndicator('patient', unverifiedPatients.length);
        updateSidebarRoleIndicator('receptionist', unverifiedReceptionists.length);

        // Log the counts for debugging
        console.log(`Adding notification dots - Doctors: ${unverifiedDoctors.length}, Patients: ${unverifiedPatients.length}, Receptionists: ${unverifiedReceptionists.length}`);
        
    } catch (error) {
        console.error('Error updating pending users counts:', error);
    }
};

// This is a legacy function that has been replaced by the async version above
// The old implementation has been removed to fix syntax errors

// Update the pending patients count badge
const updatePendingPatientsCount = async (pendingCount = 0) => {
    const pendingPatientsCount = document.getElementById('pending-patients-count');
    if (!pendingPatientsCount) {
        console.warn('Pending patients count element not found');
        return;
    }
    
    try {
        let count = pendingCount;
        
        // If count is 0, fetch the count from Supabase
        if (count === 0) {
            if (!window.supabaseAdmin) {
                if (window.supabaseAdminClient) {
                    window.supabaseAdmin = window.supabaseAdminClient;
                } else {
                    console.warn('Admin client not available for checking unverified patients');
                    return;
                }
            }
            
            // Get all users from Supabase
            const { data: users, error } = await window.supabaseAdmin.auth.admin.listUsers();
            
            if (error) {
                console.error('Error fetching users for patient count:', error);
                return;
            }
            
            // Filter for unverified patients
            count = users.users.filter(user => {
                return user.user_metadata && 
                       user.user_metadata.role === 'patient' && 
                       !user.email_confirmed_at;
            }).length;
        }
        
        console.log(`Found ${count} pending patients`);
        
        // Update the count badge - show blue dot if there are pending patients
        if (count > 0) {
            pendingPatientsCount.classList.remove('hidden');
            // Make sure the blue dot is visible
            pendingPatientsCount.style.display = 'inline-block';
            pendingPatientsCount.style.backgroundColor = '#3b82f6'; // Blue color
            pendingPatientsCount.style.width = '8px';
            pendingPatientsCount.style.height = '8px';
        } else {
            pendingPatientsCount.classList.add('hidden');
        }
        
        // Update sidebar indicator
        updateSidebarRoleIndicator('patient', count);
        
    } catch (error) {
        console.error('Error in updatePendingPatientsCount:', error);
    }
};

// Refresh the pending receptionists table with data from Supabase
const refreshPendingReceptionistsTable = async () => {
    const pendingReceptionistsTableBody = document.getElementById('pending-receptionists-table-body');
    if (!pendingReceptionistsTableBody) {
        console.warn('Pending receptionists table body not found');
        return;
    }
    
    // Show loading state
    pendingReceptionistsTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Loading pending receptionists...
            </td>
        </tr>
    `;
    
    try {
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                console.error('Admin client not available. Cannot fetch unverified receptionists.');
                pendingReceptionistsTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-4 py-3 text-center text-red-500">
                            Error: Admin client not available. Cannot fetch unverified receptionists.
                        </td>
                    </tr>
                `;
                return;
            }
        }
        
        // Get all users from Supabase auth
        const { data: authUsers, error: authError } = await window.supabaseAdmin.auth.admin.listUsers();
        
        if (authError) {
            console.error('Error fetching auth users:', authError);
            pendingReceptionistsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-red-500">
                        Error fetching users: ${authError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Create a map of unverified users by ID
        const unverifiedUsersMap = {};
        authUsers.users.forEach(user => {
            // Check if user has receptionist role and is not confirmed
            const isReceptionist = user.user_metadata && user.user_metadata.role === 'receptionist';
            const isUnverified = !user.email_confirmed_at;
            
            if (isReceptionist && isUnverified) {
                unverifiedUsersMap[user.id] = user;
            }
        });
        
        // Get all receptionist profiles from the profiles table
        const { data: profilesData, error: profilesError } = await window.supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('role', 'receptionist');
            
        if (profilesError) {
            console.error('Error fetching receptionist profiles:', profilesError);
            pendingReceptionistsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-red-500">
                        Error fetching receptionist profiles: ${profilesError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Create a map of profile data by user ID for easy lookup
        const profilesMap = {};
        profilesData.forEach(profile => {
            profilesMap[profile.id] = profile;
        });
        
        // Get all pending receptionists
        const pendingReceptionists = [];
        
        // Add users from auth that have receptionist role but are unverified
        for (const userId in unverifiedUsersMap) {
            const user = unverifiedUsersMap[userId];
            const profile = profilesMap[userId];
            
            // Include the user if they're unverified
            pendingReceptionists.push({
                id: userId,
                email: user.email,
                created_at: user.created_at,
                profile: profile,
                user_metadata: user.user_metadata
            });
        }
        
        console.log('Pending receptionists:', pendingReceptionists.length);
        
        // Update the count badge
        updatePendingReceptionistsCount(pendingReceptionists.length);
        
        // If no pending receptionists, show empty state
        if (pendingReceptionists.length === 0) {
            pendingReceptionistsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                        No pending receptionists found.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Build the table rows
        let tableHtml = '';
        
        for (const receptionist of pendingReceptionists) {
            const receptionistId = receptionist.id;
            const receptionistEmail = receptionist.email || 'No email';
            const profile = receptionist.profile;
            
            // Get name from profile if available, otherwise from metadata
            const receptionistName = profile ? 
                `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 
                (receptionist.user_metadata?.name || 'Unknown');
                
            const createdAt = new Date(receptionist.created_at).toLocaleString();
            
            // Determine status
            let status = 'Unverified';
            let statusClass = 'bg-yellow-100 text-yellow-800';
            
            tableHtml += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${receptionistName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${receptionistEmail}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${createdAt}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                            ${status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                            onclick="manuallyVerifyReceptionist('${receptionistId}', '${receptionistEmail}')"
                            class="text-blue-600 hover:text-blue-900 mr-3">Verify</button>
                        <button 
                            onclick="deleteReceptionist('${receptionistId}', '${receptionistEmail}')"
                            class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                </tr>
            `;
        }
        
        pendingReceptionistsTableBody.innerHTML = tableHtml;
        
    } catch (error) {
        console.error('Error in refreshPendingReceptionistsTable:', error);
        pendingReceptionistsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-3 text-center text-red-500">
                    Error: ${error.message || 'Unknown error'}
                </td>
            </tr>
        `;
    }
};

// Update the pending receptionists count badge
const updatePendingReceptionistsCount = async (pendingCount = 0) => {
    const pendingReceptionistsCount = document.getElementById('pending-receptionists-count');
    if (!pendingReceptionistsCount) {
        console.warn('Pending receptionists count element not found');
        return;
    }
    
    try {
        let count = pendingCount;
        
        // If count is 0, fetch the count from Supabase
        if (count === 0) {
            if (!window.supabaseAdmin) {
                if (window.supabaseAdminClient) {
                    window.supabaseAdmin = window.supabaseAdminClient;
                } else {
                    console.warn('Admin client not available for checking unverified receptionists');
                    return;
                }
            }
            
            // Get all users from Supabase
            const { data: users, error } = await window.supabaseAdmin.auth.admin.listUsers();
            
            if (error) {
                console.error('Error fetching users for receptionist count:', error);
                return;
            }
            
            // Filter for unverified receptionists
            count = users.users.filter(user => {
                return user.user_metadata && 
                       user.user_metadata.role === 'receptionist' && 
                       !user.email_confirmed_at;
            }).length;
        }
        
        console.log(`Found ${count} pending receptionists`);
        
        // Update the count badge - show blue dot if there are pending receptionists
        if (count > 0) {
            pendingReceptionistsCount.classList.remove('hidden');
            // Make sure the blue dot is visible
            pendingReceptionistsCount.style.display = 'inline-block';
            pendingReceptionistsCount.style.backgroundColor = '#3b82f6'; // Blue color
            pendingReceptionistsCount.style.width = '8px';
            pendingReceptionistsCount.style.height = '8px';
        } else {
            pendingReceptionistsCount.classList.add('hidden');
        }
        
        // Update sidebar indicator
        updateSidebarRoleIndicator('receptionist', count);
        
    } catch (error) {
        console.error('Error in updatePendingReceptionistsCount:', error);
    }
};

// Add a notification indicator to the sidebar links for different roles
const updateSidebarRoleIndicator = (role, count) => {
    if (count <= 0) return; // No need to proceed if count is zero
    
    console.log(`Adding notification dot for ${role} with count ${count}`);
    
    // Define the text to look for based on role
    let textToFind = '';
    
    switch (role) {
        case 'doctor':
            textToFind = 'Doctors';
            break;
        case 'patient':
            textToFind = 'Patients';
            break;
        case 'receptionist':
            textToFind = 'Receptionists';
            break;
        default:
            return; // Exit if role is not recognized
    }
    
    // Try multiple selector approaches to find the sidebar link
    let roleLink = null;
    
    // Method 1: Try to find by sidebar-item class and text content
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        const text = item.textContent.trim();
        if (text.includes(textToFind)) {
            roleLink = item;
            console.log(`Found ${role} link using sidebar-item class`);
        }
    });
    
    // Method 2: If not found, try looking for any link with the text
    if (!roleLink) {
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            const text = link.textContent.trim();
            if (text.includes(textToFind)) {
                roleLink = link;
                console.log(`Found ${role} link using generic link search`);
            }
        });
    }
    
    // Method 3: Try finding by href attribute
    if (!roleLink) {
        const hrefLink = document.querySelector(`a[href="#${role}s"]`) || document.querySelector(`a[href="#${role}"]`);
        if (hrefLink) {
            roleLink = hrefLink;
            console.log(`Found ${role} link using href attribute`);
        }
    }
    
    if (!roleLink) {
        console.warn(`Could not find sidebar link for ${role}`);
        return;
    }
    
    console.log(`Adding blue dot to ${role} link:`, roleLink);
    
    // Remove any existing indicator
    const existingIndicator = roleLink.querySelector('.pending-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Add a new indicator as a small blue dot
    const indicator = document.createElement('span');
    indicator.className = 'pending-indicator ml-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse inline-block align-middle';
    roleLink.appendChild(indicator);
};

// Set up a timer to periodically check for unverified users
const setupUnverifiedUsersCheck = () => {
    console.log('Setting up unverified users check system...');
    
    // Make sure we have the admin client before proceeding
    if (!window.supabaseAdmin && window.supabaseAdminClient) {
        window.supabaseAdmin = window.supabaseAdminClient;
        console.log('Created supabaseAdmin alias for supabaseAdminClient');
    }
    
    // Initial check with a slight delay to ensure everything is loaded
    setTimeout(() => {
        console.log('Running initial unverified users check...');
        updatePendingUsersCounts();
    }, 1000);
    
    // Set up periodic checks (every 15 seconds)
    const checkInterval = setInterval(updatePendingUsersCounts, 15000);
    console.log('Unverified users check scheduled every 15 seconds');
    
    // Store the interval ID in window so it can be cleared if needed
    window.unverifiedUsersCheckInterval = checkInterval;
    
    return checkInterval;
};

// Make sure the notification system is initialized when the page loads
const initNotificationSystem = () => {
    // If we're already running, don't initialize again
    if (window.notificationSystemInitialized) return;
    
    console.log('Initializing notification system...');
    
    // If we're on the dashboard page with doctor tabs
    if (document.getElementById('doctors-tabs')) {
        console.log('Doctor tabs found, setting up tab system...');
        setupDoctorTabs();
    }
    
    // Always check for unverified users on any admin page
    setupUnverifiedUsersCheck();
    
    // Mark as initialized
    window.notificationSystemInitialized = true;
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', initNotificationSystem);

// Also try to initialize immediately if the document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already loaded, initializing notification system now...');
    initNotificationSystem();
}

// Manually verify a patient
const manuallyVerifyPatient = async (patientId, patientEmail) => {
    if (!confirm(`Are you sure you want to verify patient ${patientEmail}?`)) {
        return;
    }
    
    try {
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                alert('Admin client not available. Cannot verify patient.');
                return;
            }
        }
        
        // Update the user's email_confirmed_at field in auth.users table
        const { error: authError } = await window.supabaseAdmin.auth.admin.updateUserById(
            patientId,
            { email_confirmed_at: new Date().toISOString() }
        );
        
        if (authError) {
            console.error('Error verifying patient in auth table:', authError);
            alert(`Error verifying patient: ${authError.message}`);
            return;
        }
        
        // Also update the email_verified field in the profiles table
        const { error: profileError } = await window.supabaseAdmin
            .from('profiles')
            .update({ email_verified: true })
            .eq('id', patientId);
            
        if (profileError) {
            console.error('Error updating profile email_verified field:', profileError);
            alert(`Patient verified in auth system but profile update failed: ${profileError.message}`);
            // Continue anyway since the auth part succeeded
        }
        
        console.log(`Patient ${patientEmail} verified successfully. Profile updated: ${!profileError}`);
        alert(`Patient ${patientEmail} has been verified successfully.`);
        
        // Refresh the pending patients table
        refreshPendingPatientsTable();
        
        // Update the count badge
        updatePendingPatientsCount([]);
        
    } catch (error) {
        console.error('Error in manuallyVerifyPatient:', error);
        alert(`Error verifying patient: ${error.message || 'Unknown error'}`);
    }
};

// Delete a patient
const deletePatient = async (patientId, patientEmail) => {
    if (!confirm(`Are you sure you want to delete patient ${patientEmail}?`)) {
        return;
    }
    
    try {
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                alert('Admin client not available. Cannot delete patient.');
                return;
            }
        }
        
        // Delete the user
        const { error } = await window.supabaseAdmin.auth.admin.deleteUser(patientId);
        
        if (error) {
            console.error('Error deleting patient:', error);
            alert(`Error deleting patient: ${error.message}`);
            return;
        }
        
        alert(`Patient ${patientEmail} has been deleted successfully.`);
        
        // Refresh the pending patients table
        refreshPendingPatientsTable();
        
        // Update the count badge
        updatePendingPatientsCount([]);
        
    } catch (error) {
        console.error('Error in deletePatient:', error);
        alert(`Error deleting patient: ${error.message || 'Unknown error'}`);
    }
};

// Manually verify a receptionist
const manuallyVerifyReceptionist = async (receptionistId, receptionistEmail) => {
    if (!confirm(`Are you sure you want to verify receptionist ${receptionistEmail}?`)) {
        return;
    }
    
    try {
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                alert('Admin client not available. Cannot verify receptionist.');
                return;
            }
        }
        
        // Update the user's email_confirmed_at field
        const { error } = await window.supabaseAdmin.auth.admin.updateUserById(
            receptionistId,
            { email_confirmed_at: new Date().toISOString() }
        );
        
        if (error) {
            console.error('Error verifying receptionist:', error);
            alert(`Error verifying receptionist: ${error.message}`);
            return;
        }
        
        alert(`Receptionist ${receptionistEmail} has been verified successfully.`);
        
        // Refresh the pending receptionists table
        refreshPendingReceptionistsTable();
        
        // Update the count badge
        updatePendingReceptionistsCount([]);
        
    } catch (error) {
        console.error('Error in manuallyVerifyReceptionist:', error);
        alert(`Error verifying receptionist: ${error.message || 'Unknown error'}`);
    }
};

// Delete a receptionist
const deleteReceptionist = async (receptionistId, receptionistEmail) => {
    if (!confirm(`Are you sure you want to delete receptionist ${receptionistEmail}?`)) {
        return;
    }
    
    try {
        if (!window.supabaseAdmin) {
            console.warn('supabaseAdmin not available, trying to use supabaseAdminClient');
            if (window.supabaseAdminClient) {
                window.supabaseAdmin = window.supabaseAdminClient;
            } else {
                alert('Admin client not available. Cannot delete receptionist.');
                return;
            }
        }
        
        // Delete the user
        const { error } = await window.supabaseAdmin.auth.admin.deleteUser(receptionistId);
        
        if (error) {
            console.error('Error deleting receptionist:', error);
            alert(`Error deleting receptionist: ${error.message}`);
            return;
        }
        
        alert(`Receptionist ${receptionistEmail} has been deleted successfully.`);
        
        // Refresh the pending receptionists table
        refreshPendingReceptionistsTable();
        
        // Update the count badge
        updatePendingReceptionistsCount([]);
        
    } catch (error) {
        console.error('Error in deleteReceptionist:', error);
        alert(`Error deleting receptionist: ${error.message || 'Unknown error'}`);
    }
};

// Expose functions for use in other scripts
window.refreshPendingDoctorsTable = refreshPendingDoctorsTable;
window.updatePendingDoctorsCount = updatePendingDoctorsCount;
window.updatePendingUsersCounts = updatePendingUsersCounts;
window.refreshPendingPatientsTable = refreshPendingPatientsTable;
window.updatePendingPatientsCount = updatePendingPatientsCount;
window.manuallyVerifyPatient = manuallyVerifyPatient;
window.deletePatient = deletePatient;
window.refreshPendingReceptionistsTable = refreshPendingReceptionistsTable;
window.updatePendingReceptionistsCount = updatePendingReceptionistsCount;
window.manuallyVerifyReceptionist = manuallyVerifyReceptionist;
window.deleteReceptionist = deleteReceptionist;

// Close the self-executing function
})();
