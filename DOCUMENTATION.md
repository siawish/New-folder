# Hospital Management System (HMS) Documentation

## Project Overview
This is a full-featured, responsive, and animated Hospital Management System (HMS) website built using HTML, Tailwind CSS, JavaScript, and Supabase as the backend.

## Project Structure
```
├── admin-dashboard-fixed.js    # Main admin dashboard functionality
├── auth/                      # Authentication related files
├── components/                # Reusable UI components
├── css/                      # Stylesheet files
├── email-templates/          # Email notification templates
├── images/                   # Static image assets
├── js/                       # JavaScript source files
├── node_modules/            # Node.js dependencies
├── pages/                   # HTML pages
└── various SQL files        # Database schema and setup files
```

## Dependencies

### Core Dependencies
- **@supabase/supabase-js** (v2.49.8): Backend database and authentication
- **tailwindcss** (v4.1.7): CSS framework for styling

### Development Dependencies
- **lite-server** (v2.6.1): Development server with live reload

## Database Structure
The project uses Supabase as its backend, with multiple schema files:
- `supabase-schema-complete.sql`: Complete database schema
- `supabase-schema-enhanced.sql`: Enhanced version with additional features
- `supabase-schema-simple.sql`: Simplified version for basic setup
- `supabase-updated-schema.sql`: Latest schema updates

## Key Components

### Authentication System
Located in the `auth/` directory, handling:
- User registration
- Login/logout functionality
- Password reset
- Session management

### Admin Dashboard
The `admin-dashboard-fixed.js` file contains the main administrative functionality:
- User management
- System configuration
- Analytics and reporting
- Access control

### Email System
Located in `email-templates/` directory:
- Notification templates
- Email configuration in `supabase-email-config.json`
- Setup guide in `supabase-email-setup.md`

### Frontend Components
Located in `components/` directory:
- Reusable UI elements
- Form components
- Navigation elements
- Modal dialogs

## Setup and Configuration

### Initial Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Supabase:
   - Use `supabase-setup.sql` for initial database setup
   - Follow `supabase-integration-guide.md` for detailed integration steps

3. Start development server:
   ```bash
   npm start
   ```

### Email Configuration
1. Configure email settings in `supabase-email-config.json`
2. Follow setup instructions in `supabase-email-setup.md`

## Development Guidelines

### Code Structure
- Keep JavaScript files modular and well-organized
- Use components for reusable UI elements
- Follow the established directory structure

### Database Management
- Use the provided SQL files for schema updates
- Follow the migration guide in `supabase-migration-guide.md`
- Test all database changes in a development environment first

### Styling
- Use Tailwind CSS for styling
- Maintain consistent design patterns
- Follow responsive design principles

## Security Considerations
- All sensitive data is stored in Supabase
- Authentication is handled through Supabase Auth
- API keys and sensitive configurations are stored securely

## Deployment
The project includes a `web.config` file for IIS deployment configuration.

## Additional Resources
- `README.md`: Basic project information and setup instructions
- `supabase-integration-guide.md`: Detailed Supabase integration guide
- `supabase-migration-guide.md`: Database migration instructions

## Support and Maintenance
For any issues or questions:
1. Check the documentation files
2. Review the SQL schema files for database-related questions
3. Consult the integration guides for setup issues

## Detailed Functionality

### Admin Dashboard (`admin-dashboard-fixed.js`)

#### Core Features
1. **Authentication & Access Control**
   - Admin role verification
   - Session management
   - Default admin fallback
   - Secure redirects for unauthorized access

2. **Dashboard Statistics**
   - Patient count
   - Doctor count
   - Appointment statistics
   - Room availability
   - Revenue tracking
   - Real-time data updates

3. **Patient Management**
   - Patient registration
   - Medical records
   - Appointment scheduling
   - Billing information
   - Age distribution analytics

4. **Doctor Management**
   - Doctor profiles
   - Schedule management
   - Department assignments
   - Availability tracking

5. **Appointment System**
   - Calendar integration
   - Schedule visualization
   - Appointment status tracking
   - Conflict detection

6. **Billing System**
   - Invoice generation
   - Payment tracking
   - Revenue analytics
   - Financial reporting

7. **Department Management**
   - Department creation
   - Staff assignment
   - Resource allocation
   - Performance metrics

#### Data Flow

