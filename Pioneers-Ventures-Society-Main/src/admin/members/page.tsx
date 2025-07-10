import { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { DeleteMemberDialog } from '../../components/ui/DeleteMemberDialog';

interface Member {
  id: string;
  name: string;
  email: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore();
        // Assuming members are stored in a 'members' collection
        const membersCollection = collection(db, 'members');
        const q = query(membersCollection, orderBy('name', 'asc'));
        const memberSnapshot = await getDocs(q);
        const memberList = memberSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Member));
        setMembers(memberList);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load members list.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [refreshKey]);

  const filteredMembers = useMemo(() => {
    return members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center">
        <Users className="mr-3 h-8 w-8 text-accent" />
        Manage Members
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Member Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="mb-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading && <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-3 text-muted-foreground">Loading Members...</p></div>}
          {error && <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg"><AlertCircle className="h-5 w-5 mr-3" /><p>{error}</p></div>}
          
          {!loading && !error && (
            <div className="space-y-3">
              {filteredMembers.length > 0 ? (
                filteredMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="space-x-2">
                      {/* TODO: Create a member detail view page */}
                      <Button variant="outline" size="sm" disabled>View</Button>
                      <DeleteMemberDialog
                        memberId={member.id}
                        memberName={member.name}
                        onMemberDeleted={() => setRefreshKey(prev => prev + 1)}>
                        <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                      </DeleteMemberDialog>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">{searchTerm ? 'No members match your search.' : 'No members found.'}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
