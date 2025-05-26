// Invoice Management JavaScript
// This file handles all invoice-related functionality

// Use existing Supabase client from global variable instead of redeclaring
// This avoids the 'Identifier supabaseClient has already been declared' error
let invoiceSupabase;

// Initialize Supabase client for invoice management
function initInvoiceSupabase() {
    // Try to get an existing Supabase client from the window object
    invoiceSupabase = window.supabaseClient || window.supabase || window.supabaseAdmin || window.HMSDatabase;
    
    if (!invoiceSupabase) {
        console.error('No Supabase client found in global scope. Creating a new one for invoice management.');
        // If no existing client is found, create a new one
        try {
            const supabaseUrl = localStorage.getItem('supabaseUrl');
            const supabaseKey = localStorage.getItem('supabaseKey');
            
            if (supabaseUrl && supabaseKey) {
                invoiceSupabase = supabase.createClient(supabaseUrl, supabaseKey);
                console.log('Created new Supabase client for invoice management');
            } else {
                console.error('Missing Supabase credentials in localStorage');
            }
        } catch (error) {
            console.error('Error creating Supabase client:', error);
        }
    } else {
        console.log('Using existing Supabase client for invoice management');
    }
    
    return invoiceSupabase;
}

// Global variables
let currentPage = 1;
let itemsPerPage = 10;
let totalInvoices = 0;

// Status colors for badges
const statusColors = {
    'paid': 'bg-green-100 text-green-800',
    'unpaid': 'bg-yellow-100 text-yellow-800',
    'overdue': 'bg-red-100 text-red-800',
    'cancelled': 'bg-gray-100 text-gray-800',
    'draft': 'bg-blue-100 text-blue-800'
};

// Initialize invoice management
async function initInvoiceManagement() {
    console.log('Initializing invoice management...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Load invoices on init
    await fetchInvoices();
    
    // Update invoice statistics
    updateInvoiceStats();
}

// Set up event listeners for invoice management
function setupEventListeners() {
    // Create invoice button
    const createInvoiceBtn = document.getElementById('create-invoice-btn');
    if (createInvoiceBtn) {
        createInvoiceBtn.addEventListener('click', showCreateInvoiceModal);
    }
    
    // Refresh invoices button
    const refreshBtn = document.getElementById('refresh-invoices-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchInvoices);
    }
    
    // Export invoices button
    const exportBtn = document.getElementById('export-invoices-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportInvoices);
    }
    
    // Search input
    const searchInput = document.getElementById('invoice-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            currentPage = 1;
            fetchInvoices();
        }, 500));
    }
    
    // Status filter
    const statusFilter = document.getElementById('invoice-status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            currentPage = 1;
            fetchInvoices();
        });
    }
    
    // Date filter
    const dateFilter = document.getElementById('invoice-date-filter');
    if (dateFilter) {
        dateFilter.addEventListener('change', () => {
            currentPage = 1;
            fetchInvoices();
        });
    }
}

