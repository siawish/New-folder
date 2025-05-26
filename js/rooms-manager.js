// HMS Rooms and Beds Management System - Standalone Implementation
// This is a completely self-contained module that doesn't rely on any other JavaScript files

// Use an immediately invoked function expression (IIFE) to avoid polluting the global namespace
(function() {
    // Wait for the DOM to be fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHMSRoomsManager);
    } else {
        // DOM already loaded, initialize immediately
        initHMSRoomsManager();
    }
    
    // Main initialization function with a unique name to avoid conflicts
    function initHMSRoomsManager() {
        console.log('HMS Rooms Manager: Initializing...');
        
        // Set up the rooms navigation and event listeners
        setupHMSRoomsNavigation();
        setupHMSRoomsEventListeners();
        
        // Check if we're on the rooms section by URL and show content if needed
        if (window.location.hash === '#rooms' || window.location.href.includes('rooms') || window.location.href.includes('beds')) {
            showHMSRoomsContent();
        }
    }
    
    // Set up navigation specifically for the Rooms/Beds section
    function setupHMSRoomsNavigation() {
        console.log('HMS Rooms Manager: Setting up navigation');
        
        // Find the Rooms/Beds link in the sidebar
        const roomsLink = document.querySelector('.sidebar-item[href="#rooms"]');
        if (!roomsLink) {
            console.error('HMS Rooms Manager: Rooms/Beds sidebar link not found!');
            return;
        }
        
        // Create a new link element to replace the existing one (to remove any existing event listeners)
        const newRoomsLink = roomsLink.cloneNode(true);
        
        // Add our custom click handler
        newRoomsLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            console.log('HMS Rooms Manager: Rooms/Beds link clicked');
            showHMSRoomsContent();
        });
        
        // Replace the original link with our new one
        if (roomsLink.parentNode) {
            roomsLink.parentNode.replaceChild(newRoomsLink, roomsLink);
            console.log('HMS Rooms Manager: Successfully hijacked Rooms/Beds navigation');
        }
    }
    
    // Show the rooms content and load room data - completely standalone implementation
    function showHMSRoomsContent() {
        console.log('HMS Rooms Manager: Showing rooms content...');
        
        // First, ensure the rooms-content element exists
        const roomsContent = document.getElementById('rooms-content');
        if (!roomsContent) {
            console.error('HMS Rooms Manager: Rooms content container not found! This is a critical error.');
            alert('Error: Rooms content section not found in the HTML. Please check the console for details.');
            return;
        }
        
        // Force display of rooms content and hide all other content sections
        // This is a direct approach that doesn't rely on any other JavaScript files
        document.querySelectorAll('[id$="-content"]').forEach(section => {
            if (section.id === 'rooms-content') {
                section.classList.remove('hidden');
                section.style.display = 'block';
            } else {
                section.classList.add('hidden');
                section.style.display = 'none';
            }
        });
        
        // Update active state in sidebar - highlight the Rooms/Beds link
        document.querySelectorAll('.sidebar-item').forEach(link => {
            if (link.getAttribute('href') === '#rooms') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Expand the Operations dropdown if it exists (parent of Rooms/Beds)
        const operationsDropdown = document.querySelector('.sidebar-item[href="#rooms"]')?.closest('.dropdown-content');
        if (operationsDropdown) {
            operationsDropdown.style.maxHeight = '1000px'; // Ensure dropdown is expanded
        }
        
        // Load rooms data
        loadHMSRoomsData();
    }
    
    // Set up event listeners specifically for rooms management
    function setupHMSRoomsEventListeners() {
        console.log('HMS Rooms Manager: Setting up event listeners');
        
        // Listen for clicks on room-related buttons and elements
        document.addEventListener('click', function(e) {
            // Handle clicks on the Rooms/Beds sidebar link
            const roomsLink = e.target.closest('.sidebar-item[href="#rooms"]');
            if (roomsLink) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                console.log('HMS Rooms Manager: Rooms link clicked via event listener');
                showHMSRoomsContent();
                return;
            }
            
            // Add room button
            if (e.target.closest('#add-room-btn')) {
                console.log('Add room button clicked');
                openRoomModal();
            }
            
            // Edit room button
            if (e.target.closest('.edit-room-btn')) {
                const roomId = e.target.closest('.edit-room-btn').dataset.id;
                console.log('Edit room clicked for:', roomId);
                openRoomModal(roomId);
            }
            
            // Delete room button
            if (e.target.closest('.delete-room-btn')) {
                const roomId = e.target.closest('.delete-room-btn').dataset.id;
                const roomNumber = e.target.closest('tr').querySelector('td:nth-child(2)').textContent;
                console.log('Delete room clicked for:', roomId);
                if (confirm(`Are you sure you want to delete room ${roomNumber}?`)) {
                    deleteRoom(roomId);
                }
            }
            
            // Assign patient button
            if (e.target.closest('.assign-patient-btn')) {
                const roomId = e.target.closest('.assign-patient-btn').dataset.id;
                console.log('Assign patient clicked for:', roomId);
                openAssignPatientModal(roomId);
            }
            
            // Release room button
            if (e.target.closest('.release-room-btn')) {
                const roomId = e.target.closest('.release-room-btn').dataset.id;
                const roomNumber = e.target.closest('tr').querySelector('td:nth-child(2)').textContent;
                console.log('Release room clicked for:', roomId);
                if (confirm(`Are you sure you want to release room ${roomNumber}?`)) {
                    releaseRoom(roomId);
                }
            }
        });
    }
    
    // Find the Supabase client with a unique function name to avoid conflicts
    function getHMSSupabaseClient() {
        return window.supabaseClient || window.supabase || window.supabaseAdmin || window.supabaseAdminClient;
    }
    
    // Load rooms from the database - standalone implementation
    async function loadHMSRoomsData() {
        console.log('HMS Rooms Manager: Loading rooms data...');
        
        // Get rooms content container
        const roomsContent = document.getElementById('rooms-content');
        if (!roomsContent) {
            console.error('Rooms content container not found');
            return;
        }
        
        // Get rooms table body
        const tableBody = roomsContent.querySelector('table tbody');
        if (!tableBody) {
            console.error('Rooms table body not found');
            return;
        }
        
        // Show loading indicator
        tableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center">Loading rooms data...</td></tr>';
        
        try {
            let rooms = [];
            let error = null;
            
            // For testing purposes, create some sample rooms if we're in development mode
            // This will allow the rooms section to work even without a database connection
            const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            
            if (isDevelopment) {
                console.log('Using sample room data for development');
                // Sample room data for testing
                rooms = [
                    { id: '1', room_number: '101', type: 'Standard', status: 'available', is_occupied: false, daily_rate: '100.00' },
                    { id: '2', room_number: '102', type: 'Deluxe', status: 'occupied', is_occupied: true, patient_id: '12345', daily_rate: '150.00' },
                    { id: '3', room_number: '103', type: 'Suite', status: 'maintenance', is_occupied: false, daily_rate: '200.00' },
                    { id: '4', room_number: '104', type: 'ICU', status: 'cleaning', is_occupied: false, daily_rate: '250.00' },
                    { id: '5', room_number: '105', type: 'Standard', status: 'available', is_occupied: false, daily_rate: '100.00' }
                ];
            } else {
                // Try to get real data from the database
                try {
                    // Check if we can use HMSDatabase
                    if (window.HMSDatabase && typeof window.HMSDatabase.fetchBedrooms === 'function') {
                        console.log('Using HMSDatabase.fetchBedrooms to get rooms data');
                        const result = await window.HMSDatabase.fetchBedrooms();
                        rooms = result.data || [];
                        error = result.error;
                    } else {
                        // Fallback to direct Supabase client
                        const supabase = getHMSSupabaseClient();
                        if (!supabase) {
                            throw new Error('Supabase client not found');
                        }
                        
                        // Fetch rooms data from Supabase
                        const result = await supabase
                            .from('bedrooms')
                            .select(`
                                id,
                                room_number,
                                floor,
                                type,
                                status,
                                is_occupied,
                                daily_rate,
                                notes,
                                patient_id
                            `)
                            .order('room_number');
                            
                        rooms = result.data || [];
                        error = result.error;
                    }
                } catch (dbError) {
                    console.error('Error fetching rooms from database:', dbError);
                    error = dbError;
                }
            }
                
            if (error) {
                console.error('Error fetching rooms:', error);
                tableBody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 text-center text-red-500">Error loading rooms: ${error.message}</td></tr>`;
                return;
            }
            
            if (!rooms || rooms.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center">No rooms found. Add your first room!</td></tr>';
                return;
            }
            
            // Clear loading message
            tableBody.innerHTML = '';
            
            // Add rooms to the table
            rooms.forEach(room => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50';
                
                // Determine status class for coloring
                let statusClass = 'bg-gray-200';
                if (room.status === 'available') statusClass = 'bg-green-200';
                else if (room.status === 'occupied') statusClass = 'bg-red-200';
                else if (room.status === 'maintenance') statusClass = 'bg-yellow-200';
                else if (room.status === 'cleaning') statusClass = 'bg-blue-200';
                
                // Format patient info
                const patientInfo = room.patient_id ? `Patient ID: ${room.patient_id}` : 'None';
                
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">${room.id || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${room.room_number || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${room.type || 'Standard'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                            ${room.status || 'Unknown'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">General</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                            ${room.is_occupied ? 
                                `<button class="release-room-btn text-yellow-600 hover:text-yellow-900" data-id="${room.id}" title="Release Room">
                                    <i class="fas fa-door-open"></i>
                                </button>` : 
                                `<button class="assign-patient-btn text-blue-600 hover:text-blue-900" data-id="${room.id}" title="Assign Patient">
                                    <i class="fas fa-user-plus"></i>
                                </button>`
                            }
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
            
            console.log('Rooms loaded successfully:', rooms.length);
            
        } catch (error) {
            console.error('Error in loadRooms:', error);
            tableBody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 text-center text-red-500">Error: ${error.message}</td></tr>`;
        }
    }
    
    // Open modal to add/edit a room
    async function openRoomModal(roomId = null) {
        console.log('Opening room modal, roomId:', roomId);
        
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                alert('Failed to load data: Supabase client not found');
                return;
            }
            
            // Get room data if editing
            let room = null;
            if (roomId) {
                const { data, error } = await supabase
                    .from('bedrooms')
                    .select('*')
                    .eq('id', roomId)
                    .single();
                    
                if (error) {
                    throw new Error(error.message);
                }
                
                room = data;
            }
            
            // Show the modal
            const modal = document.getElementById('room-modal');
            if (!modal) {
                console.error('Room modal not found');
                return;
            }
            
            modal.classList.remove('hidden');
            
            // Update modal title
            const modalTitle = document.getElementById('room-modal-title');
            if (modalTitle) {
                modalTitle.textContent = room ? 'Edit Room' : 'Add Room';
            }
            
            // Get the form
            const form = modal.querySelector('form');
            if (!form) {
                console.error('Room form not found');
                return;
            }
            
            // Set form data if editing
            if (room) {
                form.setAttribute('data-room-id', room.id);
                
                const roomNumberInput = form.querySelector('#room-number');
                if (roomNumberInput) roomNumberInput.value = room.room_number || '';
                
                const roomTypeInput = form.querySelector('#room-type');
                if (roomTypeInput) roomTypeInput.value = room.type || '';
                
                const roomFloorInput = form.querySelector('#room-floor');
                if (roomFloorInput) roomFloorInput.value = room.floor || '';
                
                const roomStatusSelect = form.querySelector('#room-status');
                if (roomStatusSelect) roomStatusSelect.value = room.status || 'available';
                
                const roomRateInput = form.querySelector('#room-rate');
                if (roomRateInput) roomRateInput.value = room.daily_rate || '';
                
                const roomNotesInput = form.querySelector('#room-notes');
                if (roomNotesInput) roomNotesInput.value = room.notes || '';
            } else {
                // Clear form for new room
                form.removeAttribute('data-room-id');
                form.reset();
            }
            
            // Setup close button
            const closeBtn = modal.querySelector('#close-room-modal');
            if (closeBtn) {
                closeBtn.onclick = function() {
                    modal.classList.add('hidden');
                };
            }
            
            // Setup form submission
            form.onsubmit = handleRoomFormSubmit;
            
        } catch (error) {
            console.error('Error opening room modal:', error);
            alert(`Error: ${error.message}`);
        }
    }
    
    // Handle room form submission
    async function handleRoomFormSubmit(e) {
        e.preventDefault();
        console.log('Handling room form submission');
        
        const form = e.target;
        const roomId = form.getAttribute('data-room-id');
        const isEditing = !!roomId;
        
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                throw new Error('Supabase client not found');
            }
            
            // Collect form data
            const formData = new FormData(form);
            const roomData = {
                room_number: formData.get('room-number'),
                type: formData.get('room-type'),
                floor: formData.get('room-floor'),
                status: formData.get('room-status'),
                daily_rate: parseFloat(formData.get('room-rate')) || 0,
                notes: formData.get('room-notes') || null,
                updated_at: new Date().toISOString()
            };
            
            // Validate required fields
            if (!roomData.room_number) {
                alert('Room number is required');
                return;
            }
            
            let result;
            
            if (isEditing) {
                // Update existing room
                result = await supabase
                    .from('bedrooms')
                    .update(roomData)
                    .eq('id', roomId);
            } else {
                // Add new room
                roomData.created_at = new Date().toISOString();
                roomData.is_occupied = false;
                
                result = await supabase
                    .from('bedrooms')
                    .insert([roomData]);
            }
            
            if (result.error) {
                throw new Error(result.error.message);
            }
            
            // Close the modal
            const modal = document.getElementById('room-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
            
            // Reload rooms
            loadRooms();
            
            // Show success message
            alert(`Room ${isEditing ? 'updated' : 'added'} successfully!`);
            
        } catch (error) {
            console.error('Error saving room:', error);
            alert(`Error: ${error.message}`);
        }
    }
    
    // Function to delete a room
    async function deleteRoom(roomId) {
        console.log('Deleting room:', roomId);
        
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                throw new Error('Supabase client not found');
            }
            
            // Delete the room
            const { error } = await supabase
                .from('bedrooms')
                .delete()
                .eq('id', roomId);
                
            if (error) {
                throw new Error(error.message);
            }
            
            // Reload rooms
            loadRooms();
            
            // Show success message
            alert('Room deleted successfully!');
            
        } catch (error) {
            console.error('Error deleting room:', error);
            alert(`Failed to delete room: ${error.message}`);
        }
    }
    
    // Open modal to assign a patient to a room
    async function openAssignPatientModal(roomId) {
        console.log('Opening assign patient modal for room:', roomId);
        
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                alert('Failed to load patients: Supabase client not found');
                return;
            }
            
            // Get room details
            const { data: room, error: roomError } = await supabase
                .from('bedrooms')
                .select('*')
                .eq('id', roomId)
                .single();
                
            if (roomError) {
                throw new Error(roomError.message);
            }
            
            if (!room) {
                throw new Error('Room not found');
            }
            
            // Get available patients
            const { data: patients, error: patientsError } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .eq('role', 'patient');
                
            if (patientsError) {
                throw new Error(patientsError.message);
            }
            
            // Check if a modal already exists
            let modal = document.querySelector('#assign-patient-modal');
            
            // If no modal exists, create one
            if (!modal) {
                console.log('Creating new assign patient modal...');
                
                // Create patient options for the select dropdown
                const patientOptions = patients && patients.length > 0 ?
                    patients.map(patient => `<option value="${patient.id}">${patient.full_name} (${patient.email || 'No email'})</option>`).join('') :
                    '<option value="" disabled>No patients available</option>';
                
                const modalHtml = `
                    <div id="assign-patient-modal" class="fixed inset-0 z-50 flex items-center justify-center">
                        <div class="fixed inset-0 bg-black opacity-50"></div>
                        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-semibold">Assign Patient to Room ${room.room_number}</h3>
                                <button id="close-assign-patient-modal" class="text-gray-500 hover:text-gray-700">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <form id="assign-patient-form" data-room-id="${roomId}">
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2" for="patient-id">
                                        Select Patient
                                    </label>
                                    <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="patient-id" 
                                        name="patient_id" 
                                        required>
                                        <option value="" disabled selected>Select a patient</option>
                                        ${patientOptions}
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2" for="admission-notes">
                                        Admission Notes (Optional)
                                    </label>
                                    <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="admission-notes" 
                                        name="notes" 
                                        placeholder="Enter any notes about this admission"></textarea>
                                </div>
                                <div class="flex items-center justify-end">
                                    <button id="cancel-assign-patient-btn" type="button" class="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">
                                        Cancel
                                    </button>
                                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                                        Assign Patient
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
                
                // Create a container for the modal and add it to the DOM
                const modalContainer = document.createElement('div');
                modalContainer.innerHTML = modalHtml;
                document.body.appendChild(modalContainer);
                
                modal = modalContainer.firstChild;
                
                // Add event listeners
                const closeBtn = document.getElementById('close-assign-patient-modal');
                closeBtn.addEventListener('click', () => {
                    modal.classList.add('hidden');
                });
                
                const cancelBtn = document.getElementById('cancel-assign-patient-btn');
                cancelBtn.addEventListener('click', () => {
                    modal.classList.add('hidden');
                });
                
                const form = document.getElementById('assign-patient-form');
                form.addEventListener('submit', handleAssignPatientSubmit);
            } else {
                // Update existing modal
                const heading = modal.querySelector('h3');
                if (heading) {
                    heading.textContent = `Assign Patient to Room ${room.room_number}`;
                }
                
                const form = modal.querySelector('form');
                if (form) {
                    form.setAttribute('data-room-id', roomId);
                    
                    // Update patient options
                    const patientSelect = form.querySelector('#patient-id');
                    if (patientSelect) {
                        // Clear existing options
                        patientSelect.innerHTML = '<option value="" disabled selected>Select a patient</option>';
                        
                        // Add new options
                        if (patients && patients.length > 0) {
                            patients.forEach(patient => {
                                const option = document.createElement('option');
                                option.value = patient.id;
                                option.textContent = `${patient.full_name} (${patient.email || 'No email'})`;
                                patientSelect.appendChild(option);
                            });
                        } else {
                            const option = document.createElement('option');
                            option.value = '';
                            option.disabled = true;
                            option.textContent = 'No patients available';
                            patientSelect.appendChild(option);
                        }
                    }
                    
                    // Reset notes
                    const notesTextarea = form.querySelector('#admission-notes');
                    if (notesTextarea) {
                        notesTextarea.value = '';
                    }
                }
            }
            
            // Make sure the modal is visible
            modal.classList.remove('hidden');
            
            // Focus on the patient select for better UX
            setTimeout(() => {
                const patientSelect = modal.querySelector('#patient-id');
                if (patientSelect) {
                    patientSelect.focus();
                }
            }, 100);
            
        } catch (error) {
            console.error('Error opening assign patient modal:', error);
            alert(`Failed to open assign patient modal: ${error.message}`);
        }
    }
    
    // Handle assign patient form submission
    async function handleAssignPatientSubmit(e) {
        e.preventDefault();
        console.log('Handling assign patient form submission');
        
        const form = e.target;
        const roomId = form.getAttribute('data-room-id');
        const formData = new FormData(form);
        
        // Validate patient selection
        const patientId = formData.get('patient_id');
        if (!patientId) {
            alert('Please select a patient');
            return;
        }
        
        console.log('Assigning patient:', patientId, 'to room:', roomId);
        
        // Get admission notes
        const notes = formData.get('notes');
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Assigning...';
        
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                throw new Error('Supabase client not found');
            }
            
            // Update room with patient information
            const { error } = await supabase
                .from('bedrooms')
                .update({
                    patient_id: patientId,
                    is_occupied: true,
                    status: 'occupied',
                    notes: notes || null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', roomId);
                
            if (error) {
                throw new Error(error.message);
            }
            
            // Close the modal
            const modal = document.getElementById('assign-patient-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
            
            // Reload rooms
            loadRooms();
            
            // Show success message
            alert('Patient assigned to room successfully!');
            
        } catch (error) {
            console.error('Error assigning patient to room:', error);
            alert(`Failed to assign patient: ${error.message}`);
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }
    
    // Release a room (remove patient assignment)
    async function releaseRoom(roomId) {
        console.log('Releasing room:', roomId);
        
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                alert('Failed to release room: Supabase client not found');
                return;
            }
            
            // Update room to release patient
            const { error } = await supabase
                .from('bedrooms')
                .update({
                    patient_id: null,
                    is_occupied: false,
                    status: 'cleaning', // Set to cleaning after patient leaves
                    notes: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', roomId);
                
            if (error) {
                throw new Error(error.message);
            }
            
            // Reload rooms
            loadRooms();
            
            // Show success message
            alert('Room released successfully!');
            
        } catch (error) {
            console.error('Error releasing room:', error);
            alert(`Failed to release room: ${error.message}`);
        }
    }
    
    // Helper function to show error
    function showError(message) {
        console.error(message);
        alert(message);
    }
    
    // Make key functions available globally
    window.showHMSRoomsContent = showHMSRoomsContent;
    
    // Add a global openRoomModal function
    window.openRoomModal = function(roomId = null) {
        console.log('HMS Rooms Manager: Opening room modal', roomId ? `for room ID: ${roomId}` : 'for new room');
        
        // First, ensure we show the rooms content
        showHMSRoomsContent();
        
        // Then show a simple alert for now - this can be enhanced later
        alert('Room modal will be implemented in a future update.');
    };
    
    // Make loadRooms function available globally
    window.loadRoomsData = async function() {
        try {
            await loadRooms();
            return { success: true };
        } catch (error) {
            console.error('Error in loadRoomsData:', error);
            return { success: false, error };
        }
    };
})();