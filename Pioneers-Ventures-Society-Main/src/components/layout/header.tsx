
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" aria-label="Pioneer Ventures Society Home">
          <img src="src/assets/pvs_ico.png" className="h-8 w-8 sm:h-10 sm:w-10" alt="Pioneer Ventures Society Logo" />
          <span className="font-headline text-lg sm:text-xl md:text-2xl font-bold text-primary">
            <span className="sm:hidden">PVS</span>
            <span className="hidden sm:inline">Pioneer Ventures Society</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" asChild className="text-sm sm:text-base hidden md:inline-flex">
            <Link to="/#about"><span>About</span></Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm sm:text-base hidden md:inline-flex">
            <Link to="/#initiatives"><span>Initiatives</span></Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm sm:text-base">
           <Link to="/#events"><span>Events</span></Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm sm:text-base hidden lg:inline-flex">
            <Link to="/#meet-our-founders"><span>Meet Our Founders</span></Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm sm:text-base">
            <Link to="/#blog"><span>Blog</span></Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm sm:text-base hidden lg:inline-flex">
            <Link to="/#resources"><span>Resources</span></Link>
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base" asChild>
            <Link to="/#cta"><span>Get Involved</span></Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
export default Header;