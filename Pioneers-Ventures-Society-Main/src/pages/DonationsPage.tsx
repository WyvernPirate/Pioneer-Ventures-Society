import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Heart, DollarSign, Users, Target, CheckCircle } from 'lucide-react';

// Define a Zod schema for donation form validation
const donationSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  amount: z.number().min(1, "Donation amount must be at least $1"),
  donationType: z.enum(['one-time', 'monthly'], {
    required_error: "Please select a donation type",
  }),
  purpose: z.enum(['general', 'events', 'scholarships', 'equipment', 'other'], {
    required_error: "Please select a donation purpose",
  }),
  message: z.string().optional(),
  anonymous: z.boolean().default(false),
});

interface DonationFormData extends z.infer<typeof donationSchema> {}

const donationAmounts = [10, 25, 50, 100, 250, 500];

const donationPurposes = [
  { value: 'general', label: 'General Support', description: 'Support overall PVS operations and programs' },
  { value: 'events', label: 'Events & Workshops', description: 'Fund community events and educational workshops' },
  { value: 'scholarships', label: 'Student Scholarships', description: 'Support student members with financial assistance' },
  { value: 'equipment', label: 'Equipment & Resources', description: 'Purchase tools and resources for members' },
  { value: 'other', label: 'Other', description: 'Specify your preferred use in the message' },
];

export default function DonationsPage() {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setValue,
    watch,
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      amount: 0,
      donationType: 'one-time',
      purpose: 'general',
      message: "",
      anonymous: false,
    },
  });

  const watchedAmount = watch('amount');

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setValue('amount', amount);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setValue('amount', numValue);
    }
  };

  const onSubmit = async (data: DonationFormData) => {
    try {
      const donationData = {
        ...data,
        donationDate: new Date().toISOString(),
        status: 'pending', // Will be updated after payment processing
        paymentMethod: 'pending', // Will be updated after payment processing
      };

      const docRef = await addDoc(collection(db, "donations"), donationData);
      console.log("Donation record created with ID: ", docRef.id);
      
      // Here you would typically redirect to a payment processor
      // For now, we'll just show success message
      reset();
      setSelectedAmount(null);
      setCustomAmount('');
    } catch (e) {
      console.error("Error submitting donation: ", e);
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="shadow-xl border-green-200">
              <CardContent className="p-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-green-700 mb-4">Thank You!</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Your donation has been recorded. You will receive payment instructions via email shortly.
                </p>
                <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
                  Make Another Donation
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Heart className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4">
            Support Our Mission
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
            Your donation helps us empower the next generation of innovators and entrepreneurs. 
            Every contribution makes a difference in building a stronger community.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-accent mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-primary mb-2">100+</h3>
                <p className="text-muted-foreground">Members Supported</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Target className="h-12 w-12 text-accent mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-primary mb-2">20+</h3>
                <p className="text-muted-foreground">Events Hosted</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <DollarSign className="h-12 w-12 text-accent mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-primary mb-2">P5K+</h3>
                <p className="text-muted-foreground">In Scholarships</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Donation Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary text-center">Make a Donation</CardTitle>
              <CardDescription className="text-center">
                Choose your donation amount and help us continue our mission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Donation Amount */}
                <div>
                  <Label className="text-primary font-semibold text-lg mb-4 block">Donation Amount</Label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {donationAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={selectedAmount === amount ? "default" : "outline"}
                        onClick={() => handleAmountSelect(amount)}
                        className="h-12"
                      >
                        P{amount}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="custom-amount" className="text-sm">Custom Amount:</Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                </div>

                {/* Donation Type */}
                <div>
                  <Label className="text-primary font-semibold">Donation Type</Label>
                  <Select onValueChange={(value) => setValue('donationType', value as 'one-time' | 'monthly')}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select donation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time Donation</SelectItem>
                      <SelectItem value="monthly">Monthly Recurring</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.donationType && <p className="text-red-500 text-sm">{errors.donationType.message}</p>}
                </div>

                {/* Donation Purpose */}
                <div>
                  <Label className="text-primary font-semibold">How should we use your donation?</Label>
                  <Select onValueChange={(value) => setValue('purpose', value as any)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select donation purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {donationPurposes.map((purpose) => (
                        <SelectItem key={purpose.value} value={purpose.value}>
                          <div>
                            <div className="font-medium">{purpose.label}</div>
                            <div className="text-sm text-muted-foreground">{purpose.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.purpose && <p className="text-red-500 text-sm">{errors.purpose.message}</p>}
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-primary font-semibold">Full Name</Label>
                    <Input
                      type="text"
                      id="fullName"
                      {...register("fullName")}
                      placeholder="Your full name"
                      className="mt-1"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-primary font-semibold">Email Address</Label>
                    <Input
                      type="email"
                      id="email"
                      {...register("email")}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-primary font-semibold">Phone Number (Optional)</Label>
                  <Input
                    type="tel"
                    id="phone"
                    {...register("phone")}
                    placeholder="+267 71234567"
                    className="mt-1"
                  />
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-primary font-semibold">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Any special message or instructions..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    {...register("anonymous")}
                    className="rounded border-primary/30"
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Make this donation anonymous (your name won't be displayed publicly)
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-3 text-lg font-semibold"
                  disabled={isSubmitting || watchedAmount <= 0}
                >
                  {isSubmitting ? "Processing..." : `Donate P${watchedAmount || 0}`}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                <p>Your donation is secure and helps support our community initiatives.</p>
                <p>You will receive a confirmation email with payment instructions.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}