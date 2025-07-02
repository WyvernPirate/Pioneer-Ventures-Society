
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Briefcase, LayoutDashboard, Newspaper, Users, ListChecks, Settings, FileText, ExternalLink, Home, CalendarDays } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster'; // Added Toaster

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-sidebar-primary" />
            <span className="font-semibold text-lg text-sidebar-primary">PVS Admin Portal</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="flex-1 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin" tooltip="Dashboard">
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/events" tooltip="Manage Events">
                <CalendarDays /> 
                Events
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/blog" tooltip="Manage Blog Posts">
                <Newspaper />
                Blog/Posts
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/members" tooltip="Manage Members">
                <Users />
                Members
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/registrations" tooltip="View Registrations">
                <ListChecks />
                Registrations
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <SidebarMenuButton to="/admin/site-content" tooltip="Edit Site Content">
                <Settings />
                Site Content
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton to="/admin/documents" tooltip="Manage Documents">
                <FileText />
                Documents
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/" target="_blank" tooltip="View Main Site">
                <Home />
                Back to Main Site
                <ExternalLink className="ml-auto" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background text-foreground">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <Link href="/admin" className="flex items-center gap-2">
             <Briefcase className="h-5 w-5 text-primary" />
            <span className="font-semibold text-md text-primary">PVS Admin</span>
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
