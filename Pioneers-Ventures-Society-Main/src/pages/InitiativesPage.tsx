export default function InitiativesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-headline text-4xl font-bold text-primary mb-4">Our Initiatives</h1>
          <p className="text-lg text-muted-foreground">This is where all your amazing initiativess will be displayed!</p>
          {/* You'll add your full binitiatives post listing component here later */}
        </div>
      </main>
      {/* Footer is handled by Layout in App.tsx */}
    </div>
  );
}