import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import type { BlogPost } from './blog-data';

// Blog Posts
export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'blog-posts'), {
    ...postData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getBlogPosts = async () => {
  const q = query(collection(db, 'blog-posts'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Events
export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'events'), {
    ...eventData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getEvents = async () => {
  const q = query(collection(db, 'events'), orderBy('date', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Members
export const createMember = async (memberData: Omit<Member, 'id' | 'joinDate'>) => {
  const docRef = await addDoc(collection(db, 'members'), {
    ...memberData,
    joinDate: Timestamp.now()
  });
  return docRef.id;
};

export const getMembers = async () => {
  const q = query(collection(db, 'members'), orderBy('joinDate', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// File Upload
export const uploadFile = async (file: File, path: string) => {
  const fileRef = ref(storage, path);
  const snapshot = await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// Generic CRUD operations
export const updateDocument = async (collection: string, id: string, data: any) => {
  const docRef = doc(db, collection, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteDocument = async (collection: string, id: string) => {
  const docRef = doc(db, collection, id);
  await deleteDoc(docRef);
};