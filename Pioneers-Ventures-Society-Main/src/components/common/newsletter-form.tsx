'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { subscribeToNewsletter, type NewsletterFormState } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState: NewsletterFormState = {
  message: '',
  success: false,
  timestamp: Date.now(),
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      aria-disabled={pending} 
      disabled={pending} 
      className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
    >
      {pending ? 'Subscribing...' : 'Subscribe'}
    </Button>
  );
}

export default function NewsletterForm() {
  const [state, formAction] = useFormState(subscribeToNewsletter, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        // Toast for success is not per spec, but good for feedback.
        // toast({ title: "Subscribed!", description: state.message });
        // For now, rely on the text message.
        formRef.current?.reset(); // Reset form on success
      } else if (state.errors && (state.errors.email || state.errors._form)) {
        const errorMessage = state.errors.email?.[0] || state.errors._form?.[0] || state.message;
        toast({
          variant: "destructive",
          title: "Subscription Failed",
          description: errorMessage,
        });
      }
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4 w-full max-w-md">
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
        <SubmitButton />
      </div>
      {state.message && !state.errors?.email && !state.errors?._form && (
        <p 
          key={state.timestamp} // Re-trigger animation/transition if message content is same
          className={`text-sm ${state.success ? 'text-green-600' : 'text-destructive'} animate-in fade-in duration-500`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
