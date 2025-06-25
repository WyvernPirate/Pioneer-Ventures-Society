import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { Zap, Users, Gift, ArrowRight } from 'lucide-react'; // Zap for "Get Involved", Users for "Join", Gift for "Donate"
import InspirationalQuote from '@/components/common/inspirational-qoute';

const CtaSection = () => {
  return (
    <section id="cta" className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 text-center">
        <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
        <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-6">
          Ready to Shape the Future With Us?
        </h2>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-10">
          Whether you're an aspiring entrepreneur, an established innovator, or passionate about supporting groundbreaking ventures, there's a place for you at Pioneer Ventures Society.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg min-w-[200px] py-7 text-lg transform hover:scale-105 transition-transform duration-300" asChild>
            <Link to="#">
              <Users className="mr-2 h-5 w-5" /> Join Our Society
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-lg min-w-[200px] py-7 text-lg transform hover:scale-105 transition-transform duration-300" asChild>
            <Link to="#">
              <Gift className="mr-2 h-5 w-5" /> Support Our Mission
            </Link>
          </Button>
           <Button size="lg" variant="ghost" className="text-primary hover:text-accent hover:bg-accent/10 min-w-[200px] py-7 text-lg" asChild>
            <Link to="#">
              Learn About Partnership <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <InspirationalQuote 
            keywords="collaboration, impact, future building" 
            context="Call to Action section encouraging involvement with Pioneer Ventures Society"
            className="max-w-2xl mx-auto" 
        />
      </div>
    </section>
  );
}
export default CtaSection;