// Debounce function to limit how often a function is called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fetch invoices from the database
async function fetchInvoices() {
    try {
        // Show loading state
        showLoadingState('invoices-table-body');
        
        // Get filter values
        const searchQuery = document.getElementById('invoice-search')?.value || '';
        const statusFilter = document.getElementById('invoice-status-filter')?.value || 'all';
        const dateFilter = document.getElementById('invoice-date-filter')?.value || '';
        
        // Get the Supabase client
        const supabase = invoiceSupabase || window.supabaseClient || window.supabase || window.supabaseAdmin || window.HMSDatabase;
        
        if (!supabase) {
            throw new Error('Supabase client not found for fetching invoices');
        }
        
        console.log('Using Supabase client for fetching invoices');
        
        // Build query - use RPC call for complex joins if available
        let query;
        
        try {
            // First try to use a direct query with the invoices table
            query = supabase
                .from('invoices')
                .select('*')
                .order('created_at', { ascending: false });
                
            // Apply filters
            if (searchQuery) {
                query = query.ilike('invoice_number', `%${searchQuery}%`);
            }
            
            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }
            
            if (dateFilter) {
                query = query.eq('invoice_date', dateFilter);
            }
            
            // Apply pagination
            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;
            
            // Get count first
            const { count, error: countError } = await query.count();
            
            if (countError) {
                console.error('Error getting invoice count:', countError);
                throw countError;
            }
            
            totalInvoices = count || 0;
            console.log(`Total invoices: ${totalInvoices}`);
            
            // Then get paginated data
            const { data: invoices, error } = await query.range(from, to);
            
            if (error) {
                console.error('Error fetching invoice data:', error);
                throw error;
            }
            
            console.log('Invoices fetched successfully:', invoices?.length || 0);
            
            // For each invoice, fetch the patient details separately
            if (invoices && invoices.length > 0) {
                const patientIds = invoices.map(invoice => invoice.patient_id).filter(id => id);
                
                if (patientIds.length > 0) {
                    // Try to get patient details from auth.users
                    const { data: patients, error: patientsError } = await supabase
                        .from('users')
                        .select('id, email, user_metadata')
                        .in('id', patientIds);
                    
                    if (!patientsError && patients) {
                        // Attach patient data to invoices
                        invoices.forEach(invoice => {
                            if (invoice.patient_id) {
                                const patient = patients.find(p => p.id === invoice.patient_id);
                                if (patient) {
                                    invoice.patient = {
                                        id: patient.id,
                                        email: patient.email,
                                        first_name: patient.user_metadata?.first_name || '',
                                        last_name: patient.user_metadata?.last_name || ''
                                    };
                                }
                            }
                        });
                    } else {
                        console.error('Error fetching patient details:', patientsError);
                        
                        // Fallback to profiles table
                        const { data: profiles, error: profilesError } = await supabase
                            .from('profiles')
                            .select('id, first_name, last_name, email')
                            .in('id', patientIds);
                            
                        if (!profilesError && profiles) {
                            // Attach profile data to invoices
                            invoices.forEach(invoice => {
                                if (invoice.patient_id) {
                                    const profile = profiles.find(p => p.id === invoice.patient_id);
                                    if (profile) {
                                        invoice.patient = {
                                            id: profile.id,
                                            email: profile.email,
                                            first_name: profile.first_name || '',
                                            last_name: profile.last_name || ''
                                        };
                                    }
                                }
                            });
                        } else {
                            console.error('Error fetching profile details:', profilesError);
                        }
                    }
                }
            }
            
            // Update invoice stats
            await updateInvoiceStats();
            
            // Render invoices
            renderInvoices(invoices || []);
            
            // Update pagination
            updatePagination();
            
        } catch (queryError) {
            console.error('Error with direct query:', queryError);
            throw queryError;
        }
    } catch (error) {
        console.error('Error fetching invoices:', error);
        showErrorState('invoices-table-body', 'Failed to load invoices. Please try again.');
    }
}

// Render invoices in the table
function renderInvoices(invoices) {
    const tableBody = document.getElementById('invoices-table-body');
    if (!tableBody) {
        console.error('Invoice table body element not found');
        return;
    }
    
    if (!invoices || invoices.length === 0) {
        console.log('No invoices found to render');
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    No invoices found. Create your first invoice by clicking the "Create Invoice" button.
                </td>
            </tr>
        `;
        return;
    }
    
    console.log('Rendering invoices:', invoices.length);
    let html = '';
    
    invoices.forEach(invoice => {
        // Get patient information - handle all possible data structures
        let patientName = 'Unknown Patient';
        
        // Handle the new patient structure from our fetchInvoices function
        if (invoice.patient) {
            patientName = `${invoice.patient.first_name || ''} ${invoice.patient.last_name || ''}`.trim();
            if (!patientName && invoice.patient.email) {
                patientName = invoice.patient.email;
            }
        }
        // Handle direct profiles reference
        else if (invoice.profiles) {
            patientName = `${invoice.profiles.first_name || ''} ${invoice.profiles.last_name || ''}`.trim() || 'Unknown Patient';
        } 
        // Handle nested patients.profiles structure
        else if (invoice.patients && invoice.patients.profiles) {
            patientName = `${invoice.patients.profiles.first_name || ''} ${invoice.patients.profiles.last_name || ''}`.trim() || 'Unknown Patient';
        }
        // If we have a patient_id but no details, show the ID as fallback
        else if (invoice.patient_id) {
            patientName = `Patient ID: ${invoice.patient_id.substring(0, 8)}...`;
        }
        
        if (patientName === 'Unknown Patient' && invoice.patient_id) {
            console.log(`Invoice ${invoice.invoice_number} - Missing patient details for ID: ${invoice.patient_id}`);
        } else {
            console.log(`Invoice ${invoice.invoice_number} - Patient: ${patientName}`);
        }
        
        const statusClass = statusColors[invoice.status] || 'bg-gray-100 text-gray-800';
        
        html += `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <a href="#" class="hover:underline" onclick="viewInvoiceDetails('${invoice.id}'); return false;">
                        ${invoice.invoice_number || 'N/A'}
                    </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${patientName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${formatDate(invoice.invoice_date)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${formatDate(invoice.due_date)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${formatCurrency(invoice.total_amount)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${capitalizeFirstLetter(invoice.status || 'unknown')}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex space-x-2 justify-end">
                        <button onclick="viewInvoiceDetails('${invoice.id}')" class="text-blue-600 hover:text-blue-900" title="View">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                        <button onclick="editInvoice('${invoice.id}')" class="text-indigo-600 hover:text-indigo-900" title="Edit">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="deleteInvoice('${invoice.id}')" class="text-red-600 hover:text-red-900" title="Delete">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    console.log('Invoice table updated successfully');
}

// Add event listeners to invoice action buttons
function addInvoiceActionListeners() {
    // View invoice buttons
    document.querySelectorAll('.view-invoice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const invoiceId = btn.getAttribute('data-id');
            viewInvoice(invoiceId);
        });
    });
    
    // Edit invoice buttons
    document.querySelectorAll('.edit-invoice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const invoiceId = btn.getAttribute('data-id');
            editInvoice(invoiceId);
        });
    });
    
    // Mark as paid buttons
    document.querySelectorAll('.mark-paid-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const invoiceId = btn.getAttribute('data-id');
            await markInvoiceAsPaid(invoiceId);
        });
    });
    
    // Delete invoice buttons
    document.querySelectorAll('.delete-invoice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const invoiceId = btn.getAttribute('data-id');
            confirmDeleteInvoice(invoiceId);
        });
    });
}

