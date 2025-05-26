// Operations and Medical Module for Dashboard

// Main initialization function for Operations and Medical module
// Use a self-executing function to create a module scope and prevent global namespace pollution
(function() {
// Check if the function is already defined to prevent duplicate declarations
if (typeof window.initOperationsMedical === 'function') {
    return; // Function already exists, don't redefine it
}

window.initOperationsMedical = function() {
    console.log('Initializing Operations and Medical module...');
    
    // Set up event listeners for Operations and Medical sections
    setupOperationsMedicalEventListeners();
    
    // Check if we need to load data for a specific section based on the URL hash
    const hash = window.location.hash.substring(1);
    const operationsMedicalSections = ['appointments', 'departments', 'rooms', 'medical-records', 'prescriptions', 'medications'];
    
    if (operationsMedicalSections.includes(hash)) {
        // Load data for the section from the URL hash
        loadSectionData(hash);
    } else {
        // Default to loading appointments data if no specific section is requested
        loadAppointmentsData();
    }
}

// Set up event listeners for Operations and Medical sections
function setupOperationsMedicalEventListeners() {
    // Set up sidebar navigation links for operations and medical sections
    setupOperationsMedicalSidebarLinks();
    
    // Set up Add buttons
    setupAddButtons();
    
    // Set up modal close buttons
    setupModalCloseButtons();
    
    // Set up medical tab buttons
    setupMedicalTabButtons();
    
    // Populate appointment form dropdowns
    populateAppointmentFormDropdowns();
    
    // Set up form submission handlers
    setupFormSubmissionHandlers();
}

// Set up Add buttons for each section
function setupAddButtons() {
    // Appointments Add button
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    if (addAppointmentBtn) {
        addAppointmentBtn.addEventListener('click', () => {
            openModal('appointment-modal');
        });
    }
    
    // Departments Add button
    const addDepartmentBtn = document.getElementById('add-department-btn');
    if (addDepartmentBtn) {
        addDepartmentBtn.addEventListener('click', () => {
            openModal('department-modal');
        });
    }
    
    // Rooms are now handled by rooms-manager.js
    
    // Medical Records Add button
    const addMedicalRecordBtn = document.getElementById('add-medical-record-btn');
    if (addMedicalRecordBtn) {
        addMedicalRecordBtn.addEventListener('click', () => {
            openModal('medical-record-modal');
        });
    }
    
    // Prescriptions Add button
    const addPrescriptionBtn = document.getElementById('add-prescription-btn');
    if (addPrescriptionBtn) {
        addPrescriptionBtn.addEventListener('click', () => {
            openModal('prescription-modal');
        });
    }
    
    // Medications Add button
    const addMedicationBtn = document.getElementById('add-medication-btn');
    if (addMedicationBtn) {
        addMedicationBtn.addEventListener('click', () => {
            openModal('medication-modal');
        });
    }
}

// Set up modal close buttons
function setupModalCloseButtons() {
    // Get all modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    
    // Add click event listener to each close button
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the parent modal
            const modal = button.closest('[id$="-modal"]');
            if (modal) {
                // Close the modal
                closeModal(modal.id);
            }
        });
    });
}

// Set up form submission handlers
function setupFormSubmissionHandlers() {
    // Appointment form
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }
    
    // Department form
    const departmentForm = document.getElementById('department-form');
    if (departmentForm) {
        departmentForm.addEventListener('submit', handleDepartmentSubmit);
    }
    
    // Room forms are now handled by rooms-manager.js
    
    // Medical Record form
    const medicalRecordForm = document.getElementById('medical-record-form');
    if (medicalRecordForm) {
        medicalRecordForm.addEventListener('submit', handleMedicalRecordSubmit);
    }
    
    // Prescription form
    const prescriptionForm = document.getElementById('prescription-form');
    if (prescriptionForm) {
        prescriptionForm.addEventListener('submit', handlePrescriptionSubmit);
    }
    
    // Medication form
    const medicationForm = document.getElementById('medication-form');
    if (medicationForm) {
        medicationForm.addEventListener('submit', handleMedicationSubmit);
    }
}

// Open a modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Close a modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Set up sidebar navigation links for operations and medical sections
function setupOperationsMedicalSidebarLinks() {
    // Get all sidebar links related to operations and medical sections
    const operationsLinks = document.querySelectorAll('a[href="#appointments"], a[href="#departments"], a[href="#rooms"]');
    const medicalLinks = document.querySelectorAll('a[href="#medical-records"], a[href="#prescriptions"], a[href="#medications"]');
    
    // Function to handle sidebar link clicks
    const handleSidebarClick = function() {
        // Get the section ID from the href attribute
        const sectionId = this.getAttribute('href').substring(1);
        console.log(`Operations/Medical link clicked: ${sectionId}`);
        
        // Load data for the selected section
        setTimeout(() => {
            loadSectionData(sectionId);
        }, 100); // Small delay to ensure the section is visible first
    };
    
    // Add click event listeners to operations links
    operationsLinks.forEach(link => {
        link.addEventListener('click', handleSidebarClick);
    });
    
    // Add click event listeners to medical links
    medicalLinks.forEach(link => {
        link.addEventListener('click', handleSidebarClick);
    });
}

// Get the current page from URL or default to appointments
function getCurrentPageFromUrl() {
    // Check if URL has a hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        return hash;
    }
    
    // Check if URL has a query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page) {
        return page;
    }
    
    // Default to appointments
    return 'appointments';
}

// Initialize all event listeners
function initEventListeners() {
    // Set up the Add buttons
    setupAddButtons();
    
    // Set up modal close buttons
    setupModalCloseButtons();
    
    // Set up form submission handlers
    setupFormSubmissionHandlers();
    
    // Set up sidebar navigation
    setupSidebarNavigation();
}

// Set up the Add buttons for each section
function setupAddButtons() {
    // Appointments add button
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    if (addAppointmentBtn) {
        addAppointmentBtn.addEventListener('click', openAppointmentModal);
    }
    
    // Departments add button
    const addDepartmentBtn = document.getElementById('add-department-btn');
    if (addDepartmentBtn) {
        addDepartmentBtn.addEventListener('click', openDepartmentModal);
    }
    
    // Rooms add button
    const addRoomBtn = document.getElementById('add-room-btn');
    if (addRoomBtn) {
        addRoomBtn.addEventListener('click', function() {
            // Check if the function exists in the global scope or in rooms-manager.js
            if (typeof window.openRoomModal === 'function') {
                window.openRoomModal();
            } else if (typeof window.showHMSRoomsContent === 'function') {
                // If the new HMS rooms function exists, use that instead
                window.showHMSRoomsContent();
            } else {
                console.log('Showing rooms content via direct inline script');
                // Trigger a click on the rooms link to show the rooms content
                const roomsLink = document.querySelector('.sidebar-item[href="#rooms"]');
                if (roomsLink) {
                    roomsLink.click();
                }
            }
        });
    }
    
    // Medical Records add button
    const addMedicalRecordBtn = document.getElementById('add-medical-record-btn');
    if (addMedicalRecordBtn) {
        addMedicalRecordBtn.addEventListener('click', () => {
            // Call the openModal function with the medical-record-modal ID
            openModal('medical-record-modal');
        });
    }
    
    // Prescriptions add button
    const addPrescriptionBtn = document.getElementById('add-prescription-btn');
    if (addPrescriptionBtn) {
        addPrescriptionBtn.addEventListener('click', () => {
            alert('Prescription functionality will be implemented in the next phase.');
        });
    }
    
    // Medications add button
    const addMedicationBtn = document.getElementById('add-medication-btn');
    if (addMedicationBtn) {
        addMedicationBtn.addEventListener('click', () => {
            alert('Medication functionality will be implemented in the next phase.');
        });
    }
}

// Set up modal close buttons
function setupModalCloseButtons() {
    console.log('Setting up modal close buttons...');
    
    // Appointment modal close button - cross at the top
    const closeAppointmentBtn = document.getElementById('close-appointment-modal');
    if (closeAppointmentBtn) {
        console.log('Found close appointment modal button, adding event listener');
        // Remove any existing event listeners to prevent duplicates
        closeAppointmentBtn.removeEventListener('click', closeAppointmentModal);
        closeAppointmentBtn.addEventListener('click', function(event) {
            console.log('Close appointment button clicked');
            closeAppointmentModal(event);
        });
    } else {
        console.error('Close appointment modal button not found');
    }
    
    // Appointment modal cancel button at the bottom
    const cancelAppointmentBtn = document.getElementById('cancel-appointment-btn');
    if (cancelAppointmentBtn) {
        console.log('Found cancel appointment button, adding event listener');
        // Remove any existing event listeners to prevent duplicates
        cancelAppointmentBtn.removeEventListener('click', closeAppointmentModal);
        cancelAppointmentBtn.addEventListener('click', function(event) {
            console.log('Cancel appointment button clicked');
            closeAppointmentModal(event);
        });
    } else {
        console.error('Cancel appointment button not found');
    }
    
    // Alternative close buttons that might be used in different modal implementations
    const allCancelButtons = document.querySelectorAll('button[id*="cancel"][id*="appointment"]');
    console.log(`Found ${allCancelButtons.length} additional cancel buttons`);
    allCancelButtons.forEach(btn => {
        if (btn.id !== 'cancel-appointment-btn') { // Skip the one we already handled
            console.log(`Adding event listener to additional cancel button: ${btn.id}`);
            btn.removeEventListener('click', closeAppointmentModal);
            btn.addEventListener('click', function(event) {
                console.log(`Additional cancel button clicked: ${btn.id}`);
                closeAppointmentModal(event);
            });
        }
    });
    
    // Handle any close buttons with class instead of id
    const appointmentCloseButtons = document.querySelectorAll('.appointment-modal-close');
    console.log(`Found ${appointmentCloseButtons.length} appointment-modal-close buttons`);
    appointmentCloseButtons.forEach(btn => {
        console.log('Adding event listener to appointment-modal-close button');
        btn.removeEventListener('click', closeAppointmentModal);
        btn.addEventListener('click', function(event) {
            console.log('Appointment modal close button clicked (class-based)');
            closeAppointmentModal(event);
        });
    });
    
    // Department modal close buttons
    document.querySelectorAll('.department-modal-close').forEach(btn => {
        btn.addEventListener('click', closeDepartmentModal);
    });
    
    // Room modal close buttons
    document.querySelectorAll('.room-modal-close').forEach(btn => {
        btn.addEventListener('click', closeRoomModal);
    });
    
    // Medical record modal close buttons
    document.querySelectorAll('.medical-record-modal-close').forEach(btn => {
        btn.addEventListener('click', closeMedicalRecordModal);
    });
}

// Set up form submission handlers
function setupFormSubmissionHandlers() {
    // Appointment form
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }
    
    // Department form
    const departmentForm = document.getElementById('department-form');
    if (departmentForm) {
        departmentForm.addEventListener('submit', handleDepartmentSubmit);
    }
    
    // Room form
    const roomForm = document.getElementById('room-form');
    if (roomForm) {
        // If we have the external room manager, use that instead
        if (typeof window.roomsManager !== 'undefined' && window.roomsManager.handleRoomSubmit) {
            roomForm.addEventListener('submit', window.roomsManager.handleRoomSubmit);
        } else {
            // Fallback to local handler
            roomForm.addEventListener('submit', handleRoomSubmit);
        }
        
        // Room occupancy toggle event
        const roomOccupied = document.getElementById('room-occupied');
        if (roomOccupied) {
            roomOccupied.addEventListener('change', function() {
                const patientContainer = document.getElementById('patient-select-container');
                if (this.checked) {
                    patientContainer.classList.remove('hidden');
                } else {
                    patientContainer.classList.add('hidden');
                }
            });
        }
    }
    
    // Medical record form
    const medicalRecordForm = document.getElementById('medical-record-form');
    if (medicalRecordForm) {
        medicalRecordForm.addEventListener('submit', handleMedicalRecordSubmit);
    }
}

// Set up sidebar navigation links
function setupSidebarNavigation() {
    // Get all sidebar links related to operations and medical sections
    const operationsLinks = document.querySelectorAll('a[href="#appointments"], a[href="#departments"], a[href="#rooms"]');
    const medicalLinks = document.querySelectorAll('a[href="#medical-records"], a[href="#prescriptions"], a[href="#medications"]');
    
    // Function to handle sidebar link clicks
    const handleSidebarClick = function(e) {
        // Don't prevent default to allow the main dashboard navigation to work
        
        // Get the section ID from the href attribute
        if (this.getAttribute('href')) {
            const sectionId = this.getAttribute('href').substring(1);
            
            // Map 'bedrooms' to 'rooms' if needed
            const mappedSectionId = sectionId === 'bedrooms' ? 'rooms' : sectionId;
            
            // Load data for the section (don't navigate, let the main dashboard handle that)
            console.log(`Loading data for section: ${mappedSectionId}`);
            loadSectionData(mappedSectionId);
        }
    };
    
    // Add click event listeners to operations and medical links
    operationsLinks.forEach(link => {
        link.addEventListener('click', handleSidebarClick);
    });
    
    medicalLinks.forEach(link => {
        link.addEventListener('click', handleSidebarClick);
    });
    
    // Set up dropdown toggles
    const dropdownToggles = document.querySelectorAll('.dropdown-header');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Get the dropdown content
            const dropdownContent = this.nextElementSibling;
            if (dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
                // Toggle the dropdown
                if (dropdownContent.classList.contains('max-h-0')) {
                    // Close all other dropdowns first
                    document.querySelectorAll('.dropdown-content').forEach(content => {
                        content.classList.add('max-h-0');
                    });
                    // Open this dropdown
                    dropdownContent.classList.remove('max-h-0');
                } else {
                    // Close this dropdown
                    dropdownContent.classList.add('max-h-0');
                }
            }
        });
    });
    
    // Check if URL has a hash for an operations or medical section
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        const operationsMedicalSections = ['appointments', 'departments', 'medical-records', 'prescriptions', 'medications']; // 'rooms' handled by rooms-manager.js
        
        if (operationsMedicalSections.includes(sectionId)) {
            // Load section data directly
            loadSectionData(sectionId);
        }
    }
}

