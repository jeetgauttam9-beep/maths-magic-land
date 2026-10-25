import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  type: 'star' | 'circle' | 'petal' | 'ribbon';
  opacity: number;
}

export const ConfettiCanvas: React.FC<ConfettiProps> = ({ active, duration = 4000 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      '#F59E0B', // Amber gold
      '#F97316', // Orange
      '#EF4444', // Red
      '#3B82F6', // Sky blue
      '#10B981', // Emerald
      '#8B5CF6', // Purple
      '#FDE047', // Light yellow
    ];

    const types: ('star' | 'circle' | 'petal' | 'ribbon')[] = ['star', 'circle', 'petal', 'ribbon'];

    // Spawn 140 particles from top & side bursts
    const particles: Particle[] = Array.from({ length: 140 }).map(() => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 3,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        type: types[Math.floor(Math.random() * types.length)],
        opacity: 1,
      };
    });

    const drawStar = (x: number, y: number, r: number, color: string) => {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = color;
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos(((18 + i * 72) * Math.PI) / 180) * r + x,
          -Math.sin(((18 + i * 72) * Math.PI) / 180) * r + y
        );
        ctx.lineTo(
          Math.cos(((54 + i * 72) * Math.PI) / 180) * (r / 2) + x,
          -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r / 2) + y
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const render = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.vy += 0.05; // gravity

        // Fade out towards end
        if (progress > 0.75) {
          p.opacity = 1 - (progress - 0.75) / 0.25;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'star') {
          drawStar(0, 0, p.size, p.color);
        } else if (p.type === 'petal') {
          // Marigold flower petal
          ctx.beginPath();
          ctx.fillStyle = '#FB923C';
          ctx.ellipse(0, 0, p.size * 0.8, p.size * 1.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'ribbon') {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 2);
        } else {
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
