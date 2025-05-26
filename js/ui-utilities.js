// UI Utility Functions for Hospital Management System
// These functions provide common UI operations used across the application

// Show loading state in a container
function showLoadingState(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="flex justify-center items-center p-4">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">${message}</span>
        </div>
    `;
}

// Show error state in a container
function showErrorState(containerId, message = 'An error occurred. Please try again.') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center p-4 text-red-500">
            <svg class="mx-auto h-10 w-10 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p>${message}</p>
        </div>
    `;
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    // Remove any existing toasts
    const existingToast = document.getElementById('toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 right-4 z-50';
        document.body.appendChild(toastContainer);
    }
    
    // Set color based on type
    let bgColor, textColor, iconSvg;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-500';
            textColor = 'text-white';
            iconSvg = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            textColor = 'text-white';
            iconSvg = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            break;
        case 'warning':
            bgColor = 'bg-yellow-500';
            textColor = 'text-white';
            iconSvg = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
            break;
        default: // info
            bgColor = 'bg-blue-500';
            textColor = 'text-white';
            iconSvg = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = `flex items-center p-3 mb-3 rounded shadow-lg ${bgColor} ${textColor} transform transition-transform duration-300 ease-in-out`;
    toast.style.minWidth = '300px';
    toast.innerHTML = `
        <div class="flex items-center">
            ${iconSvg}
            <span>${message}</span>
        </div>
        <button class="ml-auto text-white focus:outline-none" onclick="this.parentElement.remove()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('translate-y-0');
        toast.classList.remove('-translate-y-full');
    }, 10);
    
    // Auto remove after duration
    setTimeout(() => {
        if (toast && toast.parentElement) {
            toast.classList.add('opacity-0');
            setTimeout(() => {
                if (toast && toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }
    }, duration);
}

// Update element with value
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Function to get departments for doctor form
async function getDepartmentsForDoctorForm() {
    try {
        const { data, error } = await supabaseClient
            .from('departments')
            .select('id, name')
            .order('name', { ascending: true });
            
        if (error) {
            console.error('Error fetching departments:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('Error in getDepartmentsForDoctorForm:', error);
        return [];
    }
}

// Show offline warning
function showOfflineWarning() {
    showToast('You are offline. This action requires an internet connection.', 'warning');
    return false;
}

// Check if online
function isOnline() {
    return navigator.onLine;
}

// Format number with commas for thousands
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Update pending doctor status
function updatePendingDoctorStatus(doctorId, status) {
    const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
    const index = pendingDoctors.findIndex(doctor => doctor.id === doctorId);
    
    if (index !== -1) {
        pendingDoctors[index].status = status;
        localStorage.setItem('pendingDoctors', JSON.stringify(pendingDoctors));
        return true;
    }
    return false;
}

// Update pending doctors count - only define if not already defined
if (typeof window.updatePendingDoctorsCount === 'undefined') {
    window.updatePendingDoctorsCount = function() {
        const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
        const pendingCount = pendingDoctors.length;
        
        const pendingBadge = document.getElementById('pending-doctors-badge');
        if (pendingBadge) {
            if (pendingCount > 0) {
                pendingBadge.textContent = pendingCount;
                pendingBadge.classList.remove('hidden');
            } else {
                pendingBadge.classList.add('hidden');
            }
        }
    };
}

// Export functions for global use
window.showLoadingState = showLoadingState;
window.showErrorState = showErrorState;
window.showToast = showToast;
window.updateElement = updateElement;
window.getDepartmentsForDoctorForm = getDepartmentsForDoctorForm;
window.showOfflineWarning = showOfflineWarning;
window.isOnline = isOnline;
window.formatNumber = formatNumber;
window.updatePendingDoctorStatus = updatePendingDoctorStatus;
window.updatePendingDoctorsCount = updatePendingDoctorsCount;

// Make supabaseAdmin available globally
window.supabaseAdmin = window.supabaseAdminClient;

// Show manual invitation modal
function showManualInvitationModal(doctor) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('manual-invitation-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'manual-invitation-modal';
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-bold mb-4">Manual Invitation</h3>
                <p class="mb-4">There was an issue sending an automatic invitation. You can manually invite this doctor by sharing the following information:</p>
                <div class="bg-gray-100 p-3 rounded mb-4">
                    <p><strong>Email:</strong> <span id="manual-invite-email"></span></p>
                    <p><strong>Password:</strong> <span id="manual-invite-password"></span></p>
                    <p class="text-sm text-gray-600 mt-2">Ask the doctor to use these credentials to log in at your hospital portal.</p>
                </div>
                <div class="flex justify-end">
                    <button id="close-manual-invitation" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Update modal content
    document.getElementById('manual-invite-email').textContent = doctor.email || '';
    document.getElementById('manual-invite-password').textContent = doctor.password || 'Contact admin for password';
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Add close button event listener
    document.getElementById('close-manual-invitation').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

// Safe function to show manual invitation modal
function safeShowManualInvitation(doctor) {
    try {
        if (typeof showManualInvitationModal === 'function') {
            showManualInvitationModal(doctor);
        } else if (typeof window.showManualInvitationModal === 'function') {
            window.showManualInvitationModal(doctor);
        } else {
            console.error('showManualInvitationModal function not found');
            showToast('Could not show manual invitation dialog. Check console for details.', 'error');
        }
    } catch (error) {
        console.error('Error showing manual invitation modal:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Export functions
window.showManualInvitationModal = showManualInvitationModal;
window.safeShowManualInvitation = safeShowManualInvitation;
