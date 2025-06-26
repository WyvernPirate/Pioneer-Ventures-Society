import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header and Footer are typically part of the main Layout,
          but if this page needs a different layout or direct control,
          they can be included here. For consistency with RegisterPage,
          we'll assume the main Layout handles them. */}
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-headline text-4xl font-bold text-primary mb-4">Our Blog</h1>
          <p className="text-lg text-muted-foreground">This is where all your amazing blog posts will be displayed!</p>
          {/* You'll add your full blog post listing component here later */}
        </div>
      </main>
      {/* Footer is handled by Layout in App.tsx */}
    </div>
  );
}