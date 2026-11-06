import { useState } from 'react';
import { sound } from '../utils/audio';
import { ContactSubmission } from '../types';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [engagementType, setEngagementType] = useState('Prototype Sprint (1-2 Weeks)');
  const [timeline, setTimeline] = useState('Next 2-4 weeks');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showGpgModal, setShowGpgModal] = useState(false);

  const contactEmail = 'bempeace66@gmail.com';

  const engagementModels = [
    {
      title: 'Tactile Prototype Sprints',
      duration: '1–2 Weeks',
      description:
        'Turning ambitious product visions into deployed, sub-16ms interactive prototypes. Ideal for validating core interaction loops or testing technical feasibility.',
    },
    {
      title: 'Architecture & Latency Advisory',
      duration: 'Audit & Roadmaps',
      description:
        'Diagnosing inference bottlenecks, curing context poisoning, pruning AST bloat, and re-architecting systems for deterministic low latency.',
    },
    {
      title: 'Bespoke Shaders & WASM Systems',
      duration: 'Custom Deliverables',
      description:
        'Engineering high-performance WebGPU compute pipelines, zero-allocation Rust/Zig daemons, or offline-first P2P data synchronization.',
    },
    {
      title: 'Fractional Systems Engineer',
      duration: 'Ongoing / Advisory',
      description:
        'High-bandwidth, async-first collaboration with high-conviction teams building unconventional developer tools or spatial software.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    if (!name.trim()) {
      setErrorMessage('Please provide your name or organization.');
      setStatus('error');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      setStatus('error');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Please share a brief project summary (minimum 10 characters).');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Simulate sending and save locally
    setTimeout(() => {
      const submission: ContactSubmission = {
        id: 'msg_' + Date.now(),
        name,
        email,
        topic: `${engagementType} [${timeline}]`,
        message,
        timestamp: new Date().toISOString(),
      };

      try {
        const existing = JSON.parse(localStorage.getItem('abpeace_messages') || '[]');
        localStorage.setItem('abpeace_messages', JSON.stringify([submission, ...existing]));
      } catch {
        // storage fail
      }

      setStatus('success');
      sound.playBlip();
      setName('');
      setEmail('');
      setMessage('');
    }, 800);
  };

  const copyDirectEmail = () => {
    sound.playBlip();
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const gpgKeyText = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: AB Peace <bempeace66@gmail.com>

mQGNBGbdUqEBDAC5+2fTzZp8rV1E02LzV7A9kKk9nI8x...
[AB Peace / Agnostic Systems & Creative Hacker <bempeace66@gmail.com>]
Key ID: 0x9F4C2A18D0E3B6A7
Fingerprint: 4E91 228C 88FD 9A20 3B4E 1092 9F4C 2A18 D0E3 B6A7
-----END PGP PUBLIC KEY BLOCK-----`;

  return (
    <section id="contact" className="py-24 scroll-mt-16 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block">
              Collaboration &amp; Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              Contact / Work with Me
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="text-zinc-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Available for Q4 2026 / Q1 2027</span>
            </span>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <span>Async-first · High bandwidth</span>
          </div>
        </div>

        {/* Engagement Models Strip */}
        <div className="mb-16">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
            Engagement Formats
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementModels.map((model) => (
              <div
                key={model.title}
                className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-zinc-400 mb-2">{model.duration}</div>
                  <h3 className="text-sm font-semibold text-white mb-2">{model.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{model.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct channels & philosophy */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">
                Let&apos;s build something tactile.
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                I partner with founders, engineering leads, and research labs that care deeply about
                software performance, aesthetic clarity, and novel computational paradigms. If you
                are building beyond generic templates, reach out.
              </p>

              <div className="space-y-4 text-xs font-mono">
                {/* Email item */}
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-zinc-500 mb-1">Direct Inbound Email</div>
                    <div className="text-zinc-200 truncate">{contactEmail}</div>
                  </div>
                  <button
                    type="button"
                    onClick={copyDirectEmail}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors shrink-0 ml-3"
                  >
                    {copiedEmail ? 'Copied' : 'Copy'}
                  </button>
                </div>

                {/* Social links */}
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
                  <div className="text-zinc-500">Networks &amp; Code</div>
                  <div className="flex flex-col gap-2 text-zinc-300">
                    <a
                      href="https://github.com/vadirn"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span>github.com/vadirn</span>
                      <span className="text-zinc-600">↗</span>
                    </a>
                    <a
                      href="https://x.com/vadirn"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span>x.com/vadirn</span>
                      <span className="text-zinc-600">↗</span>
                    </a>
                  </div>
                </div>

                {/* PGP Key Option */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowGpgModal(true);
                  }}
                  className="w-full text-left p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/20 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors flex items-center justify-between text-xs"
                >
                  <span>Verify PGP Public Key</span>
                  <span className="text-zinc-500">0x9F4C...</span>
                </button>
              </div>
            </div>

            <div className="pt-8 text-xs text-zinc-400 font-mono">
              Typical reply latency: &lt; 24 hours
            </div>
          </div>

          {/* Right Column: Interactive Work with Me Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Your Name or Organization *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ada Lovelace / Lab Inc."
                      className="w-full px-4 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ada@engine.io"
                      className="w-full px-4 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Format of Engagement
                    </label>
                    <select
                      value={engagementType}
                      onChange={(e) => setEngagementType(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
                    >
                      <option value="Prototype Sprint (1-2 Weeks)">Prototype Sprint (1–2 Weeks)</option>
                      <option value="Architecture & Latency Advisory">Architecture &amp; Latency Advisory</option>
                      <option value="Bespoke Shaders & WASM Systems">Bespoke Shaders &amp; WASM Systems</option>
                      <option value="Fractional Systems Engineer">Fractional Systems Engineer</option>
                      <option value="General Conversation / Coffee">General Conversation / Coffee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Target Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
                    >
                      <option value="Next 2-4 weeks">Next 2–4 weeks (Immediate)</option>
                      <option value="Within 2 months">Within 2 months</option>
                      <option value="Q1 2027 Planning">Q1 2027 Planning</option>
                      <option value="Flexible / Exploratory">Flexible / Exploratory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono text-zinc-400">
                      Project Overview &amp; Goals *
                    </label>
                    <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                      {message.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about what you are building: the core problem, latency constraints, architectural boundaries, or the specific artifact you need delivered..."
                    className="w-full px-4 py-3 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                  />
                </div>

                {/* Error Banner */}
                {status === 'error' && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-300 font-mono">
                    {errorMessage}
                  </div>
                )}

                {/* Success Banner */}
                {status === 'success' && (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-mono space-y-1">
                    <div className="font-semibold text-white">Project inquiry received.</div>
                    <div className="text-zinc-400">
                      Transmission dispatched to AB Peace&apos;s priority queue. I will reply within 24 hours.
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Zero spam · Strict confidentiality
                  </span>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="px-5 py-2.5 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {status === 'submitting' ? 'Submitting inquiry...' : 'Send Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* PGP Public Key Modal */}
        {showGpgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-zinc-200">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
                <h3 className="text-base font-mono font-semibold text-white">
                  PGP Public Key Block · AB Peace
                </h3>
                <button
                  type="button"
                  onClick={() => setShowGpgModal(false)}
                  className="w-7 h-7 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900"
                >
                  ✕
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                <code>{gpgKeyText}</code>
              </pre>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800 text-xs font-mono">
                <span className="text-zinc-500">Fingerprint verified</span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playBlip();
                    navigator.clipboard.writeText(gpgKeyText);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                >
                  Copy Key Block
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
