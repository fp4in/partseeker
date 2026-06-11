import { useRef, useEffect } from 'react';

/**
 * ParticleField — лёгкий canvas-фон из частиц для hero-секции.
 * Реагирует на движение мыши (частицы расталкиваются курсором),
 * рисует связи между близкими точками. Оптимизирован под 60 fps:
 *  - один requestAnimationFrame-цикл, без shadowBlur;
 *  - devicePixelRatio ограничен 1.5;
 *  - пауза при уходе со вкладки и вне области видимости (IntersectionObserver);
 *  - уважает prefers-reduced-motion (рисует один статичный кадр).
 */
export default function ParticleField({
  density = 0.00009,   // частиц на пиксель площади
  maxParticles = 90,
  linkDist = 130,      // дистанция связи (px)
  color = '20, 230, 220',     // accent (cyan) rgb
  colorAlt = '150, 120, 255', // primary (violet) rgb
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, dpr = 1;
    let particles = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999, active: false };

    const rand = (a, b) => a + Math.random() * (b - a);

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(maxParticles, Math.round(w * h * density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-0.25, 0.25),
        vy: rand(-0.25, 0.25),
        r: rand(1, 2.6),
        alt: Math.random() > 0.6,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // отталкивание от курсора
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120 && d2 > 0.01) {
            const f = (120 - Math.sqrt(d2)) / 120;
            const inv = 1 / Math.sqrt(d2);
            p.vx += dx * inv * f * 0.6;
            p.vy += dy * inv * f * 0.6;
          }
        }

        // мягкое трение + ограничение скорости
        p.vx *= 0.985; p.vy *= 0.985;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 1.6) { p.vx = (p.vx / sp) * 1.6; p.vy = (p.vy / sp) * 1.6; }
        if (sp < 0.05) { p.vx += rand(-0.1, 0.1); p.vy += rand(-0.1, 0.1); }

        // тор-обёртка по краям
        if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;

        const c = p.alt ? colorAlt : color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c}, 0.85)`;
        ctx.fill();
      }

      // связи между близкими частицами
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (running) raf = requestAnimationFrame(step);
    };

    const drawStatic = () => {
      // для prefers-reduced-motion: один кадр без анимации
      step();
      cancelAnimationFrame(raf);
    };

    build();
    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(step);
    }

    // --- события ---
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; mouse.x = -9999; mouse.y = -9999; };

    const parent = canvas.parentElement;
    parent.addEventListener('pointermove', onMove);
    parent.addEventListener('pointerleave', onLeave);

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { build(); if (reduced) drawStatic(); }, 150);
    };
    window.addEventListener('resize', onResize);

    const onVisibility = () => {
      if (document.hidden) {
        running = false; cancelAnimationFrame(raf);
      } else if (!reduced && !running) {
        running = true; raf = requestAnimationFrame(step);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // пауза вне видимости
    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting) {
          if (!running) { running = true; raf = requestAnimationFrame(step); }
        } else {
          running = false; cancelAnimationFrame(raf);
        }
      }, { threshold: 0 });
      io.observe(canvas);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (io) io.disconnect();
    };
  }, [density, maxParticles, linkDist, color, colorAlt]);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}
