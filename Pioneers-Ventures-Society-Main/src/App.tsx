import { Outlet, Routes, Route } from 'react-router-dom';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HomePage from '@/pages/HomePage';
import RegisterPage from '@/pages/RegisterPage';
import BlogPage from '@/pages/BlogPage'; 
import EventsPage from '@/pages/EventsPage'; 
import InitiativesPage from '@/pages/InitiativesPage'; 
import MembersPage from '@/pages/MembersPage'; 
import ResourcesPage from '@/pages/ResourcesPage'; 

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* This is where nested routes will render */}
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="register" element={<RegisterPage />} /> 
        <Route path="blog" element={<BlogPage />} /> 
        <Route path="events" element={<EventsPage />} /> 
        <Route path="initiatives" element={<InitiativesPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="resources" element={<ResourcesPage />} /> 
        {/* Remove admin routes - they should only be accessible on admin subdomain */}
        {/* 404 handler for any other routes */}
        <Route path="*" element={<div className="text-center p-8"><h1 className="text-4xl">404 - Page Not Found</h1></div>} />
      </Route>
    </Routes>
  );
}

export default App;