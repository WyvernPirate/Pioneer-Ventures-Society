import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Pin, Clock, ArrowRight, CalendarCheck, AlertCircle, Newspaper } from 'lucide-react';
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { getFirestore, collection, query, where, orderBy, limit, Timestamp, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
  id: string;
  title: string;
  date: Timestamp;
  time: string;
  location: string;
  description: string;
  image: string;
  aiHint?: string;
  type: string;
  registrationLink?: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: Timestamp;
  image: string;
  aiHint?: string;
}


const formatDate = (timestamp: Timestamp) => {
  return timestamp.toDate().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper to create a short excerpt from full content
const createExcerpt = (content: string, maxLength = 150) => {
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

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const db = getFirestore();
      
      const fetchUpcomingEvents = async () => {
        const eventsCollection = collection(db, 'events');
        const now = new Date();
        const q = query(eventsCollection, where('date', '>=', now), orderBy('date', 'asc'), limit(3));
        const eventSnapshot = await getDocs(q);
        return eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      };

      const fetchFeaturedPost = async () => {
        const postsCollection = collection(db, 'blog');
        const q = query(postsCollection, orderBy('date', 'desc'), limit(1));
        const postSnapshot = await getDocs(q);
        if (!postSnapshot.empty) {
          const doc = postSnapshot.docs[0];
          return { id: doc.id, ...doc.data() } as BlogPost;
        }
        return null;
      };

      try {
        const [upcomingEvents, post] = await Promise.all([
          fetchUpcomingEvents(),
          fetchFeaturedPost()
        ]);
        setEvents(upcomingEvents);
        setFeaturedPost(post);
      } catch (err) {
        console.error("Error fetching homepage section data:", err);
        setError("Could not load section content.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredEvent = events[0];
  const otherEvents = events.slice(1);

  return (
    <section id="events" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <CalendarCheck className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
            PVS Upcoming Events
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Join us for insightful workshops, flagship summits, and community gatherings.
          </p>
        </div>

        {loading && (
          <>
            <div className="mb-12">
              <Skeleton className="h-8 w-1/3 mb-6 mx-auto md:mx-0" />
              <Card className="overflow-hidden flex flex-col md:flex-row">
                <Skeleton className="w-full md:w-1/2 h-64 md:h-auto" />
                <div className="p-6 md:p-8 flex flex-col flex-grow md:w-1/2 space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-12 w-1/2 mt-auto" />
                </div>
              </Card>
            </div>
            <Skeleton className="h-8 w-1/4 mb-6 mx-auto md:mx-0" />
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="overflow-hidden flex flex-col">
                  <Skeleton className="w-full h-56" />
                  <div className="p-6 flex flex-col flex-grow space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-7 w-full" />
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

        {!loading && !error && events.length > 0 && (
          <>
            {featuredEvent && (
              <div className="mb-12">
                <h3 className="font-headline text-2xl sm:text-3xl font-semibold text-primary mb-6 text-center md:text-left">Featured Upcoming Event</h3>
                <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row">
                  <Link to={`/events#${featuredEvent.id}`} aria-label={`Learn more about ${featuredEvent.title}`} className="md:w-1/2">
                    <img src={featuredEvent.image} alt={featuredEvent.title} width={800} height={500} className="w-full h-64 md:h-full object-cover" data-ai-hint={featuredEvent.aiHint} />
                  </Link>
                  <CardContent className="p-6 md:p-8 flex flex-col flex-grow md:w-1/2">
                    <Badge variant="default" className="bg-accent text-accent-foreground w-fit mb-3 text-sm">Upcoming</Badge>
                    <CardTitle className="font-headline text-2xl lg:text-3xl text-primary mb-3">
                      <Link to={`/events#${featuredEvent.id}`} className="hover:text-accent transition-colors">{featuredEvent.title}</Link>
                    </CardTitle>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary/70" /> {formatDate(featuredEvent.date)}</p>
                      <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary/70" /> {featuredEvent.time}</p>
                      <p className="flex items-center"><Pin className="h-4 w-4 mr-2 text-primary/70" /> {featuredEvent.location}</p>
                    </div>
                    <CardDescription className="text-foreground/75 mb-6 flex-grow line-clamp-3 text-base">{featuredEvent.description}</CardDescription>
                    {featuredEvent.registrationLink && (
                      <Button asChild className="mt-auto w-fit self-start bg-primary hover:bg-primary/90 text-base py-3 px-6">
                        <Link to={`/register?event=${featuredEvent.id}`}><span className="flex items-center">Register Now <ArrowRight className="ml-2 h-4 w-4" /></span></Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {otherEvents.length > 0 && (
              <div className="mb-12">
                <h3 className="font-headline text-xl sm:text-2xl font-semibold text-primary mb-6 text-center md:text-left">More Upcoming Events</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {otherEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                      <Link to={`/events#${event.id}`}><img src={event.image} alt={event.title} width={600} height={300} className="w-full h-56 object-cover" data-ai-hint={event.aiHint} /></Link>
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <Badge variant="default" className="bg-accent text-accent-foreground w-fit mb-2">{event.type}</Badge>
                        <CardTitle className="font-headline text-xl text-primary mb-2">{event.title}</CardTitle>
                        <div className="space-y-2 text-sm text-muted-foreground mb-3">
                          <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary/70" /> {formatDate(event.date)}</p>
                          <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary/70" /> {event.time}</p>
                          <p className="flex items-center"><Pin className="h-4 w-4 mr-2 text-primary/70" /> {event.location}</p>
                        </div>
                        <CardDescription className="text-foreground/70 mb-4 flex-grow line-clamp-3">{event.description}</CardDescription>
                        {event.registrationLink && (
                          <Button asChild className="mt-auto w-fit self-start bg-primary hover:bg-primary/90">
                            <Link to={`/register?event=${event.id}`}><span className="flex items-center">Register <ArrowRight className="ml-2 h-4 w-4" /></span></Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !error && events.length === 0 && (
            <p className="text-center text-lg text-muted-foreground py-10">No upcoming events scheduled at the moment. Please check back soon!</p>
        )}
        
        {!loading && !error && featuredPost && (
          <div className="mt-16 md:mt-24 pt-16 border-t border-border">
            <div className="text-center mb-12 md:mb-16">
              <Newspaper className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
                From The Blog
              </h2>
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                Read our latest story.
              </p>
            </div>
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row">
              <Link to="/blog" aria-label={`Read more about ${featuredPost.title}`} className="md:w-1/2">
                <img src={featuredPost.image} alt={featuredPost.title} width={800} height={500} className="w-full h-64 md:h-full object-cover" data-ai-hint={featuredPost.aiHint} />
              </Link>
              <CardContent className="p-6 md:p-8 flex flex-col flex-grow md:w-1/2">
                <Badge variant="default" className="bg-accent text-accent-foreground w-fit mb-3 text-sm">Latest Post</Badge>
                <CardTitle className="font-headline text-2xl lg:text-3xl text-primary mb-3">
                  <Link to="/blog" className="hover:text-accent transition-colors">
                    {featuredPost.title}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-4">{formatDate(featuredPost.date)}</p>
                <CardDescription className="text-foreground/75 mb-6 flex-grow line-clamp-4 text-base">
                  {createExcerpt(featuredPost.content)}
                </CardDescription>
                <Button variant="outline" asChild className="mt-auto w-fit self-start border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-base py-3 px-6"><Link to="/blog"><span className="flex items-center">Read More <ArrowRight className="ml-2 h-4 w-4" /></span></Link></Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg" asChild>
            <Link to="/events"><span className="flex items-center">View All Events <ArrowRight className="ml-2 h-5 w-5" /></span></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
