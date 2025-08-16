
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getPublishedMerch,type MerchItem } from '@/firebase/merchService';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Define MerchCard here to be self-contained
const MerchCard: React.FC<{ item: MerchItem }> = ({ item }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full group">
      <CardHeader className="p-0 relative">
        <img src={item.imageUrl} alt={item.name} className="w-full h-72 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
        <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          ${item.price.toFixed(2)}
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold text-card-foreground mb-2">{item.name}</CardTitle>
        <p className="text-muted-foreground text-sm">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 bg-muted/40">
          <Button asChild className="w-full">
              <Link to={`/merch`}>View Details</Link>
          </Button>
      </CardFooter>
    </Card>
  );
};

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