// Helper function to highlight the active sidebar item
function highlightSidebarItem(activeItem) {
    // Remove active class from all sidebar items
    document.querySelectorAll('a.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to the clicked item
    activeItem.classList.add('active');
    
    // Expand the parent dropdown if it exists
    const parentDropdown = activeItem.closest('.dropdown-content');
    if (parentDropdown) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.classList.add('max-h-0');
        });
        parentDropdown.classList.remove('max-h-0');
    }
}

// Navigate to the appropriate section based on sidebar selection
function navigateToSection(sectionId) {
    // Update URL hash
    window.location.hash = sectionId;
    
    // Hide all content sections
    hideAllContentSections();
    
    // Show the selected section
    const selectedSection = document.getElementById(`${sectionId}-content`);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
        
        // Update page title based on section
        const titleElement = document.getElementById('page-title');
        if (titleElement) {
            switch(sectionId) {
                case 'appointments':
                    titleElement.textContent = 'Appointments Management';
                    break;
                case 'departments':
                    titleElement.textContent = 'Departments Management';
                    break;
                case 'rooms':
                    titleElement.textContent = 'Rooms/Beds Management';
                    break;
                case 'medical-records':
                    titleElement.textContent = 'Medical Records Management';
                    break;
                case 'prescriptions':
                    titleElement.textContent = 'Prescriptions Management';
                    break;
                case 'medications':
                    titleElement.textContent = 'Medications Management';
                    break;
                default:
                    titleElement.textContent = 'Hospital Management System';
            }
        }
        
        // Highlight the active sidebar item
        highlightSidebarItem(sectionId);
        
        // Load data for the selected section
        loadSectionData(sectionId);
    }
}

// Load data for the selected section
async function loadSectionData(sectionId) {
    console.log(`Loading data for section: ${sectionId}`);
    
    // Update page title based on section
    updatePageTitle(sectionId);
    
    // Special handling for medical sections
    const medicalSections = ['medical-records', 'prescriptions', 'medications'];
    if (medicalSections.includes(sectionId)) {
        console.log(`Handling medical section: ${sectionId}`);
        
        // Hide all content sections first
        hideAllContentSections();
        
        // Try to find the medical content container
        const medicalContent = document.getElementById('medical-content');
        
        // If we're in the operations-medical.html page
        if (medicalContent) {
            medicalContent.classList.remove('hidden');
            
            // Activate the correct medical tab button
            document.querySelectorAll('.medical-tab-btn').forEach(btn => {
                // Reset all buttons
                btn.classList.remove('active');
                btn.classList.remove('text-blue-700');
                btn.classList.add('text-gray-900');
                
                // Activate the correct button
                if (btn.getAttribute('data-section') === sectionId) {
                    btn.classList.add('active');
                    btn.classList.add('text-blue-700');
                    btn.classList.remove('text-gray-900');
                }
            });
            
            // Hide all medical sections
            document.querySelectorAll('.medical-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show the selected medical section
            const selectedSection = document.getElementById(`${sectionId}-section`);
            if (selectedSection) {
                selectedSection.classList.remove('hidden');
            } else {
                console.error(`Medical section not found: ${sectionId}-section`);
            }
        } else {
            // We might be in the dashboard.html or another page that includes this script
            // Try to find the section in the dashboard structure
            console.log('Medical content container not found - trying dashboard structure');
            
            // In dashboard.html, sections might be named like 'medical-records-content'
            const dashboardSection = document.getElementById(`${sectionId}-content`);
            if (dashboardSection) {
                // Hide all content sections
                document.querySelectorAll('[id$="-content"]').forEach(section => {
                    section.classList.add('hidden');
                });
                
                // Show this section
                dashboardSection.classList.remove('hidden');
            } else {
                console.error(`Neither medical-content nor ${sectionId}-content found`);
            }
        }
    } else {
        // For non-medical sections, hide all content sections first
        hideAllContentSections();
        
        // Show the specific content section
        showContentSection(sectionId);
    }
    
    // Show loading indicator
    showLoadingIndicator(sectionId);
    
    try {
        // Load data based on section ID
        switch(sectionId) {
            case 'appointments':
                await loadAppointmentsData();
                break;
            case 'departments':
                await loadDepartmentsData();
                break;
            case 'rooms':
                // Check if rooms manager is available
                if (typeof window.roomsManager !== 'undefined' && typeof window.roomsManager.loadRooms === 'function') {
                    await window.roomsManager.loadRooms();
                } else {
                    await loadRoomsData();
                }
                break;
            case 'medical-records':
                await loadMedicalRecordsData();
                break;
            case 'prescriptions':
                await loadPrescriptionsData();
                break;
            case 'medications':
                await loadMedicationsData();
                break;
            default:
                console.warn(`No data loader defined for section: ${sectionId}`);
        }
        
        console.log(`Successfully loaded data for section: ${sectionId}`);
    } catch (error) {
        console.error(`Error loading data for section ${sectionId}:`, error);
        showErrorMessage(`Failed to load ${sectionId.replace('-', ' ')}. Please try again.`);
    } finally {
        // Hide loading indicator
        hideLoadingIndicator(sectionId);
    }
}

// Update page title based on section
function updatePageTitle(sectionId) {
    // Try to find the page title element
    const titleElement = document.getElementById('page-title');
    
    // If not found, it might be because we're in a different page structure
    // This is not a critical error, so just log a warning and continue
    if (!titleElement) {
        console.log('Page title element not found - this is expected if not in the main dashboard');
        return;
    }
    
    switch(sectionId) {
        case 'appointments':
            titleElement.textContent = 'Appointments Management';
            break;
        case 'departments':
            titleElement.textContent = 'Departments Management';
            break;
        case 'rooms':
            titleElement.textContent = 'Rooms/Beds Management';
            break;
        case 'medical-records':
            titleElement.textContent = 'Medical Records Management';
            break;
        case 'prescriptions':
            titleElement.textContent = 'Prescriptions Management';
            break;
        case 'medications':
            titleElement.textContent = 'Medications Management';
            break;
        default:
            titleElement.textContent = 'Hospital Management System';
    }
}

// Hide all content sections
function hideAllContentSections() {
    // Get all content sections with -content suffix
    const contentSections = document.querySelectorAll('[id$="-content"]');
    
    // Hide all content sections
    contentSections.forEach(section => {
        section.classList.add('hidden');
    });
}

// Show a specific content section
function showContentSection(sectionId) {
    console.log(`Showing content section: ${sectionId}`);
    
    // Get the content section
    const contentSection = document.getElementById(`${sectionId}-content`);
    
    // Show the content section if it exists
    if (contentSection) {
        // First hide all content sections to ensure only one is visible
        hideAllContentSections();
        
        // Show the requested section
        contentSection.classList.remove('hidden');
        console.log(`Successfully showed content section: ${sectionId}-content`);
        
        // Also update the URL hash to reflect the current section
        if (window.location.hash !== `#${sectionId}`) {
            // Update URL without triggering a page reload
            history.pushState(null, '', `#${sectionId}`);
        }
    } else {
        console.error(`Content section with ID ${sectionId}-content not found`);
    }
}

// Show loading indicator for a section
function showLoadingIndicator(sectionId) {
    // For dashboard content sections
    const contentSection = document.getElementById(`${sectionId}-content`);
    if (contentSection) {
        // Check if loading indicator already exists
        let loadingIndicator = contentSection.querySelector('.loading-indicator');
        if (!loadingIndicator) {
            // Create loading indicator
            loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50';
            loadingIndicator.innerHTML = `
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            `;
            contentSection.appendChild(loadingIndicator);
        } else {
            // Show existing loading indicator
            loadingIndicator.classList.remove('hidden');
        }
    }
    
    // For section-specific content
    const section = document.getElementById(`${sectionId}-section`);
    if (section) {
        // Check if loading indicator already exists
        let loadingIndicator = section.querySelector('.loading-indicator');
        if (!loadingIndicator) {
            // Create loading indicator
            loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50';
            loadingIndicator.innerHTML = `
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            `;
            section.appendChild(loadingIndicator);
        } else {
            // Show existing loading indicator
            loadingIndicator.classList.remove('hidden');
        }
    }
}

// Hide loading indicator for a section
function hideLoadingIndicator(sectionId) {
    // For dashboard content sections
    const contentSection = document.getElementById(`${sectionId}-content`);
    if (contentSection) {
        const loadingIndicator = contentSection.querySelector('.loading-indicator');
        if (loadingIndicator) {
            // Hide loading indicator
            loadingIndicator.classList.add('hidden');
        }
    }
    
    // For section-specific content
    const section = document.getElementById(`${sectionId}-section`);
    if (section) {
        const loadingIndicator = section.querySelector('.loading-indicator');
        if (loadingIndicator) {
            // Hide loading indicator
            loadingIndicator.classList.add('hidden');
        }
    }
}

// Show error message
function showErrorMessage(message) {
    showToast(message, 'error');
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove any existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => {
        document.body.removeChild(toast);
    });
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 transform transition-all duration-300 translate-y-0';
    
    // Set background color based on type
    switch (type) {
        case 'success':
            toast.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            toast.classList.add('bg-red-500', 'text-white');
            break;
        case 'warning':
            toast.classList.add('bg-yellow-500', 'text-white');
            break;
        default:
            toast.classList.add('bg-blue-500', 'text-white');
    }
    
    // Create content with icon
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            break;
        case 'error':
            icon = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            break;
        case 'warning':
            icon = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
            break;
        default:
            icon = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }
    
    toast.innerHTML = `
        <div class="flex items-center">
            ${icon}
            <span>${message}</span>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('translate-y-2');
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// ===== DATA LOADING FUNCTIONS =====

async function loadAppointmentsData() {
    try {
        console.log('Loading appointments data...');
        
        // Show loading indicator
        showLoadingIndicator('appointments');
        
        // Get appointments content container
        const appointmentsContent = document.getElementById('appointments-content');
        if (!appointmentsContent) {
            console.error('Appointments content container not found');
            hideLoadingIndicator('appointments');
            showErrorMessage('Appointments content container not found. Please check the HTML structure.');
            return;
        }
        
        // Get appointments table body
        const tableBody = appointmentsContent.querySelector('table tbody');
        if (!tableBody) {
            console.error('Appointments table body not found');
            hideLoadingIndicator('appointments');
            showErrorMessage('Appointments table body not found. Please check the HTML structure.');
            return;
        }
        
        // Clear existing data
        tableBody.innerHTML = '';
        
        // Variable to store appointments data
        let appointments = [];
        
        // Check if the appointments table exists in Supabase
        console.log('Checking if appointments table exists...');
        try {
            // First check if the table exists by making a small query
            const { count, error: countError } = await supabase
                .from('appointments')
                .select('id', { count: 'exact', head: true });
                
            if (countError) {
                console.error('Error checking appointments table:', countError);
                hideLoadingIndicator('appointments');
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-6 py-4 text-center text-red-500">
                            Error checking appointments table: ${countError.message || 'Unknown error'}
                        </td>
                    </tr>
                `;
                return;
            }
            
            console.log('Appointments table exists, fetching data...');
            
            // Fetch appointments data from Supabase
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    id,
                    date,
                    time,
                    status,
                    patient_id,
                    doctor_id
                `)
                .order('date', { ascending: false });
            
            if (error) {
                console.error('Error fetching appointments:', error);
                hideLoadingIndicator('appointments');
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-6 py-4 text-center text-red-500">
                            Error fetching appointments: ${error.message || 'Unknown error'}
                        </td>
                    </tr>
                `;
                return;
            }
            
            // Store the appointments data
            appointments = data || [];
        } catch (innerError) {
            console.error('Inner error in appointments loading:', innerError);
            hideLoadingIndicator('appointments');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-red-500">
                        Unexpected error: ${innerError.message || 'Unknown error'}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Check if there are appointments
        if (!appointments || appointments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">No appointments found</td>
                </tr>
            `;
            return;
        }
        
        // Populate table with appointments
        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.classList.add('hover:bg-gray-50', 'transition-colors', 'duration-150');
            
            // Format date and time
            const date = new Date(appointment.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            
            // Format time properly
            const formattedTime = appointment.time || '00:00';
            
            // Get patient and doctor names - we'll need to fetch these separately
            let patientName = 'Loading...';
            let doctorName = 'Loading...';
            
            // We'll update these asynchronously
            fetchProfileName(appointment.patient_id).then(name => {
                const patientNameCell = row.querySelector('.patient-name');
                if (patientNameCell) {
                    patientNameCell.textContent = name || 'Unknown';
                    // Update the appointment statistics after names are loaded
                    updateAppointmentStatistics(appointments);
                }
            });
            
            fetchProfileName(appointment.doctor_id).then(name => {
                const doctorNameCell = row.querySelector('.doctor-name');
                if (doctorNameCell) doctorNameCell.textContent = name || 'Unknown';
            });
            
            // Get status class
            const statusClass = getStatusClass(appointment.status);
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 patient-name">Loading...</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 doctor-name">Loading...</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex flex-col">
                        <span class="font-medium">${formattedDate}</span>
                        <span class="text-xs text-gray-500">${formattedTime}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${appointment.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex justify-center space-x-4">
                        <button class="text-blue-600 hover:text-blue-900 edit-appointment p-2 rounded-full hover:bg-blue-100 transition-colors duration-150" data-id="${appointment.id}" title="Edit Appointment">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button class="text-red-600 hover:text-red-900 delete-appointment p-2 rounded-full hover:bg-red-100 transition-colors duration-150" data-id="${appointment.id}" title="Delete Appointment">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        const editButtons = tableBody.querySelectorAll('.edit-appointment');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const appointmentId = button.getAttribute('data-id');
                editAppointment(appointmentId);
            });
        });
        
        const deleteButtons = tableBody.querySelectorAll('.delete-appointment');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const appointmentId = button.getAttribute('data-id');
                deleteAppointment(appointmentId);
            });
        });
        
        console.log('Appointments data loaded successfully');
        
        // Call updateAppointmentStatistics to update the statistics cards
        updateAppointmentStatistics(appointments);
        
        // Hide loading indicator
        hideLoadingIndicator('appointments');
    } catch (error) {
        console.error('Error loading appointments data:', error);
        showErrorMessage('Failed to load appointments. Please try again.');
        
        // Hide loading indicator even on error
        hideLoadingIndicator('appointments');
    }
}

// Get CSS class for appointment status
function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'scheduled':
            return 'bg-blue-100 text-blue-800';
        case 'confirmed':
            return 'bg-yellow-100 text-yellow-800';
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        case 'no-show':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// Update appointment statistics in the dashboard
function updateAppointmentStatistics(appointments) {
    if (!appointments) return;
    
    // Get the statistics elements
    const todayAppointmentsCount = document.getElementById('today-appointments-count');
    const scheduledAppointmentsCount = document.getElementById('scheduled-appointments-count');
    const completedAppointmentsCount = document.getElementById('completed-appointments-count');
    const cancelledAppointmentsCount = document.getElementById('cancelled-appointments-count');
    const totalAppointmentsCount = document.getElementById('total-appointments-count');
    
    if (!todayAppointmentsCount || !scheduledAppointmentsCount || !completedAppointmentsCount || !cancelledAppointmentsCount) {
        return; // Elements not found
    }
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count appointments by status
    let todayCount = 0;
    let scheduledCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    
    appointments.forEach(appointment => {
        // Check if appointment is today
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        
        if (appointmentDate.getTime() === today.getTime()) {
            todayCount++;
        }
        
        // Count by status
        switch(appointment.status.toLowerCase()) {
            case 'scheduled':
            case 'confirmed':
                scheduledCount++;
                break;
            case 'completed':
                completedCount++;
                break;
            case 'cancelled':
            case 'no-show':
                cancelledCount++;
                break;
        }
    });
    
    // Update the statistics elements
    todayAppointmentsCount.textContent = todayCount;
    scheduledAppointmentsCount.textContent = scheduledCount;
    completedAppointmentsCount.textContent = completedCount;
    cancelledAppointmentsCount.textContent = cancelledCount;
    
    // Update total count if element exists
    if (totalAppointmentsCount) {
        totalAppointmentsCount.textContent = appointments.length;
    }
}

// Load departments data
async function loadDepartmentsData() {
    try {
        console.log('Loading departments data...');
        
        // Get departments content container
        const departmentsContent = document.getElementById('departments-content');
        if (!departmentsContent) {
            console.error('Departments content container not found');
            return;
        }
        
        // Get departments table body
        const tableBody = departmentsContent.querySelector('table tbody');
        if (!tableBody) {
            console.error('Departments table body not found');
            return;
        }
        
        // Clear existing data
        tableBody.innerHTML = '';
        
        // Fetch departments data from Supabase
        const { data: departments, error } = await supabase
            .from('departments')
            .select(`
                id,
                name,
                description,
                created_at,
                updated_at
            `)
            .order('name');
        
        if (error) {
            console.error('Error fetching departments:', error);
            showErrorMessage('Failed to load departments. Please try again.');
            return;
        }
        
        // Check if there are departments
        if (!departments || departments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">No departments found</td>
                </tr>
            `;
            return;
        }
        
        // Populate table with departments
        departments.forEach(department => {
            const row = document.createElement('tr');
            
            // Format dates
            const createdDate = department.created_at ? new Date(department.created_at).toLocaleDateString() : '-';
            const updatedDate = department.updated_at ? new Date(department.updated_at).toLocaleDateString() : '-';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${department.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${department.description || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${createdDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${updatedDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="view-doctors-btn text-blue-600 hover:text-blue-900 mr-2" data-id="${department.id}" title="View Doctors">
                        <i class="fas fa-user-md"></i>
                    </button>
                    <button class="text-indigo-600 hover:text-indigo-900 mr-2" onclick="editDepartment('${department.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900" onclick="deleteDepartment('${department.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        const editButtons = tableBody.querySelectorAll('.edit-department');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const departmentId = button.getAttribute('data-id');
                editDepartment(departmentId);
            });
        });
        
        const deleteButtons = tableBody.querySelectorAll('.delete-department');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const departmentId = button.getAttribute('data-id');
                deleteDepartment(departmentId);
            });
        });
        
        console.log('Departments data loaded successfully');
    } catch (error) {
        console.error('Error loading departments data:', error);
        showErrorMessage('Failed to load departments. Please try again.');
    }
}

