import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import SignUp from "./pages/SignUp";
import Announcements from "./pages/Announcements"; 
import Marketplace from "./pages/Marketplace";
import LostFound from "./pages/LostFound";
import HelpCenter from "./pages/HelpCenter";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Community from "./pages/Community";  // ✅ Corrected import 
import Service from "./pages/Service";  // ✅ Corrected import
import Press from "./pages/Press";  // ✅ Corrected import
import Contact from "./pages/Contact";  // ✅ Corrected import
import Terms from "./pages/Terms";  // ✅ Corrected import
import Admin from "./pages/Admin";
import { AuthProvider } from "./hooks/useAuth";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/lost-found" element={<LostFound />} />
                <Route path ="/notes" element = {<Notes/> }/>
                <Route path="/help" element={<HelpCenter />} />

                <Route path="/privacy" element={<Privacy />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/community" element={<Community />} />  {/* ✅ Fixed */}
                <Route path="/contact" element={<Contact />} />  {/* ✅ Fixed */}
                <Route path="/press" element={<Press />} />  {/* ✅ Fixed */}
                <Route path="/service" element={<Service />} />  {/* ✅ Fixed */}
                <Route path="/terms" element={<Terms />} />  {/* ✅ Fixed */}
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

