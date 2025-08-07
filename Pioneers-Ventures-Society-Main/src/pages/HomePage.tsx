import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLocation } from 'react-router-dom';
import HeroSection from '@/components/sections/hero-section';
import AboutPvsSection from '@/components/sections/about-pvs-section';
import ValuesSection from '@/components/sections/values-section';
import CoreActivitiesSection from '@/components/sections/core-activities-section';
import InitiativesSection from '@/components/sections/initiatives-section';
import FeaturedMerchSection from '@/components/sections/FeaturedMerchSection';
import BlogSummarySection from '@/components/sections/blog-summary-section';
import EventsSection from '@/components/sections/events-section';
import ResourcesSummarySection from '@/components/sections/resources-summary-section';
import MemberSpotlightsSection from '@/components/sections/member-spotlights-section';
import CtaSection from '@/components/sections/cta-section';
import type { HeroContent } from '@/types/site-content';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage = () => {
  const location = useLocation();
  const [heroContent, setHeroContent] = useState<Partial<HeroContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'pic');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroContent(docSnap.data() as HeroContent);
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroContent();
  }, []);

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
      {loading ? (
        <section className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-20 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-1/2" />
            </div>
            <Skeleton className="h-[400px] w-full md:h-[500px] md:w-[600px] rounded-xl" />
          </div>
        </section>
      ) : (
        <HeroSection {...heroContent} />
      )}
      <AboutPvsSection />
      <ValuesSection />
      <CoreActivitiesSection />
      <InitiativesSection />
      <EventsSection />
      <FeaturedMerchSection />
      <MemberSpotlightsSection />
      <BlogSummarySection />
      <ResourcesSummarySection />
      <CtaSection />
    </>
  );
};

export default HomePage;