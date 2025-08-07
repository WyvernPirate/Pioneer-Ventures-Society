import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type FieldValue,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase"; // Assuming you have a firebase config file

export interface MerchItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sizes: string[];
  isPublished: boolean;
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}

const merchCollection = collection(db, "merchandise");

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): MerchItem => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    price: data.price,
    imageUrl: data.imageUrl,
    sizes: data.sizes,
    isPublished: data.isPublished,
  };
};

// For public site - get only published items
export const getPublishedMerch = async (): Promise<MerchItem[]> => {
  const q = query(merchCollection, where("isPublished", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(fromFirestore);
};

// For admin panel - get all items
export const getAllMerch = async (): Promise<MerchItem[]> => {
  const snapshot = await getDocs(merchCollection);
  return snapshot.docs.map(fromFirestore);
};

// Upload image to Firebase Storage
export const uploadMerchImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `merch-images/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// Add a new merch item
export const addMerch = (item: Omit<MerchItem, "id">) => {
  return addDoc(merchCollection, {
    ...item,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// Update a merch item
export const updateMerch = (id: string, item: Partial<MerchItem>) => {
  const docRef = doc(db, "merchandise", id);
  return updateDoc(docRef, {
    ...item,
    updatedAt: serverTimestamp(),
  });
};

// Delete a merch item
export const deleteMerch = (id: string) => {
  const docRef = doc(db, "merchandise", id);
  return deleteDoc(docRef);
};