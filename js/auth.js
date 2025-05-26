// Authentication functionality using Supabase

// Import Supabase client if using modules
// import { createClient } from '@supabase/supabase-js'

// Use the global supabaseClient from supabase-config.js
document.addEventListener('DOMContentLoaded', function() {
    // Make sure supabase-config.js is loaded before this script
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized. Make sure supabase-config.js is loaded first.');
    }
    
    // Show/hide password toggle functionality
    const togglePasswordButton = document.getElementById('toggle-password');
    if (togglePasswordButton) {
        const passwordInput = document.getElementById('password');
        const showPasswordIcon = document.getElementById('show-password-icon');
        const hidePasswordIcon = document.getElementById('hide-password-icon');
        
        togglePasswordButton.addEventListener('click', function() {
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                showPasswordIcon.classList.add('hidden');
                hidePasswordIcon.classList.remove('hidden');
            } else {
                passwordInput.type = 'password';
                showPasswordIcon.classList.remove('hidden');
                hidePasswordIcon.classList.add('hidden');
            }
        });
    }
});

// Use window.supabaseClient for all Supabase operations

// Variables
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authMessage = document.getElementById('auth-message');
const loadingIndicator = document.getElementById('loading');
const verifyEmailContainer = document.getElementById('email-verification-message');
const loginSuccessScreen = document.getElementById('login-success');
const resendVerificationBtn = document.getElementById('resend-verification');

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
    } else {
        // Fallback if authMessage element doesn't exist
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `p-4 mb-4 rounded-md ${
                type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`;
            messageElement.style.display = 'block';
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        } else {
            // Create a temporary message element if neither exists
            const tempMessage = document.createElement('div');
            tempMessage.id = 'temp-message';
            tempMessage.textContent = message;
            tempMessage.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
                type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`;
            document.body.appendChild(tempMessage);
            
            // Auto hide and remove after 5 seconds
            setTimeout(() => {
                document.body.removeChild(tempMessage);
            }, 5000);
        }
    }
}

function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    } else {
        // Fallback if loadingIndicator doesn't exist
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        } else {
            // Create loading overlay if it doesn't exist
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading';
            loadingOverlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50';
            loadingOverlay.innerHTML = `
                <div class="bg-white p-5 rounded-lg shadow-lg flex items-center">
                    <svg class="animate-spin h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-gray-700">Processing...</span>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
        }
    }
}

