import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { ChatDashboard } from './pages/ChatDashboard';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { ParticleField } from './components/ParticleField';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { Messaging } from './sections/Messaging';
import { Games } from './sections/Games';
import { WatchTogether } from './sections/WatchTogether';
import { MysteryCases } from './sections/MysteryCases';
import { CTA } from './sections/CTA';
import { Footer } from './sections/Footer';
import { siteConfig } from './config';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <div className="noise-overlay" />
      <CustomCursor />
      <ParticleField />
      <Navigation />
      <main>
        <Hero />
        <Features />
        <Messaging />
        <Games />
        <WatchTogether />
        <MysteryCases />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (siteConfig.title) {
      document.title = siteConfig.title;
    }
    if (siteConfig.language) {
      document.documentElement.lang = siteConfig.language;
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-[#ea0000] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatDashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
