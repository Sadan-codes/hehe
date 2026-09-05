import React, { useEffect, useRef } from 'react';
import { WeatherCondition, AtmosphereIntensity } from '../utils/weather';

interface AtmosphericOverlayProps {
  condition: WeatherCondition;
  intensity: AtmosphereIntensity;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  phase: number;
  color?: string;
  length?: number; // for rain streaks
  layer?: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const AtmosphericOverlay: React.FC<AtmosphericOverlayProps> = ({
  condition,
  intensity,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (intensity === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Multiplier for intensity
    const intensityFactor =
      intensity === 'subtle' ? 0.65 : intensity === 'gentle' ? 1.0 : 1.35;

    // --- Particle State ---
    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    let tick = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 1. Setup based on condition
    if (condition === 'sunlight') {
      const moteCount = Math.floor(
        Math.min(Math.max((width * height) / 30000, 20), 45) * intensityFactor
      );
      for (let i = 0; i < moteCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.4) * 0.35,
          vy: -Math.random() * 0.3 - 0.1, // gently rising like warm sun dust
          size: Math.random() * 2.2 + 1,
          alpha: Math.random() * 0.4 + 0.1,
          maxAlpha: Math.random() * 0.45 + 0.25,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (condition === 'rain') {
      const dropCount = Math.floor(
        Math.min(Math.max((width * height) / 22000, 28), 65) * intensityFactor
      );
      for (let i = 0; i < dropCount; i++) {
        particles.push({
          x: Math.random() * (width + 100) - 50,
          y: Math.random() * height,
          vx: 1.2, // slight wind drift right
          vy: Math.random() * 5 + 8, // gentle rain fall speed
          size: Math.random() * 0.8 + 0.7,
          length: Math.random() * 12 + 14,
          alpha: Math.random() * 0.25 + 0.15,
          maxAlpha: 0.35,
          phase: 0,
        });
      }
    } else if (condition === 'golden_hour') {
      const orbCount = Math.floor(
        Math.min(Math.max((width * height) / 45000, 12), 26) * intensityFactor
      );
      for (let i = 0; i < orbCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 32 + 14, // large soft golden bokeh orbs
          alpha: Math.random() * 0.12 + 0.04,
          maxAlpha: Math.random() * 0.14 + 0.05,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (condition === 'cloudy') {
      const cloudCount = Math.floor(7 * intensityFactor);
      for (let i = 0; i < cloudCount; i++) {
        particles.push({
          x: (i / cloudCount) * width + Math.random() * 100,
          y: (height * 0.3) + Math.random() * (height * 0.6),
          vx: Math.random() * 0.25 + 0.15,
          vy: (Math.random() - 0.5) * 0.05,
          size: Math.random() * 140 + 120, // large hazy mist puffs
          alpha: Math.random() * 0.08 + 0.04,
          maxAlpha: 0.09,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (condition === 'night_stars') {
      const starCount = Math.floor(
        Math.min(Math.max((width * height) / 28000, 25), 50) * intensityFactor
      );
      for (let i = 0; i < starCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          size: Math.random() * 1.8 + 0.8,
          alpha: Math.random() * 0.4 + 0.1,
          maxAlpha: Math.random() * 0.5 + 0.3,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (condition === 'snow') {
      const flakeCount = Math.floor(
        Math.min(Math.max((width * height) / 26000, 24), 55) * intensityFactor
      );
      for (let i = 0; i < flakeCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: Math.random() * 0.7 + 0.6,
          size: Math.random() * 3 + 1.5,
          alpha: Math.random() * 0.4 + 0.25,
          maxAlpha: 0.6,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Render loop
    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);
        tick += 0.015;

        // -------------------------------------------------------------
        // CONDITION 1: SOFT SUNLIGHT (Sunbeams & Warm Motes)
        // -------------------------------------------------------------
        if (condition === 'sunlight') {
          // Subtle warm corner flare in top-left
          const sunGrad = ctx.createRadialGradient(
            0,
            0,
            10,
            0,
            0,
            Math.max(width, height) * 0.75
          );
          sunGrad.addColorStop(0, `rgba(255, 235, 180, ${0.14 * intensityFactor})`);
          sunGrad.addColorStop(0.35, `rgba(255, 210, 150, ${0.07 * intensityFactor})`);
          sunGrad.addColorStop(0.7, `rgba(255, 192, 203, ${0.03 * intensityFactor})`);
          sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = sunGrad;
          ctx.fillRect(0, 0, width, height);

          // 3 Soft volumetric sunbeam rays gently shifting angle and breathing
          ctx.save();
          const beamBreathing = Math.sin(tick * 0.4) * 0.02;
          const beamOffsets = [
            { angle: 0.58 + beamBreathing, widthRatio: 0.16, alpha: 0.045 },
            { angle: 0.72 - beamBreathing * 0.8, widthRatio: 0.22, alpha: 0.055 },
            { angle: 0.88 + beamBreathing * 0.5, widthRatio: 0.18, alpha: 0.038 },
          ];

          for (const beam of beamOffsets) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            const beamEndX = Math.cos(beam.angle) * (width + height);
            const beamEndY = Math.sin(beam.angle) * (width + height);
            const spread = (width + height) * beam.widthRatio;

            ctx.lineTo(beamEndX - spread * 0.5, beamEndY);
            ctx.lineTo(beamEndX + spread * 0.5, beamEndY);
            ctx.closePath();

            const beamGrad = ctx.createLinearGradient(0, 0, beamEndX, beamEndY);
            beamGrad.addColorStop(0, `rgba(255, 245, 200, ${beam.alpha * intensityFactor * 1.3})`);
            beamGrad.addColorStop(0.6, `rgba(255, 225, 170, ${beam.alpha * intensityFactor * 0.7})`);
            beamGrad.addColorStop(1, 'rgba(255, 225, 170, 0)');
            ctx.fillStyle = beamGrad;
            ctx.fill();
          }
          ctx.restore();

          // Floating golden dust motes in the sunbeams
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.phase += 0.015;
            p.x += p.vx + Math.sin(p.phase) * 0.3;
            p.y += p.vy;

            // wrap around
            if (p.y < -10) {
              p.y = height + 10;
              p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            const currentAlpha =
              (p.alpha + Math.sin(p.phase) * 0.15) * intensityFactor;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 220, 130, ${Math.max(0, Math.min(1, currentAlpha))})`;
            ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // -------------------------------------------------------------
        // CONDITION 2: LIGHT RAIN & DRIZZLE (Droplets & Ground Ripples)
        // -------------------------------------------------------------
        else if (condition === 'rain') {
          // Soft ambient mist vignette near the bottom
          const mistGrad = ctx.createLinearGradient(0, height * 0.8, 0, height);
          mistGrad.addColorStop(0, 'rgba(235, 243, 255, 0)');
          mistGrad.addColorStop(1, `rgba(225, 238, 250, ${0.12 * intensityFactor})`);
          ctx.fillStyle = mistGrad;
          ctx.fillRect(0, height * 0.8, width, height * 0.2);

          // Slanted rain streaks
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(200, 225, 245, ${0.45 * intensityFactor})`;

          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            const len = p.length || 16;
            ctx.lineTo(p.x - p.vx * (len / p.vy), p.y - len);
            ctx.stroke();

            // When hitting bottom or random ground height, spawn ripple
            if (p.y > height - 10) {
              if (Math.random() < 0.4 && ripples.length < 18) {
                ripples.push({
                  x: p.x,
                  y: height - Math.random() * 25,
                  radius: 1,
                  maxRadius: Math.random() * 9 + 5,
                  alpha: 0.35 * intensityFactor,
                });
              }
              p.y = -20;
              p.x = Math.random() * (width + 80) - 40;
            }
          }

          // Render expanding ripples
          for (let r = ripples.length - 1; r >= 0; r--) {
            const rip = ripples[r];
            rip.radius += 0.45;
            rip.alpha *= 0.94;

            ctx.save();
            ctx.beginPath();
            // Elliptical perspective on ground
            ctx.ellipse(rip.x, rip.y, rip.radius * 2, rip.radius * 0.7, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(215, 235, 255, ${rip.alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
            ctx.restore();

            if (rip.alpha < 0.02 || rip.radius >= rip.maxRadius) {
              ripples.splice(r, 1);
            }
          }
        }

        // -------------------------------------------------------------
        // CONDITION 3: GOLDEN HOUR SUNSET (Peach & Rose Glow)
        // -------------------------------------------------------------
        else if (condition === 'golden_hour') {
          // Warm sunset atmosphere wash
          const sunsetGrad = ctx.createRadialGradient(
            width * 0.5,
            height * 0.95,
            50,
            width * 0.5,
            height * 0.5,
            Math.max(width, height) * 0.9
          );
          sunsetGrad.addColorStop(0, `rgba(255, 175, 120, ${0.16 * intensityFactor})`);
          sunsetGrad.addColorStop(0.4, `rgba(255, 140, 150, ${0.08 * intensityFactor})`);
          sunsetGrad.addColorStop(0.8, `rgba(240, 160, 200, ${0.04 * intensityFactor})`);
          sunsetGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = sunsetGrad;
          ctx.fillRect(0, 0, width, height);

          // Warm drifting bokeh discs
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.phase += 0.012;
            p.x += p.vx + Math.sin(p.phase) * 0.25;
            p.y += p.vy + Math.cos(p.phase) * 0.2;

            if (p.x < -p.size) p.x = width + p.size;
            if (p.x > width + p.size) p.x = -p.size;
            if (p.y < -p.size) p.y = height + p.size;
            if (p.y > height + p.size) p.y = -p.size;

            const alpha =
              (p.alpha + Math.sin(p.phase) * 0.03) * intensityFactor;

            const orbGrad = ctx.createRadialGradient(
              p.x,
              p.y,
              0,
              p.x,
              p.y,
              p.size
            );
            orbGrad.addColorStop(0, `rgba(255, 210, 160, ${alpha * 1.5})`);
            orbGrad.addColorStop(0.6, `rgba(255, 160, 140, ${alpha * 0.8})`);
            orbGrad.addColorStop(1, 'rgba(255, 160, 140, 0)');

            ctx.fillStyle = orbGrad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // -------------------------------------------------------------
        // CONDITION 4: MISTY BREEZE / CLOUDY (Hazy Atmospheric Clouds)
        // -------------------------------------------------------------
        else if (condition === 'cloudy') {
          // Soft ambient mist layer
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.phase += 0.008;
            p.y += Math.sin(p.phase) * 0.15;

            if (p.x - p.size > width) {
              p.x = -p.size;
              p.y = (height * 0.25) + Math.random() * (height * 0.65);
            }

            const cloudGrad = ctx.createRadialGradient(
              p.x,
              p.y,
              p.size * 0.1,
              p.x,
              p.y,
              p.size
            );
            cloudGrad.addColorStop(0, `rgba(240, 235, 245, ${p.alpha * intensityFactor * 1.2})`);
            cloudGrad.addColorStop(0.7, `rgba(245, 240, 250, ${p.alpha * intensityFactor * 0.5})`);
            cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = cloudGrad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // -------------------------------------------------------------
        // CONDITION 5: ROMANTIC STARLIGHT (Night Sky Tint & Star Dust)
        // -------------------------------------------------------------
        else if (condition === 'night_stars') {
          // Subtle soft twilight vignette
          const nightGrad = ctx.createRadialGradient(
            width * 0.5,
            height * 0.4,
            width * 0.2,
            width * 0.5,
            height * 0.5,
            Math.max(width, height) * 0.8
          );
          nightGrad.addColorStop(0, `rgba(50, 20, 60, ${0.05 * intensityFactor})`);
          nightGrad.addColorStop(1, `rgba(25, 10, 45, ${0.14 * intensityFactor})`);
          ctx.fillStyle = nightGrad;
          ctx.fillRect(0, 0, width, height);

          // Twinkling stardust motes
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.phase += 0.02;
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            const twinkle = (Math.sin(p.phase) * 0.5 + 0.5) * p.maxAlpha * intensityFactor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 235, 250, ${twinkle})`;
            ctx.shadowColor = 'rgba(255, 192, 230, 0.6)';
            ctx.shadowBlur = 3;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // -------------------------------------------------------------
        // CONDITION 6: WINTER ROMANCE / GENTLE SNOW
        // -------------------------------------------------------------
        else if (condition === 'snow') {
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.phase += 0.015;
            p.x += p.vx + Math.sin(p.phase) * 0.45;
            p.y += p.vy;

            if (p.y > height + 10) {
              p.y = -10;
              p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            const alpha = (p.alpha + Math.sin(p.phase) * 0.1) * intensityFactor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 245, 250, ${Math.max(0, Math.min(1, alpha))})`;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
            ctx.shadowBlur = 3;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [condition, intensity]);

  if (intensity === 'off') {
    return null;
  }

  return (
    <canvas
      id="atmospheric-overlay-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-15 w-full h-full"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
};