// Load rooms data
async function loadRoomsData() {
    console.log('Loading rooms data from operations-medical.js...');
    
    try {
        // Show loading indicator
        showLoadingIndicator('rooms');
        
        // Get the rooms content container
        const roomsContent = document.getElementById('rooms-content');
        if (!roomsContent) {
            console.error('Rooms content container not found');
            return;
        }
        
        // Get the rooms table body
        const tableBody = roomsContent.querySelector('table tbody');
        if (!tableBody) {
            console.error('Rooms table body not found');
            return;
        }
        
        // Show loading message
        tableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center">Loading rooms data...</td></tr>';
        
        // Create sample room data for testing
        const sampleRooms = [
            { id: '1', room_number: '101', type: 'Standard', status: 'available', department: 'General' },
            { id: '2', room_number: '102', type: 'Deluxe', status: 'occupied', department: 'General' },
            { id: '3', room_number: '103', type: 'Suite', status: 'maintenance', department: 'Cardiology' },
            { id: '4', room_number: '104', type: 'ICU', status: 'cleaning', department: 'ICU' },
            { id: '5', room_number: '105', type: 'Standard', status: 'available', department: 'General' },
            { id: '6', room_number: '201', type: 'Standard', status: 'available', department: 'Pediatrics' },
            { id: '7', room_number: '202', type: 'Deluxe', status: 'occupied', department: 'Orthopedics' },
            { id: '8', room_number: '203', type: 'Suite', status: 'available', department: 'Neurology' }
        ];
        
        // Clear existing content
        tableBody.innerHTML = '';
        
        // Add sample rooms to the table
        sampleRooms.forEach(room => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            // Determine status class for coloring
            let statusClass = 'bg-gray-200';
            if (room.status === 'available') statusClass = 'bg-green-200';
            else if (room.status === 'occupied') statusClass = 'bg-red-200';
            else if (room.status === 'maintenance') statusClass = 'bg-yellow-200';
            else if (room.status === 'cleaning') statusClass = 'bg-blue-200';
            
            // Create row HTML
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${room.id}</td>
                <td class="px-6 py-4 whitespace-nowrap">${room.room_number}</td>
                <td class="px-6 py-4 whitespace-nowrap">${room.type}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${room.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${room.department}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        <button class="edit-room-btn text-indigo-600 hover:text-indigo-900" data-id="${room.id}" title="Edit Room">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-room-btn text-red-600 hover:text-red-900" data-id="${room.id}" title="Delete Room">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Set up event listeners for room actions
        setupRoomActionListeners();
        
        // Make sure the rooms content is visible
        showContentSection('rooms');
        
        // Show success message
        console.log('Rooms data loaded successfully');
    } catch (error) {
        console.error('Error loading rooms data:', error);
        showErrorMessage('Failed to load rooms data. Please try again.');
    } finally {
        // Hide loading indicator
        hideLoadingIndicator('rooms');
    }
}

// Load medical records data
async function loadMedicalRecordsData() {
    try {
        console.log('Loading medical records data...');
        
        const tableBody = document.getElementById('medical-records-table-body');
        if (!tableBody) {
            console.error('Medical records table body not found');
            return;
        }
        
        // Show loading indicator
        tableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center">Loading medical records...</td></tr>';
        
        // Fetch medical records from the database with the new schema
        const { data, error } = await supabase.from('medical_records')
            .select(`
                id, 
                patient_id, 
                doctor_id, 
                appointment_id, 
                diagnosis, 
                symptoms, 
                treatment, 
                notes, 
                created_at, 
                updated_at
            `)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('Error loading medical records:', error);
            tableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">Error loading medical records</td></tr>';
            return;
        }
        
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center">No medical records found</td></tr>';
            return;
        }
        
        // Clear the table
        tableBody.innerHTML = '';
        
        // Process each record
        for (const record of data) {
            try {
                // Fetch patient and doctor names
                let patientName = 'Unknown';
                let doctorName = 'Unknown';
                
                if (record.patient_id) {
                    const { data: patientData, error: patientError } = await supabase
                        .from('profiles')
                        .select('first_name, last_name')
                        .eq('id', record.patient_id)
                        .single();
                        
                    if (!patientError && patientData) {
                        patientName = `${patientData.first_name} ${patientData.last_name}`;
                    }
                }
                
                if (record.doctor_id) {
                    const { data: doctorData, error: doctorError } = await supabase
                        .from('profiles')
                        .select('first_name, last_name')
                        .eq('id', record.doctor_id)
                        .single();
                        
                    if (!doctorError && doctorData) {
                        doctorName = `${doctorData.first_name} ${doctorData.last_name}`;
                    }
                }
                
                // Format symptoms if they exist
                let symptomsText = 'None';
                if (record.symptoms && Array.isArray(record.symptoms) && record.symptoms.length > 0) {
                    symptomsText = record.symptoms.slice(0, 2).join(', ');
                    if (record.symptoms.length > 2) {
                        symptomsText += ` (+${record.symptoms.length - 2} more)`;
                    }
                }
                
                // Create the row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.id.substring(0, 8)}...</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patientName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctorName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(record.created_at).toLocaleDateString()}</td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${record.diagnosis || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900 mr-2 view-medical-record" data-id="${record.id}" title="View Record">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                        <button class="text-blue-600 hover:text-blue-900 mr-2 edit-medical-record" data-id="${record.id}" title="Edit Record">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button class="text-red-600 hover:text-red-900 delete-medical-record" data-id="${record.id}" title="Delete Record">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            } catch (err) {
                console.error('Error processing medical record:', err);
            }
        }
        
        // Add event listeners to action buttons
        setupMedicalRecordActionListeners();
        
        console.log('Medical records data loaded successfully');
    } catch (error) {
        console.error('Error loading medical records data:', error);
        showErrorMessage('Failed to load medical records. Please try again.');
    }
}

// Load prescriptions data
async function loadPrescriptionsData() {
    try {
        console.log('Loading prescriptions data...');
        
        // Get prescriptions content container
        const prescriptionsContent = document.getElementById('prescriptions-content');
        if (!prescriptionsContent) {
            console.error('Prescriptions content container not found');
            return;
        }
        
        // Get prescriptions table body
        const tableBody = prescriptionsContent.querySelector('table tbody');
        if (!tableBody) {
            console.error('Prescriptions table body not found');
            return;
        }
        
        // Clear existing data
        tableBody.innerHTML = '';
        
        // Fetch prescriptions data from Supabase
        const { data: prescriptions, error } = await supabase
            .from('prescriptions')
            .select(`
                id,
                date,
                status,
                patients(id, first_name, last_name),
                doctors(id, first_name, last_name)
            `)
            .order('date', { ascending: false });
        
        if (error) {
            console.error('Error fetching prescriptions:', error);
            showErrorMessage('Failed to load prescriptions. Please try again.');
            return;
        }
        
        // Check if there are prescriptions
        if (!prescriptions || prescriptions.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">No prescriptions found</td>
                </tr>
            `;
            return;
        }
        
        // Populate table with prescriptions
        prescriptions.forEach(prescription => {
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(prescription.date);
            const formattedDate = date.toLocaleDateString();
            
            // Get patient and doctor names
            const patientName = prescription.patients ? 
                `${prescription.patients.first_name} ${prescription.patients.last_name}` : 'Unknown';
            
            const doctorName = prescription.doctors ? 
                `${prescription.doctors.first_name} ${prescription.doctors.last_name}` : 'Unknown';
            
            // Get status class
            let statusClass = '';
            switch(prescription.status.toLowerCase()) {
                case 'active':
                    statusClass = 'bg-green-100 text-green-800';
                    break;
                case 'completed':
                    statusClass = 'bg-blue-100 text-blue-800';
                    break;
                case 'cancelled':
                    statusClass = 'bg-red-100 text-red-800';
                    break;
                default:
                    statusClass = 'bg-gray-100 text-gray-800';
            }
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${prescription.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patientName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${doctorName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formattedDate}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${prescription.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-blue-600 hover:text-blue-900 mr-3 edit-prescription" data-id="${prescription.id}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-900 delete-prescription" data-id="${prescription.id}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        const editButtons = tableBody.querySelectorAll('.edit-prescription');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const prescriptionId = button.getAttribute('data-id');
                editPrescription(prescriptionId);
            });
        });
        
        const deleteButtons = tableBody.querySelectorAll('.delete-prescription');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const prescriptionId = button.getAttribute('data-id');
                deletePrescription(prescriptionId);
            });
        });
        
        console.log('Prescriptions data loaded successfully');
    } catch (error) {
        console.error('Error loading prescriptions data:', error);
        showErrorMessage('Failed to load prescriptions. Please try again.');
    }
}

// Load medications data
async function loadMedicationsData() {
    try {
        console.log('Loading medications data...');
        
        // Get medications content container
        const medicationsContent = document.getElementById('medications-content');
        if (!medicationsContent) {
            console.error('Medications content container not found');
            return;
        }
        
        // Get medications table body
        const tableBody = medicationsContent.querySelector('table tbody');
        if (!tableBody) {
            console.error('Medications table body not found');
            return;
        }
        
        // Clear existing data
        tableBody.innerHTML = '';
        
        // Fetch medications data from Supabase
        const { data: medications, error } = await supabase
            .from('medications')
            .select(`
                id,
                name,
                category,
                description,
                stock
            `)
            .order('name');
        
        if (error) {
            console.error('Error fetching medications:', error);
            showErrorMessage('Failed to load medications. Please try again.');
            return;
        }
        
        // Check if there are medications
        if (!medications || medications.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">No medications found</td>
                </tr>
            `;
            return;
        }
        
        // Populate table with medications
        medications.forEach(medication => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${medication.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medication.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medication.category}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medication.description}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medication.stock}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-blue-600 hover:text-blue-900 mr-3 edit-medication" data-id="${medication.id}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-900 delete-medication" data-id="${medication.id}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        const editButtons = tableBody.querySelectorAll('.edit-medication');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const medicationId = button.getAttribute('data-id');
                editMedication(medicationId);
            });
        });
        
        const deleteButtons = tableBody.querySelectorAll('.delete-medication');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const medicationId = button.getAttribute('data-id');
                deleteMedication(medicationId);
            });
        });
        
        console.log('Medications data loaded successfully');
    } catch (error) {
        console.error('Error loading medications data:', error);
        showErrorMessage('Failed to load medications. Please try again.');
    }
}

