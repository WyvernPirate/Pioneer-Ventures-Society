import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import AdminLayout from './layout.tsx'
import AdminDashboardPage from './admin-portal.tsx'
import AdminEventsPage from './events/page.tsx'
import AdminBlogPage from './blog/page.tsx'
import AdminMembersPage from './members/page.tsx'
import AdminRegistrationsPage from './registrations/page.tsx'
import AdminDocumentsPage from './documents/page.tsx'

import '@/lib/firebase'; // Initialize Firebase
import '@/index.css' // Share the main CSS file

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout><Outlet /></AdminLayout>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'events', element: <AdminEventsPage /> },
      { path: 'blog', element: <AdminBlogPage /> },
      { path: 'members', element: <AdminMembersPage /> },
      { path: 'registrations', element: <AdminRegistrationsPage /> },
      { path: 'documents', element: <AdminDocumentsPage /> },
      // TODO: Add routes for 'site-content' etc.
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)