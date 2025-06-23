
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarCheck, Rocket, Network } from 'lucide-react'; // Icons for Summit, Incubation, Sponsorship

const coreActivities = [
  {
    title: "Annual Summit",
    icon: CalendarCheck,
    description: "An annual showcase of Africa’s next great minds. This is the only major event PVS hosts. It brings together students, alumni, researchers, young entrepreneurs, and sector experts across different fields of business to showcase innovation, pitch ideas, and spark networks. Panels, keynote talks, and high-stakes startup demos all culminate here.",
  },
  {
    title: "PVS Enterprise Incubation Program",
    icon: Rocket,
    description: "A series of start-up Fund competitions will be held in order to support infant business ideas, MVP’s moreover a small, select group of members are taken through a year-long journey to develop a real venture. This is a development lab for those serious about execution. It includes guided sessions, milestones, investor-readiness checks, and finally, a chance to present at the annual Summit.",
  },
  {
    title: "PVS Subgroup Sponsorship & Oversight",
    icon: Network,
    description: "PVS sponsors its sector focused subgroups (e.g., Agri-NOVA, CoREA, Design Pod) which operate semi-independently under PVS. They propose mini projects like masterclasses, tours, and collaborations. PVS doesn’t host but empowers. PVS funds, mentors, and uses its brand to legitimize these subgroup projects.",
  },
];

export default function CoreActivitiesSection() {
  return (
    <section id="core-activities" className="py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
            PVS Core Activities
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Our society revolves around three pillars of engagement and development.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {coreActivities.map((activity) => (
            <Card key={activity.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="items-center text-center">
                <activity.icon className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="font-headline text-2xl text-primary">{activity.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-foreground/80 text-center leading-relaxed">
                  {activity.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
