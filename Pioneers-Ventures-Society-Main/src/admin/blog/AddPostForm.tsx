import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle } from 'lucide-react';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PostForm, type PostFormData } from './PostForm';

interface AddPostFormProps {
  onPostAdded: () => void;
  children: React.ReactNode;
}

export function AddPostForm({ onPostAdded, children }: AddPostFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormData: PostFormData = {
    title: '',
    content: '',
    image: 'https://placehold.co/800x400.png', // Default placeholder
    author: 'PVS Admin',
  };

  const [formData, setFormData] = useState<PostFormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const resetForm = () => {
    setFormData(initialFormData);
    setImageFile(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError("Post Title and Content are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const db = getFirestore();
      const storage = getStorage();
      let imageUrl = formData.image;

      if (imageFile) {
        const storageRef = ref(storage, `blog/pics/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const newPost = {
        ...formData,
        image: imageUrl,
        date: Timestamp.now(),
      };
      await addDoc(collection(db, 'blog'), newPost);
      
      onPostAdded(); // Refresh the list on the parent page
      resetForm();
      setOpen(false); // Close the dialog
    } catch (err) {
      console.error("Error adding post:", err);
      setError("Failed to add post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Blog Post</DialogTitle>
          <DialogDescription>
            Fill in the details for the new post. The content field supports Markdown.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <PostForm
              formData={formData}
              onFormChange={handleInputChange}
              imageFile={imageFile}
              onImageFileChange={setImageFile}
            />
            {error && <div className="col-span-4 flex items-center p-3 bg-destructive/10 text-destructive rounded-lg text-sm"><AlertCircle className="h-4 w-4 mr-2" />{error}</div>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}