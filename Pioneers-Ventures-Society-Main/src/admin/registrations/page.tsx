
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, Download, Loader2, AlertCircle } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CSVLink  } from 'react-csv';

interface Registration {
  id?: string;
  name: string;
  email: string;
  event: string;
  registrationDate: string;
}

export default function AdminRegistrationsPage() {
  const [eventRegistrations, setEventRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      setError(null);
      try {
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
  const [memberRegistrations, setMemberRegistrations] = useState<Registration[]>([]);

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
          } catch (err) {
        console.error("Error fetching registrations:", err);
        setError("Failed to load registrations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const downloadCsv = (data: Registration[], filename: string) => {
    const csvData = data.map(item => ({ name: item.name, email: item.email, registrationDate: item.registrationDate }));
    const csvString = [Object.keys(csvData[0]).join(','), ...csvData.map(row => Object.values(row).join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
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
                    <div key={registration.id} className="flex items-center justify-between p-3 border rounded-md">
                      <span>{registration.name} ({registration.email})</span>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => downloadCsv(memberRegistrations, 'member-registrations')}>
                    <Download className="mr-2 h-4 w-4" /> Download All
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">No member registrations found.</p>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
