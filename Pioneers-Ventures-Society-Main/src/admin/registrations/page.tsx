
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, Download } from 'lucide-react';

export default function AdminRegistrationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center">
        <ListChecks className="mr-3 h-8 w-8 text-accent" />
        View Registrations
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Event Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">Placeholder for list of events with options to download registration lists.</p>
          <div className="flex items-center justify-between p-3 border rounded-md">
            <span>PVS Annual Summit 2024 Registrations</span>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Download List
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Member Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">Download the full list of member registrations.</p>
           <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download Member List
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
// This page will list registrations for events and members, with options to download lists.