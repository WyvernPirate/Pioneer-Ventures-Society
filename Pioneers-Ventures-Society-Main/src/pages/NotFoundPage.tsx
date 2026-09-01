import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, Home } from 'lucide-react';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = '404 - Page Not Found | Pioneer Ventures Society';
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto flex flex-col items-center justify-center text-center py-24 px-4 sm:px-6 lg:px-8">
        <Compass className="h-16 w-16 text-accent mb-6" />
        <p className="font-headline text-6xl sm:text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-lg text-foreground/70 max-w-md mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/">
            <span className="flex items-center"><Home className="mr-2 h-4 w-4" /> Back to Home</span>
          </Link>
        </Button>
      </main>
    </div>
  );
}
