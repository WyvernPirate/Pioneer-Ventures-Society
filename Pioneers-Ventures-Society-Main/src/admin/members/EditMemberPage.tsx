import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, type DocumentData } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { type Member } from '@/types';

export default function EditMemberPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();

  // Consolidate component status state
  const [status, setStatus] = useState<{ loading: boolean; submitting: boolean; error: string | null }>({
    loading: true, submitting: false, error: null
  });
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    name: '',
    email: '',
    role: '',
    bio: '',
    image: '',
    spotlight: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!memberId) {
      setStatus({ loading: false, submitting: false, error: "Member ID is missing from URL." });
      return;
    }

    const fetchMember = async () => {
      setStatus({ loading: true, submitting: false, error: null });
      const db = getFirestore();
      const memberDocRef = doc(db, 'members', memberId);
      try {
        const docSnap = await getDoc(memberDocRef);
        if (docSnap.exists()) {
          // Type assertion for safety
          const data = docSnap.data() as DocumentData;
          setFormData({
            name: data.name || '',
            email: data.email || '',
            role: data.role || '',
            bio: data.bio || '',
            image: data.image || '',
            spotlight: data.spotlight || false,
          });
          setStatus(prev => ({ ...prev, loading: false }));
        } else {
          setStatus({ loading: false, submitting: false, error: "Member not found. It may have been deleted." });
        }
      } catch (err) {
        console.error("Error fetching member:", err);
        setStatus({ loading: false, submitting: false, error: "Failed to load member data. Please try again." });
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
      // This check is slightly redundant due to useEffect but good for safety
      setStatus(prev => ({ ...prev, error: "Cannot submit, member ID is missing." }));
      return;
    }

    setStatus({ loading: false, submitting: true, error: null });

    try {
      const db = getFirestore();
      const storage = getStorage();
      let imageUrl = formData.image;
      const oldImageUrl = formData.image; // Store old image URL for deletion

      if (imageFile) {
        // 1. Upload new image
        const storageRef = ref(storage, `members/pics/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);

        // 2. Delete old image from storage if it's not a placeholder
        if (oldImageUrl && !oldImageUrl.includes('placehold.co')) {
          try {
            const oldImageRef = ref(storage, oldImageUrl);
            await deleteObject(oldImageRef);
          } catch (deleteError: any) {
            // Log error but don't block the update.
            // If the old file doesn't exist, that's fine.
            if (deleteError.code !== 'storage/object-not-found') {
              console.error("Failed to delete old member image:", deleteError);
            }
          }
        }
      }

      const memberDocRef = doc(db, 'members', memberId);
      const updatedData = { ...formData, image: imageUrl };

      await updateDoc(memberDocRef, updatedData);
      // Navigate back to the main members list on success
      navigate('/dashboard/members');
    } catch (err) {
      console.error("Error updating member:", err);
      setStatus({ loading: false, submitting: false, error: "Failed to update member. Please try again." });
    }
  };

  // Render loading skeleton
  if (status.loading) {
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

  // Render error message
  if (status.error && !formData.name) { // Only show full-page error if data hasn't loaded
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg text-destructive mb-4">{status.error}</p>
        <Button asChild><Link to="/dashboard/members"><ArrowLeft className="mr-2 h-4 w-4" />Back to Members</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild><Link to="/dashboard/members"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <h1 className="text-3xl font-bold text-primary">Edit Member</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-card">
        <div className="grid gap-6">
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Full Name</Label><Input id="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="role" className="text-right">Role</Label><Input id="role" value={formData.role} onChange={handleInputChange} placeholder="e.g., Founder, Mentor" className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="bio" className="text-right pt-2">Bio</Label><Textarea id="bio" value={formData.bio} onChange={handleInputChange} className="col-span-3 min-h-[150px]" /></div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="image-upload" className="text-right pt-2">Profile Image</Label>
            <div className="col-span-3">
              <div className="flex items-center gap-4">
                {(formData.image || imageFile) && (
                  <img 
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image} 
                    alt="Member" 
                    className="h-24 w-24 object-cover rounded-full border" 
                  />
                )}
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                  className="flex-1"
                />
              </div>
              {imageFile && <p className="text-sm text-muted-foreground mt-2">New image selected: {imageFile.name}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="spotlight" className="text-right">Feature on Homepage</Label><Switch id="spotlight" checked={formData.spotlight} onCheckedChange={handleSwitchChange} /></div>
          {status.error && <div className="col-span-4 flex items-center p-3 bg-destructive/10 text-destructive rounded-lg text-sm"><AlertCircle className="h-4 w-4 mr-2" />{status.error}</div>}
        </div>
        <div className="flex justify-end gap-2 pt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/members')} disabled={status.submitting}>Cancel</Button>
          <Button type="submit" disabled={status.submitting}>
            {status.submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}