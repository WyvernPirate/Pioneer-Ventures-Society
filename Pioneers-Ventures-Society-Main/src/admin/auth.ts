import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

/**
 * Returns a promise that resolves with the current user, or null if not logged in.
 * This is useful for loaders in React Router, as it waits for Firebase Auth to initialize.
 */
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}