import InitiativesSection from '@/components/sections/initiatives-section';

export default function InitiativesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <InitiativesSection />
      </main>
      {/* Footer is handled by Layout in App.tsx */}
    </div>
  );
}