/**
 * Registration System for Hospital Management System
 * Handles registration of doctors, patients, and receptionists
 * with a step-by-step process and progress indicators
 */

// Use a self-executing function to create a module scope and prevent global namespace pollution
(function() {
// Check if we've already initialized this module to prevent duplicate declarations
if (window.registrationInitialized) {
    return; // Already initialized, don't redefine functions
}
window.registrationInitialized = true;

// Base Registration Strategy class
class RegistrationStrategy {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.registrationData = {};
        this.userRole = '';
    }

    // Initialize the registration process
    initRegistration() {
        console.log('Initializing ' + this.userRole + ' registration');
        this.showProgressSteps();
        this.navigateToStep(1);
    }

    // Show the progress steps UI
    showProgressSteps() {
        // Show progress steps
        document.getElementById('progress-steps').classList.remove('hidden');
        
        // Update step 2 and 3 labels based on role
        document.getElementById('step-2-label').textContent = this.getStep2Label();
        document.getElementById('step-3-label').textContent = this.getStep3Label();
    }

    // Get label for step 2 (override in subclasses)
    getStep2Label() {
        return 'Details';
    }

    // Get label for step 3 (override in subclasses)
    getStep3Label() {
        return 'Additional';
    }

    // Navigate to a specific step
    navigateToStep(stepNumber) {
        this.currentStep = stepNumber;
        this.updateProgressIndicators();
        this.renderStepContent();
    }

    // Update progress indicators based on current step
    updateProgressIndicators() {
        // Update step indicators
        for (let i = 1; i <= this.totalSteps; i++) {
            const indicator = document.getElementById(`step-${i}-indicator`);
            
            if (i < this.currentStep) {
                // Completed step
                indicator.className = 'step-indicator completed';
                indicator.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            } else if (i === this.currentStep) {
                // Current step
                indicator.className = 'step-indicator active';
                indicator.textContent = i;
            } else {
                // Future step
                indicator.className = 'step-indicator bg-gray-200';
                indicator.textContent = i;
            }
        }
        
        // Update connectors
        for (let i = 1; i < this.totalSteps; i++) {
            const connector = document.getElementById(`connector-${i}-${i+1}`);
            
            if (i < this.currentStep) {
                connector.className = 'step-connector completed';
            } else if (i === this.currentStep) {
                connector.className = 'step-connector active';
            } else {
                connector.className = 'step-connector';
            }
        }
    }

    // Render the content for the current step
    renderStepContent() {
        const container = document.getElementById('registration-form-container');
        
        // Clear container
        container.innerHTML = '';
        
        // Create form container
        const form = document.createElement('form');
        form.id = this.userRole + '-registration-form-step-' + this.currentStep;
        form.className = 'space-y-6';
        
        // Add step content
        this.createStepContent(form);
        
        // Add navigation buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flex justify-between mt-6';
        
        // Previous button (except for first step)
        if (this.currentStep > 1) {
            const prevButton = document.createElement('button');
            prevButton.type = 'button';
            prevButton.className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300';
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => this.navigateToStep(this.currentStep - 1));
            buttonsContainer.appendChild(prevButton);
        } else {
            // Empty div for spacing
            const spacer = document.createElement('div');
            buttonsContainer.appendChild(spacer);
        }
        
        // Next/Submit button
        const nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.className = 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700';
        
        if (this.currentStep === this.totalSteps) {
            nextButton.textContent = 'Complete Registration';
            nextButton.addEventListener('click', () => this.completeRegistration());
        } else {
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => this.processStep());
        }
        
        buttonsContainer.appendChild(nextButton);
        form.appendChild(buttonsContainer);
        
        // Add error message container
        const errorContainer = document.createElement('div');
        errorContainer.id = 'registration-error';
        errorContainer.className = 'mt-4 text-red-600 hidden';
        form.appendChild(errorContainer);
        
        // Add form to container
        container.appendChild(form);
    }

    // Get the title for the current step
    getStepTitle() {
        switch (this.currentStep) {
            case 1:
                return 'Account Information';
            case 2:
                return this.getStep2Title();
            case 3:
                return this.getStep3Title();
            case 4:
                return 'Confirm Registration';
            default:
                return 'Registration';
        }
    }

    // Get title for step 2 (override in subclasses)
    getStep2Title() {
        return 'Personal Details';
    }

    // Get title for step 3 (override in subclasses)
    getStep3Title() {
        return 'Additional Information';
    }

    // Create content for the current step (override in subclasses)
    createStepContent(form) {
        switch (this.currentStep) {
            case 1:
                this.createAccountInfoStep(form);
                break;
            case 2:
                this.createDetailsStep(form);
                break;
            case 3:
                this.createAdditionalInfoStep(form);
                break;
            case 4:
                this.createConfirmationStep(form);
                break;
        }
    }

    // Create account information step (common for all roles)
    createAccountInfoStep(form) {
        // Create form without header
        
        // Create form grid with 2 columns for desktop
        const formGrid = document.createElement('div');
        formGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
        
        // Use enhanced form fields if available, otherwise fall back to basic form fields
        const createField = window.createEnhancedFormField || this.createFormField;
        
        // Email field
        const emailField = createField(
            'email',
            'Email Address',
            'email',
            'Enter email address',
            true
        );
        
        // Password field
        const passwordField = createField(
            'password',
            'Password',
            'password',
            'Enter password',
            true
        );
        
        // First name field
        const firstNameField = createField(
            'first_name',
            'First Name',
            'text',
            'Enter first name',
            true
        );
        
        // Last name field
        const lastNameField = createField(
            'last_name',
            'Last Name',
            'text',
            'Enter last name',
            true
        );
        
        // Add fields to form grid
        formGrid.appendChild(emailField);
        formGrid.appendChild(passwordField);
        formGrid.appendChild(firstNameField);
        formGrid.appendChild(lastNameField);
        
        // Phone field in full width
        const phoneContainer = document.createElement('div');
        phoneContainer.className = 'col-span-1 md:col-span-2';
        
        const phoneField = createField(
            'phone',
            'Phone Number',
            'tel',
            'Enter phone number',
            true
        );
        
        phoneContainer.appendChild(phoneField);
        formGrid.appendChild(phoneContainer);
        
        // Add form grid to main form
        form.appendChild(formGrid);
    }

    // Create details step (override in subclasses)
    createDetailsStep(form) {
        // To be implemented in subclasses
    }

    // Create additional info step (override in subclasses)
    createAdditionalInfoStep(form) {
        // To be implemented in subclasses
    }

    // Create confirmation step with enhanced visual appearance
    createConfirmationStep(form) {
        // Create header with icon
        const header = document.createElement('div');
        header.className = 'bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500 shadow-md mb-6';
        header.innerHTML = 
            '<div class="flex items-center">'+
                '<div class="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">'+
                    '<svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">'+
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />'+
                    '</svg>'+
                '</div>'+
                '<div>'+
                    '<h2 class="text-xl font-bold text-gray-800 mb-1">Confirm Registration</h2>'+
                    '<p class="text-gray-600">Please review your information before completing registration.</p>'+
                '</div>'+
            '</div>';
        form.appendChild(header);
        
        // Create review section with enhanced styling
        const reviewSection = document.createElement('div');
        reviewSection.className = 'bg-white p-6 rounded-lg shadow-md border border-gray-200';
        
        // Create data review table with better styling
        const reviewTable = document.createElement('div');
        reviewTable.className = 'divide-y divide-gray-200 -mx-6';
        
        // Add common fields
        this.addReviewRow(reviewTable, 'Email', this.registrationData.email);
        this.addReviewRow(reviewTable, 'Name', this.registrationData.first_name + ' ' + this.registrationData.last_name);
        this.addReviewRow(reviewTable, 'Phone', this.registrationData.phone);
        
        // Add role-specific fields
        this.addRoleSpecificReviewFields(reviewTable);
        
        reviewSection.appendChild(reviewTable);
        
        // Add note about email verification with icon
        const emailNoteContainer = document.createElement('div');
        emailNoteContainer.className = 'mt-6 p-4 bg-blue-50 rounded-md border border-blue-100';
        emailNoteContainer.innerHTML = 
            '<div class="flex">'+
                '<div class="flex-shrink-0">'+
                    '<svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                        '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />'+
                    '</svg>'+
                '</div>'+
                '<div class="ml-3">'+
                    '<p class="text-sm text-blue-700">'+
                        'A verification email will be sent to your email address. You will need to verify your email before you can log in.'+
                    '</p>'+
                '</div>'+
            '</div>';
        reviewSection.appendChild(emailNoteContainer);
        
        form.appendChild(reviewSection);
    }

    // Add a row to the review table with enhanced styling
    addReviewRow(container, label, value) {
        const row = document.createElement('div');
        row.className = 'flex py-4 px-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150';
        
        // Label cell with icon container
        const labelCell = document.createElement('div');
        labelCell.className = 'w-1/3 flex items-center';
        
        // Create icon based on label type
        const iconContainer = document.createElement('div');
        iconContainer.className = 'mr-3 flex-shrink-0';
        
        // Determine which icon to use based on the label
        let iconSvg = '';
        if (label.toLowerCase().includes('email')) {
            iconSvg = '<svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>';
        } else if (label.toLowerCase().includes('name')) {
            iconSvg = '<svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>';
        } else if (label.toLowerCase().includes('phone')) {
            iconSvg = '<svg class="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>';
        } else if (label.toLowerCase().includes('address')) {
            iconSvg = '<svg class="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>';
        } else if (label.toLowerCase().includes('date')) {
            iconSvg = '<svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>';
        } else if (label.toLowerCase().includes('gender')) {
            iconSvg = '<svg class="h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>';
        } else {
            iconSvg = '<svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>';
        }
        
        iconContainer.innerHTML = iconSvg;
        
        // Label text
        const labelText = document.createElement('span');
        labelText.className = 'font-medium text-sm text-gray-700';
        labelText.textContent = label;
        
        labelCell.appendChild(iconContainer);
        labelCell.appendChild(labelText);
        
        // Value cell with better styling
        const valueCell = document.createElement('div');
        valueCell.className = 'w-2/3 text-sm text-gray-800 font-medium';
        
        // If value is empty, show a placeholder with different styling
        if (!value) {
            const emptyValue = document.createElement('span');
            emptyValue.className = 'text-gray-400 italic';
            emptyValue.textContent = 'Not provided';
            valueCell.appendChild(emptyValue);
        } else {
            valueCell.textContent = value;
        }
        
        row.appendChild(labelCell);
        row.appendChild(valueCell);
        container.appendChild(row);
    }
    
    // Create form field with label and input/select
    createFormField(id, label, type, placeholder, required, options) {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'mb-4';
        
        // Create label
        const fieldLabel = document.createElement('label');
        fieldLabel.htmlFor = id;
        fieldLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
        fieldLabel.textContent = label;
        
        // Create input or select
        let fieldInput;
        
        if (options) {
            // Create select element
            fieldInput = document.createElement('select');
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = placeholder;
            defaultOption.disabled = true;
            defaultOption.selected = true;
            fieldInput.appendChild(defaultOption);
            
            // Add options
            options.forEach(option => {
                const optionEl = document.createElement('option');
                optionEl.value = option.value;
                optionEl.textContent = option.label;
                fieldInput.appendChild(optionEl);
            });
        } else {
            // Create regular input
            fieldInput = document.createElement('input');
            fieldInput.type = type;
            fieldInput.placeholder = placeholder;
        }
        
        // Common attributes
        fieldInput.id = id;
        fieldInput.name = id;
        fieldInput.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500';
        
        if (required) {
            fieldInput.required = true;
        }
        
        // Set value if exists in registration data
        if (this.registrationData[id]) {
            if (options) {
                fieldInput.value = this.registrationData[id];
            } else if (type !== 'password') {
                fieldInput.value = this.registrationData[id];
            }
        }
        
        // Add elements to container
        fieldContainer.appendChild(fieldLabel);
        fieldContainer.appendChild(fieldInput);
        
        return fieldContainer;
    }

    // Process the current step
    processStep() {
        // Validate form
        if (!this.validateStep()) {
            return;
        }
        
        // Get form data
        this.collectFormData();
        
        // Process step-specific logic
        if (this.currentStep === 1) {
            // Check if email exists before proceeding
            this.checkEmailExists(this.registrationData.email)
                .then(exists => {
                    if (exists) {
                        this.showError('This email is already registered. Please use a different email address.');
                    } else {
                        this.navigateToStep(this.currentStep + 1);
                    }
                })
                .catch(error => {
                    console.error('Error checking email:', error);
                    this.showError('An error occurred while checking email. Please try again.');
                });
        } else if (this.currentStep === 3 && this.registrationData.department_id) {
            // If department_id is selected, fetch department name before proceeding
            this.fetchDepartmentName()
                .then(() => {
                    if (this.currentStep === this.totalSteps) {
                        this.completeRegistration();
                    } else {
                        this.navigateToStep(this.currentStep + 1);
                    }
                })
                .catch(error => {
                    console.error('Error fetching department:', error);
                    // Continue anyway, department name is not critical
                    if (this.currentStep === this.totalSteps) {
                        this.completeRegistration();
                    } else {
                        this.navigateToStep(this.currentStep + 1);
                    }
                });
        } else {
            // For other steps, just move to next step
            if (this.currentStep === this.totalSteps) {
                this.completeRegistration();
            } else {
                this.navigateToStep(this.currentStep + 1);
            }
        }
    }
    
    // Fetch department name for the selected department_id
    async fetchDepartmentName() {
        try {
            if (!this.registrationData.department_id) return;
            
            const { data, error } = await window.supabaseClient
                .from('departments')
                .select('name')
                .eq('id', this.registrationData.department_id)
                .single();
                
            if (error) {
                console.error('Error fetching department name:', error);
                return;
            }
            
            if (data && data.name) {
                this.registrationData.department_name = data.name;
                console.log('Department name fetched:', data.name);
            }
        } catch (error) {
            console.error('Error in fetchDepartmentName:', error);
        }
    };

    // Validate the current step
    validateStep() {
        const form = document.getElementById(this.userRole + '-registration-form-step-' + this.currentStep);
        
        // Check required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('border-red-500');
                isValid = false;
            } else {
                field.classList.remove('border-red-500');
            }
        });
        
        if (!isValid) {
            this.showError('Please fill in all required fields.');
            return false;
        }
        
        // Additional validation based on step
        if (this.currentStep === 1) {
            // Validate email format
            const emailField = form.querySelector('[name="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(emailField.value)) {
                emailField.classList.add('border-red-500');
                this.showError('Please enter a valid email address.');
                return false;
            }
            
            // Validate password length
            const passwordField = form.querySelector('[name="password"]');
            if (passwordField.value.length < 6) {
                passwordField.classList.add('border-red-500');
                this.showError('Password must be at least 6 characters long.');
                return false;
            }
        }
        
        // Additional step-specific validation
        return this.validateStepSpecific();
    }

    // Additional step-specific validation (override in subclasses)
    validateStepSpecific() {
        return true;
    }

    // Collect form data from the current step
    collectFormData() {
        const form = document.getElementById(this.userRole + '-registration-form-step-' + this.currentStep);
        const formData = new FormData(form);
        
        // Update registration data with form values
        for (const [key, value] of formData.entries()) {
            this.registrationData[key] = value;
        }
        
        // Special handling for checkboxes (they don't appear in FormData if unchecked)
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!formData.has(checkbox.name)) {
                // For checkboxes with same name (like available_days), we need to handle differently
                if (this.registrationData[checkbox.name] && Array.isArray(this.registrationData[checkbox.name])) {
                    // Keep the array, just don't add this value
                } else {
                    this.registrationData[checkbox.name] = false;
                }
            } else if (checkbox.name.includes('available_days')) {
                // Special handling for available days checkboxes
                if (!Array.isArray(this.registrationData.available_days)) {
                    this.registrationData.available_days = [];
                }
                this.registrationData.available_days.push(checkbox.value);
            }
        });
    }

    // Check if email already exists in the database
    async checkEmailExists(email) {
        try {
            const { data, error } = await window.supabaseClient
                .from('profiles')
                .select('id')
                .eq('email', email)
                .maybeSingle();
            
            if (error && error.code !== 'PGRST116') {
                console.error('Error checking email:', error);
                throw new Error('Error checking email');
            }
            
            return !!data;
        } catch (error) {
            console.error('Error in checkEmailExists:', error);
            throw error;
        }
    }

    // Show error message
    showError(message) {
        const errorContainer = document.getElementById('registration-error');
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    }

    // Hide error message
    hideError() {
        const errorContainer = document.getElementById('registration-error');
        errorContainer.textContent = '';
        errorContainer.classList.add('hidden');
    }

    // Complete registration process
    async completeRegistration() {
        try {
            // Show loading state
            this.showLoading();
            
            // Create user in Supabase Auth
            const userId = await this.createUserInSupabase();
            
            // Create profile record
            await this.createProfileRecord(userId);
            
            // Create role-specific records
            await this.createRoleSpecificRecords(userId);
            
            // Show success message - no automatic reset
            this.showSuccess();
            
            // Log completion of registration
            console.log(`${this.userRole} registration completed successfully`);
            
            // We've removed the automatic reset to prevent immediate transition
            // The user will need to click a button to close or start a new registration
        } catch (error) {
            console.error('Error completing registration:', error);
            this.showError(`Registration failed: ${error.message}`);
        }
    }

    // Create user in Supabase Auth
    async createUserInSupabase() {
        try {
            // Check if supabaseAdmin is defined
            if (typeof window.supabaseAdmin === 'undefined') {
                if (typeof window.supabaseAdminClient !== 'undefined') {
                    window.supabaseAdmin = window.supabaseAdminClient;
                    console.log('Created supabaseAdmin alias for supabaseAdminClient');
                } else {
                    throw new Error('Admin client not available. Check your supabase-admin-config.js file.');
                }
            }
            
            // Log the email being used for registration
            console.log('Attempting to create user with email:', this.registrationData.email);
            
            // Create user with admin API - setting email_confirm to true to auto-verify in auth.users table
            // The profiles table will still have email_verified set to false for manual verification
            const { data, error } = await window.supabaseAdmin.auth.admin.createUser({
                email: this.registrationData.email,
                password: this.registrationData.password,
                email_confirm: true, // Auto-verify in auth.users table
                user_metadata: {
                    first_name: this.registrationData.first_name,
                    last_name: this.registrationData.last_name,
                    role: this.userRole
                }
            });
            
            // If user created successfully, send a verification email
            if (!error && data.user) {
                try {
                    // Send a proper verification email instead of a magic link
                    const { error: verificationError } = await window.supabaseAdmin.auth.admin.generateLink({
                        type: 'signup',
                        email: this.registrationData.email,
                        options: {
                            redirectTo: window.location.origin + '/login.html'
                        }
                    });
                    
                    if (verificationError) {
                        console.error('Error sending verification email:', verificationError);
                        // Continue with registration even if verification email fails
                    } else {
                        console.log('Verification email sent successfully to:', this.registrationData.email);
                    }
                } catch (verificationError) {
                    console.error('Exception sending verification email:', verificationError);
                    // Continue with registration even if verification email fails
                }
            }
            
            if (error) {
                console.error('Error creating user:', error);
                throw new Error(`Failed to create user account: ${error.message}`);
            }
            
            console.log('User created successfully:', data);
            return data.user.id;
        } catch (error) {
            console.error('Error in createUserInSupabase:', error);
            throw error;
        }
    }

    // Create profile record
    async createProfileRecord(userId) {
        try {
            // First check if a profile already exists for this user
            const { data: existingProfile } = await window.supabaseClient
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .maybeSingle();
            
            // Prepare common profile data
            const profileData = {
                first_name: this.registrationData.first_name,
                last_name: this.registrationData.last_name,
                email: this.registrationData.email,
                phone: this.registrationData.phone,
                role: this.userRole,
                // Add additional fields based on role
                address: this.registrationData.address || null,
                date_of_birth: this.registrationData.date_of_birth || null,
                gender: this.registrationData.gender || null,
                profile_image_url: this.registrationData.profile_image_url || null,
                // Add department information
                department: this.registrationData.department_id ? 
                    // If we have a department ID, we need to get the department name
                    // This will be populated in the role-specific methods
                    this.registrationData.department_name || null : null,
                // Fields that might be specific to doctors
                specialization: this.userRole === 'doctor' ? this.registrationData.specialization : null,
                license_number: this.userRole === 'doctor' ? this.registrationData.license_number : null,
                specialty: this.userRole === 'doctor' ? this.registrationData.specialization : null,
                // Fields that might be specific to patients
                blood_group: this.userRole === 'patient' ? this.registrationData.blood_group : null,
                allergies: this.userRole === 'patient' && this.registrationData.allergies ? 
                    Array.isArray(this.registrationData.allergies) ? 
                        this.registrationData.allergies : 
                        [this.registrationData.allergies] : 
                    null,
                email_verified: false
            };
                
            if (existingProfile) {
                // Profile already exists, update it instead
                console.log('Profile already exists, updating it');
                const { error: updateError } = await window.supabaseClient
                    .from('profiles')
                    .update({
                        ...profileData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId);
                    
                if (updateError) {
                    console.error('Error updating profile:', updateError);
                    throw new Error(`Failed to update profile: ${updateError.message}`);
                }
                
                console.log('Profile updated successfully');
            } else {
                // Profile doesn't exist, create a new one
                const { error } = await window.supabaseClient
                    .from('profiles')
                    .insert([
                        {
                            id: userId,
                            ...profileData,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    ]);
                
                if (error) {
                    console.error('Error creating profile:', error);
                    throw new Error(`Failed to create profile: ${error.message}`);
                }
                
                console.log('Profile created successfully');
            }
        } catch (error) {
            console.error('Error in createProfileRecord:', error);
            throw error;
        }
    }

    // Create role-specific records (override in subclasses)
    async createRoleSpecificRecords(userId) {
        // To be implemented in subclasses
    }

    // Show loading state
    showLoading() {
        const form = document.getElementById(`${this.userRole}-registration-form-step-${this.currentStep}`);
        const buttons = form.querySelectorAll('button');
        
        // Disable buttons
        buttons.forEach(button => {
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
        });
        
        // Add loading indicator
        const completeButton = buttons[buttons.length - 1];
        completeButton.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...';
    }

    // Show success message
    showSuccess() {
        const container = document.getElementById('registration-form-container');
        
        // Clear container
        container.innerHTML = '';
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'text-center py-8';
        successMessage.innerHTML = `
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h3 class="mt-3 text-lg font-medium text-gray-900">Registration Successful!</h3>
            <p class="mt-2 text-sm text-gray-500">
                A verification email has been sent to ${this.registrationData.email}.<br>
                The user must verify their email before they can log in.
            </p>
            <div class="mt-6">
                <button type="button" id="new-registration-btn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Register Another User
                </button>
            </div>
        `;
        
        container.appendChild(successMessage);
        
        // Add event listener to new registration button
        document.getElementById('new-registration-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }

    // Reset registration form
    resetRegistration() {
        // Hide progress steps
        document.getElementById('progress-steps').classList.add('hidden');
        
        // Clear registration data
        this.registrationData = {};
        
        // Reset to initial state
        const container = document.getElementById('registration-form-container');
        container.innerHTML = '<p class="text-center text-gray-500">Please select a registration type above to begin.</p>';
    }
}

// Doctor Registration Strategy
class DoctorRegistrationStrategy extends RegistrationStrategy {
    constructor() {
        super();
        this.userRole = 'doctor';
    }

    getStep2Label() {
        return 'Professional';
    }

    getStep3Label() {
        return 'Department';
    }

    getStep2Title() {
        return 'Professional Details';
    }

    getStep3Title() {
        return 'Department & Availability';
    }

    createDetailsStep(form) {
        
        // Create form grid with 2 columns for desktop
        const formGrid = document.createElement('div');
        formGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
        
        // Use enhanced form fields if available, otherwise fall back to basic form fields
        const createField = window.createEnhancedFormField || this.createFormField;
        
        // Specialization field - using dropdown instead of text input
        const specializationContainer = document.createElement('div');
        specializationContainer.className = 'md:col-span-2 space-y-2 mb-4';
        
        const specializationLabel = document.createElement('label');
        specializationLabel.htmlFor = 'specialization';
        specializationLabel.className = 'block text-sm font-medium text-gray-700';
        
        // Add label text with required indicator
        const specializationLabelText = document.createTextNode('Specialty');
        specializationLabel.appendChild(specializationLabelText);
        
        const specRequiredSpan = document.createElement('span');
        specRequiredSpan.className = 'text-red-500 ml-1';
        specRequiredSpan.textContent = '*';
        specializationLabel.appendChild(specRequiredSpan);
        
        // Create select dropdown
        const specializationSelect = document.createElement('select');
        specializationSelect.id = 'specialization';
        specializationSelect.name = 'specialization';
        specializationSelect.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200';
        specializationSelect.required = true;
        
        // Add specialization options
        const specializations = [
            '',
            'Cardiology',
            'Dermatology',
            'Endocrinology',
            'Gastroenterology',
            'General Medicine',
            'Gynecology',
            'Hematology',
            'Neurology',
            'Oncology',
            'Ophthalmology',
            'Orthopedics',
            'Pediatrics',
            'Psychiatry',
            'Pulmonology',
            'Radiology',
            'Urology',
            'Other'
        ];
        
        // Create options and add to select
        specializations.forEach(spec => {
            const option = document.createElement('option');
            option.value = spec;
            option.textContent = spec || 'Select a specialization';
            if (!spec) {
                option.disabled = true;
                option.selected = true;
            }
            
            // If we have saved data, select the correct option
            if (this.registrationData.specialization === spec) {
                option.selected = true;
            }
            
            specializationSelect.appendChild(option);
        });
        
        // Add elements to container
        specializationContainer.appendChild(specializationLabel);
        specializationContainer.appendChild(specializationSelect);
        
        // Set as specializationField for appending to form
        const specializationField = specializationContainer;
        
        // License number field
        const licenseField = createField(
            'license_number',
            'License Number',
            'text',
            'Enter license number',
            true
        );
        
        // Qualification field
        const qualificationField = createField(
            'qualification',
            'Qualification',
            'text',
            'Enter qualification',
            true
        );
        
        // Experience years field - with increased height
        const experienceContainer = document.createElement('div');
        experienceContainer.className = 'md:col-span-2 space-y-2 mb-4';
        
        const experienceLabel = document.createElement('label');
        experienceLabel.htmlFor = 'experience_years';
        experienceLabel.className = 'block text-sm font-medium text-gray-700';
        
        // Add label text with required indicator
        const experienceLabelText = document.createTextNode('Years of Experience');
        experienceLabel.appendChild(experienceLabelText);
        
        const expRequiredSpan = document.createElement('span');
        expRequiredSpan.className = 'text-red-500 ml-1';
        expRequiredSpan.textContent = '*';
        experienceLabel.appendChild(expRequiredSpan);
        
        // Create input with increased height
        const experienceInput = document.createElement('input');
        experienceInput.type = 'number';
        experienceInput.id = 'experience_years';
        experienceInput.name = 'experience_years';
        experienceInput.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3';
        experienceInput.placeholder = 'Enter years of experience';
        experienceInput.min = '0';
        experienceInput.required = true;
        
        // If we have saved data, set the value
        if (this.registrationData.experience_years) {
            experienceInput.value = this.registrationData.experience_years;
        }
        
        // Add elements to container
        experienceContainer.appendChild(experienceLabel);
        experienceContainer.appendChild(experienceInput);
        
        // Set as experienceField for appending to form
        const experienceField = experienceContainer;
        
        // Add fields to form grid
        formGrid.appendChild(specializationField);
        formGrid.appendChild(licenseField);
        formGrid.appendChild(qualificationField);
        formGrid.appendChild(experienceField);
        
        // Consultation fee field with enhanced styling
        const feeContainer = document.createElement('div');
        feeContainer.className = 'md:col-span-2 space-y-2 mb-4';
        
        const feeLabel = document.createElement('label');
        feeLabel.htmlFor = 'consultation_fee';
        feeLabel.className = 'block text-sm font-medium text-gray-700';
        
        // Add required indicator
        const feeLabelText = document.createTextNode('Consultation Fee');
        feeLabel.appendChild(feeLabelText);
        
        const feeRequiredSpan = document.createElement('span');
        feeRequiredSpan.className = 'text-red-500 ml-1';
        feeRequiredSpan.textContent = '*';
        feeLabel.appendChild(feeRequiredSpan);
        
        const feeInputWrapper = document.createElement('div');
        feeInputWrapper.className = 'relative rounded-md shadow-sm';
        
        // Add dollar icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none';
        iconContainer.innerHTML = `
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95a1 1 0 001.715 1.029zM6 12a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm7 0a1 1 0 011-1h.01a1 1 0 110 2H14a1 1 0 01-1-1zm-7 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
        `;
        
        const feeInput = document.createElement('input');
        feeInput.type = 'number';
        feeInput.id = 'consultation_fee';
        feeInput.name = 'consultation_fee';
        feeInput.className = 'pl-10 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3';
        feeInput.placeholder = 'Enter consultation fee';
        feeInput.min = '0';
        feeInput.step = '0.01';
        feeInput.required = true;
        
        if (this.registrationData.consultation_fee) {
            feeInput.value = this.registrationData.consultation_fee;
        }
        
        // Add helper text
        const helperText = document.createElement('p');
        helperText.className = 'mt-1 text-sm text-gray-500';
        helperText.textContent = 'The consultation fee will be displayed to patients when they book appointments.';
        
        feeInputWrapper.appendChild(iconContainer);
        feeInputWrapper.appendChild(feeInput);
        
        feeContainer.appendChild(feeLabel);
        feeContainer.appendChild(feeInputWrapper);
        feeContainer.appendChild(helperText);
        
        formGrid.appendChild(feeContainer);
        
        // Add form grid to main form
        form.appendChild(formGrid);
    }

    createAdditionalInfoStep(form) {
        
        // Create form container
        const formContainer = document.createElement('div');
        formContainer.className = 'space-y-6';
        
        // Use enhanced form fields if available, otherwise fall back to basic form fields
        const createField = window.createEnhancedFormField || this.createFormField;
        
        // Department selection with enhanced styling
        const departmentContainer = document.createElement('div');
        departmentContainer.className = 'bg-white p-6 rounded-lg shadow-sm border border-gray-200';
        
        // Add section title
        const departmentTitle = document.createElement('h3');
        departmentTitle.className = 'text-lg font-medium text-gray-800 mb-4';
        departmentTitle.innerHTML = 
            '<div class="flex items-center">'+
                '<svg class="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                    '<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1v1a1 1 0 11-2 0v-1H7v1a1 1 0 11-2 0v-1a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />'+
                '</svg>'+
                'Department Assignment'+
            '</div>';
        departmentContainer.appendChild(departmentTitle);
        
        const departmentField = createField(
            'department_id',
            'Department',
            'select',
            'Select department',
            true,
            [] // Options will be populated from database
        );
        
        departmentContainer.appendChild(departmentField);
        
        // Add helper text
        const departmentHelper = document.createElement('p');
        departmentHelper.className = 'mt-2 text-sm text-gray-500';
        departmentHelper.textContent = 'Your department assignment determines which patients you will primarily serve.';
        departmentContainer.appendChild(departmentHelper);
        
        formContainer.appendChild(departmentContainer);
        
        // Available days with enhanced styling
        const daysContainer = document.createElement('div');
        daysContainer.className = 'bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6';
        
        // Add section title
        const daysTitle = document.createElement('h3');
        daysTitle.className = 'text-lg font-medium text-gray-800 mb-4';
        daysTitle.innerHTML = 
            '<div class="flex items-center">'+
                '<svg class="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                    '<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />'+
                '</svg>'+
                'Availability Schedule'+
            '</div>';
        daysContainer.appendChild(daysTitle);
        
        const daysLabel = document.createElement('label');
        daysLabel.className = 'block text-sm font-medium text-gray-700 mb-3';
        daysLabel.textContent = 'Select days you are available for appointments:';
        daysContainer.appendChild(daysLabel);
        
        const daysGrid = document.createElement('div');
        daysGrid.className = 'grid grid-cols-2 md:grid-cols-4 gap-3';
        
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        days.forEach(day => {
            const dayContainer = document.createElement('div');
            dayContainer.className = 'relative flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors duration-150';
            
            // Create checkbox wrapper for custom styling
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'flex items-center h-5';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `day_${day.toLowerCase()}`;
            checkbox.name = `available_days`;
            checkbox.value = day.toLowerCase();
            checkbox.className = 'h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0';
            
            checkboxWrapper.appendChild(checkbox);
            
            // Create label with better styling
            const labelDiv = document.createElement('div');
            labelDiv.className = 'ml-3 text-sm';
            
            const label = document.createElement('label');
            label.htmlFor = `day_${day.toLowerCase()}`;
            label.className = 'font-medium text-gray-700 cursor-pointer';
            label.textContent = day;
            
            labelDiv.appendChild(label);
            
            dayContainer.appendChild(checkboxWrapper);
            dayContainer.appendChild(labelDiv);
            daysGrid.appendChild(dayContainer);
        });
        
        daysContainer.appendChild(daysGrid);
        
        // Add helper text
        const daysHelper = document.createElement('p');
        daysHelper.className = 'mt-3 text-sm text-gray-500';
        daysHelper.textContent = 'Patients will only be able to book appointments on your available days.';
        daysContainer.appendChild(daysHelper);
        
        formContainer.appendChild(daysContainer);
        
        // Time slots with enhanced styling
        const timeContainer = document.createElement('div');
        timeContainer.className = 'bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6';
        
        // Add section title
        const timeTitle = document.createElement('h3');
        timeTitle.className = 'text-lg font-medium text-gray-800 mb-4';
        timeTitle.innerHTML = 
            '<div class="flex items-center">'+
                '<svg class="h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                    '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />'+
                '</svg>'+
                'Available Hours'+
            '</div>';
        timeContainer.appendChild(timeTitle);
        
        const timeLabel = document.createElement('label');
        timeLabel.className = 'block text-sm font-medium text-gray-700 mb-3';
        timeLabel.textContent = 'Set your daily working hours:';
        timeContainer.appendChild(timeLabel);
        
        // Create a grid for start and end time inputs
        const timeInputsGrid = document.createElement('div');
        timeInputsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-4';
        
        // Start Time Field
        const startTimeContainer = document.createElement('div');
        startTimeContainer.className = 'space-y-2';
        
        const startTimeLabel = document.createElement('label');
        startTimeLabel.htmlFor = 'start_time';
        startTimeLabel.className = 'block text-sm font-medium text-gray-700';
        startTimeLabel.textContent = 'Start Time';
        
        const startTimeInput = document.createElement('input');
        startTimeInput.type = 'time';
        startTimeInput.id = 'start_time';
        startTimeInput.name = 'start_time';
        startTimeInput.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3';
        startTimeInput.required = true;
        
        // Set default value (8 AM) if not already set
        if (this.registrationData.start_time) {
            startTimeInput.value = this.registrationData.start_time;
        } else {
            startTimeInput.value = '08:00';
        }
        
        startTimeContainer.appendChild(startTimeLabel);
        startTimeContainer.appendChild(startTimeInput);
        
        // End Time Field
        const endTimeContainer = document.createElement('div');
        endTimeContainer.className = 'space-y-2';
        
        const endTimeLabel = document.createElement('label');
        endTimeLabel.htmlFor = 'end_time';
        endTimeLabel.className = 'block text-sm font-medium text-gray-700';
        endTimeLabel.textContent = 'End Time';
        
        const endTimeInput = document.createElement('input');
        endTimeInput.type = 'time';
        endTimeInput.id = 'end_time';
        endTimeInput.name = 'end_time';
        endTimeInput.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3';
        endTimeInput.required = true;
        
        // Set default value (5 PM) if not already set
        if (this.registrationData.end_time) {
            endTimeInput.value = this.registrationData.end_time;
        } else {
            endTimeInput.value = '17:00';
        }
        
        endTimeContainer.appendChild(endTimeLabel);
        endTimeContainer.appendChild(endTimeInput);
        
        // Add time inputs to grid
        timeInputsGrid.appendChild(startTimeContainer);
        timeInputsGrid.appendChild(endTimeContainer);
        timeContainer.appendChild(timeInputsGrid);
        
        // Add helper text
        const timeHelper = document.createElement('p');
        timeHelper.className = 'mt-3 text-sm text-gray-500';
        timeHelper.textContent = 'These hours will be used to determine your availability for patient appointments during your selected working days.';
        timeContainer.appendChild(timeHelper);
        
        formContainer.appendChild(timeContainer);
        
        // Add a note about scheduling
        const noteContainer = document.createElement('div');
        noteContainer.className = 'mt-6 p-4 bg-blue-50 rounded-md border border-blue-100';
        noteContainer.innerHTML = `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-blue-700">
                        You can update your availability schedule at any time from your doctor dashboard after registration.
                    </p>
                </div>
            </div>
        `;
        formContainer.appendChild(noteContainer);
        
        // Add form container to main form
        form.appendChild(formContainer);
        
        // Populate departments dropdown
        this.populateDepartments();
    }
    
    // Populate departments dropdown
    async populateDepartments() {
        try {
            const { data, error } = await window.supabaseClient
                .from('departments')
                .select('id, name')
                .order('name');
            
            if (error) {
                console.error('Error fetching departments:', error);
                return;
            }
            
            const departmentSelect = document.getElementById('department_id');
            if (!departmentSelect) return;
            
            // Add departments to dropdown
            data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.id;
                option.textContent = department.name;
                departmentSelect.appendChild(option);
            });
            
            // Set selected department if available in registration data
            if (this.registrationData.department_id) {
                departmentSelect.value = this.registrationData.department_id;
            }
        } catch (error) {
            console.error('Error in populateDepartments:', error);
        }
    }
    
    // Add role-specific fields to review table
    addRoleSpecificReviewFields(container) {
        this.addReviewRow(container, 'Specialty', this.registrationData.specialization);
        this.addReviewRow(container, 'License Number', this.registrationData.license_number);
        this.addReviewRow(container, 'Qualification', this.registrationData.qualification);
        this.addReviewRow(container, 'Experience', `${this.registrationData.experience_years} years`);
        this.addReviewRow(container, 'Consultation Fee', `$${this.registrationData.consultation_fee}`);
        
        // Format available days
        let availableDays = 'None selected';
        if (this.registrationData.available_days && this.registrationData.available_days.length > 0) {
            availableDays = this.registrationData.available_days.join(', ');
        }
        this.addReviewRow(container, 'Available Days', availableDays);
        
        // Format available hours
        const startTime = this.registrationData.start_time || 'Not set';
        const endTime = this.registrationData.end_time || 'Not set';
        this.addReviewRow(container, 'Available Hours', `${startTime} - ${endTime}`);
    }
    
    // Create role-specific records
    async createRoleSpecificRecords(userId) {
        try {
            // First check if doctor record already exists
            const { data: existingDoctor } = await window.supabaseClient
                .from('doctors')
                .select('id')
                .eq('id', userId)
                .maybeSingle();
            
            // Prepare doctor data
            const doctorData = {
                specialization: this.registrationData.specialization,
                license_number: this.registrationData.license_number,
                qualification: this.registrationData.qualification,
                experience_years: parseInt(this.registrationData.experience_years) || 0,
                consultation_fee: parseFloat(this.registrationData.consultation_fee) || 0.00,
                available_days: this.registrationData.available_days || []
            };
            
            // Handle available hours properly
            if (this.registrationData.start_time && this.registrationData.end_time) {
                doctorData.available_hours = JSON.stringify({
                    start: this.registrationData.start_time,
                    end: this.registrationData.end_time
                });
                console.log('Saving available hours:', doctorData.available_hours);
            } else {
                console.warn('Missing start or end time for doctor availability');
                // Set default hours if not provided (8 AM to 5 PM)
                doctorData.available_hours = JSON.stringify({
                    start: '08:00',
                    end: '17:00'
                });
            }
            
            let doctorError;
            
            if (existingDoctor) {
                // Update existing doctor record
                console.log('Doctor record already exists, updating it');
                const { error } = await window.supabaseClient
                    .from('doctors')
                    .update(doctorData)
                    .eq('id', userId);
                    
                doctorError = error;
            } else {
                // Insert new doctor record
                const { error } = await window.supabaseClient
                    .from('doctors')
                    .insert([{
                        id: userId,
                        ...doctorData
                    }]);
                    
                doctorError = error;
            }
            
            if (doctorError) {
                console.error('Error adding/updating doctor record:', doctorError);
                throw new Error(`Error with doctor record: ${doctorError.message}`);
            }
                
            // Associate the doctor with the selected department
            if (this.registrationData.department_id) {
                // Check if department association already exists
                const { data: existingDept } = await window.supabaseClient
                    .from('doctor_departments')
                    .select('doctor_id')
                    .eq('doctor_id', userId)
                    .eq('department_id', this.registrationData.department_id)
                    .maybeSingle();
                
                if (!existingDept) {
                    const { error: deptError } = await window.supabaseClient
                        .from('doctor_departments')
                        .insert([{
                            doctor_id: userId,
                            department_id: this.registrationData.department_id
                        }]);
                        
                    if (deptError) {
                        console.error('Error associating doctor with department:', deptError);
                        throw new Error(`Error associating doctor with department: ${deptError.message}`);
                    }
                }
            }
            
            console.log('Doctor specific records created successfully');
        } catch (error) {
            console.error('Error in createRoleSpecificRecords for doctor:', error);
            throw error;
        }
    }
}

// Patient Registration Strategy
class PatientRegistrationStrategy extends RegistrationStrategy {
    constructor() {
        super();
        this.userRole = 'patient';
    }

    getStep2Label() {
        return 'Personal';
    }

    getStep3Label() {
        return 'Medical';
    }

    getStep2Title() {
        return 'Personal Details';
    }

    getStep3Title() {
        return 'Medical Information';
    }

    createDetailsStep(form) {
        const formGrid = document.createElement('div');
        formGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        
        // Date of birth field
        const dobField = this.createFormField(
            'date_of_birth',
            'Date of Birth',
            'date',
            '',
            true
        );
        
        // Gender field
        const genderOptions = [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
        ];
        
        const genderField = this.createFormField(
            'gender',
            'Gender',
            'select',
            'Select gender',
            true,
            genderOptions
        );
        
        // Blood group field
        const bloodGroupOptions = [
            { value: 'A+', label: 'A+' },
            { value: 'A-', label: 'A-' },
            { value: 'B+', label: 'B+' },
            { value: 'B-', label: 'B-' },
            { value: 'AB+', label: 'AB+' },
            { value: 'AB-', label: 'AB-' },
            { value: 'O+', label: 'O+' },
            { value: 'O-', label: 'O-' }
        ];
        
        const bloodGroupField = this.createFormField(
            'blood_group',
            'Blood Group',
            'select',
            'Select blood group',
            false,
            bloodGroupOptions
        );
        
        // Address field
        const addressField = this.createFormField(
            'address',
            'Address',
            'text',
            'Enter address',
            true
        );
        
        // Add fields to form
        formGrid.appendChild(dobField);
        formGrid.appendChild(genderField);
        formGrid.appendChild(bloodGroupField);
        formGrid.appendChild(addressField);
        
        form.appendChild(formGrid);
    }

    createAdditionalInfoStep(form) {
        const formContainer = document.createElement('div');
        formContainer.className = 'space-y-6';
        
        // Allergies field
        const allergiesField = document.createElement('div');
        
        const allergiesLabel = document.createElement('label');
        allergiesLabel.htmlFor = 'allergies';
        allergiesLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
        allergiesLabel.textContent = 'Allergies';
        
        const allergiesInput = document.createElement('textarea');
        allergiesInput.id = 'allergies';
        allergiesInput.name = 'allergies';
        allergiesInput.rows = 3;
        allergiesInput.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500';
        allergiesInput.placeholder = 'List any allergies (if none, write "None")';
        
        if (this.registrationData.allergies) {
            allergiesInput.value = this.registrationData.allergies;
        }
        
        allergiesField.appendChild(allergiesLabel);
        allergiesField.appendChild(allergiesInput);
        
        // Medical history field
        const medicalHistoryField = document.createElement('div');
        
        const medicalHistoryLabel = document.createElement('label');
        medicalHistoryLabel.htmlFor = 'medical_history';
        medicalHistoryLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
        medicalHistoryLabel.textContent = 'Medical History';
        
        const medicalHistoryInput = document.createElement('textarea');
        medicalHistoryInput.id = 'medical_history';
        medicalHistoryInput.name = 'medical_history';
        medicalHistoryInput.rows = 4;
        medicalHistoryInput.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500';
        medicalHistoryInput.placeholder = 'Briefly describe any significant medical history';
        
        if (this.registrationData.medical_history) {
            medicalHistoryInput.value = this.registrationData.medical_history;
        }
        
        medicalHistoryField.appendChild(medicalHistoryLabel);
        medicalHistoryField.appendChild(medicalHistoryInput);
        
        // Emergency contact fields
        const emergencyContactTitle = document.createElement('h3');
        emergencyContactTitle.className = 'font-medium text-gray-700 mt-6';
        emergencyContactTitle.textContent = 'Emergency Contact';
        
        const emergencyContactGrid = document.createElement('div');
        emergencyContactGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-3';
        
        // Emergency contact name field
        const emergencyNameField = this.createFormField(
            'emergency_contact_name',
            'Contact Name',
            'text',
            'Enter emergency contact name',
            true
        );
        
        // Emergency contact phone field
        const emergencyPhoneField = this.createFormField(
            'emergency_contact_phone',
            'Contact Phone',
            'tel',
            'Enter emergency contact phone',
            true
        );
        
        emergencyContactGrid.appendChild(emergencyNameField);
        emergencyContactGrid.appendChild(emergencyPhoneField);
        
        // Add all fields to form
        formContainer.appendChild(allergiesField);
        formContainer.appendChild(medicalHistoryField);
        formContainer.appendChild(emergencyContactTitle);
        formContainer.appendChild(emergencyContactGrid);
        
        form.appendChild(formContainer);
    }

    addRoleSpecificReviewFields(container) {
        this.addReviewRow(container, 'Date of Birth', this.registrationData.date_of_birth);
        this.addReviewRow(container, 'Gender', this.registrationData.gender);
        this.addReviewRow(container, 'Blood Group', this.registrationData.blood_group || 'Not provided');
        this.addReviewRow(container, 'Address', this.registrationData.address);
        this.addReviewRow(container, 'Allergies', this.registrationData.allergies || 'None');
        this.addReviewRow(container, 'Emergency Contact', this.registrationData.emergency_contact_name + ' (' + this.registrationData.emergency_contact_phone + ')');
    }

    async createRoleSpecificRecords(userId) {
        try {
            // First check if patient record already exists
            const { data: existingPatient } = await window.supabaseClient
                .from('patients')
                .select('id')
                .eq('id', userId)
                .maybeSingle();
            
            // Prepare patient data
            // Convert allergies to an array format as required by the database schema
            let allergiesArray = [];
            if (this.registrationData.allergies) {
                if (this.registrationData.allergies.toLowerCase() === 'none' || 
                    this.registrationData.allergies.toLowerCase() === 'no') {
                    // If the user entered 'none' or 'no', use an empty array
                    allergiesArray = [];
                } else {
                    // Split by commas and trim whitespace
                    allergiesArray = this.registrationData.allergies
                        .split(',')
                        .map(item => item.trim())
                        .filter(item => item.length > 0);
                }
            }
            
            const patientData = {
                date_of_birth: this.registrationData.date_of_birth,
                gender: this.registrationData.gender,
                blood_group: this.registrationData.blood_group,
                address: this.registrationData.address, // Now we can store address in patients table
                allergies: allergiesArray, // Now properly formatted as an array
                medical_conditions: this.registrationData.medical_history,
                emergency_contact: this.registrationData.emergency_contact_phone
            };
            
            let error;
            
            if (existingPatient) {
                // Update existing patient record
                console.log('Patient record already exists, updating it');
                const { error: updateError } = await window.supabaseClient
                    .from('patients')
                    .update(patientData)
                    .eq('id', userId);
                    
                error = updateError;
            } else {
                // Insert new patient record
                const { error: insertError } = await window.supabaseClient
                    .from('patients')
                    .insert([{
                        id: userId,
                        ...patientData
                    }]);
                    
                error = insertError;
            }
            
            if (error) {
                console.error('Error adding/updating patient information:', error);
                throw new Error(`Error with patient information: ${error.message}`);
            }
            
            console.log('Patient specific records created/updated successfully');
        } catch (error) {
            console.error('Error in createRoleSpecificRecords for patient:', error);
            throw error;
        }    
    }
}

// Receptionist Registration Strategy
class ReceptionistRegistrationStrategy extends RegistrationStrategy {
    constructor() {
        super();
        this.userRole = 'receptionist';
    }

    getStep2Label() {
        return 'Employment';
    }

    getStep3Label() {
        return 'Department';
    }

    getStep2Title() {
        return 'Employment Details';
    }

    getStep3Title() {
        return 'Department Assignment';
    }

    createDetailsStep(form) {
        const formGrid = document.createElement('div');
        formGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        
        // Position field
        const positionField = this.createFormField(
            'position',
            'Position',
            'text',
            'Enter position',
            true
        );
        
        // Shift field
        const shiftOptions = [
            { value: 'morning', label: 'Morning' },
            { value: 'evening', label: 'Evening' },
            { value: 'night', label: 'Night' }
        ];
        
        const shiftField = this.createFormField(
            'shift',
            'Shift',
            'select',
            'Select shift',
            true,
            shiftOptions
        );
        
        // Hire date field
        const hireDateField = this.createFormField(
            'hire_date',
            'Hire Date',
            'date',
            '',
            true
        );
        
        // Add fields to form
        formGrid.appendChild(positionField);
        formGrid.appendChild(shiftField);
        formGrid.appendChild(hireDateField);
        
        form.appendChild(formGrid);
    }

    createAdditionalInfoStep(form) {
        // Department selection
        const departmentContainer = document.createElement('div');
        departmentContainer.className = 'mb-6';
        
        const departmentField = this.createFormField(
            'department_id',
            'Department',
            'select',
            'Select department',
            true,
            [] // Options will be populated from database
        );
        
        departmentContainer.appendChild(departmentField);
        
        // Additional notes field
        const notesField = document.createElement('div');
        notesField.className = 'mt-6';
        
        const notesLabel = document.createElement('label');
        notesLabel.htmlFor = 'notes';
        notesLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
        notesLabel.textContent = 'Additional Notes';
        
        const notesInput = document.createElement('textarea');
        notesInput.id = 'notes';
        notesInput.name = 'notes';
        notesInput.rows = 4;
        notesInput.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500';
        notesInput.placeholder = 'Any additional information about this receptionist';
        
        if (this.registrationData.notes) {
            notesInput.value = this.registrationData.notes;
        }
        
        notesField.appendChild(notesLabel);
        notesField.appendChild(notesInput);
        
        // Add all containers to form
        form.appendChild(departmentContainer);
        form.appendChild(notesField);
        
        // Populate departments dropdown
        this.populateDepartments();
    }

    // Populate departments dropdown
    async populateDepartments() {
        try {
            const { data, error } = await window.supabaseClient
                .from('departments')
                .select('id, name')
                .order('name');
            
            if (error) {
                console.error('Error fetching departments:', error);
                return;
            }
            
            const departmentSelect = document.getElementById('department_id');
            if (!departmentSelect) return;
            
            // Add departments to dropdown
            data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.id;
                option.textContent = department.name;
                departmentSelect.appendChild(option);
            });
            
            // Set selected department if available in registration data
            if (this.registrationData.department_id) {
                departmentSelect.value = this.registrationData.department_id;
            }
        } catch (error) {
            console.error('Error in populateDepartments:', error);
        }
    }

    addRoleSpecificReviewFields(container) {
        this.addReviewRow(container, 'Position', this.registrationData.position);
        this.addReviewRow(container, 'Shift', this.registrationData.shift);
        this.addReviewRow(container, 'Hire Date', this.registrationData.hire_date);
        
        // Get department name if available
        const departmentSelect = document.getElementById('department_id');
        let departmentName = 'Not assigned';
        
        if (departmentSelect && this.registrationData.department_id) {
            const selectedOption = departmentSelect.querySelector(`option[value="${this.registrationData.department_id}"]`);
            if (selectedOption) {
                departmentName = selectedOption.textContent;
            }
        }
        
        this.addReviewRow(container, 'Department', departmentName);
    }

    async createRoleSpecificRecords(userId) {
        try {
            // First check if receptionist record already exists
            const { data: existingReceptionist } = await window.supabaseClient
                .from('receptionists')
                .select('id')
                .eq('id', userId)
                .maybeSingle();
            
            // Prepare receptionist data
            const receptionistData = {
                position: this.registrationData.position,
                shift: this.registrationData.shift,
                department_id: this.registrationData.department_id,
                hire_date: this.registrationData.hire_date,
                notes: this.registrationData.notes
            };
            
            let error;
            
            if (existingReceptionist) {
                // Update existing receptionist record
                console.log('Receptionist record already exists, updating it');
                const { error: updateError } = await window.supabaseClient
                    .from('receptionists')
                    .update(receptionistData)
                    .eq('id', userId);
                    
                error = updateError;
            } else {
                // Insert new receptionist record
                const { error: insertError } = await window.supabaseClient
                    .from('receptionists')
                    .insert([{
                        id: userId,
                        ...receptionistData
                    }]);
                    
                error = insertError;
            }
            
            if (error) {
                console.error('Error adding/updating receptionist information:', error);
                throw new Error(`Error with receptionist information: ${error.message}`);
            }
            
            console.log('Receptionist specific records created/updated successfully');
        } catch (error) {
            console.error('Error in createRoleSpecificRecords for receptionist:', error);
            throw error;
        }    
    }
}

