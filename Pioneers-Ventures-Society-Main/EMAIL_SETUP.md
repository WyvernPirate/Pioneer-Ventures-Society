# Email Notification Setup Guide

This guide explains how to set up email notifications for the donation system.

## Overview

The donation system sends four types of emails:
1. **Donation Received** - Sent to donor when a donation is submitted
2. **Admin Notification** - Sent to admin(s) when a new donation is submitted
3. **Donation Approved** - Sent to donor when admin approves a donation
4. **Donation Rejected** - Sent to donor when admin rejects a donation with reason

## Current Implementation

The email service is currently set up to log emails to the console for development. To enable actual email sending, you need to integrate with an email service.

## Recommended: EmailJS Integration

EmailJS is a client-side email service that's easy to set up and free for moderate usage.

### Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Create a new email service (Gmail, Outlook, etc.)

### Step 2: Create Email Template

Create a template with these variables:
- `{{to_name}}` - Recipient name
- `{{to_email}}` - Recipient email
- `{{subject}}` - Email subject
- `{{message}}` - Email body
- `{{donation_amount}}` - Donation amount
- `{{donation_reference}}` - Donation reference
- `{{payment_method}}` - Payment method
- `{{rejection_reason}}` - Rejection reason (for rejected emails)

### Step 3: Get Configuration Values

From your EmailJS dashboard, get:
- Service ID
- Template ID  
- Public Key

### Step 4: Update Environment Variables

Add to your `.env` file:
```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID="your-service-id"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="your-template-id"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your-public-key"

# Admin Email Configuration
VITE_ADMIN_NOTIFICATION_EMAILS="admin@your-org.com,finance@your-org.com"
VITE_PRIMARY_ADMIN_EMAIL="admin@your-org.com"
VITE_FINANCE_EMAIL="finance@your-org.com"
```

### Step 5: Install EmailJS

```bash
npm install @emailjs/browser
```

### Step 6: Update Email Service

Replace the mock implementation in `src/lib/email.ts`:

```typescript
import emailjs from '@emailjs/browser';
import { emailConfig } from './email';

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      emailData,
      emailConfig.publicKey
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
```

## Alternative: Server-Side Email

For production applications, consider server-side email services:

### Option 1: Nodemailer + SMTP
- Use your organization's SMTP server
- More reliable for high volume

### Option 2: SendGrid
- Professional email service
- Better deliverability
- Requires API key

### Option 3: AWS SES
- Amazon's email service
- Cost-effective for high volume
- Requires AWS account

## Email Templates

The system includes pre-built email templates for:

1. **Donation Received Email**
   - Confirms donation submission
   - Provides payment instructions
   - Includes reference number

2. **Donation Approved Email**
   - Confirms successful verification
   - Thanks the donor
   - Explains impact

3. **Donation Rejected Email**
   - Explains verification issue
   - Provides clear next steps
   - Includes contact information

4. **Admin Notification Email**
   - Alerts admin of new donation
   - Includes all donation details
   - Indicates if proof of payment is uploaded
   - Provides direct links to admin panel

## Testing

To test email functionality:

1. Submit a test donation
2. Check console logs for email content
3. Verify email templates render correctly
4. Test approval/rejection flows in admin panel

## Security Notes

- Never expose private keys in client-side code
- Use environment variables for all configuration
- Consider rate limiting for email sending
- Validate email addresses before sending

## Troubleshooting

**Emails not sending:**
- Check environment variables are set
- Verify EmailJS service is active
- Check browser console for errors

**Template issues:**
- Ensure all variables are properly mapped
- Test template in EmailJS dashboard
- Check for typos in variable names

**Delivery issues:**
- Check spam folders
- Verify sender email is configured
- Consider using organization domain