import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Initiative } from '@/types/initiatives';

const defaultInitiatives = [
  {
    title: "Skill Development Workshops",
    description: "Gain practical knowledge and hands-on experience through masterclasses, technical workshops, and soft-skill training sessions led by industry experts and seasoned entrepreneurs.",
    icon: 'GraduationCap',
    imageUrl: "https://placehold.co/600x400/4f46e5/ffffff?text=Skill+Development",
    link: "/events",
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Community Impact Challenges",
    description: "Participate in challenges designed to solve real-world community problems through innovative solutions and social entrepreneurship, fostering a spirit of giving back.",
    icon: 'ShieldHalf',
    imageUrl: "https://placehold.co/600x400/059669/ffffff?text=Community+Impact",
    link: "#",
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Leadership & Networking Forums",
    description: "Connect with peers, mentors, and industry leaders through regular forums, networking events, and discussions aimed at cultivating leadership qualities and expanding professional networks.",
    icon: 'Handshake',
    imageUrl: "https://placehold.co/600x400/dc2626/ffffff?text=Leadership+%26+Networking",
    link: "/events",
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const seedInitiatives = async (): Promise<void> => {
  try {
    // Check if initiatives already exist
    const initiativesQuery = query(collection(db, 'initiatives'));
    const snapshot = await getDocs(initiativesQuery);
    
    if (snapshot.empty) {
      // Add default initiatives
      for (const initiative of defaultInitiatives) {
        await addDoc(collection(db, 'initiatives'), initiative);
      }
      console.log('Default initiatives seeded successfully');
    } else {
      console.log('Initiatives already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding initiatives:', error);
    throw error;
  }
};