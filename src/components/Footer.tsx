import { sound } from '../utils/audio';

interface FooterProps {
  onOpenRss: () => void;
  onNavigateToNow: () => void;
  onNavigateToHome: () => void;
}

export function Footer({ onOpenRss, onNavigateToNow, onNavigateToHome }: FooterProps) {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-900 bg-[#09090b] py-12 text-zinc-500 text-xs">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onNavigateToHome();
              window.location.hash = '';
            }}
            className="font-mono text-zinc-300 font-medium hover:text-white transition-colors"
          >
            AB Peace
          </button>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <span>Agnostic systems, creative code, pure curiosity.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-zinc-400">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onNavigateToNow();
            }}
            className="hover:text-zinc-200 transition-colors"
          >
            Now
          </button>
          <a
            href="#contact"
            onClick={() => {
              sound.playClick();
              onNavigateToHome();
            }}
            className="hover:text-zinc-200 transition-colors"
          >
            Work with Me
          </a>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenRss();
            }}
            className="hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            <span>RSS Feed</span>
          </button>
          <a
            href="https://github.com/vadirn"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-200 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://x.com/vadirn"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-200 transition-colors"
          >
            X / Twitter
          </a>
          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-zinc-200 transition-colors"
          >
            Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
