import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
import { Toaster } from '@/components/ui/toaster';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-sidebar-primary" />
            <span className="font-semibold text-lg text-sidebar-primary">PVS Admin Portal</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="flex-1 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <NavLink to="." end>
                {({ isActive }) => (
                  <SidebarMenuButton tooltip="Dashboard" className={isActive ? "active" : ""}>
                    <LayoutDashboard />
                    Dashboard
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <NavLink to="/events">
                {({ isActive }) => (
                  <SidebarMenuButton tooltip="Manage Events" className={isActive ? "active" : ""}>
                    <CalendarDays /> 
                    Events
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NavLink to="/blog">
                {({ isActive }) => (
                  <SidebarMenuButton tooltip="Manage Blog Posts" className={isActive ? "active" : ""}>
                    <Newspaper />
                    Blog/Posts
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NavLink to="/members">
                {({ isActive }) => (
                  <SidebarMenuButton tooltip="Manage Members" className={isActive ? "active" : ""}>
                    <Users />
                    Members
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NavLink to="/registrations">
                {({ isActive }) => (
                  <SidebarMenuButton tooltip="View Registrations" className={isActive ? "active" : ""}>
                    <ListChecks />
                    Registrations
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <NavLink to="/site-content">
                {({ isActive }) => (
                  <SidebarMenuButton tooltip="Edit Site Content" className={isActive ? "active" : ""}>
                    <Settings />
                    Site Content
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NavLink to="/documents">
                {({ isActive }) => (
                  <SidebarMenuButton tooltip="Manage Documents" className={isActive ? "active" : ""}>
                    <FileText />
                    Documents
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <a
                href="https://pioneer-ventures-society.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                title="View Main Site"
              >
                <SidebarMenuButton tooltip="View Main Site">
                  <Home />
                  Back to Main Site
                  <ExternalLink className="ml-auto" />
                </SidebarMenuButton>
              </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background text-foreground">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <Link to="/" className="flex items-center gap-2">
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
