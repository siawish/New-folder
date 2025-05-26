// Doctor Management Functions
// These functions handle editing, deleting, and inviting doctors

// Function to edit a doctor
const editDoctor = (doctorId, source) => {
    try {
        if (source === 'local') {
            // Edit a pending doctor from localStorage
            const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
            const doctorToEdit = pendingDoctors.find(doctor => doctor.id === doctorId);
            
            if (!doctorToEdit) {
                alert('Doctor not found in pending list');
                return;
            }
            
            // Populate the edit form with the doctor's information
            const editDoctorForm = document.getElementById('edit-doctor-form');
            if (!editDoctorForm) {
                console.error('Edit doctor form not found');
                return;
            }
            
            // Set form values
            document.getElementById('edit-doctor-id').value = doctorId;
            document.getElementById('edit-doctor-source').value = source;
            document.getElementById('edit-first-name').value = doctorToEdit.first_name || '';
            document.getElementById('edit-last-name').value = doctorToEdit.last_name || '';
            document.getElementById('edit-email').value = doctorToEdit.email || '';
            document.getElementById('edit-phone').value = doctorToEdit.phone || '';
            document.getElementById('edit-specialty').value = doctorToEdit.specialization || '';
            document.getElementById('edit-license').value = doctorToEdit.license_number || '';
            document.getElementById('edit-qualification').value = doctorToEdit.qualification || '';
            document.getElementById('edit-experience').value = doctorToEdit.experience_years || '';
            document.getElementById('edit-fee').value = doctorToEdit.consultation_fee || '';
            
            // Populate department dropdown
            populateEditDepartmentDropdown(doctorToEdit.department_id);
            
            // Show the edit modal
            const editDoctorModal = document.getElementById('edit-doctor-modal');
            if (editDoctorModal) {
                editDoctorModal.classList.remove('hidden');
            }
        } else {
            // Edit a doctor from Supabase
            // This would require fetching the doctor's information from the database
            alert('Editing active doctors is not yet implemented');
        }
    } catch (error) {
        console.error('Error in editDoctor:', error);
        alert('Error editing doctor: ' + error.message);
    }
};

