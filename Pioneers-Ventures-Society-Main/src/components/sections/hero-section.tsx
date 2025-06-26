import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import InspirationalQuote from '@/components/common/inspirational-qoute';
import { ArrowRight, Rocket } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative bg-gradient-to-br from-background to-secondary/30 py-20 md:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
         {/* Subtle background pattern or image if desired */}
      </div>
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium mb-4">
              <Rocket className="h-4 w-4 mr-2" />
              Igniting Innovation
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-tight mb-6">
              Pioneering Ventures, Shaping Futures
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-xl mx-auto md:mx-0">
              Pioneer Ventures Society is dedicated to fostering a vibrant ecosystem for innovation, empowering entrepreneurs, and driving impactful change. Join us in building the next generation of groundbreaking ventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform duration-300" asChild>
                <Link to="/#cta"><span>Join Our Mission <ArrowRight className="ml-2 h-5 w-5" /></span></Link>
              </Button>
              <Button size="lg" variant="outline" className="shadow-lg transform hover:scale-105 transition-transform duration-300" asChild><Link to="/#initiatives"><span>Explore Initiatives</span></Link></Button>
            </div>
          </div>
          <div className="relative flex justify-center items-center p-4">
            <img 
              src="https://placehold.co/600x500.png" 
              alt="Abstract representation of innovation and collaboration"
              width={600}
              height={500}
              className="rounded-xl shadow-2xl object-cover"
              data-ai-hint="abstract innovation"
            />
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full filter blur-2xl opacity-70"></div>
             <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full filter blur-2xl opacity-70"></div>
          </div>
        </div>
        <div className="mt-16 md:mt-24">
         <InspirationalQuote keywords="venture, innovation, society, future" context="Hero section of Pioneer Ventures Society landing page" />
        </div>
      </div>
    </section>
  );
}
