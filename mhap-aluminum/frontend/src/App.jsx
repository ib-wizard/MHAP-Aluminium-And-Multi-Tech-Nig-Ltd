import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ui/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import QuoteRequest from './pages/QuoteRequest';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminOverview from './pages/admin/AdminOverview';
import AdminCompany from './pages/admin/AdminCompany';
import AdminServices from './pages/admin/AdminServices';
import AdminProjects from './pages/admin/AdminProjects';
import AdminGallery from './pages/admin/AdminGallery';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminMessages from './pages/admin/AdminMessages';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
      <Route path="/projects/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/quote" element={<PublicLayout><QuoteRequest /></PublicLayout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="company" element={<AdminCompany />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="quotes" element={<AdminQuotes />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>

      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}
