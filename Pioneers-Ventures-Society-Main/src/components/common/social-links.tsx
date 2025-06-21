import Link from 'next/link';
import { Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialPlatforms = [
  { name: 'LinkedIn', href: '#', icon: Linkedin, ariaLabel: 'Pioneer Ventures Society on LinkedIn' },
  { name: 'Twitter', href: '#', icon: Twitter, ariaLabel: 'Pioneer Ventures Society on Twitter' },
  { name: 'Facebook', href: '#', icon: Facebook, ariaLabel: 'Pioneer Ventures Society on Facebook' },
  { name: 'Instagram', href: '#', icon: Instagram, ariaLabel: 'Pioneer Ventures Society on Instagram' },
];

export default function SocialLinks() {
  return (
    <div className="flex space-x-3">
      {socialPlatforms.map((platform) => (
        <Button key={platform.name} variant="ghost" size="icon" asChild>
          <Link href={platform.href} target="_blank" rel="noopener noreferrer" aria-label={platform.ariaLabel}>
            <platform.icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
        </Button>
      ))}
    </div>
  );
}
