import { useState, useEffect } from 'react';
import { Calendar, Newspaper, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  date: Timestamp;
  author?: string;
  aiHint?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Blog & News - Pioneer Ventures Society';
    fetchPosts();
  }, []);

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
      if (postList.length > 0) {
        setSelectedPost(postList[0]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load blog posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Newspaper className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4">
            PVS Blog & News
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Insights, stories, and updates from the Pioneer Ventures Society community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <Card className="p-4 sticky top-24">
              <h2 className="text-xl font-semibold text-primary mb-4 border-b pb-2">Articles</h2>
              <ScrollArea className="h-[60vh]">
                <nav className="flex flex-col gap-2 pr-4">
                  {loading ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                   : posts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg transition-colors text-primary/80',
                        selectedPost?.id === post.id
                          ? 'bg-accent text-accent-foreground font-semibold'
                          : 'hover:bg-accent/50'
                      )}
                    >
                      {post.title}
                    </button>
                  ))}
                  {!loading && posts.length === 0 && (
                    <p className="text-muted-foreground text-sm p-3">No articles published yet.</p>
                  )}
                </nav>
              </ScrollArea>
            </Card>
          </aside>

          {/* Main Content */}
          <article className="md:col-span-3">
            {loading ? (
              <Card className="p-6 md:p-8 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="w-full h-80 rounded-lg" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
              </Card>
            ) : error ? (<p className="text-lg text-red-500 flex items-center"><AlertCircle className="mr-2"/> {error}</p>
            ) : selectedPost ? (
              <Card className="overflow-hidden">
                <div className="p-6 md:p-8">
                  <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center text-muted-foreground text-sm mb-6">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(selectedPost.date)}</span>
                  </div>

                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg object-cover mb-8"
                    data-ai-hint={selectedPost.aiHint}
                  />

                  <div className="prose prose-lg max-w-none mx-auto text-foreground/90 prose-headings:font-headline prose-headings:text-primary prose-strong:text-primary prose-a:text-accent hover:prose-a:text-accent/80">
                    <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-lg bg-card p-8 rounded-lg">
                <p>Select an article from the sidebar to read.</p>
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}