import { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { sound } from '../utils/audio';
import { getAllArticles, deleteCustomArticle, exportArticleAsMarkdown } from '../utils/articleStore';
import { LazyImage } from './LazyImage';

interface BlogProps {
  onOpenRss?: () => void;
  onOpenStudio?: () => void;
}

export function Blog({ onOpenRss, onOpenStudio }: BlogProps) {
  const [articles, setArticles] = useState<BlogPost[]>(() => getAllArticles());
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('vadirn_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  // Sync with custom local storage updates from AuthoringStudio
  useEffect(() => {
    const handleUpdate = () => {
      setArticles(getAllArticles());
    };
    window.addEventListener('abpeace_articles_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('abpeace_articles_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const toggleBookmark = (id: string) => {
    sound.playBlip();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('vadirn_bookmarks', JSON.stringify(next));
      } catch {
        // Local storage write fail
      }
      return next;
    });
  };

  const copyCode = (code: string, index: number) => {
    sound.playBlip();
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this custom dispatch?')) {
      deleteCustomArticle(id);
      setArticles(getAllArticles());
      if (activePost?.id === id) {
        setActivePost(null);
      }
    }
  };

  const handleDownloadDoc = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    exportArticleAsMarkdown(post);
  };

  const filteredPosts = articles.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <section id="blog" className="py-24 border-b border-zinc-900 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block">
              Dispatches &amp; Technical Essays
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              Writing &amp; Mental Models
            </h2>
          </div>

          {/* Search Input, Studio & RSS Buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            {onOpenStudio && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenStudio();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-colors shrink-0"
                title="Write new article or upload document (⌘E)"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Compose / Studio</span>
              </button>
            )}

            {onOpenRss && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenRss();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-zinc-400 hover:text-orange-400 bg-zinc-900 border border-zinc-800 rounded-lg transition-colors shrink-0"
                title="Subscribe via RSS Feed (/rss.xml)"
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
                <span>RSS</span>
              </button>
            )}
            <div className="w-full md:w-56">
              <input
                type="text"
                placeholder="Search essays or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>
        </div>

        {/* Post List */}
        <div className="divide-y divide-zinc-900">
          {filteredPosts.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">
              No matching essays found. Click "Compose / Studio" above to publish your first article.
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isBookmarked = bookmarkedIds.includes(post.id);
              return (
                <article
                  key={post.id}
                  className="py-8 first:pt-0 last:pb-0 group cursor-pointer"
                  onClick={() => {
                    sound.playClick();
                    setActivePost(post);
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-display font-semibold text-zinc-100 group-hover:text-white transition-colors [text-wrap:balance]">
                        {post.title}
                      </h3>
                      {post.isUserCreated && (
                        <span className="text-[10px] font-mono text-emerald-400 border border-emerald-900/80 bg-emerald-950/30 px-2 py-0.5 rounded">
                          Custom Dispatch
                        </span>
                      )}
                    </div>

                    {/* Clean unboxed metadata with typographic separators */}
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 shrink-0">
                      <span>{post.readTime}</span>
                      <span aria-hidden="true" className="text-zinc-700">·</span>
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {post.coverImage && (
                    <div className="mb-4 max-w-2xl">
                      <LazyImage
                        src={post.coverImage}
                        alt={post.coverImageAlt || post.title}
                        aspectRatio="aspect-[21/9]"
                        containerClassName="relative w-full overflow-hidden bg-zinc-950/80 rounded-xl border border-zinc-800/60 group-hover:border-zinc-700 transition-colors"
                      />
                    </div>
                  )}

                  <p className="text-sm text-zinc-400 leading-relaxed mb-4 max-w-3xl">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                      {post.tags.map((tag, idx) => (
                        <span key={tag} className="flex items-center gap-2">
                          <span>{tag}</span>
                          {idx < post.tags.length - 1 && <span aria-hidden="true" className="text-zinc-700">·</span>}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Document download button */}
                      <button
                        type="button"
                        onClick={(e) => handleDownloadDoc(post, e)}
                        className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800"
                        title="Download document as Markdown (.md)"
                      >
                        <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>.md</span>
                      </button>

                      {post.isUserCreated && (
                        <button
                          type="button"
                          onClick={(e) => handleDeletePost(post.id, e)}
                          className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded bg-red-950/20 border border-red-900/40"
                          title="Delete this article"
                        >
                          Delete
                        </button>
                      )}

                      <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors flex items-center gap-1">
                        <span>Read essay</span>
                        <span className="font-mono">→</span>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Immersive Reader View Modal */}
        {activePost && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 md:p-10 flex justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-10 my-auto text-zinc-200">
              {/* Close and actions bar */}
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActivePost(null);
                  }}
                  className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  <span>←</span>
                  <span>Back to all essays</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={(e) => handleDownloadDoc(activePost, e)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
                    title="Download this document as Markdown (.md)"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download .md</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleBookmark(activePost.id)}
                    className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                      bookmarkedIds.includes(activePost.id)
                        ? 'bg-zinc-800 text-white border-zinc-700'
                        : 'text-zinc-400 hover:text-white border-zinc-800'
                    }`}
                  >
                    {bookmarkedIds.includes(activePost.id) ? 'Saved' : 'Save reading'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActivePost(null);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Reader Header */}
              <div className="mb-10">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-3">
                  <span>{activePost.date}</span>
                  <span aria-hidden="true" className="text-zinc-700">·</span>
                  <span>{activePost.readTime}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl sm:leading-snug font-display font-bold text-white mb-4 [text-wrap:balance]">
                  {activePost.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                  {activePost.tags.map((t, idx) => (
                    <span key={t} className="flex items-center gap-2">
                      <span>{t}</span>
                      {idx < activePost.tags.length - 1 && <span aria-hidden="true">·</span>}
                    </span>
                  ))}
                </div>

                {activePost.coverImage && (
                  <div className="mt-6">
                    <LazyImage
                      src={activePost.coverImage}
                      alt={activePost.coverImageAlt || activePost.title}
                      aspectRatio="aspect-[21/9]"
                      containerClassName="relative w-full overflow-hidden bg-zinc-950 rounded-xl border border-zinc-800 shadow-xl"
                    />
                  </div>
                )}
              </div>

              {/* Table of contents bar */}
              {activePost.tableOfContents && (
                <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 mb-10 text-xs">
                  <span className="font-mono text-zinc-400 block mb-2 font-medium">
                    Index of Invariants
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
                    {activePost.tableOfContents.map((item) => (
                      <span key={item.id} className="font-mono text-zinc-400">
                        {item.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Body Prose */}
              <div className="space-y-6 text-zinc-300 leading-relaxed text-base">
                {activePost.content.map((paragraph, idx) => {
                  if (paragraph.startsWith('![')) {
                    const match = paragraph.match(/^!\[(.*?)\]\((.*?)\)$/);
                    if (match) {
                      return (
                        <div key={idx} className="my-6">
                          <LazyImage
                            src={match[2]}
                            alt={match[1] || 'Article visual artifact'}
                            aspectRatio="aspect-[16/9]"
                            containerClassName="relative w-full overflow-hidden bg-zinc-950 rounded-xl border border-zinc-800 shadow-md"
                          />
                          {match[1] && (
                            <span className="block text-center text-xs font-mono text-zinc-500 mt-2">
                              {match[1]}
                            </span>
                          )}
                        </div>
                      );
                    }
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2
                        key={idx}
                        className="text-xl font-display font-semibold text-white pt-6 pb-2 border-b border-zinc-900"
                      >
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    const cleanCode = paragraph.replace(/```[a-z]*\n/, '').replace(/```$/, '');
                    return (
                      <div
                        key={idx}
                        className="relative my-6 rounded-xl border border-zinc-800 bg-[#060608] overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                          <span>Snippet</span>
                          <button
                            type="button"
                            onClick={() => copyCode(cleanCode, idx)}
                            className="hover:text-white transition-colors"
                          >
                            {copiedCodeIndex === idx ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
                          <code>{cleanCode}</code>
                        </pre>
                      </div>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <div key={idx} className="flex items-start gap-2.5 text-zinc-300 pl-2">
                        <span className="text-zinc-500 font-mono">-</span>
                        <span>{paragraph.replace('- ', '')}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-zinc-300 leading-relaxed text-base">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Reader Footer */}
              <div className="mt-12 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <span>By AB Peace</span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActivePost(null);
                  }}
                  className="hover:text-white transition-colors"
                >
                  Return to top ↑
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