// Helper function to fetch profile name by ID
async function fetchProfileName(profileId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', profileId)
            .single();
        
        if (error) {
            console.error('Error fetching profile:', error);
            return 'Unknown';
        }
        
        if (data) {
            return `${data.first_name} ${data.last_name}`;
        } else {
            return 'Unknown';
        }
    } catch (error) {
        console.error('Error in fetchProfileName:', error);
        return 'Unknown';
    }
}

// Populate dropdowns for the appointment form
async function populateAppointmentFormDropdowns() {
    console.log('Populating appointment form dropdowns...');
    const patientDropdown = document.getElementById('appointment-patient');
    const doctorDropdown = document.getElementById('appointment-doctor');
    
    if (!patientDropdown) {
        console.error('Patient dropdown element not found');
    }
    
    if (!doctorDropdown) {
        console.error('Doctor dropdown element not found');
    }
    
    if (patientDropdown && doctorDropdown) {
        try {
            // Show loading state in dropdowns
            patientDropdown.innerHTML = '<option value="">Loading patients...</option>';
            doctorDropdown.innerHTML = '<option value="">Loading doctors...</option>';
            
            console.log('Fetching patients from profiles table...');
            // Fetch patients from profiles table
            const { data: patients, error: patientsError } = await supabase
                .from('profiles')
                .select('id, first_name, last_name')
                .eq('role', 'patient');
                
            if (patientsError) {
                console.error('Error fetching patients:', patientsError);
                patientDropdown.innerHTML = '<option value="">Error loading patients</option>';
            } else {
                console.log('Patients data received:', patients);
                
                // Populate patient dropdown
                patientDropdown.innerHTML = '<option value="">Select Patient</option>';
                
                if (patients && patients.length > 0) {
                    patients.forEach(patient => {
                        const option = document.createElement('option');
                        option.value = patient.id;
                        option.textContent = `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown Patient';
                        patientDropdown.appendChild(option);
                    });
                    console.log(`Added ${patients.length} patients to dropdown`);
                } else {
                    patientDropdown.innerHTML += '<option value="" disabled>No patients found</option>';
                    console.log('No patients found in database');
                }
            }
            
            console.log('Fetching doctors from profiles table...');
            // Fetch doctors from profiles table
            const { data: doctors, error: doctorsError } = await supabase
                .from('profiles')
                .select('id, first_name, last_name')
                .eq('role', 'doctor');
                
            if (doctorsError) {
                console.error('Error fetching doctors:', doctorsError);
                doctorDropdown.innerHTML = '<option value="">Error loading doctors</option>';
            } else {
                console.log('Doctors data received:', doctors);
                
                // Populate doctor dropdown
                doctorDropdown.innerHTML = '<option value="">Select Doctor</option>';
                
                if (doctors && doctors.length > 0) {
                    doctors.forEach(doctor => {
                        const option = document.createElement('option');
                        option.value = doctor.id;
                        option.textContent = `Dr. ${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() || 'Unknown Doctor';
                        doctorDropdown.appendChild(option);
                    });
                    console.log(`Added ${doctors.length} doctors to dropdown`);
                } else {
                    doctorDropdown.innerHTML += '<option value="" disabled>No doctors found</option>';
                    console.log('No doctors found in database');
                }
            }
            
            return { patientsLoaded: !patientsError, doctorsLoaded: !doctorsError };
        } catch (error) {
            console.error('Error populating appointment form dropdowns:', error);
            patientDropdown.innerHTML = '<option value="">Error loading patients</option>';
            doctorDropdown.innerHTML = '<option value="">Error loading doctors</option>';
            return { patientsLoaded: false, doctorsLoaded: false, error };
        }
    } else {
        console.error('One or both dropdown elements not found');
        return { patientsLoaded: false, doctorsLoaded: false, error: 'Dropdown elements not found' };
    }
}

// Helper function to highlight the active sidebar item
function highlightSidebarItem(activeItem) {
    console.log(`Highlighting sidebar item: ${activeItem}`);
    
    // Remove active class from all sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to the active sidebar item
    const activeItemElement = document.querySelector(`.sidebar-item[href="#${activeItem}"]`);
    if (activeItemElement) {
        activeItemElement.classList.add('active');
        console.log(`Added active class to: ${activeItem}`);
        
        // If the active item is in a dropdown, expand the dropdown
        const dropdownContent = activeItemElement.closest('.dropdown-content');
        if (dropdownContent) {
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.classList.add('max-h-0');
            });
            
            // Open this dropdown
            dropdownContent.classList.remove('max-h-0');
            console.log(`Expanded dropdown for: ${activeItem}`);
        }
    } else {
        console.warn(`Sidebar item not found for: ${activeItem}`);
    }
}

// ===== APPOINTMENTS FUNCTIONS =====

