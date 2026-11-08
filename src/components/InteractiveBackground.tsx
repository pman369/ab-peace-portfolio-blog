import { useEffect, useRef } from 'react';

interface InteractiveBackgroundProps {
  interactive?: boolean;
}

export function InteractiveBackground({ interactive = true }: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes: lightweight on mobile (max 12) vs desktop (max 30)
    const particleCount = isMobile ? Math.min(12, Math.floor(width / 60)) : Math.min(30, Math.floor(width / 45));
    const particles = Array.from({ length: Math.max(6, particleCount) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.35),
      vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.35),
      radius: Math.random() * 1.4 + 0.7,
      baseAlpha: Math.random() * 0.22 + 0.08,
    }));

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || isMobile) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    let lastTime = performance.now();
    const targetFpsInterval = isMobile ? 1000 / 30 : 1000 / 60; // 30fps on mobile to preserve battery & GPU cycles
    let lastDrawTime = performance.now();

    const render = (currentTime: number) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const elapsed = currentTime - lastDrawTime;
      if (elapsed < targetFpsInterval) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      lastDrawTime = currentTime - (elapsed % targetFpsInterval);
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Draw particles & subtle connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse avoidance/attraction ripple
        if (!isMobile && mouseX > -500) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 0) {
            const force = (1 - dist / 130) * 1.4;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        ctx.fillStyle = `rgba(161, 161, 170, ${p.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby nodes
        const maxDist = isMobile ? 90 : 120;
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < maxDist) {
            const lineAlpha = (1 - cdist / maxDist) * 0.05;
            ctx.strokeStyle = `rgba(161, 161, 170, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
