// Supabase Integration
// This file provides common Supabase integration functions used across the application

// Check if the user is authenticated
const checkAuthentication = async () => {
    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        
        if (error) {
            console.error('Error checking authentication:', error);
            return null;
        }
        
        return user;
    } catch (error) {
        console.error('Error in checkAuthentication:', error);
        return null;
    }
};

// Check if initSupabase is already defined globally
if (typeof window.initSupabase === 'undefined') {
    // Initialize Supabase client if not already initialized
    window.initSupabase = () => {
        if (!window.supabaseClient) {
            window.supabaseClient = supabase.createClient(
                window.SUPABASE_URL,
                window.SUPABASE_ANON_KEY
            );
            console.log('Supabase client initialized');
        }
        return window.supabaseClient;
    };
}

// Export functions
window.checkAuthentication = checkAuthentication;
