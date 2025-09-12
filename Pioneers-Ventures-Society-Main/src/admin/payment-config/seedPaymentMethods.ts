import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const defaultPaymentMethods = [
  {
    name: 'Orange Money',
    description: 'Send money via Orange Money',
    icon: '🟠',
    number: '+267 77123456',
    instructions: [
      'Dial *144*1*1*[amount]*77123456# on your Orange line',
      'Replace [amount] with your donation amount (e.g., *144*1*1*100*77123456#)',
      'Follow the prompts to complete the payment',
      'Take a screenshot of the confirmation message',
      'Upload the screenshot as proof of payment'
    ],
    color: 'bg-orange-500',
    isActive: true,
    order: 1,
  },
  {
    name: 'Mascom MyZaka',
    description: 'Send money via Mascom MyZaka',
    icon: '🔵',
    number: '+267 77123456',
    instructions: [
      'Dial *151*2*1*[amount]*77123456# on your Mascom line',
      'Replace [amount] with your donation amount (e.g., *151*2*1*100*77123456#)',
      'Follow the prompts to complete the payment',
      'Take a screenshot of the confirmation message',
      'Upload the screenshot as proof of payment'
    ],
    color: 'bg-blue-500',
    isActive: true,
    order: 2,
  },
  {
    name: 'FNB Pay2Cell',
    description: 'Send money via FNB Pay2Cell',
    icon: '🏦',
    number: '+267 77123456',
    instructions: [
      'Dial *120*321# on your phone',
      'Select "Pay2Cell"',
      'Enter recipient number: 77123456',
      'Enter your donation amount and follow prompts',
      'Take a screenshot of the confirmation SMS',
      'Upload the screenshot as proof of payment'
    ],
    color: 'bg-green-600',
    isActive: true,
    order: 3,
  },
  {
    name: 'FNB eWallet',
    description: 'Send money via FNB eWallet',
    icon: '💰',
    number: '+267 77123456',
    instructions: [
      'Log into your FNB banking app or dial *120*321#',
      'Select "Send eWallet"',
      'Enter recipient number: 77123456',
      'Enter your donation amount',
      'Complete the transaction',
      'Take a screenshot of the confirmation',
      'Upload the screenshot as proof of payment'
    ],
    color: 'bg-emerald-600',
    isActive: true,
    order: 4,
  },
  {
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: '🏛️',
    number: 'Account: 62123456789',
    instructions: [
      'Bank: First National Bank Botswana',
      'Account Name: Pioneer Ventures Society',
      'Account Number: 62123456789',
      'Branch Code: 282267',
      'Reference: Donation + Your Name',
      'Take a screenshot of the transfer confirmation',
      'Upload the screenshot as proof of payment'
    ],
    color: 'bg-gray-600',
    isActive: true,
    order: 5,
  }
];

export const seedPaymentMethods = async (): Promise<void> => {
  try {
    // Check if payment methods already exist
    const paymentMethodsQuery = query(collection(db, 'paymentMethods'));
    const snapshot = await getDocs(paymentMethodsQuery);
    
    if (snapshot.empty) {
      // Add default payment methods
      for (const method of defaultPaymentMethods) {
        await addDoc(collection(db, 'paymentMethods'), {
          ...method,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      console.log('Default payment methods seeded successfully');
    } else {
      console.log('Payment methods already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding payment methods:', error);
    throw error;
  }
};