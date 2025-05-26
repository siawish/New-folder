// Profile completion functionality using Supabase

// Initialize Supabase client
const supabaseUrl = 'https://vqlevlvqxwwofnecitxo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbGV2bHZxeHd3b2ZuZWNpdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDk1NzMsImV4cCI6MjA2MzMyNTU3M30.haGyIaB50jdZKBHS9rRE-7ULf-3fAYeFYwe-5bONmKE';

// Create a single supabase client for interacting with your database
const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : createClient(supabaseUrl, supabaseKey);

// DOM Elements
const completeProfileForm = document.getElementById('complete-profile-form');
const authMessage = document.getElementById('auth-message');
const loadingIndicator = document.getElementById('loading');
const patientFields = document.getElementById('patient-fields');
const doctorFields = document.getElementById('doctor-fields');

// Helper functions
function showMessage(message, type = 'error') {
    if (authMessage) {
        authMessage.textContent = message;
        authMessage.className = `p-4 mb-4 text-sm rounded-lg ${
            type === 'success' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
        }`;
        authMessage.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            authMessage.classList.add('hidden');
        }, 5000);
    }
}

function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
}

function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    }
}

function redirectToDashboard(role) {
    switch(role) {
        case 'admin':
            window.location.href = '../dashboards/admin.html';
            break;
        case 'doctor':
            window.location.href = '../dashboards/doctor.html';
            break;
        case 'patient':
            window.location.href = '../dashboards/patient.html';
            break;
        case 'receptionist':
            window.location.href = '../dashboards/receptionist.html';
            break;
        default:
            window.location.href = '../index.html';
    }
}

// Check if user is logged in
async function checkUser() {
    try {
        showLoading();
        
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (!user) {
            // Redirect to login if not logged in
            window.location.href = '../auth/login.html';
            return;
        }
        
        // Get user profile to determine role
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
        if (profileError) throw profileError;
        
        // Show fields based on role
        if (profile.role === 'patient') {
            patientFields.classList.remove('hidden');
        } else if (profile.role === 'doctor') {
            doctorFields.classList.remove('hidden');
        }
        
        // Pre-fill form if data exists
        if (profile.address) document.getElementById('address').value = profile.address;
        if (profile.date_of_birth) document.getElementById('date-of-birth').value = profile.date_of_birth;
        if (profile.gender) document.getElementById('gender').value = profile.gender;
        
        if (profile.role === 'patient') {
            if (profile.blood_group) document.getElementById('blood-group').value = profile.blood_group;
            if (profile.allergies) document.getElementById('allergies').value = profile.allergies.join(', ');
        } else if (profile.role === 'doctor') {
            if (profile.specialization) document.getElementById('specialization').value = profile.specialization;
            if (profile.license_number) document.getElementById('license-number').value = profile.license_number;
        }
        
    } catch (error) {
        showMessage(error.message);
    } finally {
        hideLoading();
    }
}

// Complete profile form submission
if (completeProfileForm) {
    completeProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError) throw userError;
            
            if (!user) {
                throw new Error('You must be logged in to complete your profile.');
            }
            
            // Get form values
            const address = document.getElementById('address').value;
            const dateOfBirth = document.getElementById('date-of-birth').value;
            const gender = document.getElementById('gender').value;
            const phone = document.getElementById('phone').value;
            
            // Get user profile to determine role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
                
            if (profileError) throw profileError;
            
            // Prepare update data
            const updateData = {
                address,
                date_of_birth: dateOfBirth,
                gender,
                phone,
                updated_at: new Date()
            };
            
            // Add role-specific fields
            if (profile.role === 'patient') {
                const bloodGroup = document.getElementById('blood-group').value;
                const allergiesString = document.getElementById('allergies').value;
                const allergies = allergiesString ? allergiesString.split(',').map(item => item.trim()) : [];
                
                updateData.blood_group = bloodGroup;
                updateData.allergies = allergies;
            } else if (profile.role === 'doctor') {
                const specialization = document.getElementById('specialization').value;
                const licenseNumber = document.getElementById('license-number').value;
                
                updateData.specialization = specialization;
                updateData.license_number = licenseNumber;
            }
            
            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', user.id);
                
            if (updateError) throw updateError;
            
            showMessage('Profile updated successfully!', 'success');
            
            // Redirect to appropriate dashboard after a short delay
            setTimeout(() => {
                redirectToDashboard(profile.role);
            }, 1500);
            
        } catch (error) {
            showMessage(error.message);
        } finally {
            hideLoading();
        }
    });
}

// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init();
    checkUser();
});
