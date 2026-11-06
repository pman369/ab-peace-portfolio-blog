import { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenRss: () => void;
  onNavigateToNow: () => void;
  onNavigateToHome: () => void;
  activeSection: string;
  isNowPage: boolean;
}

export function Navbar({
  onOpenCommandPalette,
  onOpenRss,
  onNavigateToNow,
  onNavigateToHome,
  activeSection,
  isNowPage,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.enabled = nextState;
    if (nextState) sound.playBlip();
  };

  const navItems = [
    { label: 'About', href: '#about', isNow: false },
    { label: 'Now', href: '#now', isNow: true },
    { label: 'Blog', href: '#blog', isNow: false },
    { label: 'Contact / Work with Me', href: '#contact', isNow: false },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-[#09090b]/90 backdrop-blur-md border-zinc-800/80 shadow-sm'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            sound.playClick();
            onNavigateToHome();
            window.location.hash = '';
          }}
          className="text-base font-semibold tracking-tight text-zinc-100 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <span className="font-mono text-zinc-400 text-sm">~</span>
          <span>AB Peace</span>
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          {navItems.map((item) => {
            const isActive = item.isNow ? isNowPage : !isNowPage && activeSection === item.href.slice(1);
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  sound.playClick();
                  if (item.isNow) {
                    e.preventDefault();
                    onNavigateToNow();
                  } else if (isNowPage) {
                    onNavigateToHome();
                  }
                }}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-zinc-100 ${
                  isActive ? 'text-zinc-100 font-semibold' : ''
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action and secondary utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* RSS Feed Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenRss();
            }}
            title="Blog RSS Feed (/rss.xml)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-zinc-900 border border-zinc-800/70 text-xs font-mono transition-colors"
            aria-label="Open RSS feed"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
            <span className="hidden sm:inline">RSS</span>
          </button>

          {/* Micro-haptics audio toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute micro-haptics' : 'Enable micro-haptics'}
            className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors border border-zinc-800/60 text-xs font-mono"
            aria-label="Toggle haptic audio"
          >
            {soundEnabled ? 'FX' : 'OFF'}
          </button>

          {/* Quick Search launcher */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenCommandPalette();
            }}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-zinc-400 bg-zinc-900 hover:bg-zinc-800/80 hover:text-zinc-200 border border-zinc-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Open Command Palette"
          >
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-zinc-800 rounded border border-zinc-700/60 text-zinc-300">
              ⌘K
            </kbd>
          </button>

          {/* Primary Action Button */}
          <a
            href="#contact"
            onClick={() => {
              sound.playClick();
              if (isNowPage) onNavigateToHome();
            }}
            className="px-4 py-2 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Work with Me
          </a>
        </div>
      </div>
    </header>
  );
}
