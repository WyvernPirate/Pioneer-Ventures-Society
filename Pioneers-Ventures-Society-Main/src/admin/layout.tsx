import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
import { Briefcase, LayoutDashboard, Newspaper, Users, ListChecks, Settings, FileText, ExternalLink, Home, CalendarDays, LogOut, ShoppingBag, Heart } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

type SidebarNavLinkProps = {
  to: string;
  tooltip: string;
  children: ReactNode;
  end?: boolean;
};

function SidebarNavLink({ to, tooltip, children, end = false }: SidebarNavLinkProps) {
  return (
    <NavLink to={to} end={end}>
      {({ isActive }) => (
        <SidebarMenuButton tooltip={tooltip} className={isActive ? "active" : ""}>
          {children}
        </SidebarMenuButton>
      )}
    </NavLink>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Redirect to login page after sign out
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-sidebar-primary" />
            <span className="font-semibold text-lg text-sidebar-primary">PVS Admin Portal</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="flex-1 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarNavLink to="/dashboard" tooltip="Dashboard" end>
                <LayoutDashboard />
                Dashboard
              </SidebarNavLink>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <SidebarNavLink to="/dashboard/events" tooltip="Manage Events">
                <CalendarDays /> 
                Events
              </SidebarNavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarNavLink to="/dashboard/blog" tooltip="Manage Blog Posts">
                <Newspaper />
                Blog/Posts
              </SidebarNavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarNavLink to="/dashboard/members" tooltip="Manage Members">
                <Users />
                Members
              </SidebarNavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarNavLink to="/dashboard/registrations" tooltip="View Registrations">
                <ListChecks />
                Registrations
              </SidebarNavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarNavLink to="/dashboard/merch" tooltip="Manage Merch">
                <ShoppingBag />
                Merch
              </SidebarNavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarNavLink to="/dashboard/donations" tooltip="View Donations">
                <Heart />
                Donations
              </SidebarNavLink>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <SidebarNavLink to="/dashboard/site-content" tooltip="Edit Site Content">
                <Settings />
                Site Content
              </SidebarNavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarNavLink to="/dashboard/documents" tooltip="Manage Documents">
                <FileText />
                Documents
              </SidebarNavLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sign Out" onClick={handleSignOut}>
                <LogOut />
                Sign Out
              </SidebarMenuButton>
            </SidebarMenuItem>
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
          <Link to="/dashboard" className="flex items-center gap-2">
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