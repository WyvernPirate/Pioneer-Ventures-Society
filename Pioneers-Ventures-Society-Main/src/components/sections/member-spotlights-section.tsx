import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { Users, ArrowRight } from 'lucide-react';

// Placeholder data for founders/members
const members = [
  {
    id: '1',
    name: 'Phemelo Moloi',
    role: 'Founder & Visionary',
    image: 'https://placehold.co/400x400.png',
    bio: 'The driving force behind PVS, with a passion for empowering the next generation of African innovators.',
    slug: '/members/phemelo-moloi',
  },
  {
    id: '2',
    name: 'Jane Doe',
    role: 'Lead Mentor, Agri-NOVA',
    image: 'https://placehold.co/400x400.png',
    bio: 'An expert in agricultural technology, Jane guides our members in creating sustainable and impactful agri-tech ventures.',
    slug: '/members/jane-doe',
  },
  {
    id: '3',
    name: 'John Smith',
    role: 'Incubation Program Director',
    image: 'https://placehold.co/400x400.png',
    bio: 'With years of experience in venture capital, John helps our startups become investor-ready.',
    slug: '/members/john-smith',
  },
];

export default function MemberSpotlightsSection() {
  return (
    <section id="meet-our-founders" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Users className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
            Meet Our Founders & Members
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            The dedicated individuals leading the charge and making an impact.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <Card key={member.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col text-center">
              <CardHeader className="p-0">
                <img 
                  src={member.image} 
                  alt={`Portrait of ${member.name}`}
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <CardTitle className="font-headline text-2xl text-primary">{member.name}</CardTitle>
                <p className="text-accent font-semibold mb-4">{member.role}</p>
                <CardDescription className="text-foreground/70 mb-6 flex-grow">{member.bio}</CardDescription>
                <Button variant="outline" asChild className="mt-auto w-fit self-center border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                  <Link to={member.slug}>
                    Read Bio <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
