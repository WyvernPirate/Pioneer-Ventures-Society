
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, PlusCircle } from 'lucide-react';

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <CalendarDays className="mr-3 h-8 w-8 text-accent" />
          Manage Events
        </h1>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Event
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Placeholder for list of upcoming events with edit/delete options.</p>
          {/* Example structure for an event item */}
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="font-semibold">PVS Annual Summit 2024</h3>
            <p className="text-sm text-muted-foreground">October 26-28, 2024</p>
            <div className="mt-2 space-x-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Past Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Placeholder for list of past events with view/edit options.</p>
        </CardContent>
      </Card>
    </div>
  );
}
