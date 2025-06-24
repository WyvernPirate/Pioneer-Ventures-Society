// src/app/actions.ts
'use server';
import { z } from 'zod';

const NewsletterSubscriptionSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export type NewsletterFormState = {
  message: string;
  success: boolean;
  errors?: {
    email?: string[];
    _form?: string[];
  };
  timestamp?: number; // To ensure re-render on subsequent same messages
};

export async function subscribeToNewsletter(
  prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const validatedFields = NewsletterSubscriptionSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      message: "Subscription failed.",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  const { email } = validatedFields.data;

  try {
    // Simulate API call or database interaction
    console.log(`Subscribing email to newsletter: ${email}`);
    // In a real app, you'd save this to a database or mailing list service.
    
    // Simulate a delay for the API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate potential server-side error for demonstration
    // if (email.endsWith('error.com')) {
    //   throw new Error("Simulated server error during subscription.");
    // }

    return {
      message: "Thank you for subscribing to our newsletter!",
      success: true,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      success: false,
      errors: { _form: ["Subscription failed due to a server error."] },
      timestamp: Date.now(),
    };
  }
}
