
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Briefcase, UserCog } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" aria-label="Pioneer Ventures Society Home">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg sm:text-xl md:text-2xl font-bold text-primary">
            <span className="sm:hidden">PVS</span>
            <span className="hidden sm:inline">Pioneer Ventures Society</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" asChild className="text-sm sm:text-base hidden md:inline-flex">
            <Link to="/#about">About</Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm sm:text-base hidden md:inline-flex">
            <Link to="/#initiatives">Initiatives</Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm sm:text-base">
            <Link to="/events">Events</Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm sm:text-base">
            <Link to="/blog">Blog</Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm sm:text-base hidden lg:inline-flex">
            <Link to="/resources">Resources</Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm sm:text-base hidden lg:inline-flex">
            <Link to="/contact">Contact</Link>
          </Button>
           <Button variant="ghost" asChild className="text-sm sm:text-base hidden lg:inline-flex">
            <Link to="/admin">
              <UserCog className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" /> Admin
            </Link>
          </Button>
          <Button variant="outline" asChild className="text-sm sm:text-base">
            <Link to="/register">Register</Link>
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base" asChild>
            <Link to="/#cta">Get Involved</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
export default Header;