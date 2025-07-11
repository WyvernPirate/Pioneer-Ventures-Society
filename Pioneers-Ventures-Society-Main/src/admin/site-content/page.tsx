import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const heroDocRef = doc(db, 'siteContent', 'pic');
        const heroDocSnap = await getDoc(heroDocRef);
        if (heroDocSnap.exists()) {
          setHeroData(heroDocSnap.data() as HeroContent);
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
    setSaving(true);
    try {
      let imageUrl = heroData.imageUrl;
      if (heroImageFile) {
        const storageRef = ref(storage, `site-content/pic/${Date.now()}-${heroImageFile.name}`);
        await uploadBytes(storageRef, heroImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const updatedHeroData = { ...heroData, imageUrl };
      const heroDocRef = doc(db, 'siteContent', 'pic');
      await setDoc(heroDocRef, updatedHeroData, { merge: true });
      
      setHeroData(updatedHeroData);
      setHeroImageFile(null); // Clear file input after upload
      toast({
        title: "Success",
        description: "Hero section content has been updated.",
      });
    } catch (error) {
      console.error("Error saving hero content:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save hero section." });
    } finally {
      setSaving(false);
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
              <Button onClick={handleHeroSave} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {saving ? (
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
          <Textarea id="mission" defaultValue="PVS exists to challenge the norm, to shift people from passively chasing jobs to actively building solutions..." className="mt-1 mb-3 border-primary/30 focus:ring-accent" rows={4} />
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Save className="mr-2 h-4 w-4" /> Save Mission
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Core Values</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Placeholder for editing core values (e.g., Entrepreneurship, Collaboration).</p>
          <div className="mt-2">
            <Label htmlFor="value-entrepreneurship" className="text-primary font-semibold">Entrepreneurship</Label>
            <Textarea id="value-entrepreneurship" defaultValue="At the core of PVS is the belief that entrepreneurship isn’t just about owning a business..." className="mt-1 mb-3 border-primary/30 focus:ring-accent" rows={3} />
             <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Save className="mr-2 h-4 w-4" /> Save Value
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}