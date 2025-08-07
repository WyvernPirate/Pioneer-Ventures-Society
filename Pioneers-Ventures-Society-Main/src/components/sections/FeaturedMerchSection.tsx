import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { dummyMerchData } from '@/data/dummy';
import { ArrowRight } from 'lucide-react';

const FeaturedMerchSection: React.FC = () => {
  const featuredItems = dummyMerchData.slice(0, 3); // Show up to 3 items

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <Link to="/merch" key={item.id} className="bg-card rounded-lg shadow-lg overflow-hidden group block transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative">
                <img 
                  className="w-full h-72 object-cover" 
                  src={item.imageUrl} 
                  alt={item.name} 
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                 <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  ${item.price.toFixed(2)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{item.name}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

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