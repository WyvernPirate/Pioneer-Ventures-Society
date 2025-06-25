import { useState, useEffect } from 'react';
// import { generateInspirationalQuote } from '@/ai/flow/generate-inspirational-qoute'; // Temporarily disabled
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

type InspirationalQuoteProps = {
  keywords: string;
  context: string;
  className?: string;
};

export default function InspirationalQuote({ keywords, context, className }: InspirationalQuoteProps) {
  const [quote, setQuote] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // This simulates fetching the quote from a server API.
    // The real AI generation logic must be moved to an API endpoint.
    const mockApiCall = () => {
      setTimeout(() => {
        if (isMounted) {
          setQuote("The best way to predict the future is to create it. Your journey with PVS starts now.");
        }
      }, 1000); // Simulate network delay
    };

    mockApiCall();

    return () => { isMounted = false; };
  }, [keywords, context]);

  if (error) {
    return <p className={cn("text-sm text-muted-foreground mt-4", className)}>An inspirational quote will appear here soon.</p>;
  }

  if (!quote) return null; // Or a loading skeleton

  return (
    <div className={cn("mt-8 p-6 rounded-lg shadow-lg bg-card border border-primary/20", className)}>
      <div className="flex items-center mb-3">
        <Lightbulb className="h-6 w-6 mr-3 text-primary" />
        <h3 className="font-headline text-xl text-primary">Inspired Thought</h3>
      </div>
      <blockquote className="italic text-foreground/90 text-lg">"{quote}"</blockquote>
    </div>
  );
}
