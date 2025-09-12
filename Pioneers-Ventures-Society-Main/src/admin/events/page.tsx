
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, PlusCircle, AlertCircle, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { AddEventForm } from './AddEventForm';
import { DeleteEventDialog } from '../../components/ui/DeleteEventDialog';

// Define the structure of an Event object from Firestore
interface Event {
  id: string;
  title: string;
  date: Timestamp; // Firestore timestamp
}

export default function AdminEventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      // Reset states on refetch
      setLoading(true);
      setError(null);
      const db = getFirestore();
      const eventsCollection = collection(db, 'events');
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

        setUpcomingEvents(upcoming.reverse()); // Show soonest first
        setPastEvents(past); // Show most recent first

      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [refreshKey]);

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderEventList = (events: Event[]) => {
    if (events.length === 0) {
      return <p className="text-muted-foreground">No events in this category.</p>;
    }
    return (
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-accent/50 transition-colors">
            <div>
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/dashboard/events/edit/${event.id}`}><Pencil className="h-4 w-4" /></Link>
              </Button>
              <DeleteEventDialog
                eventId={event.id}
                eventName={event.title}
                onEventDeleted={() => setRefreshKey(prev => prev + 1)}
              >
                <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
              </DeleteEventDialog>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <CalendarDays className="mr-3 h-8 w-8 text-accent" />
          Manage Events
        </h1>
        <AddEventForm onEventAdded={() => setRefreshKey(prev => prev + 1)}>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Event
          </Button>
        </AddEventForm>
      </div>

      {loading && <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-3 text-muted-foreground">Loading Events...</p></div>}
      {error && <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg"><AlertCircle className="h-5 w-5 mr-3" /><p>{error}</p></div>}

      {!loading && !error && (
        <>
          <Card><CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader><CardContent>{renderEventList(upcomingEvents)}</CardContent></Card>
          <Card><CardHeader><CardTitle>Past Events</CardTitle></CardHeader><CardContent>{renderEventList(pastEvents)}</CardContent></Card>
        </>
      )}
    </div>
  );
}
