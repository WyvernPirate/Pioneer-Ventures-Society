import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define a Zod schema for form validation
const formSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(), // Optional for now
  studentId: z.string().optional(),
  interests: z.string().optional(),
});

interface FormData extends z.infer<typeof formSchema> {}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      studentId: "",
      interests: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const docRef = await addDoc(collection(db, "memberRegistrations"), {
        ...data,
        registrationDate: new Date().toISOString(),
      });
      console.log("Document written with ID: ", docRef.id);
      reset(); // Clear the form on successful submission
    } catch (e) {
      console.error("Error adding document: ", e);
      // Handle error state if needed, e.g., display an error message to the user.
    }
  };

  if (isSubmitSuccessful) return <p className='text-center text-lg font-semibold mt-8'>Registration submitted successfully!</p>;
  
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-primary font-semibold">Full Name</Label>
                  <Input
                    type="text"
                    id="fullName"
                    {...register("fullName")}
                    placeholder="e.g., Tshepo Molefe"
                    className="mt-1 border-primary/30 focus:ring-accent"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-primary font-semibold">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    {...register("email")}
                    placeholder="e.g., tshepo@example.com"
                    className="mt-1 border-primary/30 focus:ring-accent"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Optional Fields */}

                <div>
                  <Label htmlFor="phone" className="text-primary font-semibold">Phone Number (For WhatsApp)</Label>
                  <Input type="tel" id="phone" {...register("phone")} placeholder="e.g., +267 71234567" className="mt-1 border-primary/30 focus:ring-accent" />
                </div>
                <div>
                  <Label htmlFor="studentId" className="text-primary font-semibold">University/Affiliation ID (Optional)</Label>
                  <Input type="text" id="studentId" name="studentId" placeholder="e.g., BIUST 202001234" className="mt-1 border-primary/30 focus:ring-accent" />
                </div>
                <div>
                  <Label htmlFor="interests" className="text-primary font-semibold">Areas of Interest</Label>
                  <Textarea
                    id="interests"
                    {...register("interests")}
                    placeholder="e.g., AI, Agri-Tech, Renewable Energy, Social Entrepreneurship, FinTech, etc."
                    className="mt-1 border-primary/30 focus:ring-accent"
                    rows={3}
                  />
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