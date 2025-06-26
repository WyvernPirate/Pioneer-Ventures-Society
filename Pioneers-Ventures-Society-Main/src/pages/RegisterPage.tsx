import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function RegisterPage() {
  // For now, this is a static form.
  // To make it interactive with react-hook-form, you would add state management
  // and a submission handler (e.g., calling an API endpoint).

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary text-center">Become a PVS Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground">
                Join the Pioneer Ventures Society to connect with innovators, access resources, and participate in exclusive events. Fill out the form below to become a member.
              </p>
              <form className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-primary font-semibold">Full Name</Label>
                  <Input type="text" id="fullName" name="fullName" placeholder="e.g., Tshepo Molefe" required className="mt-1 border-primary/30 focus:ring-accent" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-primary font-semibold">Email Address</Label>
                  <Input type="email" id="email" name="email" placeholder="e.g., tshepo@example.com" required className="mt-1 border-primary/30 focus:ring-accent" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-primary font-semibold">Phone Number (For WhatsApp)</Label>
                  <Input type="tel" id="phone" name="phone" placeholder="e.g., +267 71234567" className="mt-1 border-primary/30 focus:ring-accent" />
                </div>
                <div>
                  <Label htmlFor="studentId" className="text-primary font-semibold">University/Affiliation ID (Optional)</Label>
                  <Input type="text" id="studentId" name="studentId" placeholder="e.g., BIUST 202001234" className="mt-1 border-primary/30 focus:ring-accent" />
                </div>
                <div>
                  <Label htmlFor="interests" className="text-primary font-semibold">Areas of Interest</Label>
                  <Textarea
                    id="interests"
                    name="interests"
                    placeholder="e.g., AI, Agri-Tech, Renewable Energy, Social Entrepreneurship, FinTech, etc."
                    className="mt-1 border-primary/30 focus:ring-accent"
                    rows={3}
                  />
                   <p className="text-xs text-muted-foreground mt-1">Briefly list your entrepreneurial or innovation interests.</p>
                </div>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-3 text-lg font-semibold">
                  Submit Registration
                </Button>
              </form>
              <p className="text-xs text-muted-foreground text-center pt-4">
                By submitting this form, you consent to be added to our contact list and relevant communication channels (e.g., WhatsApp group). Your information will be handled in accordance with our privacy policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}