import type { Timestamp } from 'firebase/firestore';

export interface Resource {
  id: string;
  title: string;
  description: string;
  downloadUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number; // in bytes
  createdAt: Timestamp;
}