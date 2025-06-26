
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { Newspaper, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Added missing import

// Placeholder blog posts - mirror structure from /blog/page.tsx
const blogPosts = [
  {
    id: '1',
    title: 'PVS Annual Summit Highlights: A Resounding Success!',
    date: 'November 5, 2024',
    excerpt: 'Relive the key moments from our flagship Annual Summit, featuring inspiring keynotes, innovative startup pitches, and vibrant networking sessions...',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'conference highlights',
    slug: '/blog/pvs-summit-highlights',
  },
  {
    id: '2',
    title: 'Member Spotlight: How Aisha Khan is Driving Social Change',
    date: 'October 20, 2024',
    excerpt: 'Meet Aisha Khan, founder of BridgeConnect, and learn how her PVS-supported venture is making a tangible impact in local communities...',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'social innovator portrait',
    slug: '/blog/member-spotlight-aisha-khan',
  },
  {
    id: '3',
    title: 'The Future of Agri-Tech in Botswana: Insights from Our Masterclass',
    date: 'September 15, 2024',
    excerpt: 'Our recent Agri-NOVA Masterclass delved into cutting-edge technologies transforming agriculture. Discover the key takeaways and future trends...',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'agriculture technology farm',
    slug: '/blog/future-of-agritech',
  },
];

const newestPost = blogPosts[0];
const otherPosts = blogPosts.slice(1, 3); // Show 2 other posts

export default function BlogSummarySection() {
  return (
    <section id="blog-summary" className="py-16 md:py-24 bg-secondary/20">
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

        {newestPost && (
          <div className="mb-12">
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row">
              <Link to={newestPost.slug} aria-label={`Read more about ${newestPost.title}`} className="md:w-1/2">
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
                  <Link to={newestPost.slug} className="hover:text-accent transition-colors">
                    {newestPost.title}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-4">{newestPost.date}</p>
                <CardDescription className="text-foreground/75 mb-6 flex-grow line-clamp-4 text-base">
                  {newestPost.excerpt}
                </CardDescription>
                <Button variant="outline" asChild className="mt-auto w-fit self-start border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-base py-3 px-6">
                  <Link to={newestPost.slug}>
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {otherPosts.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {otherPosts.map((post) => (
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
                    <Link to={post.slug}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg" asChild>
            <Link to="/blog">
              View All Blog Posts <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
