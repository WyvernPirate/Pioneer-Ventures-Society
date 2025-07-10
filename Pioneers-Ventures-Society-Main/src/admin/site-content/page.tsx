
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Settings, Save, Upload } from 'lucide-react';

export default function AdminSiteContentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center">
        <Settings className="mr-3 h-8 w-8 text-accent" />
        Edit Site Content
      </h1>
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