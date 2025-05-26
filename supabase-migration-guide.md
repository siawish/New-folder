# Hospital Management System - Supabase Migration Guide

This guide will help you implement the new database schema for your Hospital Management System.

## Prerequisites

1. Access to your Supabase project dashboard
2. Admin privileges to run SQL queries

## Step 1: Run the Schema Script

1. Log in to your Supabase dashboard at [https://app.supabase.com/](https://app.supabase.com/)
2. Navigate to the SQL Editor
3. Copy the entire contents of `supabase-schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the script

The script is designed to be idempotent (safe to run multiple times) with:
- `IF NOT EXISTS` for table creation
- `IF NOT EXISTS` for policy creation
- Safe column addition checks

## Step 2: Update Your JavaScript Code

Update your JavaScript code to work with the new schema:

1. The `admin-dashboard.js` file has already been updated to handle missing tables gracefully
2. For new tables, you'll need to update your queries to use the dedicated tables:
   - Use `doctors` table instead of filtering `profiles` by role
   - Use `patients` table for patient-specific data
   - Use `medical_records` for patient history

## Step 3: Create Test Data (Optional)

To populate your database with test data:

1. Uncomment the sample data section at the end of the SQL script
2. Run only that portion of the script

## Data Migration

If you have existing data in your `profiles` table that needs to be migrated:

```sql
-- Migrate doctor data
INSERT INTO public.doctors (id, specialty)
SELECT id, specialty
FROM public.profiles
WHERE role = 'doctor'
ON CONFLICT (id) DO NOTHING;

-- Migrate patient data
INSERT INTO public.patients (id)
SELECT id
FROM public.profiles
WHERE role = 'patient'
ON CONFLICT (id) DO NOTHING;
```

## Security Considerations

The schema includes Row Level Security (RLS) policies that:

1. Protect patient privacy
2. Allow doctors to access only their patients' data
3. Give admin users full access
4. Restrict receptionist access to appropriate areas

## Troubleshooting

If you encounter errors:

1. **Policy already exists**: This is handled by the updated script with `IF NOT EXISTS`
2. **Table already exists**: Also handled by `IF NOT EXISTS`
3. **Foreign key constraints**: Ensure referenced records exist before inserting

## Next Steps

After implementing the schema:

1. Update your UI to work with the new data structure
2. Test all CRUD operations
3. Verify security policies are working as expected
