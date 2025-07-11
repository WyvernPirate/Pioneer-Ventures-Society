import { db, storage } from "../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const getDocuments = async () => {
  const q = query(collection(db, "documents"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return docs as any[]; // Cast to any[] for now, or define a strict type
};

export const addDocument = async (formData: FormData) => {
  const name = formData.get("documentName") as string;
  const description = formData.get("documentDescription") as string;
  const file = formData.get("documentFile") as File;

  if (!name || !description || !file) {
    return { success: false, message: "Name, description, and file are required." };
  }

  try {
    const storagePath = `documents/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "documents"), {
      name,
      description,
      downloadURL,
      storagePath,
      fileType: file.type,
      fileSize: file.size,
      createdAt: new Date(),
    });

    return { success: true, message: "Document added successfully." };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, message: "Failed to add document." };
  }
};

export const deleteDocument = async (id: string, storagePath: string) => {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
  await deleteDoc(doc(db, "documents", id));
  return { success: true, message: "Document deleted successfully." };
};