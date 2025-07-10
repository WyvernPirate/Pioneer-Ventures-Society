import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, redirect } from 'react-router-dom'
import AdminLayout from './layout.tsx'
import AdminDashboardPage from './admin-portal.tsx'
import AdminEventsPage from './events/page.tsx'
import AdminBlogPage from './blog/page.tsx'
import AdminMembersPage from './members/page.tsx'
import AdminSiteContentPage from './site-content/page.tsx'
import AdminRegistrationsPage from './registrations/page.tsx'
import AdminDocumentsPage from './documents/page.tsx'
import LoginPage from './LoginPage.tsx'
import { getCurrentUser } from './auth.ts'
import EditEventPage from './events/EditEventPage.tsx'
import EditPostPage from './blog/EditPostPage.tsx'
import EditMemberPage from './members/EditMemberPage.tsx'

import '@/lib/firebase'; // Initialize Firebase
import '@/index.css' 

/**
 * A loader function to protect routes.
 * If the user is not authenticated, it redirects to the login page.
 */
const protectedLoader = async () => {
  const user = await getCurrentUser();
  if (!user) {
    // The user is not logged in, redirect them to the login page.
    return redirect('/login');
  }
  return { user }; // Pass user data to the route component
};

/**
 * A loader for the login page.
 * If the user is already authenticated, redirect to dashboard.
 */
const loginLoader = async () => {
  const user = await getCurrentUser();
  if (user) {
    // User is already logged in, redirect to dashboard
    return redirect('/dashboard');
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    loader: loginLoader,
  },
  {
    path: '/login',
    element: <LoginPage />,
    loader: loginLoader,
  },
  {
    path: '/dashboard',
    element: <AdminLayout><Outlet /></AdminLayout>,
    loader: protectedLoader,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'events', element: <AdminEventsPage /> },
      { path: 'events/edit/:eventId', element: <EditEventPage /> },
      { path: 'blog', element: <AdminBlogPage /> },
      { path: 'blog/edit/:postId', element: <EditPostPage /> },
      { path: 'members', element: <AdminMembersPage /> },
      { path: 'members/edit/:memberId', element: <EditMemberPage /> },
      { path: 'registrations', element: <AdminRegistrationsPage /> },
      { path: 'site-content', element: <AdminSiteContentPage /> },
      { path: 'documents', element: <AdminDocumentsPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)