// Function to populate department dropdown for edit form
const populateEditDepartmentDropdown = async (selectedDepartmentId) => {
    try {
        const departmentDropdown = document.getElementById('edit-department');
        if (!departmentDropdown) return;
        
        // Clear existing options
        departmentDropdown.innerHTML = '<option value="">Select Department</option>';
        
        // Fetch departments from Supabase
        const { data: departments, error } = await supabaseClient
            .from('departments')
            .select('id, name');
            
        if (error) {
            console.error('Error fetching departments:', error);
            return;
        }
        
        // Add department options
        if (departments && departments.length > 0) {
            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.id;
                option.textContent = dept.name;
                if (dept.id === selectedDepartmentId) {
                    option.selected = true;
                }
                departmentDropdown.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error in populateEditDepartmentDropdown:', error);
    }
};

// Function to save edited doctor
const saveEditedDoctor = async (event) => {
    event.preventDefault();
    
    try {
        const doctorId = document.getElementById('edit-doctor-id').value;
        const source = document.getElementById('edit-doctor-source').value;
        
        if (source === 'local') {
            // Update a pending doctor in localStorage
            const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
            const doctorIndex = pendingDoctors.findIndex(doctor => doctor.id === doctorId);
            
            if (doctorIndex === -1) {
                alert('Doctor not found in pending list');
                return;
            }
            
            // Get form values
            const firstName = document.getElementById('edit-first-name').value;
            const lastName = document.getElementById('edit-last-name').value;
            const email = document.getElementById('edit-email').value;
            const phone = document.getElementById('edit-phone').value;
            const specialty = document.getElementById('edit-specialty').value;
            const licenseNumber = document.getElementById('edit-license').value;
            const qualification = document.getElementById('edit-qualification').value;
            const experienceYears = document.getElementById('edit-experience').value;
            const consultationFee = document.getElementById('edit-fee').value;
            const departmentId = document.getElementById('edit-department').value;
            
            // Update doctor information
            pendingDoctors[doctorIndex] = {
                ...pendingDoctors[doctorIndex],
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                specialization: specialty,
                license_number: licenseNumber,
                qualification: qualification,
                experience_years: experienceYears ? parseInt(experienceYears) : 0,
                consultation_fee: consultationFee ? parseFloat(consultationFee) : 0.00,
                department_id: departmentId
            };
            
            // Save back to localStorage
            localStorage.setItem('pendingDoctors', JSON.stringify(pendingDoctors));
            
            // Close the edit modal
            const editDoctorModal = document.getElementById('edit-doctor-modal');
            if (editDoctorModal) {
                editDoctorModal.classList.add('hidden');
            }
            
            // Refresh the doctors list
            fetchDoctorsData();
            
            alert('Doctor information updated successfully!');
        } else {
            // Update a doctor in Supabase
            alert('Updating active doctors is not yet implemented');
        }
    } catch (error) {
        console.error('Error in saveEditedDoctor:', error);
        alert('Error saving doctor: ' + error.message);
    }
};

// Function to delete a doctor
const deleteDoctor = async (doctorId, source) => {
    try {
        if (!confirm('Are you sure you want to delete this doctor?')) {
            return;
        }
        
        if (source === 'local') {
            // Delete a pending doctor from localStorage
            const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
            const updatedDoctors = pendingDoctors.filter(doctor => doctor.id !== doctorId);
            
            // Save back to localStorage
            localStorage.setItem('pendingDoctors', JSON.stringify(updatedDoctors));
            
            // Refresh the doctors list
            fetchDoctorsData();
            
            alert('Doctor removed from pending list');
        } else {
            // Delete a doctor from Supabase
            // This would require deleting from multiple tables
            alert('Deleting active doctors is not yet implemented');
        }
    } catch (error) {
        console.error('Error in deleteDoctor:', error);
        alert('Error deleting doctor: ' + error.message);
    }
};

// Function to invite a doctor via email
const inviteDoctor = async (doctorId, email) => {
    try {
        // Show loading state
        showToast('Sending invitation...', 'info');
        
        // Get the doctor data from localStorage
        const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
        const doctorToInvite = pendingDoctors.find(doctor => doctor.id === doctorId);
        
        if (!doctorToInvite) {
            showToast('Doctor not found in pending list', 'error');
            return;
        }
        
        // Check if we're online
        if (!navigator.onLine) {
            showToast('You are offline. Please try again when you have an internet connection.', 'warning');
            // Show manual invitation option
            showManualInvitationModal(doctorToInvite);
            return;
        }

        try {
            // Make sure we have a reference to the admin client
            if (typeof supabaseAdmin === 'undefined') {
                if (typeof window.supabaseAdminClient !== 'undefined') {
                    window.supabaseAdmin = window.supabaseAdminClient;
                    console.log('Created supabaseAdmin alias for supabaseAdminClient');
                } else {
                    throw new Error('Admin client not available. Check your supabase-admin-config.js file.');
                }
            }
            
            // Create the user with the admin client
            const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
                email: doctorToInvite.email,
                password: doctorToInvite.password,
                email_confirm: false, // Send verification email instead of auto-confirming
                user_metadata: {
                    first_name: doctorToInvite.first_name,
                    last_name: doctorToInvite.last_name,
                    role: 'doctor'
                }
            });

            if (userError) {
                console.error('Error creating user:', userError);
                showToast(`Failed to create user: ${userError.message}`, 'error');
                // Show manual invitation option
                if (typeof window.showManualInvitationModal === 'function') {
                    window.showManualInvitationModal(doctorToInvite);
                } else {
                    console.error('showManualInvitationModal function not found');
                    showToast('Could not show manual invitation dialog. Check console for details.', 'error');
                }
                return;
            }

            // User created successfully, now create the profile
            const { data: profileData, error: profileError } = await supabaseClient
                .from('profiles')
                .insert([
                    {
                        id: userData.user.id,
                        first_name: doctorToInvite.first_name,
                        last_name: doctorToInvite.last_name,
                        email: doctorToInvite.email,
                        phone: doctorToInvite.phone,
                        role: 'doctor'
                    }
                ]);

            if (profileError) {
                console.error('Error creating profile:', profileError);
                showToast(`User created but profile creation failed: ${profileError.message}`, 'warning');
                
                // Update the doctor status to indicate auth is created but profile failed
                updatePendingDoctorStatus(doctorId, 'auth_created_only');
                return;
            }

            // Create the doctor record
            const { data: doctorData, error: doctorError } = await supabaseClient
                .from('doctors')
                .insert([
                    {
                        id: userData.user.id,
                        specialization: doctorToInvite.specialization,
                        license_number: doctorToInvite.license_number,
                        qualification: doctorToInvite.qualification,
                        experience_years: doctorToInvite.experience_years,
                        consultation_fee: doctorToInvite.consultation_fee,
                        department: doctorToInvite.department
                    }
                ]);

            if (doctorError) {
                console.error('Error creating doctor record:', doctorError);
                showToast(`Profile created but doctor record creation failed: ${doctorError.message}`, 'warning');
                
                // Update the doctor status to indicate auth and profile are created but doctor record failed
                updatePendingDoctorStatus(doctorId, 'profile_created_only');
                return;
            }

            // Everything was successful, remove from pending list
            removePendingDoctor(doctorId);
            
            // Show success message
            showToast(`Doctor ${doctorToInvite.first_name} ${doctorToInvite.last_name} registered successfully!`, 'success');
            
            // Refresh the doctors table
            fetchDoctorsData();
            
        } catch (error) {
            console.error('Error in inviteDoctor:', error);
            showToast(`An unexpected error occurred: ${error.message}`, 'error');
            
            // Update the doctor status to indicate invitation failed
            updatePendingDoctorStatus(doctorId, 'invitation_failed');
            
            // Show manual invitation option
            showManualInvitationModal(doctorToInvite);
        }
        
        // Add to registered doctors
        const registeredDoctors = JSON.parse(localStorage.getItem('registeredDoctors') || '[]');
        registeredDoctors.push({
            ...doctorToInvite,
            status: 'registered'
        });
        localStorage.setItem('registeredDoctors', JSON.stringify(registeredDoctors));
        
        // Refresh the doctors list
        fetchDoctorsData();
        
        // Show success message
        alert(`Doctor account created successfully!\n\nEmail: ${email}\nPassword: ${doctorToInvite.password}\n\nPlease share these credentials with the doctor. They can log in immediately without email verification.`);
    } catch (error) {
        console.error('Error in inviteDoctor:', error);
        alert('Error registering doctor: ' + error.message);
    }
};