function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    } else {
        // Fallback if loadingIndicator doesn't exist
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

async function redirectToDashboard(role) {
    console.log('Redirecting to dashboard for role:', role);
    
    // If we're on the login page, show the success screen
    if (window.location.pathname.includes('/auth/login.html') && loginSuccessScreen) {
        try {
            console.log('Showing login success screen');
            // Get user data to display name
            const { data } = await window.supabaseClient.auth.getUser();
            if (data && data.user) {
                // Hide the login form
                if (loginForm) {
                    console.log('Hiding login form');
                    loginForm.classList.add('hidden');
                }
                
                // Show the success message with user's name
                const userFullnameSpan = loginSuccessScreen.querySelector('.user-fullname');
                if (userFullnameSpan) {
                    const firstName = data.user.user_metadata?.first_name || '';
                    const lastName = data.user.user_metadata?.last_name || '';
                    userFullnameSpan.textContent = firstName && lastName ? `${firstName} ${lastName}` : data.user.email;
                    console.log('Set user name to:', userFullnameSpan.textContent);
                }
                
                // Show the success screen
                loginSuccessScreen.classList.remove('hidden');
                console.log('Showing success screen');
                
                // Wait 2 seconds before redirecting
                setTimeout(() => {
                    console.log('Timeout complete, redirecting to dashboard');
                    // Redirect to the appropriate dashboard based on user role
                    let dashboardUrl = '../pages/patient/dashboard.html'; // Default
                    
                    switch(role) {
                        case 'admin':
                            dashboardUrl = '../pages/admin/dashboard.html';
                            break;
                        case 'doctor':
                            dashboardUrl = '../pages/doctor/dashboard.html';
                            break;
                        case 'receptionist':
                            dashboardUrl = '../pages/receptionist/dashboard.html';
                            break;
                        case 'patient':
                            dashboardUrl = '../pages/patient/dashboard.html';
                            break;
                    }
                    
                    console.log('Redirecting to:', dashboardUrl);
                    window.location.href = dashboardUrl;
                }, 2000);
                
                return;
            }
        } catch (error) {
            console.error('Error getting user data:', error);
        }
    }
    
    // If we're not on the login page or there was an error, redirect immediately
    let dashboardUrl = '../pages/patient/dashboard.html'; // Default
    
    switch(role) {
        case 'admin':
            dashboardUrl = '../pages/admin/dashboard.html';
            break;
        case 'doctor':
            dashboardUrl = '../pages/doctor/dashboard.html';
            break;
        case 'receptionist':
            dashboardUrl = '../pages/receptionist/dashboard.html';
            break;
        case 'patient':
            dashboardUrl = '../pages/patient/dashboard.html';
            break;
    }
    
    console.log('Immediate redirect to:', dashboardUrl);
    window.location.href = dashboardUrl;
}

// Check if user is already logged in
async function checkUser() {
    try {
        showLoading();
        
        // Check if we're on a login or register page - don't redirect if we are
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.includes('/auth/login.html') || 
                          currentPath.includes('/auth/register.html') ||
                          currentPath.includes('/index.html') ||
                          currentPath === '/';
        
        if (isAuthPage) {
            // Don't redirect if we're already on an auth page
            hideLoading();
            return;
        }
        
        const { data: { user }, error } = await window.supabaseClient.auth.getUser();
        
        if (error) throw error;
        
        if (!user) {
            // Redirect to login if not logged in
            window.location.href = '../auth/login.html';
            return;
        }
        
        // Check if email is verified
        if (!user.email_confirmed_at) {
            showEmailVerificationMessage(user.email);
            return;
        }
        
        // Get user profile to determine role
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
        if (profile) {
            // Only redirect if we're not already on the correct dashboard
            const isDashboardPage = currentPath.includes(`/dashboards/${profile.role}.html`);
            if (!isDashboardPage) {
                redirectToDashboard(profile.role);
            }
        } else {
            // If profile doesn't exist, create a basic one and redirect to dashboard
            try {
                const { error: insertError } = await window.supabaseClient
                    .from('profiles')
                    .insert([
                        {
                            id: user.id,
                            first_name: user.user_metadata?.first_name || '',
                            last_name: user.user_metadata?.last_name || '',
                            email: user.email,
                            role: user.user_metadata?.role || 'patient',
                            created_at: new Date()
                        }
                    ]);
                
                if (insertError) throw insertError;
                
                // Redirect to appropriate dashboard based on user metadata
                redirectToDashboard(user.user_metadata?.role || 'patient');
            } catch (err) {
                console.error('Error creating profile:', err);
                // If all else fails, redirect to login
                window.location.href = '../auth/login.html';
            }
        }
    } catch (error) {
        console.error('Error checking user:', error.message);
    } finally {
        hideLoading();
    }
}

// Show email verification message
function showEmailVerificationMessage(email) {
    console.log('Showing email verification message for:', email);
    if (verifyEmailContainer) {
        const emailSpan = verifyEmailContainer.querySelector('.user-email');
        if (emailSpan) {
            emailSpan.textContent = email;
            console.log('Set email in verification message to:', email);
        }
        verifyEmailContainer.classList.remove('hidden');
        loginForm.classList.add('hidden');
        console.log('Showing verification container and hiding login form');
    } else {
        console.log('Verification container not found, showing message instead');
        showMessage('Please verify your email before logging in. Check your inbox for a verification link.', 'error');
    }
}

// Default admin credentials for easy login
const DEFAULT_ADMIN_EMAIL = 'admin@hospital.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

// Login functionality
if (loginForm) {
    console.log('Login form found, adding event listener');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        showLoading();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        console.log('Attempting login with:', email);
        
        // Check if using default admin credentials
        if (email === window.DEFAULT_ADMIN_EMAIL && password === window.DEFAULT_ADMIN_PASSWORD) {
            console.log('Using default admin credentials');
            // Set a flag in localStorage to indicate default admin login
            localStorage.setItem('isDefaultAdmin', 'true');
            // Skip database check and redirect directly to admin dashboard
            hideLoading();
            redirectToDashboard('admin');
            return;
        }
        
        try {
            console.log('Attempting to sign in with Supabase');
            
            // Check if remember me is checked
            const rememberMe = document.getElementById('remember-me').checked;
            console.log('Remember me checked:', rememberMe);
            
            // Use signInWithPassword method with explicit options to prevent redirect
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email,
                password,
                options: {
                    redirectTo: null, // Prevent any automatic redirects
                    // Set session persistence based on remember me checkbox
                    persistSession: true // Always persist in localStorage
                }
            });
            
            // If remember me is checked, store the session in localStorage
            // Otherwise, store it in sessionStorage (cleared when browser is closed)
            if (data && data.session) {
                if (rememberMe) {
                    console.log('Storing session in localStorage for persistent login');
                    localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
                } else {
                    console.log('Storing session in sessionStorage for temporary login');
                    // Remove from localStorage if it exists
                    localStorage.removeItem('supabase.auth.token');
                    // Store in sessionStorage instead
                    sessionStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
                }
            }
            
            if (error) {
                console.error('Login error:', error.message);
                showMessage(error.message, 'error');
                hideLoading();
                return;
            }
            
            console.log('Login successful, checking email confirmation');
            // Check if email is confirmed
            if (!data.user.email_confirmed_at) {
                console.log('Email not confirmed, showing verification message');
                showEmailVerificationMessage(email);
                hideLoading();
                return;
            }
            
            console.log('Email confirmed, proceeding with login');
            
            // Get user profile to determine role
            const { data: profile, error: profileError } = await window.supabaseClient
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();
                
            if (profileError) {
                // If profile doesn't exist, create a basic one and redirect to dashboard
                try {
                    const { data: userData } = await window.supabaseClient.auth.getUser();
                    const { error: insertError } = await window.supabaseClient
                        .from('profiles')
                        .insert([
                            {
                                id: userData.user.id,
                                first_name: userData.user.user_metadata?.first_name || '',
                                last_name: userData.user.user_metadata?.last_name || '',
                                email: userData.user.email,
                                role: userData.user.user_metadata?.role || 'patient',
                                created_at: new Date()
                            }
                        ]);
                    
                    if (insertError) throw insertError;
                    
                    // Redirect to appropriate dashboard based on user metadata
                    redirectToDashboard(userData.user.user_metadata?.role || 'patient');
                } catch (err) {
                    console.error('Error creating profile:', err);
                    // If all else fails, redirect to login
                    window.location.href = '../auth/login.html';
                }
            } else {
                console.log('Login successful, redirecting to dashboard for role:', profile.role);
                // Redirect to appropriate dashboard
                redirectToDashboard(profile.role);
            }
            
        } catch (error) {
            showMessage(error.message);
        } finally {
            hideLoading();
        }
    });
}

