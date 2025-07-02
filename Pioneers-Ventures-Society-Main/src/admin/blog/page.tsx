
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, PlusCircle } from 'lucide-react';

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Newspaper className="mr-3 h-8 w-8 text-accent" />
          Manage Blog Posts
        </h1>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Post
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Published Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Placeholder for list of blog posts with edit/delete options.</p>
          {/* Example structure for a blog post item */}
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="font-semibold">PVS Annual Summit Highlights</h3>
            <p className="text-sm text-muted-foreground">Published: November 5, 2024</p>
            <div className="mt-2 space-x-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
