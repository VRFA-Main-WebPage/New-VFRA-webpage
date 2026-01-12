import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import CaseStudies from "./pages/CaseStudies";
import Events from "./pages/Events";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import OfferLetters from "./pages/admin/OfferLetters";
import CreateOfferLetter from "./pages/admin/CreateOfferLetter";
import Certificates from "./pages/admin/Certificates";
import CreateCertificate from "./pages/admin/CreateCertificate";
import AdminCases from "./pages/admin/Cases";
import CreateCase from "./pages/admin/CreateCase";
import AdminClients from "./pages/admin/Clients";
import AdminEvents from "./pages/admin/Events";
import TrackCase from "./pages/TrackCase";
import SubmitCase from "./pages/SubmitCase";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes with Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<Services />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/events" element={<Events />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/track-case" element={<TrackCase />} />
              <Route path="/submit-case" element={<SubmitCase />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/offer-letters"
              element={
                <ProtectedRoute>
                  <OfferLetters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/offer-letters/create"
              element={
                <ProtectedRoute>
                  <CreateOfferLetter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certificates"
              element={
                <ProtectedRoute>
                  <Certificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certificates/create"
              element={
                <ProtectedRoute>
                  <CreateCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cases"
              element={
                <ProtectedRoute>
                  <AdminCases />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cases/create"
              element={
                <ProtectedRoute>
                  <CreateCase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <ProtectedRoute>
                  <AdminClients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <AdminEvents />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
