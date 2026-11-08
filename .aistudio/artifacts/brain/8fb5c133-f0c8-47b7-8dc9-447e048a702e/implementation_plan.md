# Implementation Plan: In-Browser Studio, Living Research Library & Responsive Performance

A comprehensive architectural upgrade to transform **AB Peace** into a high-performance, cross-device personal hub featuring a zero-barrier visual article editor for non-technical publishing, a downloadable interactive living research library, and fluid responsive design with adaptive mobile controls.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your confirmed choices in Phase 1, the following core specifications are locked in:

- **Confirmed Decision 1: Visual In-Browser Studio**: Non-technical publishing will operate through a built-in visual editor with live markdown preview, formatting toolbar, draft autosave, document upload, and export.
- **Confirmed Decision 2: Fluid Responsive Design**: The interface will be re-engineered with adaptive mobile navigation, touch-friendly touch targets ($\ge 44\text{px}$), reduced-motion and battery-conscious canvas scaling, and zero layout shift across all viewports.
- **Confirmed Decision 3: Interactive Living Research Library**: High-conviction projects and industry gap analyses will be delivered as an **Interactive Research & Document Hub**, featuring downloadable whitepapers, live parameter calculators, and instant sharing links.

---

## 1. Overview & Core Concept

### What It Delivers
1. **The In-Browser Authoring Studio**: An accessible, zero-code editor embedded in the site. The owner can compose articles, paste or upload documents (`.md`, `.txt`, `.pdf`), preview formatting in real time, and publish immediately to the public blog and RSS stream without touching git, terminal commands, or build scripts.
2. **Interactive Living Research Library**: A curated repository of technical whitepapers and architecture specs addressing late-2026 industry gaps (e.g., *Deterministic Context Pruning*, *GPU-Driven Tactile Interfaces*, *Edge-Native Zero-Server Sync*). Each document includes reader metrics, downloadable formatted PDFs/Markdown, and interactive parameter sandboxes.
3. **Cross-Device Performance Acceleration**:
   - Adaptive frame throttling for the ambient canvas (60–120Hz on desktop, battery-saving 30Hz or CSS fallback on mobile).
   - Component lazy loading and code splitting to keep initial bundle load under 50ms.
   - Touch-optimized drawer and navigation controls replacing narrow hover menus on touchscreens.

### Target Audience & Persona
- **Site Owner (AB Peace)**: Needs to publish essays, share technical research, and update work status effortlessly from any device (laptop, tablet, phone) without technical friction.
- **Visitors (Founders, Engineers, Collaborators)**: Expect a lightning-fast, tactile experience with clear ways to read, download, and share documents on mobile and desktop alike.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. VISITOR DISCOVERY FLOW                                                   │
│    Hero / About ──> Living Research Hub ──> Read Essay / Living Document    │
│                           │                              │                  │
│                           └── Download PDF/Markdown      └── Share Link     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. NON-TECHNICAL AUTHORING FLOW                                             │
│    Click "Studio" (or Cmd+E) ──> Visual Editor (Rich toolbar / Markdown)    │
│                                       │                                     │
│    Drag & Drop File (.md/.txt) ───────┼──> Live Aesthetic Preview Pane      │
│                                       │                                     │
│                                       └──> "Publish" ──> Live Blog & RSS   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme Tokens
- **Design Philosophy**: Deep obsidian minimalism with warm hairline structure, typographic hierarchy, and zero clutter.
- **Palette**:
  - Dominant Neutral: `#09090b` (Deep obsidian background)
  - Structural Surfaces: `#18181b` (Zinc-900 cards and studio drawer)
  - Hairline Borders: `#27272a` (Subtle 1px boundaries)
  - High-Intent Accents: Electric emerald (`#34d399` for live availability/publishing), Warm Amber (`#fbbf24` for drafts and research tags)
- **Typography**:
  - Display / Headings: `Outfit` (Architectural geometric sans)
  - Body Prose: `Plus Jakarta Sans` (16px, 1.65 line-height, 65ch measure)
  - Data & Code: `JetBrains Mono` with `tabular-nums`
- **Mobile UX Adjustments**:
  - Mobile bottom navigation bar for one-thumb reachability on handheld viewports.
  - Generous touch targets ($\ge 44\text{px}$) for all buttons, toggles, and modal dismiss actions.
  - Sticky header capped strictly at $\le 12\%$ of mobile viewport height.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Built-in Studio vs. External Headless CMS
- **Chosen Approach**: Built-in client-side visual studio with local persistence (`localStorage` + JSON document import/export) and draft sharing.
- **Why**: An external CMS (Sanity, Contentful, Strapi) requires API keys, ongoing third-party subscriptions, backend servers, and network round-trips. An in-browser studio provides **instantaneous local-first publishing** with zero recurring cost and complete data privacy.
- **Backup & Portability**: Includes 1-click **"Export Backup (.json)"** and **"Import Backup"** so the owner can migrate or sync their published articles across devices in seconds.

