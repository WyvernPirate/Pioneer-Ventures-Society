import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, PlusCircle, Loader2, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { AddPostForm } from './AddPostForm';
import { DeletePostDialog } from '../../components/ui/DeletePostDialog';

interface BlogPost {
  id: string;
  title: string;
  date: Timestamp;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore();
        const postsCollection = collection(db, 'blog');
        const q = query(postsCollection, orderBy('date', 'desc'));
        const postSnapshot = await getDocs(q);
        const postList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        setPosts(postList);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [refreshKey]);

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Newspaper className="mr-3 h-8 w-8 text-accent" />
          Manage Blog Posts
        </h1>
        <AddPostForm onPostAdded={() => setRefreshKey(prev => prev + 1)}>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Post
          </Button>
        </AddPostForm>
      </div>
      
      {loading && <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-3 text-muted-foreground">Loading Posts...</p></div>}
      {error && <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg"><AlertCircle className="h-5 w-5 mr-3" /><p>{error}</p></div>}

      {!loading && !error && (
        <Card>
          <CardHeader><CardTitle>Published Posts</CardTitle></CardHeader>
          <CardContent>
            {posts.length > 0 ? (
              <div className="space-y-3">
                {posts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="font-semibold">{post.title}</p>
                      <p className="text-sm text-muted-foreground">Published: {formatDate(post.date)}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/blog/edit/${post.id}`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <DeletePostDialog
                        postId={post.id}
                        postName={post.title}
                        onPostDeleted={() => setRefreshKey(prev => prev + 1)}
                      >
                        <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                      </DeletePostDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No blog posts have been published yet.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
