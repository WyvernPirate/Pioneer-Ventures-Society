import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PostForm, type PostFormData } from './PostForm';

export default function EditPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PostFormData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
          setFormData(docSnap.data() as PostFormData);
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
    if (!formData) return;
    const { id, value } = e.target;
    setFormData(prev => prev ? { ...prev, [id]: value } : null);
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => prev ? { ...prev, content } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId || !formData) {
      setError("Cannot submit, post ID is missing.");
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

      const postDocRef = doc(db, 'blog', postId);
      
      const updatedData = { ...formData, image: imageUrl };

      await updateDoc(postDocRef, updatedData);
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

  if (error || !formData) {
    return <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg"><AlertCircle className="h-5 w-5 mr-3" /><p>{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-3xl font-bold text-primary">Edit Blog Post</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-card">
        <PostForm
          formData={formData}
          onFormChange={handleInputChange}
          onContentChange={handleContentChange}
          imageFile={imageFile}
          onImageFileChange={setImageFile}
        />
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