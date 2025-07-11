// src/app/admin/documents/actions.ts
'use server';

import { z } from 'zod';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

const DocumentSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  file: z
    .custom<File>((val) => val instanceof File, "Please upload a file.")
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than 5MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .pdf, .doc, .docx, .txt files are accepted."
    ),
});

export type DocumentFormState = {
  message: string;
  success: boolean;
  errors?: {
    title?: string[];
    description?: string[];
    file?: string[];
    _form?: string[];
  };
  timestamp?: number;
};

export async function addDocument(prevState: DocumentFormState, formData: FormData): Promise<DocumentFormState> {
  const validatedFields = DocumentSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    file: formData.get('file'),
  });

  if (!validatedFields.success) {
    return {
      message: "Failed to add document.",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  const { title, description, file } = validatedFields.data;

  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Add document metadata to Firestore
    await addDoc(collection(db, 'documents'), {
      title,
      description: description || '',
      fileURL: downloadURL,
      filePath: snapshot.ref.fullPath, // Store path for deletion
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: serverTimestamp(),
    });

    revalidatePath('/admin/documents');
    revalidatePath('/resources'); // Also revalidate public resources page

    return {
      message: "Document added successfully!",
      success: true,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error adding document:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return {
      message: "Failed to add document.",
      success: false,
      errors: { _form: [errorMessage] },
      timestamp: Date.now(),
    };
  }
}

export type DeleteDocumentState = {
  message: string;
  success: boolean;
  errors?: { _form?: string[] };
  timestamp?: number;
};

export async function deleteDocumentAction(prevState: DeleteDocumentState, formData: FormData): Promise<DeleteDocumentState> {
  const documentId = formData.get('documentId') as string;
  const filePath = formData.get('filePath') as string;

  if (!documentId || !filePath) {
    return {
      message: "Invalid request for deletion.",
      success: false,
      errors: { _form: ["Document ID or file path missing."] },
      timestamp: Date.now(),
    };
  }

  try {
    // Delete file from Firebase Storage
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);

    // Delete document metadata from Firestore
    await deleteDoc(doc(db, 'documents', documentId));

    revalidatePath('/admin/documents');
    revalidatePath('/resources');

    return {
      message: "Document deleted successfully!",
      success: true,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error deleting document:", error);
     let errorMessage = "An unexpected error occurred during deletion.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return {
      message: "Failed to delete document.",
      success: false,
      errors: { _form: [errorMessage] },
      timestamp: Date.now(),
    };
  }
}


export interface PvsDocument {
  id: string;
  title: string;
  description?: string;
  fileURL: string;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: { seconds: number; nanoseconds: number } | null; // Firestore Timestamp structure
}

export async function getPvsDocuments(): Promise<PvsDocument[]> {
  try {
    const documentsCollection = collection(db, 'documents');
    const q = query(documentsCollection, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Ensure uploadedAt is serializable for Server Components
      uploadedAt: doc.data().uploadedAt ? {
        seconds: doc.data().uploadedAt.seconds,
        nanoseconds: doc.data().uploadedAt.nanoseconds,
      } : null,
    })) as PvsDocument[];
    
    return documents;
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return [];
  }
}
// In Next.js 13+ with app directory, you can use the following import:

function revalidatePath(path: string) {
    // Invalidate the cache for the given path so that it gets re-fetched on next request
    return revalidatePath(path);
}

