import { useState, useEffect } from 'react';
import { blogPosts, type BlogPost } from '@/lib/blog-data';
import { Calendar, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    document.title = 'Blog & News - Pioneer Ventures Society';
    if (blogPosts.length > 0) {
      setSelectedPost(blogPosts[0]);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Newspaper className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4">
            PVS Blog & News
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Select an article from the sidebar to read the full post.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <Card className="p-4">
              <h2 className="text-xl font-semibold text-primary mb-4 border-b pb-2">Articles</h2>
              <ScrollArea className="h-[60vh]">
                <nav className="flex flex-col gap-2 pr-4">
                  {blogPosts.map((post) => (
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
                </nav>
              </ScrollArea>
            </Card>
          </aside>

          {/* Main Content */}
          <article className="md:col-span-3">
            {selectedPost ? (
              <Card className="overflow-hidden">
                <div className="p-6 md:p-8">
                  <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center text-muted-foreground text-sm mb-6">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{selectedPost.date}</span>
                  </div>

                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg object-cover mb-8"
                    data-ai-hint={selectedPost.aiHint}
                  />

                  <div
                    className="prose prose-lg max-w-none mx-auto text-foreground/90 prose-headings:font-headline prose-headings:text-primary prose-strong:text-primary prose-a:text-accent hover:prose-a:text-accent/80"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  />
                </div>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Select an article to read.</p>
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}