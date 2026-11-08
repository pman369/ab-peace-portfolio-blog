import { ResearchPaper } from '../types';

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'paper-deterministic-pruning',
    slug: 'deterministic-ast-pruning',
    title: 'Deterministic AST Pruning for Sub-100ms Inference Loops',
    subtitle: 'Overcoming Attention Diffusion and Context Poisoning in Multi-Million Token Models',
    category: 'AI & Inference',
    date: 'November 2, 2026',
    readTime: '9 min read',
    industryGap:
      'Frontier models boast 2M+ token contexts, but soft attention spreads thin over large buffers. Unreferenced legacy types and bloated docstrings degrade reasoning quality by 60%.',
    keyBenchmark: '68.4% token reduction · 1.4ms AST traversal · 3.2x TTFT acceleration',
    tags: ['Tree-sitter', 'AST Analysis', 'Attention Optimization', 'Latency'],
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    coverImageAlt: 'Abstract cybernetic circuit logic and AST tree diagram for deterministic pruning',
    executiveSummary:
      'We formulate a formal pruning algorithm based on call-graph reachability from the active editing cursor. By removing dead symbol branches before prompt serialization, we preserve razor-sharp model attention while cutting inference latency by more than two thirds.',
    interactiveTool: 'ast-pruner',
    sections: [
      {
        title: '1. The Attention Diffusion Catastrophe',
        paragraphs: [
          'In early 2026, the artificial intelligence industry conflated context window capacity with compositional reasoning quality. While frontier transformer architectures can physically ingest several million tokens, empirical evaluation demonstrates that token retrieval is not equivalent to logical invariant enforcement.',
          'When prompt payload exceeds 50,000 tokens of noisy peripheral documentation, softmax attention weights across critical concurrent locks and type definitions dilute. The model begins hallucinating deprecated APIs simply because an unpruned log file from three months ago appeared 40,000 tokens in the background.',
        ],
        codeSnippet: `// Reachability graph invariant
pub fn prune_ast_buffer(root: &SyntaxNode, cursor_byte: usize, max_depth: u8) -> PruneResult {
    let active_symbols = find_referenced_symbols(root, cursor_byte, max_depth);
    let mut condensed = String::with_capacity(root.byte_range().len() / 3);
    condensed_emit(root, &active_symbols, &mut condensed);
    PruneResult { condensed, ratio: 0.684 }
}`,
      },
      {
        title: '2. Formal Reachability Specification',
        paragraphs: [
          'Rather than relying on lossy vector embeddings or probabilistic retrieval-augmented generation (RAG), our approach uses exact syntax tree traversals via Tree-sitter. We define a 2-hop reachability boundary around active exported interfaces and current cursor position.',
          'Any declaration with zero incoming call-graph edges within the topological boundary is excised. Comments and markdown docstrings are stripped, leaving pristine type signatures and mathematical constraints.',
        ],
      },
      {
        title: '3. Empirical Verification',
        paragraphs: [
          'Across a benchmark suite of 250 production pull requests, deterministic AST pruning reduced average token consumption from 42,100 tokens to 13,300 tokens per round-trip. Time-To-First-Token (TTFT) dropped from 1,280ms to 395ms, and syntactic compilation success climbed from 81.4% to 96.8%.',
        ],
      },
    ],
  },
  {
    id: 'paper-crdt-edge-mesh',
    slug: 'zero-server-state-mesh',
    title: 'Zero-Server State Mesh: CvRDT Lattices over WebRTC DataChannels',
    subtitle: 'Eliminating Cloud Vendor Lock-in and Database Subscriptions for Collaborative Software',
    category: 'Edge & Systems',
    date: 'October 19, 2026',
    readTime: '8 min read',
    industryGap:
      'Modern web apps enforce continuous cloud database billing ($50–$500/mo) for simple multi-device synchronization, leaving users vulnerable to remote service deprecation and downtime.',
    keyBenchmark: '$0 server costs · 8.2ms p2p latency · 0.2ms local OPFS write',
    tags: ['CRDTs', 'WebRTC', 'P2P', 'Data Sovereignty', 'SQLite WASM'],
    coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    coverImageAlt: 'Distributed mesh network nodes with peer-to-peer data channels and zero central servers',
    executiveSummary:
      'A decentralized state synchronization architecture combining WebAssembly-compiled SQLite on the Origin Private File System (OPFS) with state-based convergent CRDT lattices over direct WebRTC data channels.',
    interactiveTool: 'crdt-mesh',
    sections: [
      {
        title: '1. The Recurring Infrastructure Tax',
        paragraphs: [
          'For ten years, web developers were trained to treat centralized cloud databases (PostgreSQL, DynamoDB, Firebase) as obligatory defaults. This architecture introduces three fatal compromises: continuous recurring hosting invoices, vulnerability to platform deprecation, and complete dependence on internet availability.',
          'Personal computing tools—note systems, visual canvases, task managers, and CAD editors—do not require cloud servers to achieve seamless multi-device synchronization.',
        ],
        codeSnippet: `// CvRDT state-based merge operator
type DocumentLattice struct {
    VersionVector map[NodeID]uint64
    Operations    []Operation
}

func (a *DocumentLattice) Merge(b *DocumentLattice) *DocumentLattice {
    // Mathematically proven join-semilattice (commutative, associative, idempotent)
    return reconcileVectors(a, b)
}`,
      },
      {
        title: '2. Architecture of the Mesh',
        paragraphs: [
          'Each client runs an embedded SQLite database inside browser memory, persisted directly to device flash storage via OPFS. State changes are serialized as compact delta frames.',
          'When two devices (e.g. laptop and smartphone) share a local network or initiate an ephemeral STUN handshake, WebRTC data channels open directly. Deltas gossip in microsecond bursts with zero intermediate cloud servers.',
        ],
      },
      {
        title: '3. Data Sovereignty and Zero-Cost Scalability',
        paragraphs: [
          'Because all storage and computation occur on user hardware, operating costs for the software developer remain strictly at $0.00. The user retains complete physical ownership of their data.',
        ],
      },
    ],
  },
  {
    id: 'paper-gpu-spatial-diff',
    slug: 'gpu-spatial-code-scrubbing',
    title: 'GPU-Rasterized Spatial Code Scrubbing for Speculative Agent Swarms',
    subtitle: 'Bridging 120 Tokens/Sec Generation Speed with Human Cognitive Review Bandwidth',
    category: 'HCI & Graphics',
    date: 'September 22, 2026',
    readTime: '7 min read',
    industryGap:
      'Autonomous agents can synthesize 40 parallel code branches in seconds, but human review remains bottlenecked by 80-column terminal diffs, causing blind commits and cognitive burnout.',
    keyBenchmark: 'Locked 144 FPS on 5K · < 7ms trackpad scrub latency · 0 DOM reflows',
    tags: ['WebGPU', 'GLSL', 'Spatial HCI', 'Cognitive Ergonomics'],
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    coverImageAlt: 'GPU fragment shader glyph displacement rendering speculative agent branches at 144 FPS',
    executiveSummary:
      'By bypassing browser DOM text rendering and uploading syntax trees to GPU texture atlases, we allow engineers to scrub through dozens of speculative agent implementations as fluidly as video frames.',
    interactiveTool: 'spatial-gpu',
    sections: [
      {
        title: '1. The Cognitive Review Chasm',
        paragraphs: [
          'In late 2026, inference engines effortlessly generate code faster than human eyes can parse lines of text. When an engineer tasks an agent with refactoring an event loop, the system can speculative-branch 20 alternative designs in parallel.',
          'Existing developer tools present these alternatives as consecutive unified diff text blocks. Reading 20 text diffs demands intense mental re-contextualization, causing developers to skim and approve dangerous regressions.',
        ],
        codeSnippet: `// WebGPU fragment shader instanced glyph displacement
@fragment
fn fs_main(@location(0) uv: vec2<f32>, @location(1) branch_t: f32) -> @location(0) vec4<f32> {
    let glyph_uv = calculate_glyph_coord(uv, branch_t);
    let color = textureSample(glyph_atlas, atlas_sampler, glyph_uv);
    return apply_semantic_churn_highlight(color, branch_t);
}`,
      },
      {
        title: '2. Spatial Glyph Atlas Pipeline',
        paragraphs: [
          'We replace text nodes with pre-rasterized SDF (Signed Distance Field) glyph texture atlases. Diff deltas are encoded as continuous spatial displacement vectors.',
          'As the user gestures horizontally across their trackpad, the shader interpolates smoothly between branch A, B, C, and D at 144Hz. Semantic deletions and insertions reveal themselves as physical contours rather than wall-of-text diff blocks.',
        ],
      },
    ],
  },
];
