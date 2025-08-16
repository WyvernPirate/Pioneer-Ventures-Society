import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Pin, Clock, ArrowRight, CalendarCheck, AlertCircle } from 'lucide-react';
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

const truncate = (html: string, length: number) => {
  const strippedHtml = html.replace(/<[^>]+>/g, '');
  if (strippedHtml.length > length) {
    return strippedHtml.substring(0, length) + '...';
  }
  return html;
};

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
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
        const [upcomingEvents] = await Promise.all([
          fetchUpcomingEvents(),
          fetchFeaturedPost()
        ]);
        setEvents(upcomingEvents);
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
                    <CardDescription className="text-foreground/75 mb-6 flex-grow text-base">{truncate(featuredEvent.description, 400)}</CardDescription>
                    {featuredEvent.registrationLink && (
                      <Button asChild className="mt-auto w-fit self-start bg-primary hover:bg-primary/90 text-base py-3 px-6">
                        <Link to={`/register-event?event=${featuredEvent.id}`}><span className="flex items-center">Register Now <ArrowRight className="ml-2 h-4 w-4" /></span></Link>
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
                                                                                                <CardDescription className="text-foreground/70 mb-4 flex-grow">{truncate(event.description, 200)}</CardDescription>
                        {event.registrationLink && (
                          <Button asChild className="mt-auto w-fit self-start bg-primary hover:bg-primary/90">
                            <Link to={`/register-event?event=${event.id}`}><span className="flex items-center">Register <ArrowRight className="ml-2 h-4 w-4" /></span></Link>
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
        
        
        <div className="text-center mt-12">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg" asChild>
            <Link to="/events"><span className="flex items-center">View All Events <ArrowRight className="ml-2 h-5 w-5" /></span></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
