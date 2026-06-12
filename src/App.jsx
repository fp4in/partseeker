import React, { useContext, useState, useEffect, useRef, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppContext } from './context/AppContext';
import BuyerDashboard from './components/BuyerDashboard';
import PageLoader from './components/motion/PageLoader';

// Тяжёлые кабинеты (тянут xlsx и пр.) грузим лениво — публичная
// страница покупателя остаётся лёгкой и анимации стартуют быстрее.
const PartnerDashboard = lazy(() => import('./components/PartnerDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
import { PartnerLoginModal, AdminLoginModal } from './components/AuthModals';
import { initBackButton, registerBack, syncStatusBar, hideSplash, initKeyboard, watchNetwork, haptic, isNative } from './lib/native';
import { LANGS } from './i18n';
import { getPage } from './lib/pages';
import {
  Wrench, Store, Shield, Sparkles, Sun, Moon, ChevronDown,
  LogIn, LogOut, Globe, X
} from 'lucide-react';

function InfoModal({ pageKey, onClose }) {
  const { lang, t } = useContext(AppContext);
  if (!pageKey) return null;
  const page = getPage(lang, pageKey);
  if (!page) return null;
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content glass-panel" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <h3>{page.title}</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {page.sections.map((s, i) => (
            <div key={i}>
              {s.h && <h4 style={{ marginBottom: '6px', color: 'var(--text-primary)' }}>{s.h}</h4>}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', whiteSpace: 'pre-line', lineHeight: 1.65 }}>{s.text}</p>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginTop: '24px', width: '100%' }} onClick={onClose}>{t('common.close')}</button>
      </div>
    </div>
  );
}

function LanguageSwitch() {
  const { lang, setLang } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const current = LANGS.find(l => l.code === lang) || LANGS[0];
  return (
    <div className="lang-switch" ref={ref}>
      <button className="lang-trigger" onClick={() => setOpen(o => !o)} title="Язык / Language">
        <Globe size={16} /> <span>{current.short}</span> <ChevronDown size={14} />
      </button>
      {open && (
        <div className="lang-menu">
          {LANGS.map(l => (
            <div key={l.code} className={`lang-option ${l.code === lang ? 'active' : ''}`}
              onClick={() => { setLang(l.code); setOpen(false); }}>
              <span style={{ fontSize: '1.1rem' }}>{l.flag}</span> {l.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SiteFooter({ onOpen }) {
  const { t } = useContext(AppContext);
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="brand" style={{ marginBottom: '14px', cursor: 'default' }}>
            <Wrench size={24} className="logo-icon" />
            <span>PARTSEEKER</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px' }}>{t('foot.about')}</p>
        </div>
        <div className="footer-col">
          <h4>{t('foot.buyers')}</h4>
          <span className="footer-link" onClick={() => onOpen('howto')}>{t('foot.l1')}</span>
          <span className="footer-link" onClick={() => onOpen('howto')}>{t('foot.l2')}</span>
          <span className="footer-link" onClick={() => onOpen('howto')}>{t('foot.l3')}</span>
          <span className="footer-link" onClick={() => onOpen('howto')}>{t('foot.l4')}</span>
        </div>
        <div className="footer-col">
          <h4>{t('foot.shops')}</h4>
          <span className="footer-link" onClick={() => onOpen('partner')}>{t('foot.s1')}</span>
          <span className="footer-link" onClick={() => onOpen('partner')}>{t('foot.s2')}</span>
          <span className="footer-link" onClick={() => onOpen('partner')}>{t('foot.s3')}</span>
          <span className="footer-link" onClick={() => onOpen('partner')}>{t('foot.s4')}</span>
        </div>
        <div className="footer-col">
          <h4>{t('foot.contacts')}</h4>
          <a className="footer-link" href="mailto:support@partseeker.tj">support@partseeker.tj</a>
          <a className="footer-link" href="tel:+992446000000">+992 44 600-00-00</a>
          <span className="footer-link" onClick={() => onOpen('contacts')}>Telegram · WhatsApp</span>
        </div>
      </div>
      <div className="footer-bottom">
        <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
          <span className="footer-link" style={{ margin: 0 }} onClick={() => onOpen('about')}>{t('foot.aboutLink')}</span>
          <span className="footer-link" style={{ margin: 0 }} onClick={() => onOpen('privacy')}>{t('foot.privacy')}</span>
          <span className="footer-link" style={{ margin: 0 }} onClick={() => onOpen('terms')}>{t('foot.terms')}</span>
          <span className="footer-link" style={{ margin: 0 }} onClick={() => onOpen('contacts')}>{t('foot.contacts')}</span>
        </div>
        © {new Date().getFullYear()} PARTSEEKER · {t('foot.copy')}
      </div>
    </footer>
  );
}

function App() {
  const { currentRole, theme, toggleTheme, t, partnerAuthed, adminAuthed, logout } = useContext(AppContext);

  const [showPartnerLogin, setShowPartnerLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [infoPage, setInfoPage] = useState(null);
  const [toast, setToast] = useState(null);

  const toastTimer = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  // Hidden admin triggers: #admin hash, Ctrl+Shift+A, 5 quick logo clicks
  const logoClicks = useRef([]);
  const lastBackAtHome = useRef(0);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash.toLowerCase() === '#admin') setShowAdminLogin(true);
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdminLogin(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Native: инициализация аппаратной кнопки «Назад» + скрытие splash
  useEffect(() => {
    let cleanup = () => {};
    initBackButton().then((c) => { cleanup = c; });
    const splashTimer = setTimeout(() => hideSplash(), 400);
    return () => { cleanup(); clearTimeout(splashTimer); };
  }, []);

  // Native: цвет/стиль статус-бара под текущую тему
  useEffect(() => { syncStatusBar(theme); }, [theme]);

  // Native: «Назад» закрывает открытые модалки (высокий приоритет)
  useEffect(() => {
    const unregister = registerBack(() => {
      if (showAdminLogin) { setShowAdminLogin(false); if (window.location.hash) window.location.hash = ''; return true; }
      if (showPartnerLogin) { setShowPartnerLogin(false); return true; }
      if (infoPage) { setInfoPage(null); return true; }
      return false;
    }, 100);
    return unregister;
  }, [showAdminLogin, showPartnerLogin, infoPage]);

  // Native: на главном экране «Назад» — двойное нажатие для выхода (низкий
  // приоритет, срабатывает только если экран/модалки не перехватили).
  useEffect(() => {
    const unregister = registerBack(() => {
      const now = Date.now();
      if (now - lastBackAtHome.current < 2000) return false; // 2-е нажатие → выход
      lastBackAtHome.current = now;
      showToast(t('app.exitHint'));
      haptic('light');
      return true;
    }, -10);
    return unregister;
  }, [t]);

  // Native: клавиатура (класс kb-open на <html> при открытии)
  useEffect(() => {
    let cleanup = () => {};
    initKeyboard().then((c) => { cleanup = c; });
    return () => cleanup();
  }, []);

  // Сеть: показываем тост при потере/восстановлении соединения
  useEffect(() => {
    let first = true;
    let cleanup = () => {};
    watchNetwork((connected) => {
      if (first) { first = false; if (connected) return; }
      showToast(connected ? t('app.online') : t('app.offline'));
      if (isNative) haptic(connected ? 'light' : 'medium');
    }).then((c) => { cleanup = c; });
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoClick = () => {
    const now = Date.now();
    logoClicks.current = [...logoClicks.current.filter(ts => now - ts < 2000), now];
    if (logoClicks.current.length >= 5) {
      logoClicks.current = [];
      setShowAdminLogin(true);
    } else if (currentRole === 'buyer') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLoggedIn = (currentRole === 'partner' && partnerAuthed) || (currentRole === 'admin' && adminAuthed);

  const activeRole = currentRole === 'partner' && partnerAuthed ? 'partner'
    : currentRole === 'admin' && adminAuthed ? 'admin' : 'buyer';

  return (
    <div className="app-container">
      <PageLoader />
      <header className="app-header">
        <div className="header-container">
          <div className="brand" onClick={handleLogoClick} title="PARTSEEKER">
            <Wrench className="logo-icon" size={28} />
            <span>PARTSEEKER</span>
          </div>

          <div className="header-actions">
            {/* Role context badge */}
            {currentRole === 'buyer' && (
              <span className="badge badge-success hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                <Sparkles size={14} /> {t('nav.searchParts')}
              </span>
            )}
            {currentRole === 'partner' && partnerAuthed && (
              <span className="badge badge-active hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                <Store size={14} /> {t('nav.partnerCabinet')}
              </span>
            )}
            {currentRole === 'admin' && adminAuthed && (
              <span className="badge badge-danger hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                <Shield size={14} /> {t('nav.admin')}
              </span>
            )}

            <button className="icon-btn" onClick={() => { haptic('light'); toggleTheme(); }} title={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <LanguageSwitch />

            {isLoggedIn ? (
              <button className="btn-ghost-login" onClick={() => { haptic('medium'); logout(); }}>
                <LogOut size={16} /> <span className="hide-mobile">{t('btn.logout')}</span>
              </button>
            ) : (
              <button className="btn-ghost-login" onClick={() => { haptic('light'); setShowPartnerLogin(true); }}>
                <LogIn size={16} /> <span className="hide-mobile">{t('btn.partnerLogin')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity' }}
          >
            <Suspense fallback={<div className="lazy-fallback"><span className="spin-loader" /></div>}>
              {currentRole === 'buyer' && <BuyerDashboard />}
              {currentRole === 'partner' && partnerAuthed && <PartnerDashboard />}
              {currentRole === 'admin' && adminAuthed && <AdminDashboard />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter onOpen={setInfoPage} />

      {showPartnerLogin && <PartnerLoginModal onClose={() => setShowPartnerLogin(false)} />}
      {showAdminLogin && <AdminLoginModal onClose={() => { setShowAdminLogin(false); if (window.location.hash) window.location.hash = ''; }} />}
      <InfoModal pageKey={infoPage} onClose={() => setInfoPage(null)} />

      <AnimatePresence>
        {toast && (
          <motion.div
            className="app-toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
