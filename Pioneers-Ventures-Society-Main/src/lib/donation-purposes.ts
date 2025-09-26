// Donation purposes management service
import { collection, getDocs, query, orderBy, where, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { DonationPurpose, DonationPurposeFormData } from '@/types/donation-purposes';

// Default donation purposes (fallback if database is empty)
const defaultDonationPurposes: Omit<DonationPurpose, 'id'>[] = [
  {
    value: 'general',
    label: 'General Support',
    description: 'Support overall PVS operations and programs',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    value: 'events',
    label: 'Events & Workshops',
    description: 'Fund community events and educational workshops',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    value: 'scholarships',
    label: 'Student Scholarships',
    description: 'Support student members with financial assistance',
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    value: 'equipment',
    label: 'Equipment & Resources',
    description: 'Purchase tools and resources for members',
    isActive: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Specify your preferred use in the message',
    isActive: true,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Fetch active donation purposes for public use
export const getDonationPurposes = async (): Promise<DonationPurpose[]> => {
  try {
    const purposesQuery = query(
      collection(db, 'donationPurposes'),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(purposesQuery);
    const purposes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DonationPurpose[];

    // Return fetched purposes or fallback to defaults
    return purposes.length > 0 ? purposes : defaultDonationPurposes.map((purpose, index) => ({
      id: `default_${index}`,
      ...purpose
    }));
  } catch (error) {
    console.error('Error fetching donation purposes:', error);
    return defaultDonationPurposes.map((purpose, index) => ({
      id: `default_${index}`,
      ...purpose
    }));
  }
};

// Get all donation purposes (including inactive ones) for admin
export const getAllDonationPurposes = async (): Promise<DonationPurpose[]> => {
  try {
    const purposesQuery = query(
      collection(db, 'donationPurposes'),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(purposesQuery);
    const purposes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DonationPurpose[];

    return purposes.length > 0 ? purposes : defaultDonationPurposes.map((purpose, index) => ({
      id: `default_${index}`,
      ...purpose
    }));
  } catch (error) {
    console.error('Error fetching all donation purposes:', error);
    return defaultDonationPurposes.map((purpose, index) => ({
      id: `default_${index}`,
      ...purpose
    }));
  }
};

// Add new donation purpose
export const addDonationPurpose = async (purposeData: DonationPurposeFormData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'donationPurposes'), {
      ...purposeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding donation purpose:', error);
    throw error;
  }
};

// Update donation purpose
export const updateDonationPurpose = async (id: string, purposeData: Partial<DonationPurposeFormData>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'donationPurposes', id), {
      ...purposeData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating donation purpose:', error);
    throw error;
  }
};

// Delete donation purpose
export const deleteDonationPurpose = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'donationPurposes', id));
  } catch (error) {
    console.error('Error deleting donation purpose:', error);
    throw error;
  }
};

// Seed default donation purposes (for initial setup)
export const seedDonationPurposes = async (): Promise<void> => {
  try {
    const existingPurposes = await getAllDonationPurposes();
    if (existingPurposes.length === 0 || existingPurposes.every(p => p.id.startsWith('default_'))) {
      console.log('Seeding default donation purposes...');
      
      for (const purpose of defaultDonationPurposes) {
        await addDoc(collection(db, 'donationPurposes'), purpose);
      }
      
      console.log('Default donation purposes seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding donation purposes:', error);
  }
};