// Load appointments from database
async function loadAppointments() {
    try {
        const { data: appointments, error } = await supabase
            .from('appointments')
            .select(`
                id,
                appointment_date,
                end_time,
                status,
                reason,
                notes,
                patient_id,
                doctor_id,
                profiles:patient_id(id, first_name, last_name),
                doctors:doctor_id(id, first_name, last_name)
            `)
            .order('appointment_date', { ascending: false });
            
        if (error) throw error;
        
        const tableBody = document.getElementById('appointments-table-body');
        tableBody.innerHTML = '';
        
        if (!appointments || appointments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="5">No appointments found</td>
                </tr>
            `;
            return;
        }
        
        appointments.forEach(appointment => {
            const date = new Date(appointment.appointment_date);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Create cells for patient and doctor names with enhanced styling
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap patient-cell-${appointment.patient_id}">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 patient-name">Loading...</div>
                            <div class="text-xs text-gray-500">Patient ID: ${appointment.patient_id.substring(0, 8)}...</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap doctor-cell-${appointment.doctor_id}">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 doctor-name">Loading...</div>
                            <div class="text-xs text-gray-500">Doctor ID: ${appointment.doctor_id.substring(0, 8)}...</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${formattedDate}</div>
                    <div class="text-sm text-gray-500">
                        <span class="inline-flex items-center">
                            <svg class="h-4 w-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            ${formattedTime}
                        </span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(appointment.status)}">
                        ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3 edit-appointment focus:outline-none" data-id="${appointment.id}">
                        <span class="flex items-center">
                            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Edit
                        </span>
                    </button>
                    <button class="text-red-600 hover:text-red-900 delete-appointment focus:outline-none" data-id="${appointment.id}">
                        <span class="flex items-center">
                            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Delete
                        </span>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
            
            // Add event listeners for edit and delete
            row.querySelector('.edit-appointment').addEventListener('click', () => {
                editAppointment(appointment);
            });
            
            row.querySelector('.delete-appointment').addEventListener('click', () => {
                deleteAppointment(appointment.id);
            });
        });
    } catch (error) {
        console.error('Error loading appointments:', error);
        const tableBody = document.getElementById('appointments-table-body');
        tableBody.innerHTML = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500" colspan="5">Error loading appointments: ${error.message}</td>
            </tr>
        `;
    }
}

// Get CSS class for appointment status
function getStatusClass(status) {
    switch (status) {
        case 'scheduled':
            return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
            return 'bg-green-100 text-green-800';
        case 'completed':
            return 'bg-blue-100 text-blue-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        case 'no-show':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// Open appointment modal for new appointment
async function openAppointmentModal() {
    try {
        // Show loading indicator
        showLoadingIndicator('appointments');
        
        const modal = document.getElementById('appointment-modal');
        const modalTitle = document.getElementById('appointment-modal-title');
        const form = document.getElementById('appointment-form');
        
        if (!modal || !modalTitle || !form) {
            console.error('Appointment modal elements not found');
            hideLoadingIndicator('appointments');
            return;
        }
        
        modalTitle.textContent = 'Add New Appointment';
        form.reset();
        form.removeAttribute('data-id');
        
        // Set current date as default
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const dateInput = document.getElementById('appointment-date');
        if (dateInput) {
            dateInput.value = today;
        }
        
        // Populate patient and doctor dropdowns
        await populateAppointmentFormDropdowns();
        
        // Show the modal
        modal.classList.remove('hidden');
        
        // Add animation after a tiny delay
        setTimeout(() => {
            modal.classList.add('opacity-100');
            modal.classList.remove('opacity-0');
        }, 10);
    } catch (error) {
        console.error('Error opening appointment modal:', error);
        showToast('Error opening appointment form', 'error');
    } finally {
        // Hide loading indicator
        hideLoadingIndicator('appointments');
    }
}

// Close appointment modal
function closeAppointmentModal(event) {
    // Prevent default if this was triggered by a button click
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    console.log('Closing appointment modal...');
    
    try {
        const modal = document.getElementById('appointment-modal');
        if (!modal) {
            console.error('Appointment modal not found');
            return;
        }
        
        console.log('Found modal, starting close animation');
        
        // Handle different modal designs
        // Some modals use opacity classes for animation, others don't
        if (modal.classList.contains('opacity-100')) {
            modal.classList.add('opacity-0');
            modal.classList.remove('opacity-100');
            console.log('Applied opacity animation');
        }
        
        // Reset the form
        const form = document.getElementById('appointment-form');
        if (form) {
            form.reset();
            // Clear any data-id attribute that might have been set for editing
            form.removeAttribute('data-id');
            console.log('Form reset successfully');
        } else {
            // Try alternative form IDs that might be used in different implementations
            const alternativeForms = [
                document.getElementById('edit-appointment-form'),
                document.getElementById('add-appointment-form'),
                document.querySelector('form[id*="appointment"]')
            ];
            
            const validForm = alternativeForms.find(f => f !== null);
            if (validForm) {
                validForm.reset();
                validForm.removeAttribute('data-id');
                console.log(`Reset alternative form: ${validForm.id}`);
            } else {
                console.error('No appointment form found');
            }
        }
        
        // Reset modal title to default
        const modalTitle = document.getElementById('appointment-modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Add Appointment';
        }
        
        // Hide the modal immediately or after animation
        if (modal.classList.contains('opacity-0')) {
            // If using opacity animation, delay hiding
            setTimeout(() => {
                modal.classList.add('hidden');
                console.log('Modal hidden after animation');
            }, 200);
        } else {
            // Otherwise hide immediately
            modal.classList.add('hidden');
            console.log('Modal hidden immediately');
        }
        
        console.log('Appointment modal closed successfully');
        
        // Force refresh the page if we're in edit mode (as a fallback)
        if (window.location.href.includes('edit=true') || 
            document.getElementById('appointment-modal-title')?.textContent.includes('Edit')) {
            console.log('Detected edit mode, refreshing page to ensure clean state');
            // Don't actually refresh, just log it for now
        }
    } catch (error) {
        console.error('Error closing appointment modal:', error);
        // Fallback: try to hide any modal with 'appointment' in its ID
        try {
            const allModals = document.querySelectorAll('[id*="appointment"][id*="modal"]');
            allModals.forEach(m => {
                m.classList.add('hidden');
                console.log(`Force-hidden modal: ${m.id}`);
            });
        } catch (e) {
            console.error('Fatal error hiding appointment modal:', e);
        }
    }
}

// Handle appointment form submission
async function handleAppointmentSubmit(e) {
    e.preventDefault();
    console.log('Handling appointment form submission...');
    
    // Show loading indicator
    showLoadingIndicator('appointments');
    
    // Log all form fields for debugging
    const form = e.target;
    const formData = new FormData(form);
    console.log('Form data entries:');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    
    // Check if form fields have different names than expected
    const patientField = form.querySelector('[name*="patient"]');
    const doctorField = form.querySelector('[name*="doctor"]');
    const dateField = form.querySelector('[type="date"], [name*="date"]');
    const timeField = form.querySelector('[type="time"], [name*="time"]');
    
    console.log('Form fields found:', {
        patientField: patientField ? patientField.name : 'not found',
        doctorField: doctorField ? doctorField.name : 'not found',
        dateField: dateField ? dateField.name : 'not found',
        timeField: timeField ? timeField.name : 'not found'
    });
    
    // Create appointment data based on actual form field names
    const appointmentData = {
        patient_id: formData.get(patientField?.name || 'patient_id'),
        doctor_id: formData.get(doctorField?.name || 'doctor_id'),
        date: formData.get(dateField?.name || 'date'),
        time: formData.get(timeField?.name || 'time'),
        status: formData.get('status') || 'scheduled',
        notes: formData.get('notes') || null,
        // Add duration as it's required by the database schema
        duration: 30
    };
    
    console.log('Appointment data being submitted:', appointmentData);
    
    // Validate form data
    if (!appointmentData.patient_id || !appointmentData.doctor_id || !appointmentData.date || !appointmentData.time) {
        hideLoadingIndicator('appointments'); // Hide loading indicator on validation error
        alert('Please fill in all required fields');
        console.error('Form validation failed:', appointmentData);
        return;
    }
    
    try {
        let response;
        const appointmentId = form.getAttribute('data-id');
        
        if (appointmentId) {
            // Update existing appointment
            console.log('Updating existing appointment:', appointmentId);
            response = await supabase
                .from('appointments')
                .update(appointmentData)
                .eq('id', appointmentId);
        } else {
            // Insert new appointment
            console.log('Creating new appointment');
            response = await supabase
                .from('appointments')
                .insert([appointmentData]);
        }
        
        console.log('Supabase response:', response);
        
        if (response.error) {
            throw response.error;
        }
        
        // Close modal and reset form
        closeAppointmentModal();
        form.reset();
        
        // Reload appointments data
        await loadAppointmentsData();
        
        // Explicitly hide the loading indicator
        hideLoadingIndicator('appointments');
        
        // Show success message
        alert('Appointment saved successfully!');
    } catch (error) {
        console.error('Error saving appointment:', error);
        hideLoadingIndicator('appointments'); // Hide loading indicator on error
        alert(`Error saving appointment: ${error.message}`);
    }
}

// Edit an existing appointment
async function editAppointment(appointmentId) {
    // Show loading indicator
    showLoadingIndicator('appointments');
    
    try {
        // Fetch the appointment data first
        const { data: appointment, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', appointmentId)
            .single();
        
        if (error) {
            throw error;
        }
        
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        
        // Get modal elements
        const modal = document.getElementById('appointment-modal');
        const modalTitle = document.getElementById('appointment-modal-title');
        const form = document.getElementById('appointment-form');
        
        // Update modal title and set appointment ID
        modalTitle.textContent = 'Edit Appointment';
        form.setAttribute('data-id', appointment.id);
        
        // Set form values
        const patientSelect = document.getElementById('patient-select');
        if (patientSelect) patientSelect.value = appointment.patient_id;
        
        const doctorSelect = document.getElementById('doctor-select');
        if (doctorSelect) doctorSelect.value = appointment.doctor_id;
        
        // Format date and time for inputs
        const dateInput = document.getElementById('appointment-date');
        if (dateInput) dateInput.value = appointment.date || '';
        
        const timeInput = document.getElementById('appointment-time');
        if (timeInput) timeInput.value = appointment.time || '';
        
        // Set notes/reason if available
        const notesInput = document.getElementById('appointment-notes');
        if (notesInput) notesInput.value = appointment.notes || '';
        
        // Set status
        const statusSelect = document.getElementById('appointment-status');
        if (statusSelect) statusSelect.value = appointment.status || 'scheduled';
        
        // Show the modal
        modal.classList.remove('hidden');
        
        // Hide loading indicator
        hideLoadingIndicator('appointments');
    } catch (error) {
        console.error('Error fetching appointment for editing:', error);
        alert(`Error loading appointment: ${error.message}`);
        hideLoadingIndicator('appointments');
    }
}

// Delete an appointment
async function deleteAppointment(id) {
    if (!confirm('Are you sure you want to delete this appointment?')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        await loadAppointments();
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment. Please try again.');
    }
}

// ===== DEPARTMENTS FUNCTIONS =====

// Load departments from database
async function loadDepartments() {
    // Show loading indicator
    showLoadingIndicator('departments');
    
    try {
        console.log('Loading departments...');
        
        // Simple query to get departments without any joins
        const { data: departments, error } = await supabase
            .from('departments')
            .select('*');
            
        if (error) {
            console.error('Error fetching departments:', error);
            throw error;
        }
        
        console.log('Departments loaded successfully:', departments);
        
        const tableBody = document.getElementById('departments-table-body');
        if (!tableBody) {
            console.error('Departments table body not found');
            showToast('Error: Departments table not found', 'error');
            hideLoadingIndicator('departments');
            return;
        }
        
        tableBody.innerHTML = '';
        
        if (!departments || departments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td class="px-4 py-3 text-center text-gray-500" colspan="5">No departments found</td>
                </tr>
            `;
            hideLoadingIndicator('departments');
            return;
        }
        
        departments.forEach(department => {
            // Format date for display
            const createdDate = department.created_at ? new Date(department.created_at).toLocaleDateString() : '-';
            const updatedDate = department.updated_at ? new Date(department.updated_at).toLocaleDateString() : '-';
            
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors duration-150';
            row.innerHTML = `
                <td class="px-4 py-3 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${department.name}</div>
                </td>
                <td class="px-4 py-3">
                    <div class="text-sm text-gray-500 max-w-xs truncate">${department.description || '-'}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${createdDate}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${updatedDate}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                        <button class="text-blue-600 hover:text-blue-900 edit-department p-1 rounded hover:bg-blue-100 transition-colors duration-150" data-id="${department.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                        </button>
                        <button class="text-red-600 hover:text-red-900 delete-department p-1 rounded hover:bg-red-100 transition-colors duration-150" data-id="${department.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
            
            // Add event listeners for edit and delete
            row.querySelector('.edit-department').addEventListener('click', () => {
                editDepartment(department);
            });
            
            row.querySelector('.delete-department').addEventListener('click', () => {
                deleteDepartment(department.id);
            });
        });
    } catch (error) {
        console.error('Error loading departments:', error);
        const tableBody = document.getElementById('departments-table-body');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td class="px-4 py-3 text-center text-red-500" colspan="5">Error loading departments: ${error.message || 'Unknown error'}</td>
                </tr>
            `;
        }
        // Show error toast
        showToast(`Error loading departments: ${error.message || 'Unknown error'}`, 'error');
    } finally {
        // Hide loading indicator
        hideLoadingIndicator('departments');
    }
}

// Open department modal for new department
function openDepartmentModal() {
    try {
        const modal = document.getElementById('department-modal');
        if (!modal) {
            console.error('Department modal not found');
            return;
        }
        
        const modalTitle = document.getElementById('department-modal-title');
        const form = document.getElementById('department-form');
        
        if (modalTitle) {
            modalTitle.textContent = 'Add New Department';
        }
        
        if (form) {
            form.reset();
            form.removeAttribute('data-id');
        }
        
        // Show the modal first without animation
        modal.classList.remove('hidden');
        
        // Add animation after a tiny delay to ensure proper rendering
        setTimeout(() => {
            modal.classList.add('opacity-100');
            modal.classList.remove('opacity-0');
        }, 10);
    } catch (error) {
        console.error('Error opening department modal:', error);
        showToast('Error opening department form', 'error');
    }
}

// Close department modal
function closeDepartmentModal() {
    const modal = document.getElementById('department-modal');
    if (!modal) return;
    
    // Add fade-out animation
    modal.classList.add('opacity-0');
    
    // Reset the form
    const form = document.getElementById('department-form');
    if (form) {
        form.reset();
        // Clear any data-id attribute that might have been set for editing
        form.removeAttribute('data-id');
    }
    
    // Reset modal title to default
    const modalTitle = document.getElementById('department-modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Add Department';
    }
    
    // Hide the modal after a short delay for animation
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('opacity-0');
    }, 200);
}

// Handle department form submission
async function handleDepartmentSubmit(e) {
    e.preventDefault();
    console.log('Handling department form submission...');
    
    // Show loading indicator
    showLoadingIndicator('departments');
    
    const form = e.target;
    const formData = new FormData(form);
    const departmentData = {
        name: formData.get('name'),
        description: formData.get('description') || null
    };
    
    try {
        let response;
        const departmentId = form.getAttribute('data-id');
        
        if (departmentId) {
            // Update existing department
            departmentData.updated_at = new Date().toISOString();
            response = await supabase
                .from('departments')
                .update(departmentData)
                .eq('id', departmentId);
        } else {
            // Insert new department
            response = await supabase
                .from('departments')
                .insert(departmentData);
        }
        
        if (response.error) throw response.error;
        
        closeDepartmentModal();
        await loadDepartments();
        
        // Show success message
        const actionType = departmentId ? 'updated' : 'added';
        showToast(`Department successfully ${actionType}`, 'success');
    } catch (error) {
        console.error('Error saving department:', error);
        showToast(`Error saving department: ${error.message}`, 'error');
    } finally {
        // Hide loading indicator
        hideLoadingIndicator('departments');
    }
}

// Edit an existing department
async function editDepartment(department) {
    try {
        // Show loading indicator
        showLoadingIndicator('departments');
        
        // Get the modal and form elements
        const modal = document.getElementById('department-modal');
        const modalTitle = document.getElementById('department-modal-title');
        const form = document.getElementById('department-form');
        
        if (!modal || !modalTitle || !form) {
            console.error('Department modal elements not found');
            hideLoadingIndicator('departments');
            return;
        }
        
        // Set modal title for editing
        modalTitle.textContent = 'Edit Department';
        
        // Set the department ID as a data attribute on the form
        form.setAttribute('data-id', department.id);
        
        // Populate form fields with department data
        document.getElementById('department-name').value = department.name || '';
        document.getElementById('department-description').value = department.description || '';
        
        // Show the modal
        modal.classList.remove('hidden');
        
        // Add animation after a tiny delay
        setTimeout(() => {
            modal.classList.add('opacity-100');
            modal.classList.remove('opacity-0');
        }, 10);
    } catch (error) {
        console.error('Error editing department:', error);
        showToast('Error loading department data', 'error');
    } finally {
        // Hide loading indicator
        hideLoadingIndicator('departments');
    }
}

// Delete a department
async function deleteDepartment(id) {
    if (!confirm('Are you sure you want to delete this department?')) {
        return;
    }
    
    // Show loading indicator
    showLoadingIndicator('departments');
    
    try {
        const { error } = await supabase
            .from('departments')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        await loadDepartments();
        showToast('Department successfully deleted', 'success');
    } catch (error) {
        console.error('Error deleting department:', error);
        showToast(`Error deleting department: ${error.message}`, 'error');
    } finally {
        // Hide loading indicator
        hideLoadingIndicator('departments');
    }
}

// Set up event listeners for room action buttons
function setupRoomActionListeners() {
    // Get all edit room buttons
    const editRoomButtons = document.querySelectorAll('.edit-room-btn');
    editRoomButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roomId = this.getAttribute('data-id');
            editRoom(roomId);
        });
    });
    
    // Get all delete room buttons
    const deleteRoomButtons = document.querySelectorAll('.delete-room-btn');
    deleteRoomButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roomId = this.getAttribute('data-id');
            deleteRoom(roomId);
        });
    });
}

// Edit a room
function editRoom(roomId) {
    console.log('Editing room with ID:', roomId);
    alert('Edit room functionality will be implemented in a future update.');
}

// Delete a room
function deleteRoom(roomId) {
    console.log('Deleting room with ID:', roomId);
    if (confirm('Are you sure you want to delete this room?')) {
        // In a real application, this would make an API call to delete the room
        alert('Room deleted successfully (simulated).');
        // Reload the rooms data to refresh the table
        loadRoomsData();
    }
}

// Function has been removed as it's no longer needed with the updated schema

// Populate department dropdown
async function populateDepartmentDropdown(selectId) {
    try {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        // Clear existing options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Fetch departments from Supabase
        const { data: departments, error } = await supabase
            .from('departments')
            .select('id, name')
            .order('name');
            
        if (error) {
            console.error('Error fetching departments:', error);
            return;
        }
        
        // Add departments to dropdown
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.id;
            option.textContent = department.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating department dropdown:', error);
    }
}

// Populate medications dropdown
async function populateMedicationsDropdown(selectId) {
    try {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        // Clear existing options
        select.innerHTML = '';
        
        // Fetch medications from Supabase
        const { data: medications, error } = await supabase
            .from('medications')
            .select('id, name, category')
            .order('name');
            
        if (error) {
            console.error('Error fetching medications:', error);
            return;
        }
        
        // Add medications to dropdown
        medications.forEach(medication => {
            const option = document.createElement('option');
            option.value = medication.id;
            option.textContent = `${medication.name} (${medication.category})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating medications dropdown:', error);
    }
}

// Load medical records from database
async function loadMedicalRecords() {
    try {
        const { data: records, error } = await supabase
            .from('medical_records')
            .select(`
                id,
                record_date,
                diagnosis,
                notes,
                patient_id,
                doctor_id,
                patients:patient_id(id, first_name, last_name),
                doctors:doctor_id(id, first_name, last_name)
            `)
            .order('record_date', { ascending: false });
            
        if (error) {
            // If the table doesn't exist yet, show a placeholder message
            if (error.code === '42P01') { // PostgreSQL code for undefined_table
                const tableBody = document.getElementById('medical-records-table-body');
                tableBody.innerHTML = `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="5">Medical records table not found. This feature will be available soon.</td>
                    </tr>
                `;
                return;
            }
            throw error;
        }
        
        const tableBody = document.getElementById('medical-records-table-body');
        tableBody.innerHTML = '';
        
        if (!records || records.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="5">No medical records found</td>
                </tr>
            `;
            return;
        }
        
        records.forEach(record => {
            const date = new Date(record.record_date);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            const patientName = record.patients ? 
                `${record.patients.first_name} ${record.patients.last_name}` : 'Unknown';
            
            const doctorName = record.doctors ? 
                `${record.doctors.first_name} ${record.doctors.last_name}` : 'Unknown';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${patientName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${doctorName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formattedDate}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${record.diagnosis}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-2 view-medical-record" data-id="${record.id}">View</button>
                    <button class="text-blue-600 hover:text-blue-900 mr-2 edit-medical-record" data-id="${record.id}">Edit</button>
                    <button class="text-red-600 hover:text-red-900 delete-medical-record" data-id="${record.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
            
            // Add event listeners for edit and delete
            row.querySelector('.edit-medical-record').addEventListener('click', () => {
                editMedicalRecord(record);
            });
            
            row.querySelector('.delete-medical-record').addEventListener('click', () => {
                deleteMedicalRecord(record.id);
            });
            
            row.querySelector('.view-medical-record').addEventListener('click', () => {
                viewMedicalRecord(record);
            });
        });
    } catch (error) {
        console.error('Error loading medical records:', error);
        const tableBody = document.getElementById('medical-records-table-body');
        tableBody.innerHTML = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500" colspan="5">Error loading medical records: ${error.message}</td>
            </tr>
        `;
    }
}

// Open medical record modal for new record
async function openMedicalRecordModal(recordId = null) {
    const modal = document.getElementById('medical-record-modal');
    const form = document.getElementById('medical-record-form');
    const modalTitle = document.getElementById('medical-record-modal-title');
    
    // Reset form
    form.reset();
    document.getElementById('medical-record-id').value = '';
    
    // Clear symptoms tags
    const symptomsContainer = document.querySelector('.symptom-tags');
    symptomsContainer.innerHTML = '';
    document.getElementById('medical-record-symptoms').value = '[]';
    
    // Populate patient dropdown
    await populatePatientDropdown('medical-record-patient');
    
    // Populate doctor dropdown
    await populateDoctorDropdown('medical-record-doctor');
    
    // Populate appointment dropdown
    await populateAppointmentDropdown('medical-record-appointment');
    
    if (recordId) {
        // Set modal title for edit
        modalTitle.textContent = 'Edit Medical Record';
        document.getElementById('medical-record-id').value = recordId;
        
        // Fetch record data
        try {
            const { data, error } = await supabase
                .from('medical_records')
                .select('*')
                .eq('id', recordId)
                .single();
                
            if (error) throw error;
            
            if (data) {
                // Populate form with record data
                document.getElementById('medical-record-patient').value = data.patient_id || '';
                document.getElementById('medical-record-doctor').value = data.doctor_id || '';
                document.getElementById('medical-record-appointment').value = data.appointment_id || '';
                document.getElementById('medical-record-diagnosis').value = data.diagnosis || '';
                document.getElementById('medical-record-treatment').value = data.treatment || '';
                document.getElementById('medical-record-notes').value = data.notes || '';
                
                // Add symptom tags if they exist
                if (data.symptoms && Array.isArray(data.symptoms)) {
                    // Store symptoms in hidden field
                    document.getElementById('medical-record-symptoms').value = JSON.stringify(data.symptoms);
                    
                    // Add symptom tags to the UI
                    data.symptoms.forEach(symptom => addSymptomTag(symptom));
                }
            }
        } catch (error) {
            console.error('Error fetching medical record:', error);
            showToast('Error loading medical record data', 'error');
        }
    } else {
        // Set modal title for new record
        modalTitle.textContent = 'Add New Medical Record';
    }
    
    // Initialize symptom input handler if not already initialized
    initSymptomTagsHandler();
    
    // Show the modal
    modal.classList.remove('hidden');
}

// Close medical record modal
function closeMedicalRecordModal() {
    const modal = document.getElementById('medical-record-modal');
    modal.classList.add('hidden');
}

// Load Medical Records Data
async function loadMedicalRecordsData() {
    console.log('Loading medical records data...');
    const tableBody = document.getElementById('medical-records-table-body');
    
    if (!tableBody) {
        console.error('Medical records table body not found');
        return;
    }
    
    // Clear existing rows
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                <div class="flex justify-center items-center space-x-2">
                    <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading medical records...</span>
                </div>
            </td>
        </tr>
    `;
    
    try {
        // First, check if the medical_records table exists
        const { error: tableCheckError } = await supabase
            .from('medical_records')
            .select('id', { count: 'exact', head: true });
            
        if (tableCheckError) {
            console.error('Error checking medical_records table:', tableCheckError);
            throw new Error('Could not access medical records table. Please check your database structure.');
        }
        
        // Fetch medical records with basic info first
        const { data: records, error } = await supabase
            .from('medical_records')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Clear loading indicator
        tableBody.innerHTML = '';
        
        if (!records || records.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                        No medical records found.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Populate table with records
        records.forEach(async (record) => {
            // Get patient and doctor info separately to avoid foreign key issues
            let patientName = 'Unknown Patient';
            let doctorName = 'Unknown Doctor';
            let formattedDate = 'N/A';
            
            try {
                // Get patient info if patient_id exists
                if (record.patient_id) {
                    const { data: patientData } = await supabase
                        .from('patients')
                        .select('first_name, last_name')
                        .eq('id', record.patient_id)
                        .single();
                    
                    if (patientData) {
                        patientName = `${patientData.first_name || ''} ${patientData.last_name || ''}`.trim();
                    }
                }
                
                // Get doctor info if doctor_id exists
                if (record.doctor_id) {
                    const { data: doctorData } = await supabase
                        .from('doctors')
                        .select('first_name, last_name')
                        .eq('id', record.doctor_id)
                        .single();
                    
                    if (doctorData) {
                        doctorName = `${doctorData.first_name || ''} ${doctorData.last_name || ''}`.trim();
                    }
                }
                
                // Format date from created_at
                if (record.created_at) {
                    const date = new Date(record.created_at);
                    formattedDate = date.toLocaleDateString();
                }
            } catch (err) {
                console.warn('Error fetching related data for medical record:', err);
                // Continue with default values if there's an error
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${patientName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${doctorName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formattedDate}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${record.diagnosis || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-2 view-medical-record" data-id="${record.id}">View</button>
                    <button class="text-blue-600 hover:text-blue-900 mr-2 edit-medical-record" data-id="${record.id}">Edit</button>
                    <button class="text-red-600 hover:text-red-900 delete-medical-record" data-id="${record.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
            
            // Add event listeners for the action buttons
            row.querySelector('.view-medical-record').addEventListener('click', () => {
                viewMedicalRecord(record);
            });
            
            row.querySelector('.edit-medical-record').addEventListener('click', () => {
                editMedicalRecord(record.id);
            });
            
            row.querySelector('.delete-medical-record').addEventListener('click', () => {
                deleteMedicalRecord(record.id);
            });
        });
        
        console.log('Medical records loaded successfully');
    } catch (error) {
        console.error('Error loading medical records:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-red-500">
                    Error loading medical records: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Initialize symptom tags handler
function initSymptomTagsHandler() {
    const symptomInput = document.getElementById('symptom-input');
    
    // Remove any existing event listener first
    const newSymptomInput = symptomInput.cloneNode(true);
    symptomInput.parentNode.replaceChild(newSymptomInput, symptomInput);
    
    // Add event listener for adding symptoms
    newSymptomInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            const symptom = this.value.trim();
            if (symptom) {
                // Check if symptom already exists
                const symptomsContainer = document.querySelector('.symptom-tags');
                const existingSymptoms = Array.from(symptomsContainer.children)
                    .map(tag => tag.dataset.symptom);
                
                if (!existingSymptoms.includes(symptom)) {
                    addSymptomTag(symptom);
                    this.value = '';
                } else {
                    // Flash the existing tag
                    const existingTag = Array.from(symptomsContainer.children)
                        .find(tag => tag.dataset.symptom === symptom);
                    
                    if (existingTag) {
                        existingTag.classList.add('bg-yellow-200');
                        setTimeout(() => {
                            existingTag.classList.remove('bg-yellow-200');
                            existingTag.classList.add('bg-blue-100');
                        }, 500);
                    }
                    
                    this.value = '';
                }
            }
        }
    });
}

// Function to add a symptom tag to the UI
function addSymptomTag(symptom) {
    const symptomsContainer = document.querySelector('.symptom-tags');
    const tagElement = document.createElement('div');
    tagElement.className = 'symptom-tag flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded';
    tagElement.dataset.symptom = symptom;
    
    tagElement.innerHTML = `
        <span>${symptom}</span>
        <button type="button" class="remove-symptom ml-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
        </button>
    `;
    
    // Add remove button event listener
    tagElement.querySelector('.remove-symptom').addEventListener('click', () => {
        removeSymptomTag(symptom);
    });
    
    symptomsContainer.appendChild(tagElement);
    
    // Update the hidden input with current symptoms
    updateSymptomsInput();
}

// Function to remove a symptom tag
function removeSymptomTag(symptom) {
    const symptomsContainer = document.querySelector('.symptom-tags');
    const tagToRemove = Array.from(symptomsContainer.children)
        .find(tag => tag.dataset.symptom === symptom);
    
    if (tagToRemove) {
        symptomsContainer.removeChild(tagToRemove);
        
        // Update the hidden input with current symptoms
        updateSymptomsInput();
    }
}

// Function to update the hidden symptoms input
function updateSymptomsInput() {
    const symptomsContainer = document.querySelector('.symptom-tags');
    const symptomsInput = document.getElementById('medical-record-symptoms');
        
    // Get all symptoms from tags
    const symptoms = Array.from(symptomsContainer.children)
        .map(tag => tag.dataset.symptom);
        
    // Update hidden input value
    symptomsInput.value = JSON.stringify(symptoms);
}

// View Medical Record
async function viewMedicalRecord(record) {
    console.log('Viewing medical record:', record);
        
    try {
        // If record is just an ID, fetch the full record
        let medicalRecord = record;
        if (typeof record === 'string' || typeof record === 'number') {
            const { data, error } = await supabase
                .from('medical_records')
                .select('*, patient:patient_id(id, first_name, last_name), doctor:doctor_id(id, first_name, last_name), appointment:appointment_id(id, appointment_date)')
                .eq('id', record)
                .single();
                    
            if (error) throw error;
            medicalRecord = data;
        }
            
        if (!medicalRecord) {
            throw new Error('Medical record not found');
        }
            
        // Format patient name
        const patientName = medicalRecord.patient ? 
            `${medicalRecord.patient.first_name || ''} ${medicalRecord.patient.last_name || ''}`.trim() : 
            'Unknown Patient';
            
        // Format doctor name
        const doctorName = medicalRecord.doctor ? 
            `${medicalRecord.doctor.first_name || ''} ${medicalRecord.doctor.last_name || ''}`.trim() : 
            'Unknown Doctor';
            
        // Format date
        let formattedDate = 'N/A';
        if (medicalRecord.appointment && medicalRecord.appointment.appointment_date) {
            const date = new Date(medicalRecord.appointment.appointment_date);
            formattedDate = date.toLocaleDateString();
        } else if (medicalRecord.created_at) {
            const date = new Date(medicalRecord.created_at);
            formattedDate = date.toLocaleDateString();
        }
            
        // Format symptoms
        let symptomsHtml = '<p class="text-gray-500 italic">No symptoms recorded</p>';
        if (medicalRecord.symptoms && Array.isArray(medicalRecord.symptoms) && medicalRecord.symptoms.length > 0) {
            symptomsHtml = medicalRecord.symptoms.map(symptom => 
                `<span class="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">${symptom}</span>`
            ).join('');
        }
            
        // Get the view modal
        const viewModal = document.getElementById('medical-record-view-modal');
        if (!viewModal) {
            throw new Error('View modal not found');
        }
            
        // Populate the modal with record data
        const contentContainer = viewModal.querySelector('.modal-content') || viewModal;
        contentContainer.innerHTML = `
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            Medical Record Details
                        </h3>
                        <div class="mt-4 space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm font-medium text-gray-500">Patient</p>
                                    <p class="text-base text-gray-900">${patientName}</p>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-500">Doctor</p>
                                    <p class="text-base text-gray-900">${doctorName}</p>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-500">Date</p>
                                    <p class="text-base text-gray-900">${formattedDate}</p>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-500">Record ID</p>
                                    <p class="text-base text-gray-900">${medicalRecord.id}</p>
                                </div>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500">Diagnosis</p>
                                <p class="text-base text-gray-900">${medicalRecord.diagnosis || 'None recorded'}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500">Symptoms</p>
                                <div class="mt-1">${symptomsHtml}</div>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500">Treatment</p>
                                <p class="text-base text-gray-900">${medicalRecord.treatment || 'None recorded'}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500">Notes</p>
                                <p class="text-base text-gray-900">${medicalRecord.notes || 'None'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm close-view-modal">
                    Close
                </button>
                <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm edit-from-view" data-id="${medicalRecord.id}">
                    Edit Record
                </button>
            </div>
        `;
            
        // Show the view modal
        viewModal.classList.remove('hidden');
            
        // Add event listener to close button
        viewModal.querySelector('.close-view-modal').addEventListener('click', () => {
            viewModal.classList.add('hidden');
        });
            
        // Add event listener to edit button
        viewModal.querySelector('.edit-from-view').addEventListener('click', () => {
            viewModal.classList.add('hidden');
            editMedicalRecord(medicalRecord.id);
        });
            
    } catch (error) {
        console.error('Error viewing medical record:', error);
        showToast('Error viewing medical record: ' + error.message, 'error');
    }
}

// Edit Medical Record
async function editMedicalRecord(recordId) {
    try {
        // Open the medical record modal in edit mode
        await openMedicalRecordModal(recordId);
    } catch (error) {
        console.error('Error editing medical record:', error);
        showToast('Error editing medical record: ' + error.message, 'error');
    }
}

// Delete Medical Record
async function deleteMedicalRecord(recordId) {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this medical record? This action cannot be undone.')) {
        return;
    }
        
    try {
        const { error } = await supabase
            .from('medical_records')
            .delete()
            .eq('id', recordId);
                
        if (error) throw error;
            
        // Reload medical records data
        await loadMedicalRecordsData();
            
        showToast('Medical record deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting medical record:', error);
        showToast('Error deleting medical record: ' + error.message, 'error');
    }
}

// Load Prescriptions Data
async function loadPrescriptionsData() {
    console.log('Loading prescriptions data...');
    const tableBody = document.getElementById('prescriptions-table-body');
    
    if (!tableBody) {
        console.error('Prescriptions table body not found');
        return;
    }
    
    // Clear existing rows
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                <div class="flex justify-center items-center space-x-2">
                    <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading prescriptions...</span>
                </div>
            </td>
        </tr>
    `;
    
    try {
        // Fetch prescriptions with patient and doctor info
        const { data: prescriptions, error } = await supabase
            .from('prescriptions')
            .select('*, patient:patient_id(id, first_name, last_name), doctor:doctor_id(id, first_name, last_name)')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Clear loading indicator
        tableBody.innerHTML = '';
        
        if (prescriptions.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        No prescriptions found.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Populate table with prescriptions
        prescriptions.forEach(prescription => {
            // Format patient name, handling possible null values
            const patientName = prescription.patient ? 
                `${prescription.patient.first_name || ''} ${prescription.patient.last_name || ''}`.trim() : 
                'Unknown Patient';
            
            // Format doctor name, handling possible null values
            const doctorName = prescription.doctor ? 
                `${prescription.doctor.first_name || ''} ${prescription.doctor.last_name || ''}`.trim() : 
                'Unknown Doctor';
            
            // Format date
            let formattedDate = 'N/A';
            if (prescription.created_at) {
                const date = new Date(prescription.created_at);
                formattedDate = date.toLocaleDateString();
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${patientName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${doctorName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formattedDate}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${prescription.medication_name || 'N/A'}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${prescription.dosage || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-2 view-prescription" data-id="${prescription.id}">View</button>
                    <button class="text-blue-600 hover:text-blue-900 mr-2 edit-prescription" data-id="${prescription.id}">Edit</button>
                    <button class="text-red-600 hover:text-red-900 delete-prescription" data-id="${prescription.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
            
            // Add event listeners for the action buttons
            row.querySelector('.view-prescription').addEventListener('click', () => {
                // Implement view prescription function
                console.log('View prescription:', prescription.id);
            });
            
            row.querySelector('.edit-prescription').addEventListener('click', () => {
                // Implement edit prescription function
                console.log('Edit prescription:', prescription.id);
            });
            
            row.querySelector('.delete-prescription').addEventListener('click', () => {
                // Implement delete prescription function
                console.log('Delete prescription:', prescription.id);
            });
        });
        
        console.log('Prescriptions loaded successfully');
    } catch (error) {
        console.error('Error loading prescriptions:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-red-500">
                    Error loading prescriptions: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Load Medications Data
async function loadMedicationsData() {
    console.log('Loading medications data...');
    const tableBody = document.getElementById('medications-table-body');
    
    if (!tableBody) {
        console.error('Medications table body not found');
        return;
    }
    
    // Clear existing rows
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                <div class="flex justify-center items-center space-x-2">
                    <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading medications...</span>
                </div>
            </td>
        </tr>
    `;
    
    try {
        // Fetch medications
        const { data: medications, error } = await supabase
            .from('medications')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) throw error;
        
        // Clear loading indicator
        tableBody.innerHTML = '';
        
        if (medications.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                        No medications found.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Populate table with medications
        medications.forEach(medication => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${medication.name || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${medication.category || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${medication.manufacturer || 'N/A'}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${medication.description || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-2 edit-medication" data-id="${medication.id}">Edit</button>
                    <button class="text-red-600 hover:text-red-900 delete-medication" data-id="${medication.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
            
            // Add event listeners for the action buttons
            row.querySelector('.edit-medication').addEventListener('click', () => {
                // Implement edit medication function
                console.log('Edit medication:', medication.id);
            });
            
            row.querySelector('.delete-medication').addEventListener('click', () => {
                // Implement delete medication function
                console.log('Delete medication:', medication.id);
            });
        });
        
        console.log('Medications loaded successfully');
    } catch (error) {
        console.error('Error loading medications:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-red-500">
                    Error loading medications: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Load Rooms Data
async function loadRoomsData() {
    console.log('Loading rooms data...');
    const tableBody = document.getElementById('rooms-table-body');
    
    if (!tableBody) {
        console.error('Rooms table body not found');
        return;
    }
    
    // Clear existing rows
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                <div class="flex justify-center items-center space-x-2">
                    <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading rooms...</span>
                </div>
            </td>
        </tr>
    `;
    
    try {
        // Fetch rooms with patient info
        const { data: rooms, error } = await supabase
            .from('rooms')
            .select('*, patient:patient_id(id, first_name, last_name)')
            .order('room_number', { ascending: true });
        
        if (error) throw error;
        
        // Clear loading indicator
        tableBody.innerHTML = '';
        
        if (rooms.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        No rooms found.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Populate table with rooms
        rooms.forEach(room => {
            // Format patient name, handling possible null values
            let patientName = 'Not Occupied';
            let occupancyStatus = 'text-green-600';
            
            if (room.is_occupied && room.patient) {
                patientName = `${room.patient.first_name || ''} ${room.patient.last_name || ''}`.trim();
                occupancyStatus = 'text-red-600';
            }
            
            const dailyRate = parseFloat(room.daily_rate || 0).toFixed(2);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${room.room_number || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${room.room_type || 'Standard'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${room.floor || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">$${dailyRate}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm ${occupancyStatus}">${room.is_occupied ? 'Occupied' : 'Available'}</div>
                    <div class="text-sm text-gray-500">${patientName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-2 edit-room" data-id="${room.id}">Edit</button>
                    <button class="text-red-600 hover:text-red-900 delete-room" data-id="${room.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
            
            // Add event listeners for the action buttons
            row.querySelector('.edit-room').addEventListener('click', () => {
                editRoom(room.id);
            });
            
            row.querySelector('.delete-room').addEventListener('click', () => {
                deleteRoom(room.id);
            });
        });
        
        console.log('Rooms loaded successfully');
    } catch (error) {
        console.error('Error loading rooms:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-red-500">
                    Error loading rooms: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Edit Room
async function editRoom(roomId) {
    try {
        // Fetch room data
        const { data: room, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('id', roomId)
            .single();
            
        if (error) throw error;
        
        // Get the modal and form
        const modal = document.getElementById('room-modal');
        const form = document.getElementById('room-form');
        
        if (!modal || !form) {
            throw new Error('Room modal or form not found');
        }
        
        // Set form data
        form.setAttribute('data-id', room.id);
        document.getElementById('room-number').value = room.room_number || '';
        document.getElementById('room-type').value = room.room_type || '';
        document.getElementById('floor').value = room.floor || '';
        document.getElementById('daily-rate').value = room.daily_rate || '';
        
        // Set occupancy status
        const roomOccupied = document.getElementById('room-occupied');
        if (roomOccupied) {
            roomOccupied.checked = room.is_occupied || false;
            
            // Show/hide patient selector
            const patientContainer = document.getElementById('patient-select-container');
            if (patientContainer) {
                if (room.is_occupied) {
                    patientContainer.classList.remove('hidden');
                } else {
                    patientContainer.classList.add('hidden');
                }
            }
        }
        
        // Set patient ID if occupied
        if (room.is_occupied && room.patient_id) {
            const patientSelect = document.getElementById('patient-id');
            if (patientSelect) {
                // Make sure to populate patient dropdown first
                await populatePatientDropdown('patient-id');
                patientSelect.value = room.patient_id;
            }
        }
        
        // Update modal title
        const modalTitle = document.getElementById('room-modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Edit Room';
        }
        
        // Show the modal
        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error editing room:', error);
        showToast('Error editing room: ' + error.message, 'error');
    }
}

// Delete Room
async function deleteRoom(roomId) {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('id', roomId);
            
        if (error) throw error;
        
        // Reload rooms data
        await loadRoomsData();
        
        showToast('Room deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting room:', error);
        showToast('Error deleting room: ' + error.message, 'error');
    }
}

// Populate patient dropdown for medical record form
async function populatePatientDropdown(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Clear existing options except the default one
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, role')
            .eq('role', 'patient');
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            // Sort patients by name
            data.sort((a, b) => {
                const nameA = `${a.last_name}, ${a.first_name}`;
                const nameB = `${b.last_name}, ${b.first_name}`;
                return nameA.localeCompare(nameB);
            });
            
            // Add patient options
            data.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = `${patient.last_name}, ${patient.first_name}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading patients:', error);
        showToast('Error loading patient list', 'error');
    }
}

// Populate doctor dropdown for medical record form
async function populateDoctorDropdown(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Clear existing options except the default one
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, role')
            .eq('role', 'doctor');
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            // Sort doctors by name
            data.sort((a, b) => {
                const nameA = `${a.last_name}, ${a.first_name}`;
                const nameB = `${b.last_name}, ${b.first_name}`;
                return nameA.localeCompare(nameB);
            });
            
            // Add doctor options
            data.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `${doctor.last_name}, ${doctor.first_name}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading doctors:', error);
        showToast('Error loading doctor list', 'error');
    }
}

// Populate appointment dropdown for medical record form
async function populateAppointmentDropdown(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Clear existing options except the default one
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    try {
        // Get recent appointments that are completed or in progress
        const { data, error } = await supabase
            .from('appointments')
            .select('id, patient_id, doctor_id, appointment_date, status')
            .in('status', ['completed', 'in_progress'])
            .order('appointment_date', { ascending: false })
            .limit(50);
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            // Add appointment options
            for (const appointment of data) {
                // Fetch patient and doctor names
                let patientName = 'Unknown Patient';
                let doctorName = 'Unknown Doctor';
                
                try {
                    if (appointment.patient_id) {
                        const { data: patientData } = await supabase
                            .from('profiles')
                            .select('first_name, last_name')
                            .eq('id', appointment.patient_id)
                            .single();
                            
                        if (patientData) {
                            patientName = `${patientData.first_name} ${patientData.last_name}`;
                        }
                    }
                    
                    if (appointment.doctor_id) {
                        const { data: doctorData } = await supabase
                            .from('profiles')
                            .select('first_name, last_name')
                            .eq('id', appointment.doctor_id)
                            .single();
                            
                        if (doctorData) {
                            doctorName = `${doctorData.first_name} ${doctorData.last_name}`;
                        }
                    }
                } catch (nameError) {
                    console.error('Error fetching names:', nameError);
                }
                
                const option = document.createElement('option');
                option.value = appointment.id;
                const date = new Date(appointment.appointment_date).toLocaleDateString();
                option.textContent = `${date} - ${patientName} with ${doctorName}`;
                select.appendChild(option);
            }
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        showToast('Error loading appointment list', 'error');
    }
}

// Handle medical record form submission
async function handleMedicalRecordSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Get symptoms from the hidden field (JSON string)
    let symptoms = [];
    try {
        const symptomsStr = formData.get('symptoms');
        if (symptomsStr) {
            symptoms = JSON.parse(symptomsStr);
        }
    } catch (error) {
        console.error('Error parsing symptoms:', error);
    }
    
    // Build the record data object
    const recordData = {
        patient_id: formData.get('patient_id'),
        doctor_id: formData.get('doctor_id'),
        appointment_id: formData.get('appointment_id') || null,
        diagnosis: formData.get('diagnosis') || null,
        symptoms: symptoms.length > 0 ? symptoms : null,
        treatment: formData.get('treatment') || null,
        notes: formData.get('notes') || null
    };
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...';
    submitBtn.disabled = true;
    
    try {
        let response;
        const recordId = document.getElementById('medical-record-id').value;
        
        if (recordId) {
            // Update existing record
            response = await supabase
                .from('medical_records')
                .update(recordData)
                .eq('id', recordId);
        } else {
            // Insert new record
            response = await supabase
                .from('medical_records')
                .insert(recordData);
        }
        
        if (response.error) {
            throw response.error;
        }
        
        // Show success message
        showToast(`Medical record successfully ${recordId ? 'updated' : 'created'}`, 'success');
        
        // Close the modal and reload the data
        closeMedicalRecordModal();
        await loadMedicalRecordsData();
    } catch (error) {
        console.error('Error saving medical record:', error);
        showToast('Error saving medical record: ' + error.message, 'error');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

// Create medical records table if it doesn't exist
async function createMedicalRecordsTable() {
    try {
        // This function would typically be handled server-side
        // For this implementation, we'll show an alert
        alert('Medical records table needs to be created. Please contact your administrator.');
        return false;
    } catch (error) {
        console.error('Error creating medical records table:', error);
        return false;
    }
}

// Setup medical record action listeners
function setupMedicalRecordActionListeners() {
    // View button event listeners
    document.querySelectorAll('.view-medical-record').forEach(button => {
        button.addEventListener('click', function() {
            const recordId = this.getAttribute('data-id');
            viewMedicalRecord(recordId);
        });
    });
    
    // Edit button event listeners
    document.querySelectorAll('.edit-medical-record').forEach(button => {
        button.addEventListener('click', function() {
            const recordId = this.getAttribute('data-id');
            editMedicalRecord(recordId);
        });
    });
    
    // Delete button event listeners
    document.querySelectorAll('.delete-medical-record').forEach(button => {
        button.addEventListener('click', function() {
            const recordId = this.getAttribute('data-id');
            deleteMedicalRecord(recordId);
        });
    });
}

// Edit an existing medical record
async function editMedicalRecord(recordId) {
    try {
        await openMedicalRecordModal(recordId);
    } catch (error) {
        console.error('Error editing medical record:', error);
        showToast('Error loading medical record for editing', 'error');
    }
}

// View a medical record in a modal (read-only)
async function viewMedicalRecord(recordId) {
    try {
        // Fetch the medical record
        const { data, error } = await supabase
            .from('medical_records')
            .select(`
                id, 
                patient_id, 
                doctor_id, 
                appointment_id, 
                diagnosis, 
                symptoms, 
                treatment, 
                notes, 
                created_at
            `)
            .eq('id', recordId)
            .single();
        
        if (error) throw error;
        
        if (!data) {
            showToast('Medical record not found', 'error');
            return;
        }
        
        // Fetch patient and doctor names
        let patientName = 'Unknown Patient';
        let doctorName = 'Unknown Doctor';
        let appointmentDetails = 'No appointment linked';
        
        if (data.patient_id) {
            const { data: patientData } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', data.patient_id)
                .single();
                
            if (patientData) {
                patientName = `${patientData.first_name} ${patientData.last_name}`;
            }
        }
        
        if (data.doctor_id) {
            const { data: doctorData } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', data.doctor_id)
                .single();
                
            if (doctorData) {
                doctorName = `${doctorData.first_name} ${doctorData.last_name}`;
            }
        }
        
        if (data.appointment_id) {
            const { data: appointmentData } = await supabase
                .from('appointments')
                .select('appointment_date')
                .eq('id', data.appointment_id)
                .single();
                
            if (appointmentData) {
                appointmentDetails = `Appointment on ${new Date(appointmentData.appointment_date).toLocaleDateString()}`;
            }
        }
        
        // Format symptoms
        let symptomsHtml = '<em>None recorded</em>';
        if (data.symptoms && Array.isArray(data.symptoms) && data.symptoms.length > 0) {
            symptomsHtml = data.symptoms.map(symptom => 
                `<span class="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2 mb-2">${symptom}</span>`
            ).join('');
        }
        
        // Create and show the view modal
        const viewModal = document.createElement('div');
        viewModal.className = 'fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center';
        viewModal.id = 'view-medical-record-modal';
        
        viewModal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Medical Record Details</h3>
                    <button class="text-gray-400 hover:text-gray-500 view-modal-close" type="button">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h4 class="text-sm font-medium text-gray-500">Patient</h4>
                            <p class="text-sm text-gray-900">${patientName}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-500">Doctor</h4>
                            <p class="text-sm text-gray-900">${doctorName}</p>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Related Appointment</h4>
                        <p class="text-sm text-gray-900">${appointmentDetails}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Date Created</h4>
                        <p class="text-sm text-gray-900">${new Date(data.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Diagnosis</h4>
                        <p class="text-sm text-gray-900">${data.diagnosis || '<em>None provided</em>'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Symptoms</h4>
                        <div class="text-sm text-gray-900 mt-1">${symptomsHtml}</div>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Treatment</h4>
                        <p class="text-sm text-gray-900">${data.treatment || '<em>None provided</em>'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Notes</h4>
                        <p class="text-sm text-gray-900">${data.notes || '<em>None provided</em>'}</p>
                    </div>
                </div>
                <div class="flex justify-end space-x-3 pt-6">
                    <button type="button" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 view-modal-close">Close</button>
                    <button type="button" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 edit-record-btn" data-id="${data.id}">Edit Record</button>
                </div>
            </div>
        `;
        
        // Add to the DOM
        document.body.appendChild(viewModal);
        
        // Setup close button
        viewModal.querySelector('.view-modal-close').addEventListener('click', () => {
            document.body.removeChild(viewModal);
        });
        
        // Setup edit button
        viewModal.querySelector('.edit-record-btn').addEventListener('click', function() {
            const recordId = this.getAttribute('data-id');
            document.body.removeChild(viewModal);
            editMedicalRecord(recordId);
        });
        
    } catch (error) {
        console.error('Error viewing medical record:', error);
        showToast('Error loading medical record details', 'error');
    }
}

// Delete a medical record
async function deleteMedicalRecord(recordId) {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this medical record? This action cannot be undone.')) {
        return; // User cancelled
    }
    
    try {
        // Delete the record
        const { error } = await supabase
            .from('medical_records')
            .delete()
            .eq('id', recordId);
            
        if (error) throw error;
        
        // Show success message
        showToast('Medical record deleted successfully', 'success');
        
        // Reload medical records
        await loadMedicalRecordsData();
        
    } catch (error) {
        console.error('Error deleting medical record:', error);
        showToast('Error deleting medical record: ' + error.message, 'error');
    }
}

// Load prescriptions from database
async function loadPrescriptions() {
    try {
        const { data: prescriptions, error } = await supabase
            .from('prescriptions')
            .select(`
                id,
                prescription_date,
                medications,
                status,
                patient_id,
                doctor_id,
                patients:patient_id(id, first_name, last_name),
                doctors:doctor_id(id, first_name, last_name)
            `);
            
        if (error) {
            // If the table doesn't exist yet, show a placeholder message
            if (error.code === '42P01') { // PostgreSQL code for undefined_table
                const tableBody = document.getElementById('prescriptions-table-body');
                tableBody.innerHTML = `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="6">Prescriptions table not found. This feature will be available soon.</td>
                    </tr>
                `;
                return;
            }
            throw error;
        }
        
        const tableBody = document.getElementById('prescriptions-table-body');
        tableBody.innerHTML = '';
        
        if (!prescriptions || prescriptions.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="6">No prescriptions found</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading prescriptions:', error);
        const tableBody = document.getElementById('prescriptions-table-body');
        tableBody.innerHTML = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500" colspan="6">Error loading prescriptions: ${error.message}</td>
            </tr>
        `;
    }
}

// Load medications from database
async function loadMedications() {
    try {
        const { data: medications, error } = await supabase
            .from('medications')
            .select('*');
            
        if (error) {
            // If the table doesn't exist yet, show a placeholder message
            if (error.code === '42P01') { // PostgreSQL code for undefined_table
                const tableBody = document.getElementById('medications-table-body');
                tableBody.innerHTML = `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="6">Medications table not found. This feature will be available soon.</td>
                    </tr>
                `;
                return;
            }
            throw error;
        }
        
        const tableBody = document.getElementById('medications-table-body');
        tableBody.innerHTML = '';
        
        if (!medications || medications.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="6">No medications found</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading medications:', error);
        const tableBody = document.getElementById('medications-table-body');
        tableBody.innerHTML = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500" colspan="6">Error loading medications: ${error.message}</td>
            </tr>
        `;
    }
};

// Set up event listeners for appointment modal
function setupAppointmentModalListeners() {
    console.log('Setting up appointment modal listeners...');
    
    // Add appointment button
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    if (addAppointmentBtn) {
        console.log('Found add appointment button, adding event listener');
        // Remove any existing event listeners to prevent duplicates
        addAppointmentBtn.removeEventListener('click', openAppointmentModal);
        addAppointmentBtn.addEventListener('click', openAppointmentModal);
    } else {
        console.error('Add appointment button not found');
    }
    
    // Close appointment modal button (X in the top right)
    const closeAppointmentModalBtn = document.getElementById('close-appointment-modal');
    if (closeAppointmentModalBtn) {
        console.log('Found close appointment modal button, adding event listener');
        // Remove any existing event listeners to prevent duplicates
        closeAppointmentModalBtn.removeEventListener('click', closeAppointmentModal);
        // Add event listener with explicit function to ensure event is passed
        closeAppointmentModalBtn.addEventListener('click', function(event) {
            console.log('Close button clicked');
            closeAppointmentModal(event);
        });
    } else {
        console.error('Close appointment modal button not found');
    }
    
    // Cancel appointment button (Cancel button at bottom)
    const cancelAppointmentBtn = document.getElementById('cancel-appointment-btn');
    if (cancelAppointmentBtn) {
        console.log('Found cancel appointment button, adding event listener');
        // Remove any existing event listeners to prevent duplicates
        cancelAppointmentBtn.removeEventListener('click', closeAppointmentModal);
        // Add event listener with explicit function to ensure event is passed
        cancelAppointmentBtn.addEventListener('click', function(event) {
            console.log('Cancel button clicked');
            closeAppointmentModal(event);
        });
    } else {
        console.error('Cancel appointment button not found');
    }
    
    // Appointment form submission
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        console.log('Found appointment form, adding submit event listener');
        // Remove any existing event listeners to prevent duplicates
        appointmentForm.removeEventListener('submit', handleAppointmentSubmit);
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    } else {
        console.error('Appointment form not found');
    }
    
    // Add a click event listener to the modal background to close when clicking outside
    const modal = document.getElementById('appointment-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            // Only close if the click is directly on the modal background (not on the modal content)
            if (event.target === modal) {
                console.log('Modal background clicked, closing modal');
                closeAppointmentModal(event);
            }
        });
    }
}

// Set up event listeners for department modal
function setupDepartmentModalListeners() {
    console.log('Setting up department modal listeners...');
    
    // Add department button
    const addDepartmentBtn = document.getElementById('add-department-btn');
    if (addDepartmentBtn) {
        addDepartmentBtn.addEventListener('click', openDepartmentModal);
    }
    
    // Close department modal button
    const closeDepartmentModalBtn = document.getElementById('close-department-modal');
    if (closeDepartmentModalBtn) {
        closeDepartmentModalBtn.addEventListener('click', closeDepartmentModal);
    }
    
    // Cancel department button
    const cancelDepartmentBtn = document.getElementById('cancel-department-btn');
    if (cancelDepartmentBtn) {
        cancelDepartmentBtn.addEventListener('click', closeDepartmentModal);
    }
    
    // Department form submission
    const departmentForm = document.getElementById('department-form');
    if (departmentForm) {
        departmentForm.addEventListener('submit', handleDepartmentSubmit);
    }
}

// Load initial data for the dashboard
async function loadInitialData() {
    console.log('Loading initial data...');
    
    try {
        // Load appointments data
        await loadAppointments();
        
        // Load departments data
        await loadDepartments();
        
        console.log('Initial data loaded successfully');
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

// Handle room form submission
async function handleRoomSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const roomData = {
        room_number: formData.get('room_number'),
        room_type: formData.get('room_type'),
        floor: formData.get('floor'),
        daily_rate: formData.get('daily_rate'),
        is_occupied: formData.get('is_occupied') === 'on',
        patient_id: formData.get('is_occupied') === 'on' ? formData.get('patient_id') : null
    };
    
    try {
        let response;
        const roomId = form.getAttribute('data-id');
        
        if (roomId) {
            // Update existing room
            response = await supabase
                .from('rooms')
                .update(roomData)
                .eq('id', roomId);
        } else {
            // Insert new room
            response = await supabase
                .from('rooms')
                .insert(roomData);
        }
        
        if (response.error) {
            throw response.error;
        }
        
        // Close modal and reload data
        const modal = document.getElementById('room-modal');
        modal.classList.add('hidden');
        
        // Reload rooms data
        await loadRoomsData();
        
        // Show success message
        showToast(`Room ${roomId ? 'updated' : 'created'} successfully`, 'success');
    } catch (error) {
        console.error('Error saving room:', error);
        showToast('Error saving room: ' + error.message, 'error');
    }
}

// Setup Medical Tab Buttons
function setupMedicalTabButtons() {
    console.log('Setting up medical tab buttons...');
    const medicalTabButtons = document.querySelectorAll('.medical-tab-btn');
    
    if (medicalTabButtons.length === 0) {
        console.warn('No medical tab buttons found');
        return;
    }
    
    console.log(`Found ${medicalTabButtons.length} medical tab buttons`);
    
    medicalTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            console.log(`Medical tab button clicked: ${sectionId}`);
            
            if (!sectionId) {
                console.error('Medical tab button missing data-section attribute');
                return;
            }
            
            // Remove active class from all medical tab buttons
            medicalTabButtons.forEach(btn => {
                btn.classList.remove('active');
                // Remove text-blue-700 class
                btn.classList.remove('text-blue-700');
                // Add text-gray-900 class
                btn.classList.add('text-gray-900');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            // Add text-blue-700 class
            this.classList.add('text-blue-700');
            // Remove text-gray-900 class
            this.classList.remove('text-gray-900');
            
            // Hide all medical sections
            document.querySelectorAll('.medical-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show the selected medical section
            const selectedSection = document.getElementById(`${sectionId}-section`);
            if (selectedSection) {
                selectedSection.classList.remove('hidden');
                
                // Load data for the selected section
                switch(sectionId) {
                    case 'medical-records':
                        loadMedicalRecordsData();
                        break;
                    case 'prescriptions':
                        loadPrescriptionsData();
                        break;
                    case 'medications':
                        loadMedicationsData();
                        break;
                }
            } else {
                console.error(`Medical section not found: ${sectionId}-section`);
            }
        });
    });
}

// Document ready function
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Operations & Medical module DOM ready');
    
    // Check if we already have a Supabase client available globally
    if (typeof supabase === 'undefined' && typeof window.supabase === 'undefined') {
        console.warn('No Supabase client found globally, operations-medical.js functionality may be limited');
    }
    
    // Set up event listeners for tabs if the function exists
    if (typeof setupTabEventListeners === 'function') {
        setupTabEventListeners();
    }
    
    // Set up event listeners for appointment modal if the function exists
    if (typeof setupAppointmentModalListeners === 'function') {
        setupAppointmentModalListeners();
    }
    
    // Set up event listeners for department modal if the function exists
    if (typeof setupDepartmentModalListeners === 'function') {
        setupDepartmentModalListeners();
    }
    
    // Add direct event listeners for the specific appointment modal if the function exists
    if (typeof setupSpecificAppointmentModal === 'function') {
        setupSpecificAppointmentModal();
    }
    
    // Initialize the medical records module
    if (typeof initOperationsMedical === 'function') {
        initOperationsMedical();
    }
    
    // Load initial data
    await loadInitialData();
});

// Consolidated function to set up all appointment modal event listeners
function setupSpecificAppointmentModal() {
    console.log('Setting up consolidated appointment modal event listeners...');
    
    // Clear any existing event listeners first by cloning and replacing elements
    function clearAndSetupCloseListeners(element, eventHandler) {
        if (!element) return null;
        
        // Create a clone to remove all event listeners
        const clone = element.cloneNode(true);
        if (element.parentNode) {
            element.parentNode.replaceChild(clone, element);
        }
        
        // Add the new event listener
        clone.addEventListener('click', eventHandler);
        return clone;
    }
    
    // Define a single close handler function
    function handleModalClose(event) {
        console.log('Modal close handler called');
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        // Find all possible appointment modals
        const modals = [
            document.querySelector('#appointment-modal'),
            ...Array.from(document.querySelectorAll('[id*="appointment"][id*="modal"]')),
            ...Array.from(document.querySelectorAll('.modal[id*="appointment"]'))
        ].filter(Boolean); // Remove null/undefined values
        
        console.log(`Found ${modals.length} appointment modals to close`);
        
        // Hide all of them
        modals.forEach(modal => {
            if (modal) {
                console.log(`Hiding modal: ${modal.id || 'unnamed'}`);
                modal.classList.add('hidden');
                
                // Reset any forms inside the modal
                const forms = modal.querySelectorAll('form');
                forms.forEach(form => {
                    form.reset();
                    form.removeAttribute('data-id');
                });
                
                // Reset modal title if it exists
                const modalTitle = modal.querySelector('[id*="title"]');
                if (modalTitle && modalTitle.textContent.includes('Edit')) {
                    modalTitle.textContent = modalTitle.textContent.replace('Edit', 'Add');
                }
            }
        });
    }
    
    // Use requestAnimationFrame to ensure DOM is fully loaded and rendered
    requestAnimationFrame(() => {
        // Find all close buttons across all appointment modals
        const closeButtons = [
            document.querySelector('#close-appointment-modal'),
            ...Array.from(document.querySelectorAll('button[id*="close"][id*="appointment"]')),
            ...Array.from(document.querySelectorAll('.appointment-modal-close')),
            ...Array.from(document.querySelectorAll('button svg path[d*="M6 18L18 6M6 6l12 12"]'))
                .map(path => path.closest('button'))
        ].filter(Boolean); // Remove null/undefined values
        
        console.log(`Found ${closeButtons.length} close buttons to set up`);
        
        // Set up all close buttons with the same handler
        closeButtons.forEach(button => {
            clearAndSetupCloseListeners(button, handleModalClose);
        });
        
        // Find all cancel buttons
        const cancelButtons = [
            document.querySelector('#cancel-appointment-btn'),
            ...Array.from(document.querySelectorAll('button[id*="cancel"][id*="appointment"]')),
            ...Array.from(document.querySelectorAll('button'))
                .filter(btn => btn.textContent.trim().toLowerCase() === 'cancel')
        ].filter(Boolean); // Remove null/undefined values
        
        console.log(`Found ${cancelButtons.length} cancel buttons to set up`);
        
        // Set up all cancel buttons with the same handler
        cancelButtons.forEach(button => {
            clearAndSetupCloseListeners(button, handleModalClose);
        });
        
        // Add click handlers to close when clicking outside modal content
        const modals = [
            document.querySelector('#appointment-modal'),
            ...Array.from(document.querySelectorAll('[id*="appointment"][id*="modal"]')),
            ...Array.from(document.querySelectorAll('.modal[id*="appointment"]'))
        ].filter(Boolean);
        
        modals.forEach(modal => {
            const clone = clearAndSetupCloseListeners(modal, function(event) {
                // Only close if clicking directly on the modal background
                if (event.target === this) {
                    handleModalClose(event);
                }
            });
            
            // Make sure modal content doesn't trigger the close
            const modalContent = clone.querySelector('.bg-white') || 
                                clone.querySelector('[class*="bg-white"]');
            if (modalContent) {
                modalContent.addEventListener('click', function(event) {
                    // Prevent clicks inside the modal content from closing the modal
                    event.stopPropagation();
                });
            }
        });
    });
}

// No need to expose the function again since we're already defining it on the window object
})(); // Close the self-executing function
