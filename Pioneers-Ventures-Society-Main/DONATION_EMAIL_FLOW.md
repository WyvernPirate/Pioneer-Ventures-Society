# 📧 Donation Email Flow Documentation

This document explains the complete email notification system for donations.

## 🔄 **Complete Email Flow**

```
User Submits Donation
         ↓
    [IMMEDIATE]
✅ Confirmation Email Sent to Donor
✅ Admin Notification Sent to Team
         ↓
    Admin Reviews
         ↓
    ┌─────────────┬─────────────┐
    ↓             ↓             ↓
APPROVED      REJECTED      PENDING
    ↓             ↓             ↓
✅ Success    ❌ Rejection   ⏳ Waiting
   Email         Email         
```

## 📨 **Email Types & When They're Sent**

### 1. **🎯 Donation Confirmation** (Immediate)
**Sent:** As soon as user submits donation form
**To:** Donor
**Purpose:** Confirm receipt and provide next steps

**Content Includes:**
- ✅ Donation amount and reference number
- ✅ Payment method selected
- ✅ Payment instructions
- ✅ Status (with/without proof of payment)
- ✅ What happens next
- ✅ Contact information

**Example Subject:** `Donation Received - Reference: DON-ABC123`

### 2. **🚨 Admin Alert** (Immediate)
**Sent:** As soon as user submits donation form
**To:** All configured admin emails
**Purpose:** Alert admin team of new donation

**Content Includes:**
- 🔔 New donation alert with priority indicator
- 👤 Donor details (name, email)
- 💰 Amount and payment method
- 📄 Whether proof of payment was uploaded
- 🎯 Purpose of donation
- 🔗 Direct link to admin panel

**Example Subject:** `🔔 New Donation Submitted - P100 - DON-ABC123`

### 3. **✅ Donation Approved** (When Admin Approves)
**Sent:** When admin clicks "Approve" in admin panel
**To:** Donor
**Purpose:** Celebrate successful donation and show impact

**Content Includes:**
- 🎉 Celebration message
- ✅ Confirmation of approval
- 💡 Impact explanation (how donation will be used)
- 📄 Receipt information
- 🌐 Social media links
- 🙏 Thank you message

**Example Subject:** `Donation Approved - Thank You! Reference: DON-ABC123`

### 4. **❌ Donation Rejected** (When Admin Rejects)
**Sent:** When admin clicks "Reject" and provides reason
**To:** Donor
**Purpose:** Explain issue and provide resolution steps

**Content Includes:**
- 📝 Specific rejection reason (provided by admin)
- 🔍 What went wrong
- ✅ Clear steps to resolve the issue
- 📞 Contact information for help
- 🔄 How to resubmit
- 💬 Supportive tone

**Example Subject:** `Donation Verification Issue - Reference: DON-ABC123`

## 🎯 **Specific Scenarios**

### **Scenario 1: Donation with Proof of Payment**
1. User submits donation + uploads proof → **Confirmation Email**
2. Admin gets notification → **Admin Alert** (marked as priority)
3. Admin reviews proof and approves → **Approval Email**

### **Scenario 2: Donation without Proof**
1. User submits donation (no proof) → **Confirmation Email**
2. Admin gets notification → **Admin Alert** (marked as awaiting payment)
3. User uploads proof later → System updates status
4. Admin reviews and approves → **Approval Email**

### **Scenario 3: Donation Rejected**
1. User submits donation + proof → **Confirmation Email**
2. Admin reviews proof → **Rejection Email** with specific reason
3. User can resubmit with better proof

## 📋 **Common Rejection Reasons**

Admins can provide specific reasons like:
- "Payment amount doesn't match donation amount"
- "Screenshot is unclear or incomplete"
- "Payment confirmation shows different recipient"
- "Transaction appears to be cancelled or failed"
- "Need clearer image of payment confirmation"

## 🔧 **Email Configuration**

### **Admin Emails** (who gets notifications)
```env
VITE_ADMIN_NOTIFICATION_EMAILS="admin@pvs.org,finance@pvs.org"
```

### **Email Templates** (customizable)
- Professional branding with PVS colors
- Clear, friendly tone
- Actionable instructions
- Contact information included

## 🧪 **Testing the Flow**

### **Test Donation Confirmation:**
1. Submit a test donation
2. Check donor email for confirmation
3. Verify admin team receives notification

### **Test Approval Flow:**
1. Go to admin panel → Donations
2. Find pending donation
3. Click "Approve"
4. Check donor receives approval email

### **Test Rejection Flow:**
1. Go to admin panel → Donations
2. Find pending donation
3. Click "Reject" and provide reason
4. Check donor receives rejection email with reason

## 📊 **Email Analytics**

Track these metrics:
- ✅ Confirmation emails sent
- 🚨 Admin notifications delivered
- ✅ Approval emails sent
- ❌ Rejection emails sent
- 📈 Email delivery success rate

## 🔒 **Security & Privacy**

- ✅ No sensitive payment details in emails
- ✅ Reference numbers for tracking
- ✅ Professional sender address
- ✅ Unsubscribe not needed (transactional emails)
- ✅ GDPR compliant (necessary communications)

## 🎨 **Email Design**

All emails feature:
- 🎨 Professional PVS branding
- 📱 Mobile-responsive design
- 🔗 Clear call-to-action buttons
- 📞 Contact information
- 🌐 Website links
- ✨ Consistent styling

The email system ensures donors are always informed about their donation status and admins can efficiently manage the approval process!