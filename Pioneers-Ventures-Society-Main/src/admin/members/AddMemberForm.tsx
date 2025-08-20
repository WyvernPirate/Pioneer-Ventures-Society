import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, AlertCircle } from 'lucide-react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { type Member } from '@/types';

interface AddMemberFormProps {
  onMemberAdded: () => void;
  children: React.ReactNode;
}

export function AddMemberForm({ onMemberAdded, children }: AddMemberFormProps) {
  const initialFormData: Omit<Member, 'id'> = {
    name: '',
    email: '',
    role: '',
    bio: '',
    image: 'https://placehold.co/400x400.png',
    spotlight: false,
  };

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<{ submitting: boolean; error: string | null }>({
    submitting: false,
    error: null,
  });
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData(initialFormData);
    setStatus({ submitting: false, error: null });
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setStatus({ submitting: false, error: "Member Name and Email are required." });
      return;
    }

    setStatus({ submitting: true, error: null });

    try {
      const db = getFirestore();
      const storage = getStorage();
      let imageUrl = formData.image;

      if (imageFile) {
        const storageRef = ref(storage, `members/pics/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const newMemberData = { ...formData, image: imageUrl };
      await addDoc(collection(db, 'members'), newMemberData);
      
      onMemberAdded();
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Error adding member:", err);
      setStatus({ submitting: false, error: "Failed to add member. Please try again." });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Fill in the details for the new member. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Full Name</Label><Input id="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" required /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="role" className="text-right">Role</Label><Input id="role" value={formData.role} onChange={handleInputChange} placeholder="e.g., Founder, Mentor" className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="bio" className="text-right pt-2">Bio</Label><Textarea id="bio" value={formData.bio} onChange={handleInputChange} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image-upload" className="text-right">Profile Image</Label>
              <div className="col-span-3">
                <div className="flex items-center gap-4">
                  {(formData.image || imageFile) && (
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.image} 
                      alt="Member preview" 
                      className="h-20 w-20 object-cover rounded-full border" 
                    />
                  )}
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        // Only allow safe image types (no SVG)
                        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                        if (allowedTypes.includes(file.type)) {
                          setImageFile(file);
                          setImageError(null);
                        } else {
                          setImageFile(null);
                          setImageError('Only JPG, PNG, GIF, or WebP images are allowed. SVG files are not supported for security reasons.');
                        }
                      } else {
                        setImageFile(null);
                        setImageError(null);
                      }
                    }}
                    className="flex-1"
                  />
                </div>
                {imageFile && <p className="text-sm text-muted-foreground mt-2">New image selected: {imageFile.name}</p>}
                {imageError && <p className="text-sm text-destructive mt-2">{imageError}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="spotlight" className="text-right">Feature on Homepage</Label><Switch id="spotlight" checked={formData.spotlight} onCheckedChange={(checked) => setFormData(prev => ({...prev, spotlight: checked}))} /></div>
            {status.error && <div className="col-span-4 flex items-center p-3 bg-destructive/10 text-destructive rounded-lg text-sm"><AlertCircle className="h-4 w-4 mr-2" />{status.error}</div>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={status.submitting}>
              {status.submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}