// Update pagination controls
function updatePagination() {
    const paginationStart = document.getElementById('pagination-start');
    const paginationEnd = document.getElementById('pagination-end');
    const paginationTotal = document.getElementById('pagination-total');
    const paginationControls = document.getElementById('pagination-controls');
    
    if (!paginationStart || !paginationEnd || !paginationTotal || !paginationControls) return;
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalInvoices);
    
    paginationStart.textContent = totalInvoices > 0 ? start : 0;
    paginationEnd.textContent = end;
    paginationTotal.textContent = totalInvoices;
    
    // Generate pagination buttons
    const totalPages = Math.ceil(totalInvoices / itemsPerPage);
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button 
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
            ${currentPage === 1 ? 'disabled' : 'onclick="changePage(${currentPage - 1})"'}
        >
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
        </button>
    `;
    
    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${i === currentPage ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}"
                onclick="changePage(${i})"
            >
                ${i}
            </button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
            ${currentPage === totalPages ? 'disabled' : 'onclick="changePage(${currentPage + 1})"'}
        >
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
        </button>
    `;
    
    paginationControls.innerHTML = paginationHTML;
}

// Change page function (called from pagination buttons)
window.changePage = function(page) {
    currentPage = page;
    fetchInvoices();
};

// Update invoice statistics
async function updateInvoiceStats() {
    try {
        // Get the Supabase client
        const supabase = invoiceSupabase || window.supabaseClient || window.supabase || window.supabaseAdmin || window.HMSDatabase;
        
        if (!supabase) {
            throw new Error('Supabase client not found for updating invoice stats');
        }
        
        console.log('Using Supabase client for updating invoice stats');
        
        // Get counts for each status
        const { count: paidCount, error: paidError } = await supabase
            .from('invoices')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'paid');
        
        const { count: unpaidCount, error: unpaidError } = await supabase
            .from('invoices')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'unpaid');
        
        const { count: overdueCount, error: overdueError } = await supabase
            .from('invoices')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'overdue');
        
        if (paidError || unpaidError || overdueError) {
            console.error('Error fetching invoice statistics:', { paidError, unpaidError, overdueError });
            throw new Error('Error fetching invoice statistics');
        }
        
        console.log('Invoice stats:', { total: totalInvoices, paid: paidCount, unpaid: unpaidCount, overdue: overdueCount });
        
        // Update the UI
        document.getElementById('total-invoices-count').textContent = totalInvoices;
        document.getElementById('paid-invoices-count').textContent = paidCount || 0;
        document.getElementById('pending-invoices-count').textContent = unpaidCount || 0;
        document.getElementById('overdue-invoices-count').textContent = overdueCount || 0;
    } catch (error) {
        console.error('Error updating invoice statistics:', error);
    }
}

