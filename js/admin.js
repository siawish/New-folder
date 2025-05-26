// Admin dashboard functionality

// Use the global supabaseClient from supabase-config.js
document.addEventListener('DOMContentLoaded', function() {
    // Make sure supabase-config.js is loaded before this script
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized. Make sure supabase-config.js is loaded first.');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Message display element
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('hidden', 'p-4', 'mb-4', 'rounded-md');
    const tabContent = document.querySelector('#tab-content');
    if (tabContent) {
        tabContent.prepend(messageContainer);
    }
    
    // Function to show message
    function showMessage(message, type = 'error') {
        messageContainer.textContent = message;
        messageContainer.className = `p-4 mb-4 rounded-md ${
            type === 'success' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
        }`;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            messageContainer.classList.add('hidden');
        }, 5000);
    }
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Reset all tabs
            tabButtons.forEach(btn => {
                btn.classList.remove('border-blue-500', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // Set active tab
            button.classList.remove('border-transparent', 'text-gray-500');
            button.classList.add('border-blue-500', 'text-blue-600');
            
            // Show corresponding content
            const tabId = button.id.replace('tab-', '');
            if (tabId === 'doctor') {
                document.getElementById('doctor-form').classList.remove('hidden');
            } else if (tabId === 'receptionist') {
                document.getElementById('receptionist-form').classList.remove('hidden');
            } else if (tabId === 'manage-users') {
                document.getElementById('manage-users-section').classList.remove('hidden');
                loadUsers(); // Load users when tab is selected
            }
        });
    });
    
    // Add Doctor Form Submission
    const addDoctorForm = document.getElementById('add-doctor-form');
    // The doctor form is now handled in admin-dashboard.js
    if (addDoctorForm && !window.doctorFormHandled) {
        // Mark the form as handled to prevent duplicate event handlers
        window.doctorFormHandled = true;
        
        // We'll only handle this if we're not on the dashboard page
        if (!window.location.pathname.includes('/dashboard.html')) {
            addDoctorForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Get form data - use the correct IDs for this form
                const firstName = document.getElementById('first_name')?.value || '';
                const lastName = document.getElementById('last_name')?.value || '';
                const email = document.getElementById('doctor_email')?.value || document.getElementById('email')?.value || '';
                const password = document.getElementById('password')?.value || '';
                const specialty = document.getElementById('specialty')?.value || '';
                const phone = document.getElementById('doctor-phone')?.value || '';
                const experience = document.getElementById('doctor-experience')?.value || '';
                const address = document.getElementById('doctor-address')?.value || '';
            
            try {
                // Create user in Supabase Auth
                const { data, error } = await window.supabaseClient.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true, // Auto-confirm email for staff
                    user_metadata: {
                        first_name: firstName,
                        last_name: lastName,
                        role: 'doctor',
                        specialization,
                        license_number: licenseNumber,
                        phone,
                        experience_years: experience,
                        address
                    }
                });
                
                if (error) throw error;
                
                showMessage(`Doctor ${firstName} ${lastName} has been added successfully.`, 'success');
                addDoctorForm.reset();
                
            } catch (error) {
                console.error('Error adding doctor:', error);
                showMessage(error.message || 'Failed to add doctor. Please try again.');
            }
        });
    }
    
    // Add Receptionist Form Submission
    const addReceptionistForm = document.getElementById('add-receptionist-form');
    if (addReceptionistForm) {
        addReceptionistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const firstName = document.getElementById('receptionist-first-name').value;
            const lastName = document.getElementById('receptionist-last-name').value;
            const email = document.getElementById('receptionist-email').value;
            const password = document.getElementById('receptionist-password').value;
            const employeeId = document.getElementById('receptionist-employee-id').value;
            const department = document.getElementById('receptionist-department').value;
            const shift = document.getElementById('receptionist-shift').value;
            const phone = document.getElementById('receptionist-phone').value;
            const joiningDate = document.getElementById('receptionist-joining-date').value;
            const address = document.getElementById('receptionist-address').value;
            
            try {
                // Create user in Supabase Auth
                const { data, error } = await window.supabaseClient.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true, // Auto-confirm email for staff
                    user_metadata: {
                        first_name: firstName,
                        last_name: lastName,
                        role: 'receptionist',
                        employee_id: employeeId,
                        department,
                        shift,
                        phone,
                        joining_date: joiningDate,
                        address
                    }
                });
                
                if (error) throw error;
                
                showMessage(`Receptionist ${firstName} ${lastName} has been added successfully.`, 'success');
                addReceptionistForm.reset();
                
            } catch (error) {
                console.error('Error adding receptionist:', error);
                showMessage(error.message || 'Failed to add receptionist. Please try again.');
            }
        });
    }
    
    // Load users for the manage users tab
    async function loadUsers(role = 'all') {
        const tableBody = document.getElementById('users-table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = '<tr><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="5">Loading users...</td></tr>';
        
        try {
            // Query profiles table
            let query = window.supabaseClient.from('profiles').select('*');
            
            // Apply role filter if not 'all'
            if (role !== 'all') {
                query = query.eq('role', role);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            if (data && data.length > 0) {
                tableBody.innerHTML = '';
                
                data.forEach(user => {
                    const row = document.createElement('tr');
                    
                    // Name cell
                    const nameCell = document.createElement('td');
                    nameCell.className = 'px-6 py-4 whitespace-nowrap';
                    nameCell.innerHTML = `
                        <div class="flex items-center">
                            <div>
                                <div class="text-sm font-medium text-gray-900">${user.first_name} ${user.last_name}</div>
                            </div>
                        </div>
                    `;
                    
                    // Email cell
                    const emailCell = document.createElement('td');
                    emailCell.className = 'px-6 py-4 whitespace-nowrap';
                    emailCell.innerHTML = `<div class="text-sm text-gray-500">${user.email}</div>`;
                    
                    // Role cell
                    const roleCell = document.createElement('td');
                    roleCell.className = 'px-6 py-4 whitespace-nowrap';
                    roleCell.innerHTML = `
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getRoleColor(user.role)}-100 text-${getRoleColor(user.role)}-800">
                            ${capitalizeFirstLetter(user.role)}
                        </span>
                    `;
                    
                    // Status cell
                    const statusCell = document.createElement('td');
                    statusCell.className = 'px-6 py-4 whitespace-nowrap';
                    statusCell.innerHTML = `
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                    `;
                    
                    // Actions cell
                    const actionsCell = document.createElement('td');
                    actionsCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
                    actionsCell.innerHTML = `
                        <button class="text-indigo-600 hover:text-indigo-900 mr-3" data-id="${user.id}" data-action="edit">Edit</button>
                        <button class="text-red-600 hover:text-red-900" data-id="${user.id}" data-action="delete">Delete</button>
                    `;
                    
                    // Add cells to row
                    row.appendChild(nameCell);
                    row.appendChild(emailCell);
                    row.appendChild(roleCell);
                    row.appendChild(statusCell);
                    row.appendChild(actionsCell);
                    
                    // Add row to table
                    tableBody.appendChild(row);
                });
                
                // Add event listeners to action buttons
                setupActionButtons();
            } else {
                tableBody.innerHTML = '<tr><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="5">No users found.</td></tr>';
            }
        } catch (error) {
            console.error('Error loading users:', error);
            tableBody.innerHTML = `<tr><td class="px-6 py-4 whitespace-nowrap text-sm text-red-500" colspan="5">Error loading users: ${error.message}</td></tr>`;
        }
    }
    
    // Setup role filter
    const roleFilter = document.getElementById('filter-role');
    if (roleFilter) {
        roleFilter.addEventListener('change', () => {
            loadUsers(roleFilter.value);
        });
    }
    
    // Helper functions
    function getRoleColor(role) {
        switch(role) {
            case 'admin': return 'purple';
            case 'doctor': return 'blue';
            case 'patient': return 'green';
            case 'receptionist': return 'yellow';
            default: return 'gray';
        }
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function setupActionButtons() {
        // Edit buttons
        document.querySelectorAll('[data-action="edit"]').forEach(button => {
            button.addEventListener('click', () => {
                const userId = button.getAttribute('data-id');
                // Implement edit functionality
                console.log('Edit user:', userId);
                // This would typically open a modal with user details for editing
            });
        });
        
        // Delete buttons
        document.querySelectorAll('[data-action="delete"]').forEach(button => {
            button.addEventListener('click', async () => {
                const userId = button.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                    try {
                        const { error } = await window.supabaseClient.auth.admin.deleteUser(userId);
                        
                        if (error) throw error;
                        
                        showMessage('User has been deleted successfully.', 'success');
                        loadUsers(roleFilter ? roleFilter.value : 'all');
                    } catch (error) {
                        console.error('Error deleting user:', error);
                        showMessage(error.message || 'Failed to delete user. Please try again.');
                    }
                }
            });
        });
    }
    
    // Check if user is logged in and is an admin
    async function checkAdminAccess() {
        try {
            // Check for default admin session in localStorage
            const isDefaultAdmin = localStorage.getItem('isDefaultAdmin') === 'true';
            
            if (isDefaultAdmin) {
                console.log('Using default admin session');
                return true; // Allow access for default admin
            }
            
            // Otherwise check Supabase authentication
            const { data: { user }, error } = await window.supabaseClient.auth.getUser();
            
            if (error || !user) {
                console.log('No user found or error:', error);
                // Only redirect if we're not already on the login page
                if (!window.location.pathname.includes('/auth/login.html')) {
                    window.location.href = '../../auth/login.html';
                }
                return false;
            }
            
            // Get user profile to check role
            const { data: profile, error: profileError } = await window.supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            console.log('Profile check result:', profile, profileError);
            
            if (profileError || !profile || profile.role !== 'admin') {
                // Only redirect if we're not already on the login page
                if (!window.location.pathname.includes('/auth/login.html')) {
                    alert('You do not have permission to access this page.');
                    window.location.href = '../../auth/login.html';
                }
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error checking admin access:', error);
            // Only redirect if we're not already on the login page
            if (!window.location.pathname.includes('/auth/login.html')) {
                window.location.href = '../../auth/login.html';
            }
            return false;
        }
    }
    
    // Initialize admin dashboard
    checkAdminAccess();
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const { error } = await window.supabaseClient.auth.signOut();
                if (error) throw error;
                window.location.href = '../../auth/login.html';
            } catch (error) {
                console.error('Error signing out:', error);
                alert('Failed to sign out. Please try again.');
            }
        });
    }
}

// Close the DOMContentLoaded event listener
});
