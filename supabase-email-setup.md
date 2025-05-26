# Supabase Email Confirmation Setup Guide

## 1. Check Email Provider Configuration

First, ensure your Supabase project has a properly configured email provider:

1. Log in to your Supabase dashboard
2. Go to **Authentication** → **Email Templates**
3. Check if there's a warning about email provider configuration
4. If needed, set up an email provider:
   - Click on **Project Settings** → **Auth**
   - Scroll to **Email Auth**
   - Configure an SMTP server or use a service like SendGrid, Mailgun, etc.

## 2. Configure Email Templates in Supabase Dashboard

1. Go to **Authentication** → **Email Templates**
2. Select the **Confirmation** template
3. Update the template with your custom HTML from `confirmation.html`
4. Make sure to keep the `{{ .ConfirmationURL }}` placeholder in your template
5. Save the changes

## 3. Update Auth Settings

1. Go to **Project Settings** → **Auth**
2. Under **URL Configuration**:
   - Set **Site URL** to your application's URL (e.g., `http://localhost:3000`)
   - Set **Redirect URLs** to include your login page (e.g., `http://localhost:3000/auth/login.html`)
3. Under **Email Auth**:
   - Enable **Confirm email**
   - Set **Confirm email template** to your custom template

## 4. Test Email Confirmation

1. Register a new user in your application
2. Check the email inbox for the confirmation email
3. If you don't receive an email, check Supabase logs:
   - Go to **Database** → **Logs**
   - Look for any errors related to email sending

## 5. Debugging Tips

If emails still aren't being sent:

1. **Check SMTP Settings**: Verify your SMTP credentials are correct
2. **Test with a Simple Template**: Try using Supabase's default template to see if it works
3. **Check Email Logs**: Some email providers have logs that show delivery attempts
4. **Verify Email Format**: Ensure your HTML is valid and doesn't contain syntax errors
5. **Check Spam Folder**: Sometimes verification emails end up in spam

## 6. Alternative Approach: Email Testing Service

For development, you can use a service like Mailhog or Mailtrap to catch and view emails without actually sending them:

1. Set up Mailhog or Mailtrap
2. Configure your Supabase SMTP settings to use these services
3. View the captured emails in their web interface
