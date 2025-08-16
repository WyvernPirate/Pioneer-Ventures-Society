import { useEffect, useState } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Pin, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

// Define the structure of an Event object from Firestore
interface Event {
  id: string;
  title: string;
  date: Timestamp; // Firestore timestamp
  time: string;
  location: string;
  description: string;
  image: string;
  aiHint?: string;
  type: string;
  registrationLink?: string;
  featured?: boolean;
}

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Events - Pioneer Ventures Society';

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      const db = getFirestore();
      const eventsCollection = collection(db, 'events');
      // Fetch all events, ordered by date descending
      const q = query(eventsCollection, orderBy('date', 'desc'));

      try {
        const eventSnapshot = await getDocs(q);
        const allEvents: Event[] = eventSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Event));

        const now = new Date();
        const upcoming: Event[] = [];
        const past: Event[] = [];

        allEvents.forEach(event => {
          if (event.date.toDate() >= now) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });

        // Upcoming events should be ascending (soonest first)
        setUpcomingEvents(upcoming.reverse()); 
        setPastEvents(past);

      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Helper to format Firestore Timestamp
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
        <div className="max-w-4xl mx-auto text-center">
          <CalendarDays className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4">
            PVS Events Calendar
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Discover upcoming workshops, flagship summits, and community gatherings. Register to participate and engage with the PVS community.
          </p>
        </div>

        <section id="upcoming-events" className="mb-16">
          <h2 className="font-headline text-3xl font-semibold text-primary mb-8 border-b-2 border-primary/30 pb-2">Upcoming Events</h2>
          {loading ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="overflow-hidden flex flex-col">
                  <Skeleton className="w-full h-56" />
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <Skeleton className="h-6 w-1/4 mb-4" />
                    <Skeleton className="h-8 w-3/4 mb-3" />
                    <Skeleton className="h-5 w-full mb-1" />
                    <Skeleton className="h-5 w-full mb-1" />
                    <Skeleton className="h-5 w-2/3 mb-4" />
                    <Skeleton className="h-12 w-1/2 mt-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
             <p className="text-lg text-red-500 flex items-center"><AlertCircle className="mr-2"/> {error}</p>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <img
                    src={event.image}
                    alt={event.title}
                    width={600}
                    height={300}
                    className="w-full h-56 object-cover"
                    data-ai-hint={event.aiHint}
                  />
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="default" className="bg-accent text-accent-foreground text-sm">{event.type}</Badge>
                    </div>
                    <CardTitle className="font-headline text-2xl text-primary mb-2">{event.title}</CardTitle>
                    <div className="space-y-2 text-sm text-muted-foreground mb-3">
                      <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary/70" /> {formatDate(event.date)}</p>
                      <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary/70" /> {event.time}</p>
                      <p className="flex items-center"><Pin className="h-4 w-4 mr-2 text-primary/70" /> {event.location}</p>
                    </div>
                    <CardDescription className="text-foreground/70 mb-4 flex-grow">{event.description}</CardDescription>
                    {event.registrationLink && (
                      <Button asChild className="mt-auto w-full sm:w-fit bg-primary hover:bg-primary/90">
                        <Link to={`/register-event?event=${event.id}`}>
                          <span className="flex items-center">Register for Event <ArrowRight className="ml-2 h-4 w-4" /></span>
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-lg text-muted-foreground">No upcoming events scheduled at the moment. Please check back soon!</p>
          )}
        </section>

        <section id="past-events">
          <h2 className="font-headline text-3xl font-semibold text-primary mb-8 border-b-2 border-primary/30 pb-2">Past Events</h2>
           {loading ? (
             <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden flex flex-col">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-5 flex flex-col flex-grow">
                    <Skeleton className="h-5 w-1/3 mb-3" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>) : pastEvents.length > 0 ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col bg-card/80 opacity-90">
                   <img
                      src={event.image}
                      alt={event.title}
                      width={600}
                      height={300}
                      className="w-full h-48 object-cover"
                      data-ai-hint={event.aiHint}
                    />
                  <CardContent className="p-5 flex flex-col flex-grow">
                     <Badge variant="secondary" className="w-fit mb-2 text-sm">{event.type}</Badge>
                    <CardTitle className="font-headline text-xl text-primary/90 mb-1">{event.title}</CardTitle>
                     <div className="space-y-1 text-xs text-muted-foreground mb-2">
                      <p className="flex items-center"><CalendarDays className="h-3 w-3 mr-1.5 text-primary/60" /> {formatDate(event.date)}</p>
                      <p className="flex items-center"><Pin className="h-3 w-3 mr-1.5 text-primary/60" /> {event.location}</p>
                    </div>
                    <CardDescription className="text-foreground/60 text-sm flex-grow line-clamp-3">{event.description}</CardDescription>
                    {/* TODO: add a link to event summary or gallery */}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <p className="text-lg text-muted-foreground">No past event information available yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}