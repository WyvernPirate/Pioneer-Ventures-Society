// Email service for donation notifications
// This uses EmailJS for client-side email sending

export interface EmailData {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  donation_amount?: number;
  donation_reference?: string;
  payment_method?: string;
  rejection_reason?: string;
}

// Email templates
export const emailTemplates = {
  donationReceived: (data: {
    name: string;
    amount: number;
    reference: string;
    paymentMethod: string;
    hasProof: boolean;
  }) => ({
    subject: `Donation Received - Reference: ${data.reference}`,
    message: `
Dear ${data.name},

Thank you for your generous donation of P${data.amount} to Pioneer Ventures Society!

Donation Details:
- Amount: P${data.amount}
- Reference: ${data.reference}
- Payment Method: ${data.paymentMethod.replace('_', ' ')}
- Status: ${data.hasProof ? 'Pending Verification' : 'Awaiting Payment'}

${data.hasProof 
  ? 'We have received your proof of payment and will verify it within 24 hours. You will receive another email once the donation is confirmed.'
  : 'Please complete your payment using the instructions provided and upload proof of payment for faster verification.'
}

What happens next:
1. ${data.hasProof ? 'Our team will verify your payment' : 'Complete your payment using the provided instructions'}
2. You'll receive a confirmation email once verified
3. Your donation will be used to support our community initiatives

If you have any questions or need assistance, please contact us at:
- Email: finance@pioneer-ventures-society.org
- Phone: +267 77123456

Thank you for supporting our mission to empower the next generation of innovators and entrepreneurs!

Best regards,
Pioneer Ventures Society Team

---
This is an automated message. Please do not reply to this email.
    `.trim()
  }),

  donationApproved: (data: {
    name: string;
    amount: number;
    reference: string;
    purpose: string;
  }) => ({
    subject: `Donation Approved - Thank You! Reference: ${data.reference}`,
    message: `
Dear ${data.name},

Great news! Your donation has been successfully verified and approved.

Donation Details:
- Amount: P${data.amount}
- Reference: ${data.reference}
- Purpose: ${data.purpose.replace('_', ' ')}
- Status: ✅ Verified and Approved

Your generous contribution will be used to support our ${data.purpose.replace('_', ' ')} initiatives. Thanks to donors like you, we can continue empowering young entrepreneurs and innovators in Botswana.

Impact of Your Donation:
- Supporting student scholarships and educational programs
- Funding community events and workshops
- Providing resources and equipment for members
- Building a stronger entrepreneurial ecosystem

You will receive a formal donation receipt within 2-3 business days for your records.

Thank you once again for your support and belief in our mission!

Best regards,
Pioneer Ventures Society Team

---
Follow us on social media to see the impact of your donation:
- Website: https://pioneer-ventures-society.org
- Email: info@pioneer-ventures-society.org
    `.trim()
  }),

  donationRejected: (data: {
    name: string;
    amount: number;
    reference: string;
    reason: string;
  }) => ({
    subject: `Donation Verification Issue - Reference: ${data.reference}`,
    message: `
Dear ${data.name},

We hope this message finds you well. We're writing regarding your recent donation submission.

Donation Details:
- Amount: P${data.amount}
- Reference: ${data.reference}
- Status: ❌ Verification Required

Unfortunately, we were unable to verify your payment due to the following reason:
${data.reason}

What you can do:
1. Check your payment was successfully sent
2. Ensure the payment amount matches your donation (P${data.amount})
3. Upload a clear screenshot of your payment confirmation
4. Contact us if you need assistance

How to resolve this:
- Visit our donations page and resubmit with clearer proof of payment
- Email us at finance@pioneer-ventures-society.org with your payment details
- Call us at +267 77123456 for immediate assistance

We appreciate your willingness to support Pioneer Ventures Society and want to ensure your donation is processed correctly.

Best regards,
Pioneer Ventures Society Finance Team

---
If you believe this is an error, please contact us immediately at finance@pioneer-ventures-society.org
    `.trim()
  }),

  adminDonationNotification: (data: {
    donorName: string;
    donorEmail: string;
    amount: number;
    reference: string;
    paymentMethod: string;
    purpose: string;
    hasProof: boolean;
  }) => ({
    subject: `🔔 New Donation Submitted - P${data.amount} - ${data.reference}`,
    message: `
New Donation Alert - Action Required

A new donation has been submitted and requires your attention.

Donation Details:
- Donor: ${data.donorName}
- Email: ${data.donorEmail}
- Amount: P${data.amount}
- Reference: ${data.reference}
- Payment Method: ${data.paymentMethod.replace('_', ' ')}
- Purpose: ${data.purpose.replace('_', ' ')}
- Proof of Payment: ${data.hasProof ? '✅ Uploaded (Ready for verification)' : '❌ Not uploaded yet'}

Status: ${data.hasProof ? 'PENDING VERIFICATION' : 'AWAITING PAYMENT'}

${data.hasProof 
  ? '🚨 PRIORITY: This donation includes proof of payment and is ready for verification.'
  : '⏳ This donation is awaiting payment completion by the donor.'
}

Next Steps:
1. Log into the admin panel: https://your-domain.com/admin/donations
2. Review the donation details
3. ${data.hasProof ? 'Verify the proof of payment and approve/reject' : 'Wait for the donor to upload proof of payment'}
4. The donor will be automatically notified of your decision

Quick Actions:
- View all pending donations: Admin Panel > Donations > Pending Verification
- Contact donor if needed: ${data.donorEmail}

This is an automated notification. Please review and process this donation promptly to maintain good donor relations.

---
Pioneer Ventures Society Admin System
Generated: ${new Date().toLocaleString()}
    `.trim()
  })
};

