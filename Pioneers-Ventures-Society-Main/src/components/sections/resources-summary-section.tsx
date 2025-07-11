import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { Download, FileText, FolderArchive, Loader2 } from 'lucide-react';
import { getDocuments } from '@/admin/documents/actions';

interface ResourceDocument {
  id: string;
  name: string;
  description: string;
  downloadURL: string;
  fileType: string;
  fileSize: number;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileTypeLabel = (mimeType: string = '') => {
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'PPTX';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'DOCX';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'XLSX';
  if (mimeType.includes('image')) return 'IMG';
  return 'FILE';
};

export default function ResourcesSummarySection() {
  const [resources, setResources] = useState<ResourceDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const docs = await getDocuments();
        setResources(docs.slice(0, 3) as ResourceDocument[]); // Get first 3 for summary
      } catch (err) {
        console.error("Failed to fetch resources summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

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

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : resources.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {resources.map((resource) => (
              <Card key={resource.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-10 w-10 text-primary mb-3" />
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {getFileTypeLabel(resource.fileType)}
                    </span>
                  </div>
                  <CardTitle className="font-headline text-xl text-primary">{resource.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <CardDescription className="text-foreground/70 mb-4 flex-grow line-clamp-3">
                    {resource.description}
                  </CardDescription>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>Size: {formatBytes(resource.fileSize)}</span>
                  </div>
                  <Button asChild className="mt-auto w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href={resource.downloadURL} download target="_blank" rel="noopener noreferrer">
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
        
        <div className="text-center mt-8">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg" asChild>
            <Link to="/resources"><span className="flex items-center">View All Resources <FolderArchive className="ml-2 h-5 w-5" /></span></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
