import NewsletterForm from '@/components/common/newsletter-form';
import SocialLinks from '@/components/common/social-links';
import { Briefcase, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border/40 py-12 text-sm">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2" aria-label="Pioneer Ventures Society Home">
              <Briefcase className="h-7 w-7 text-primary" />
              <span className="font-headline text-xl font-bold text-primary">
                Pioneer Ventures Society
              </span>
            </Link>
            <p className="text-muted-foreground">
              Fostering innovation and supporting new ventures for a brighter future.
            </p>
            <SocialLinks />
          </div>

          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="font-headline text-lg font-semibold mb-3 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/#hero" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/#initiatives" className="text-muted-foreground hover:text-primary transition-colors">Our Initiatives</Link></li>
              <li><Link to="/#meet-our-founders" className="text-muted-foreground hover:text-primary transition-colors">Our Founders</Link></li>
              <li><Link to="/#cta" className="text-muted-foreground hover:text-primary transition-colors">Get Involved</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="font-headline text-lg font-semibold mb-3 text-primary">Contact Us</h3>
            <address className="not-italic space-y-2 text-muted-foreground">
              <p className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />123 Innovation Drive, Tech City, TX 75001</p>
              <p className="flex items-center"><Phone className="h-4 w-4 mr-2 shrink-0" /><a href="tel:+1234567890" className="hover:text-primary transition-colors">(123) 456-7890</a></p>
              <p className="flex items-center"><Mail className="h-4 w-4 mr-2 shrink-0" /><a href="mailto:info@pioneerventures.org" className="hover:text-primary transition-colors">info@pioneerventures.org</a></p>
            </address>
          </div>

          <div className="md:col-span-3 lg:col-span-1">
            <h3 className="font-headline text-lg font-semibold mb-3 text-primary">Stay Updated</h3>
            <p className="text-muted-foreground mb-3">Subscribe to our newsletter for the latest updates and insights.</p>
            <NewsletterForm />
          </div>
        </div>
        
        <div className="border-t border-border/60 pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pioneer Ventures Society. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;