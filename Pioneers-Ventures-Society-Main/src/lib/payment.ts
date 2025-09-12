// Payment integration for Botswana-based donations
// Manual payment verification system

export interface DonationData {
  amount: number;
  email: string;
  name: string;
  phone?: string;
  description: string;
  reference: string;
  donationType: 'one-time' | 'monthly';
  purpose: string;
  paymentMethod: string;
  proofOfPayment?: string; // Base64 image or file URL
}

import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';
import type { PaymentConfig } from '@/types/payment-config';

// Default payment methods (fallback if database is empty)
const defaultPaymentMethods = [
  {
    id: 'orange_money',
    name: 'Orange Money',
    description: 'Send money via Orange Money',
    icon: '🟠',
    number: '+267 77123456',
    instructions: [
      'Dial *144*1*1*[amount]*77123456# on your Orange line',
      'Replace [amount] with your donation amount (e.g., *144*1*1*100*77123456#)',
      'Follow the prompts to complete the payment',
      'Take a screenshot of the confirmation message',
      'Upload the screenshot as proof of payment below'
    ],
    color: 'bg-orange-500',
    isActive: true,
    order: 1,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mascom_myzaka',
    name: 'Mascom MyZaka',
    description: 'Send money via Mascom MyZaka',
    icon: '🔵',
    number: '+267 77123456',
    instructions: [
      'Dial *151*2*1*[amount]*77123456# on your Mascom line',
      'Replace [amount] with your donation amount (e.g., *151*2*1*100*77123456#)',
      'Follow the prompts to complete the payment',
      'Take a screenshot of the confirmation message',
      'Upload the screenshot as proof of payment below'
    ],
    color: 'bg-blue-500',
    isActive: true,
    order: 2,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fnb_pay2cell',
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
      'Upload the screenshot as proof of payment below'
    ],
    color: 'bg-green-600',
    isActive: true,
    order: 3,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fnb_ewallet',
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
      'Upload the screenshot as proof of payment below'
    ],
    color: 'bg-emerald-600',
    isActive: true,
    order: 4,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bank_transfer',
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
      'Upload the screenshot as proof of payment below'
    ],
    color: 'bg-gray-600',
    isActive: true,
    order: 5,
    updatedAt: new Date().toISOString()
  }
];

// Fetch payment methods from Firebase
export const getPaymentMethods = async (): Promise<PaymentConfig[]> => {
  try {
    const paymentMethodsQuery = query(
      collection(db, 'paymentMethods'),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(paymentMethodsQuery);
    const paymentMethods = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PaymentConfig[];

    // Return fetched methods or fallback to defaults
    return paymentMethods.length > 0 ? paymentMethods : defaultPaymentMethods;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return defaultPaymentMethods;
  }
};

// Get all payment methods (including inactive ones) for admin
export const getAllPaymentMethods = async (): Promise<PaymentConfig[]> => {
  try {
    const paymentMethodsQuery = query(
      collection(db, 'paymentMethods'),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(paymentMethodsQuery);
    const paymentMethods = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PaymentConfig[];

    return paymentMethods.length > 0 ? paymentMethods : defaultPaymentMethods;
  } catch (error) {
    console.error('Error fetching all payment methods:', error);
    return defaultPaymentMethods;
  }
};

// Generate unique payment reference
export const generatePaymentReference = (prefix: string = 'PVS'): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

// Convert file to base64 for storage
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Validate image file
export const validateProofImage = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, or WebP)' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }

  return { valid: true };
};

// Get organization contact details
export const getOrganizationContacts = () => ({
  email: 'finance@pioneer-ventures-society.org',
  phone: '+267 77123456',
  whatsapp: '+267 77123456',
  address: 'Gaborone, Botswana'
});