
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, Download, Loader2, AlertCircle } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
// import { CSVLink } from 'react-csv'; // Uncomment when CSV export is implemented

interface Registration {
  id?: string;
  fullName?: string;
  name?: string;
  email: string;
  phone?: string;
  studentId?: string;
  interests?: string;
  event?: string;
  registrationDate: string;
}

export default function AdminRegistrationsPage() {
  const [eventRegistrations, setEventRegistrations] = useState<Registration[]>([]);
  const [memberRegistrations, setMemberRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch member registrations
        const memberRegistrationsQuery = query(collection(db, 'memberRegistrations'), orderBy('registrationDate', 'desc'));
        const memberRegistrationsSnapshot = await getDocs(memberRegistrationsQuery);
        const memberRegistrationsList = memberRegistrationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Registration[];
        setMemberRegistrations(memberRegistrationsList);

        // Fetch event registrations
        const eventRegistrationsQuery = query(collection(db, 'eventRegistrations'), orderBy('registrationDate', 'desc'));
        const eventRegistrationsSnapshot = await getDocs(eventRegistrationsQuery);
        const eventRegistrationsList = eventRegistrationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Registration[];
        setEventRegistrations(eventRegistrationsList);

      } catch (err) {
        console.error("Error fetching registrations:", err);
        setError("Failed to load registrations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const downloadCsv = (data: any[], filename: string, headers: string[]) => {
    // Create CSV headers
    const csvHeaders = headers.map(header => {
      // Convert camelCase to Title Case for better readability
      return header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    });
    
    // Create CSV data rows
    const csvData = data.map(item => 
      headers.map(header => {
        const value = item[header] || '';
        // Escape commas and quotes in CSV values
        return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      })
    );
    
    // Combine headers and data
    const csvContent = [csvHeaders.join(','), ...csvData.map(row => row.join(','))].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center">
        <ListChecks className="mr-3 h-8 w-8 text-accent" />
        View Registrations
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Member Registrations</CardTitle>
        </CardHeader>
         <CardContent>
          {loading && <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-3 text-muted-foreground">Loading Registrations...</p></div>}
          {error && <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg"><AlertCircle className="h-5 w-5 mr-3" /><p>{error}</p></div>}
          {!loading && !error && (
            <div className="space-y-3">
              {memberRegistrations.length > 0 ? (
                <>
                  {memberRegistrations.map(registration => (
                    <div key={registration.id} className="p-4 border rounded-md space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{registration.fullName || registration.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(registration.registrationDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p><strong>Email:</strong> {registration.email}</p>
                        {registration.phone && <p><strong>Phone:</strong> {registration.phone}</p>}
                        {registration.studentId && <p><strong>Student ID:</strong> {registration.studentId}</p>}
                        {registration.interests && <p><strong>Interests:</strong> {registration.interests}</p>}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      downloadCsv(
                        memberRegistrations, 
                        'member-registrations', 
                        ['fullName', 'email', 'phone', 'studentId', 'interests', 'registrationDate']
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">No member registrations found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Event Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-3 text-muted-foreground">Loading Registrations...</p></div>}
          {error && <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg"><AlertCircle className="h-5 w-5 mr-3" /><p>{error}</p></div>}
          {!loading && !error && (
            <div className="space-y-3">
              {eventRegistrations.length > 0 ? (
                <>
                  {eventRegistrations.map(registration => (
                    <div key={registration.id} className="p-4 border rounded-md space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{registration.fullName || registration.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(registration.registrationDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p><strong>Email:</strong> {registration.email}</p>
                        {registration.event && <p><strong>Event:</strong> {registration.event}</p>}
                        {registration.phone && <p><strong>Phone:</strong> {registration.phone}</p>}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      downloadCsv(
                        eventRegistrations,
                        'event-registrations',
                        ['fullName', 'name', 'email', 'event', 'phone', 'registrationDate']
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">No event registrations found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
