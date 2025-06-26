
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { Download, FileText, FolderArchive } from 'lucide-react';

// Placeholder resources - mirror structure from /resources/page.tsx
const resourcesSummary = [
  {
    id: '1',
    title: 'PVS Membership Handbook 2024',
    description: 'Your guide to understanding PVS, its mission, values, and how to make the most of your membership.',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    downloadLink: '#', 
    icon: FileText,
  },
  {
    id: '2',
    title: 'Startup Pitch Deck Template',
    description: 'A comprehensive template to help you structure your startup pitch for investors and competitions.',
    fileType: 'PPTX',
    fileSize: '850 KB',
    downloadLink: '#',
    icon: FileText,
  },
  {
    id: '4',
    title: 'PVS Annual Report 2023',
    description: 'A summary of PVS activities, achievements, and financial overview for the past year.',
    fileType: 'PDF',
    fileSize: '2.5 MB',
    downloadLink: '#',
    icon: FileText,
  },
];

export default function ResourcesSummarySection() {
  return (
    <section id="resources" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <FolderArchive className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">
            Featured Resources
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Access valuable documents, guides, and templates to support your journey.
          </p>
        </div>

        {resourcesSummary.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {resourcesSummary.map((resource) => (
              <Card key={resource.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <resource.icon className="h-10 w-10 text-primary mb-3" />
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{resource.fileType}</span>
                  </div>
                  <CardTitle className="font-headline text-xl text-primary">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <CardDescription className="text-foreground/70 mb-4 flex-grow line-clamp-3">
                    {resource.description}
                  </CardDescription>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>Size: {resource.fileSize}</span>
                  </div>
                  <Button asChild className="mt-auto w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to={resource.downloadLink} download target="_blank" rel="noopener noreferrer"><span><Download className="mr-2 h-4 w-4" /> Download</span></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">Resource library under construction. Helpful materials coming soon!</p>
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg" asChild>
            <Link to="/resources"><span>View All Resources <Download className="ml-2 h-5 w-5" /></span></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
