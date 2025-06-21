
import { Target } from 'lucide-react';

export default function AboutPvsSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Target className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
            Our Mandate: The Driving Force Behind PVS
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            PVS exists to challenge the norm, to shift people from passively chasing jobs to actively building solutions. It exists not just to teach people how to survive but to inspire and teach them how to build systems that change lives, create wealth, and transform Botswana’s future.
          </p>
        </div>

        <div className="prose prose-lg max-w-none mx-auto text-foreground/90 prose-headings:font-headline prose-headings:text-primary prose-strong:text-primary">
          <p className="text-lg">
            At its core, PVS is dedicated to reshaping how youth approach their future. We achieve this by:
          </p>
          <ul className="list-disc space-y-3 pl-5 text-lg marker:text-accent">
            <li>
              <strong>Educating and Exposing:</strong> Introducing young minds to diverse, untapped business opportunities and value chains beyond the obvious, encouraging them to explore uncharted territories.
            </li>
            <li>
              <strong>Connecting Passion with Value:</strong> Helping youth merge their passions—be it in tech, arts, or agriculture—with innovation and market demands, transforming hobbies into sustainable, value-driven ventures.
            </li>
            <li>
              <strong>Fostering an Entrepreneurial Mindset:</strong> Shifting the cultural paradigm from employment-seeking to opportunity-creation, empowering youth to become builders, innovators, and employers.
            </li>
            <li>
              <strong>Building a Collaborative Ecosystem:</strong> Creating a supportive culture where individuals share knowledge, resources, and connections, promoting mutual growth, financial literacy, and the spirit of 'botho' (community).
            </li>
            <li>
              <strong>Bridging Education and Enterprise:</strong> Ensuring that academic learning translates into tangible, real-world impact through practical venture development, mentorship, and industry collaboration from an early age.
            </li>
            <li>
              <strong>Becoming a Funding Catalyst:</strong> Aiming to be a leading vehicle for youth ventures, providing access to funding, mentorship, and incubation, powered by the community and supported by strategic partners.
            </li>
          </ul>
          <p className="text-lg mt-6">
            PVS is about turning entrepreneurship into a way of life, fostering a generation that thinks entrepreneurially in every aspect, and establishing a vital platform for collaboration between students, professionals, and investors.
          </p>
        </div>
      </div>
    </section>
  );
}
