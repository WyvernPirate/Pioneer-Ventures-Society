import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { Newspaper, ArrowRight, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getFirestore, collection, query, orderBy, limit, Timestamp, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

// Define the structure of a BlogPost object from Firestore
interface BlogPost {
  id: string;
  title: string;
  content: string; // Full content from which we'll create an excerpt
  date: Timestamp;
  image: string;
  aiHint?: string;
}

// Helper to format Firestore Timestamp
const formatDate = (timestamp: Timestamp) => {
  return timestamp.toDate().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper to create a short excerpt from full content
const createExcerpt = (content: string, maxLength = 350) => {
  if (!content) return '';
  // First, strip markdown characters for a cleaner plain text representation.
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Headings
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
    .replace(/`{1,3}/g, '') // Code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/>\s/g, '') // Blockquotes
    .replace(/!\[.*?\]\(.*?\)/g, '') // Images
    .replace(/\n/g, ' ') // Newlines
    .trim();

  if (plainText.length <= maxLength) return plainText;

  const trimmedString = plainText.substring(0, maxLength);
  // Trim to the last space to avoid cutting words in half
  const lastSpaceIndex = trimmedString.lastIndexOf(' ');
  return (lastSpaceIndex > 0 ? trimmedString.substring(0, lastSpaceIndex) : trimmedString) + '...';
};

export default function BlogSummarySection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      setLoading(true);
      setError(null);
      const db = getFirestore();
      const postsCollection = collection(db, 'blog');
      const q = query(postsCollection, orderBy('date', 'desc'), limit(3));

      try {
        const postSnapshot = await getDocs(q);
        const latestPosts: BlogPost[] = postSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BlogPost));
        setPosts(latestPosts);
      } catch (err) {
        console.error("Error fetching latest posts:", err);
        setError("Could not load latest posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  const newestPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <section id="blog" className="py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Newspaper className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
            Latest From The PVS Blog
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Stay updated with our latest news, insights, and member stories.
          </p>
        </div>

        {loading && (
          <>
            <div className="mb-12">
              <Card className="overflow-hidden flex flex-col md:flex-row">
                <Skeleton className="w-full md:w-1/2 h-64 md:h-auto" />
                <div className="p-6 md:p-8 flex flex-col flex-grow md:w-1/2 space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-12 w-1/2 mt-auto" />
                </div>
              </Card>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="overflow-hidden flex flex-col">
                  <Skeleton className="w-full h-56" />
                  <div className="p-6 flex flex-col flex-grow space-y-3">
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-10 w-1/3 mt-auto" />
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {error && <p className="text-center text-lg text-red-500 flex items-center justify-center"><AlertCircle className="mr-2"/> {error}</p>}

        {!loading && !error && posts.length > 0 && (
          <>
            {newestPost && (
              <div className="mb-12">
                <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row">
                  <Link to="/blog" aria-label={`Read more about ${newestPost.title}`} className="md:w-1/2">
                    <img
                      src={newestPost.image}
                      alt={newestPost.title}
                      width={800}
                      height={500}
                      className="w-full h-64 md:h-full object-cover"
                      data-ai-hint={newestPost.aiHint}
                    />
                  </Link>
                  <CardContent className="p-6 md:p-8 flex flex-col flex-grow md:w-1/2">
                    <Badge variant="default" className="bg-accent text-accent-foreground w-fit mb-3 text-sm">Latest Post</Badge>
                    <CardTitle className="font-headline text-2xl lg:text-3xl text-primary mb-3">
                      <Link to="/blog" className="hover:text-accent transition-colors">
                        {newestPost.title}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-4">{formatDate(newestPost.date)}</p>
                    <CardDescription className="text-foreground/75 mb-6 flex-grow line-clamp-4 text-base">
                      {createExcerpt(newestPost.content)}
                    </CardDescription>
                    <Button variant="outline" asChild className="mt-auto w-fit self-start border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-base py-3 px-6"><Link to="/blog"><span className="flex items-center">Read More <ArrowRight className="ml-2 h-4 w-4" /></span></Link></Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {otherPosts.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {otherPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <Link to="/blog" aria-label={`Read more about ${post.title}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        width={600}
                        height={300}
                        className="w-full h-56 object-cover"
                        data-ai-hint={post.aiHint}
                      />
                    </Link>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <CardTitle className="font-headline text-xl text-primary mb-2">
                        <Link to="/blog" className="hover:text-accent transition-colors">
                          {post.title}
                        </Link>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mb-3">{formatDate(post.date)}</p>
                      <CardDescription className="text-foreground/70 mb-4 flex-grow line-clamp-3">
                        {createExcerpt(post.content)}
                      </CardDescription>
                      <Button variant="outline" asChild className="mt-auto w-fit self-start border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"><Link to="/blog"><span className="flex items-center">Read More <ArrowRight className="ml-2 h-4 w-4" /></span></Link></Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        
        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-lg text-muted-foreground py-10">No blog posts have been published yet. Check back soon!</p>
        )}

        <div className="text-center mt-8">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg" asChild>
            <Link to="/blog"><span className="flex items-center">View All Blog Posts <ArrowRight className="ml-2 h-5 w-5" /></span></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
