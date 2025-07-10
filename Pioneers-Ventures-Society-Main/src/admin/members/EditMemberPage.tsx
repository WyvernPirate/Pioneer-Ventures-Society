import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MemberData {
  name: string;
  email: string;
  role: string;
  bio: string;
  image: string;
  spotlight: boolean;
}

export default function EditMemberPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<MemberData>({
    name: '',
    email: '',
    role: '',
    bio: '',
    image: '',
    spotlight: false,
  });

  useEffect(() => {
    if (!memberId) {
      setError("Member ID is missing from URL.");
      setLoading(false);
      return;
    }

    const fetchMember = async () => {
      setLoading(true);
      setError(null);
      const db = getFirestore();
      const memberDocRef = doc(db, 'members', memberId);
      try {
        const docSnap = await getDoc(memberDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || '',
            email: data.email || '',
            role: data.role || '',
            bio: data.bio || '',
            image: data.image || '',
            spotlight: data.spotlight || false,
          });
        } else {
          setError("Member not found. It may have been deleted.");
        }
      } catch (err) {
        console.error("Error fetching member:", err);
        setError("Failed to load member data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, spotlight: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) {
      setError("Cannot submit, member ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const db = getFirestore();
      const memberDocRef = doc(db, 'members', memberId);
      await updateDoc(memberDocRef, { ...formData });
      navigate('/dashboard/members');
    } catch (err) {
      console.error("Error updating member:", err);
      setError("Failed to update member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="space-y-4 p-6 border rounded-lg">
          {[...Array(6)].map((_, i) => <div key={i} className="grid grid-cols-4 items-center gap-4"><Skeleton className="h-6 w-20" /><Skeleton className="h-10 col-span-3" /></div>)}
          <div className="flex justify-end gap-2 pt-4"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-24" /></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg"><AlertCircle className="h-5 w-5 mr-3" /><p>{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-3xl font-bold text-primary">Edit Member</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-card">
        <div className="grid gap-6">
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Full Name</Label><Input id="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="role" className="text-right">Role</Label><Input id="role" value={formData.role} onChange={handleInputChange} placeholder="e.g., Founder, Mentor" className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="bio" className="text-right pt-2">Bio</Label><Textarea id="bio" value={formData.bio} onChange={handleInputChange} className="col-span-3 min-h-[150px]" /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="image" className="text-right">Image URL</Label><Input id="image" value={formData.image} onChange={handleInputChange} className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="spotlight" className="text-right">Feature on Homepage</Label><Switch id="spotlight" checked={formData.spotlight} onCheckedChange={handleSwitchChange} /></div>
        </div>
        {error && <div className="col-span-4 flex items-center p-3 mt-4 bg-destructive/10 text-destructive rounded-lg text-sm"><AlertCircle className="h-4 w-4 mr-2" />{error}</div>}
        <div className="flex justify-end gap-2 pt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/members')}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}