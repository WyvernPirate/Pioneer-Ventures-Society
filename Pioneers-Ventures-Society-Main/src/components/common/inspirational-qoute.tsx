import { generateInspirationalQuote } from '@/ai/flow/generate-inspirational-qoute';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

type InspirationalQuoteProps = {
  keywords: string;
  context: string;
  className?: string;
};

export default async function InspirationalQuote({ keywords, context, className }: InspirationalQuoteProps) {
  try {
    const result = await generateInspirationalQuote({ keywords, context });
    if (result.quote) {
      return (
        <div className={cn("mt-8 p-6 rounded-lg shadow-lg bg-card border border-primary/20", className)}>
          <div className="flex items-center mb-3">
            <Lightbulb className="h-6 w-6 mr-3 text-primary" />
            <h3 className="font-headline text-xl text-primary">Inspired Thought</h3>
          </div>
          <blockquote className="italic text-foreground/90 text-lg">
            "{result.quote}"
          </blockquote>
        </div>
      );
    }
    return null; 
  } catch (error) {
    console.error("Failed to generate inspirational quote:", error);
    // Return a subtle message or log and return null to not break UI
    return <p className={cn("text-sm text-muted-foreground mt-4", className)}>An inspirational quote will appear here soon.</p>;
  }
}