// Show create invoice modal
function showCreateInvoiceModal() {
    console.log('Showing create invoice modal');
    
    // Reset form
    resetInvoiceForm();
    
    // Set default dates
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30); // Due in 30 days by default
    
    const invoiceDateInput = document.getElementById('invoice-date');
    const dueDateInput = document.getElementById('invoice-due-date');
    
    if (invoiceDateInput) {
        invoiceDateInput.valueAsDate = today;
    } else {
        console.warn('Invoice date input not found');
    }
    
    if (dueDateInput) {
        dueDateInput.valueAsDate = dueDate;
    } else {
        console.warn('Due date input not found');
    }
    
    // Load patients for dropdown
    loadPatientsForInvoice();
    
    // Show modal
    const invoiceModal = document.getElementById('invoice-modal');
    if (invoiceModal) {
        invoiceModal.classList.remove('hidden');
        console.log('Invoice modal displayed');
    } else {
        console.error('Invoice modal element not found');
    }
    
    // Setup event listeners for invoice form
    setupInvoiceFormListeners();
    
    // Directly set up the Add Item button
    const addItemBtn = document.getElementById('add-invoice-item-btn');
    if (addItemBtn) {
        console.log('Setting up Add Item button directly');
        // Clone to remove any existing listeners
        const newAddItemBtn = addItemBtn.cloneNode(true);
        if (addItemBtn.parentNode) {
            addItemBtn.parentNode.replaceChild(newAddItemBtn, addItemBtn);
        }
        
        // Add direct click handler
        newAddItemBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add Item button clicked directly');
            addInvoiceItem();
        });
    } else {
        console.error('Add Item button not found');
    }
}

// View invoice details
function viewInvoice(invoiceId) {
    // Implementation will be added in a future update
    alert(`View invoice ${invoiceId} functionality will be implemented soon.`);
}

// Edit invoice
function editInvoice(invoiceId) {
    // Implementation will be added in a future update
    alert(`Edit invoice ${invoiceId} functionality will be implemented soon.`);
}

// Mark invoice as paid
async function markInvoiceAsPaid(invoiceId) {
    try {
        const { error } = await supabaseClient
            .from('invoices')
            .update({ 
                status: 'paid',
                paid_amount: supabaseClient.rpc('get_invoice_total', { invoice_id: invoiceId }),
                updated_at: new Date()
            })
            .eq('id', invoiceId);
        
        if (error) throw error;
        
        // Refresh the invoices list
        await fetchInvoices();
        
        // Show success message
        alert('Invoice marked as paid successfully.');
        
    } catch (error) {
        console.error('Error marking invoice as paid:', error);
        alert('Failed to mark invoice as paid. Please try again.');
    }
}

// Confirm delete invoice
function confirmDeleteInvoice(invoiceId) {
    if (confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
        deleteInvoice(invoiceId);
    }
}

// Delete invoice
async function deleteInvoice(invoiceId) {
    try {
        // First delete related invoice items
        const { error: itemsError } = await supabaseClient
            .from('invoice_items')
            .delete()
            .eq('invoice_id', invoiceId);
        
        if (itemsError) throw itemsError;
        
        // Then delete the invoice
        const { error } = await supabaseClient
            .from('invoices')
            .delete()
            .eq('id', invoiceId);
        
        if (error) throw error;
        
        // Refresh the invoices list
        await fetchInvoices();
        
        // Show success message
        alert('Invoice deleted successfully.');
        
    } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice. Please try again.');
    }
}

// Export invoices to CSV
function exportInvoices() {
    // Implementation will be added in a future update
    alert('Export invoices functionality will be implemented soon.');
}

// Reset invoice form
function resetInvoiceForm() {
    const form = document.getElementById('invoice-form');
    if (form) {
        form.reset();
    }
    
    // Clear invoice items except the first one
    const itemsContainer = document.getElementById('invoice-items-container');
    if (itemsContainer) {
        const items = itemsContainer.querySelectorAll('.invoice-item-row');
        // Keep only the first item and reset its values
        if (items.length > 0) {
            const firstItem = items[0];
            const inputs = firstItem.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.name.includes('description')) {
                    input.value = '';
                } else if (input.name.includes('price')) {
                    input.value = '';
                } else if (input.name.includes('quantity')) {
                    input.value = '1';
                } else if (input.name.includes('tax') || input.name.includes('discount')) {
                    input.value = '0';
                } else if (input.name.includes('total')) {
                    input.value = '';
                }
            });
            
            // Remove all other items
            for (let i = 1; i < items.length; i++) {
                items[i].remove();
            }
        }
    }
    
    // Reset summary values
    document.getElementById('invoice-subtotal').textContent = '$0.00';
    document.getElementById('invoice-tax').textContent = '$0.00';
    document.getElementById('invoice-discount').textContent = '$0.00';
    document.getElementById('invoice-total').textContent = '$0.00';
}

