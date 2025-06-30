import { Outlet, Routes, Route } from 'react-router-dom';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HomePage from '@/pages/HomePage';
import RegisterPage from '@/pages/RegisterPage';
import BlogPage from '@/pages/BlogPage'; // Import the new BlogPage
import EventsPage from '@/pages/EventsPage'; // Placeholder for Events page
import InitiativesPage from '@/pages/InitiativesPage'; // Placeholder for Initiatives page
import MembersPage from '@/pages/MembersPage'; // Placeholder for Members page
import ResourcesPage from '@/pages/ResourcesPage'; // Placeholder for Resources page

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
        <Route index element={<HomePage />} /> {/* Home page */}
        <Route path="register" element={<RegisterPage />} /> {/* Register page */}
        <Route path="blog" element={<BlogPage />} /> {/* New Blog page route */}
        <Route path="events" element={<EventsPage />} /> {/* Placeholder for Events page */}
        <Route path="initiatives" element={<InitiativesPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="resources" element={<ResourcesPage />} /> {/* Placeholder for Resources page */}

        {/* Add other routes here */}
      </Route>
    </Routes>
  );
}

export default App;