### Decision 2: Living Documents vs. Static Uploaded PDFs
- **Chosen Approach**: Dual-mode living documents. Articles render natively as beautifully formatted web manuscripts with instant shareable links, plus 1-click **Download as Markdown** and **Print/Save as PDF**.
- **Why**: Static PDFs are notoriously difficult to read on smartphones (pinch-to-zoom fatigue). Living web documents render responsively on all screens while still providing PDF export for offline archival.

### Decision 3: Adaptive Canvas Throttling
- **Chosen Approach**: Listen to device capabilities, touch support, and document visibility. If on mobile or low-power mode, the ambient canvas drops from 60–120Hz continuous drawing to lightweight requestIdleCallback updates or static particle styling.
- **Why**: Preserves battery life on phones while maintaining the signature high-craft visual vibe on desktop workstations.

---

## 4. Technical Architecture & Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SYSTEM ARCHITECTURE                                                         │
│                                                                             │
│  ┌─────────────────────── App.tsx (Root State) ──────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌───────────────── Navbar (Desktop & Mobile Drawer) ──────────────┐  │  │
│  │  │  Brand (~ AB Peace)  ·  Now  ·  Blog  ·  Research  ·  Studio    │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                       │  │
│  │  ┌──────────────────── Views / Sections ───────────────────────────┐  │  │
│  │  │  - Hero (Split-screen + Live Vibe Canvas)                       │  │  │
│  │  │  - About (Manifesto + Rig + Rituals)                            │  │  │
│  │  │  - Living Research & Document Hub (Whitepapers + Gap Analyses)  │  │  │
│  │  │  - Blog & Mental Models (Search + Tags + Reader Modal)          │  │  │
│  │  │  - Contact / Work with Me (Sprint Intake + PGP)                 │  │  │
│  │  │  - Dedicated /now Page (Deep-linked view)                       │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                       │  │
│  │  ┌────────────────────── Overlays & Modals ────────────────────────┐  │  │
│  │  │  - In-Browser Authoring Studio (Visual Markdown Editor)         │  │  │
│  │  │  - Document Share & Export Modal                                │  │  │
│  │  │  - Command Palette (Cmd+K / Touch quick-launcher)               │  │  │
│  │  │  - RSS 2.0 Feed Utility (/rss.xml)                              │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                       │  │
│  │  ┌────────────────────── State & Storage ──────────────────────────┐  │  │
│  │  │  - Document Store (Default essays + Custom user published posts) │  │  │
│  │  │  - LocalStorage Engine (Auto-save drafts, bookmarks, messages)  │  │  │
│  │  │  - Dynamic RSS Generator (Reflects newly published articles)    │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Strategy

```typescript
// Extended Document & Article Model
export interface PublishedDocument {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string[]; // Formatted paragraphs & code blocks
  isResearchPaper?: boolean;
  paperMetrics?: {
    benchmark: string;
    targetLatency: string;
    industryGap: string;
  };
  downloadableFormats: {
    markdown: boolean;
    pdfReady: boolean;
  };
}
```

### Component & State Mutation Matrix
- **Authoring Studio**:
  - `onSaveDraft`: Writes current editor buffer to `abpeace_draft` in `localStorage`.
  - `onPublish`: Validates title, excerpt, and content; prepends new post to `publishedArticles`; updates dynamic RSS feed; fires completion toast.
  - `onFileUpload`: Parses `.md` or `.txt` file into title and paragraphs; populates editor buffer in one click.
  - `onExportBackup` / `onImportBackup`: Facilitates multi-device transfer via `.json` file.
- **Living Research Library**:
  - Filter by research category (Architecture, Latency, HCI, Systems).
  - One-click copy shareable link (`window.location.origin + #doc-id`).
  - One-click **Download Markdown** (`Blob` export).
  - One-click **Print / Save as PDF** formatted view.
- **Mobile Navigation**:
  - Compact header on mobile with hamburger/drawer toggle and sticky bottom quick bar (`Now`, `Blog`, `Research`, `Studio`, `Contact`).

---

## 5. Verification & Test Plan

1. **Publishing Workflow Verification**:
   - Open In-Browser Studio via navbar or `Cmd+E`.
   - Compose a new test article using the formatting toolbar.
   - Test `.md` file drag-and-drop or upload.
   - Click "Publish Article"; verify it appears instantly at the top of the blog and research list.
   - Verify published article is included in the RSS feed modal and reader view.
2. **Cross-Device & Mobile Responsiveness**:
   - Test viewport scaling across 375px (iPhone SE), 768px (iPad), and 1440px desktop.
   - Confirm touch targets meet or exceed 44px; verify bottom dock usability on mobile.
   - Verify ambient canvas automatically scales down frame intervals on small screens to prevent battery drain.
3. **Living Research Hub & Sharing**:
   - Open a research whitepaper; verify key gap metrics and parameters.
   - Test "Copy Shareable Link", "Download Markdown", and "Print/Save PDF".
4. **Code Quality**:
   - Run `compile_applet` and `lint_applet` (`tsc --noEmit`) to verify 100% type safety.
