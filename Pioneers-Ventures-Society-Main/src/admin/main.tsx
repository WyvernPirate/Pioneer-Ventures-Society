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

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AdminLayout><Outlet /></AdminLayout>, // This is the protected layout
      loader: protectedLoader,
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: 'events', element: <AdminEventsPage /> },
        { path: 'blog', element: <AdminBlogPage /> },
        { path: 'members', element: <AdminMembersPage /> },
        { path: 'registrations', element: <AdminRegistrationsPage /> },
        { path: 'site-content', element: <AdminSiteContentPage /> },
        { path: 'documents', element: <AdminDocumentsPage /> },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
  ]
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)