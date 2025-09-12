
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, ShieldHalf, GraduationCap, Handshake, ArrowRight, Target, Users, Lightbulb, Briefcase, Heart, Globe } from 'lucide-react';
import { Link } from "react-router-dom";
import { Button } from '../ui/button';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Initiative } from '@/types/initiatives';

// Icon mapping for dynamic icon selection
const iconMap = {
  'GraduationCap': GraduationCap,
  'ShieldHalf': ShieldHalf,
  'Handshake': Handshake,
  'Target': Target,
  'Users': Users,
  'Lightbulb': Lightbulb,
  'Briefcase': Briefcase,
  'Heart': Heart,
  'Globe': Globe,
  'Zap': Zap,
};

export default function InitiativesSection() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitiatives = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching initiatives from Firestore...');
      // First try to get all initiatives, then filter active ones
      const initiativesQuery = query(
        collection(db, 'initiatives'),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(initiativesQuery);
      const allInitiatives = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Initiative[];
      
      // Filter active initiatives on the client side
      const activeInitiatives = allInitiatives.filter(init => init.isActive);
      
      console.log('All initiatives:', allInitiatives);
      console.log('Active initiatives:', activeInitiatives);
      
      if (activeInitiatives.length > 0) {
        setInitiatives(activeInitiatives);
      } else {
        // If no initiatives found, use fallback
        console.log('No initiatives found, using fallback');
        setError('No initiatives found in database');
        setInitiatives([
          {
            id: 'fallback-1',
            title: "Skill Development Workshops",
            description: "Gain practical knowledge and hands-on experience through masterclasses, technical workshops, and soft-skill training sessions led by industry experts and seasoned entrepreneurs.",
            icon: 'GraduationCap',
            imageUrl: "https://placehold.co/600x400/4f46e5/ffffff?text=Skill+Development",
            link: "/events",
            order: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'fallback-2',
            title: "Community Impact Challenges",
            description: "Participate in challenges designed to solve real-world community problems through innovative solutions and social entrepreneurship, fostering a spirit of giving back.",
            icon: 'ShieldHalf',
            imageUrl: "https://placehold.co/600x400/059669/ffffff?text=Community+Impact",
            link: "#",
            order: 2,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'fallback-3',
            title: "Leadership & Networking Forums",
            description: "Connect with peers, mentors, and industry leaders through regular forums, networking events, and discussions aimed at cultivating leadership qualities and expanding professional networks.",
            icon: 'Handshake',
            imageUrl: "https://placehold.co/600x400/dc2626/ffffff?text=Leadership+%26+Networking",
            link: "/events",
            order: 3,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching initiatives:', error);
      setError(`Error fetching initiatives: ${error}`);
      // Fallback to default initiatives if fetch fails
      setInitiatives([
        {
          id: 'error-1',
          title: "Skill Development Workshops",
          description: "Gain practical knowledge and hands-on experience through masterclasses, technical workshops, and soft-skill training sessions led by industry experts and seasoned entrepreneurs.",
          icon: 'GraduationCap',
          imageUrl: "https://placehold.co/600x400/4f46e5/ffffff?text=Skill+Development",
          link: "/events",
          order: 1,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'error-2',
          title: "Community Impact Challenges",
          description: "Participate in challenges designed to solve real-world community problems through innovative solutions and social entrepreneurship, fostering a spirit of giving back.",
          icon: 'ShieldHalf',
          imageUrl: "https://placehold.co/600x400/059669/ffffff?text=Community+Impact",
          link: "#",
          order: 2,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'error-3',
          title: "Leadership & Networking Forums",
          description: "Connect with peers, mentors, and industry leaders through regular forums, networking events, and discussions aimed at cultivating leadership qualities and expanding professional networks.",
          icon: 'Handshake',
          imageUrl: "https://placehold.co/600x400/dc2626/ffffff?text=Leadership+%26+Networking",
          link: "/events",
          order: 3,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitiatives();
  }, []);

  if (loading) {
    return (
      <section id="initiatives" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">Debug: {error}</p>
              <Button 
                onClick={fetchInitiatives} 
                variant="outline" 
                size="sm"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Initiatives'}
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initiatives.map((initiative) => {
            const IconComponent = iconMap[initiative.icon as keyof typeof iconMap] || Target;
            
            return (
              <Card key={initiative.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="p-0">
                  <img 
                    src={initiative.imageUrl} 
                    alt={initiative.title}
                    width={600}
                    height={400}
                    className="w-full h-56 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center mb-3">
                    <IconComponent className="h-7 w-7 text-primary mr-3" />
                    <CardTitle className="font-headline text-2xl text-primary">{initiative.title}</CardTitle>
                  </div>
                  <CardDescription className="text-foreground/70 mb-6 flex-grow">{initiative.description}</CardDescription>
                  <Button variant="outline" asChild className="mt-auto w-fit self-start border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                    <Link to={initiative.link}>
                      <span className="flex items-center">Learn More <ArrowRight className="ml-2 h-4 w-4" /></span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
