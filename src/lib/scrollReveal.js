import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal — анимирует появление элементов при прокрутке (GSAP ScrollTrigger).
 *
 * Любой элемент с атрибутом data-reveal внутри scopeRef плавно появляется
 * (fade + сдвиг вверх) при входе в область видимости. Поддерживает группировку
 * и стаггер через ScrollTrigger.batch — это эффективнее отдельных триггеров.
 *
 * Варианты data-reveal: "up" (по умолчанию) | "left" | "right" | "scale" | "fade".
 * data-reveal-delay — задержка отдельного элемента (сек).
 *
 * @param {React.RefObject} scopeRef — контейнер
 * @param {Array} deps — зависимости перезапуска (напр. смена вида/языка)
 */
export function useScrollReveal(scopeRef, deps = []) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = el.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduced) {
      gsap.set(items, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'transform' });
      return;
    }

    const fromVars = (node) => {
      const kind = node.getAttribute('data-reveal') || 'up';
      switch (kind) {
        case 'left':  return { opacity: 0, x: -42 };
        case 'right': return { opacity: 0, x: 42 };
        case 'scale': return { opacity: 0, scale: 0.9 };
        case 'fade':  return { opacity: 0 };
        case 'up':
        default:      return { opacity: 0, y: 36 };
      }
    };

    let safety = 0;
    const ctx = gsap.context(() => {
      // начальное скрытое состояние сразу (без вспышки контента)
      items.forEach((node) => gsap.set(node, fromVars(node)));

      const reveal = (batch) => gsap.to(batch, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.08,
        delay: (i, t) => parseFloat(t.getAttribute('data-reveal-delay')) || 0,
        overwrite: true,
      });

      // группируем по контейнерам, чтобы соседние карточки выходили каскадом
      ScrollTrigger.batch(items, { start: 'top 88%', once: true, onEnter: reveal });

      ScrollTrigger.refresh();

      // Страховка для мобильного WebView: внутри анимируемого контейнера
      // ScrollTrigger иногда меряет позиции неверно и контент остаётся
      // невидимым. Через момент принудительно показываем всё, что в зоне
      // видимости и ещё скрыто — лучше показать, чем «сломанная» страница.
      safety = window.setTimeout(() => {
        const stuck = [];
        items.forEach((node) => {
          if (parseFloat(getComputedStyle(node).opacity) < 0.05) {
            const r = node.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) stuck.push(node);
          }
        });
        if (stuck.length) reveal(stuck);
        ScrollTrigger.refresh();
      }, 700);
    }, scopeRef);

    return () => { clearTimeout(safety); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Параллакс: лёгкое смещение элемента при прокрутке.
 * @param {React.RefObject} ref — целевой элемент
 * @param {number} amount — амплитуда смещения (px), отрицательное = вверх
 */
export function useParallax(ref, amount = -60) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: amount,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, [ref, amount]);
}
