
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Users, ShieldCheck, TrendingUp } from 'lucide-react'; // Icons for Entrepreneurship, Collaboration, Leadership, Growth

const values = [
  {
    title: "Entrepreneurship",
    description: "At the core of PVS is the belief that entrepreneurship isn’t just about owning a business it’s about seeing and creating value where others see nothing. We inspire students to think beyond degrees, beyond limitations, and build something meaningful even while they’re still in school. It’s about owning your journey, merging your passion with practical value, and creating your own lane in the world.",
    icon: Zap,
  },
  {
    title: "Collaboration",
    description: "We believe that the future belongs to communities that work together, not individuals that compete alone. Collaboration is not a weakness it’s how great things are built. We’re bringing back Botswana’s lost culture of cooperatives not just to survive, but to scale.",
    icon: Users,
  },
  {
    title: "Leadership",
    description: "PVS cultivates bold, intentional leadership. Not through titles, but through action, mindset, and vision. Every member is challenged to lead in their own right to influence, to take initiative, and to inspire others to dream bigger, think deeper, and do better. We are building leaders who build leaders.",
    icon: ShieldCheck,
  },
  {
    title: "Personal & Professional Growth",
    description: "PVS is a place where potential is activated and refined. Whether learning how to speak with confidence, build a brand, run a venture, or work in a team. Growth is not optional here. It’s expected! We encourage the youth to grow in mindset, skillset, and heart, preparing them for real-world impact and success.",
    icon: TrendingUp,
  },
];

export default function ValuesSection() {
  return (
    <section id="values" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            These principles guide every action we take and every program we build at Pioneer Ventures Society.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value) => (
            <Card key={value.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-primary/10">
              <CardHeader>
                <div className="flex items-center mb-3">
                  <value.icon className="h-10 w-10 text-accent mr-4" />
                  <CardTitle className="font-headline text-2xl text-primary">{value.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
