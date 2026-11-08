import { LazyImage } from './LazyImage';

export function About() {
  const stackCategories = [
    {
      name: 'Core Systems',
      tools: ['Rust', 'Zig', 'TypeScript', 'WebAssembly', 'Go'],
    },
    {
      name: 'Creative & Visual',
      tools: ['WebGL2', 'GLSL Shaders', 'Motion', 'Canvas API', 'Tailwind CSS'],
    },
    {
      name: 'Intelligent Primitives',
      tools: ['Local LLMs', 'Tool Calling', 'Vector Geometry', 'Autonomous Loops'],
    },
    {
      name: 'Edge & Storage',
      tools: ['Cloudflare Workers', 'SQLite / Turso', 'Docker', 'SharedArrayBuffer'],
    },
  ];

  const currentCuriosities = [
    {
      title: 'Context Window Pruning & AST Sifting',
      note: 'Using local Tree-sitter parsers to strip 70% of unreferenced symbols before model dispatch, eliminating hallucination from context poisoning.',
    },
    {
      title: 'Spatial GPU Code Diff Scrubbing',
      note: 'Rethinking git diffs as continuous 144Hz WebGPU visual timelines for frictionless human evaluation of speculative agent proposals.',
    },
    {
      title: 'Sub-Millisecond Process Invariant Watchdogs',
      note: 'Writing zero-allocation Zig kernels that monitor autonomous execution loops and kill processes that drift outside formal memory boundaries.',
    },
    {
      title: 'Serverless P2P CRDT Lattices',
      note: 'Connecting browser tabs and local laptops directly over WebRTC and SQLite WASM to escape centralized cloud databases.',
    },
  ];

  return (
    <section id="about" className="py-24 border-b border-zinc-900 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block">
              Identity &amp; Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              About AB Peace
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            An agnostic technologist navigating the intersection of low-latency systems, creative
            graphics, and autonomous agent loops.
          </p>
        </div>

        {/* Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Portrait Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
              <LazyImage
                src="/src/assets/images/vadirn_portrait_1793421493128.jpg"
                alt="AB Peace in studio"
                aspectRatio="aspect-square"
                className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-102"
                containerClassName="relative w-full h-full overflow-hidden"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-zinc-300 flex items-center justify-between">
                <span>ab peace / builder</span>
                <span>lat. 16ms</span>
              </div>
            </div>

            {/* Quick Metadata Block */}
            <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-xs text-zinc-400 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Orientation</span>
                <span className="text-zinc-200 font-mono">Tech-Agnostic</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Current Base</span>
                <span className="text-zinc-200 font-mono">Lisbon (UTC+1)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Modus Operandi</span>
                <span className="text-zinc-200 font-mono">Vibe Coding &amp; Systems</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Daily Rig</span>
                <span className="text-zinc-200 font-mono">M4 Max + Corne Split</span>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-8 flex flex-col gap-6 text-base text-zinc-300 leading-relaxed">
            <p className="text-lg text-zinc-200 font-medium leading-relaxed">
              I call myself a &ldquo;vibe coder&rdquo; because in late 2026, software creation has
              permanently crossed a historical threshold. Writing syntax line-by-line is no longer
              the bottleneck of engineering. The real challenge of our era is architectural taste,
              sensory latency, and knowing what <em>not</em> to build.
            </p>

            <p>
              When typing characters is effectively free, the internet is rapidly suffocating in
              hyper-generated corporate slop: generic SaaS templates with purple gradient buttons
              and unwired AI chat assistants. I rebel against that by building bespoke, tactile,
              unforgivingly fast software with zero external cruft.
            </p>

            <p>
              I am radically technology-agnostic. If a high-throughput problem calls for raw
              memory mapping in Rust, I write it. If a creative tool demands a custom GLSL fragment
              shader running at 144Hz on a canvas, I ship it. If a multi-agent loop needs strict
              invariant boundaries in Zig, I enforce it. Languages are paint; systems are the medium.
            </p>

            <div className="pt-6 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Speed Over Dogma</h3>
                <p className="text-xs text-zinc-400 leading-normal">
                  The finest stack is whatever collapses the distance between a raw intuition and
                  a working, tactile artifact.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Sub-10ms Feedback</h3>
                <p className="text-xs text-zinc-400 leading-normal">
                  Software must feel physically alive. If an interface drops frames or stalls
                  human input, it fractures cognitive flow.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Bespoke Artifacts</h3>
                <p className="text-xs text-zinc-400 leading-normal">
                  Rejecting disposable cookie-cutter templates in favor of idiosyncratic, lovingly
                  crafted personal computing tools.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Agnostic Toolkit */}
        <div className="mb-20">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-1">Agnostic Toolkit</h3>
            <p className="text-xs text-zinc-400">
              Languages, runtimes, and primitives chosen for leverage rather than habit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stackCategories.map((cat) => (
              <div
                key={cat.name}
                className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                    {cat.name}
                  </h4>
                  <ul className="space-y-1.5 text-sm text-zinc-300">
                    {cat.tools.map((tool) => (
                      <li key={tool} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Curiosity Radar */}
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-1">Current Research Radar</h3>
            <p className="text-xs text-zinc-400">
              Active engineering vectors and questions I am hacking on this month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCuriosities.map((item, idx) => (
              <div
                key={item.title}
                className="p-5 rounded-xl border border-zinc-800/70 bg-zinc-950/60 flex items-start gap-4"
              >
                <span className="text-xs font-mono text-zinc-400 tabular-nums shrink-0 pt-0.5">
                  0{idx + 1}.
                </span>
                <div>
                  <h4 className="text-sm font-medium text-zinc-200 mb-1">{item.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
