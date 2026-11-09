import { useState, useEffect } from 'react';
import { InteractiveBackground } from './components/InteractiveBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ResearchLibrary } from './components/ResearchLibrary';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { NowPage } from './components/NowPage';
import { RssModal } from './components/RssModal';
import { AuthoringStudio } from './components/AuthoringStudio';
import { StudioAuthModal } from './components/StudioAuthModal';
import { sound } from './utils/audio';
import { isStudioAuthenticated } from './utils/security';

export default function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [rssModalOpen, setRssModalOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
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

  // Securely request studio access: check authentication or open security gate
  const handleOpenStudio = () => {
    if (isStudioAuthenticated()) {
      setStudioOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  // Global Keyboard shortcuts: Cmd+K / Ctrl+K (Search), Cmd+E / Ctrl+E (Studio)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleOpenStudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Intersection Observer to track currently viewed section (when on home)
  useEffect(() => {
    if (isNowPage) return;

    const sectionIds = ['about', 'research', 'blog', 'contact'];
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
        { threshold: 0.25 }
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
    <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-zinc-800 selection:text-white pb-16 md:pb-0">
      {/* Ambient Canvas Background */}
      <InteractiveBackground interactive={particlesEnabled} />

      {/* Top Bar Navigation */}
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenRss={() => setRssModalOpen(true)}
        onOpenStudio={handleOpenStudio}
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
            <ResearchLibrary />
            <Blog
              onOpenRss={() => setRssModalOpen(true)}
              onOpenStudio={handleOpenStudio}
            />
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

      {/* Mobile Adaptive Bottom Navigation Dock (Fluid 1-thumb reachability on all devices) */}
      <nav
        aria-label="Mobile quick actions"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb"
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            sound.playClick();
            navigateToHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </a>

        <a
          href="#now"
          onClick={(e) => {
            e.preventDefault();
            sound.playClick();
            navigateToNow();
          }}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[11px] font-mono transition-colors ${
            isNowPage ? 'text-emerald-400 font-semibold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Now</span>
        </a>

        <a
          href="#research"
          onClick={() => {
            sound.playClick();
            if (isNowPage) navigateToHome();
          }}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>Research</span>
        </a>

        <a
          href="#blog"
          onClick={() => {
            sound.playClick();
            if (isNowPage) navigateToHome();
          }}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span>Blog</span>
        </a>

        {/* Quick Authoring Studio Trigger */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            handleOpenStudio();
          }}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
          title="Open Authoring Studio"
        >
          <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Studio</span>
        </button>

        <a
          href="#contact"
          onClick={() => {
            sound.playClick();
            if (isNowPage) navigateToHome();
          }}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Contact</span>
        </a>
      </nav>

      {/* In-Browser Authoring Studio Modal */}
      <AuthoringStudio
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        onArticlePublished={() => {
          // Trigger custom event so Blog and RSS sync instantly
          window.dispatchEvent(new Event('abpeace_articles_updated'));
        }}
      />

      {/* Studio Secured Access Control Modal */}
      <StudioAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={() => {
          setAuthModalOpen(false);
          setStudioOpen(true);
        }}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleParticles={() => setParticlesEnabled((p) => !p)}
        onNavigateToNow={navigateToNow}
        onOpenRss={() => setRssModalOpen(true)}
        onOpenStudio={handleOpenStudio}
        particlesEnabled={particlesEnabled}
      />

      {/* RSS Feed Preview & Utility Modal */}
      <RssModal isOpen={rssModalOpen} onClose={() => setRssModalOpen(false)} />
    </div>
  );
}
