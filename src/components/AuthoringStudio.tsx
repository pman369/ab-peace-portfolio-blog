import { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import {
  saveCustomArticle,
  loadSavedDraft,
  saveDraft,
  clearDraft,
  exportBackupJson,
  importBackupJson,
} from '../utils/articleStore';
import { BlogPost } from '../types';
import { LazyImage } from './LazyImage';
import { lockStudio } from '../utils/security';

interface AuthoringStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onArticlePublished: (newArticle: BlogPost) => void;
}

export function AuthoringStudio({ isOpen, onClose, onArticlePublished }: AuthoringStudioProps) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [tags, setTags] = useState('Essays, Thoughts');
  const [bodyText, setBodyText] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const backupInputRef = useRef<HTMLInputElement | null>(null);

  // Load existing draft when opened
  useEffect(() => {
    if (isOpen) {
      const draft = loadSavedDraft();
      if (draft && !title && !bodyText) {
        setTitle(draft.title || '');
        setExcerpt(draft.excerpt || '');
        setReadTime(draft.readTime || '5 min read');
        setTags(draft.tags || 'Essays, Thoughts');
        setBodyText(draft.content || '');
      }
    }
  }, [isOpen]);

  // Auto-save draft on changes (debounced)
  useEffect(() => {
    if (!isOpen) return;
    if (!title && !bodyText) return;

    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      saveDraft({
        title,
        excerpt,
        readTime,
        tags,
        content: bodyText,
        lastUpdated: new Date().toLocaleTimeString(),
      });
      setAutoSaveStatus('saved');
    }, 600);

    return () => clearTimeout(timer);
  }, [title, excerpt, readTime, tags, bodyText, isOpen]);

  // Auto-calculate read time based on word count
  useEffect(() => {
    const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    setReadTime(`${minutes} min read`);
  }, [bodyText]);

  if (!isOpen) return null;

  // Insert markdown helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    sound.playClick();
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = bodyText.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = bodyText.substring(0, start) + replacement + bodyText.substring(end);
    setBodyText(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 20);
  };

  // Parse dropped or uploaded file (.md or .txt)
  const processUploadedFile = async (file: File) => {
    sound.playBlip();
    const text = await file.text();

    const lines = text.split('\n');
    let extractedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    let extractedExcerpt = '';
    const bodyLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!extractedTitle && line.startsWith('# ')) {
        extractedTitle = line.replace('# ', '').trim();
      } else if (!extractedExcerpt && line && !line.startsWith('#')) {
        extractedExcerpt = line.slice(0, 160);
        bodyLines.push(lines[i]);
      } else {
        bodyLines.push(lines[i]);
      }
    }

    setTitle(extractedTitle.charAt(0).toUpperCase() + extractedTitle.slice(1));
    if (extractedExcerpt) setExcerpt(extractedExcerpt);
    setBodyText(bodyLines.join('\n').trim());
    setErrorMessage('');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    if (!title.trim()) {
      setErrorMessage('Please provide an article title.');
      return;
    }
    if (!bodyText.trim() || bodyText.trim().length < 20) {
      setErrorMessage('Please write some content (at least 20 characters).');
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Split paragraphs
    const rawParagraphs = bodyText.split('\n\n').map((p) => p.trim()).filter(Boolean);

    // Extract table of contents from headers
    const toc = rawParagraphs
      .filter((p) => p.startsWith('## ') || p.startsWith('### '))
      .map((header) => {
        const clean = header.replace(/^#+\s*/, '');
        const id = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return { id, title: clean };
      });

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const published = saveCustomArticle({
      slug,
      title: title.trim(),
      excerpt: excerpt.trim() || rawParagraphs[0]?.slice(0, 150) || 'Published note by AB Peace.',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime,
      tags: parsedTags.length > 0 ? parsedTags : ['Dispatches'],
      content: rawParagraphs,
      tableOfContents: toc,
    });

    sound.playBlip();
    clearDraft();
    setPublishSuccess(published.slug);
    onArticlePublished(published);

    setTimeout(() => {
      onClose();
      window.location.hash = `#blog-${published.slug}`;
    }, 1200);
  };

  const handleBackupExport = () => {
    sound.playBlip();
    exportBackupJson();
  };

  const handleBackupImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      sound.playClick();
      const count = await importBackupJson(file);
      alert(`Successfully restored ${count} custom articles.`);
      window.location.reload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to import backup.';
      alert('Error: ' + msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 md:p-8 flex justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto text-zinc-200"
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) processUploadedFile(file);
        }}
      >
        {/* Drag-and-drop overlay indicator */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-zinc-950/90 border-2 border-dashed border-emerald-500 rounded-2xl flex flex-col items-center justify-center pointer-events-none p-6 text-center">
            <span className="text-3xl mb-2">📄</span>
            <div className="text-base font-medium text-white">Drop your document here</div>
            <div className="text-xs text-zinc-400 mt-1">Accepts Markdown (.md) or Text (.txt) files</div>
          </div>
        )}

        {/* Studio Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-sm font-mono font-semibold text-white">
              Authoring Studio
            </h2>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-900/60">
              🔒 Secured
            </span>
            <span className="hidden md:inline text-zinc-600">|</span>
            <span className="hidden md:inline text-[11px] font-mono text-zinc-400">
              {autoSaveStatus === 'saving' ? 'Auto-saving...' : autoSaveStatus === 'saved' ? 'Draft autosaved' : 'Ready'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setViewMode('edit');
                }}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'edit'
                    ? 'bg-zinc-800 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setViewMode('preview');
                }}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-zinc-800 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Lock Studio Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                lockStudio();
                onClose();
              }}
              title="Lock Studio & Revoke Session"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-red-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors ml-1"
            >
              <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="hidden sm:inline">Lock</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors ml-1"
              title="Close Studio (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Studio Body */}
        <form onSubmit={handlePublish} className="flex flex-col p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {publishSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="text-emerald-400 text-4xl">✓</div>
              <h3 className="text-xl font-display font-semibold text-white">Article Published to Live Site!</h3>
              <p className="text-xs text-zinc-400 font-mono">
                Live URL: <code className="text-zinc-200">/#blog-{publishSuccess}</code>
              </p>
              <p className="text-xs text-zinc-500">Redirecting to reader view...</p>
            </div>
          ) : viewMode === 'edit' ? (
            <>
              {/* Metadata row: Title & Read Time */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Article Title (e.g. Invariants of Tactile Computing in 2026)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl sm:text-2xl font-display font-semibold bg-transparent border-b border-zinc-800 pb-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Short Excerpt / Abstract
                    </label>
                    <input
                      type="text"
                      placeholder="One or two sentences explaining the core insight..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Systems, Latency, HCI"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertFormatting('## ')}
                    className="px-2.5 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                    title="Section Heading"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="px-2.5 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors font-bold"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="px-2.5 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors italic"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- ')}
                    className="px-2.5 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('```typescript\n// Code example\n', '\n```')}
                    className="px-2.5 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                    title="Code Snippet"
                  >
                    &lt;/&gt; Code
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ')}
                    className="px-2.5 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                    title="Quote"
                  >
                    Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('![Diagram description](', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80)')}
                    className="px-2.5 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                    title="Insert Lazy-Loaded Image"
                  >
                    🖼 Image
                  </button>
                </div>

                {/* Upload or paste document button */}
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processUploadedFile(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors flex items-center gap-1.5"
                  >
                    <span>Upload .md / .txt</span>
                  </button>
                </div>
              </div>

              {/* Main Body Textarea */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={14}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Write your article in natural prose. Separate paragraphs with double line breaks. Use '## Section Title' for headings and ``` for code blocks. You can also drag and drop markdown files right here..."
                  className="w-full p-4 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 font-mono leading-relaxed resize-y min-h-[300px]"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-300 font-mono">
                  {errorMessage}
                </div>
              )}
            </>
          ) : (
            /* Live Aesthetic Preview Mode */
            <div className="space-y-6 py-2 px-1 max-w-3xl">
              <div>
                <div className="text-xs font-mono text-zinc-500 mb-2">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {readTime} · By AB Peace
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
                  {title || 'Untitled Article'}
                </h1>
                {excerpt && (
                  <p className="text-sm text-zinc-400 font-medium italic border-l-2 border-zinc-700 pl-3 my-4">
                    {excerpt}
                  </p>
                )}
              </div>

              <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-body">
                {bodyText.split('\n\n').map((block, idx) => {
                  const trimmed = block.trim();
                  if (trimmed.startsWith('![')) {
                    const match = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                    if (match) {
                      return (
                        <div key={idx} className="my-4">
                          <LazyImage
                            src={match[2]}
                            alt={match[1] || 'Preview visual artifact'}
                            aspectRatio="aspect-[16/9]"
                            containerClassName="relative w-full overflow-hidden bg-zinc-950 rounded-xl border border-zinc-800 shadow"
                          />
                          {match[1] && (
                            <span className="block text-center text-xs font-mono text-zinc-500 mt-1.5">
                              {match[1]}
                            </span>
                          )}
                        </div>
                      );
                    }
                  }
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-lg font-display font-semibold text-white pt-4 pb-1 border-b border-zinc-900">
                        {trimmed.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith('```')) {
                    const clean = trimmed.replace(/```[a-z]*\n?/, '').replace(/```$/, '');
                    return (
                      <pre key={idx} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto my-3">
                        <code>{clean}</code>
                      </pre>
                    );
                  }
                  if (trimmed.startsWith('- ')) {
                    return (
                      <div key={idx} className="flex items-start gap-2 pl-2">
                        <span className="text-zinc-500">•</span>
                        <span>{trimmed.replace('- ', '')}</span>
                      </div>
                    );
                  }
                  return <p key={idx}>{trimmed}</p>;
                })}
              </div>
            </div>
          )}

          {/* Bottom Bar: Action & Backup Controls */}
          {!publishSuccess && (
            <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              {/* Backup & Export options */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBackupExport}
                  className="text-zinc-400 hover:text-white transition-colors"
                  title="Download all published articles as JSON backup"
                >
                  Export Backup (.json)
                </button>
                <span className="text-zinc-700">·</span>
                <input
                  ref={backupInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleBackupImport}
                />
                <button
                  type="button"
                  onClick={() => backupInputRef.current?.click()}
                  className="text-zinc-400 hover:text-white transition-colors"
                  title="Import previously exported articles backup"
                >
                  Import Backup
                </button>
              </div>

              {/* Publish Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    clearDraft();
                    setTitle('');
                    setExcerpt('');
                    setBodyText('');
                  }}
                  className="px-3 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Clear Draft
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Publish to Live Site</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
