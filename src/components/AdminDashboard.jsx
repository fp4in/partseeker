import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import {
  Shield, Users, ShoppingCart, Settings, BarChart,
  Check, X, Eye, Lock, Unlock, Search, Globe, ChevronRight, RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    shops, 
    orders, 
    parts, 
    offers, 
    plans,
    searchLogs,
    t,
    resetDatabase,
    updateShopStatus,
    createOrUpdateTariff
  } = useContext(AppContext);

  // Tabs navigation
  const [activeTab, setActiveTab] = useState('partners'); // 'partners' | 'orders' | 'tariffs' | 'search-logs'

  // Tariff editor state
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanPrice, setEditPlanPrice] = useState('');
  const [editPlanMaxOffers, setEditPlanMaxOffers] = useState('');

  // Global metrics calculation
  const totalRevenue = useMemo(() => {
    return orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price * o.quantity), 0);
  }, [orders]);

  const activeShopsCount = useMemo(() => shops.filter(s => s.status === 'active').length, [shops]);
  const pendingShopsCount = useMemo(() => shops.filter(s => s.status === 'pending').length, [shops]);
  
  // Start plan editing
  const startEditPlan = (plan) => {
    setEditingPlanId(plan.id);
    setEditPlanName(plan.name);
    setEditPlanPrice(plan.price);
    setEditPlanMaxOffers(plan.max_offers);
  };

  // Save plan editing
  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!editPlanName || !editPlanPrice || !editPlanMaxOffers) return;

    createOrUpdateTariff({
      id: editingPlanId,
      name: editPlanName,
      price: parseFloat(editPlanPrice) || 0,
      max_offers: parseInt(editPlanMaxOffers, 10) || 100
    });
    setEditingPlanId(null);
  };

  return (
    <div className="fade-in">
      {/* Global metrics header */}
      <div className="stats-row" style={{ marginBottom: '24px' }}>
        <div className="glass-panel stat-card">
          <span className="stat-lbl">Всего магазинов</span>
          <div className="stat-val">
            {shops.length}{' '}
            {pendingShopsCount > 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 'normal' }}>
                ({pendingShopsCount} на модерации)
              </span>
            )}
          </div>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-lbl">Деталей в каталоге</span>
          <div className="stat-val">{parts.length}</div>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-lbl">Всего предложений</span>
          <div className="stat-val">{offers.length}</div>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-lbl">Оборот заказов</span>
          <div className="stat-val" style={{ color: 'var(--success)' }}>
            {totalRevenue} сом.
          </div>
        </div>
      </div>

      {/* Admin tabs */}
      <div className="admin-tabs">
        <div 
          className={`admin-tab ${activeTab === 'partners' ? 'active' : ''}`}
          onClick={() => setActiveTab('partners')}
        >
          <Users size={16} style={{ marginRight: '6px', display: 'inline' }} />
          {t('a.partners')} ({shops.length})
        </div>
        <div
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingCart size={16} style={{ marginRight: '6px', display: 'inline' }} />
          {t('a.orders')} ({orders.length})
        </div>
        <div
          className={`admin-tab ${activeTab === 'tariffs' ? 'active' : ''}`}
          onClick={() => setActiveTab('tariffs')}
        >
          <Settings size={16} style={{ marginRight: '6px', display: 'inline' }} />
          {t('a.tariffs')}
        </div>
        <div
          className={`admin-tab ${activeTab === 'search-logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('search-logs')}
        >
          <Search size={16} style={{ marginRight: '6px', display: 'inline' }} />
          {t('a.searchLogs')}
        </div>
        <button
          className="btn btn-secondary btn-sm"
          style={{ marginLeft: 'auto', alignSelf: 'center' }}
          onClick={resetDatabase}
          title={t('a.resetDb')}
        >
          <RefreshCw size={14} /> {t('a.resetDb')}
        </button>
      </div>

      {/* PARTNERS MODERATION TAB */}
      {activeTab === 'partners' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Управление партнёрами</h3>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Магазин</th>
                  <th>Контакты</th>
                  <th>Адрес и город</th>
                  <th>Тариф</th>
                  <th>Статус</th>
                  <th style={{ textAlign: 'right' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {shops.map(shop => {
                  const shopPlan = plans.find(p => p.id === shop.subscription_plan);
                  return (
                    <tr key={shop.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={shop.logo_url} alt={shop.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <strong>{shop.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Рег: {new Date(shop.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{shop.phone}</div>
                        {shop.website_url && (
                          <a href={shop.website_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                            {shop.website_url.replace('https://', '')}
                          </a>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{shop.city}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{shop.address}</div>
                      </td>
                      <td>
                        <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                          {shopPlan ? shopPlan.name : 'Не указан'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          shop.status === 'active' ? 'badge-success' : 
                          shop.status === 'pending' ? 'badge-pending' : 'badge-danger'
                        }`}>
                          {shop.status === 'active' && 'Активен'}
                          {shop.status === 'pending' && 'Модерация'}
                          {shop.status === 'blocked' && 'Блокирован'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {shop.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => updateShopStatus(shop.id, 'blocked')}
                                title="Отклонить регистрацию"
                                style={{ padding: '6px 8px' }}
                              >
                                <X size={14} />
                              </button>
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => updateShopStatus(shop.id, 'active')}
                                title="Одобрить магазин"
                                style={{ padding: '6px 10px', gap: '4px' }}
                              >
                                <Check size={14} />
                                Одобрить
                              </button>
                            </>
                          )}
                          {shop.status === 'active' && (
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => updateShopStatus(shop.id, 'blocked')}
                              style={{ gap: '4px', color: 'var(--error)' }}
                            >
                              <Lock size={12} />
                              Блокировать
                            </button>
                          )}
                          {shop.status === 'blocked' && (
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => updateShopStatus(shop.id, 'active')}
                              style={{ gap: '4px' }}
                            >
                              <Unlock size={12} />
                              Разблокировать
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ALL ORDERS LOG TAB */}
      {activeTab === 'orders' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Лог заказов платформы</h3>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID заказа</th>
                  <th>Дата</th>
                  <th>Покупатель</th>
                  <th>Магазин</th>
                  <th>Деталь</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const shop = shops.find(s => s.id === order.shop_id);
                  return (
                    <tr key={order.id}>
                      <td><strong>#{order.id}</strong></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{order.buyer_name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.buyer_phone}</div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
                          {shop ? shop.name : 'Неизвестный'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{order.part_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Артикул: {order.part_article} | {order.part_brand}
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{order.price * order.quantity} сом.</strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{order.price} сом. x {order.quantity} шт.</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          order.status === 'new' ? 'badge-pending' : 
                          order.status === 'accepted' ? 'badge-secondary' : 
                          order.status === 'ready' ? 'badge-active' : 
                          order.status === 'completed' ? 'badge-success' : 'badge-danger'
                        }`}>
                          {order.status === 'new' && 'Новый'}
                          {order.status === 'accepted' && 'Принят'}
                          {order.status === 'ready' && 'Готов к выдаче'}
                          {order.status === 'completed' && 'Выдан'}
                          {order.status === 'cancelled' && 'Отменен'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TARIFF PLANS TAB */}
      {activeTab === 'tariffs' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Настройка тарифов подписки</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {plans.map(plan => (
              <div 
                key={plan.id} 
                className="glass-panel" 
                style={{ 
                  padding: '24px', 
                  border: editingPlanId === plan.id ? '2px solid var(--accent)' : '1px solid var(--border-light)',
                  background: editingPlanId === plan.id ? 'var(--bg-obsidian)' : 'transparent'
                }}
              >
                {editingPlanId === plan.id ? (
                  <form onSubmit={handleSavePlan}>
                    <div className="form-group">
                      <label className="form-label">Название тарифа</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={editPlanName} 
                        onChange={(e) => setEditPlanName(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Стоимость подписки (сом. / мес.)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        required 
                        value={editPlanPrice} 
                        onChange={(e) => setEditPlanPrice(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Лимит предложений в прайсе</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        required 
                        value={editPlanMaxOffers} 
                        onChange={(e) => setEditPlanMaxOffers(e.target.value)} 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingPlanId(null)}>Отмена</button>
                      <button type="submit" className="btn btn-accent btn-sm">Сохранить</button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Тариф «{plan.name}»</h4>
                    <div style={{ marginTop: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{plan.price} сом.</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '4px' }}>/ месяц</span>
                    </div>
                    <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li>Лимит предложений: <strong>{plan.max_offers}</strong></li>
                      {plan.features && plan.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      style={{ width: '100%', marginTop: '24px' }}
                      onClick={() => startEditPlan(plan)}
                    >
                      Редактировать
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH LOGS MONITOR TAB */}
      {activeTab === 'search-logs' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Лог поисковых запросов пользователей</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Помогает выявить отсутствующие в каталоге товары, анализируя ненайденные артикулы (Результатов = 0).
          </p>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Поисковый запрос</th>
                  <th>Время</th>
                  <th>Результатов выдано</th>
                  <th>IP адрес клиента</th>
                  <th>Статус поиска</th>
                </tr>
              </thead>
              <tbody>
                {searchLogs.map(log => (
                  <tr key={log.id}>
                    <td><strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{log.query}</strong></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>
                      <strong style={{ color: log.results_count > 0 ? 'var(--text-primary)' : 'var(--error)' }}>
                        {log.results_count}
                      </strong>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.ip}</td>
                    <td>
                      {log.results_count > 0 ? (
                        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Найдено</span>
                      ) : (
                        <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>Без результатов</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
