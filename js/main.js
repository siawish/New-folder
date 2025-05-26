// Main JavaScript for Hospital Management System

// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Simple validation
            if (!formData.name || !formData.email || !formData.message) {
                showAlert('Please fill in all required fields', 'error');
                return;
            }
            
            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            showAlert('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }

    // Check if user is logged in (for pages that require authentication)
    checkAuthState();
});

// Show alert message
function showAlert(message, type = 'info') {
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type === 'error' ? 'danger' : type} fixed top-20 right-4 max-w-sm z-50 shadow-lg`;
    alertElement.innerHTML = `
        <div class="flex items-center justify-between p-4">
            <span>${message}</span>
            <button type="button" class="close-alert ml-4">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(alertElement);
    
    // Add close functionality
    alertElement.querySelector('.close-alert').addEventListener('click', function() {
        alertElement.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 5000);
}

// Check authentication state
function checkAuthState() {
    // This will be implemented with Supabase in auth.js
    // For now, we'll just check if there's a token in localStorage
    const token = localStorage.getItem('supabase.auth.token');
    
    // Update UI based on auth state
    updateUIForAuthState(!!token);
}

// Update UI based on authentication state
function updateUIForAuthState(isLoggedIn) {
    const authButtons = document.querySelectorAll('.auth-buttons');
    const userMenus = document.querySelectorAll('.user-menu');
    
    if (isLoggedIn) {
        // Hide auth buttons, show user menu
        authButtons.forEach(el => el.classList.add('hidden'));
        userMenus.forEach(el => el.classList.remove('hidden'));
    } else {
        // Show auth buttons, hide user menu
        authButtons.forEach(el => el.classList.remove('hidden'));
        userMenus.forEach(el => el.classList.add('hidden'));
    }
}

// Create a modal
function createModal(title, content, onConfirm = null) {
    // Create modal elements
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <div class="modal-header flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">${title}</h3>
            <button class="modal-close focus:outline-none">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <div class="modal-body mb-4">
            ${content}
        </div>
        <div class="modal-footer flex justify-end space-x-2">
            <button class="modal-cancel px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Cancel</button>
            ${onConfirm ? '<button class="modal-confirm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm</button>' : ''}
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Add event listeners
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
    
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    };
    
    modalContent.querySelector('.modal-close').addEventListener('click', closeModal);
    modalContent.querySelector('.modal-cancel').addEventListener('click', closeModal);
    
    if (onConfirm) {
        modalContent.querySelector('.modal-confirm').addEventListener('click', () => {
            onConfirm();
            closeModal();
        });
    }
    
    return {
        close: closeModal
    };
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format time
function formatTime(timeString) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(undefined, options);
}

// Generate random ID
function generateId(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}

// Debounce function for search inputs
function debounce(func, wait = 300) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Export functions for use in other scripts
window.HMS = {
    showAlert,
    createModal,
    formatDate,
    formatTime,
    generateId,
    debounce
};
