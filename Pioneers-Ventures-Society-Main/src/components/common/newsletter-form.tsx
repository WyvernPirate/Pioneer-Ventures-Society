import { useState, useRef, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function NewsletterForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    try {
      // TODO: Replace with a call to your API endpoint
      // For example: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
      console.log('Form submitted with email:', email);
      
      // Mock success for now
      const successMessage = "Thank you for subscribing!";
      setMessage(successMessage);
      setIsSuccess(true);
      toast({ title: "Subscribed!", description: successMessage });
      formRef.current?.reset();

    } catch (error) {
      const errorMessage = "Subscription failed. Please try again.";
      setMessage(errorMessage);
      setIsSuccess(false);
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-2 items-start w-full">
        <div className="w-full sm:flex-grow">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            aria-label="Email for newsletter"
            className="bg-background/80 border-primary/30 focus:ring-accent text-base"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
      {message && (
        <p className={`text-sm ${isSuccess ? 'text-green-600' : 'text-destructive'}`}>{message}</p>
      )}
    </form>
  );
}
