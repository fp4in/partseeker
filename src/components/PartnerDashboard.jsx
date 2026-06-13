import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
// xlsx (~380 КБ) и papaparse грузятся динамически только при загрузке
// прайса — чтобы не утяжелять основной бандл кабинета.
import {
  Upload, FileText, CheckCircle, AlertTriangle, Play,
  ShoppingBag, Clipboard, BarChart2, DollarSign,
  RefreshCw, PlusCircle, Check, X, ShieldAlert, ArrowRight, Eye, Phone, Tag, Package, Trash2, Pencil
} from 'lucide-react';

export default function PartnerDashboard() {
  const {
    activeShop,
    orders,
    offers,
    parts,
    categories,
    partViews,
    plans,
    parsingLogs,
    t,
    registerPartnerShop,
    updateShopProfile,
    updateOrderStatus,
    parseAndApplyPricelist,
    addOfferManual,
    updateOfferFields,
    deleteOffer
  } = useContext(AppContext);

  // Active sub-view
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'pricelist' | 'orders' | 'stats'

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDesc, setRegDesc] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWebsite, setRegWebsite] = useState('');
  const [regPlan, setRegPlan] = useState('plan-basic');

  // Pricelist upload states
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const fileInputRef = useRef(null);

  // Orders filters
  const [orderFilterStatus, setOrderFilterStatus] = useState('all');

  // Ручное добавление товара (с выбором категории)
  const [manualForm, setManualForm] = useState({
    category_id: 'cat-engine', article: '', brand: '', name: '',
    price: '', quantity: '', delivery_days: '0', make: '', model: ''
  });
  const [manualMsg, setManualMsg] = useState(null); // { ok, text }
  const setMF = (k, v) => { setManualForm(prev => ({ ...prev, [k]: v })); setManualMsg(null); };

  // Инлайн-редактирование товара в «Мои товары»
  const [editOfferId, setEditOfferId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQty, setEditQty] = useState('');
  const startEditOffer = (o) => { setEditOfferId(o.id); setEditPrice(String(o.price)); setEditQty(String(o.quantity)); };
  const saveOffer = (id) => { updateOfferFields(id, { price: editPrice, quantity: editQty }); setEditOfferId(null); };
  const removeOffer = (id) => { if (window.confirm('Удалить этот товар из вашего каталога?')) deleteOffer(id); };

  const handleAddManual = (e) => {
    e.preventDefault();
    const res = addOfferManual({ shopId: activeShop.id, ...manualForm });
    if (res.success) {
      setManualMsg({ ok: true, text: res.updated ? 'Товар обновлён в каталоге.' : 'Товар добавлен в каталог.' });
      setManualForm(prev => ({ ...prev, article: '', brand: '', name: '', price: '', quantity: '', make: '', model: '' }));
    } else {
      setManualMsg({ ok: false, text: res.error });
    }
  };

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editWebsite, setEditWebsite] = useState('');

  // Handle register shop
  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName || !regAddress || !regPhone || !regEmail) {
      alert('Заполните обязательные поля!');
      return;
    }
    registerPartnerShop({
      name: regName,
      email: regEmail,
      description: regDesc,
      address: regAddress,
      phone: regPhone,
      website_url: regWebsite,
      subscription_plan: regPlan
    });
  };

  // Start edit profile
  const startEditProfile = () => {
    if (!activeShop) return;
    setEditName(activeShop.name);
    setEditDesc(activeShop.description);
    setEditAddress(activeShop.address);
    setEditPhone(activeShop.phone);
    setEditWebsite(activeShop.website_url);
    setIsEditingProfile(true);
  };

  // Save profile
  const saveShopProfile = (e) => {
    e.preventDefault();
    updateShopProfile(activeShop.id, {
      name: editName,
      description: editDesc,
      address: editAddress,
      phone: editPhone,
      website_url: editWebsite
    });
    setIsEditingProfile(false);
  };

  // Export template CSV
  const downloadTemplate = () => {
    const csvContent =
      "Артикул,Бренд,Название,Категория,Цена,Количество,Марка,Модель,Год от,Год до,Срок доставки\n" +
      "OC90,Knecht-Mahle,Масляный фильтр OC90,Фильтры,450,15,Lada,Vesta,2015,,0\n" +
      "W71294,Mann-Filter,Масляный фильтр Mann W712/94,Фильтры,490,8,Volkswagen,Polo,2012,2020,0\n" +
      "SP1399,Sangsin,Тормозные колодки дисковые,Тормозная система,1950,22,Hyundai,Solaris,2017,,1\n";
    
    // Create blob and download
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); // UTF-8 BOM
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'shablon_praisa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Сопоставление текста категории из прайса с id категории каталога.
  const mapCategory = (val) => {
    if (!val) return undefined;
    const s = String(val).trim().toLowerCase();
    const byId = categories.find(c => c.id.toLowerCase() === s);
    if (byId) return byId.id;
    const byName = categories.find(c =>
      c.name.toLowerCase() === s || c.name.toLowerCase().includes(s) || s.includes(c.name.toLowerCase()));
    return byName ? byName.id : undefined;
  };

  // Handle file drop & select parsing
  const processPricelistFile = (file) => {
    if (!file || !activeShop) return;
    setIsParsing(true);
    setParseResult(null);

    const reader = new FileReader();

    if (file.name.endsWith('.csv')) {
      reader.onload = async (e) => {
        const text = e.target.result;
        const Papa = (await import('papaparse')).default;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data.map(row => {
              // Helper to map keys translation
              const findVal = (keys) => {
                const found = Object.keys(row).find(k => keys.includes(k.toLowerCase().trim()));
                return found ? row[found] : undefined;
              };

              return {
                article: findVal(['article', 'артикул', 'код']),
                brand: findVal(['brand', 'бренд', 'производитель', 'изготовитель']),
                name: findVal(['name', 'название', 'наименование', 'деталь']),
                price: findVal(['price', 'цена', 'стоимость']),
                quantity: findVal(['quantity', 'количество', 'наличие', 'кол-во', 'колво']),
                make: findVal(['make', 'марка', 'марка авто', 'авто']),
                model: findVal(['model', 'модель', 'модель авто']),
                year_from: findVal(['year_from', 'год от', 'год_от']),
                year_to: findVal(['year_to', 'год до', 'год_до']),
                delivery_days: findVal(['delivery_days', 'срок', 'срок доставки', 'срок_доставки']),
                category_id: mapCategory(findVal(['category', 'категория', 'раздел', 'группа']))
              };
            });

            const res = parseAndApplyPricelist(activeShop.id, rows, file.name);
            setParseResult(res.log);
            setIsParsing(false);
          },
          error: (err) => {
            alert(`Ошибка парсинга CSV: ${err.message}`);
            setIsParsing(false);
          }
        });
      };
      reader.readAsText(file, 'UTF-8');
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = async (e) => {
        try {
          const XLSX = await import('xlsx');
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet);

          const rows = rawRows.map(row => {
            const findVal = (keys) => {
              const found = Object.keys(row).find(k => keys.includes(k.toLowerCase().trim()));
              return found ? row[found] : undefined;
            };

            return {
              article: findVal(['article', 'артикул', 'код']),
              brand: findVal(['brand', 'бренд', 'производитель', 'изготовитель']),
              name: findVal(['name', 'название', 'наименование', 'деталь']),
              price: findVal(['price', 'цена', 'стоимость']),
              quantity: findVal(['quantity', 'количество', 'наличие', 'кол-во', 'колво']),
              make: findVal(['make', 'марка', 'марка авто', 'авто']),
              model: findVal(['model', 'модель', 'модель авто']),
              year_from: findVal(['year_from', 'год от', 'год_от']),
              year_to: findVal(['year_to', 'год до', 'год_до']),
              delivery_days: findVal(['delivery_days', 'срок', 'срок доставки', 'срок_доставки']),
              category_id: mapCategory(findVal(['category', 'категория', 'раздел', 'группа']))
            };
          });

          const res = parseAndApplyPricelist(activeShop.id, rows, file.name);
          setParseResult(res.log);
          setIsParsing(false);
        } catch (err) {
          alert(`Ошибка парсинга Excel: ${err.message}`);
          setIsParsing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Формат файла не поддерживается! Пожалуйста, загрузите файл .xlsx, .xls или .csv');
      setIsParsing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processPricelistFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processPricelistFile(e.target.files[0]);
    }
  };

  // Filter orders for active shop
  const shopOrders = orders.filter(o => o.shop_id === activeShop?.id);
  
  const filteredOrders = shopOrders.filter(o => {
    if (orderFilterStatus === 'all') return true;
    return o.status === orderFilterStatus;
  });

  const shopOffers = offers.filter(o => o.shop_id === activeShop?.id);

  // Calculate stats metrics
  const activePlanInfo = plans.find(p => p.id === activeShop?.subscription_plan);
  const totalRevenue = shopOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price * o.quantity), 0);
  const totalOrdersCount = shopOrders.length;
  const newOrdersCount = shopOrders.filter(o => o.status === 'new').length;

  // --- Бухгалтерия магазина (всё из заказов, без сервера) ---
  const sumOrders = (list) => list.reduce((s, o) => s + o.price * o.quantity, 0);
  const completedOrders = shopOrders.filter(o => o.status === 'completed');
  const pendingOrders = shopOrders.filter(o => ['new', 'accepted', 'ready'].includes(o.status));
  const cancelledOrders = shopOrders.filter(o => o.status === 'cancelled');
  const realizedRevenue = sumOrders(completedOrders);     // реализованная выручка (выдано)
  const pendingRevenue = sumOrders(pendingOrders);        // в работе (ожидается)
  const unitsSold = completedOrders.reduce((s, o) => s + o.quantity, 0);
  const avgCheck = completedOrders.length ? Math.round(realizedRevenue / completedOrders.length) : 0;
  const statusCounts = {
    new: shopOrders.filter(o => o.status === 'new').length,
    accepted: shopOrders.filter(o => o.status === 'accepted').length,
    ready: shopOrders.filter(o => o.status === 'ready').length,
    completed: completedOrders.length,
    cancelled: cancelledOrders.length,
  };
  // Топ товаров по реализованной выручке
  const topProducts = Object.values(completedOrders.reduce((acc, o) => {
    const key = o.part_article + '|' + o.part_name;
    acc[key] = acc[key] || { name: o.part_name, article: o.part_article, units: 0, revenue: 0 };
    acc[key].units += o.quantity;
    acc[key].revenue += o.price * o.quantity;
    return acc;
  }, {})).sort((a, b) => b.revenue - a.revenue);

  const downloadBookkeeping = () => {
    const head = 'Дата,Заказ,Товар,Артикул,Количество,Цена,Сумма,Статус,Покупатель,Телефон\n';
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = shopOrders.map(o => [
      new Date(o.created_at).toLocaleString(), o.id, o.part_name, o.part_article,
      o.quantity, o.price, o.price * o.quantity, o.status, o.buyer_name, o.buyer_phone,
    ].map(esc).join(',')).join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), head + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `buhgalteriya_${activeShop.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Просмотры товаров магазина (реальные, по карточкам деталей)
  const viewsTable = shopOffers
    .map(o => {
      const p = parts.find(pp => pp.id === o.part_id);
      return { offerId: o.id, name: p?.name || o.raw_name, views: (p && partViews[p.id]) || 0, qty: o.quantity, price: o.price };
    })
    .sort((a, b) => b.views - a.views);
  const totalViews = viewsTable.reduce((sum, r) => sum + r.views, 0);

  // Render registration screen if no active shop
  if (!activeShop) {
    return (
      <div className="main-content" style={{ maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PlusCircle size={24} style={{ color: 'var(--accent)' }} />
            Регистрация магазина-партнёра
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Создайте профиль вашего магазина, чтобы загружать прайс-листы и получать заявки от покупателей.
          </p>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Название магазина *</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="Например, Запчасти Русалка" 
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email для уведомлений *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  required 
                  placeholder="shop@example.com" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Телефон магазина *</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  required 
                  placeholder="+992 90 123-45-67"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Полный адрес магазина *</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="ш. Душанбе, хиёбони Рӯдакӣ, 22"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Сайт (необязательно)</label>
              <input 
                type="url" 
                className="form-control" 
                placeholder="https://myshop.ru" 
                value={regWebsite}
                onChange={(e) => setRegWebsite(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Описание магазина</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Напишите кратко о ваших преимуществах, складе, брендах..." 
                value={regDesc}
                onChange={(e) => setRegDesc(e.target.value)}
              />
            </div>

            {/* Choose plan */}
            <div className="form-group">
              <label className="form-label">Выберите тарифный план</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '10px' }}>
                {plans.map(p => (
                  <label 
                    key={p.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '16px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      border: regPlan === p.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                      background: regPlan === p.id ? 'var(--primary-glow)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input 
                        type="radio" 
                        name="plan" 
                        value={p.id} 
                        checked={regPlan === p.id} 
                        onChange={() => setRegPlan(p.id)}
                        style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                      />
                      <div>
                        <strong>Тариф «{p.name}»</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Лимит: {p.max_offers} предложений</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>{p.price} сом.</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>в месяц</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
              Зарегистрировать магазин
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Active Shop Partner cabinet
  return (
    <div className="partner-grid fade-in">
      {/* Sidebar navigation */}
      <div className="glass-panel partner-card-sidebar">
        <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
          <img src={activeShop.logo_url} alt={activeShop.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
          <h3 style={{ marginTop: '12px' }}>{activeShop.name}</h3>
          
          {activeShop.status === 'pending' && (
            <span className="badge badge-pending" style={{ marginTop: '8px' }}>
              <ShieldAlert size={10} style={{ marginRight: '4px' }} />
              На модерации
            </span>
          )}
          {activeShop.status === 'active' && <span className="badge badge-active" style={{ marginTop: '8px' }}>Активен</span>}
          {activeShop.status === 'blocked' && <span className="badge badge-blocked" style={{ marginTop: '8px' }}>Заблокирован</span>}

          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Тариф: <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{activePlanInfo?.name}</span> (до {activePlanInfo?.max_offers} тов.)
          </div>
        </div>

        <nav>
          <div className={`partner-menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <Clipboard size={18} />
            {t('p.overview')}
          </div>
          <div className={`partner-menu-item ${activeTab === 'pricelist' ? 'active' : ''}`} onClick={() => setActiveTab('pricelist')}>
            <Upload size={18} />
            {t('p.pricelist')}
          </div>
          <div className={`partner-menu-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={18} />
            Мои товары ({shopOffers.length})
          </div>
          <div className={`partner-menu-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <ShoppingBag size={18} />
            {t('p.orders')} ({newOrdersCount > 0 ? newOrdersCount : shopOrders.length})
          </div>
          <div className={`partner-menu-item ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            <BarChart2 size={18} />
            {t('p.stats')}
          </div>
          <div className={`partner-menu-item ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>
            <DollarSign size={18} />
            Бухгалтерия
          </div>
        </nav>
      </div>

      {/* Main Panel views */}
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Данные магазина</h2>
              {!isEditingProfile && (
                <button className="btn btn-secondary btn-sm" onClick={startEditProfile}>
                  Редактировать
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={saveShopProfile}>
                <div className="form-group">
                  <label className="form-label">Название магазина *</label>
                  <input type="text" className="form-control" required value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Описание</label>
                  <textarea className="form-control" rows="3" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Адрес *</label>
                  <input type="text" className="form-control" required value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Телефон *</label>
                  <input type="text" className="form-control" required value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Сайт</label>
                  <input type="url" className="form-control" value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditingProfile(false)}>Отмена</button>
                  <button type="submit" className="btn btn-primary">Сохранить</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ОПИСАНИЕ:</div>
                  <div style={{ marginTop: '4px', fontSize: '0.95rem' }}>{activeShop.description || 'Нет описания.'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>АДРЕС:</div>
                    <div style={{ marginTop: '4px', fontWeight: 600 }}>{activeShop.address}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ТЕЛЕФОН:</div>
                    <div style={{ marginTop: '4px', fontWeight: 600 }}>{activeShop.phone}</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>САЙТ:</div>
                  <div style={{ marginTop: '4px' }}>
                    {activeShop.website_url ? (
                      <a href={activeShop.website_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{activeShop.website_url}</a>
                    ) : 'Не указан.'}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '10px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px' }}>Часы работы</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', fontSize: '0.8rem', textAlign: 'center' }}>
                    {Object.entries(activeShop.working_hours).map(([day, hours]) => (
                      <div key={day} style={{ background: 'var(--bg-obsidian)', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                        <div style={{ textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>{day}</div>
                        <div style={{ marginTop: '4px', color: hours === 'Выходной' ? 'var(--error)' : 'var(--text-primary)' }}>{hours}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRICELIST TAB */}
        {activeTab === 'pricelist' && (
          <div>
            {/* Ручное добавление товара с выбором категории */}
            <div className="glass-panel" style={{ padding: '22px', marginBottom: '28px', borderLeft: '4px solid var(--accent)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', marginBottom: '6px' }}>
                <PlusCircle size={20} style={{ color: 'var(--accent)' }} /> Добавить товар вручную
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '18px' }}>
                Разместите одну позицию и сразу выберите для неё <strong>категорию</strong> — так покупатели найдут её в нужном разделе каталога.
              </p>
              <form onSubmit={handleAddManual}>
                <div className="form-group">
                  <label className="form-label"><Tag size={13} style={{ verticalAlign: '-1px', marginRight: '4px' }} />Категория *</label>
                  <select className="form-control" required value={manualForm.category_id} onChange={(e) => setMF('category_id', e.target.value)}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Артикул *</label><input className="form-control" required placeholder="OC90" value={manualForm.article} onChange={(e) => setMF('article', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Бренд *</label><input className="form-control" required placeholder="Mann-Filter" value={manualForm.brand} onChange={(e) => setMF('brand', e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="form-label">Название *</label><input className="form-control" required placeholder="Масляный фильтр Mann W712/94" value={manualForm.name} onChange={(e) => setMF('name', e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Цена (сом.) *</label><input type="number" min="0" className="form-control" required placeholder="490" value={manualForm.price} onChange={(e) => setMF('price', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Количество *</label><input type="number" min="0" className="form-control" required placeholder="10" value={manualForm.quantity} onChange={(e) => setMF('quantity', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Срок (дней)</label><input type="number" min="0" className="form-control" placeholder="0" value={manualForm.delivery_days} onChange={(e) => setMF('delivery_days', e.target.value)} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Марка авто</label><input className="form-control" placeholder="Hyundai (необязательно)" value={manualForm.make} onChange={(e) => setMF('make', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Модель</label><input className="form-control" placeholder="Solaris (необязательно)" value={manualForm.model} onChange={(e) => setMF('model', e.target.value)} /></div>
                </div>
                {manualMsg && (
                  <div className={manualMsg.ok ? 'success-text-line' : 'error-text-line'} style={{ marginBottom: '12px' }}>{manualMsg.text}</div>
                )}
                <button type="submit" className="btn btn-accent" style={{ gap: '6px' }}><PlusCircle size={16} /> Добавить в каталог</button>
              </form>
            </div>

            <h2>Загрузка прайс-листа</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
              Загрузите прайс в формате <strong>Excel (.xlsx, .xls)</strong> или <strong>CSV</strong>. Файл должен содержать колонки:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>Артикул, Бренд, Название, Категория, Цена, Количество</strong>. Колонка «Категория» направит товар в нужный раздел (если её нет — товар попадёт в «Расходники»). Шаблон можно скачать ниже.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button className="btn btn-secondary btn-sm" onClick={downloadTemplate} style={{ gap: '6px' }}>
                <FileText size={16} />
                Скачать шаблон CSV
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div 
              className={`upload-drop-zone ${isDragOver ? 'dragover' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
              />
              <Upload size={48} className="upload-icon" style={{ margin: '0 auto 16px' }} />
              <h3>Перетащите файл сюда</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>
                или нажмите для выбора файла на диске (.xlsx, .csv)
              </p>
            </div>

            {/* Parsing Spinner */}
            {isParsing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', justifyContent: 'center', padding: '20px' }}>
                <RefreshCw size={24} className="spin-loader" />
                <span>Идёт парсинг и маппинг товаров прайс-листа...</span>
              </div>
            )}

            {/* Current Stock info */}
            <div style={{ background: 'var(--bg-obsidian)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
              <strong>Ваш склад на платформе:</strong>
              <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Всего предложений:</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)' }}>
                    {shopOffers.length} / {activePlanInfo?.max_offers}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>В наличии:</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                    {shopOffers.reduce((sum, o) => sum + o.quantity, 0)} шт.
                  </div>
                </div>
              </div>
            </div>

            {/* Parsing results details */}
            {(parseResult || parsingLogs[activeShop.id]) && (
              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--success)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
                  <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                  Результат последней загрузки прайса
                </h3>
                {(() => {
                  const log = parseResult || parsingLogs[activeShop.id];
                  return (
                    <div style={{ marginTop: '12px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>Имя файла: <strong>{log.filename}</strong></div>
                      <div>Время загрузки: <strong>{new Date(log.timestamp).toLocaleString()}</strong></div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginTop: '8px' }}>
                        <div style={{ background: 'var(--bg-space)', padding: '10px', borderRadius: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Строк обработано</span>
                          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{log.rowsCount}</div>
                        </div>
                        <div style={{ background: 'var(--bg-space)', padding: '10px', borderRadius: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Добавлено</span>
                          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>{log.addedOffers}</div>
                        </div>
                        <div style={{ background: 'var(--bg-space)', padding: '10px', borderRadius: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Обновлено</span>
                          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{log.updatedOffers || 0}</div>
                        </div>
                        <div style={{ background: 'var(--bg-space)', padding: '10px', borderRadius: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Новых карточек</span>
                          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{log.newPartsCreated}</div>
                        </div>
                      </div>

                      {log.errors && log.errors.length > 0 && (
                        <div style={{ marginTop: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)', fontWeight: 'bold', marginBottom: '6px' }}>
                            <AlertTriangle size={16} />
                            <span>Замечания/Ошибки при парсинге ({log.errors.length}):</span>
                          </div>
                          <div style={{ maxHeight: '120px', overflowY: 'auto', background: 'var(--bg-space)', padding: '10px', borderRadius: '4px', fontSize: '0.8rem' }}>
                            {log.errors.map((err, idx) => (
                              <div key={idx} className="error-text-line">{err}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* МОИ ТОВАРЫ */}
        {activeTab === 'products' && (
          <div>
            <h2>Мои товары ({shopOffers.length})</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
              Меняйте цену и наличие прямо здесь или удаляйте позиции. Новые добавляются во вкладке «Прайс-лист».
            </p>
            {shopOffers.length === 0 ? (
              <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Товаров пока нет. Добавьте их во вкладке «Прайс-лист».
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Товар</th>
                      <th style={{ textAlign: 'center' }}>Цена, сом.</th>
                      <th style={{ textAlign: 'center' }}>Наличие</th>
                      <th style={{ textAlign: 'right' }}>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopOffers.map(o => {
                      const part = parts.find(p => p.id === o.part_id);
                      const editing = editOfferId === o.id;
                      return (
                        <tr key={o.id}>
                          <td style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600 }}>{part?.name || o.raw_name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{part?.brand} · {part?.article || o.raw_article}</div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {editing
                              ? <input type="number" min="0" className="form-control" style={{ width: '110px', margin: '0 auto', padding: '6px' }} value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                              : <strong>{o.price}</strong>}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {editing
                              ? <input type="number" min="0" className="form-control" style={{ width: '90px', margin: '0 auto', padding: '6px' }} value={editQty} onChange={(e) => setEditQty(e.target.value)} />
                              : <span style={{ color: o.quantity > 0 ? 'var(--success)' : 'var(--error)' }}>{o.quantity} шт.</span>}
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            {editing ? (
                              <>
                                <button className="btn btn-success btn-sm" style={{ marginRight: '6px' }} onClick={() => saveOffer(o.id)}><Check size={14} /></button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setEditOfferId(null)}><X size={14} /></button>
                              </>
                            ) : (
                              <>
                                <button className="btn btn-secondary btn-sm" style={{ marginRight: '6px' }} title="Изменить" onClick={() => startEditOffer(o)}><Pencil size={14} /></button>
                                <button className="btn btn-danger btn-sm" title="Удалить" onClick={() => removeOffer(o.id)}><Trash2 size={14} /></button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h2>Управление заказами</h2>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Статус:</span>
                <select 
                  className="form-control" 
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem', height: 'auto' }}
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                >
                  <option value="all">Все</option>
                  <option value="new">Новые</option>
                  <option value="accepted">Приняты</option>
                  <option value="ready">Готовы к выдаче</option>
                  <option value="completed">Выданы (Завершены)</option>
                  <option value="cancelled">Отменены</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Заказов с выбранным статусом не обнаружено.
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrders.map(order => (
                  <div key={order.id} className="glass-panel order-card" style={{ borderLeft: `4px solid ${
                    order.status === 'new' ? 'var(--warning)' : 
                    order.status === 'accepted' ? 'var(--primary)' : 
                    order.status === 'ready' ? 'var(--accent)' : 
                    order.status === 'completed' ? 'var(--success)' : 'var(--error)'
                  }` }}>
                    <div className="order-header">
                      <div>
                        <strong>Заказ #{order.id}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
                          От: {new Date(order.created_at).toLocaleString()}
                        </span>
                      </div>
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
                    </div>

                    <div className="order-details-grid">
                      <div className="order-meta-info">
                        <div>Деталь: <strong style={{ color: 'var(--text-primary)' }}>{order.part_name}</strong></div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Артикул: {order.part_article} | Производитель: {order.part_brand}
                        </div>
                        
                        <div style={{ marginTop: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                          <div>Покупатель: <strong>{order.buyer_name}</strong></div>
                          <div>Телефон: <a href={`tel:${order.buyer_phone}`} style={{ color: 'var(--accent)' }}>{order.buyer_phone}</a></div>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <a className="btn btn-success btn-sm" style={{ gap: '5px' }}
                              href={`https://wa.me/${(order.buyer_phone || '').replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer">
                              <Phone size={13} /> WhatsApp
                            </a>
                            <a className="btn btn-secondary btn-sm" style={{ gap: '5px' }} href={`tel:${order.buyer_phone}`}>
                              <Phone size={13} /> Позвонить
                            </a>
                          </div>
                          {order.comment && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                              Комментарий: "{order.comment}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Стоимость:</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)' }}>
                            {order.price * order.quantity} сом.
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {order.price} сом. x {order.quantity} шт.
                          </div>
                        </div>

                        {/* Interactive Status updating buttons */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                          {order.status === 'new' && (
                            <>
                              <button 
                                className="btn btn-secondary btn-sm"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                Отклонить
                              </button>
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => updateOrderStatus(order.id, 'accepted')}
                              >
                                <Check size={14} />
                                Принять заказ
                              </button>
                            </>
                          )}
                          {order.status === 'accepted' && (
                            <button 
                              className="btn btn-accent btn-sm"
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                            >
                              Готов к выдаче
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                            >
                              Выдать покупателю
                            </button>
                          )}
                          {(order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'new') && (
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              style={{ padding: '6px' }}
                              title="Отменить заказ"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATISTICS TAB */}
        {activeTab === 'stats' && (
          <div>
            <h2>Статистика и аналитика магазина</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
              Анализ показов ваших деталей в поиске, переходов на карточку магазина и созданных заявок.
            </p>

            <div className="stats-row">
              <div className="glass-panel stat-card">
                <span className="stat-lbl">Товаров в базе</span>
                <div className="stat-val">{shopOffers.length}</div>
              </div>
              <div className="glass-panel stat-card">
                <span className="stat-lbl">Просмотров товаров</span>
                <div className="stat-val" style={{ color: 'var(--accent)' }}>{totalViews}</div>
              </div>
              <div className="glass-panel stat-card">
                <span className="stat-lbl">Всего лидов (заявок)</span>
                <div className="stat-val">{totalOrdersCount}</div>
              </div>
              <div className="glass-panel stat-card">
                <span className="stat-lbl">Выручка (сом.)</span>
                <div className="stat-val" style={{ color: 'var(--success)' }}>{totalRevenue}</div>
              </div>
              <div className="glass-panel stat-card">
                <span className="stat-lbl">Конверсия (заказ/просмотр)</span>
                <div className="stat-val" style={{ color: 'var(--primary)' }}>
                  {totalViews > 0 ? `${Math.round((totalOrdersCount / totalViews) * 100)}%` : '—'}
                </div>
              </div>
            </div>

            {/* Реальная таблица просмотров по товарам */}
            <div className="glass-panel" style={{ padding: '22px', marginBottom: '24px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '14px' }}>
                <Eye size={18} style={{ color: 'var(--accent)' }} /> Просмотры ваших товаров
              </h3>
              {viewsTable.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Пока нет товаров. Добавьте их во вкладке «Прайс-лист».</p>
              ) : totalViews === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Просмотров пока нет. Они появятся, когда покупатели начнут открывать карточки ваших деталей.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Товар</th>
                        <th style={{ textAlign: 'center' }}>Просмотры</th>
                        <th style={{ textAlign: 'center' }}>В наличии</th>
                        <th style={{ textAlign: 'right' }}>Цена</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewsTable.filter(r => r.views > 0).map(r => (
                        <tr key={r.offerId}>
                          <td style={{ textAlign: 'left' }}>{r.name}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>{r.views}</td>
                          <td style={{ textAlign: 'center' }}>{r.qty} шт.</td>
                          <td style={{ textAlign: 'right' }}>{r.price} сом.</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Performance charts mockup */}
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Активность за неделю (Показы в поиске / Переходы)</h3>
              
              <div className="chart-placeholder">
                <div className="chart-bar-container">
                  <div className="chart-bar" style={{ height: '40%', background: 'var(--border-light)' }}></div>
                  <div className="chart-bar" style={{ height: '15%', background: 'var(--accent)', marginTop: '4px' }}></div>
                  <span className="chart-label">Пн</span>
                </div>
                <div className="chart-bar-container">
                  <div className="chart-bar" style={{ height: '60%', background: 'var(--border-light)' }}></div>
                  <div className="chart-bar" style={{ height: '22%', background: 'var(--accent)', marginTop: '4px' }}></div>
                  <span className="chart-label">Вт</span>
                </div>
                <div className="chart-bar-container">
                  <div className="chart-bar" style={{ height: '85%', background: 'var(--border-light)' }}></div>
                  <div className="chart-bar" style={{ height: '35%', background: 'var(--accent)', marginTop: '4px' }}></div>
                  <span className="chart-label">Ср</span>
                </div>
                <div className="chart-bar-container">
                  <div className="chart-bar" style={{ height: '55%', background: 'var(--border-light)' }}></div>
                  <div className="chart-bar" style={{ height: '20%', background: 'var(--accent)', marginTop: '4px' }}></div>
                  <span className="chart-label">Чт</span>
                </div>
                <div className="chart-bar-container">
                  <div className="chart-bar" style={{ height: '70%', background: 'var(--border-light)' }}></div>
                  <div className="chart-bar" style={{ height: '28%', background: 'var(--accent)', marginTop: '4px' }}></div>
                  <span className="chart-label">Пт</span>
                </div>
                <div className="chart-bar-container">
                  <div className="chart-bar" style={{ height: '95%', background: 'var(--border-light)' }}></div>
                  <div className="chart-bar" style={{ height: '45%', background: 'var(--accent)', marginTop: '4px' }}></div>
                  <span className="chart-label">Сб</span>
                </div>
                <div className="chart-bar-container">
                  <div className="chart-bar" style={{ height: '30%', background: 'var(--border-light)' }}></div>
                  <div className="chart-bar" style={{ height: '10%', background: 'var(--accent)', marginTop: '4px' }}></div>
                  <span className="chart-label">Вс</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'var(--border-light)', display: 'inline-block', borderRadius: '2px' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Просмотры карточек (Всего: {totalViews})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'var(--accent)', display: 'inline-block', borderRadius: '2px' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Заявки/заказы (Всего: {totalOrdersCount})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* БУХГАЛТЕРИЯ */}
        {activeTab === 'finance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
              <h2>Бухгалтерия магазина</h2>
              <button className="btn btn-secondary btn-sm" onClick={downloadBookkeeping} style={{ gap: '6px' }}>
                <FileText size={16} /> Скачать отчёт CSV
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
              Учёт продаж и выручки по вашим заказам. «Реализовано» — по выданным заказам, «Ожидается» — по заказам в работе.
            </p>

            <div className="stats-row">
              <div className="glass-panel stat-card">
                <span className="stat-lbl">Выручка реализованная (сом.)</span>
                <div className="stat-val" style={{ color: 'var(--success)' }}>{realizedRevenue.toLocaleString('ru-RU')}</div>
              </div>
              <div className="glass-panel stat-card">
                <span className="stat-lbl">Ожидается (в работе, сом.)</span>
                <div className="stat-val" style={{ color: 'var(--warning)' }}>{pendingRevenue.toLocaleString('ru-RU')}</div>
              </div>
              <div className="glass-panel stat-card">
                <span className="stat-lbl">Продано (штук)</span>
                <div className="stat-val">{unitsSold}</div>
              </div>
              <div className="glass-panel stat-card">
                <span className="stat-lbl">Средний чек (сом.)</span>
                <div className="stat-val" style={{ color: 'var(--accent)' }}>{avgCheck.toLocaleString('ru-RU')}</div>
              </div>
            </div>

            {/* Заказы по статусам */}
            <div className="glass-panel" style={{ padding: '22px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Заказы по статусам</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                <div className="finance-pill"><span>Новые</span><strong style={{ color: 'var(--warning)' }}>{statusCounts.new}</strong></div>
                <div className="finance-pill"><span>Приняты</span><strong style={{ color: 'var(--primary)' }}>{statusCounts.accepted}</strong></div>
                <div className="finance-pill"><span>Готовы</span><strong style={{ color: 'var(--accent)' }}>{statusCounts.ready}</strong></div>
                <div className="finance-pill"><span>Выданы</span><strong style={{ color: 'var(--success)' }}>{statusCounts.completed}</strong></div>
                <div className="finance-pill"><span>Отменены</span><strong style={{ color: 'var(--error)' }}>{statusCounts.cancelled}</strong></div>
              </div>
            </div>

            {/* Топ товаров по выручке */}
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '14px' }}>
                <BarChart2 size={18} style={{ color: 'var(--success)' }} /> Топ товаров по выручке
              </h3>
              {topProducts.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Пока нет выданных заказов — выручки нет. Данные появятся после первых продаж.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Товар</th>
                        <th style={{ textAlign: 'center' }}>Продано, шт.</th>
                        <th style={{ textAlign: 'right' }}>Выручка, сом.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((p, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'left' }}>{p.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({p.article})</span></td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>{p.units}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>{p.revenue.toLocaleString('ru-RU')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
