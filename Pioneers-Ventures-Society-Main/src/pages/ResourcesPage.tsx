import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FolderArchive, Loader2, AlertCircle } from 'lucide-react';
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

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Resources - Pioneer Ventures Society';

    const fetchResources = async () => {
      setLoading(true);
      try {
        const docs = await getDocuments();
        setResources(docs as ResourceDocument[]);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
        setError("Could not load resources at this time. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
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

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Loading Resources...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center p-4 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="h-5 w-5 mr-3" />
            <p>{error}</p>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <CardDescription className="text-foreground/70 mb-4 flex-grow">
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
            <p className="text-xl text-muted-foreground">No resources have been uploaded yet. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}
