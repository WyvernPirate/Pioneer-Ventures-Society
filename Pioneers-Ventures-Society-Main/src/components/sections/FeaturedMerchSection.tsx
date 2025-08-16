
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getPublishedMerch,type MerchItem } from '@/firebase/merchService';
import { ArrowRight } from 'lucide-react';
import MerchCard   from '@/components/ui/MerchCard';


const FeaturedMerchSection: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerch = async () => {
      setLoading(true);
      const allMerch = await getPublishedMerch();
      setFeaturedItems(allMerch.slice(0, 3)); // Show up to 3 items
      setLoading(false);
    };

    fetchMerch();
  }, []);

  return (
    <section id="merch" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary">
            Get Your PVS Gear
          </h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Show your support for the society and its mission with our exclusive merchandise.
          </p>
        </div>

        {loading ? (
          <p className="text-center">Loading merchandise...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <MerchCard item={item} key={item.id} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/merch">
              <span className="flex items-center">
                View All Merch <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMerchSection;
