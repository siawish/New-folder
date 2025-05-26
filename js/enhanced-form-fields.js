/**
 * Enhanced Form Fields for Hospital Management System
 * Provides styled form fields with icons and better visual appearance
 */

// Function to generate a random alphanumeric password
function generateRandomPassword(length = 6) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

// Helper function to get the appropriate icon for different field types
function getFieldIcon(id, type) {
    // Define icons for common field types
    const icons = {
        email: '<svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                '<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />'+
                '<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />'+
            '</svg>',
        password: '<svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                '<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />'+
            '</svg>',
        text: '<svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                '<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />'+
            '</svg>',
        tel: '<svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                '<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />'+
            '</svg>',
        date: '<svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                '<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />'+
            '</svg>',
        select: '<svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                '<path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />'+
            '</svg>',
        textarea: '<svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">'+
                '<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />'+
            '</svg>'
    };
    
    // Check for specific fields by ID
    if (id === 'first_name' || id === 'last_name') {
        return icons.text;
    }
    
    // Default to type-based icons
    return icons[type] || icons.text;
}

// Enhanced version of createFormField with icons and better styling
function createEnhancedFormField(id, label, type, placeholder, required = false, options = null) {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'space-y-2 mb-4';
    
    // Create label with optional required indicator
    const fieldLabel = document.createElement('label');
    fieldLabel.htmlFor = id;
    fieldLabel.className = 'block text-sm font-medium text-gray-700';
    
    if (required) {
        const labelText = document.createTextNode(label);
        fieldLabel.appendChild(labelText);
        
        const requiredSpan = document.createElement('span');
        requiredSpan.className = 'text-red-500 ml-1';
        requiredSpan.textContent = '*';
        fieldLabel.appendChild(requiredSpan);
    } else {
        fieldLabel.textContent = label;
    }
    
    // Create input wrapper for icon positioning
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'relative rounded-md shadow-sm';
    
    // Get appropriate icon
    const iconHTML = getFieldIcon(id, options ? 'select' : type);
    
    // Create icon container with proper spacing and fixed width
    const iconContainer = document.createElement('div');
    iconContainer.className = 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none';
    iconContainer.style.width = '36px'; // Fixed width for icon container
    iconContainer.style.display = 'flex';
    iconContainer.style.justifyContent = 'center';
    iconContainer.innerHTML = iconHTML;
    
    // Create input or select
    let fieldInput;
    
    if (options) {
        // Create select for options
        fieldInput = document.createElement('select');
        fieldInput.className = 'block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200';
        fieldInput.style.paddingLeft = '45px'; // Fixed padding to prevent overlap
        
        // Add placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = placeholder;
        placeholderOption.selected = true;
        placeholderOption.disabled = true;
        fieldInput.appendChild(placeholderOption);
        
        // Add options
        options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.label;
            fieldInput.appendChild(optionEl);
        });
    } else if (type === 'textarea') {
        // Create textarea
        fieldInput = document.createElement('textarea');
        fieldInput.placeholder = placeholder;
        fieldInput.className = 'block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200';
        fieldInput.style.paddingLeft = '45px'; // Fixed padding to prevent overlap
        fieldInput.rows = 4;
    } else {
        // Create regular input
        fieldInput = document.createElement('input');
        fieldInput.type = type;
        fieldInput.placeholder = placeholder;
        fieldInput.className = 'block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200';
        fieldInput.style.paddingLeft = '45px'; // Fixed padding to prevent overlap
    }
    
    // Common attributes
    fieldInput.id = id;
    fieldInput.name = id;
    
    if (required) {
        fieldInput.required = true;
    }
    
    // Add elements to container
    inputWrapper.appendChild(iconContainer);
    inputWrapper.appendChild(fieldInput);
    
    // Add password generator button for password fields
    if (type === 'password') {
        const generateButton = document.createElement('button');
        generateButton.type = 'button';
        generateButton.className = 'absolute inset-y-0 right-0 px-3 flex items-center bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors';
        generateButton.innerHTML = 'Generate';
        generateButton.style.fontSize = '0.8rem';
        
        // Add click event to generate and set password
        generateButton.addEventListener('click', function() {
            const newPassword = generateRandomPassword(6);
            fieldInput.value = newPassword;
            fieldInput.type = 'text';
            
            // Show password temporarily then switch back to password type
            setTimeout(() => {
                fieldInput.type = 'password';
            }, 3000);
            
            // Create a temporary message to show the password was generated
            const helperText = document.getElementById(id + '-helper');
            helperText.textContent = 'Password generated! Will be hidden in 3 seconds.';
            helperText.className = 'mt-1 text-sm text-green-500';
            
            // Hide the message after 3 seconds
            setTimeout(() => {
                helperText.className = 'mt-1 text-sm text-gray-500 hidden';
            }, 3000);
        });
        
        inputWrapper.appendChild(generateButton);
        
        // Adjust input field to make room for the button
        fieldInput.style.paddingRight = '90px';
    }
    
    fieldContainer.appendChild(fieldLabel);
    fieldContainer.appendChild(inputWrapper);
    
    // Add helper text container (empty by default)
    const helperText = document.createElement('p');
    helperText.className = 'mt-1 text-sm text-gray-500 hidden';
    helperText.id = id + '-helper';
    fieldContainer.appendChild(helperText);
    
    return fieldContainer;
}

// Export the enhanced form field creation function
window.createEnhancedFormField = createEnhancedFormField;
