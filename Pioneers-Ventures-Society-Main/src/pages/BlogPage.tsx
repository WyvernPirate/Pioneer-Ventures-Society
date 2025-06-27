import { useEffect } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight } from 'lucide-react';

// Placeholder blog posts
const blogPosts = [
  {
    id: '1',
    title: 'PVS Annual Summit Highlights: A Resounding Success!',
    date: 'November 5, 2024',
    excerpt: 'Relive the key moments from our flagship Annual Summit, featuring inspiring keynotes, innovative startup pitches, and vibrant networking sessions that brought together the brightest minds...',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'conference highlights',
    slug: '/blog/pvs-summit-highlights',
  },
  {
    id: '2',
    title: 'Member Spotlight: How Aisha Khan is Driving Social Change',
    date: 'October 20, 2024',
    excerpt: 'Meet Aisha Khan, founder of BridgeConnect, and learn how her PVS-supported venture is making a tangible impact in local communities through technology and collaboration.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'social innovator portrait',
    slug: '/blog/member-spotlight-aisha-khan',
  },
  {
    id: '3',
    title: 'The Future of Agri-Tech in Botswana: Insights from Our Masterclass',
    date: 'September 15, 2024',
    excerpt: 'Our recent Agri-NOVA Masterclass delved into cutting-edge technologies transforming agriculture. Discover the key takeaways and future trends discussed by experts.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'agriculture technology farm',
    slug: '/blog/future-of-agritech',
  },
];

export default function BlogPage() {
  useEffect(() => {
    document.title = 'Blog & News - Pioneer Ventures Society';
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
            Stay updated with the latest announcements, event recaps, member spotlights, and insightful articles from the Pioneer Ventures Society.
          </p>
        </div>

        {blogPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <Link to={post.slug} aria-label={`Read more about ${post.title}`}>
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
                    <Link to={post.slug} className="hover:text-accent transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">{post.date}</p>
                  <CardDescription className="text-foreground/70 mb-4 flex-grow line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                  <Button variant="outline" asChild className="mt-auto w-fit self-start border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                    <Link to={post.slug}><span>Read More <ArrowRight className="ml-2 h-4 w-4" /></span></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">Fresh content is on its way. Stay tuned for exciting news and articles!</p>
          </div>
        )}
      </main>
    </div>
  );
}