// Function to set up the edit doctor modal
const setupEditDoctorModal = () => {
    // Close button functionality
    const closeEditModalBtn = document.getElementById('close-edit-doctor-modal');
    const editDoctorModal = document.getElementById('edit-doctor-modal');
    
    if (closeEditModalBtn && editDoctorModal) {
        closeEditModalBtn.addEventListener('click', () => {
            editDoctorModal.classList.add('hidden');
        });
    }
    
    // Form submission
    const editDoctorForm = document.getElementById('edit-doctor-form');
    if (editDoctorForm) {
        editDoctorForm.addEventListener('submit', saveEditedDoctor);
    }
};

// Initialize doctor management functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setupEditDoctorModal();
});

// Function to resend verification email to unverified doctors
const resendVerificationEmail = async (doctorId, email) => {
    try {
        // Show loading state
        showToast('Sending verification email...', 'info');
        
        // Check if we're online
        if (!navigator.onLine) {
            showToast('You are offline. Please try again when you have an internet connection.', 'warning');
            return;
        }

        // Make sure we have a reference to the admin client
        if (typeof supabaseAdmin === 'undefined') {
            if (typeof window.supabaseAdminClient !== 'undefined') {
                window.supabaseAdmin = window.supabaseAdminClient;
                console.log('Created supabaseAdmin alias for supabaseAdminClient');
            } else {
                throw new Error('Admin client not available. Check your supabase-admin-config.js file.');
            }
        }
        
        // Get doctor profile data
        const { data: doctorData, error: doctorError } = await supabaseClient
            .from('doctors')
            .select('id, profiles (first_name, last_name)')
            .eq('id', doctorId)
            .single();
            
        if (doctorError) {
            console.error('Error fetching doctor data:', doctorError);
            showToast(`Error fetching doctor data: ${doctorError.message}`, 'error');
            return;
        }
        
        // For existing users, we need to send a password reset email instead of an invitation
        // This will allow them to verify their email by clicking the reset link
        const { error: emailError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: email,
            options: {
                redirectTo: window.location.origin + '/login.html'
            }
        });
        
        if (emailError) {
            console.error('Error sending verification email:', emailError);
            showToast(`Error sending verification email: ${emailError.message}`, 'error');
            return;
        }
        
        // Show success message
        showToast(`Verification email sent to ${email}`, 'success');
        
        // Get doctor name for the alert
        const doctorName = doctorData.profiles ? 
            `${doctorData.profiles.first_name} ${doctorData.profiles.last_name}` : 
            email;
            
        // Display confirmation about the password reset email using toast
        showToast(`Password reset email sent to ${email}`, 'success', 5000);
        showToast(`Please inform the doctor to check their inbox and spam folder`, 'info', 5000);
        showToast(`When they reset their password, their email will be verified`, 'info', 5000);
        
        // Refresh the pending doctors table
        refreshPendingDoctorsTable();
        
    } catch (error) {
        console.error('Error in resendVerificationEmail:', error);
        showToast(`An unexpected error occurred: ${error.message}`, 'error');
    }
};

