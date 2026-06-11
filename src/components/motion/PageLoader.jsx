import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench } from 'lucide-react';

/**
 * PageLoader — вступительная анимация загрузки.
 * Показывается один раз при первом монтировании приложения и плавно
 * исчезает, открывая контент. Брендовая шестерёнка + индикатор прогресса.
 */
export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // ждём готовности шрифтов/первого кадра, минимум — короткая пауза
    const minDelay = new Promise((r) => setTimeout(r, 900));
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    let done = false;
    Promise.all([minDelay, fontsReady]).then(() => {
      if (!done) setVisible(false);
    });
    // страховка — не зависнуть дольше 2.5с
    const hard = setTimeout(() => setVisible(false), 2500);
    return () => { done = true; clearTimeout(hard); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="page-loader-inner"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06, y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="page-loader-icon"
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, ease: 'linear', repeat: Infinity }}
            >
              <Wrench size={42} />
            </motion.div>
            <div className="page-loader-brand">PARTSEEKER</div>
            <div className="page-loader-bar">
              <motion.span
                className="page-loader-bar-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
