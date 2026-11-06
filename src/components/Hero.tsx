import { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';

interface HeroProps {
  onNavigateToNow?: () => void;
}

export function Hero({ onNavigateToNow }: HeroProps) {
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.6);
  const [activePreset, setActivePreset] = useState<'wave' | 'particles'>('wave');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Measure actual browser frame latency
  useEffect(() => {
    let frameId: number;
    let frames = 0;
    let lastTime = performance.now();
    let prevFrameTime = performance.now();

    const loop = (now: number) => {
      const delta = now - prevFrameTime;
      prevFrameTime = now;
      frames++;

      if (now - lastTime >= 1000) {
        setFps(Math.round((frames * 1000) / (now - lastTime)));
        setFrameTime(Math.round(delta * 10) / 10);
        frames = 0;
        lastTime = now;
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Mini interactive canvas in hero card
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const width = (canvas.width = 460);
    const height = (canvas.height = 320);

    const draw = () => {
      t += 0.02;
      ctx.fillStyle = 'rgba(9, 9, 11, 0.2)';
      ctx.fillRect(0, 0, width, height);

      if (activePreset === 'wave') {
        // Draw parametric waveforms
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.strokeStyle = j === 0 ? 'rgba(56, 189, 248, 0.65)' : j === 1 ? 'rgba(168, 85, 247, 0.45)' : 'rgba(244, 244, 245, 0.2)';
          ctx.lineWidth = 1.5;

          for (let x = 0; x < width; x += 4) {
            const freq = 0.015 + j * 0.005;
            const y = height / 2 + Math.sin(x * freq + t + j) * 45 * Math.cos(t * 0.5 + j * 0.4);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else {
        // Draw matrix field dots
        const cols = 20;
        const rows = 14;
        const colGap = width / (cols + 1);
        const rowGap = height / (rows + 1);

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const px = (i + 1) * colGap;
            const py = (j + 1) * rowGap;
            const dist = Math.sin(i * 0.3 + t) * Math.cos(j * 0.3 + t * 0.7);
            const radius = Math.max(0.8, Math.abs(dist) * 2.5);

            ctx.fillStyle = dist > 0 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(168, 85, 247, 0.4)';
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [activePreset]);

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-zinc-900 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Split Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 block">
              Agnostic Systems &amp; Creative Computing
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-white leading-[1.08] mb-6 [text-wrap:balance]">
              Coding at the speed of thought, guided by pure curiosity.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl">
              I don&apos;t pledge allegiance to frameworks, languages, or paradigms. From sub-5ms
              distributed primitives and WebGPU shaders to autonomous agent loops and tactile browser
              tools—I build whatever expands human computational leverage and aesthetic clarity.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <a
                href="#now"
                onClick={(e) => {
                  sound.playClick();
                  if (onNavigateToNow) {
                    e.preventDefault();
                    onNavigateToNow();
                  }
                }}
                className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                What I&apos;m Doing Now
              </a>
              <a
                href="#blog"
                onClick={() => sound.playClick()}
                className="px-5 py-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors whitespace-nowrap"
              >
                Read Technical Essays
              </a>
            </div>
          </div>

          {/* Right Column: High-craft interactive visual card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-sm overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="text-xs font-mono text-zinc-400">vibe_matrix.glsl</span>
                </div>
                {/* Mode toggle */}
                <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-md border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActivePreset('wave');
                    }}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                      activePreset === 'wave'
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Wave
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActivePreset('particles');
                    }}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                      activePreset === 'particles'
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Field
                  </button>
                </div>
              </div>

              {/* Canvas viewport */}
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-[#09090b] border border-zinc-800/60">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover block cursor-crosshair"
                />

                {/* Subdued overlay telemetry tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] font-mono text-zinc-400 bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800/70">
                  <span>Target: &lt;16ms</span>
                  <span className="text-zinc-300 tabular-nums">
                    {frameTime}ms / {fps} FPS
                  </span>
                </div>
              </div>

              {/* Bottom detail */}
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Procedural Harmonics</span>
                <span>Zero External Runtime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width proof / metric row placed strictly below the hero split */}
        <div className="mt-16 pt-10 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight tabular-nums">
              40+
            </div>
            <div className="text-xs text-zinc-400 mt-1">Shipped Systems &amp; Prototypes</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight tabular-nums">
              12
            </div>
            <div className="text-xs text-zinc-400 mt-1">Open Source Repositories</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight tabular-nums">
              &lt; 16ms
            </div>
            <div className="text-xs text-zinc-400 mt-1">Sensory Feedback Target</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight tabular-nums">
              100%
            </div>
            <div className="text-xs text-zinc-400 mt-1">Curiosity-Driven & Agnostic</div>
          </div>
        </div>
      </div>
    </section>
  );
}
