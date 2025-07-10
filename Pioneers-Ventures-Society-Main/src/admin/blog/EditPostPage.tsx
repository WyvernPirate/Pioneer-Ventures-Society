import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PostData {
  title: string;
  content: string;
  image: string;
  author: string;
  date: Timestamp;
}

export default function EditPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    author: '',
  });

  useEffect(() => {
    if (!postId) {
      setError("Post ID is missing from URL.");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      const db = getFirestore();
      const postDocRef = doc(db, 'blog', postId);
      try {
        const docSnap = await getDoc(postDocRef);
        if (docSnap.exists()) {
          const postData = docSnap.data() as PostData;
          setFormData({
            title: postData.title || '',
            content: postData.content || '',
            image: postData.image || '',
            author: postData.author || 'PVS Admin',
          });
        } else {
          setError("Blog post not found. It may have been deleted.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) {
      setError("Cannot submit, post ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const db = getFirestore();
      const postDocRef = doc(db, 'blog', postId);
      // Note: We are not updating the original post date here.
      // You could add a `lastUpdatedAt` timestamp if needed.
      await updateDoc(postDocRef, { ...formData });
      navigate('/dashboard/blog');
    } catch (err) {
      console.error("Error updating post:", err);
      setError("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="space-y-4 p-6 border rounded-lg">
          {[...Array(4)].map((_, i) => <div key={i} className="grid grid-cols-4 items-center gap-4"><Skeleton className="h-6 w-20" /><Skeleton className="h-10 col-span-3" /></div>)}
          <div className="flex justify-end gap-2 pt-4"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-24" /></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg"><AlertCircle className="h-5 w-5 mr-3" /><p>{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-3xl font-bold text-primary">Edit Blog Post</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-card">
        <div className="grid gap-6">
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="title" className="text-right">Title</Label><Input id="title" value={formData.title} onChange={handleInputChange} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="content" className="text-right pt-2">Content</Label><Textarea id="content" value={formData.content} onChange={handleInputChange} className="col-span-3 min-h-[250px]" placeholder="Write your post content here. Markdown is supported." required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="image" className="text-right">Image URL</Label><Input id="image" value={formData.image} onChange={handleInputChange} className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="author" className="text-right">Author</Label><Input id="author" value={formData.author} onChange={handleInputChange} className="col-span-3" /></div>
        </div>
        <div className="flex justify-end gap-2 pt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/blog')}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}