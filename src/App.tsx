import { useState, useEffect } from 'react';
import { InteractiveBackground } from './components/InteractiveBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { NowPage } from './components/NowPage';
import { RssModal } from './components/RssModal';

export default function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [rssModalOpen, setRssModalOpen] = useState(false);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const [isNowPage, setIsNowPage] = useState(() => window.location.hash === '#now');

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#now') {
        setIsNowPage(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIsNowPage(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Intersection Observer to track currently viewed section (when on home)
  useEffect(() => {
    if (isNowPage) return;

    const sectionIds = ['about', 'blog', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [isNowPage]);

  const navigateToNow = () => {
    setIsNowPage(true);
    window.location.hash = '#now';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setIsNowPage(false);
    if (window.location.hash === '#now') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-zinc-800 selection:text-white">
      {/* Ambient Canvas Background */}
      <InteractiveBackground interactive={particlesEnabled} />

      {/* Top Bar Navigation */}
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenRss={() => setRssModalOpen(true)}
        onNavigateToNow={navigateToNow}
        onNavigateToHome={navigateToHome}
        activeSection={activeSection}
        isNowPage={isNowPage}
      />

      {/* Main Content Layout */}
      <main className="relative z-10">
        {isNowPage ? (
          <NowPage onBackToHome={navigateToHome} />
        ) : (
          <>
            <Hero onNavigateToNow={navigateToNow} />
            <About />
            <Blog onOpenRss={() => setRssModalOpen(true)} />
            <Contact />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenRss={() => setRssModalOpen(true)}
        onNavigateToNow={navigateToNow}
        onNavigateToHome={navigateToHome}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleParticles={() => setParticlesEnabled((p) => !p)}
        onNavigateToNow={navigateToNow}
        onOpenRss={() => setRssModalOpen(true)}
        particlesEnabled={particlesEnabled}
      />

      {/* RSS Feed Preview & Utility Modal */}
      <RssModal isOpen={rssModalOpen} onClose={() => setRssModalOpen(false)} />
    </div>
  );
}
