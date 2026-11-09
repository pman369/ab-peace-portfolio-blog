import { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import { getAllArticles } from '../utils/articleStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleParticles: () => void;
  onNavigateToNow: () => void;
  onOpenRss: () => void;
  onOpenStudio?: () => void;
  particlesEnabled: boolean;
}

export function CommandPalette({
  isOpen,
  onClose,
  onToggleParticles,
  onNavigateToNow,
  onOpenRss,
  onOpenStudio,
  particlesEnabled,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build command list based on query
  const navigationItems = [
    { id: 'nav-top', label: 'Go to Top / Hero (Invariants & Latency)', action: () => { window.location.hash = '#hero'; window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'nav-now', label: 'Go to Now Page (Current explorations & rituals)', action: () => onNavigateToNow() },
    { id: 'nav-about', label: 'Go to About section', action: () => (window.location.hash = '#about') },
    { id: 'nav-research', label: 'Go to Research Library & Whitepapers', action: () => (window.location.hash = '#research') },
    { id: 'nav-blog', label: 'Go to Blog (Dispatches & Technical Essays)', action: () => (window.location.hash = '#blog') },
    { id: 'nav-contact', label: 'Go to Contact / Work with Me', action: () => (window.location.hash = '#contact') },
  ];

  const utilityItems = [
    ...(onOpenStudio
      ? [
          {
            id: 'util-open-studio',
            label: 'Authoring Studio: Write Article / Share Document [Secured] (⌘E)',
            action: () => onOpenStudio(),
          },
        ]
      : []),
    {
      id: 'util-open-rss',
      label: 'Open Blog RSS Feed (/rss.xml)',
      action: () => onOpenRss(),
    },
    {
      id: 'util-copy-email',
      label: 'Copy direct email (bempeace66@gmail.com)',
      action: () => {
        navigator.clipboard.writeText('bempeace66@gmail.com');
        sound.playBlip();
      },
    },
    {
      id: 'util-toggle-particles',
      label: `${particlesEnabled ? 'Disable' : 'Enable'} ambient particles (Performance)`,
      action: () => {
        onToggleParticles();
        sound.playClick();
      },
    },
    {
      id: 'util-open-github',
      label: 'Open GitHub (github.com/vadirn)',
      action: () => window.open('https://github.com/vadirn', '_blank'),
    },
  ];

  const articles = getAllArticles();
  const blogItems = articles.map((b) => ({
    id: `post-${b.id}`,
    label: `Essay: ${b.title}${b.isUserCreated ? ' [Custom]' : ''}`,
    action: () => {
      window.location.hash = '#blog';
    },
  }));

  const allItems = [...navigationItems, ...utilityItems, ...blogItems];

  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const executeItem = (item: (typeof allItems)[0]) => {
    sound.playClick();
    item.action();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((idx) => (idx + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((idx) => (idx - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800">
          <span className="font-mono text-zinc-500 mr-3 text-sm">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands, projects, essays, or jump to section..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none font-mono"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-zinc-900 border border-zinc-800 rounded text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* List of items */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-zinc-500">
              No matching commands found.
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => executeItem(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-colors ${
                  selectedIndex === index
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-zinc-500">Jump</span>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>AB Peace command hub</span>
        </div>
      </div>
    </div>
  );
}
