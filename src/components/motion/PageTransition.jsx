import { motion, useReducedMotion } from 'framer-motion';

// Десктоп: лёгкий сдвиг + прозрачность. БЕЗ анимации filter:blur —
// на Android WebView анимация blur создаёт отдельный композиторный слой,
// который не очищается, и старый экран «призраком» накладывается на новый.
const fullVariants = {
  initial: { opacity: 0, y: 18 },
  enter:   { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
};

// Тач/слабые экраны и reduced-motion: только прозрачность, без transform —
// исключает любое наложение экранов при смене вида.
const lightVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1 },
  exit:    { opacity: 0 },
};

/**
 * PageTransition — обёртка для плавной смены экранов внутри AnimatePresence.
 * Используйте с уникальным key (например, id текущего вида).
 */
export default function PageTransition({ children, ...rest }) {
  const reduced = useReducedMotion();
  const coarse = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches;
  const light = reduced || coarse;

  return (
    <motion.div
      variants={light ? lightVariants : fullVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={{ duration: light ? 0.25 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'opacity' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
