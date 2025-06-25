import Header from '@/components/layout/header';
import HeroSection from '@/components/sections/hero-section';
import AboutPvsSection from '@/components/sections/about-pvs-section';
import ValuesSection from '@/components/sections/values-section';
import CoreActivitiesSection from '@/components/sections/core-activities-section';
import InitiativesSection from '@/components/sections/initiatives-section';
import BlogSummarySection from '@/components/sections/blog-summary-section';
import EventsSection from '@/components/sections/events-section';
import ResourcesSummarySection from '@/components/sections/resources-summary-section';
import MemberSpotlightsSection from '@/components/sections/member-spotlights-section'; // This now serves as "Meet Our Founders"
import  CtaSection  from '@/components/sections/cta-section';
import Footer from '@/components/layout/footer';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutPvsSection />
        <ValuesSection />
        <CoreActivitiesSection />
        <InitiativesSection />
        <EventsSection />
        <BlogSummarySection />
        <ResourcesSummarySection />
        <MemberSpotlightsSection /> 
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
