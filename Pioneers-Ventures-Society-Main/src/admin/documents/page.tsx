import React, { useState, useEffect, useCallback } from "react";
import { getDocuments, addDocument, deleteDocument } from "./actions";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle, FileText, Trash2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  downloadURL: string;
  storagePath: string;
  description: string;
}

// This would be a server component in Next.js
export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
      setError(null);
    } catch (err) {
      setError("Failed to fetch documents.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    setLoading(true);
    fetchDocuments().finally(() => setLoading(false));
  }, [fetchDocuments]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading Documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg">
        <AlertCircle className="h-5 w-5 mr-3" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center">
        <FileText className="mr-3 h-8 w-8 text-accent" />
        Manage Documents
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
        </CardHeader>
        <CardContent>
          <AddDocumentForm onComplete={fetchDocuments} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-accent/50 transition-colors">
                  <a
                    href={doc.downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    {doc.name}
                  </a>
                  <DeleteButton id={doc.id} storagePath={doc.storagePath} onComplete={fetchDocuments} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No documents have been uploaded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AddDocumentForm({ onComplete }: { onComplete: () => Promise<void> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setMessageType('');

    const formData = new FormData(event.currentTarget);
    const result = await addDocument(formData);

    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');

    if (result.success && event.target instanceof HTMLFormElement) {
      event.target.reset(); // Clear form
      await onComplete(); // Refetch documents
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="documentName">Document Name</Label>
        <Input id="documentName" name="documentName" placeholder="e.g., Q1 Financial Report" required disabled={isSubmitting} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="documentDescription">Description</Label>
        <Textarea id="documentDescription" name="documentDescription" placeholder="A brief description of the document for the resources page." required disabled={isSubmitting} rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="documentFile">Document File</Label>
        <Input id="documentFile" name="documentFile" type="file" required disabled={isSubmitting} />
      </div>
      <div className="flex items-center gap-4">
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : "Add Document"}
        </Button>
        {message && <p className={`text-sm ${messageType === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>{message}</p>}
      </div>
    </form>
  );
}

function DeleteButton({ id, storagePath, onComplete }: { id: string; storagePath: string; onComplete: () => Promise<void> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    if (!window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }
    setIsSubmitting(true);
    await deleteDocument(id, storagePath);
    await onComplete(); // Refetch documents
    // No need to set isSubmitting back to false, component will re-render with fresh state
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleClick} disabled={isSubmitting}>
      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
