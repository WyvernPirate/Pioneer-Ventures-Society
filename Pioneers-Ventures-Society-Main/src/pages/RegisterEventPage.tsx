import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSearchParams } from 'react-router-dom';

// Define a Zod schema for form validation
const formSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  specialRequests: z.string().optional(),
});

interface FormData extends z.infer<typeof formSchema> {}

interface Event {
  id: string;
  title: string;
}

export default function RegisterEventPage() {
  const [eventName, setEventName] = useState<string | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event');

  useEffect(() => {
    const fetchEventName = async () => {
      if (eventId) {
        try {
          const eventDoc = await getDoc(doc(db, 'events', eventId));
          if (eventDoc.exists()) {
            setEventName(eventDoc.data()?.title);
          } else {
            console.error("Event not found");
            setEventName("Event Not Found");
          }
        } catch (error) {
          console.error("Error fetching event:", error);
          setEventName("Error Loading Event");
        } finally {
          setLoadingEvent(false);
        }
      } else {
        setLoadingEvent(false);
      }
    };

    fetchEventName();
  }, [eventId]);

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
      organization: "",
      dietaryRestrictions: "",
      specialRequests: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!eventId) {
      console.error("No event ID provided");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "eventRegistrations"), {
        ...data,
        eventId: eventId,
        eventName: eventName,
        registrationDate: new Date().toISOString(),
      });
      console.log("Event registration submitted with ID: ", docRef.id);
      reset(); // Clear the form on successful submission
    } catch (e) {
      console.error("Error submitting event registration: ", e);
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
              <CardTitle className="font-headline text-3xl text-primary text-center">Register for {loadingEvent ? "Event" : eventName || "Event"}</CardTitle>
              {eventId && !loadingEvent && eventName !== "Event Not Found" && eventName !== "Error Loading Event" && (
                <CardDescription className="text-center">You are registering for: {eventName}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground">
                Fill out the form below to complete your registration.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-primary font-semibold">Full Name</Label>
                  <Input type="text" id="fullName" {...register("fullName")} placeholder="e.g., Tshepo Molefe" className="mt-1 border-primary/30 focus:ring-accent" />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-primary font-semibold">Email Address</Label>
                  <Input type="email" id="email" {...register("email")} placeholder="e.g., tshepo@example.com" className="mt-1 border-primary/30 focus:ring-accent" />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-primary font-semibold">Phone Number (Optional)</Label>
                  <Input type="tel" id="phone" {...register("phone")} placeholder="e.g., +267 71234567" className="mt-1 border-primary/30 focus:ring-accent" />
                </div>

                <div>
                  <Label htmlFor="organization" className="text-primary font-semibold">Organization/University (Optional)</Label>
                  <Input type="text" id="organization" {...register("organization")} placeholder="e.g., BIUST, UB, Company Name" className="mt-1 border-primary/30 focus:ring-accent" />
                </div>

                <div>
                  <Label htmlFor="dietaryRestrictions" className="text-primary font-semibold">Dietary Restrictions (Optional)</Label>
                  <Input type="text" id="dietaryRestrictions" {...register("dietaryRestrictions")} placeholder="e.g., Vegetarian, Halal, Allergies" className="mt-1 border-primary/30 focus:ring-accent" />
                </div>

                <div>
                  <Label htmlFor="specialRequests" className="text-primary font-semibold">Special Requests or Questions (Optional)</Label>
                  <Input type="text" id="specialRequests" {...register("specialRequests")} placeholder="Any special accommodations needed?" className="mt-1 border-primary/30 focus:ring-accent" />
                </div>

                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-3 text-lg font-semibold" disabled={isSubmitting || loadingEvent}>
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}