import { sound } from '../utils/audio';

interface NowPageProps {
  onBackToHome: () => void;
}

export function NowPage({ onBackToHome }: NowPageProps) {
  const currentProjects = [
    {
      title: 'tactile-diff (WebGPU Scrubber)',
      status: 'Active build · 144Hz target',
      description:
        'Replacing text-heavy terminal git diffs with a GPU-accelerated spatial timeline. Lets me scrub through 40 speculative agent code iterations on a trackpad as seamlessly as scrubbing video frames in DaVinci Resolve.',
      tags: ['GLSL', 'WebGL2', 'WebGPU', 'Spatial HCI'],
    },
    {
      title: 'context-sieve AST daemon',
      status: 'Daily production dogfooding',
      description:
        'A local daemon sitting between my editor buffer and inference APIs. Prunes 68% of unreferenced symbols and docstrings before prompt submission, curing context poisoning and cutting latency in half.',
      tags: ['Rust', 'Tree-sitter', 'WASM', 'Radix Trees'],
    },
    {
      title: 'Local 3-bit Neural Engine Kernels',
      status: 'Benchmarking on M4 Max',
      description:
        'Optimizing ultra-quantized small reasoning models to run completely silent inside unified memory without triggering laptop fans or making cloud network round-trips.',
      tags: ['Local Weights', 'Quantization', 'Zero Telemetry'],
    },
  ];

  const technologiesLearning = [
    {
      name: 'WGSL Compute Workgroups',
      stage: 'Deep dive',
      focus:
        'Mastering workgroup shared memory barriers and atomic operations in WebGPU for parallel computational geometry.',
    },
    {
      name: 'Dynamic Media & Smalltalk Primitives',
      stage: 'Historical study',
      focus:
        'Dissecting Ivan Sutherland’s 1963 Sketchpad thesis and Alan Kay’s Dynabook memos to remember what computing felt like before the web became an advertising mall.',
    },
    {
      name: 'Zig Memory Allocator Design',
      stage: 'Crafting',
      focus:
        'Writing bespoke arena and pool allocators in Zig that eliminate all runtime overhead from developer CLI tools.',
    },
    {
      name: 'AudioWorklet Low-Latency DSP',
      stage: 'Prototyping',
      focus:
        'Synthesizing physical acoustic click feedback in browser audio threads with sub-2 millisecond input-to-sound response.',
    },
  ];

  const currentInterests = [
    {
      category: 'Paper Books & Reading',
      items: [
        'Sketchpad: A Man-Machine Graphical Communication System — Ivan Sutherland (1963)',
        'The Timeless Way of Building — Christopher Alexander',
        'Reflections on Trusting Trust — Ken Thompson (re-reading for agent safety)',
      ],
    },
    {
      category: 'Sound & Acoustics',
      items: [
        'ECM Records jazz catalog (Keith Jarrett, Steve Reich, Arvo Pärt)',
        'Hiroshi Yoshimura’s ambient environmental music on cassette',
        'Hand-soldered analog synthesizer filters and pure triangle wave oscillators',
      ],
    },
    {
      category: 'Physical Anchors',
      items: [
        'Steel-frame all-road bicycle rides through the pine forests of Sintra',
        'Manual pour-over coffee: Ethiopian anaerobic natural beans, 1:16 ratio on an Origami dripper',
        'Corne split columnar keyboard with hand-lubed silent linear switches',
      ],
    },
  ];

  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-6 animate-in fade-in duration-200">
      {/* Top back navigation */}
      <div className="mb-10">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onBackToHome();
          }}
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Return to AB Peace overview</span>
        </button>
      </div>

      {/* Page Title & Dateline */}
      <div className="mb-16 border-b border-zinc-900 pb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-3">
          <span>abpeace</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">now</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-semibold text-white tracking-tight mb-4">
          What I&apos;m doing now
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
          <span>Updated October 31, 2026</span>
          <span className="text-zinc-700">·</span>
          <span>Lisbon loft overlooking the Tagus estuary (UTC+1)</span>
          <span className="text-zinc-700">·</span>
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 hover:text-zinc-200 underline transition-colors"
          >
            About &ldquo;now&rdquo; pages ↗
          </a>
        </div>
      </div>

      {/* Narrative Snapshot */}
      <div className="mb-16 p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 text-sm text-zinc-300 leading-relaxed space-y-3">
        <p className="text-zinc-100 font-medium">
          Late October in Lisbon. Autumn rain against the window, cold sea air, and two terminal
          screens glowing in the dusk.
        </p>
        <p>
          I have largely stopped caring about the relentless hype cycles of artificial general
          intelligence. Instead, I am deeply obsessed with the tactile interface problem: how do we
          make human steering feel as fluid, expressive, and physically grounded as playing an acoustic
          instrument, even while autonomous agents churn in the background?
        </p>
      </div>

      {/* Section 1: Current Projects */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-white">1. Active Code &amp; Hardware</h2>
          <span className="text-xs font-mono text-zinc-500">Work in Progress</span>
        </div>

        <div className="space-y-4">
          {currentProjects.map((p) => (
            <div
              key={p.title}
              className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-base font-semibold font-mono text-zinc-100">{p.title}</h3>
                <span className="text-xs font-mono text-zinc-400">{p.status}</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-500">
                {p.tags.map((t, idx) => (
                  <span key={t} className="flex items-center gap-2">
                    <span>{t}</span>
                    {idx < p.tags.length - 1 && <span className="text-zinc-700">·</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Technologies Being Learned */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-white">
            2. Intellectual Vectors Being Explored
          </h2>
          <span className="text-xs font-mono text-zinc-500">Active Study</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {technologiesLearning.map((tech) => (
            <div
              key={tech.name}
              className="p-5 rounded-xl border border-zinc-800/70 bg-zinc-900/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white font-mono">{tech.name}</h3>
                  <span className="text-[11px] font-mono text-zinc-400">{tech.stage}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{tech.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: General Interests */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-white">3. Offline Grounding</h2>
          <span className="text-xs font-mono text-zinc-500">Sanity &amp; Sensory Rituals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentInterests.map((interest) => (
            <div
              key={interest.category}
              className="p-5 rounded-xl border border-zinc-800/70 bg-zinc-900/20 space-y-3"
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                {interest.category}
              </h3>
              <ul className="space-y-2 text-xs text-zinc-400 leading-normal">
                {interest.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-zinc-600 font-mono">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="pt-8 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div>
          Current rule:{' '}
          <span className="text-zinc-200">No screen time after 8:00 PM; paper books only.</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#blog"
            onClick={() => {
              sound.playClick();
              onBackToHome();
              window.location.hash = '#blog';
            }}
            className="hover:text-white transition-colors"
          >
            Read Technical Essays →
          </a>
        </div>
      </div>
    </div>
  );
}
