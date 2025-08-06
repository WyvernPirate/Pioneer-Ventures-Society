import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { HeroContent } from '@/types/site-content';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Settings, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminSiteContentPage() {
  const { toast } = useToast();
  const [heroData, setHeroData] = useState<Partial<HeroContent>>({
    headline: '',
    subheadline: '',
    imageUrl: '',
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [mission, setMission] = useState('');
  const [coreValues, setCoreValues] = useState({ entrepreneurship: '' });
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [savingMission, setSavingMission] = useState(false);
  const [savingValues, setSavingValues] = useState(false);

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

        // Fetch text content (mission and values)
        const textContentDocRef = doc(db, 'siteContent', 'textContent');
        const textContentSnap = await getDoc(textContentDocRef);
        if (textContentSnap.exists()) {
          const data = textContentSnap.data();
          setMission(data.mission || '');
          setCoreValues(data.coreValues || { entrepreneurship: '' });
        }
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

  const handleMissionSave = async () => {
    setSavingMission(true);
    try {
      const textContentDocRef = doc(db, 'siteContent', 'textContent');
      await setDoc(textContentDocRef, { mission }, { merge: true });
      toast({
        title: "Success",
        description: "Mission statement has been updated.",
      });
    } catch (error) {
      console.error("Error saving mission statement:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save mission statement." });
    } finally {
      setSavingMission(false);
    }
  };

  const handleValuesSave = async () => {
    setSavingValues(true);
    try {
      const textContentDocRef = doc(db, 'siteContent', 'textContent');
      // Saving the whole object to allow for more values in the future
      await setDoc(textContentDocRef, { coreValues }, { merge: true });
      toast({
        title: "Success",
        description: "Core values have been updated.",
      });
    } catch (error) {
      console.error("Error saving core values:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save core values.",
      });
    } finally {
      setSavingValues(false);
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

      <Card>
        <CardHeader>
          <CardTitle>Mission Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="mission" className="text-primary font-semibold">Current Mission</Label>
          <Textarea id="mission" value={mission} onChange={(e) => setMission(e.target.value)} className="mt-1 mb-3 border-primary/30 focus:ring-accent" rows={4} disabled={loading} />
          <Button onClick={handleMissionSave} disabled={savingMission || loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {savingMission ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Mission
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Core Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value-entrepreneurship" className="text-primary font-semibold">Entrepreneurship</Label>
            <Textarea id="value-entrepreneurship" value={coreValues.entrepreneurship} onChange={(e) => setCoreValues({ ...coreValues, entrepreneurship: e.target.value })} className="mt-1 border-primary/30 focus:ring-accent" rows={3} disabled={loading} />
          </div>
          {/* You can add more core values here by extending the state and JSX */}
          <Button onClick={handleValuesSave} disabled={savingValues || loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {savingValues ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Core Values
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}