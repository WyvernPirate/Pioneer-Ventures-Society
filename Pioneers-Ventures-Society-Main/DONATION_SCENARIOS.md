# 🎯 Donation Email Scenarios - Complete Guide

This document shows exactly what happens in each donation scenario with real examples.

## ✅ **Scenario 1: Donation Confirmation (Immediate)**

### **When:** User submits donation form
### **Who gets email:** Donor
### **Email sent:** Immediately after form submission

**Example Email:**
```
Subject: Donation Received - Reference: DON-1234567

Dear John Doe,

Thank you for your generous donation of P100 to Pioneer Ventures Society!

Donation Details:
- Amount: P100
- Reference: DON-1234567
- Payment Method: Orange Money
- Status: Pending Verification

We have received your proof of payment and will verify it within 24 hours. 
You will receive another email once the donation is confirmed.

What happens next:
1. Our team will verify your payment
2. You'll receive a confirmation email once verified
3. Your donation will be used to support our community initiatives

If you have any questions or need assistance, please contact us at:
- Email: finance@pioneer-ventures-society.org
- Phone: +267 77123456

Thank you for supporting our mission!

Best regards,
Pioneer Ventures Society Team
```

## 🚨 **Scenario 2: Admin Notification (Immediate)**

### **When:** User submits donation form
### **Who gets email:** All admin emails
### **Email sent:** Immediately after form submission

**Example Email:**
```
Subject: 🔔 New Donation Submitted - P100 - DON-1234567

New Donation Alert - Action Required

A new donation has been submitted and requires your attention.

Donation Details:
- Donor: John Doe
- Email: john@example.com
- Amount: P100
- Reference: DON-1234567
- Payment Method: Orange Money
- Purpose: General Support
- Proof of Payment: ✅ Uploaded (Ready for verification)

Status: PENDING VERIFICATION

🚨 PRIORITY: This donation includes proof of payment and is ready for verification.

Next Steps:
1. Log into the admin panel
2. Review the donation details
3. Verify the proof of payment and approve/reject
4. The donor will be automatically notified of your decision

This is an automated notification. Please review and process this donation promptly.
```

## ❌ **Scenario 3: Donation Rejection (When Admin Rejects)**

### **When:** Admin clicks "Reject" and provides reason
### **Who gets email:** Donor
### **Email sent:** Immediately after admin rejection

**Admin Process:**
1. Admin goes to donations page
2. Clicks "Reject" button on a donation
3. **Rejection Dialog Opens:**
   ```
   ┌─────────────────────────────────┐
   │ Reject Donation                 │
   ├─────────────────────────────────┤
   │ Reason for rejection:           │
   │ ┌─────────────────────────────┐ │
   │ │ Payment amount doesn't      │ │
   │ │ match donation amount.      │ │
   │ │ Screenshot shows P50 but    │ │
   │ │ donation is for P100.       │ │
   │ └─────────────────────────────┘ │
   │                                 │
   │    [Cancel]  [Reject Donation]  │
   └─────────────────────────────────┘
   ```
4. Admin types specific reason
5. Clicks "Reject Donation"
6. **Email automatically sent to donor**

**Example Rejection Email:**
```
Subject: Donation Verification Issue - Reference: DON-1234567

Dear John Doe,

We hope this message finds you well. We're writing regarding your recent donation submission.

Donation Details:
- Amount: P100
- Reference: DON-1234567
- Status: ❌ Verification Required

Unfortunately, we were unable to verify your payment due to the following reason:
Payment amount doesn't match donation amount. Screenshot shows P50 but donation is for P100.

What you can do:
1. Check your payment was successfully sent
2. Ensure the payment amount matches your donation (P100)
3. Upload a clear screenshot of your payment confirmation
4. Contact us if you need assistance

How to resolve this:
- Visit our donations page and resubmit with clearer proof of payment
- Email us at finance@pioneer-ventures-society.org with your payment details
- Call us at +267 77123456 for immediate assistance

We appreciate your willingness to support Pioneer Ventures Society and want to ensure your donation is processed correctly.

Best regards,
Pioneer Ventures Society Finance Team
```

## ✅ **Scenario 4: Donation Approval (When Admin Approves)**

### **When:** Admin clicks "Approve" 
### **Who gets email:** Donor
### **Email sent:** Immediately after admin approval

**Example Approval Email:**
```
Subject: Donation Approved - Thank You! Reference: DON-1234567

Dear John Doe,

Great news! Your donation has been successfully verified and approved.

Donation Details:
- Amount: P100
- Reference: DON-1234567
- Purpose: General Support
- Status: ✅ Verified and Approved

Your generous contribution will be used to support our general support initiatives. 
Thanks to donors like you, we can continue empowering young entrepreneurs and innovators in Botswana.

Impact of Your Donation:
- Supporting student scholarships and educational programs
- Funding community events and workshops
- Providing resources and equipment for members
- Building a stronger entrepreneurial ecosystem

You will receive a formal donation receipt within 2-3 business days for your records.

Thank you once again for your support and belief in our mission!

Best regards,
Pioneer Ventures Society Team
```

## 🔄 **Complete Flow Summary**

```
1. USER SUBMITS DONATION
   ↓
   ✅ Donor gets: "Donation Received" email
   ✅ Admin gets: "New Donation Alert" email
   
2. ADMIN REVIEWS DONATION
   ↓
   ┌─────────────┬─────────────┐
   ↓             ↓             
APPROVE        REJECT         
   ↓             ↓             
   ✅ Donor gets: ❌ Donor gets:
   "Approved"     "Rejected" 
   email          email with
                  specific reason
```

## 🎯 **Common Rejection Reasons**

Admins typically reject donations for:
- "Payment amount doesn't match donation amount"
- "Screenshot is unclear or incomplete"
- "Payment shows different recipient number"
- "Transaction appears cancelled or failed"
- "Need clearer image of payment confirmation"
- "Payment date doesn't match submission date"

## 🧪 **How to Test**

### **Test Confirmation:**
1. Go to donations page
2. Fill out form and submit
3. Check email for confirmation

### **Test Admin Notification:**
1. Submit donation
2. Check admin email for alert
3. Verify all details are included

### **Test Rejection:**
1. Go to admin panel
2. Find pending donation
3. Click "Reject" → Enter reason → Confirm
4. Check donor email for rejection notice

### **Test Approval:**
1. Go to admin panel  
2. Find pending donation
3. Click "Approve"
4. Check donor email for approval celebration

The system ensures **complete communication** throughout the entire donation process! 🎉