// Registration functionality
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const role = document.getElementById('user-role').value;
        
        // Collect patient-specific information
        let patientInfo = {};
        
        // Get patient fields
        const phone = document.getElementById('phone')?.value || null;
        const address = document.getElementById('address')?.value || null;
        
        // Create patient info object
        patientInfo = {
            phone,
            address,
            date_of_birth: document.getElementById('date-of-birth')?.value || null,
            gender: document.getElementById('gender')?.value || null,
            blood_group: document.getElementById('blood-group')?.value || null,
            allergies: document.getElementById('allergies')?.value || null,
            emergency_contact: document.getElementById('emergency-contact')?.value || null,
            medical_conditions: document.getElementById('medical-conditions')?.value || null,
            insurance_provider: document.getElementById('insurance-provider')?.value || null,
            insurance_policy_number: document.getElementById('insurance-policy-number')?.value || null
        };
        
        console.log('Collecting patient information:', patientInfo);
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showMessage('Passwords do not match');
            hideLoading();
            return;
        }
        
        try {
            hideLoading();
            document.body.insertAdjacentHTML('beforeend', `
                <div id="email-sending-animation" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                        <div class="mb-4">
                            <svg class="animate-bounce w-16 h-16 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Sending Verification Email...</h3>
                        <p class="text-gray-600">Please wait while we create your account and send a verification email.</p>
                    </div>
                </div>
            `);
            
            // Create user in Supabase Auth with email confirmation
            const userData = {
                first_name: firstName,
                last_name: lastName,
                role: role
            };
            
            // Add patient-specific data to user metadata
            console.log('Adding patient-specific data to user metadata');
            Object.assign(userData, patientInfo);
            
            console.log('Registering user with data:', userData);
            
            const { data, error } = await window.supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: userData,
                    emailRedirectTo: `${window.location.origin}/auth/login.html`
                }
            });
            
            // Remove the animation after signup attempt
            const emailAnimation = document.getElementById('email-sending-animation');
            if (emailAnimation) {
                emailAnimation.remove();
            }
            
            if (error) throw error;
            
            if (!data.user) {
                throw new Error('Registration failed. Please try again.');
            }
            
            // We don't need to manually create the profile anymore
            // Supabase triggers will handle this automatically based on auth.users
            
            // Show detailed success message with verification instructions
            registerForm.innerHTML = `
                <div class="text-center p-6 bg-blue-50 rounded-lg">
                    <svg class="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
                    <div class="bg-white p-4 rounded-lg border border-blue-200 mb-4 text-left">
                        <h4 class="font-semibold text-blue-700 mb-2">Verification Email Sent</h4>
                        <p class="text-gray-600 mb-2">We've sent a verification link to: <strong>${email}</strong></p>
                        <div class="flex items-start mb-2">
                            <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-sm text-gray-600">The email contains a verification link that will expire in 24 hours</span>
                        </div>
                    </div>
                    
                    <div class="bg-white p-4 rounded-lg border border-blue-200 mb-4 text-left">
                        <h4 class="font-semibold text-blue-700 mb-2">Next Steps</h4>
                        <ol class="list-decimal list-inside space-y-2 text-sm text-gray-600">
                            <li>Open the verification email in your inbox</li>
                            <li>Click the verification link in the email</li>
                            <li>You'll be redirected to the login page automatically</li>
                            <li>Sign in with your email and password</li>
                        </ol>
                    </div>
                    
                    <div class="flex justify-between mt-6">
                        <button id="resend-verification-email" class="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition text-center">
                            Resend Email
                        </button>
                        <a href="login.html" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center">
                            Go to Login
                        </a>
                    </div>
                </div>
            `;
            
            // Add event listener for resend button
            document.getElementById('resend-verification-email').addEventListener('click', async () => {
                try {
                    showLoading();
                    const { error } = await window.supabaseClient.auth.resend({
                        type: 'signup',
                        email: email,
                        options: {
                            emailRedirectTo: `${window.location.origin}/auth/login.html`
                        }
                    });
                    
                    if (error) throw error;
                    
                    showMessage('Verification email resent successfully. Please check your inbox.', 'success');
                } catch (error) {
                    showMessage(error.message);
                } finally {
                    hideLoading();
                }
            });
            
        } catch (error) {
            showMessage(error.message);
        } finally {
            hideLoading();
        }
    });
}

