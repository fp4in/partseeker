import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Wrench, LogIn, UserPlus, Mail, Lock, User, Phone, Store, ShoppingBag, MapPin } from 'lucide-react';
import { haptic } from '../lib/native';

// Полноэкранный вход. Сначала выбор роли (Покупатель/Продавец), затем
// вход или регистрация. Скрытый вход админа (Ctrl+Shift+A / #admin) и
// работают поверх этого экрана.
export default function BuyerAuthGate() {
  const { t, loginBuyer, registerBuyer, loginSeller, registerSeller, plans } = useContext(AppContext);
  const [role, setRole] = useState('buyer');     // 'buyer' | 'seller'
  const [mode, setMode] = useState('login');      // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', shopName: '', city: '', plan: 'plan-basic' });
  const [error, setError] = useState('');

  const isReg = mode === 'register';
  const isSeller = role === 'seller';
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const submit = (e) => {
    e.preventDefault();
    let res;
    if (isSeller) {
      res = isReg
        ? registerSeller({ name: form.name, email: form.email, password: form.password, phone: form.phone, shopName: form.shopName, city: form.city, plan: form.plan })
        : loginSeller(form.email, form.password);
    } else {
      res = isReg
        ? registerBuyer({ name: form.name, email: form.email, password: form.password, phone: form.phone })
        : loginBuyer(form.email, form.password);
    }
    if (res.success) { haptic('medium'); return; }
    haptic('heavy');
    setError(t(`buyer.${res.error}`));
  };

  const switchRole = (r) => { setRole(r); setError(''); };
  const switchMode = (m) => { setMode(m); setError(''); };

  return (
    <div className="buyer-gate">
      <form className="buyer-gate-card glass-panel" onSubmit={submit}>
        <div className="buyer-gate-brand">
          <Wrench size={30} className="logo-icon" />
          <span>PARTSEEKER</span>
        </div>

        {/* Выбор роли */}
        <div className="buyer-role-switch">
          <button type="button" className={`buyer-role ${!isSeller ? 'is-active' : ''}`} onClick={() => switchRole('buyer')}>
            <ShoppingBag size={18} /> {t('buyer.roleBuyer')}
          </button>
          <button type="button" className={`buyer-role ${isSeller ? 'is-active' : ''}`} onClick={() => switchRole('seller')}>
            <Store size={18} /> {t('buyer.roleSeller')}
          </button>
        </div>

        <h2 className="buyer-gate-title">{t('buyer.authTitle')}</h2>
        <p className="buyer-gate-sub">{isSeller ? t('buyer.sellerSub') : t('buyer.buyerSub')}</p>

        <div className="buyer-gate-tabs">
          <button type="button" className={`buyer-gate-tab ${!isReg ? 'is-active' : ''}`} onClick={() => switchMode('login')}>
            {t('buyer.tabLogin')}
          </button>
          <button type="button" className={`buyer-gate-tab ${isReg ? 'is-active' : ''}`} onClick={() => switchMode('register')}>
            {t('buyer.tabRegister')}
          </button>
        </div>

        {/* Имя / контактное лицо — только при регистрации */}
        {isReg && (
          <div className="form-group">
            <label className="form-label">{isSeller ? t('buyer.contactName') : t('buyer.name')}</label>
            <div className="input-with-icon">
              <User size={16} />
              <input type="text" className="form-control" placeholder={t('buyer.namePh')}
                value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
          </div>
        )}

        {/* Реквизиты магазина — только продавец при регистрации */}
        {isSeller && isReg && (
          <>
            <div className="form-group">
              <label className="form-label">{t('buyer.shopName')} *</label>
              <div className="input-with-icon">
                <Store size={16} />
                <input type="text" className="form-control" required placeholder="Автозапчасти Душанбе"
                  value={form.shopName} onChange={(e) => set('shopName', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('buyer.city')}</label>
              <div className="input-with-icon">
                <MapPin size={16} />
                <input type="text" className="form-control" placeholder="Душанбе"
                  value={form.city} onChange={(e) => set('city', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('buyer.plan')}</label>
              <select className="form-control" value={form.plan} onChange={(e) => set('plan', e.target.value)}>
                {(plans || []).map(p => <option key={p.id} value={p.id}>{p.name} — {p.price} сом./мес ({p.max_offers} тов.)</option>)}
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">{t('auth.email')}</label>
          <div className="input-with-icon">
            <Mail size={16} />
            <input type="email" className="form-control" required autoComplete="email" placeholder="name@mail.tj"
              value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
        </div>

        {/* Телефон — при регистрации (у продавца обязателен для связи) */}
        {isReg && (
          <div className="form-group">
            <label className="form-label">{isSeller ? `${t('buyer.phone')} *` : t('buyer.phoneOpt')}</label>
            <div className="input-with-icon">
              <Phone size={16} />
              <input type="tel" className="form-control" required={isSeller} placeholder="+992 90 123-45-67"
                value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">{t('auth.password')}</label>
          <div className="input-with-icon">
            <Lock size={16} />
            <input type="password" className="form-control" required
              autoComplete={isReg ? 'new-password' : 'current-password'} placeholder="••••••••"
              value={form.password} onChange={(e) => set('password', e.target.value)} />
          </div>
        </div>

        {error && <div className="error-text-line" style={{ marginBottom: '12px' }}>{error}</div>}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
          {isReg ? <UserPlus size={17} /> : <LogIn size={17} />}
          {isReg ? t('buyer.signUp') : t('buyer.signIn')}
        </button>

        <p className="buyer-gate-note">{t('buyer.localNote')}</p>
      </form>
    </div>
  );
}
