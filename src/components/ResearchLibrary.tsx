import { useState } from 'react';
import { RESEARCH_PAPERS } from '../data/research';
import { ResearchPaper } from '../types';
import { sound } from '../utils/audio';
import { LazyImage } from './LazyImage';

export function ResearchLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePaper, setActivePaper] = useState<ResearchPaper | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Interactive tool states
  const [pruneInputLength, setPruneInputLength] = useState(45000);
  const [crdtPeers, setCrdtPeers] = useState(3);

  const categories = ['All', 'AI & Inference', 'Edge & Systems', 'HCI & Graphics'];

  const filteredPapers = RESEARCH_PAPERS.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  const handleShare = (paper: ResearchPaper, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playBlip();
    const url = `${window.location.origin}/#research-${paper.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(paper.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleDownloadMarkdown = (paper: ResearchPaper, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const mdContent = `# ${paper.title}
## ${paper.subtitle}
Author: AB Peace
Date: ${paper.date}
Benchmark: ${paper.keyBenchmark}

### Industry Gap Addressed
${paper.industryGap}

### Executive Summary
${paper.executiveSummary}

${paper.sections
  .map(
    (s) => `### ${s.title}
${s.paragraphs.join('\n\n')}
${s.codeSnippet ? `\`\`\`typescript\n${s.codeSnippet}\n\`\`\`` : ''}`
  )
  .join('\n\n')}

---
Downloaded from AB Peace Living Research Hub (abpeace.dev)`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="research" className="py-24 border-b border-zinc-900 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block">
              Living Research &amp; Whitepapers
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              Interactive Research Hub
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Rigorous technical whitepapers addressing verified 2026 industry gaps, accompanied by
            downloadable documents and live parameter models.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800/80 mb-10 w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Research Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <article
              key={paper.id}
              onClick={() => {
                sound.playClick();
                setActivePaper(paper);
              }}
              className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Benchmark Tag */}
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-md mb-4 w-fit">
                  {paper.keyBenchmark}
                </div>

                {paper.coverImage && (
                  <div className="mb-4">
                    <LazyImage
                      src={paper.coverImage}
                      alt={paper.coverImageAlt || paper.title}
                      aspectRatio="aspect-[16/9]"
                      containerClassName="relative w-full overflow-hidden bg-zinc-950/80 rounded-xl border border-zinc-800/60 group-hover:border-zinc-700 transition-colors"
                    />
                  </div>
                )}

                <h3 className="text-lg font-semibold text-white group-hover:text-zinc-100 transition-colors mb-2 font-display [text-wrap:balance]">
                  {paper.title}
                </h3>

                <p className="text-xs font-mono text-zinc-400 mb-4 leading-normal">
                  {paper.subtitle}
                </p>

                {/* Industry Gap Callout */}
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-400 mb-6 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Industry Gap Addressed
                  </span>
                  <p className="line-clamp-3 leading-relaxed">{paper.industryGap}</p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">{paper.readTime}</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleShare(paper, e)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Copy shareable link"
                  >
                    {copiedSlug === paper.slug ? '✓ Copied' : 'Share ↗'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDownloadMarkdown(paper, e)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Download Markdown whitepaper"
                  >
                    Download .md
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Paper Detail & Interactive Modal */}
        {activePaper && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 md:p-10 flex justify-center animate-in fade-in duration-200"
            onClick={() => setActivePaper(null)}
          >
            <div
              className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-10 my-auto text-zinc-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActivePaper(null);
                  }}
                  className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  <span>←</span>
                  <span>Back to Research Hub</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleDownloadMarkdown(activePaper, e)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    Download .md
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleShare(activePaper, e)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {copiedSlug === activePaper.slug ? 'Link Copied!' : 'Copy Share Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePaper(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="mb-8">
                <div className="text-xs font-mono text-emerald-400 mb-2">
                  {activePaper.category} · {activePaper.date} · By AB Peace
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 [text-wrap:balance]">
                  {activePaper.title}
                </h1>
                <p className="text-sm font-mono text-zinc-400 mb-4">{activePaper.subtitle}</p>

                {/* Benchmark badge */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs space-y-1 mb-6">
                  <div className="text-zinc-500">Verified Empirical Benchmark:</div>
                  <div className="text-emerald-300 font-semibold">{activePaper.keyBenchmark}</div>
                </div>

                {activePaper.coverImage && (
                  <div className="mb-6">
                    <LazyImage
                      src={activePaper.coverImage}
                      alt={activePaper.coverImageAlt || activePaper.title}
                      aspectRatio="aspect-[21/9]"
                      containerClassName="relative w-full overflow-hidden bg-zinc-950 rounded-xl border border-zinc-800 shadow-lg"
                    />
                  </div>
                )}
              </div>

              {/* Interactive Sandbox Model Widget */}
              {activePaper.interactiveTool === 'ast-pruner' && (
                <div className="my-8 p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span>Interactive AST Pruning Simulator</span>
                    <span className="text-emerald-400">~68.4% Efficiency</span>
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-1">
                      Raw Context Buffer: {pruneInputLength.toLocaleString()} tokens
                    </label>
                    <input
                      type="range"
                      min={5000}
                      max={120000}
                      step={5000}
                      value={pruneInputLength}
                      onChange={(e) => setPruneInputLength(Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                      <div className="text-zinc-500 text-[10px]">Condensed Prompt Payload</div>
                      <div className="text-sm font-bold text-white tabular-nums">
                        {Math.round(pruneInputLength * 0.316).toLocaleString()} tokens
                      </div>
                    </div>
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                      <div className="text-zinc-500 text-[10px]">Estimated TTFT Latency</div>
                      <div className="text-sm font-bold text-emerald-400 tabular-nums">
                        {Math.round(pruneInputLength * 0.009)} ms (down from {Math.round(pruneInputLength * 0.028)} ms)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePaper.interactiveTool === 'crdt-mesh' && (
                <div className="my-8 p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span>WebRTC Peer Mesh Topology Simulator</span>
                    <span className="text-emerald-400">0ms Cloud Latency</span>
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-1">
                      Connected Peer Devices: {crdtPeers}
                    </label>
                    <div className="flex gap-2">
                      {[2, 3, 5, 8].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setCrdtPeers(n)}
                          className={`px-3 py-1 rounded border text-xs ${
                            crdtPeers === n
                              ? 'bg-zinc-800 text-white border-zinc-600'
                              : 'text-zinc-400 border-zinc-800'
                          }`}
                        >
                          {n} Peers
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                      <div className="text-zinc-500 text-[10px]">P2P Gossip Bandwidth</div>
                      <div className="text-sm font-bold text-white tabular-nums">
                        {(crdtPeers * 1.8).toFixed(1)} KB/sec (LZ4 delta)
                      </div>
                    </div>
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                      <div className="text-zinc-500 text-[10px]">Central Server Cost</div>
                      <div className="text-sm font-bold text-emerald-400 tabular-nums">$0.00 / mo</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Executive Summary */}
              <div className="mb-8 p-4 rounded-xl bg-zinc-950/80 border-l-2 border-emerald-400 text-sm text-zinc-300 leading-relaxed italic">
                {activePaper.executiveSummary}
              </div>

              {/* Sections & Code */}
              <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
                {activePaper.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-lg font-display font-semibold text-white pt-4 border-b border-zinc-900 pb-1">
                      {sec.title}
                    </h3>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                    {sec.codeSnippet && (
                      <pre className="p-4 rounded-xl bg-[#060608] border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto my-3 leading-relaxed">
                        <code>{sec.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>AB Peace · Living Research Hub</span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    window.print();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Print / Save PDF 🖨
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