// Resend verification email
if (resendVerificationBtn) {
    resendVerificationBtn.addEventListener('click', async () => {
        const email = document.querySelector('.user-email').textContent;
        
        if (!email) {
            showMessage('Email address not found');
            return;
        }
        
        showLoading();
        
        try {
            const { error } = await window.supabaseClient.auth.resend({
                type: 'signup',
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/login.html`
                }
            });
            
            if (error) throw error;
            
            showMessage('Verification email resent. Please check your inbox.', 'success');
        } catch (error) {
            showMessage(error.message);
        } finally {
            hideLoading();
        }
    });
}

// Forgot password functionality
const forgotPasswordLink = document.getElementById('forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        if (!email) {
            showMessage('Please enter your email address');
            return;
        }
        
        showLoading();
        
        try {
            const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password.html`,
            });
            
            if (error) throw error;
            
            showMessage('Password reset instructions sent to your email', 'success');
        } catch (error) {
            showMessage(error.message);
        } finally {
            hideLoading();
        }
    });
}

// Logout functionality
async function logout() {
    showLoading();
    
    try {
        const { error } = await window.supabaseClient.auth.signOut();
        
        if (error) throw error;
        
        // Redirect to home page
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Error logging out:', error.message);
    } finally {
        hideLoading();
    }
}

// Handle email verification confirmation
async function handleEmailVerification() {
    // Check if this is a redirect from email verification
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
        showLoading();
        
        try {
            // Extract the access token from the URL
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            
            if (accessToken) {
                // Set the session using the access token
                const { data, error } = await window.supabaseClient.auth.setSession({
                    access_token: accessToken,
                    refresh_token: params.get('refresh_token'),
                });
                
                if (error) throw error;
                
                if (data.user) {
                    showMessage('Email verified successfully! You can now log in.', 'success');
                }
            }
        } catch (error) {
            console.error('Error handling email verification:', error.message);
            showMessage('Error verifying email. Please try logging in.');
        } finally {
            hideLoading();
        }
    }
}

// Check if user is already logged in when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Handle email verification if present in URL
    handleEmailVerification();
    
    // Only check user on login and register pages
    if (window.location.pathname.includes('/auth/')) {
        checkUser();
    }
});
