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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle } from 'lucide-react';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

interface AddPostFormProps {
  onPostAdded: () => void;
  children: React.ReactNode;
}

export function AddPostForm({ onPostAdded, children }: AddPostFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('https://placehold.co/800x400.png'); // Default placeholder

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImage('https://placehold.co/800x400.png');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Post Title and Content are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const db = getFirestore();
      const newPost = {
        title,
        content,
        image,
        // In a real app, you might get the author from the logged-in user
        author: "PVS Admin", 
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">Content</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3 min-h-[200px]" placeholder="Write your post content here. Markdown is supported." required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Image URL</Label>
              <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} className="col-span-3" />
            </div>
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