// Send email using EmailJS (you'll need to set up EmailJS service)
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // For now, we'll log the email (in production, integrate with EmailJS or another service)
    console.log('Email would be sent:', emailData);
    
    // TODO: Integrate with EmailJS or another email service
    // Example EmailJS integration:
    /*
    const response = await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      emailData,
      'YOUR_PUBLIC_KEY'
    );
    return response.status === 200;
    */
    
    // For development, simulate successful email sending
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send donation received notification
export const sendDonationReceivedEmail = async (donationData: {
  email: string;
  name: string;
  amount: number;
  reference: string;
  paymentMethod: string;
  hasProof: boolean;
}): Promise<boolean> => {
  const template = emailTemplates.donationReceived(donationData);
  
  return await sendEmail({
    to_email: donationData.email,
    to_name: donationData.name,
    subject: template.subject,
    message: template.message,
    donation_amount: donationData.amount,
    donation_reference: donationData.reference,
    payment_method: donationData.paymentMethod,
  });
};

// Send donation approved notification
export const sendDonationApprovedEmail = async (donationData: {
  email: string;
  name: string;
  amount: number;
  reference: string;
  purpose: string;
}): Promise<boolean> => {
  const template = emailTemplates.donationApproved(donationData);
  
  return await sendEmail({
    to_email: donationData.email,
    to_name: donationData.name,
    subject: template.subject,
    message: template.message,
    donation_amount: donationData.amount,
    donation_reference: donationData.reference,
  });
};

// Send donation rejected notification
export const sendDonationRejectedEmail = async (donationData: {
  email: string;
  name: string;
  amount: number;
  reference: string;
  reason: string;
}): Promise<boolean> => {
  const template = emailTemplates.donationRejected(donationData);
  
  return await sendEmail({
    to_email: donationData.email,
    to_name: donationData.name,
    subject: template.subject,
    message: template.message,
    donation_amount: donationData.amount,
    donation_reference: donationData.reference,
    rejection_reason: donationData.reason,
  });
};

// Send admin notification when new donation is submitted
export const sendAdminDonationNotification = async (donationData: {
  donorName: string;
  donorEmail: string;
  amount: number;
  reference: string;
  paymentMethod: string;
  purpose: string;
  hasProof: boolean;
  adminEmail: string;
}): Promise<boolean> => {
  const template = emailTemplates.adminDonationNotification(donationData);
  
  return await sendEmail({
    to_email: donationData.adminEmail,
    to_name: 'Admin',
    subject: template.subject,
    message: template.message,
    donation_amount: donationData.amount,
    donation_reference: donationData.reference,
    payment_method: donationData.paymentMethod,
  });
};

// Email configuration for EmailJS (to be set up)
export const emailConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
};