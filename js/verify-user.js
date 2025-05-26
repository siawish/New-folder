/**
 * Utility script to manually verify a user's email in Supabase auth system
 * This script uses the Supabase Admin API to update the email_confirmed_at field
 */

// Import the Supabase Admin configuration
const SUPABASE_ADMIN_URL = window.SUPABASE_ADMIN_URL || 'https://qqfcqbxwxhbfcvlnpfvn.supabase.co';
const SUPABASE_SERVICE_KEY = window.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZmNxYnh3eGhiZmN2bG5wZnZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNjYzOTkxMiwiZXhwIjoyMDMyMjE1OTEyfQ.Uj3cCm-FCfuHFyg5z9ZOqKBL7SfAI4nKJJR0qvB3v_E';

// Initialize Supabase Admin client
const supabaseAdmin = window.supabaseAdmin || window.supabaseAdminClient;

/**
 * Manually verify a user's email in the profiles table only
 * @param {string} userId - The user's UUID
 * @param {string} userEmail - The user's email address (for display purposes)
 * @returns {Promise<Object>} - Result of the operation
 */
async function verifyUserEmail(userId, userEmail) {
    try {
        console.log(`Attempting to verify user in profiles table: ${userId} (${userEmail})`);
        
        if (!supabaseAdmin) {
            throw new Error('Supabase Admin client is not available');
        }
        
        // Only update the email_verified field in the profiles table
        // The auth.users table should already have email_confirmed_at set during registration
        const { data, error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ email_verified: true })
            .eq('id', userId)
            .select();
            
        if (profileError) {
            throw profileError;
        }
        
        console.log(`Successfully verified user in profiles table: ${userId} (${userEmail})`);
        return { 
            success: true, 
            data, 
            message: `User ${userEmail} has been verified successfully in the profiles table.`
        };
        
    } catch (error) {
        console.error('Error verifying user in profiles table:', error);
        return { 
            success: false, 
            error: error.message || 'Unknown error occurred'
        };
    }
}

// Example usage:
// verifyUserEmail('59de590d-57ce-4907-bfb7-d7a6d648556a', 'youthful.chinchilla.ylef@letterprotect.com')
//   .then(result => console.log(result))
//   .catch(error => console.error(error));

// Make the function available globally
window.verifyUserEmail = verifyUserEmail;
