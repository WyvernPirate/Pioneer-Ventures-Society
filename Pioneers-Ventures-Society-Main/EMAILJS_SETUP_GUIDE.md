# 📧 EmailJS Setup Guide for Pioneer Ventures Society

Follow this step-by-step guide to set up email notifications for your donation system.

## 🚀 Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click **"Sign Up"** 
3. Create account with your email
4. Verify your email address
5. Log into your dashboard

## 📧 Step 2: Add Email Service

1. In EmailJS dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"** (recommended for easy setup)
4. Click **"Connect Account"**
5. Sign in with your Gmail account (use your organization email if available)
6. Give it a Service ID: `gmail_service` or `pvs_gmail`
7. Click **"Create Service"**
8. **Copy the Service ID** - you'll need this later

## 📝 Step 3: Create Email Template

1. Go to **"Email Templates"** in your EmailJS dashboard
2. Click **"Create New Template"**
3. Give it a name: `PVS_Donation_Template`
4. **Copy the entire content** from `EMAILJS_TEMPLATE.html` file in this project
5. Paste it into the EmailJS template editor
6. Click **"Save"**
7. **Copy the Template ID** - you'll need this later

## 🔑 Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"** in EmailJS dashboard
2. Find **"Public Key"** section
3. **Copy your Public Key** - you'll need this later

## ⚙️ Step 5: Configure Environment Variables

1. Open your `.env` file (create one if it doesn't exist)
2. Add these lines with your actual values:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID="your-service-id-here"
VITE_EMAILJS_TEMPLATE_ID="your-template-id-here"  
VITE_EMAILJS_PUBLIC_KEY="your-public-key-here"
```

**Example:**
```env
VITE_EMAILJS_SERVICE_ID="gmail_service"
VITE_EMAILJS_TEMPLATE_ID="template_abc123"
VITE_EMAILJS_PUBLIC_KEY="user_xyz789"
```

## 🧪 Step 6: Test the Setup

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to test:**
   ```bash
   firebase deploy
   ```

3. **Test donation flow:**
   - Go to your live site
   - Submit a test donation
   - Check if emails are received

## 📋 Step 7: Verify Email Template Variables

Make sure your EmailJS template includes these variables:
- `{{to_name}}` - Recipient name
- `{{to_email}}` - Recipient email  
- `{{subject}}` - Email subject
- `{{message}}` - Email body content
- `{{donation_amount}}` - Donation amount (optional)
- `{{donation_reference}}` - Reference number (optional)
- `{{payment_method}}` - Payment method (optional)
- `{{current_date}}` - Current date/time

## 🎯 Step 8: Email Types That Will Be Sent

Your system will now send these emails automatically:

### 1. **Donation Received** (to donor)
- Sent immediately when donation is submitted
- Confirms receipt and provides next steps

### 2. **Admin Notification** (to admin team)  
- Sent to all configured admin emails
- Alerts about new donations needing attention

### 3. **Donation Approved** (to donor)
- Sent when admin approves donation
- Celebration message with impact information

### 4. **Donation Rejected** (to donor)
- Sent when admin rejects donation
- Includes specific reason and resolution steps

## 🔧 Troubleshooting

### **Emails Not Sending?**
1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Ensure EmailJS service is active
4. Check spam/junk folders

### **Template Not Rendering?**
1. Verify template ID is correct
2. Check all variables are properly formatted: `{{variable_name}}`
3. Test template in EmailJS dashboard

### **Gmail Issues?**
1. Make sure Gmail account is verified
2. Check if 2FA is enabled (may need app password)
3. Verify Gmail service is connected in EmailJS

## 📊 Usage Limits

**EmailJS Free Plan:**
- 200 emails/month
- Perfect for testing and small organizations

**Paid Plans:**
- More emails per month
- Better support
- Custom branding options

## 🔒 Security Notes

- Never commit your actual API keys to Git
- Use environment variables for all sensitive data
- Consider using organization email for professional appearance
- Regularly monitor email usage in EmailJS dashboard

## ✅ Final Checklist

- [ ] EmailJS account created
- [ ] Gmail service connected
- [ ] Email template created with proper variables
- [ ] Environment variables configured
- [ ] Project built and deployed
- [ ] Test donation submitted
- [ ] Emails received successfully
- [ ] Admin notifications working
- [ ] All email types tested

## 🎉 You're Done!

Your donation system now has professional email notifications! 

**Test URLs:**
- Main site: https://pioneer-ventures-society.web.app
- Admin panel: https://pioneer-ventures-society-admin.web.app

**Need Help?**
- EmailJS Documentation: https://www.emailjs.com/docs/
- Check browser console for error messages
- Test individual components in EmailJS dashboard