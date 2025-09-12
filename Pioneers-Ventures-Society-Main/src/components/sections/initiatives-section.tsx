
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, ShieldHalf, GraduationCap, Handshake, ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import { Button } from '../ui/button';

const initiatives = [
  {
    title: "Skill Development Workshops",
    description: "Gain practical knowledge and hands-on experience through masterclasses, technical workshops, and soft-skill training sessions led by industry experts and seasoned entrepreneurs.",
    icon: GraduationCap,
    image: "https://placehold.co/600x400.png",
    aiHint: "workshop education",
    link: "/events", // Link to events or a specific workshop page
  },
  {
    title: "Community Impact Challenges",
    description: "Participate in challenges designed to solve real-world community problems through innovative solutions and social entrepreneurship, fostering a spirit of giving back.",
    icon: ShieldHalf,
    image: "https://placehold.co/600x400.png",
    aiHint: "social impact",
    link: "#", // Link to a dedicated page or section
  },
  {
    title: "Leadership & Networking Forums",
    description: "Connect with peers, mentors, and industry leaders through regular forums, networking events, and discussions aimed at cultivating leadership qualities and expanding professional networks.",
    icon: Handshake,
    image: "https://placehold.co/600x400.png",
    aiHint: "networking leadership",
    link: "/events", // Link to events page
  },
];

export default function InitiativesSection() {
  return (
    <section id="initiatives" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
            Our Key Initiatives
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            We drive progress through a range of targeted programs designed to foster innovation, develop skills, and support ventures at every stage.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initiatives.map((initiative, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-0">
                <img 
                  src={initiative.image} 
                  alt={initiative.title}
                  width={600}
                  height={400}
                  className="w-full h-56 object-cover"
                  data-ai-hint={initiative.aiHint}
                />
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="flex items-center mb-3">
                  <initiative.icon className="h-7 w-7 text-primary mr-3" />
                  <CardTitle className="font-headline text-2xl text-primary">{initiative.title}</CardTitle>
                </div>
                <CardDescription className="text-foreground/70 mb-6 flex-grow">{initiative.description}</CardDescription>
                <Button variant="outline" asChild className="mt-auto w-fit self-start border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"><Link to="/events"><span className="flex items-center">Learn More <ArrowRight className="ml-2 h-4 w-4" /></span></Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
