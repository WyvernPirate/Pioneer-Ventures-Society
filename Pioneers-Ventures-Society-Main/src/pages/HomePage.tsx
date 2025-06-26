import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '@/components/sections/hero-section';
import AboutPvsSection from '@/components/sections/about-pvs-section';
import ValuesSection from '@/components/sections/values-section';
import CoreActivitiesSection from '@/components/sections/core-activities-section';
import InitiativesSection from '@/components/sections/initiatives-section';
import BlogSummarySection from '@/components/sections/blog-summary-section';
import EventsSection from '@/components/sections/events-section';
import ResourcesSummarySection from '@/components/sections/resources-summary-section';
import MemberSpotlightsSection from '@/components/sections/member-spotlights-section'; // This now serves as "Meet Our Founders"
import CtaSection from '@/components/sections/cta-section';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL (e.g., /#about)
    if (location.hash) {
      const id = location.hash.substring(1); // Remove the '#'
      const element = document.getElementById(id);
      if (element) {
        // Smoothly scroll to the element
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]); // Re-run the effect if the hash changes

  return (
    <>
      <HeroSection />
      <AboutPvsSection />
      <ValuesSection />
      <CoreActivitiesSection />
      <InitiativesSection />
      <EventsSection />
      <MemberSpotlightsSection />
      <BlogSummarySection />
      <ResourcesSummarySection />
      <CtaSection />
    </>
  );
};

export default HomePage;