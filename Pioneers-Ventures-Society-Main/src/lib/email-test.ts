// Email testing utility for development
import { sendEmail, emailTemplates } from './email';

// Test email sending functionality
export const testEmailSetup = async (): Promise<void> => {
  console.log('🧪 Testing EmailJS setup...');
  
  // Test basic email sending
  const testEmail = {
    to_email: 'test@example.com',
    to_name: 'Test User',
    subject: 'EmailJS Test - Pioneer Ventures Society',
    message: 'This is a test email to verify EmailJS integration is working correctly.',
  };

  try {
    const result = await sendEmail(testEmail);
    if (result) {
      console.log('✅ Email test successful!');
    } else {
      console.log('❌ Email test failed');
    }
  } catch (error) {
    console.error('❌ Email test error:', error);
  }
};

// Test donation email templates
export const testDonationEmails = async (testEmail: string): Promise<void> => {
  console.log('🧪 Testing donation email templates...');

  // Test donation received email
  const donationReceivedTemplate = emailTemplates.donationReceived({
    name: 'John Doe',
    amount: 100,
    reference: 'DON-TEST-123',
    paymentMethod: 'orange_money',
    hasProof: true
  });

  try {
    await sendEmail({
      to_email: testEmail,
      to_name: 'John Doe',
      subject: donationReceivedTemplate.subject,
      message: donationReceivedTemplate.message,
      donation_amount: 100,
      donation_reference: 'DON-TEST-123',
      payment_method: 'Orange Money'
    });
    console.log('✅ Donation received email test sent');
  } catch (error) {
    console.error('❌ Donation received email test failed:', error);
  }

  // Test donation approved email
  const donationApprovedTemplate = emailTemplates.donationApproved({
    name: 'John Doe',
    amount: 100,
    reference: 'DON-TEST-123',
    purpose: 'general'
  });

  try {
    await sendEmail({
      to_email: testEmail,
      to_name: 'John Doe',
      subject: donationApprovedTemplate.subject,
      message: donationApprovedTemplate.message,
      donation_amount: 100,
      donation_reference: 'DON-TEST-123'
    });
    console.log('✅ Donation approved email test sent');
  } catch (error) {
    console.error('❌ Donation approved email test failed:', error);
  }
};

// Check EmailJS configuration
export const checkEmailConfig = (): void => {
  console.log('🔍 Checking EmailJS configuration...');
  
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  console.log('Service ID:', serviceId ? '✅ Set' : '❌ Missing');
  console.log('Template ID:', templateId ? '✅ Set' : '❌ Missing');
  console.log('Public Key:', publicKey ? '✅ Set' : '❌ Missing');

  if (!serviceId || !templateId || !publicKey) {
    console.warn('⚠️ EmailJS not fully configured. Add environment variables to .env file:');
    console.log('VITE_EMAILJS_SERVICE_ID="your-service-id"');
    console.log('VITE_EMAILJS_TEMPLATE_ID="your-template-id"');
    console.log('VITE_EMAILJS_PUBLIC_KEY="your-public-key"');
  } else {
    console.log('✅ EmailJS configuration looks good!');
  }
};

// Development helper - call this in browser console
if (typeof window !== 'undefined') {
  (window as any).testPVSEmails = {
    checkConfig: checkEmailConfig,
    testSetup: testEmailSetup,
    testDonationEmails: testDonationEmails
  };
  
  console.log('📧 Email testing utilities loaded. Use in console:');
  console.log('- testPVSEmails.checkConfig() - Check configuration');
  console.log('- testPVSEmails.testSetup() - Test basic email sending');
  console.log('- testPVSEmails.testDonationEmails("your@email.com") - Test donation templates');
}