1. **Authentication Flow**
   ```mermaid
   graph TD
   A[User Login] --> B{Check Default Admin}
   B -->|Yes| C[Set Default Profile]
   B -->|No| D[Check Supabase Auth]
   D --> E{Valid User?}
   E -->|Yes| F[Check Admin Role]
   E -->|No| G[Redirect to Login]
   F -->|Admin| H[Load Dashboard]
   F -->|Not Admin| I[Redirect to Home]
   ```

2. **Dashboard Data Flow**
   ```mermaid
   graph TD
   A[Load Dashboard] --> B[Fetch Statistics]
   B --> C[Update UI]
   A --> D[Initialize Charts]
   D --> E[Load Patient Data]
   D --> F[Load Revenue Data]
   E --> G[Update Patient Charts]
   F --> H[Update Revenue Charts]
   ```

#### Key Functions

1. **Authentication**
   - `checkAdminAccess()`: Verifies admin privileges
   - `updateAdminInfo()`: Updates UI with admin details

2. **Data Management**
   - `fetchDashboardStats()`: Retrieves dashboard statistics
   - `fetchPatientData()`: Loads patient information
   - `fetchDoctorSchedules()`: Manages doctor schedules
   - `fetchRevenueData()`: Handles financial data

3. **UI Management**
   - `handleNavigation()`: Manages section navigation
   - `initDashboard()`: Initializes dashboard components
   - `setupMobileMenu()`: Handles responsive design

4. **Chart Management**
   - `initPatientOverviewChart()`: Creates patient statistics visualization
   - `initRevenueChart()`: Displays financial data
   - `updatePatientOverviewChart()`: Updates patient statistics

5. **Calendar System**
   - `initCalendar()`: Sets up appointment calendar
   - `renderCalendar()`: Displays appointment schedule
   - `showDaySchedule()`: Shows daily appointments

#### Data Dependencies

1. **Supabase Tables**
   - `profiles`: User and admin information
   - `appointments`: Appointment scheduling
   - `patients`: Patient records
   - `doctors`: Doctor information
   - `departments`: Department management
   - `medical_records`: Patient medical history
   - `billing`: Financial transactions

2. **External Dependencies**
   - Chart.js: Data visualization
   - FullCalendar: Appointment scheduling
   - Tailwind CSS: UI styling 

## Database Schema

### Core Tables

1. **Profiles (`public.profiles`)**
   - Primary user information table
   - Extends Supabase auth.users
   - Fields:
     - `id`: UUID (Primary Key)
     - `first_name`, `last_name`: User names
     - `email`: Unique email address
     - `phone`, `address`, `city`, `state`, `zip`, `country`: Contact info
     - `date_of_birth`, `gender`: Personal details
     - `profile_image_url`: Profile picture
     - `role`: User role (admin/doctor/patient)
     - `is_active`: Account status
     - `created_at`, `updated_at`: Timestamps

2. **Departments (`public.departments`)**
   - Hospital department management
   - Fields:
     - `id`: UUID (Primary Key)
     - `name`: Department name (Unique)
     - `description`: Department details
     - `location`: Physical location
     - `head_doctor_id`: Department head
     - `is_active`: Department status
     - `created_at`, `updated_at`: Timestamps

3. **Doctors (`public.doctors`)**
   - Doctor-specific information
   - Fields:
     - `id`: UUID (Primary Key)
     - `specialty`: Medical specialty
     - `license_number`: Medical license
     - `education`: Educational background
     - `experience_years`: Years of experience
     - `consultation_fee`: Fee per consultation
     - `available_days`: Working days
     - `start_time`, `end_time`: Working hours

4. **Patients (`public.patients`)**
   - Patient-specific information
   - Fields:
     - `id`: UUID (Primary Key)
     - `blood_group`: Blood type
     - `height`, `weight`: Physical measurements
     - `allergies`: Known allergies
     - `medical_history`: Past medical records
     - `emergency_contact_name`, `emergency_contact_phone`: Emergency contacts
     - `insurance_provider`, `insurance_policy_number`: Insurance details

5. **Appointments (`public.appointments`)**
   - Appointment scheduling
   - Fields:
     - `id`: UUID (Primary Key)
     - `patient_id`, `doctor_id`: References
     - `appointment_date`, `appointment_time`: Schedule
     - `status`: Appointment status
     - `notes`: Additional information
     - `created_at`, `updated_at`: Timestamps

