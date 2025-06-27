export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  aiHint: string;
  slug: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'PVS Annual Summit Highlights: A Resounding Success!',
    date: 'November 5, 2024',
    excerpt: 'Relive the key moments from our flagship Annual Summit, featuring inspiring keynotes, innovative startup pitches, and vibrant networking sessions that brought together the brightest minds...',
    image: 'https://placehold.co/800x400.png',
    aiHint: 'conference highlights',
    slug: '/blog/pvs-summit-highlights',
    content: `
      <p>The 2024 Pioneer Ventures Society Annual Summit was an electrifying event that brought together the brightest minds in innovation, entrepreneurship, and technology. Over three days, attendees were treated to a series of inspiring keynotes, groundbreaking startup pitches, and invaluable networking opportunities.</p>
      <h3 class="mt-6 mb-3 text-2xl font-bold">Keynote Highlights</h3>
      <p>We were honored to host industry titans who shared their journeys and insights. Their stories of perseverance and vision left a lasting impact on everyone present, reminding us that the path to success is paved with both challenges and triumphs.</p>
      <h3 class="mt-6 mb-3 text-2xl font-bold">Startup Pitch Competition</h3>
      <p>The heart of the summit was the startup pitch competition, where emerging entrepreneurs showcased their innovative solutions to real-world problems. The creativity and passion on display were truly remarkable, and we congratulate all the participants for their outstanding presentations.</p>
      <p class="mt-4">We look forward to seeing you all next year for an even bigger and better summit!</p>
    `,
  },
  {
    id: '2',
    title: 'Member Spotlight: How Aisha Khan is Driving Social Change',
    date: 'October 20, 2024',
    excerpt: 'Meet Aisha Khan, founder of BridgeConnect, and learn how her PVS-supported venture is making a tangible impact in local communities through technology and collaboration.',
    image: 'https://placehold.co/800x400.png',
    aiHint: 'social innovator portrait',
    slug: '/blog/member-spotlight-aisha-khan',
    content: `
      <p>In this month's member spotlight, we are thrilled to feature Aisha Khan, the visionary founder of BridgeConnect. Her journey is a testament to the power of combining technology with a deep-seated desire for social impact.</p>
      <p class="mt-4">BridgeConnect, a platform developed with support from the PVS Incubation Program, connects rural artisans with urban markets, empowering them to achieve financial independence. Aisha's work is a shining example of how entrepreneurship can be a force for good, creating sustainable livelihoods and preserving cultural heritage.</p>
      <blockquote class="mt-6 border-l-4 border-accent pl-4 italic text-muted-foreground">
        "PVS provided me with not just the resources, but the community and mentorship I needed to turn my vision into a reality," says Aisha.
      </blockquote>
    `,
  },
  {
    id: '3',
    title: 'The Future of Agri-Tech in Botswana: Insights from Our Masterclass',
    date: 'September 15, 2024',
    excerpt: 'Our recent Agri-NOVA Masterclass delved into cutting-edge technologies transforming agriculture. Discover the key takeaways and future trends discussed by experts.',
    image: 'https://placehold.co/800x400.png',
    aiHint: 'agriculture technology farm',
    slug: '/blog/future-of-agritech',
    content: `
      <p>The Agri-NOVA Masterclass, held last month, was a deep dive into the technologies poised to revolutionize agriculture in Botswana and beyond. Experts from across the continent gathered to discuss everything from drone-based crop monitoring to AI-powered soil analysis.</p>
      <h3 class="mt-6 mb-3 text-2xl font-bold">Key Takeaways</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Data is the new soil:</strong> Leveraging data analytics is crucial for optimizing crop yields and resource management.</li>
        <li><strong>Automation is key:</strong> Automated systems can significantly reduce labor costs and increase efficiency.</li>
        <li><strong>Sustainability and Profitability:</strong> Modern agri-tech solutions prove that sustainable farming practices can also be highly profitable.</li>
      </ul>
      <p class="mt-4">The event highlighted the immense potential for technology to address food security challenges and create new economic opportunities in the agricultural sector.</p>
    `,
  },
];