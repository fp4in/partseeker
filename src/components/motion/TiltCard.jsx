import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * TiltCard — 3D-наклон карточки вслед за курсором (Framer Motion).
 * Только transform/opacity → держит 60 fps. При prefers-reduced-motion
 * наклон отключается, остаётся обычное поведение.
 *
 * props:
 *  - max:    максимальный угол наклона в градусах (по умолчанию 12)
 *  - glare:  показывать световой блик (по умолчанию true)
 *  - lift:   подъём по оси Z при наведении (px), создаёт «всплывание»
 */
export default function TiltCard({
  children,
  className = '',
  style,
  onClick,
  max = 12,
  glare = true,
  lift = 14,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  // На тач-экранах (телефон/планшет) наклон «вслед за мышью» не нужен и
  // мешает скроллу — отключаем, оставляя обычную карточку.
  const coarse = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches;
  const noTilt = reduced || coarse;

  // нормализованная позиция курсора внутри карточки: -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hovered = useMotionValue(0);

  const springCfg = { stiffness: 220, damping: 22, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), springCfg);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), springCfg);
  const z = useSpring(useTransform(hovered, [0, 1], [0, lift]), springCfg);

  // позиция блика
  const glareX = useTransform(px, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(py, [-0.5, 0.5], ['0%', '100%']);
  const glareOpacity = useSpring(useTransform(hovered, [0, 1], [0, 0.22]), springCfg);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.9), transparent 55%)`
  );

  const handleMove = (e) => {
    if (noTilt) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const handleEnter = () => { if (!noTilt) hovered.set(1); };
  const handleLeave = () => {
    hovered.set(0);
    px.set(0);
    py.set(0);
  };

  if (noTilt) {
    // без наклона — но сохраняем класс и клик
    return (
      <div ref={ref} className={className} style={style} onClick={onClick} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      style={{
        ...style,
        rotateX,
        rotateY,
        z,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
        willChange: 'transform',
      }}
      {...rest}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          className="tilt-glare"
          style={{ opacity: glareOpacity, background: glareBg }}
        />
      )}
    </motion.div>
  );
}
