
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { LayoutDashboard, Newspaper, Users, ListChecks, Settings, FileText, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function AdminDashboardPage() {
  const quickLinks = [
    { title: 'Manage Events', href: '/dashboard/events', icon: CalendarDays, description: 'Add, edit, or delete events.' },
    { title: 'Manage Blog Posts', href: '/dashboard/blog', icon: Newspaper, description: 'Create and update news articles.' },
    { title: 'View Members', href: '/dashboard/members', icon: Users, description: 'Access the member directory.' },
    { title: 'View Registrations', href: '/dashboard/registrations', icon: ListChecks, description: 'See event and member sign-ups.' },
    { title: 'Manage Documents', href: '/dashboard/documents', icon: FileText, description: 'Upload and manage downloadable resources.' },
    { title: 'Site Settings', href: '/dashboard/site-content', icon: Settings, description: 'Update static site content.' },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Pioneer Ventures Society Admin Portal.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link to={link.href} key={link.title}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold text-primary">{link.title}</CardTitle>
                <link.icon className="h-6 w-6 text-accent" />
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Portal Overview</CardTitle>
          <CardDescription>Use the sidebar to navigate through different management sections of the PVS website.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><strong>Events:</strong> Manage upcoming and past events.</li>
            <li><strong>Blog/Posts:</strong> Create, edit, and publish news and articles.</li>
            <li><strong>Members:</strong> View and manage member information.</li>
            <li><strong>Registrations:</strong> Access lists of event and member sign-ups.</li>
            <li><strong>Site Content:</strong> Update static text like mission, vision, and values.</li>
            <li><strong>Documents:</strong> Upload and organize downloadable resources.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}