import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FolderArchive } from 'lucide-react';

// Placeholder resources
const resources = [
  {
    id: '1',
    title: 'PVS Membership Handbook 2024',
    description: 'Your guide to understanding PVS, its mission, values, and how to make the most of your membership.',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    downloadLink: '#', // Placeholder
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
    id: '3',
    title: 'Event Sponsorship Proposal Guide',
    description: 'Guidelines and templates for creating effective sponsorship proposals for PVS events and initiatives.',
    fileType: 'DOCX',
    fileSize: '400 KB',
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

export default function ResourcesPage() {
  useEffect(() => {
    document.title = 'Resources - Pioneer Ventures Society';
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <FolderArchive className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4">
            PVS Resource Hub
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Access valuable documents, guides, templates, and other resources shared by the Pioneer Ventures Society to support your entrepreneurial journey.
          </p>
        </div>

        {resources.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <Card key={resource.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <resource.icon className="h-10 w-10 text-primary mb-3" />
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{resource.fileType}</span>
                  </div>
                  <CardTitle className="font-headline text-xl text-primary">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <CardDescription className="text-foreground/70 mb-4 flex-grow">
                    {resource.description}
                  </CardDescription>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>Size: {resource.fileSize}</span>
                  </div>
                  <Button asChild className="mt-auto w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href={resource.downloadLink} download target="_blank" rel="noopener noreferrer">
                      <span className="flex items-center"><Download className="mr-2 h-4 w-4" /> Download</span>
                    </a>
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
      </main>
    </div>
  );
}
