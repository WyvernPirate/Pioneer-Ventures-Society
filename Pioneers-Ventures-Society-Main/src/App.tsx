import { Outlet, Routes, Route } from 'react-router-dom';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HomePage from '@/pages/HomePage';
import RegisterPage from '@/pages/RegisterPage';

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
        {/* Add other routes here */}
      </Route>
    </Routes>
  );
}

export default App;
