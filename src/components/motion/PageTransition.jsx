import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  enter:   { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -14, filter: 'blur(6px)' },
};

/**
 * PageTransition — обёртка для плавной смены экранов внутри AnimatePresence.
 * Используйте с уникальным key (например, id текущего вида).
 */
export default function PageTransition({ children, ...rest }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity, filter' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
