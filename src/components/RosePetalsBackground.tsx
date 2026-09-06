import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  color: string;
  opacity: number;
  swayOffset: number;
  swaySpeed: number;
}

const PETAL_COLORS = [
  '#f43f5e', // rose-500
  '#fb7185', // rose-400
  '#fda4af', // rose-300
  '#ec4899', // pink-500
  '#f472b6', // pink-400
  '#e11d48', // rose-600
];

export const RosePetalsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Minimal, calm petal count: only 3-5 subtle petals so the site is clean and uncluttered
    const petalCount = width < 640 ? 3 : 5;

    const createPetal = (initialYRandom = false): Petal => {
      const size = Math.random() * 6 + 7; // 7px to 13px - smaller, delicate
      return {
        x: Math.random() * width,
        y: initialYRandom ? Math.random() * height : -30 - Math.random() * 50,
        size,
        speedY: Math.random() * 0.35 + 0.25, // Very slow gentle drift
        speedX: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.01 + 0.005,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        opacity: Math.random() * 0.12 + 0.12, // Very soft translucent look
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.01 + 0.005,
      };
    };

    const petals: Petal[] = Array.from({ length: petalCount }, () => createPetal(true));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      // Simulate 3D flutter by scaling Y according to cosine of flip angle
      const flipScale = Math.cos(p.flip);
      ctx.scale(1, Math.abs(flipScale) < 0.1 ? 0.1 : flipScale);

      ctx.beginPath();
      // Draw organic curved rose petal
      const w = p.size;
      const h = p.size * 1.35;

      ctx.moveTo(0, -h * 0.45);
      // Top left curve
      ctx.bezierCurveTo(-w * 0.65, -h * 0.4, -w * 0.8, h * 0.1, 0, h * 0.6);
      // Right curve back to top
      ctx.bezierCurveTo(w * 0.8, h * 0.1, w * 0.65, -h * 0.4, 0, -h * 0.45);

      // Subtle gradient for petal depth
      const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, w);
      grad.addColorStop(0, p.color);
      grad.addColorStop(0.8, p.color);
      grad.addColorStop(1, '#be123c'); // slightly deeper edge

      ctx.fillStyle = grad;
      ctx.globalAlpha = p.opacity;
      ctx.shadowColor = 'rgba(244, 63, 94, 0.25)';
      ctx.shadowBlur = 4;
      ctx.fill();

      // Subtle inner petal contour vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.35);
      ctx.quadraticCurveTo(w * 0.08, 0, 0, h * 0.45);
      ctx.stroke();

      ctx.restore();
    };

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < petals.length; i++) {
          const p = petals[i];

          // Swaying horizontal motion like natural falling petals
          p.swayOffset += p.swaySpeed;
          p.x += Math.sin(p.swayOffset) * 0.85 + p.speedX;
          p.y += p.speedY;

          p.rotation += p.rotationSpeed;
          p.flip += p.flipSpeed;

          // Recycle petal when it drifts off the bottom or sides
          if (p.y > height + 40) {
            petals[i] = createPetal(false);
          }
          if (p.x < -40) {
            p.x = width + 30;
          } else if (p.x > width + 40) {
            p.x = -30;
          }

          drawPetal(p);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      id="rose-petals-background-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ opacity: 0.88 }}
      aria-hidden="true"
    />
  );
};
