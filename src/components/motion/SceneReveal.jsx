import { useRef } from 'react';
import { useScrollReveal } from '../../lib/scrollReveal';

/**
 * SceneReveal — оборачивает контент экрана и запускает scroll-reveal
 * (GSAP ScrollTrigger) при его монтировании. Поскольку каждый вид
 * монтируется заново (keyed внутри AnimatePresence), эффект корректно
 * перепривязывается к актуальному DOM.
 */
export default function SceneReveal({ children, className, style }) {
  const ref = useRef(null);
  useScrollReveal(ref, []);
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
