import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Pin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Use react-router-dom's Link
import { Button } from '@/components/ui/button';

// Placeholder data - this would typically come from a CMS or database
const upcomingEvents = [
  {
    id: "summit-2024",
    title: "PVS Annual Innovation Summit 2024",
    date: "October 26-28, 2024",
    time: "9:00 AM - 5:00 PM Daily",
    location: "BIUST Auditorium, Palapye",
    description: "Our flagship event! A showcase of Africa’s next great minds, bringing together students, alumni, researchers, entrepreneurs, and experts. Features panels, keynotes, and startup demos.",
    image: "https://placehold.co/600x400.png",
    aiHint: "conference summit",
    type: "Summit",
    registrationLink: "/register-event/sumit-2024", // Example link
  },
  {
    id: "pitch-day-nov",
    title: "Innovation Incubator Pitch Day",
    date: "November 15, 2024",
    time: "2:00 PM - 6:00 PM",
    location: "PVS Innovation Hub",
    description: "Selected startups from our Incubation Program pitch their ventures to a panel of investors and mentors.",
    image: "https://placehold.co/600x400.png",
    aiHint: "startup pitch",
    type: "Pitch Event",
    registrationLink: "/register-event/pitch-day-nov",
  },
];

const pastEvents = [
   {
    id: "agri-masterclass",
    title: "Agri-NOVA Masterclass: Sustainable Farming Tech",
    date: "May 10, 2024",
    location: "Online Webinar",
    description: "A deep dive into the latest technologies revolutionizing sustainable agriculture in Botswana, led by industry experts.",
    image: "https://placehold.co/600x400.png",
    aiHint: "agriculture technology",
    type: "Masterclass",
  },
];

export default function EventsPage() {
  useEffect(() => {
    document.title = 'Events - Pioneer Ventures Society';
  }, []);

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
          {upcomingEvents.length > 0 ? (
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
                      <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary/70" /> {event.date}</p>
                      <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary/70" /> {event.time}</p>
                      <p className="flex items-center"><Pin className="h-4 w-4 mr-2 text-primary/70" /> {event.location}</p>
                    </div>
                    <CardDescription className="text-foreground/70 mb-4 flex-grow">{event.description}</CardDescription>
                    <Button asChild className="mt-auto w-full sm:w-fit bg-primary hover:bg-primary/90">
                      <Link to={event.registrationLink}>
                        <span className="flex items-center">Register for Event <ArrowRight className="ml-2 h-4 w-4" /></span>
                      </Link>
                    </Button>
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
           {pastEvents.length > 0 ? (
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
                      <p className="flex items-center"><CalendarDays className="h-3 w-3 mr-1.5 text-primary/60" /> {event.date}</p>
                      <p className="flex items-center"><Pin className="h-3 w-3 mr-1.5 text-primary/60" /> {event.location}</p>
                    </div>
                    <CardDescription className="text-foreground/60 text-sm flex-grow line-clamp-3">{event.description}</CardDescription>
                    {/* Optionally, add a link to event summary or gallery */}
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