import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Store, Lock, ShieldAlert, LogIn } from 'lucide-react';

export function PartnerLoginModal({ onClose }) {
  const { t, loginPartner, enterPartnerRegistration } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const res = loginPartner(email, password);
    if (res.success) onClose();
    else setError(t(res.error === 'wrongEmail' ? 'auth.wrongEmail' : 'auth.wrongPass'));
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content glass-panel" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Store size={22} style={{ color: 'var(--primary)' }} /> {t('auth.partnerTitle')}
          </h3>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <input type="email" className="form-control" required placeholder="info@avto-dushanbe.tj" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <input type="password" className="form-control" required placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} />
          </div>

          {error && <div className="error-text-line" style={{ marginBottom: '12px' }}>{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
            <LogIn size={17} /> {t('auth.login')}
          </button>

          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <button type="button" className="btn-ghost-login" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => { enterPartnerRegistration(); onClose(); }}>
              {t('auth.toRegister')}
            </button>
          </div>

          <p style={{ marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {t('auth.partnerDemo')}
          </p>
        </form>
      </div>
    </div>
  );
}

export function AdminLoginModal({ onClose }) {
  const { t, loginAdmin } = useContext(AppContext);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const res = loginAdmin(password);
    if (res.success) onClose();
    else setError(t('auth.wrongPass'));
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content glass-panel" style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={22} style={{ color: 'var(--error)' }} /> {t('auth.adminTitle')}
          </h3>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={submit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Lock size={16} /> {t('auth.adminHint')}
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <input type="password" className="form-control" required autoFocus placeholder="••••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} />
          </div>

          {error && <div className="error-text-line" style={{ marginBottom: '12px' }}>{error}</div>}

          <button type="submit" className="btn btn-danger" style={{ width: '100%', padding: '13px' }}>
            <LogIn size={17} /> {t('auth.login')}
          </button>
        </form>
      </div>
    </div>
  );
}
