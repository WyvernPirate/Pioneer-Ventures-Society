import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertCircle } from 'lucide-react';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

interface DeleteMemberDialogProps {
  memberId: string;
  memberName: string;
  onMemberDeleted: () => void;
  children: React.ReactNode;
}

export function DeleteMemberDialog({ memberId, memberName, onMemberDeleted, children }: DeleteMemberDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'members', memberId));
      onMemberDeleted();
      setOpen(false); // Close the dialog on success
    } catch (err) {
      console.error("Error deleting member:", err);
      setError("Failed to delete member. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setError(null); // Reset error state when closing
    }}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the member <strong className="mx-1 text-foreground">{memberName}</strong> from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <div className="flex items-center p-3 bg-destructive/10 text-destructive rounded-lg text-sm"><AlertCircle className="h-4 w-4 mr-2" />{error}</div>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}