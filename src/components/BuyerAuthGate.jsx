import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Wrench, LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';
import { haptic } from '../lib/native';

// Полноэкранный вход покупателя. Каталог не показывается, пока нет buyerUser.
// Скрытый вход админа (Ctrl+Shift+A / #admin) и вход партнёра (в шапке)
// работают поверх этого экрана — здесь только покупатель.
export default function BuyerAuthGate() {
  const { t, loginBuyer, registerBuyer } = useContext(AppContext);
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isReg = mode === 'register';

  const submit = (e) => {
    e.preventDefault();
    const res = isReg
      ? registerBuyer({ name, email, password })
      : loginBuyer(email, password);
    if (res.success) { haptic('medium'); return; }
    haptic('heavy');
    setError(t(`buyer.${res.error}`));
  };

  const switchMode = (m) => { setMode(m); setError(''); };

  return (
    <div className="buyer-gate">
      <form className="buyer-gate-card glass-panel" onSubmit={submit}>
        <div className="buyer-gate-brand">
          <Wrench size={30} className="logo-icon" />
          <span>PARTSEEKER</span>
        </div>
        <h2 className="buyer-gate-title">{t('buyer.authTitle')}</h2>
        <p className="buyer-gate-sub">{t('buyer.authSubtitle')}</p>

        <div className="buyer-gate-tabs">
          <button type="button" className={`buyer-gate-tab ${!isReg ? 'is-active' : ''}`} onClick={() => switchMode('login')}>
            {t('buyer.tabLogin')}
          </button>
          <button type="button" className={`buyer-gate-tab ${isReg ? 'is-active' : ''}`} onClick={() => switchMode('register')}>
            {t('buyer.tabRegister')}
          </button>
        </div>

        {isReg && (
          <div className="form-group">
            <label className="form-label">{t('buyer.name')}</label>
            <div className="input-with-icon">
              <User size={16} />
              <input type="text" className="form-control" placeholder={t('buyer.namePh')}
                value={name} onChange={(e) => { setName(e.target.value); setError(''); }} />
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">{t('auth.email')}</label>
          <div className="input-with-icon">
            <Mail size={16} />
            <input type="email" className="form-control" required autoComplete="email" placeholder="name@mail.tj"
              value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t('auth.password')}</label>
          <div className="input-with-icon">
            <Lock size={16} />
            <input type="password" className="form-control" required
              autoComplete={isReg ? 'new-password' : 'current-password'} placeholder="••••••••"
              value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} />
          </div>
        </div>

        {error && <div className="error-text-line" style={{ marginBottom: '12px' }}>{error}</div>}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
          {isReg ? <UserPlus size={17} /> : <LogIn size={17} />}
          {isReg ? t('buyer.signUp') : t('buyer.signIn')}
        </button>

        <p className="buyer-gate-note">{t('buyer.localNote')}</p>
        <p className="buyer-gate-note">{t('buyer.partnerLink')}</p>
      </form>
    </div>
  );
}
