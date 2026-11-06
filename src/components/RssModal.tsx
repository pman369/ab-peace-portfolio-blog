import { useState } from 'react';
import { BLOG_POSTS } from '../data/posts';
import { sound } from '../utils/audio';

interface RssModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RssModal({ isOpen, onClose }: RssModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);
  const feedUrl = `${window.location.origin}/rss.xml`;

  if (!isOpen) return null;

  const rawXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>AB Peace — Agnostic Vibe Coder &amp; Systems Hacker</title>
  <link>https://abpeace.dev/</link>
  <description>Original dispatches on vibe coding, sub-10ms latency loops, context poisoning, and bespoke engineering craft in late 2026 by AB Peace.</description>
  <language>en-us</language>
  <lastBuildDate>Sat, 24 Oct 2026 12:00:00 GMT</lastBuildDate>
  <atom:link href="/rss.xml" rel="self" type="application/rss+xml" />
${BLOG_POSTS.map(
  (p) => `  <item>
    <title>${p.title}</title>
    <link>/#blog-${p.slug}</link>
    <guid isPermaLink="true">/#blog-${p.slug}</guid>
    <pubDate>${p.date} 00:00:00 GMT</pubDate>
    <description><![CDATA[${p.excerpt}]]></description>
  </item>`
).join('\n')}
</channel>
</rss>`;

  const copyFeedUrl = () => {
    sound.playBlip();
    navigator.clipboard.writeText(feedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const copyRawXml = () => {
    sound.playBlip();
    navigator.clipboard.writeText(rawXml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  const downloadXml = () => {
    sound.playClick();
    const blob = new Blob([rawXml], { type: 'application/rss+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ab-peace-feed.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <svg
              className="w-5 h-5 text-orange-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
            <h3 className="text-lg font-mono font-semibold text-white">
              RSS Feed · AB Peace
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Feed URL Bar */}
        <div className="mt-5 p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between gap-3 text-xs font-mono">
          <span className="truncate text-zinc-300">{feedUrl}</span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={copyFeedUrl}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors font-medium"
            >
              {copiedUrl ? 'Copied URL' : 'Copy Feed URL'}
            </button>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              Raw ↗
            </a>
          </div>
        </div>

        {/* Feed Entries Preview */}
        <div className="my-5 space-y-3 max-h-64 overflow-y-auto pr-1">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Included Dispatches ({BLOG_POSTS.length})
          </div>
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 text-xs space-y-1"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium text-white">{post.title}</span>
                <span className="font-mono text-zinc-500 shrink-0 text-[11px]">{post.date}</span>
              </div>
              <p className="text-zinc-400 line-clamp-2 text-[11px] leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyRawXml}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {copiedXml ? 'Copied XML' : 'Copy Raw XML'}
            </button>
            <span className="text-zinc-700">·</span>
            <button
              type="button"
              onClick={downloadXml}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Download .xml
            </button>
          </div>

          <div className="text-zinc-500 text-[11px]">
            Compatible with Feedly, NetNewsWire, Readwise Reader &amp; Reeder
          </div>
        </div>
      </div>
    </div>
  );
}
