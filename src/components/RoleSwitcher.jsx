import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { User, Store, ShieldAlert, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export default function RoleSwitcher() {
  const { 
    currentRole, 
    setCurrentRole, 
    activePartnerUserId, 
    setActivePartnerUserId, 
    shops, 
    resetDatabase 
  } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="role-switcher-floating">
      {isOpen ? (
        <div className="role-switcher-panel glass-panel fade-in">
          <div className="role-switcher-title">
            <span>Панель отладки</span>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <ChevronDown size={18} />
            </button>
          </div>
          
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Текущая роль в системе:
          </div>

          <div className="role-switcher-buttons">
            <button 
              className={`role-btn ${currentRole === 'buyer' ? 'active' : ''}`}
              onClick={() => setCurrentRole('buyer')}
            >
              <User size={16} />
              Покупатель (Клиент)
            </button>
            
            <button 
              className={`role-btn ${currentRole === 'partner' ? 'active' : ''}`}
              onClick={() => setCurrentRole('partner')}
            >
              <Store size={16} />
              Магазин-Партнёр
            </button>

            <button 
              className={`role-btn ${currentRole === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentRole('admin')}
            >
              <ShieldAlert size={16} />
              Администратор
            </button>
          </div>

          {currentRole === 'partner' && (
            <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Активный кабинет магазина:
              </label>
              <select 
                className="form-control" 
                style={{ padding: '6px 8px', fontSize: '0.8rem', height: 'auto' }}
                value={activePartnerUserId}
                onChange={(e) => setActivePartnerUserId(e.target.value)}
              >
                {shops.map(shop => (
                  <option key={shop.id} value={shop.user_id}>
                    {shop.name} ({shop.status === 'active' ? 'Активен' : 'Модерация'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button 
            className="btn btn-secondary btn-sm" 
            style={{ width: '100%', marginTop: '4px', fontSize: '0.75rem', gap: '4px' }}
            onClick={resetDatabase}
          >
            <RefreshCw size={12} />
            Сбросить демо-БД
          </button>
        </div>
      ) : (
        <button 
          className="btn btn-primary" 
          style={{ borderRadius: '50px', padding: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setIsOpen(true)}
          title="Открыть панель отладки"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}