6. **Medical Records (`public.medical_records`)**
   - Patient medical history
   - Fields:
     - `id`: UUID (Primary Key)
     - `patient_id`, `doctor_id`: References
     - `diagnosis`: Medical diagnosis
     - `treatment`: Treatment provided
     - `notes`: Additional notes
     - `created_at`, `updated_at`: Timestamps

7. **Prescriptions (`public.prescriptions`)**
   - Medication prescriptions
   - Fields:
     - `id`: UUID (Primary Key)
     - `patient_id`, `doctor_id`: References
     - `prescription_date`: Date prescribed
     - `status`: Prescription status
     - `notes`: Additional instructions

8. **Billing (`public.invoices`, `public.invoice_items`, `public.payments`)**
   - Financial management
   - Fields:
     - `id`: UUID (Primary Key)
     - `patient_id`: Patient reference
     - `invoice_date`: Date of invoice
     - `total_amount`: Total cost
     - `status`: Payment status
     - `payment_method`: Method of payment
     - `created_at`, `updated_at`: Timestamps

### Security and Access Control

1. **Row Level Security (RLS)**
   - Implemented on all tables
   - Role-based access control
   - User-specific data access

2. **Access Policies**
   - Admin: Full access to all data
   - Doctors: Access to their patients' data
   - Patients: Access to their own data
   - Receptionists: Limited access to scheduling

### Database Indexes

1. **Performance Optimization**
   - Indexed fields for faster queries:
     - `profiles`: role, email
     - `departments`: name, head_doctor_id
     - `doctors`: specialty
     - `patients`: insurance_provider
     - `appointments`: patient_id, doctor_id, status
     - `medical_records`: patient_id, doctor_id
     - `prescriptions`: patient_id, doctor_id, status
     - `invoices`: patient_id, status

2. **Audit System**
   - Automatic logging of changes
   - Tracked tables:
     - Medical records
     - Prescriptions
     - Invoices
     - Payments

### Data Relationships

1. **One-to-Many**
   - Doctor to Appointments
   - Patient to Medical Records
   - Department to Doctors

2. **Many-to-Many**
   - Doctors to Departments (via doctor_departments)
   - Patients to Doctors (via appointments)

3. **One-to-One**
   - Profile to Doctor/Patient
   - Invoice to Payment 

## Authentication System

### Components

1. **Login System (`auth/login.html`)**
   - User authentication interface
   - Features:
     - Email/password login
     - Remember me functionality
     - Password reset option
     - Role-based redirection
     - Session management

2. **Registration System (`auth/register.html`)**
   - New user registration
   - Features:
     - User information collection
     - Role selection
     - Email verification
     - Profile creation
     - Initial setup

### Security Implementation

1. **Authentication Flow**
   ```mermaid
   graph TD
   A[User Access] --> B{Has Session?}
   B -->|Yes| C[Validate Session]
   B -->|No| D[Show Login]
   C -->|Valid| E[Load Dashboard]
   C -->|Invalid| D
   D --> F[User Login]
   F --> G{Valid Credentials?}
   G -->|Yes| H[Create Session]
   G -->|No| I[Show Error]
   H --> E
   ```

2. **Session Management**
   - JWT-based authentication
   - Secure session storage
   - Automatic session refresh
   - Session timeout handling

3. **Access Control**
   - Role-based permissions:
     - Admin: Full system access
     - Doctor: Patient and appointment management
     - Patient: Personal data and appointments
     - Receptionist: Scheduling and basic info

4. **Security Features**
   - Password hashing
   - CSRF protection
   - Rate limiting
   - Secure cookie handling
   - HTTPS enforcement

### Integration with Supabase

1. **Authentication Methods**
   - Email/password
   - Social login (if configured)
   - Magic link authentication

2. **User Management**
   - Profile creation
   - Role assignment
   - Account status management
   - Password reset flow

3. **Security Policies**
   - Row Level Security (RLS)
   - Data access restrictions
   - Audit logging
   - Session tracking

### Error Handling

1. **Authentication Errors**
   - Invalid credentials
   - Account locked
   - Session expired
   - Permission denied

2. **User Feedback**
   - Clear error messages
   - Recovery options
   - Support contact
   - Status indicators

### Best Practices

1. **Security**
   - Regular password updates
   - Strong password requirements
   - Multi-factor authentication (if enabled)
   - Secure session management

2. **User Experience**
   - Intuitive login flow
   - Clear error messages
   - Easy password recovery
   - Session persistence options

3. **Maintenance**
   - Regular security audits
   - Session cleanup
   - Access log monitoring
   - Policy updates 