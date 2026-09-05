import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  initialSize: number;
  color: string;
  alpha: number;
  life: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobbleOffset: number;
  isSparkle: boolean;
}

export const HeartCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Pre-compiled Heart Path (Centered: width ~24, height ~24)
  const heartPathRef = useRef<Path2D | null>(null);

  useEffect(() => {
    // Create standard heart Path2D
    heartPathRef.current = new Path2D(
      'M 0 -4 C -2.5 -11 -11 -9 -11 -2 C -11 5 -2 10 0 14 C 2 10 11 5 11 -2 C 11 -9 2.5 -11 0 -4 Z'
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = [
      '#ff2a6d',
      '#ff4d6d',
      '#ff758f',
      '#fb7185',
      '#f43f5e',
      '#f472b6',
      '#fda4af',
      '#ffd166', // warm starry gold accent
    ];

    const spawnParticle = (x: number, y: number, burst: boolean = false) => {
      const isSparkle = !burst && Math.random() < 0.25;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const initialSize = burst
        ? 8 + Math.random() * 8
        : isSparkle
        ? 4 + Math.random() * 4
        : 9 + Math.random() * 7;

      const angle = burst ? Math.random() * Math.PI * 2 : (Math.random() - 0.5) * 1.5;
      const speed = burst ? 1.5 + Math.random() * 3.5 : 0.4 + Math.random() * 0.9;

      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: burst ? Math.cos(angle) * speed : Math.sin(angle) * speed * 0.7,
        vy: burst ? Math.sin(angle) * speed : -0.8 - Math.random() * 1.2, // Float upwards
        size: initialSize,
        initialSize,
        color,
        alpha: 1.0,
        life: 1.0,
        decay: burst ? 0.02 + Math.random() * 0.02 : 0.015 + Math.random() * 0.018,
        rotation: (Math.random() - 0.5) * 0.6,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        wobbleSpeed: 2 + Math.random() * 3,
        wobbleAmp: 0.6 + Math.random() * 1.2,
        wobbleOffset: Math.random() * Math.PI * 2,
        isSparkle,
      });

      // Cap maximum active particles to prevent performance hit
      if (particlesRef.current.length > 120) {
        particlesRef.current.shift();
      }
    };

    // Pointer move listener (handles both desktop mouse and touch)
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const now = performance.now();
      const last = lastPosRef.current;

      if (!last) {
        lastPosRef.current = { x: clientX, y: clientY };
        lastTimeRef.current = now;
        spawnParticle(clientX, clientY);
        return;
      }

      const dist = Math.hypot(clientX - last.x, clientY - last.y);

      // Spawn heart every ~12 pixels of movement or at least every 40ms
      if (dist > 12 || now - lastTimeRef.current > 40) {
        spawnParticle(clientX, clientY);

        // If mouse moved fast, interpolate intermediate hearts for continuous trail
        if (dist > 35) {
          const midX = (clientX + last.x) / 2;
          const midY = (clientY + last.y) / 2;
          spawnParticle(midX, midY);
        }

        lastPosRef.current = { x: clientX, y: clientY };
        lastTimeRef.current = now;
      }
    };

    // Click / Tap listener: mini heart burst
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Burst 6-8 hearts outwards
      const burstCount = 7;
      for (let i = 0; i < burstCount; i++) {
        spawnParticle(clientX, clientY, true);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    // Render loop
    let lastRenderTime = performance.now();

    const render = (time: number) => {
      animFrameRef.current = requestAnimationFrame(render);
      const delta = Math.min((time - lastRenderTime) / 1000, 0.1);
      lastRenderTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const heartPath = heartPathRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Float up with horizontal sinusoidal gentle sway
        p.x += p.vx + Math.sin(time * 0.003 * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmp;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha = Math.max(0, p.life);
        p.size = p.initialSize * (0.3 + p.life * 0.7);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.isSparkle) {
          // Draw 4-point sparkle star
          const s = p.size * 0.8;
          ctx.beginPath();
          for (let j = 0; j < 4; j++) {
            ctx.rotate(Math.PI / 2);
            ctx.lineTo(s, 0);
            ctx.lineTo(s * 0.2, s * 0.2);
          }
          ctx.closePath();
          ctx.fill();
        } else if (heartPath) {
          // Scale heart path smoothly
          const scale = p.size / 22;
          ctx.scale(scale, scale);
          ctx.fill(heartPath);
        }

        ctx.restore();
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      id="heart-cursor-trail-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999]"
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};
