
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Pin, Clock, ArrowRight, CalendarCheck } from 'lucide-react';
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';

// Using a subset of events for the homepage summary
const upcomingEventsSummary = [
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
    registrationLink: "/register-event/summit-2024",
    isNewest: true, // Mark the newest
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


export default function EventsSection() {
  const newestEvent = upcomingEventsSummary.find(event => event.isNewest);
  const otherUpcomingEvents = upcomingEventsSummary.filter(event => !event.isNewest);

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

        {newestEvent && (
          <div className="mb-12">
            <h3 className="font-headline text-2xl sm:text-3xl font-semibold text-primary mb-6 text-center md:text-left">Featured Upcoming Event</h3>
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row">
               <Link to={newestEvent.registrationLink || '#'} aria-label={`Register for ${newestEvent.title}`} className="md:w-1/2">
                <img
                  src={newestEvent.image}
                  alt={newestEvent.title}
                  width={800}
                  height={500}
                  className="w-full h-64 md:h-full object-cover"
                  data-ai-hint={newestEvent.aiHint}
                />
              </Link>
              <CardContent className="p-6 md:p-8 flex flex-col flex-grow md:w-1/2">
                <Badge variant="default" className="bg-accent text-accent-foreground w-fit mb-3 text-sm">Upcoming</Badge>
                <CardTitle className="font-headline text-2xl lg:text-3xl text-primary mb-3">
                  <Link to={newestEvent.registrationLink || '#'} className="hover:text-accent transition-colors">
                    {newestEvent.title}
                  </Link>
                </CardTitle>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary/70" /> {newestEvent.date}</p>
                  <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary/70" /> {newestEvent.time}</p>
                  <p className="flex items-center"><Pin className="h-4 w-4 mr-2 text-primary/70" /> {newestEvent.location}</p>
                </div>
                <CardDescription className="text-foreground/75 mb-6 flex-grow line-clamp-3 text-base">
                  {newestEvent.description}
                </CardDescription>
                <Button asChild className="mt-auto w-fit self-start bg-primary hover:bg-primary/90 text-base py-3 px-6"><Link to={newestEvent.registrationLink || '#'}><span>Register Now <ArrowRight className="ml-2 h-4 w-4" /></span></Link></Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {otherUpcomingEvents.length > 0 && (
          <div className="mb-12">
            <h3 className="font-headline text-xl sm:text-2xl font-semibold text-primary mb-6 text-center md:text-left">More Upcoming Events</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {otherUpcomingEvents.map((event) => (
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
                    <Badge variant="default" className="bg-accent text-accent-foreground w-fit mb-2">{event.type}</Badge>
                    <CardTitle className="font-headline text-xl text-primary mb-2">{event.title}</CardTitle>
                    <div className="space-y-2 text-sm text-muted-foreground mb-3">
                      <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary/70" /> {event.date}</p>
                      <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary/70" /> {event.time}</p>
                      <p className="flex items-center"><Pin className="h-4 w-4 mr-2 text-primary/70" /> {event.location}</p>
                    </div>
                    <CardDescription className="text-foreground/70 mb-4 flex-grow line-clamp-3">{event.description}</CardDescription>
                     <Button asChild className="mt-auto w-fit self-start bg-primary hover:bg-primary/90">
                      <Link to={event.registrationLink || '#'}><span>Register <ArrowRight className="ml-2 h-4 w-4" /></span></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg" asChild>
            <Link to="/events"><span>View All Events <ArrowRight className="ml-2 h-5 w-5" /></span></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
