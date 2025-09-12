import { useState, useEffect } from 'react';
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
import { Heart, DollarSign, Users, Target, CheckCircle, CreditCard, Smartphone, Banknote, Copy, ExternalLink } from 'lucide-react';
import { getPaymentMethods, generatePaymentReference, type DonationData } from '@/lib/payment';
import { sendDonationReceivedEmail, sendAdminDonationNotification } from '@/lib/email';
import { getAdminEmails } from '@/lib/admin-config';
import ProofUpload from '@/components/ui/ProofUpload';

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

interface DonationFormData extends z.infer<typeof donationSchema> { }

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofBase64, setProofBase64] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        console.log('Loaded payment methods:', methods);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error loading payment methods:', error);
        // Fallback to empty array, component will show loading or error state
        setPaymentMethods([]);
      }
    };
    loadPaymentMethods();
  }, []);

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

  const handleProofUpload = (base64: string, file: File) => {
    setProofBase64(base64);
    setProofFile(file);
  };

  const handleProofRemove = () => {
    setProofBase64('');
    setProofFile(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const onSubmit = async (data: DonationFormData) => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      const paymentReference = generatePaymentReference('DON');
      const hasProof = !!proofBase64;

      const donationData: DonationData = {
        ...data,
        reference: paymentReference,
        paymentMethod: selectedPaymentMethod,
        proofOfPayment: proofBase64,
        description: `Donation for ${donationPurposes.find(p => p.value === data.purpose)?.label}`,
        name: data.fullName
      };

      // Save donation record to Firebase
      const docRef = await addDoc(collection(db, "donations"), {
        ...donationData,
        name: data.fullName, // Ensure name is saved correctly
        donationDate: new Date().toISOString(),
        status: hasProof ? 'pending_verification' : 'awaiting_payment',
        createdAt: new Date().toISOString(),
      });

      console.log("Donation record created with ID: ", docRef.id);

      // Send email notifications
      try {
        // Send confirmation email to donor
        await sendDonationReceivedEmail({
          email: data.email,
          name: data.fullName,
          amount: data.amount,
          reference: paymentReference,
          paymentMethod: selectedPaymentMethod,
          hasProof: hasProof
        });
        console.log('Donor email notification sent successfully');

        // Send notification emails to all admin emails
        const adminEmails = getAdminEmails();
        const adminNotificationPromises = adminEmails.map(adminEmail =>
          sendAdminDonationNotification({
            donorName: data.fullName,
            donorEmail: data.email,
            amount: data.amount,
            reference: paymentReference,
            paymentMethod: selectedPaymentMethod,
            purpose: data.purpose,
            hasProof: hasProof,
            adminEmail: adminEmail
          })
        );

        await Promise.all(adminNotificationPromises);
        console.log(`Admin notifications sent to ${adminEmails.length} admin(s)`);
      } catch (emailError) {
        console.error('Failed to send email notifications:', emailError);
        // Don't fail the donation if email fails
      }

      // Show payment instructions
      setShowPaymentInstructions(true);
    } catch (e) {
      console.error("Error submitting donation: ", e);
      alert('Failed to submit donation. Please try again.');
    }
  };



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

                {/* Payment Method */}
                <div>
                  <Label className="text-primary font-semibold text-lg mb-4 block">Choose Payment Method</Label>
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Loading payment methods...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          type="button"
                          variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className="h-20 flex flex-col items-center justify-center p-3 text-left"
                        >
                          <span className="text-2xl mb-1">{method.icon}</span>
                          <span className="text-sm font-medium">{method.name}</span>
                          <span className="text-xs text-muted-foreground text-center">{method.description}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                  {selectedPaymentMethod && (() => {
                    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
                    if (!selectedMethod) return null;

                    return (
                      <Card className="border-green-200 bg-green-50/50 mt-4">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-3">
                            <span className="text-2xl mr-2">{selectedMethod.icon}</span>
                            <div>
                              <h4 className="font-semibold text-green-800">{selectedMethod.name}</h4>
                              <p className="text-sm text-green-600">Ready to receive your donation</p>
                            </div>
                          </div>
                          
                          <div className="bg-white border border-green-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-green-800">Send to:</span>
                              <div className="flex items-center space-x-2">
                                <code className="bg-green-100 px-2 py-1 rounded text-sm font-mono text-green-800">
                                  {selectedMethod.number}
                                </code>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(selectedMethod.number)}
                                  className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-green-700">
                            <p className="font-medium mb-1">Quick Instructions:</p>
                            <ol className="space-y-1">
                              {selectedMethod.instructions.slice(0, 2).map((instruction: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <span className="font-medium mr-2 text-green-600">{index + 1}.</span>
                                  <span>{instruction}</span>
                                </li>
                              ))}
                            </ol>
                            <p className="text-xs text-green-600 mt-2 italic">
                              Complete instructions will be shown after you submit the form
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
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
                      <SelectItem value="monthly" disabled={true}>
                        Monthly Recurring (Coming Soon)
                      </SelectItem>
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

                {/* Proof of Payment Upload */}
                <div>
                  <Label className="text-primary font-semibold">Proof of Payment (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedPaymentMethod
                      ? 'Upload a screenshot of your payment confirmation to speed up verification'
                      : 'You can upload proof of payment after making the payment, or submit now and upload later'
                    }
                  </p>
                  <ProofUpload
                    onFileSelect={handleProofUpload}
                    onFileRemove={handleProofRemove}
                    selectedFile={proofFile}
                    disabled={isSubmitting}
                  />
                  {proofBase64 && (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Proof of payment uploaded - your donation will be verified faster!
                    </p>
                  )}
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
                  {isSubmitting ? "Processing..." : `Submit P${watchedAmount || 0} Donation`}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                <p>Your donation is secure and helps support our community initiatives.</p>
                <p>You will receive a confirmation email with payment instructions.</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          {showPaymentInstructions && (
            <Card className="mt-8 border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <CheckCircle className="mr-2 h-6 w-6" />
                  Donation Submitted Successfully!
                </CardTitle>
                <CardDescription>
                  Follow the instructions below to complete your P{watchedAmount} donation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
                  if (!selectedMethod) return null;

                  return (
                    <Card className="border-muted">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <span className="text-2xl mr-2">{selectedMethod.icon}</span>
                          {selectedMethod.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Send to:</span>
                          <code className="bg-muted px-2 py-1 rounded text-sm">{selectedMethod.number}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(selectedMethod.number)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2 text-sm">
                          {selectedMethod.instructions.map((instruction: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="font-medium mr-2 text-accent">{index + 1}.</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  );
                })()}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Make the payment using the instructions above</li>
                    <li>• {proofBase64 ? 'We received your proof of payment and will verify it within 24 hours' : 'Upload proof of payment for faster verification (optional)'}</li>
                    <li>• You\'ll receive a confirmation email once verified</li>
                    <li>• Contact us at finance@pioneer-ventures-society.org if you need help</li>
                  </ul>
                </div>

                <div className="flex justify-center space-x-4 pt-4">
                  <Button
                    onClick={() => setShowPaymentInstructions(false)}
                    variant="outline"
                  >
                    Make Another Donation
                  </Button>
                  <Button asChild>
                    <a href="/">Back to Home</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}