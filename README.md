# Hospital Management System

A full-featured, responsive, and animated Hospital Management System (HMS) website using HTML, Tailwind CSS, JavaScript, and Supabase as the backend.

## Features

- Role-based dashboards for Admin, Doctor, Patient, and Receptionist
- Responsive layout (mobile-first)
- Smooth animations using CSS and AOS/GSAP
- Modern UI components (modals, cards, tables, dropdowns)
- Supabase Authentication with email/password login
- Row-Level Security (RLS) policies to restrict access based on roles

## Supabase Configuration

### Step 1: Set Up Supabase Database

1. Log in to your Supabase dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Navigate to your project: `https://vqlevlvqxwwofnecitxo.supabase.co`
3. Go to the SQL Editor
4. Copy the contents of `supabase-setup.sql` file
5. Paste the SQL into the editor and run it to create all necessary tables and RLS policies

### Step 2: Configure Authentication

1. In the Supabase dashboard, go to Authentication → Settings
2. Under Email Auth, ensure "Enable Email Signup" is turned on
3. Configure Site URL to match your deployment URL
4. Set up Email Templates for confirmation and password reset emails

### Step 3: Set Up Storage (Optional)

If you want to allow profile image uploads:

1. Go to Storage in the Supabase dashboard
2. Create a new bucket called `profile-images`
3. Set the bucket's privacy to "Authenticated users only"
4. Create appropriate RLS policies for the bucket

## Database Schema

The system uses the following tables:

1. **profiles** - User profile information and roles
2. **departments** - Hospital departments
3. **doctor_departments** - Junction table for doctors and departments
4. **appointments** - Patient appointments with doctors
5. **medical_records** - Patient medical records
6. **prescriptions** - Patient prescriptions
7. **system_logs** - System activity logs

## Row-Level Security (RLS) Policies

The system implements RLS policies to ensure data security:

- Admins have full access to all tables
- Doctors can only access their own data and their patients' data
- Patients can only access their own data
- Receptionists can manage appointments and view patient/doctor profiles

## JavaScript Integration

The `js/supabase-config.js` file contains all the necessary functions to interact with the Supabase backend:

- User authentication and profile management
- Appointment scheduling and management
- Medical records and prescriptions
- Real-time data subscriptions

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser
3. Register a new account
4. Log in with your credentials

## Development

To modify the system:

1. Edit HTML files for structure
2. Modify CSS in the `css` directory for styling
3. Update JavaScript in the `js` directory for functionality
4. Use the Supabase dashboard to manage your database

## Deployment

To deploy this system:

1. Upload all files to your web server
2. Ensure your Supabase project is properly configured
3. Update the Supabase URL and anon key in `js/supabase-config.js` if needed

## Credits

- [Tailwind CSS](https://tailwindcss.com/)
- [AOS Animation Library](https://michalsnik.github.io/aos/)
- [Supabase](https://supabase.com/)