// Function to manually verify a doctor's email
const manuallyVerifyDoctor = async (doctorId, email) => {
    try {
        // Show loading state
        showToast('Verifying doctor account...', 'info');
        
        // Check if we're online
        if (!navigator.onLine) {
            showToast('You are offline. Please try again when you have an internet connection.', 'warning');
            return;
        }

        // Make sure we have a reference to the admin client
        if (typeof supabaseAdmin === 'undefined') {
            if (typeof window.supabaseAdminClient !== 'undefined') {
                window.supabaseAdmin = window.supabaseAdminClient;
                console.log('Created supabaseAdmin alias for supabaseAdminClient');
            } else {
                throw new Error('Admin client not available. Check your supabase-admin-config.js file.');
            }
        }
        
        // Get doctor profile data
        const { data: doctorData, error: doctorError } = await supabaseClient
            .from('doctors')
            .select('id, profiles (first_name, last_name)')
            .eq('id', doctorId)
            .single();
            
        if (doctorError) {
            console.error('Error fetching doctor data:', doctorError);
            showToast(`Error fetching doctor data: ${doctorError.message}`, 'error');
            return;
        }
        
        // First try to directly update the user's email_verified status in the profiles table
        const { error: profileUpdateError } = await supabaseClient
            .from('profiles')
            .update({ email_verified: true })
            .eq('id', doctorId);
            
        if (profileUpdateError) {
            console.error('Error updating profile email_verified status:', profileUpdateError);
            showToast(`Error updating profile: ${profileUpdateError.message}`, 'warning');
            // Continue anyway as we'll try the admin method next
        }
        
        // Also try to update the user's email verification status using the admin API
        const { error: adminUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
            doctorId,
            { email_confirm: true }
        );
        
        if (adminUpdateError) {
            console.error('Error updating user verification status:', adminUpdateError);
            showToast(`Error updating verification status: ${adminUpdateError.message}`, 'error');
            return;
        }
        
        // Show success message
        showToast(`Doctor account verified successfully`, 'success');
        
        // Get doctor name for the alert
        const doctorName = doctorData.profiles ? 
            `${doctorData.profiles.first_name} ${doctorData.profiles.last_name}` : 
            email;
            
        // Display confirmation about the manual verification using toast
        showToast(`Doctor account for ${doctorName} has been manually verified`, 'success', 5000);
        showToast(`The doctor can now log in directly without email verification`, 'info', 5000);
        showToast(`Login credentials: ${email} (with registration password)`, 'info', 5000);
        
        // Refresh the pending doctors table
        refreshPendingDoctorsTable();
        
        // Also refresh the active doctors table since this doctor should now appear there
        if (typeof fetchDoctorsData === 'function') {
            fetchDoctorsData();
        }
        
    } catch (error) {
        console.error('Error in manuallyVerifyDoctor:', error);
        showToast(`An unexpected error occurred: ${error.message}`, 'error');
    }
};

// Make functions available globally
window.editDoctor = editDoctor;
window.deleteDoctor = deleteDoctor;
window.inviteDoctor = inviteDoctor;
window.resendVerificationEmail = resendVerificationEmail;
window.manuallyVerifyDoctor = manuallyVerifyDoctor;
