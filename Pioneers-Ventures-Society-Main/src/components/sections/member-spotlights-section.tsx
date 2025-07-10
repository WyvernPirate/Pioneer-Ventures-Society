import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { Users, ArrowRight, AlertCircle } from 'lucide-react';
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface Member {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  aiHint?: string;
}

export default function MemberSpotlightsSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpotlightMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore();
        const membersCollection = collection(db, 'members');
        // Fetch up to 3 members marked for the spotlight
        const q = query(membersCollection, where('spotlight', '==', true), orderBy('name', 'asc'), limit(3));
        const memberSnapshot = await getDocs(q);
        const memberList = memberSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Member));
        setMembers(memberList);
      } catch (err) {
        console.error("Error fetching spotlight members:", err);
        setError("Failed to load member spotlights.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpotlightMembers();
  }, []);

  return (
    <section id="meet-our-founders" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Users className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
            Meet Our Founders & Members
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            The dedicated individuals leading the charge and making an impact.
          </p>
        </div>

        {loading && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{[...Array(3)].map((_, i) => <Card key={i} className="overflow-hidden flex flex-col"><Skeleton className="w-full h-64" /><CardContent className="p-6 space-y-3"><Skeleton className="h-7 w-3/4 mx-auto" /><Skeleton className="h-5 w-1/2 mx-auto" /><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-5/6" /><Skeleton className="h-10 w-1/3 mx-auto mt-2" /></CardContent></Card>)}</div>}
        {error && <p className="text-center text-lg text-red-500 flex items-center justify-center"><AlertCircle className="mr-2"/> {error}</p>}

        {!loading && !error && (
          members.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <Card key={member.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col text-center">
                  <CardHeader className="p-0">
                    <img 
                      src={member.image} 
                      alt={`Portrait of ${member.name}`}
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover"
                      data-ai-hint={member.aiHint || 'member portrait'}
                    />
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <CardTitle className="font-headline text-2xl text-primary">{member.name}</CardTitle>
                    <p className="text-accent font-semibold mb-4">{member.role}</p>
                    <CardDescription className="text-foreground/70 mb-6 flex-grow">{member.bio}</CardDescription>
                    <Button variant="outline" asChild className="mt-auto w-fit self-center border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"><Link to="/members"><span className="flex items-center">View Directory <ArrowRight className="ml-2 h-4 w-4" /></span></Link></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">Spotlight members will be featured here soon.</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