// Load patients for invoice dropdown
async function loadPatientsForInvoice() {
    try {
        console.log('Loading patients for invoice dropdown...');
        const patientSelect = document.getElementById('invoice-patient');
        if (!patientSelect) {
            console.error('Patient select element not found');
            return;
        }
        
        // Show loading state
        patientSelect.innerHTML = '<option value="">Loading patients...</option>';
        
        // Get the Supabase client
        const supabase = invoiceSupabase || window.supabaseClient || window.supabase || window.supabaseAdmin || window.HMSDatabase;
        
        if (!supabase) {
            throw new Error('Supabase client not found');
        }
        
        console.log('Supabase client found for patient loading');
        console.log('Fetching patients from auth.users and profiles tables...');
        
        // First, get users with patient role from auth.users table
        const { data: authUsers, error: authError } = await supabase
            .from('users')
            .select('id, email, user_metadata')
            .eq('role', 'patient');
        
        if (authError) {
            console.error('Error fetching from auth.users:', authError);
            // Continue to try profiles table as fallback
        }
        
        // As a fallback, also try to get patients from profiles table
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, role')
            .eq('role', 'patient');
        
        if (profilesError) {
            console.error('Error fetching from profiles:', profilesError);
        }
        
        // Combine results from both sources
        let patients = [];
        
        // Add users from auth.users
        if (authUsers && authUsers.length > 0) {
            console.log('Found patients in auth.users:', authUsers.length);
            patients = patients.concat(authUsers.map(user => ({
                id: user.id,
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || '',
                email: user.email
            })));
        }
        
        // Add users from profiles if not already added
        if (profiles && profiles.length > 0) {
            console.log('Found patients in profiles:', profiles.length);
            profiles.forEach(profile => {
                // Check if this user is already in the list
                if (!patients.some(p => p.id === profile.id)) {
                    patients.push({
                        id: profile.id,
                        first_name: profile.first_name || '',
                        last_name: profile.last_name || '',
                        email: profile.email
                    });
                }
            });
        }
        
        console.log('Total patients found:', patients.length);
        
        // Reset and populate patient dropdown
        patientSelect.innerHTML = '<option value="">Select Patient</option>';
        
        if (patients.length > 0) {
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                const displayName = `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
                option.textContent = displayName || patient.email || 'Unknown Patient';
                patientSelect.appendChild(option);
            });
            console.log(`Added ${patients.length} patients to dropdown`);
        } else {
            // Last resort - try to get all users and filter them client-side
            console.log('No patients found, trying to fetch all users...');
            
            const { data: allUsers, error: allUsersError } = await supabase
                .from('users')
                .select('id, email, user_metadata');
                
            if (allUsersError) {
                console.error('Error fetching all users:', allUsersError);
                patientSelect.innerHTML = '<option value="" disabled>No patients found</option>';
                return;
            }
            
            if (allUsers && allUsers.length > 0) {
                allUsers.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    const firstName = user.user_metadata?.first_name || '';
                    const lastName = user.user_metadata?.last_name || '';
                    const displayName = `${firstName} ${lastName}`.trim();
                    option.textContent = displayName || user.email || 'Unknown User';
                    patientSelect.appendChild(option);
                });
                console.log(`Added ${allUsers.length} users to dropdown as fallback`);
            } else {
                patientSelect.innerHTML += '<option value="" disabled>No patients found</option>';
                console.log('No users found in database');
            }
        }
    } catch (error) {
        console.error('Error loading patients:', error);
        const patientSelect = document.getElementById('invoice-patient');
        if (patientSelect) {
            patientSelect.innerHTML = '<option value="">Error loading patients</option>';
        }
    }
}

// Setup invoice form event listeners
function setupInvoiceFormListeners() {
    console.log('Setting up invoice form event listeners');
    
    // Close modal buttons
    const closeBtn = document.getElementById('close-invoice-modal');
    if (closeBtn) {
        console.log('Found close invoice modal button, adding event listener');
        // Remove any existing listeners by cloning and replacing
        const newCloseBtn = closeBtn.cloneNode(true);
        if (closeBtn.parentNode) {
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        }
        newCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Close invoice button clicked');
            closeInvoiceModal();
        });
    } else {
        console.warn('Close invoice modal button not found');
    }
    
    const cancelBtn = document.getElementById('cancel-invoice-btn');
    if (cancelBtn) {
        console.log('Found cancel invoice button, adding event listener');
        // Remove any existing listeners by cloning and replacing
        const newCancelBtn = cancelBtn.cloneNode(true);
        if (cancelBtn.parentNode) {
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        }
        newCancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Cancel invoice button clicked');
            closeInvoiceModal();
        });
    } else {
        console.warn('Cancel invoice button not found');
    }
    
    // Add item button
    const addItemBtn = document.getElementById('add-invoice-item-btn');
    if (addItemBtn) {
        console.log('Found add invoice item button, adding event listener');
        // Remove any existing listeners by cloning and replacing
        const newAddItemBtn = addItemBtn.cloneNode(true);
        if (addItemBtn.parentNode) {
            addItemBtn.parentNode.replaceChild(newAddItemBtn, addItemBtn);
        }
        newAddItemBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add invoice item button clicked');
            addInvoiceItem();
        });
    } else {
        console.warn('Add invoice item button not found');
    }
    
    // Form submission
    const form = document.getElementById('invoice-form');
    if (form) {
        console.log('Found invoice form, adding submit event listener');
        // Remove any existing listeners by cloning and replacing
        const newForm = form.cloneNode(true);
        if (form.parentNode) {
            form.parentNode.replaceChild(newForm, form);
        }
        newForm.addEventListener('submit', handleInvoiceSubmit);
    } else {
        console.warn('Invoice form not found');
    }
    
    // Setup item calculation listeners
    setupItemCalculationListeners();
    
    console.log('Invoice form event listeners setup complete');
}

// Close invoice modal
function closeInvoiceModal() {
    console.log('Closing invoice modal');
    const invoiceModal = document.getElementById('invoice-modal');
    if (invoiceModal) {
        invoiceModal.classList.add('hidden');
        console.log('Invoice modal hidden');
        
        // Reset form
        const form = document.getElementById('invoice-form');
        if (form) {
            form.reset();
            console.log('Invoice form reset');
        }
    } else {
        console.error('Invoice modal not found');
    }
}

// Add new invoice item row
function addInvoiceItem() {
    console.log('Adding new invoice item row');
    const itemsContainer = document.getElementById('invoice-items-container');
    if (!itemsContainer) {
        console.error('Invoice items container not found');
        return;
    }
    
    // Get the first item as a template
    const items = itemsContainer.querySelectorAll('.invoice-item-row');
    if (items.length === 0) {
        console.error('No invoice item rows found to clone');
        return;
    }
    
    // Clone the first item
    const newItem = items[0].cloneNode(true);
    console.log('Cloned first invoice item row');
    
    // Reset input values
    const inputs = newItem.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.name && input.name.includes('description')) {
            input.value = '';
        } else if (input.name && input.name.includes('price')) {
            input.value = '';
        } else if (input.name && input.name.includes('quantity')) {
            input.value = '1';
        } else if (input.name && (input.name.includes('tax') || input.name.includes('discount'))) {
            input.value = '0';
        } else if (input.name && input.name.includes('total')) {
            input.value = '';
        }
    });
    
    // Enable remove button
    const removeBtn = newItem.querySelector('.remove-item-btn');
    if (removeBtn) {
        removeBtn.disabled = false;
        removeBtn.addEventListener('click', function() {
            newItem.remove();
            updateInvoiceTotals();
        });
        console.log('Enabled remove button for new item');
    } else {
        console.warn('Remove button not found in new item');
    }
    
    // Add the new item to the container
    itemsContainer.appendChild(newItem);
    console.log('Added new item to container');
    
    // Setup calculation listeners for the new item
    setupItemCalculationListeners(newItem);
}

// Setup calculation listeners for invoice items
function setupItemCalculationListeners(item = null) {
    const container = item || document.getElementById('invoice-items-container');
    if (!container) return;
    
    // Get all input fields that affect calculations
    const quantityInputs = container.querySelectorAll('input[name="item_quantity[]"]');
    const priceInputs = container.querySelectorAll('input[name="item_price[]"]');
    const taxInputs = container.querySelectorAll('input[name="item_tax[]"]');
    const discountInputs = container.querySelectorAll('input[name="item_discount[]"]');
    
    // Add input event listeners to all calculation fields
    const allInputs = [...quantityInputs, ...priceInputs, ...taxInputs, ...discountInputs];
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Find the parent row
            const row = this.closest('.invoice-item-row');
            if (row) {
                calculateItemTotal(row);
                updateInvoiceTotals();
            }
        });
    });
    
    // Enable remove buttons for all items except the first one
    if (!item) {
        const items = container.querySelectorAll('.invoice-item-row');
        for (let i = 1; i < items.length; i++) {
            const removeBtn = items[i].querySelector('.remove-item-btn');
            if (removeBtn) {
                removeBtn.disabled = false;
                removeBtn.addEventListener('click', function() {
                    items[i].remove();
                    updateInvoiceTotals();
                });
            }
        }
    }
}

// Calculate total for a single invoice item
function calculateItemTotal(row) {
    const quantityInput = row.querySelector('input[name="item_quantity[]"]');
    const priceInput = row.querySelector('input[name="item_price[]"]');
    const taxInput = row.querySelector('input[name="item_tax[]"]');
    const discountInput = row.querySelector('input[name="item_discount[]"]');
    const totalInput = row.querySelector('input[name="item_total[]"]');
    
    if (!quantityInput || !priceInput || !taxInput || !discountInput || !totalInput) return;
    
    const quantity = parseFloat(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const taxPercent = parseFloat(taxInput.value) || 0;
    const discountPercent = parseFloat(discountInput.value) || 0;
    
    const subtotal = quantity * price;
    const taxAmount = subtotal * (taxPercent / 100);
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal + taxAmount - discountAmount;
    
    totalInput.value = total.toFixed(2);
}

// Update invoice summary totals
function updateInvoiceTotals() {
    const itemsContainer = document.getElementById('invoice-items-container');
    if (!itemsContainer) return;
    
    const totalInputs = itemsContainer.querySelectorAll('input[name="item_total[]"]');
    const priceInputs = itemsContainer.querySelectorAll('input[name="item_price[]"]');
    const quantityInputs = itemsContainer.querySelectorAll('input[name="item_quantity[]"]');
    const taxInputs = itemsContainer.querySelectorAll('input[name="item_tax[]"]');
    const discountInputs = itemsContainer.querySelectorAll('input[name="item_discount[]"]');
    
    let subtotal = 0;
    let taxTotal = 0;
    let discountTotal = 0;
    
    // Calculate subtotal and tax/discount amounts
    for (let i = 0; i < totalInputs.length; i++) {
        const quantity = parseFloat(quantityInputs[i].value) || 0;
        const price = parseFloat(priceInputs[i].value) || 0;
        const taxPercent = parseFloat(taxInputs[i].value) || 0;
        const discountPercent = parseFloat(discountInputs[i].value) || 0;
        
        const itemSubtotal = quantity * price;
        subtotal += itemSubtotal;
        
        taxTotal += itemSubtotal * (taxPercent / 100);
        discountTotal += itemSubtotal * (discountPercent / 100);
    }
    
    const total = subtotal + taxTotal - discountTotal;
    
    // Update summary display
    document.getElementById('invoice-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('invoice-tax').textContent = formatCurrency(taxTotal);
    document.getElementById('invoice-discount').textContent = formatCurrency(discountTotal);
    document.getElementById('invoice-total').textContent = formatCurrency(total);
}

// Handle invoice form submission
async function handleInvoiceSubmit(e) {
    try {
        e.preventDefault();
        console.log('Handling invoice form submission...');
        
        // Get form values
        const patientId = document.getElementById('invoice-patient').value;
        const invoiceDate = document.getElementById('invoice-date').value;
        const dueDate = document.getElementById('invoice-due-date').value;
        const notes = document.getElementById('invoice-notes').value;
        const status = document.getElementById('invoice-status').value;
        
        // Validate required fields
        if (!patientId) {
            alert('Please select a patient');
            return;
        }
        
        if (!invoiceDate) {
            alert('Please select an invoice date');
            return;
        }
        
        if (!dueDate) {
            alert('Please select a due date');
            return;
        }
        
        // Get invoice items
        const itemRows = document.querySelectorAll('.invoice-item-row');
        if (itemRows.length === 0) {
            alert('Please add at least one item to the invoice');
            return;
        }
        
        const invoiceItems = [];
        let subtotal = 0;
        
        for (const row of itemRows) {
            const description = row.querySelector('.item-description').value;
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const unitPrice = parseFloat(row.querySelector('.item-price').value) || 0;
            const taxPercent = parseFloat(row.querySelector('.item-tax').value) || 0;
            const discountPercent = parseFloat(row.querySelector('.item-discount').value) || 0;
            
            if (!description || quantity <= 0 || unitPrice <= 0) {
                alert('Please fill in all item details with valid values');
                return;
            }
            
            const itemTotal = calculateItemAmount(quantity, unitPrice, taxPercent, discountPercent);
            subtotal += itemTotal;
            
            invoiceItems.push({
                description,
                quantity,
                unit_price: unitPrice,
                tax_percent: taxPercent,
                discount_percent: discountPercent,
                total_amount: itemTotal
            });
        }
        
        // Calculate totals
        const taxAmount = parseFloat(document.getElementById('invoice-tax-amount').textContent.replace(/[^0-9.-]+/g, '')) || 0;
        const discountAmount = parseFloat(document.getElementById('invoice-discount-amount').textContent.replace(/[^0-9.-]+/g, '')) || 0;
        const totalAmount = parseFloat(document.getElementById('invoice-total-amount').textContent.replace(/[^0-9.-]+/g, '')) || 0;
        
        // Generate invoice number
        const invoiceNumber = generateInvoiceNumber();
        console.log('Generated invoice number:', invoiceNumber);
        
        // Get the Supabase client
        const supabase = invoiceSupabase || window.supabaseClient || window.supabase || window.supabaseAdmin || window.HMSDatabase;
        
        if (!supabase) {
            throw new Error('Supabase client not found');
        }
        
        console.log('Using Supabase client for invoice creation');
        
        // Get current user ID for created_by field
        let userId = 'system';
        try {
            const { data: authData } = await supabase.auth.getUser();
            if (authData && authData.user) {
                userId = authData.user.id;
                console.log('Current user ID:', userId);
            }
        } catch (authError) {
            console.error('Error getting current user:', authError);
            // Continue with system as fallback
        }
        
        // Prepare invoice data according to schema
        const invoiceData = {
            invoice_number: invoiceNumber,
            patient_id: patientId,
            invoice_date: new Date(invoiceDate).toISOString(),
            due_date: new Date(dueDate).toISOString(),
            subtotal,
            tax_amount: taxAmount,
            discount_amount: discountAmount,
            total_amount: totalAmount,
            status,
            notes,
            created_by: userId
        };
        
        console.log('Creating invoice with data:', invoiceData);
        
        // Create invoice in database
        const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .insert(invoiceData)
            .select()
            .single();
        
        if (invoiceError) {
            console.error('Error creating invoice:', invoiceError);
            throw invoiceError;
        }
        
        console.log('Invoice created successfully:', invoice);
        
        // Add invoice items
        const invoiceId = invoice.id;
        for (const item of invoiceItems) {
            item.invoice_id = invoiceId;
        }
        
        console.log('Adding invoice items:', invoiceItems);
        
        const { error: itemsError } = await supabase
            .from('invoice_items')
            .insert(invoiceItems);
        
        if (itemsError) throw itemsError;
        
        // Close modal and refresh invoices list
        closeInvoiceModal();
        await fetchInvoices();
        
        // Show success message
        alert(`Invoice #${invoiceNumber} created successfully`);
        
    } catch (error) {
        console.error('Error creating invoice:', error);
        alert('Failed to create invoice. Please try again.');
    } finally {
        // Re-enable submit button
        const submitBtn = document.getElementById('invoice-form')?.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save Invoice
            `;
        }
    }
}

// Generate a unique invoice number
function generateInvoiceNumber() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${timestamp}-${random}`;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Show loading state
function showLoadingState(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = `
        <tr>
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                <div class="flex justify-center items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading invoices...
                </div>
            </td>
        </tr>
    `;
}

// Show error state
function showErrorState(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = `
        <tr>
            <td colspan="7" class="px-6 py-4 text-center text-red-500">
                <div class="flex justify-center items-center">
                    <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    ${message}
                </div>
            </td>
        </tr>
    `;
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the admin dashboard page
    if (document.getElementById('invoices-content')) {
        // Initialize Supabase client first
        console.log('Initializing Supabase client for invoices...');
        invoiceSupabase = initInvoiceSupabase();
        
        // Then initialize the invoice management functionality
        console.log('Initializing invoice management...');
        initInvoiceManagement();
    }
});

// Initialize invoice management
function initInvoiceManagement() {
    // Set up event listeners
    setupEventListeners();
    
    // Fetch invoices on page load
    fetchInvoices();
}

// Set up event listeners for invoice management
function setupEventListeners() {
    // Create invoice button
    const createInvoiceBtn = document.getElementById('create-invoice-btn');
    if (createInvoiceBtn) {
        createInvoiceBtn.addEventListener('click', showCreateInvoiceModal);
    }
    
    // Refresh invoices button
    const refreshInvoicesBtn = document.getElementById('refresh-invoices-btn');
    if (refreshInvoicesBtn) {
        refreshInvoicesBtn.addEventListener('click', fetchInvoices);
    }
    
    // Export invoices button
    const exportInvoicesBtn = document.getElementById('export-invoices-btn');
    if (exportInvoicesBtn) {
        exportInvoicesBtn.addEventListener('click', exportInvoices);
    }
    
    // Invoice search
    const invoiceSearch = document.getElementById('invoice-search');
    if (invoiceSearch) {
        invoiceSearch.addEventListener('input', function() {
            // Debounce search input
            clearTimeout(window.invoiceSearchTimeout);
            window.invoiceSearchTimeout = setTimeout(() => {
                fetchInvoices();
            }, 500);
        });
    }
    
    // Invoice status filter
    const statusFilter = document.getElementById('invoice-status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', fetchInvoices);
    }
    
    // Invoice date filter
    const dateFilter = document.getElementById('invoice-date-filter');
    if (dateFilter) {
        dateFilter.addEventListener('change', fetchInvoices);
    }
}

// Make functions available globally
window.initInvoiceManagement = initInvoiceManagement;
window.fetchInvoices = fetchInvoices;
window.changePage = changePage;
