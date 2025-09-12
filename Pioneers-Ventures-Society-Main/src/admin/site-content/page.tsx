import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { HeroContent } from '@/types/site-content';
import type { Initiative, InitiativeFormData } from '@/types/initiatives';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Settings, Save, Loader2, Plus, Edit, Trash2, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InitiativeDialog from './InitiativeDialog';
import { seedInitiatives } from './seedInitiatives';

export default function AdminSiteContentPage() {
  const { toast } = useToast();
  const [heroData, setHeroData] = useState<Partial<HeroContent>>({
    headline: '',
    subheadline: '',
    imageUrl: '',
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);

  // Initiatives state
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [showInitiativeDialog, setShowInitiativeDialog] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const [savingInitiative, setSavingInitiative] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Fetch hero content (image and text)
        const heroDocRef = doc(db, 'siteContent', 'pic');
        const heroDocSnap = await getDoc(heroDocRef);
        if (heroDocSnap.exists()) {
          setHeroData(heroDocSnap.data() as HeroContent);
        }



        // Fetch initiatives
        const initiativesQuery = query(collection(db, 'initiatives'), orderBy('order', 'asc'));
        const initiativesSnapshot = await getDocs(initiativesQuery);
        const initiativesList = initiativesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Initiative[];
        setInitiatives(initiativesList);

      } catch (error) {
        console.error("Error fetching site content:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load site content.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [toast]);

  const handleHeroSave = async () => {
    setSavingHero(true);
    const originalHeroData = { ...heroData }; // Keep a copy in case of failure
    let newImageUrl: string | null = null;
    let oldImageUrlToDelete: string | null = null;

    try {
      let updatedData = { ...heroData };

      // 1. If there's a new file, upload it and get the URL
      if (heroImageFile) {
        const storageRef = ref(storage, `site-content/pic/${Date.now()}-${heroImageFile.name}`);
        await uploadBytes(storageRef, heroImageFile);
        newImageUrl = await getDownloadURL(storageRef);
        updatedData.imageUrl = newImageUrl;
        oldImageUrlToDelete = originalHeroData.imageUrl || null;
      }

      // 2. Save the updated content to Firestore
      const heroDocRef = doc(db, 'siteContent', 'pic');
      await setDoc(heroDocRef, updatedData, { merge: true });
      
      // 3. Update local state and show success
      setHeroData(updatedData);
      setHeroImageFile(null); // Clear file input after successful upload
      toast({
        title: "Success",
        description: "Hero section content has been updated.",
      });

      // 4. Clean up the old image from storage after everything else succeeded
      if (oldImageUrlToDelete) {
        try {
          const oldImageRef = ref(storage, oldImageUrlToDelete);
          await deleteObject(oldImageRef);
        } catch (deleteError: any) {
          if (deleteError.code !== 'storage/object-not-found') {
            console.error("Could not delete old hero image, but content was saved:", deleteError);
          }
        }
      }
    } catch (error: any) {
      console.error("Error saving hero content:", error);
      setHeroData(originalHeroData);
      let description = "Failed to save hero section.";
      // Check for the specific permission error from Firebase Storage
      if (error.code === 'storage/unknown' && error.serverResponse?.includes('412')) {
        description = "Permission error with Firebase Storage. Please check Google Cloud IAM roles for the storage service account.";
      } else if (error.code === 'storage/unauthorized') {
        description = "You are not authorized to upload files. Check your Storage security rules.";
      }
      toast({ variant: "destructive", title: "Error", description });
    } finally {
      setSavingHero(false);
    }
  };



  // Initiative management functions
  const handleInitiativeEdit = (initiative: Initiative) => {
    setEditingInitiative(initiative);
    setShowInitiativeDialog(true);
  };

  const handleSeedInitiatives = async () => {
    setSeeding(true);
    try {
      await seedInitiatives();
      // Refresh initiatives list
      const initiativesQuery = query(collection(db, 'initiatives'), orderBy('order', 'asc'));
      const initiativesSnapshot = await getDocs(initiativesQuery);
      const initiativesList = initiativesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Initiative[];
      setInitiatives(initiativesList);
      
      toast({
        title: "Success",
        description: "Default initiatives have been added. You can now edit them and add your own images.",
      });
    } catch (error) {
      console.error("Error seeding initiatives:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to seed initiatives.",
      });
    } finally {
      setSeeding(false);
    }
  };

  const validateImageSize = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isValidSize = img.width === 600 && img.height === 400;
        if (!isValidSize) {
          toast({
            variant: "destructive",
            title: "Invalid Image Size",
            description: "Image must be exactly 600x400 pixels.",
          });
        }
        resolve(isValidSize);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleInitiativeSave = async (formData: InitiativeFormData, imageFile: File | null) => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Title and description are required.",
      });
      return;
    }

    if (!editingInitiative && !imageFile) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Image is required for new initiatives.",
      });
      return;
    }

    if (imageFile) {
      const isValidSize = await validateImageSize(imageFile);
      if (!isValidSize) return;
    }

    setSavingInitiative(true);
    try {
      let imageUrl = editingInitiative?.imageUrl || '';

      // Upload new image if provided
      if (imageFile) {
        const storageRef = ref(storage, `initiatives/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);

        // Delete old image if editing and it's not a placeholder
        if (editingInitiative?.imageUrl && !editingInitiative.imageUrl.includes('placehold.co')) {
          try {
            const oldImageRef = ref(storage, editingInitiative.imageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.warn('Could not delete old image:', error);
          }
        }
      }

      const initiativeData = {
        ...formData,
        imageUrl,
        updatedAt: new Date().toISOString(),
        ...(editingInitiative ? {} : { createdAt: new Date().toISOString() }),
      };

      if (editingInitiative) {
        // Update existing initiative
        await updateDoc(doc(db, 'initiatives', editingInitiative.id!), initiativeData);
        setInitiatives(prev => prev.map(init => 
          init.id === editingInitiative.id ? { ...init, ...initiativeData } : init
        ));
        toast({
          title: "Success",
          description: "Initiative updated successfully.",
        });
      } else {
        // Create new initiative
        const docRef = await addDoc(collection(db, 'initiatives'), initiativeData);
        setInitiatives(prev => [...prev, { id: docRef.id, ...initiativeData } as Initiative]);
        toast({
          title: "Success",
          description: "Initiative created successfully.",
        });
      }

      setShowInitiativeDialog(false);
      setEditingInitiative(null);
    } catch (error) {
      console.error("Error saving initiative:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save initiative.",
      });
    } finally {
      setSavingInitiative(false);
    }
  };

  const handleInitiativeDelete = async (initiative: Initiative) => {
    if (!confirm(`Are you sure you want to delete "${initiative.title}"?`)) return;

    try {
      await deleteDoc(doc(db, 'initiatives', initiative.id!));
      
      // Delete image from storage if it's not a placeholder
      if (initiative.imageUrl && !initiative.imageUrl.includes('placehold.co')) {
        try {
          const imageRef = ref(storage, initiative.imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn('Could not delete image:', error);
        }
      }

      setInitiatives(prev => prev.filter(init => init.id !== initiative.id));
      toast({
        title: "Success",
        description: "Initiative deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting initiative:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete initiative.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center">
        <Settings className="mr-3 h-8 w-8 text-accent" />
        Edit Site Content
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
            <>
              <div>
                <Label htmlFor="hero-headline" className="text-primary font-semibold">Headline</Label>
                <Input id="hero-headline" value={heroData.headline} onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })} className="mt-1 border-primary/30 focus:ring-accent" />
              </div>
              <div>
                <Label htmlFor="hero-subheadline" className="text-primary font-semibold">Subheadline</Label>
                <Textarea id="hero-subheadline" value={heroData.subheadline} onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })} className="mt-1 border-primary/30 focus:ring-accent" rows={4} />
              </div>
              <div>
                <Label htmlFor="hero-image" className="text-primary font-semibold">Hero Image</Label>
                <div className="flex items-center gap-4 mt-1">
                  {heroData.imageUrl && <img src={heroData.imageUrl} alt="Current hero" className="h-20 w-20 object-cover rounded-md border" />}
                  <Input id="hero-image" type="file" accept="image/*" onChange={(e) => e.target.files && setHeroImageFile(e.target.files[0])} className="border-primary/30 focus:ring-accent" />
                </div>
                {heroImageFile && <p className="text-sm text-muted-foreground mt-2">New image selected: {heroImageFile.name}</p>}
              </div>
              <Button onClick={handleHeroSave} disabled={savingHero} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {savingHero ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Hero Section
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Initiatives Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Initiatives Management</CardTitle>
            <div className="flex space-x-2">
              {initiatives.length === 0 && (
                <Button 
                  onClick={handleSeedInitiatives}
                  disabled={seeding}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  {seeding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Seeding...
                    </>
                  ) : (
                    <>
                      <Sprout className="mr-2 h-4 w-4" />
                      Add Default Initiatives
                    </>
                  )}
                </Button>
              )}
              <Button 
                onClick={() => {
                  setEditingInitiative(null);
                  setShowInitiativeDialog(true);
                }}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Initiative
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {initiatives.map((initiative) => (
                <div key={initiative.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={initiative.imageUrl} 
                      alt={initiative.title}
                      className="w-20 h-14 object-cover rounded border"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{initiative.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                        {initiative.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          Order: {initiative.order}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          initiative.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {initiative.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInitiativeEdit(initiative)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleInitiativeDelete(initiative)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {initiatives.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <Sprout className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-lg font-medium">No initiatives found</p>
                    <p className="text-sm">Get started by adding default initiatives or create your own</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Initiative Dialog */}
      <InitiativeDialog
        open={showInitiativeDialog}
        onOpenChange={setShowInitiativeDialog}
        initiative={editingInitiative}
        onSave={handleInitiativeSave}
        saving={savingInitiative}
      />
    </div>
  );
}