// Initialize registration system
document.addEventListener('DOMContentLoaded', function() {
    console.log('Registration system initialized');
    
    // Create registration strategy instances globally so they can be accessed from admin-dashboard.js
    window.doctorRegistration = new DoctorRegistrationStrategy();
    window.patientRegistration = new PatientRegistrationStrategy();
    window.receptionistRegistration = new ReceptionistRegistrationStrategy();

    // Update the showSuccess method to work with the modal
    DoctorRegistrationStrategy.prototype.showSuccess = function() {
        const container = document.getElementById('registration-form-container');

        // Hide the registration type selection to prevent it from showing
        const registrationTypeContainer = document.querySelector('.registration-type-container');
        if (registrationTypeContainer) {
            registrationTypeContainer.style.display = 'none';
        }

        // Hide the progress steps
        const progressSteps = document.getElementById('progress-steps');
        if (progressSteps) {
            progressSteps.classList.add('hidden');
        }

        // Clear container
        container.innerHTML = '';

        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'text-center py-8';
        successMessage.innerHTML = `
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h3 class="mt-3 text-lg font-medium text-gray-900">Registration Successful!</h3>
            <p class="mt-2 text-sm text-gray-500">
                User account has been created with email: <strong>${this.registrationData.email}</strong><br>
                <span class="text-xs">(Email: ${this.registrationData.email} | Password: ${this.registrationData.password || 'As entered'})</span>
            </p>
            <div class="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-blue-800">Email Verification Required</h3>
                        <div class="mt-2 text-sm text-blue-700">
                            <p>A verification email has been sent to <strong>${this.registrationData.email}</strong>.</p>
                            <p class="mt-1">The user must click the verification link in the email before they can log in.</p>
                            <ul class="list-disc pl-5 mt-2 space-y-1">
                                <li>Check spam/junk folders if the email doesn't appear</li>
                                <li>The verification link expires in 24 hours</li>
                                <li>Users can request a new verification email from the login page</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-100">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-yellow-800">Administrator Options</h3>
                        <div class="mt-2 text-sm text-yellow-700">
                            <p>If the user doesn't receive the verification email, administrators can:</p>
                            <ul class="list-disc pl-5 mt-1 space-y-1">
                                <li>Use the "Manually Verify" button in the Pending ${this.userRole === 'doctor' ? 'Doctors' : this.userRole === 'patient' ? 'Patients' : 'Receptionists'} tab</li>
                                <li>Resend the verification email from the admin dashboard</li>
                                <li>Check the email address for typos and update if necessary</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-3a1 1 0 112 0v3a1 1 0 01-1 1z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-blue-800">Manual Verification</h3>
                        <p class="text-sm text-blue-700 mt-1">
                            For testing purposes, you can manually verify this account through the Supabase dashboard or use the credentials above to log in directly.
                        </p>
                    </div>
                </div>
            </div>
            <div class="mt-6">
                <button type="button" id="close-success-btn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Close
                </button>
            </div>
        `;
        
        container.appendChild(successMessage);
        
        // Add event listener to close button
        document.getElementById('close-success-btn').addEventListener('click', () => {
            // Close the modal
            const registrationModal = document.getElementById('registration-modal');
            if (registrationModal) {
                registrationModal.classList.add('hidden');
                // Reset the form container
                container.innerHTML = '<p class="text-center text-gray-500">Loading registration form...</p>';
                // Hide progress steps
                const progressSteps = document.getElementById('progress-steps');
                if (progressSteps) {
                    progressSteps.classList.add('hidden');
                }
            }
        });
    };
    
    // Use the same showSuccess method for all registration strategies
    PatientRegistrationStrategy.prototype.showSuccess = DoctorRegistrationStrategy.prototype.showSuccess;
    ReceptionistRegistrationStrategy.prototype.showSuccess = DoctorRegistrationStrategy.prototype.showSuccess;
});

// Close the self-executing function
})();