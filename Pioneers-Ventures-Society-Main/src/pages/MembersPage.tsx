import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, Loader2, AlertCircle } from 'lucide-react';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

// Define the structure of a Member object from Firestore for the public page
interface Member {
  id: string;
  name: string;
  role: string; // e.g., 'Founder & Visionary', 'Lead Mentor', 'Member'
  image: string; // URL to profile picture
  bio: string;
  aiHint?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Our Members - Pioneer Ventures Society';

    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore();
        const membersCollection = collection(db, 'members');
        const q = query(membersCollection, orderBy('name', 'asc'));
        const memberSnapshot = await getDocs(q);
        const memberList = memberSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'No Name Provided',
            // Use a default role if not specified
            role: data.role || 'Member',
            // Use a default bio if not specified
            bio: data.bio || 'An esteemed member of the Pioneer Ventures Society.',
            // Use a default image if not specified
            image: data.image || 'https://placehold.co/400x400.png',
            aiHint: data.aiHint,
          } as Member;
        });
        setMembers(memberList);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load the member directory. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    return members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Users className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4">
            Meet Our Members
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            A community of innovators, founders, and leaders driving change.
          </p>
        </div>

        <div className="max-w-lg mx-auto mb-12">
          <Input
            type="search"
            placeholder="Search by name or role (e.g., Founder, Agri-Tech)..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">{[...Array(8)].map((_, i) => <Card key={i} className="overflow-hidden flex flex-col"><Skeleton className="w-full h-64" /><CardContent className="p-6 space-y-3"><Skeleton className="h-7 w-3/4 mx-auto" /><Skeleton className="h-5 w-1/2 mx-auto" /><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-5/6" /></CardContent></Card>)}</div>}
        {error && <p className="text-center text-lg text-red-500 flex items-center justify-center"><AlertCircle className="mr-2"/> {error}</p>}

        {!loading && !error && (
          filteredMembers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col text-center">
                  <CardHeader className="p-0"><img src={member.image} alt={`Portrait of ${member.name}`} width={400} height={400} className="w-full h-64 object-cover" data-ai-hint={member.aiHint || 'member portrait'} /></CardHeader>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <CardTitle className="font-headline text-2xl text-primary">{member.name}</CardTitle>
                    <p className="text-accent font-semibold mb-4">{member.role}</p>
                    <CardDescription className="text-foreground/70 mb-6 flex-grow">{member.bio}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-muted-foreground py-10">{searchTerm ? 'No members match your search.' : 'No members found in the directory.'}</p>
          )
        )}
      </main>
    </div>
  );
}