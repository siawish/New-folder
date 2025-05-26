// IMPORTANT: This file contains admin credentials and should NEVER be exposed to clients
// This should only be used in server-side code or secure environments

// Supabase Admin Configuration
if (!window.SUPABASE_ADMIN_URL) {
    window.SUPABASE_ADMIN_URL = 'https://vqlevlvqxwwofnecitxo.supabase.co';
}

if (!window.SUPABASE_SERVICE_KEY) {
    window.SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbGV2bHZxeHd3b2ZuZWNpdHhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzc0OTU3MywiZXhwIjoyMDYzMzI1NTczfQ.5h6zqDPzw9-4zDh3ytQM4SPSAfSMSP_T6zYmlndN6e0';
}

// Create a separate admin client with explicit headers
if (!window.supabaseAdminClient) {
    window.supabaseAdminClient = supabase.createClient(window.SUPABASE_ADMIN_URL, window.SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    global: {
        headers: {
            'apikey': window.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${window.SUPABASE_SERVICE_KEY}`
        }
    }
  });
}

// WARNING: In a production environment, this should be in a server-side component
// not exposed to the client. This approach is for development purposes only.

// Export the admin client with both names for compatibility
window.supabaseAdmin = window.supabaseAdminClient;

// Log that the admin client is ready
console.log('Supabase admin client initialized');
