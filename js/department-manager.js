// Department Manager - Handles all department-related functionality
(function() {
    // Initialize when the document is ready
    document.addEventListener('DOMContentLoaded', initDepartmentManager);
    
    // Main initialization function
    function initDepartmentManager() {
        console.log('Initializing Department Manager...');
        setupDepartmentModal();
        loadDepartments();
    }
    
    // Find the Supabase client
    function getSupabaseClient() {
        // Try to find any object with a 'from' method
        for (let key in window) {
            try {
                if (typeof window[key] === 'object' && window[key] !== null && 
                    typeof window[key].from === 'function') {
                    console.log(`Found object with 'from' method: ${key}`);
                    return window[key];
                }
            } catch (e) {
                // Skip any errors
            }
        }
        
        // Fallback to common names
        return window.supabase || window.supabaseClient || window.client || 
               window.supabaseAdmin || window.supabaseAdminClient;
    }
    
    // Load departments from the database
    async function loadDepartments() {
        console.log('Loading departments...');
        
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                showError('Failed to load departments: Supabase client not found');
                return;
            }
            
            // Get departments from the database
            const { data: departments, error } = await supabase
                .from('departments')
                .select('*')
                .order('name');
                
            if (error) {
                showError('Failed to load departments: ' + error.message);
                return;
            }
            
            if (!departments || departments.length === 0) {
                const departmentsTable = document.querySelector('table');
                if (departmentsTable) {
                    const tbody = departmentsTable.querySelector('tbody') || departmentsTable;
                    tbody.innerHTML = '<tr><td colspan="4" class="text-center">No departments found</td></tr>';
                }
                return;
            }
            
            // Display departments
            displayDepartments(departments);
            
            // Hide any error message
            const errorAlert = document.querySelector('.alert-danger');
            if (errorAlert) {
                errorAlert.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Error loading departments:', error);
            showError('Failed to load departments. Please try again.');
        }
    }
    
    // Display departments in the table
    function displayDepartments(departments) {
        console.log('Displaying departments:', departments);
        
        const departmentsTable = document.querySelector('table');
        if (!departmentsTable) {
            console.error('Departments table not found');
            return;
        }
        
        const tbody = departmentsTable.querySelector('tbody') || departmentsTable;
        tbody.innerHTML = '';
        
        departments.forEach(department => {
            const row = document.createElement('tr');
            row.dataset.id = department.id;
            
            row.innerHTML = `
                <td>${department.name}</td>
                <td>${department.description || ''}</td>
                <td>${formatDate(department.created_at)}</td>
                <td>${formatDate(department.updated_at)}</td>
                <td class="actions">
                    <button class="view-doctors-btn btn btn-sm btn-info" title="View Doctors">
                        <i class="fas fa-user-md"></i>
                    </button>
                    <button class="edit-department-btn btn btn-sm btn-primary" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-department-btn btn btn-sm btn-danger" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners to buttons
        addDepartmentButtonListeners();
    }
    
    // Add event listeners to department action buttons
    function addDepartmentButtonListeners() {
        // View doctors button
        document.querySelectorAll('.view-doctors-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const departmentId = this.closest('tr').dataset.id;
                await loadDoctorsForDepartment(departmentId);
            });
        });
        
        // Edit department button
        document.querySelectorAll('.edit-department-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const departmentId = this.closest('tr').dataset.id;
                const departmentName = this.closest('tr').querySelector('td:first-child').textContent;
                const departmentDesc = this.closest('tr').querySelector('td:nth-child(2)').textContent;
                openDepartmentModal(departmentId, departmentName, departmentDesc);
            });
        });
        
        // Delete department button
        document.querySelectorAll('.delete-department-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const departmentId = this.closest('tr').dataset.id;
                const departmentName = this.closest('tr').querySelector('td:first-child').textContent;
                
                if (confirm(`Are you sure you want to delete department "${departmentName}"?`)) {
                    await deleteDepartment(departmentId);
                }
            });
        });
    }
    
    // Load doctors for a specific department
    async function loadDoctorsForDepartment(departmentId) {
        console.log('Loading doctors for department:', departmentId);
        
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                showError('Failed to load doctors: Supabase client not found');
                return;
            }
            
            // Get department details
            const { data: department, error: deptError } = await supabase
                .from('departments')
                .select('*')
                .eq('id', departmentId)
                .single();
                
            if (deptError || !department) {
                showError('Failed to load department: ' + (deptError?.message || 'Department not found'));
                return;
            }
            
            // Get doctors for this department
            const { data: doctorDepartments, error: joinError } = await supabase
                .from('doctor_departments')
                .select('doctor_id')
                .eq('department_id', departmentId);
                
            if (joinError) {
                showError('Failed to load doctor assignments: ' + joinError.message);
                return;
            }
            
            if (!doctorDepartments || doctorDepartments.length === 0) {
                alert(`No doctors assigned to the "${department.name}" department.`);
                return;
            }
            
            // Get doctor details
            const doctorIds = doctorDepartments.map(dd => dd.doctor_id);
            const { data: doctors, error: doctorsError } = await supabase
                .from('profiles')
                .select('*')
                .in('id', doctorIds);
                
            if (doctorsError) {
                showError('Failed to load doctor details: ' + doctorsError.message);
                return;
            }
            
            // Display doctors in a modal
            displayDoctorsModal(department, doctors || []);
            
        } catch (error) {
            console.error('Error loading doctors for department:', error);
            showError('Failed to load doctors. Please try again.');
        }
    }
    
    // Display doctors in a modal
    function displayDoctorsModal(department, doctors) {
        // Create a modal to display the doctors
        const modalHtml = `
            <div id="doctors-modal" class="fixed inset-0 z-50 flex items-center justify-center">
                <div class="fixed inset-0 bg-black opacity-50"></div>
                <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Doctors in ${department.name}</h3>
                        <button id="close-doctors-modal" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="overflow-y-auto max-h-96">
                        ${doctors.length > 0 ? `
                            <ul class="divide-y divide-gray-200">
                                ${doctors.map(doctor => `
                                    <li class="py-3">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0">
                                                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                            <div class="ml-3">
                                                <p class="text-sm font-medium text-gray-900">${doctor.full_name || 'Unknown'}</p>
                                                <p class="text-sm text-gray-500">${doctor.email || ''}</p>
                                            </div>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        ` : `
                            <p class="text-center text-gray-500">No doctors assigned to this department.</p>
                        `}
                    </div>
                    <div class="mt-4 flex justify-end">
                        <button id="add-doctors-btn" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                            Assign Doctors
                        </button>
                        <button id="close-doctors-btn" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add the modal to the page
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Add event listeners
        document.getElementById('close-doctors-modal').addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
        
        document.getElementById('close-doctors-btn').addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
        
        document.getElementById('add-doctors-btn').addEventListener('click', () => {
            document.body.removeChild(modalContainer);
            openAssignDoctorsModal(department);
        });
    }
    
    // Open modal to assign doctors to department
    async function openAssignDoctorsModal(department) {
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                showError('Failed to load doctors: Supabase client not found');
                return;
            }
            
            // Get all doctors
            const { data: doctors, error: doctorsError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'doctor');
                
            if (doctorsError) {
                showError('Failed to load doctors: ' + doctorsError.message);
                return;
            }
            
            // Get currently assigned doctors
            const { data: currentAssignments, error: assignError } = await supabase
                .from('doctor_departments')
                .select('doctor_id')
                .eq('department_id', department.id);
                
            if (assignError) {
                showError('Failed to load current assignments: ' + assignError.message);
                return;
            }
            
            const assignedDoctorIds = new Set((currentAssignments || []).map(a => a.doctor_id));
            
            // Create modal HTML
            const modalHtml = `
                <div id="assign-doctors-modal" class="fixed inset-0 z-50 flex items-center justify-center">
                    <div class="fixed inset-0 bg-black opacity-50"></div>
                    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold">Assign Doctors to ${department.name}</h3>
                            <button id="close-assign-modal" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="overflow-y-auto max-h-96">
                            ${doctors && doctors.length > 0 ? `
                                <form id="assign-doctors-form">
                                    <ul class="divide-y divide-gray-200">
                                        ${doctors.map(doctor => `
                                            <li class="py-3">
                                                <label class="flex items-center">
                                                    <input type="checkbox" name="doctor" value="${doctor.id}" 
                                                        ${assignedDoctorIds.has(doctor.id) ? 'checked' : ''} 
                                                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                                    <span class="ml-3">
                                                        <span class="block text-sm font-medium text-gray-900">${doctor.full_name || 'Unknown'}</span>
                                                        <span class="block text-sm text-gray-500">${doctor.email || ''}</span>
                                                    </span>
                                                </label>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </form>
                            ` : `
                                <p class="text-center text-gray-500">No doctors available.</p>
                            `}
                        </div>
                        <div class="mt-4 flex justify-end">
                            <button id="save-assignments-btn" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                                Save Assignments
                            </button>
                            <button id="cancel-assign-btn" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add the modal to the page
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer);
            
            // Add event listeners
            document.getElementById('close-assign-modal').addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });
            
            document.getElementById('cancel-assign-btn').addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });
            
            document.getElementById('save-assignments-btn').addEventListener('click', async () => {
                await saveDoctorAssignments(department.id, modalContainer);
            });
            
        } catch (error) {
            console.error('Error opening assign doctors modal:', error);
            showError('Failed to open assignment modal. Please try again.');
        }
    }
    
    // Save doctor assignments to a department
    async function saveDoctorAssignments(departmentId, modalContainer) {
        console.log('Saving doctor assignments for department:', departmentId);
        
        try {
            const form = modalContainer.querySelector('#assign-doctors-form');
            const selectedDoctors = Array.from(form.querySelectorAll('input[name="doctor"]:checked'))
                .map(checkbox => checkbox.value);
                
            console.log('Selected doctors:', selectedDoctors);
            
            const supabase = getSupabaseClient();
            if (!supabase) {
                showError('Failed to save assignments: Supabase client not found');
                return;
            }
            
            // First, delete all existing assignments
            const { error: deleteError } = await supabase
                .from('doctor_departments')
                .delete()
                .eq('department_id', departmentId);
                
            if (deleteError) {
                showError('Failed to update assignments: ' + deleteError.message);
                return;
            }
            
            // If we have selected doctors, add new assignments
            if (selectedDoctors.length > 0) {
                const assignments = selectedDoctors.map(doctorId => ({
                    doctor_id: doctorId,
                    department_id: departmentId
                }));
                
                const { error: insertError } = await supabase
                    .from('doctor_departments')
                    .insert(assignments);
                    
                if (insertError) {
                    showError('Failed to add new assignments: ' + insertError.message);
                    return;
                }
            }
            
            // Close the modal and reload the departments
            document.body.removeChild(modalContainer);
            alert('Doctor assignments updated successfully!');
            
        } catch (error) {
            console.error('Error saving doctor assignments:', error);
            showError('Failed to save assignments. Please try again.');
        }
    }
    
    // Delete a department
    async function deleteDepartment(departmentId) {
        console.log('Deleting department:', departmentId);
        
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                showError('Failed to delete department: Supabase client not found');
                return;
            }
            
            // Delete the department
            const { error } = await supabase
                .from('departments')
                .delete()
                .eq('id', departmentId);
                
            if (error) {
                showError('Failed to delete department: ' + error.message);
                return;
            }
            
            // Reload departments
            loadDepartments();
            alert('Department deleted successfully!');
            
        } catch (error) {
            console.error('Error deleting department:', error);
            showError('Failed to delete department. Please try again.');
        }
    }
    
    // Setup the department modal for adding/editing departments
    function setupDepartmentModal() {
        console.log('Setting up department modal...');
        
        // Enhanced logging to help debug
        console.log('Looking for Add Department button...');
        
        // Find the Add Department button with more comprehensive selectors
        const addDepartmentBtnSelectors = [
            '#add-department-btn',
            'button[id*="add"][id*="department"]',
            '.add-department-btn',
            'button:has(i.fa-plus), a:has(i.fa-plus)',  // For buttons with plus icons
            'button, a',  // Check all buttons and links as a last resort
        ];
        
        // Try all selectors until we find a button
        let addDepartmentBtn = null;
        for (const selector of addDepartmentBtnSelectors) {
            const elements = document.querySelectorAll(selector);
            console.log(`Selector '${selector}' found ${elements.length} elements`);
            
            // Filter for buttons/links that might be department-related
            for (const el of elements) {
                const text = el.textContent.toLowerCase();
                const hasAddText = text.includes('add') || text.includes('new');
                const hasDeptText = text.includes('department') || text.includes('dept');
                
                // Log details about each potential button
                console.log(`  Element:`, el, 
                    `Text: '${text}',`, 
                    `Has add text: ${hasAddText},`,
                    `Has dept text: ${hasDeptText}`);
                
                if ((hasAddText && hasDeptText) || 
                    (selector === '#add-department-btn') || 
                    (selector.includes('[id*="add"][id*="department"]') && el.matches(selector))) {
                    addDepartmentBtn = el;
                    console.log('Found Add Department button:', addDepartmentBtn);
                    break;
                }
            }
            
            if (addDepartmentBtn) break;
        }
        
        // If we found an Add Department button, attach the click handler
        if (addDepartmentBtn) {
            // Remove any existing click handlers
            const newBtn = addDepartmentBtn.cloneNode(true);
            addDepartmentBtn.parentNode.replaceChild(newBtn, addDepartmentBtn);
            addDepartmentBtn = newBtn;
            
            addDepartmentBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Add Department button clicked');
                openDepartmentModal();
            });
            console.log('Click handler attached to Add Department button');
        } else {
            console.warn('Could not find Add Department button, will add our own');
            
            // If we couldn't find the button, add our own
            const departmentsHeader = document.querySelector('h1, h2, h3, h4, h5, h6');
            if (departmentsHeader && departmentsHeader.textContent.toLowerCase().includes('department')) {
                const addBtn = document.createElement('button');
                addBtn.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4';
                addBtn.innerHTML = '<i class="fas fa-plus mr-2"></i> Add Department';
                addBtn.addEventListener('click', () => openDepartmentModal());
                
                // Add the button after the header
                departmentsHeader.parentNode.insertBefore(addBtn, departmentsHeader.nextSibling);
                console.log('Added our own Add Department button');
            }
        }
        
        // Set up global document listener for any department modal clicks
        document.addEventListener('click', function(e) {
            // Find the clicked department modal if any
            const departmentModal = e.target.closest('.department-modal, #department-modal, [id*="department-modal"]');
            if (!departmentModal) return;
            
            console.log('Department modal clicked:', departmentModal);
            
            // Find close and cancel buttons within this modal
            const closeButtons = [];
            const cancelButtons = [];
            
            // Add all potential close buttons
            departmentModal.querySelectorAll('button').forEach(btn => {
                const text = btn.textContent.toLowerCase().trim();
                if (btn.id && btn.id.toLowerCase().includes('close')) {
                    closeButtons.push(btn);
                } else if (text === 'cancel') {
                    cancelButtons.push(btn);
                } else if (btn.querySelector('svg path[d*="M6 18L18 6M6 6l12 12"]')) {
                    closeButtons.push(btn);
                } else if (btn.querySelector('i.fa-times')) {
                    closeButtons.push(btn);
                }
            });
            
            console.log(`Found ${closeButtons.length} close buttons and ${cancelButtons.length} cancel buttons`);
            
            // Add close handler to these buttons
            [...closeButtons, ...cancelButtons].forEach(btn => {
                // Remove existing listeners
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', () => {
                    console.log('Close/Cancel button clicked');
                    departmentModal.classList.add('hidden');
                });
            });
            
            // Find the form within this modal
            const form = departmentModal.querySelector('form');
            if (form && !form.hasAttribute('data-handler-attached')) {
                form.setAttribute('data-handler-attached', 'true');
                form.addEventListener('submit', handleDepartmentSubmit);
                console.log('Form submission handler attached');
            }
        });
    }
    
    // Open the department modal for adding or editing
    function openDepartmentModal(departmentId = null, departmentName = '', departmentDesc = '') {
        console.log('Opening department modal:', { departmentId, departmentName, departmentDesc });
        
        // Check if a modal already exists
        let modal = document.querySelector('#department-modal, .department-modal, [id*="department-modal"]');
        
        // If no modal exists, create one
        if (!modal) {
            console.log('Creating new department modal...');
            
            // Create the modal HTML using the template that matches the current site style
            const modalHtml = `
                <div id="department-modal" class="fixed inset-0 z-50 flex items-center justify-center">
                    <div class="fixed inset-0 bg-black opacity-50"></div>
                    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold">${departmentId ? 'Edit' : 'Add New'} Department</h3>
                            <button id="close-department-modal" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <form id="department-form" ${departmentId ? `data-id="${departmentId}"` : ''}>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="department-name">
                                    Department Name
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="department-name" 
                                    name="name" 
                                    type="text" 
                                    placeholder="Enter department name" 
                                    value="${departmentName}" 
                                    required>
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="department-description">
                                    Description
                                </label>
                                <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="department-description" 
                                    name="description" 
                                    placeholder="Enter department description">${departmentDesc}</textarea>
                            </div>
                            <div class="flex items-center justify-end">
                                <button id="cancel-department-btn" type="button" class="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">
                                    Cancel
                                </button>
                                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                                    ${departmentId ? 'Save' : 'Add'} Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            // Create a container for the modal and add it to the DOM
            const modalContainer = document.createElement('div');
            modalContainer.className = 'department-modal-container';
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer);
            
            modal = modalContainer.firstChild;
            console.log('Modal created:', modal);
            
            // Add event listeners with explicit error handling
            try {
                const closeBtn = document.getElementById('close-department-modal');
                console.log('Close button:', closeBtn);
                closeBtn.addEventListener('click', () => {
                    console.log('Close button clicked');
                    modal.classList.add('hidden');
                });
                
                const cancelBtn = document.getElementById('cancel-department-btn');
                console.log('Cancel button:', cancelBtn);
                cancelBtn.addEventListener('click', () => {
                    console.log('Cancel button clicked');
                    modal.classList.add('hidden');
                });
                
                const form = document.getElementById('department-form');
                console.log('Form:', form);
                form.addEventListener('submit', handleDepartmentSubmit);
                console.log('Event listeners added successfully');
            } catch (error) {
                console.error('Error setting up modal event listeners:', error);
            }
        } else {
            console.log('Using existing department modal:', modal);
            // Update existing modal for editing
            const heading = modal.querySelector('h3');
            if (heading) {
                heading.textContent = departmentId ? 'Edit Department' : 'Add New Department';
            }
            
            const form = modal.querySelector('form');
            if (form) {
                if (departmentId) {
                    form.setAttribute('data-id', departmentId);
                } else {
                    form.removeAttribute('data-id');
                }
                
                const nameInput = form.querySelector('input[name="name"]');
                if (nameInput) {
                    nameInput.value = departmentName;
                }
                
                const descInput = form.querySelector('textarea[name="description"]');
                if (descInput) {
                    descInput.value = departmentDesc;
                }
                
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.textContent = departmentId ? 'Save Department' : 'Add Department';
                }
            }
        }
        
        // Make sure the modal is visible
        modal.classList.remove('hidden');
        
        // Make sure the modal is not display:none
        modal.style.display = '';
        
        console.log('Modal should now be visible');
        
        // Focus on the name input for better UX
        setTimeout(() => {
            const nameInput = modal.querySelector('#department-name');
            if (nameInput) {
                nameInput.focus();
            }
        }, 100);
    }
    
    // Handle department form submission
    async function handleDepartmentSubmit(e) {
        e.preventDefault();
        console.log('Handling department form submission');
        
        const form = e.target;
        const departmentId = form.getAttribute('data-id');
        const formData = new FormData(form);
        
        // Enhanced validation
        const name = formData.get('name');
        if (!name || name.trim() === '') {
            alert('Department name is required');
            console.error('Department name is required');
            return;
        }
        
        const departmentData = {
            name: name.trim(),
            description: formData.get('description') || null
        };
        
        console.log('Department data:', departmentData);
        
        // Show loading/processing indication
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn?.textContent || 'Save';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = departmentId ? 'Updating...' : 'Adding...';
        }
        
        try {
            console.log('Finding Supabase client...');
            let supabase = getSupabaseClient();
            
            // Fallback to window.supabase if getSupabaseClient() returns null
            if (!supabase) {
                console.warn('getSupabaseClient() returned null, trying global variables');
                
                // Try to find Supabase client in global scope
                if (window.supabase) {
                    console.log('Found window.supabase');
                    supabase = window.supabase;
                } else if (window.supabaseClient) {
                    console.log('Found window.supabaseClient');
                    supabase = window.supabaseClient;
                } else {
                    // Check if operations-medical.js has defined a supabase variable
                    console.log('Checking for supabase variable in other scripts...');
                    const scripts = document.querySelectorAll('script');
                    let supabaseFound = false;
                    
                    for (const script of scripts) {
                        if (script.src && script.src.includes('operations-medical.js')) {
                            console.log('Found operations-medical.js script, it might have defined supabase');
                            supabaseFound = true;
                            break;
                        }
                    }
                    
                    if (supabaseFound && typeof supabase !== 'undefined') {
                        console.log('Using supabase from operations-medical.js');
                    } else {
                        throw new Error('Supabase client not found');
                    }
                }
            }
            
            console.log('Using Supabase client:', supabase);
            let response;
            
            // Wrap this in a try/catch to get more detailed errors
            try {
                if (departmentId) {
                    // Update existing department
                    console.log(`Updating department ${departmentId}`);
                    response = await supabase
                        .from('departments')
                        .update(departmentData)
                        .eq('id', departmentId);
                } else {
                    // Create new department
                    console.log('Creating new department');
                    response = await supabase
                        .from('departments')
                        .insert([departmentData]);
                }
                
                console.log('Supabase response:', response);
            } catch (dbError) {
                console.error('Database operation error:', dbError);
                throw new Error(`Database error: ${dbError.message || 'Unknown error'}`);
            }
            
            if (response && response.error) {
                throw new Error(response.error.message || 'Unknown error');
            }
            
            // Close the modal
            const modal = form.closest('#department-modal, .department-modal, [id*="department-modal"]');
            if (modal) {
                modal.classList.add('hidden');
                // Also try removing from DOM if it was dynamically created
                if (modal.parentNode && modal.id !== 'department-modal') {
                    modal.parentNode.removeChild(modal);
                }
            } else {
                console.warn('Could not find modal to close');
            }
            
            // Reload departments
            console.log('Reloading departments...');
            await loadDepartments();
            
            // Try to also reload departments using the original function
            if (typeof loadDepartmentsData === 'function') {
                console.log('Also calling loadDepartmentsData() if available');
                try {
                    await loadDepartmentsData();
                } catch (loadError) {
                    console.warn('Error calling loadDepartmentsData:', loadError);
                }
            }
            
            // Show success message
            alert(`Department ${departmentId ? 'updated' : 'added'} successfully!`);
            
        } catch (error) {
            console.error('Error saving department:', error);
            alert(`Failed to ${departmentId ? 'update' : 'add'} department: ${error.message}`);
            showError(`Failed to ${departmentId ? 'update' : 'add'} department: ${error.message}`);
        } finally {
            // Restore button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    }
    
    // Format a date for display
    function formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch (e) {
            return dateString;
        }
    }
    
    // Show an error message
    function showError(message) {
        console.error(message);
        
        // Look for an existing error alert
        let errorAlert = document.querySelector('.alert-danger');
        
        // If no error alert exists, create one
        if (!errorAlert) {
            errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger my-3';
            errorAlert.setAttribute('role', 'alert');
            
            // Find a good place to insert the error
            const table = document.querySelector('table');
            if (table) {
                table.parentNode.insertBefore(errorAlert, table);
            } else {
                const main = document.querySelector('main') || document.body;
                main.insertBefore(errorAlert, main.firstChild);
            }
        }
        
        // Set the error message
        errorAlert.textContent = message;
        errorAlert.style.display = 'block';
    }
})();
