import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { onImgError } from '../lib/placeholder';
import ParticleField from './motion/ParticleField';
import TiltCard from './motion/TiltCard';
import PageTransition from './motion/PageTransition';
import SceneReveal from './motion/SceneReveal';
import {
  Search, Car, Phone, MapPin, Clock,
  SlidersHorizontal, ArrowLeftRight, Check, X, ShoppingBag,
  ArrowLeft, Globe, Info, ShoppingCart, Sparkles, TrendingUp,
  ShieldCheck, Truck, Tag, Layers, Star, ChevronRight, ChevronDown, Package, Plus,
  Cpu, Disc, Activity, Compass, Shuffle, Filter, Lightbulb,
  Thermometer, Wind, Layout, Fuel, Flame, Droplets, Share2, User
} from 'lucide-react';
import { registerBack, haptic, shareContent, hideKeyboard } from '../lib/native';

const CATEGORY_ICONS = {
  'cat-engine': Cpu, 'cat-brakes': Disc, 'cat-suspension': Activity, 'cat-steering': Compass,
  'cat-transmission': Shuffle, 'cat-filters': Filter, 'cat-electrical': Lightbulb,
  'cat-cooling-heating': Thermometer, 'cat-exhaust': Wind, 'cat-body': Layout,
  'cat-fuel-system': Fuel, 'cat-ignition': Flame, 'cat-maintenance': Droplets
};

const TRENDING = ['OC90', 'SP1399', 'Bosch', 'Shell', 'NGK', 'Mann'];

const formatPrice = (n) => new Intl.NumberFormat('ru-RU').format(n);

export default function BuyerDashboard() {
  const {
    shops, parts, offers, categories, vehicles,
    searchParts, getPartDetails, createOrder,
    t, garage, addToGarage, removeFromGarage,
    orders, buyerUser, cart, addToCart, removeFromCart, setCartQty, clearCart, createOrdersFromCart,
    recordPartView, updateBuyerProfile
  } = useContext(AppContext);

  const [currentView, setCurrentView] = useState('home');
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [selectedShopId, setSelectedShopId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('text'); // 'text' | 'vin'
  const [vin, setVin] = useState('');
  const [vinContext, setVinContext] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapRef = useRef(null);

  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedShops, setSelectedShops] = useState([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  const [filtersOpen, setFiltersOpen] = useState(false); // мобильный аккордеон фильтров

  const [orderOffer, setOrderOffer] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [orderComment, setOrderComment] = useState('');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState(null);
  const [lastOrder, setLastOrder] = useState(null); // для отправки заказа магазину
  const [toast, setToast] = useState('');

  // Оформление корзины
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutComment, setCheckoutComment] = useState('');
  const [placedOrders, setPlacedOrders] = useState(null); // заказы после оформления (для отправки магазинам)

  // Профиль покупателя (редактирование на экране «Мои заказы»)
  const [editingProfile, setEditingProfile] = useState(false);
  const [profName, setProfName] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const startEditProfile = () => { setProfName(buyerUser?.name || ''); setProfPhone(buyerUser?.phone || ''); setEditingProfile(true); };
  const saveProfile = (e) => { e.preventDefault(); updateBuyerProfile({ name: profName.trim() || buyerUser?.name, phone: profPhone.trim() }); setEditingProfile(false); showToast(t('buyer.saved')); };

  const cartCount = cart.reduce((n, c) => n + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const myOrders = useMemo(
    () => (buyerUser ? orders.filter(o => o.buyer_email && o.buyer_email === buyerUser.email) : []),
    [orders, buyerUser]
  );

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };
  const handleAddToCart = (offer, part) => { haptic('light'); addToCart(offer, part); showToast(t('cart.added')); };

  const handleShare = async (title, text) => {
    haptic('light');
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const res = await shareContent({ title, text, url });
    if (res === 'copied') {
      setToast(t('share.copied'));
      setTimeout(() => setToast(''), 2200);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Аппаратная кнопка «Назад» (Android): вглубь экранов → наружу.
  // На главном экране возвращаем false — система свернёт/закроет приложение.
  useEffect(() => {
    return registerBack(() => {
      if (orderOffer) { setOrderOffer(null); return true; }
      if (currentView === 'detail') { setCurrentView('results'); return true; }
      if (currentView === 'results' || currentView === 'shop' || currentView === 'cart' || currentView === 'orders') { setCurrentView('home'); return true; }
      return false;
    }, 0);
  }, [currentView, orderOffer]);

  const makes = useMemo(() => [...new Set(vehicles.map(v => v.make))], [vehicles]);
  const models = useMemo(() => selectedMake ? [...new Set(vehicles.filter(v => v.make === selectedMake).map(v => v.model))] : [], [vehicles, selectedMake]);
  const years = useMemo(() => (selectedMake && selectedModel) ? [...new Set(vehicles.filter(v => v.make === selectedMake && v.model === selectedModel).map(v => v.year))].sort((a, b) => b - a) : [], [vehicles, selectedMake, selectedModel]);
  const engines = useMemo(() => (selectedMake && selectedModel && selectedYear) ? [...new Set(vehicles.filter(v => v.make === selectedMake && v.model === selectedModel && v.year === parseInt(selectedYear)).map(v => v.engine))] : [], [vehicles, selectedMake, selectedModel, selectedYear]);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    const norm = q.replace(/[^a-z0-9]/gi, '');
    return parts.filter(p => {
      const inName = p.name.toLowerCase().includes(q);
      const inArt = norm && p.article.toLowerCase().replace(/[^a-z0-9]/gi, '').includes(norm);
      const inBrand = p.brand.toLowerCase().includes(q);
      const inCross = norm && p.cross_numbers.some(c => c.toLowerCase().replace(/[^a-z0-9]/gi, '').includes(norm));
      return inName || inArt || inBrand || inCross;
    }).slice(0, 6);
  }, [searchQuery, parts]);

  const goResults = () => {
    haptic('light');
    hideKeyboard();
    setShowSuggestions(false);
    setCurrentView('results');
    setSelectedBrands([]); setSelectedShops([]); setPriceMin(''); setPriceMax('');
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setVinContext('');
    goResults();
  };

  const handleVinSubmit = (e) => {
    if (e) e.preventDefault();
    if (!vin.trim()) return;
    setVinContext(vin.trim().toUpperCase());
    setSearchQuery('');
    setSelectedCategory('');
    goResults();
  };

  const openCatalog = () => { setSearchQuery(''); setSelectedCategory(''); setVinContext(''); setShowSuggestions(false); setCurrentView('results'); };
  const handleCategoryClick = (catId) => { haptic('light'); setSelectedCategory(catId); setSearchQuery(''); setVinContext(''); setShowSuggestions(false); setCurrentView('results'); };
  const goToPart = (partId) => { haptic('light'); recordPartView(partId); setSelectedPartId(partId); setOrderSuccessMsg(null); setShowSuggestions(false); setCurrentView('detail'); };

  const applyGarageCar = (v) => {
    setSelectedMake(v.make); setSelectedModel(v.model); setSelectedYear(String(v.year)); setSelectedEngine(v.engine || '');
    setSearchQuery(''); setSelectedCategory(''); setVinContext('');
    setCurrentView('results');
    setSelectedBrands([]); setSelectedShops([]); setPriceMin(''); setPriceMax('');
  };

  const rawSearchResults = useMemo(() => {
    return searchParts(searchQuery, selectedMake, selectedModel, selectedYear ? parseInt(selectedYear) : null);
  }, [searchQuery, selectedMake, selectedModel, selectedYear, parts, offers, shops]);

  const searchResultBrands = useMemo(() => [...new Set(rawSearchResults.map(p => p.brand))], [rawSearchResults]);
  const searchResultShops = useMemo(() => {
    const ids = new Set();
    rawSearchResults.forEach(p => p.all_offers.forEach(o => ids.add(o.shop_id)));
    return shops.filter(s => ids.has(s.id));
  }, [rawSearchResults, shops]);
  const resultCategories = useMemo(() => {
    const ids = new Set(rawSearchResults.map(p => p.category_id));
    return categories.filter(c => ids.has(c.id));
  }, [rawSearchResults, categories]);

  const filteredSearchResults = useMemo(() => {
    let result = [...rawSearchResults];
    if (selectedCategory) result = result.filter(p => p.category_id === selectedCategory);
    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand));
    if (priceMin) result = result.filter(p => p.min_price !== null && p.min_price >= parseFloat(priceMin));
    if (priceMax) result = result.filter(p => p.min_price !== null && p.min_price <= parseFloat(priceMax));
    if (selectedShops.length > 0) result = result.filter(p => p.all_offers.some(o => selectedShops.includes(o.shop_id)));
    if (onlyInStock) result = result.filter(p => p.total_quantity > 0);
    result.sort((a, b) => {
      const pa = a.min_price ?? Infinity, pb = b.min_price ?? Infinity;
      if (sortBy === 'price_asc') return pa - pb;
      if (sortBy === 'price_desc') return pb - pa;
      if (sortBy === 'offers') return b.offers_count - a.offers_count;
      return 0;
    });
    return result;
  }, [rawSearchResults, selectedCategory, selectedBrands, priceMin, priceMax, selectedShops, onlyInStock, sortBy]);

  const popularParts = useMemo(() => {
    return searchParts('', '', '', null).filter(p => p.min_price !== null).sort((a, b) => b.offers_count - a.offers_count).slice(0, 4);
  }, [parts, offers, shops]);

  const partDetails = useMemo(() => (currentView === 'detail' && selectedPartId) ? getPartDetails(selectedPartId) : null, [currentView, selectedPartId, parts, offers, shops]);

  const shopData = useMemo(() => {
    if (currentView === 'shop' && selectedShopId) {
      const shop = shops.find(s => s.id === selectedShopId);
      if (!shop) return null;
      const shopOffers = offers.filter(o => o.shop_id === selectedShopId && o.is_available && o.quantity > 0).map(o => {
        const part = parts.find(p => p.id === o.part_id);
        return { ...o, part_name: part ? part.name : o.raw_name, part_brand: part ? part.brand : '', part_article: part ? part.article : o.raw_article, image_url: part ? part.image_url : null };
      });
      return { ...shop, offers: shopOffers };
    }
    return null;
  }, [currentView, selectedShopId, shops, offers, parts]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!orderOffer || !buyerName || !buyerPhone) return;
    const res = createOrder(orderOffer.id, buyerName, buyerPhone, orderQty, orderComment, buyerUser?.email || null);
    if (res.success) {
      haptic('medium');
      setOrderSuccessMsg(res.order.id);
      setLastOrder(res.order);
      setBuyerName(''); setBuyerPhone(''); setOrderQty(1); setOrderComment('');
    } else alert(`Ошибка: ${res.message}`);
  };

  // Доставка заказа магазину без бэкенда: открываем WhatsApp/Telegram
  // магазина с уже заполненным текстом заказа.
  const buildOrderText = (order) => {
    const shop = shops.find(s => s.id === order.shop_id);
    return [
      `🔧 ${t('ord.waHeader')} PARTSEEKER`,
      '',
      `${t('ord.selected')}: ${order.part_name} (${order.part_brand})`,
      `${t('det.article')}: ${order.part_article}`,
      `${t('ord.qty')}: ${order.quantity}`,
      `${t('det.price')}: ${formatPrice(order.price)} сом.`,
      '',
      `${t('ord.name')}: ${order.buyer_name}`,
      `${t('ord.phone')}: ${order.buyer_phone}`,
      order.comment ? `${t('ord.comment')}: ${order.comment}` : '',
      '',
      `${t('ord.num')}: ${order.id}`,
    ].filter(Boolean).join('\n') + (shop ? '' : '');
  };

  const sendOrderToShop = (channel) => {
    if (!lastOrder) return;
    haptic('light');
    const shop = shops.find(s => s.id === lastOrder.shop_id);
    const phone = (shop?.phone || '').replace(/[^\d]/g, '');
    const text = buildOrderText(lastOrder);
    const url = channel === 'tg'
      ? `https://t.me/+${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    if (!phone) { setToast(t('ord.noPhone')); return; }
    window.open(url, '_blank', 'noopener');
  };

  const openCart = () => {
    haptic('light'); setPlacedOrders(null);
    if (!checkoutName && buyerUser?.name) setCheckoutName(buyerUser.name);
    if (!checkoutPhone && buyerUser?.phone) setCheckoutPhone(buyerUser.phone);
    setCurrentView('cart');
  };

  // Оформление корзины: создаём заказы (по позиции) и переходим к отправке магазинам.
  const placeCartOrder = (e) => {
    e.preventDefault();
    if (!cart.length || !checkoutName || !checkoutPhone) return;
    const items = cart.map(c => ({ offerId: c.offerId, quantity: c.qty }));
    const res = createOrdersFromCart(items, checkoutName, checkoutPhone, checkoutComment, buyerUser?.email || null);
    if (res.success) {
      haptic('medium');
      setPlacedOrders(res.orders);
      clearCart();
      setCheckoutComment('');
    }
  };

  // Группировка заказов по магазину (для блоков отправки после оформления).
  const groupByShop = (list) => {
    const map = {};
    list.forEach(o => { (map[o.shop_id] = map[o.shop_id] || []).push(o); });
    return Object.entries(map); // [[shopId, orders[]], ...]
  };

  const buildShopOrderText = (shopOrders) => {
    const first = shopOrders[0];
    return [
      `🔧 ${t('ord.waHeader')} PARTSEEKER`, '',
      ...shopOrders.map(o => `• ${o.part_name} (${o.part_brand}) ×${o.quantity} — ${formatPrice(o.price * o.quantity)} сом.`),
      '',
      `${t('cart.total')}: ${formatPrice(shopOrders.reduce((s, o) => s + o.price * o.quantity, 0))} сом.`,
      '',
      `${t('ord.name')}: ${first.buyer_name}`,
      `${t('ord.phone')}: ${first.buyer_phone}`,
      first.comment ? `${t('ord.comment')}: ${first.comment}` : '',
    ].filter(Boolean).join('\n');
  };

  const sendShopOrders = (shopId, shopOrders, channel) => {
    haptic('light');
    const shop = shops.find(s => s.id === shopId);
    const phone = (shop?.phone || '').replace(/[^\d]/g, '');
    if (!phone) { showToast(t('ord.noPhone')); return; }
    const text = buildShopOrderText(shopOrders);
    const url = channel === 'tg'
      ? `https://t.me/+${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  };

  // Повтор заказа: возвращаем позицию в корзину (если оффер ещё существует).
  const repeatOrder = (order) => {
    const offer = offers.find(o => o.id === order.offer_id);
    if (!offer) return; // оффер больше не существует
    const part = parts.find(p => p.id === offer.part_id);
    addToCart(offer, part, order.quantity);
    showToast(t('cart.added'));
    openCart();
  };

  const orderStatusLabel = (s) => t(`cart.st.${s}`) || s;

  const handleBrandFilterToggle = (b) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const handleShopFilterToggle = (id) => setSelectedShops(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const clearCarFilter = () => { setSelectedMake(''); setSelectedModel(''); setSelectedYear(''); setSelectedEngine(''); };
  const resetAllFilters = () => { setSelectedBrands([]); setSelectedShops([]); setPriceMin(''); setPriceMax(''); setOnlyInStock(false); setSelectedCategory(''); };

  const offerWord = (n) => n === 1 ? t('res.offer1') : (n < 5 ? t('res.offer2') : t('res.offer5'));
  const activeCategoryName = selectedCategory ? t('cat.' + selectedCategory) : '';
  const carLabel = [selectedMake, selectedModel, selectedYear].filter(Boolean).join(' ');
  const canSaveCar = selectedMake && selectedModel && selectedYear;

  const PartThumb = ({ src, size = 28 }) => (
    <div className="part-img-placeholder">{src ? <img src={src} alt="" loading="lazy" onError={onImgError} /> : <Package size={size} />}</div>
  );
  const Thumb = ({ src, box = 48 }) => (
    <div className="part-img-placeholder" style={{ width: box, height: box, flexShrink: 0 }}>
      {src ? <img src={src} alt="" loading="lazy" onError={onImgError} /> : <Package size={Math.round(box * 0.4)} />}
    </div>
  );
  const orderImg = orderOffer ? (parts.find(p => p.id === orderOffer.part_id)?.image_url || orderOffer.image_url) : null;

  return (
    <div className="fade-in">
      {/* Панель покупателя: «Мои заказы» + корзина (видна на всех экранах) */}
      <div className="buyer-toolbar">
        <button className={`buyer-tool-btn ${currentView === 'orders' ? 'is-active' : ''}`}
          onClick={() => { haptic('light'); setCurrentView('orders'); }}>
          <ShoppingBag size={16} /> <span className="hide-mobile">{t('cart.myOrders')}</span>
          {myOrders.length > 0 && <span className="buyer-tool-count">{myOrders.length}</span>}
        </button>
        <button className={`buyer-tool-btn ${currentView === 'cart' ? 'is-active' : ''}`} onClick={openCart}>
          <ShoppingCart size={16} /> <span className="hide-mobile">{t('cart.title')}</span>
          {cartCount > 0 && <span className="buyer-tool-count accent">{cartCount}</span>}
        </button>
      </div>

      {currentView !== 'home' && (
        <div className="glass-panel" style={{ padding: '12px 18px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => {
              if (currentView === 'detail') setCurrentView('results');
              else setCurrentView('home');
            }}>
              <ArrowLeft size={16} /> {t('common.back')}
            </button>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              {currentView === 'results' && t('common.results')}
              {currentView === 'detail' && t('common.detail')}
              {currentView === 'shop' && t('common.shopProfile')}
            </span>
          </div>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1', maxWidth: '520px' }}>
            <input type="text" className="form-control" style={{ padding: '9px 16px' }} placeholder={t('search.placeholderText')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit" className="btn btn-primary btn-sm"><Search size={16} /></button>
          </form>
        </div>
      )}

      <AnimatePresence mode="wait">
        <PageTransition key={currentView}>
          <SceneReveal>

      {/* HOME */}
      {currentView === 'home' && (
        <div>
          <div className="search-hero">
            <ParticleField />
            <span className="hero-eyebrow" data-reveal="scale"><Sparkles size={14} /> {t('hero.eyebrow', { parts: parts.length, shops: shops.filter(s => s.status === 'active').length })}</span>
            <h1 className="search-hero-title" data-reveal="up">{t('hero.title')}</h1>
            <p className="search-hero-subtitle" data-reveal="up">{t('hero.subtitle')}</p>

            <div className="search-modes" data-reveal="up">
              <span className={`search-mode ${searchMode === 'text' ? 'active' : ''}`} onClick={() => setSearchMode('text')}>{t('search.byText')}</span>
              <span className={`search-mode ${searchMode === 'vin' ? 'active' : ''}`} onClick={() => setSearchMode('vin')}>{t('search.byVin')}</span>
            </div>

            <div className="search-box-wrapper" data-reveal="up" ref={searchWrapRef}>
              {searchMode === 'text' ? (
                <form onSubmit={handleSearchSubmit}>
                  <div className="search-box-container">
                    <Search size={22} className="search-input-icon" />
                    <input type="text" className="search-input" placeholder={t('search.placeholderText')} value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)} />
                    <button type="submit" className="btn btn-accent search-btn">{t('search.find')}</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVinSubmit}>
                  <div className="search-box-container">
                    <Car size={22} className="search-input-icon" />
                    <input type="text" className="search-input" maxLength={17} placeholder={t('search.placeholderVin')} value={vin}
                      onChange={(e) => setVin(e.target.value.toUpperCase())} />
                    <button type="submit" className="btn btn-accent search-btn">{t('search.find')}</button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>{t('vin.hint')}</p>
                </form>
              )}

              {searchMode === 'text' && showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-panel">
                  {suggestions.map(s => {
                    const Icon = CATEGORY_ICONS[s.category_id] || Package;
                    return (
                      <div key={s.id} className="suggestion-item" onClick={() => goToPart(s.id)}>
                        <div className="suggestion-icon"><Icon size={18} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.brand} · {s.article}</div>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {searchMode === 'text' && (
              <div className="chips-row" style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginRight: '4px' }}><TrendingUp size={13} style={{ verticalAlign: '-2px' }} /> {t('search.popular')}</span>
                {TRENDING.map(x => <span key={x} className="chip" onClick={() => { setSearchQuery(x); handleSearchSubmit(); }}>{x}</span>)}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="features-row">
            {[
              { icon: Tag, t: 'feat.prices.t', d: 'feat.prices.d' },
              { icon: ArrowLeftRight, t: 'feat.cross.t', d: 'feat.cross.d' },
              { icon: ShieldCheck, t: 'feat.verified.t', d: 'feat.verified.d' },
              { icon: Truck, t: 'feat.stock.t', d: 'feat.stock.d' }
            ].map((f, i) => (
              <div key={i} data-reveal="up">
                <TiltCard className="glass-panel glass-panel-hover feature-card" max={10} lift={10}>
                  <div className="feature-icon"><f.icon size={22} /></div>
                  <div><h4>{t(f.t)}</h4><p>{t(f.d)}</p></div>
                </TiltCard>
              </div>
            ))}
          </div>

          {/* Car selector + garage */}
          <div className="glass-panel selector-card" data-reveal="up">
            <div className="section-title-bar">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <Car size={22} style={{ color: 'var(--primary)' }} /> {t('car.title')}
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={openCatalog}><Layers size={15} /> {t('car.catalog')}</button>
            </div>

            <div className="selector-grid">
              <select className="form-control" value={selectedMake} onChange={(e) => { setSelectedMake(e.target.value); setSelectedModel(''); setSelectedYear(''); setSelectedEngine(''); }}>
                <option value="">{t('car.make')}</option>
                {makes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select className="form-control" value={selectedModel} disabled={!selectedMake} onChange={(e) => { setSelectedModel(e.target.value); setSelectedYear(''); setSelectedEngine(''); }}>
                <option value="">{t('car.model')}</option>
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select className="form-control" value={selectedYear} disabled={!selectedModel} onChange={(e) => { setSelectedYear(e.target.value); setSelectedEngine(''); }}>
                <option value="">{t('car.year')}</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select className="form-control" value={selectedEngine} disabled={!selectedYear} onChange={(e) => setSelectedEngine(e.target.value)}>
                <option value="">{t('car.engine')}</option>
                {engines.map(en => <option key={en} value={en}>{en}</option>)}
              </select>
            </div>

            <div style={{ marginTop: '18px', display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {(selectedMake || selectedModel) && <button className="btn btn-secondary btn-sm" onClick={clearCarFilter}>{t('car.clear')}</button>}
              {canSaveCar && (
                <button className="btn btn-secondary btn-sm" onClick={() => addToGarage({ make: selectedMake, model: selectedModel, year: parseInt(selectedYear), engine: selectedEngine })}>
                  <Plus size={15} /> {t('car.toGarage')}
                </button>
              )}
              <button className="btn btn-primary" onClick={() => handleSearchSubmit()} disabled={!selectedMake}>{t('car.pick')} <ChevronRight size={16} /></button>
            </div>

            {/* Garage */}
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.95rem' }}>
                <Star size={16} style={{ color: 'var(--warning)' }} /> {t('garage.title')}
              </div>
              {garage.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>{t('garage.empty')}</p>
              ) : (
                <div className="garage-row">
                  {garage.map(v => (
                    <div key={v.id} className="garage-chip" onClick={() => applyGarageCar(v)}>
                      <Car size={15} style={{ color: 'var(--accent)' }} />
                      {v.make} {v.model} {v.year}
                      <span className="gx" title={t('garage.remove')} onClick={(e) => { e.stopPropagation(); removeFromGarage(v.id); }}><X size={14} /></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div style={{ marginBottom: '44px' }}>
            <h3 className="section-title" data-reveal="left"><Layers size={22} style={{ color: 'var(--accent)' }} /> {t('sec.categories')}</h3>
            <div className="categories-grid">
              {categories.map(cat => {
                const Icon = CATEGORY_ICONS[cat.id] || ShoppingBag;
                return (
                  <div key={cat.id} data-reveal="scale">
                    <TiltCard className="category-card" max={16} lift={12} onClick={() => handleCategoryClick(cat.id)}>
                      <div className="category-icon"><Icon size={26} /></div>
                      <span className="category-name">{t('cat.' + cat.id)}</span>
                    </TiltCard>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular */}
          {popularParts.length > 0 && (
            <div style={{ marginBottom: '44px' }}>
              <h3 className="section-title" data-reveal="left"><Star size={22} style={{ color: 'var(--warning)' }} /> {t('sec.popular')}</h3>
              <div className="results-grid">
                {popularParts.map(part => (
                  <div key={part.id} data-reveal="up">
                    <TiltCard className="glass-panel glass-panel-hover part-card" max={11}>
                      <div className="part-info">
                        <PartThumb src={part.image_url} />
                        <div className="part-details-text">
                          <span className="badge badge-secondary" style={{ marginBottom: '6px' }}>{part.brand}</span>
                          <h3>{part.name}</h3>
                          <div className="part-meta">{t('det.article')}: <span>{part.article}</span></div>
                        </div>
                      </div>
                      <div className="part-pricing">
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('res.pricesFrom')}</div>
                        <div className="offer-price">{formatPrice(part.min_price)} сом.</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>{part.offers_count} {offerWord(part.offers_count)}</div>
                        <button className="btn btn-primary btn-sm" onClick={() => goToPart(part.id)}>{t('det.watch')}</button>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shops */}
          <div>
            <h3 className="section-title" data-reveal="left"><Globe size={22} style={{ color: 'var(--primary)' }} /> {t('sec.shops')}</h3>
            <div className="shops-row-scroll">
              {shops.filter(s => s.status === 'active').map(shop => (
                <div key={shop.id} data-reveal="right" className="shop-snippet-wrap">
                  <TiltCard className="glass-panel glass-panel-hover shop-snippet-card" max={10} onClick={() => { setSelectedShopId(shop.id); setCurrentView('shop'); }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
                      <img src={shop.logo_url} alt={shop.name} style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontSize: '1.05rem' }}>{shop.name}</h4>
                        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}><Star size={10} /> {shop.id === 'shop-1' ? '4.8' : '4.5'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} style={{ color: 'var(--accent)' }} /> {shop.address}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} style={{ color: 'var(--accent)' }} /> {shop.phone}</span>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {currentView === 'results' && (
        <div className="results-layout">
          <div className={`glass-panel filters-panel ${filtersOpen ? 'is-open' : ''}`} data-reveal="left">
            <h3 className="filters-head" style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => { haptic('light'); setFiltersOpen(o => !o); }}>
              <SlidersHorizontal size={18} /> {t('res.filters')}
              <ChevronDown className="filters-toggle-icon" size={18} />
            </h3>

            <div className="filters-body">
            {resultCategories.length > 1 && (
              <div className="filter-section">
                <div className="filter-title">{t('res.category')}</div>
                <label className="checkbox-label"><input type="radio" name="cat" checked={!selectedCategory} onChange={() => setSelectedCategory('')} /> {t('res.allCategories')}</label>
                {resultCategories.map(c => (
                  <label key={c.id} className="checkbox-label"><input type="radio" name="cat" checked={selectedCategory === c.id} onChange={() => setSelectedCategory(c.id)} /> {t('cat.' + c.id)}</label>
                ))}
              </div>
            )}

            <div className="filter-section">
              <div className="filter-title">{t('res.price')}</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="number" className="form-control" placeholder={t('res.from')} style={{ padding: '9px' }} value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                <span style={{ color: 'var(--text-muted)' }}>—</span>
                <input type="number" className="form-control" placeholder={t('res.to')} style={{ padding: '9px' }} value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
              </div>
            </div>

            {searchResultBrands.length > 0 && (
              <div className="filter-section">
                <div className="filter-title">{t('res.brand')}</div>
                {searchResultBrands.map(b => <label key={b} className="checkbox-label"><input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => handleBrandFilterToggle(b)} /> {b}</label>)}
              </div>
            )}

            {searchResultShops.length > 0 && (
              <div className="filter-section">
                <div className="filter-title">{t('res.shop')}</div>
                {searchResultShops.map(s => <label key={s.id} className="checkbox-label"><input type="checkbox" checked={selectedShops.includes(s.id)} onChange={() => handleShopFilterToggle(s.id)} /> {s.name}</label>)}
              </div>
            )}

            <div className="filter-section">
              <label className="checkbox-label"><input type="checkbox" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} /> {t('res.inStock')}</label>
            </div>

            {(selectedBrands.length > 0 || selectedShops.length > 0 || priceMin || priceMax || onlyInStock || selectedCategory) && (
              <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={resetAllFilters}>{t('res.reset')}</button>
            )}
            </div>
          </div>

          <div>
            <div className="results-header">
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {searchQuery && <span>{t('res.byQuery')} «<strong style={{ color: 'var(--text-primary)' }}>{searchQuery}</strong>» · </span>}
                {activeCategoryName && !searchQuery && <span>{t('res.byCategory')} «<strong style={{ color: 'var(--text-primary)' }}>{activeCategoryName}</strong>» · </span>}
                {vinContext && <span style={{ color: 'var(--accent)' }}>VIN {vinContext} · </span>}
                {carLabel && <span style={{ color: 'var(--accent)' }}>{carLabel} · </span>}
                {t('res.found')}: <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{filteredSearchResults.length}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('res.sort')}:</span>
                <select className="form-control" style={{ width: 'auto', padding: '7px 10px', fontSize: '0.85rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="price_asc">{t('res.cheap')}</option>
                  <option value="price_desc">{t('res.expensive')}</option>
                  <option value="offers">{t('res.offers')}</option>
                </select>
              </div>
            </div>

            {filteredSearchResults.length === 0 ? (
              <div className="glass-panel empty-state">
                <div className="empty-state-icon"><Info size={36} /></div>
                <h3>{t('res.notFoundT')}</h3>
                <p style={{ marginTop: '8px' }}>{t('res.notFoundD')}</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '18px' }} onClick={() => { resetAllFilters(); setSearchQuery(''); setVinContext(''); }}>{t('res.showCatalog')}</button>
              </div>
            ) : (
              <div className="results-grid">
                {filteredSearchResults.map(part => (
                  <div key={part.id} data-reveal="up">
                    <TiltCard className="glass-panel glass-panel-hover part-card" max={9} lift={10}>
                      <div className="part-info">
                        <PartThumb src={part.image_url} />
                        <div className="part-details-text">
                          <span className="badge badge-secondary" style={{ marginBottom: '6px' }}>{part.brand}</span>
                          <h3>{part.name}</h3>
                          <div className="part-meta">{t('det.article')}: <span>{part.article}</span>{!part.is_verified && <span style={{ color: 'var(--warning)' }}>⚠️</span>}</div>
                        </div>
                      </div>
                      <div className="part-pricing">
                        {part.min_price !== null ? (
                          <>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('res.pricesFrom')}</div>
                            <div className="offer-price">{formatPrice(part.min_price)} сом.</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>{part.offers_count} {offerWord(part.offers_count)}</div>
                          </>
                        ) : (
                          <div style={{ color: 'var(--error)', fontSize: '0.9rem', fontWeight: 'bold' }}>{t('res.noStock')}</div>
                        )}
                        <button className="btn btn-primary btn-sm" style={{ marginTop: '4px' }} onClick={() => goToPart(part.id)}>{t('res.pricesAvail')}</button>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAIL */}
      {currentView === 'detail' && partDetails && (
        <div className="part-detail-container">
          <div className="glass-panel part-header-panel" data-reveal="up">
            <div className="part-img-placeholder" style={{ width: '128px', height: '128px' }}>
              {partDetails.image_url ? <img src={partDetails.image_url} alt={partDetails.name} onError={onImgError} /> : <Package size={48} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-secondary">{partDetails.brand}</span>
                {!partDetails.is_verified && <span className="badge badge-pending">{t('det.notVerified')}</span>}
                {partDetails.offers.length > 0 && <span className="badge badge-success"><Check size={11} /> {t('det.inStock')}</span>}
                <button className="icon-btn share-btn" title={t('share.title')} onClick={() => handleShare(partDetails.name, `${partDetails.brand} ${partDetails.name} · ${t('det.article')} ${partDetails.article}`)}><Share2 size={16} /></button>
              </div>
              <h2 style={{ marginTop: '10px', fontSize: '1.7rem' }}>{partDetails.name}</h2>
              <div style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {t('det.article')}: <strong style={{ color: 'var(--text-primary)' }}>{partDetails.article}</strong>
                {partDetails.oem_numbers?.length > 0 && <span style={{ marginLeft: '14px' }}>OEM: {partDetails.oem_numbers.join(', ')}</span>}
              </div>
              <p style={{ marginTop: '12px', fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '720px' }}>{partDetails.description}</p>
              {partDetails.offers.length > 0 && (
                <div style={{ marginTop: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('det.bestPrice')}</div><div className="offer-price" style={{ fontSize: '1.6rem' }}>{formatPrice(partDetails.offers[0].price)} сом.</div></div>
                  <div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('det.offersCount')}</div><div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{partDetails.offers.length}</div></div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }} data-reveal="up">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{t('det.pricesInShops')}</h3>
            {partDetails.offers.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px' }}>{t('det.noOffers')}</div>
            ) : (
              <div className="offers-table-wrapper">
                <table className="offers-table">
                  <thead><tr><th>{t('det.shopAddr')}</th><th>{t('det.term')}</th><th>{t('det.avail')}</th><th>{t('det.price')}</th><th style={{ textAlign: 'right' }}>{t('det.action')}</th></tr></thead>
                  <tbody>
                    {partDetails.offers.map((offer, idx) => (
                      <tr key={offer.id} className={idx === 0 ? 'best-offer' : ''}>
                        <td>
                          <div className="offer-shop-info">
                            <span className="offer-shop-name" style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => { setSelectedShopId(offer.shop_id); setCurrentView('shop'); }}>{offer.shop_name}</span>
                            <span className="offer-shop-address">{offer.shop_address}</span>
                          </div>
                        </td>
                        <td>{offer.delivery_days === 0 ? <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{t('det.today')}</span> : <span>{offer.delivery_days} {offer.delivery_days === 1 ? t('det.day') : t('det.days')}</span>}</td>
                        <td>{offer.quantity} {t('unit.pcs')}</td>
                        <td><span className="offer-price">{formatPrice(offer.price)} сом.</span>{idx === 0 && <div><span className="badge badge-success" style={{ fontSize: '0.6rem', marginTop: '4px' }}>{t('det.bestTag')}</span></div>}</td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button className="btn btn-secondary btn-sm" style={{ marginRight: '6px' }} title={t('cart.add')} onClick={() => handleAddToCart(offer, parts.find(p => p.id === offer.part_id))}><Plus size={14} /></button>
                          <button className="btn btn-accent btn-sm" onClick={() => { setOrderOffer(offer); setOrderSuccessMsg(null); }}><ShoppingCart size={14} /> {t('det.order')}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '24px' }} data-reveal="up">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowLeftRight size={18} style={{ color: 'var(--primary)' }} /> {t('det.analogs')}</h3>
            {partDetails.crosses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('det.noAnalogs')}</p>
            ) : (
              <div className="results-grid">
                {partDetails.crosses.map(cross => (
                  <div key={cross.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Thumb src={cross.image_url} box={56} />
                      <div>
                        <span className="badge badge-secondary">{cross.brand}</span>
                        <h4 style={{ fontSize: '1rem', marginTop: '6px' }}>{cross.name}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{t('det.article')}: {cross.article}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {cross.min_price !== null ? (
                        <><div className="offer-price" style={{ fontSize: '1.1rem' }}>{formatPrice(cross.min_price)} сом.</div><button className="btn btn-secondary btn-sm" style={{ marginTop: '6px' }} onClick={() => goToPart(cross.id)}>{t('det.watch')}</button></>
                      ) : (<span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('res.noStock')}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {partDetails.applicable_vehicles?.length > 0 && (
            <div className="glass-panel" style={{ padding: '24px' }} data-reveal="up">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Car size={18} style={{ color: 'var(--accent)' }} /> {t('det.applicability')}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {partDetails.applicable_vehicles.map((v, i) => (
                  <span key={i} className="badge badge-secondary" style={{ fontSize: '0.8rem', padding: '7px 13px', textTransform: 'none' }}>{v.make} {v.model} ({v.year_from}{v.year_to ? `–${v.year_to}` : '+'}) {v.engine && `· ${v.engine}`}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SHOP */}
      {currentView === 'shop' && shopData && (
        <div className="part-detail-container">
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexWrap: 'wrap', gap: '24px', position: 'relative' }} data-reveal="up">
            <img src={shopData.logo_url} alt={shopData.name} style={{ width: '96px', height: '96px', borderRadius: '20px', objectFit: 'cover', border: '2px solid var(--border-glow)' }} />
            <div style={{ flex: '1', minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h2>{shopData.name}</h2>
                <span className="badge badge-success"><Star size={11} /> {shopData.id === 'shop-1' ? '4.8' : '4.5'}</span>
                <button className="icon-btn share-btn" title={t('share.title')} onClick={() => handleShare(shopData.name, `${shopData.name} · ${shopData.address} · ${shopData.phone}`)}><Share2 size={16} /></button>
              </div>
              <p style={{ marginTop: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{shopData.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '20px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} /> <a href={`https://yandex.com/maps/?text=${encodeURIComponent(shopData.address)}&z=16`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)' }}>{shopData.address}</a></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} /> <a href={`tel:${shopData.phone}`} style={{ color: 'var(--text-primary)' }}>{shopData.phone}</a></div>
                {shopData.website_url && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} /> <a href={shopData.website_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{shopData.website_url.replace('https://', '')}</a></div>}
                {shopData.working_hours && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} /> {t('shop.today')}: {shopData.working_hours.mon}</div>}
              </div>
            </div>
            <div className="glass-panel" style={{ width: '100%', marginTop: '16px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  <MapPin size={18} style={{ color: 'var(--error)' }} /> {t('shop.map')} — {shopData.city}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a className="btn btn-secondary btn-sm" href={`https://yandex.com/maps/?ll=${shopData.lng},${shopData.lat}&z=16&pt=${shopData.lng},${shopData.lat},pm2rdm`} target="_blank" rel="noreferrer">
                    <Globe size={14} /> {t('shop.openMap')}
                  </a>
                  <a className="btn btn-accent btn-sm" href={`https://yandex.com/maps/?rtext=~${shopData.lat},${shopData.lng}&rtt=auto`} target="_blank" rel="noreferrer">
                    <MapPin size={14} /> {t('shop.route')}
                  </a>
                </div>
              </div>
              <iframe
                title={`map-${shopData.id}`}
                width="100%"
                height="300"
                style={{ border: 0, display: 'block', filter: 'grayscale(0.1)' }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${shopData.lng - 0.012}%2C${shopData.lat - 0.008}%2C${shopData.lng + 0.012}%2C${shopData.lat + 0.008}&layer=mapnik&marker=${shopData.lat}%2C${shopData.lng}`}
              />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }} data-reveal="up">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{t('shop.catalog')} ({shopData.offers.length})</h3>
            {shopData.offers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px' }}>{t('shop.noItems')}</p>
            ) : (
              <div className="offers-table-wrapper">
                <table className="offers-table">
                  <thead><tr><th>{t('det.shopAddr')}</th><th>{t('det.article')}</th><th>{t('det.avail')}</th><th>{t('det.price')}</th><th style={{ textAlign: 'right' }}>{t('det.action')}</th></tr></thead>
                  <tbody>
                    {shopData.offers.map(offer => (
                      <tr key={offer.id}>
                        <td>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Thumb src={offer.image_url} box={44} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => goToPart(offer.part_id)}>{offer.part_name}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{offer.part_brand}</span>
                            </div>
                          </div>
                        </td>
                        <td>{offer.part_article}</td>
                        <td>{offer.quantity} {t('unit.pcs')}</td>
                        <td><span className="offer-price">{formatPrice(offer.price)} сом.</span></td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button className="btn btn-secondary btn-sm" style={{ marginRight: '6px' }} title={t('cart.add')} onClick={() => handleAddToCart(offer, parts.find(p => p.id === offer.part_id))}><Plus size={14} /></button>
                          <button className="btn btn-accent btn-sm" onClick={() => { setOrderOffer(offer); setOrderSuccessMsg(null); }}><ShoppingCart size={14} /> {t('det.order')}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CART */}
      {currentView === 'cart' && (
        <div>
          <h2 className="cart-heading"><ShoppingCart size={22} /> {t('cart.title')}</h2>
          {placedOrders ? (
            <div className="glass-panel" style={{ padding: '24px', maxWidth: '620px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <div className="cart-success-icon"><Check size={32} /></div>
                <h3>{t('cart.placedOk')}</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>{t('cart.placedHint')}</p>
              </div>
              {groupByShop(placedOrders).map(([shopId, list]) => {
                const shop = shops.find(s => s.id === shopId);
                const sum = list.reduce((s, o) => s + o.price * o.quantity, 0);
                return (
                  <div key={shopId} className="cart-shop-block">
                    <div className="cart-shop-head">
                      <span>{shop?.name || t('cart.shopOrder')}</span>
                      <strong>{formatPrice(sum)} сом.</strong>
                    </div>
                    <div className="cart-shop-items">{list.map(o => `${o.part_name} ×${o.quantity}`).join(', ')}</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                      <button className="btn btn-accent btn-sm" onClick={() => sendShopOrders(shopId, list, 'wa')}><Phone size={14} /> {t('ord.sendWa')}</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => sendShopOrders(shopId, list, 'tg')}>{t('ord.sendTg')}</button>
                    </div>
                  </div>
                );
              })}
              <div style={{ display: 'flex', gap: '8px', marginTop: '18px', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setPlacedOrders(null); setCurrentView('orders'); }}>{t('cart.myOrders')}</button>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setPlacedOrders(null); setCurrentView('home'); }}>{t('cart.continue')}</button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="glass-panel" style={{ padding: '46px 24px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
              <ShoppingCart size={42} style={{ color: 'var(--text-muted)', marginBottom: '14px' }} />
              <h3>{t('cart.empty')}</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{t('cart.emptyHint')}</p>
              <button className="btn btn-accent" style={{ marginTop: '18px' }} onClick={() => setCurrentView('home')}>{t('cart.continue')}</button>
            </div>
          ) : (
            <div className="cart-grid">
              <div className="cart-items glass-panel" style={{ padding: '14px 18px' }}>
                {cart.map(item => (
                  <div key={item.offerId} className="cart-item">
                    <Thumb src={item.image} box={56} />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-sub">{[item.brand, item.article].filter(Boolean).join(' · ')}</div>
                      <div className="cart-item-price">{formatPrice(item.price)} сом.</div>
                    </div>
                    <div className="cart-qty">
                      <button type="button" onClick={() => setCartQty(item.offerId, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => setCartQty(item.offerId, item.qty + 1)}>+</button>
                    </div>
                    <button type="button" className="cart-item-remove" title={t('cart.remove')} onClick={() => { haptic('light'); removeFromCart(item.offerId); }}><X size={16} /></button>
                  </div>
                ))}
              </div>
              <form className="cart-summary glass-panel" style={{ padding: '18px' }} onSubmit={placeCartOrder}>
                <div className="cart-total-row"><span>{t('cart.total')}</span><strong>{formatPrice(cartTotal)} сом.</strong></div>
                <div className="form-group"><label className="form-label">{t('ord.name')} *</label><input className="form-control" required value={checkoutName} onChange={(e) => setCheckoutName(e.target.value)} placeholder={t('ord.namePh')} /></div>
                <div className="form-group"><label className="form-label">{t('ord.phone')} *</label><input type="tel" className="form-control" required value={checkoutPhone} onChange={(e) => setCheckoutPhone(e.target.value)} placeholder="+992 90 123-45-67" /></div>
                <div className="form-group"><label className="form-label">{t('ord.comment')}</label><textarea className="form-control" rows="2" value={checkoutComment} onChange={(e) => setCheckoutComment(e.target.value)} placeholder={t('ord.commentPh')} /></div>
                <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '13px' }}><ShoppingBag size={16} /> {t('cart.checkout')}</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* MY ORDERS */}
      {currentView === 'orders' && (
        <div>
          <h2 className="cart-heading"><ShoppingBag size={22} /> {t('cart.myOrders')}</h2>

          {/* Профиль покупателя */}
          {buyerUser && (
            <div className="glass-panel buyer-profile-card">
              {editingProfile ? (
                <form onSubmit={saveProfile} style={{ width: '100%' }}>
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: '10px' }}><label className="form-label">{t('buyer.name')}</label><input className="form-control" value={profName} onChange={(e) => setProfName(e.target.value)} /></div>
                    <div className="form-group" style={{ marginBottom: '10px' }}><label className="form-label">{t('buyer.phone')}</label><input type="tel" className="form-control" value={profPhone} onChange={(e) => setProfPhone(e.target.value)} placeholder="+992 90 123-45-67" /></div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingProfile(false)}>{t('common.close')}</button>
                    <button type="submit" className="btn btn-primary btn-sm">{t('buyer.save')}</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="buyer-profile-info">
                    <div className="buyer-profile-name"><User size={16} /> {buyerUser.name}</div>
                    <div className="buyer-profile-sub">{buyerUser.email}{buyerUser.phone ? ` · ${buyerUser.phone}` : ''}</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={startEditProfile}>{t('buyer.profile')}</button>
                </>
              )}
            </div>
          )}

          {myOrders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '46px 24px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
              <ShoppingBag size={42} style={{ color: 'var(--text-muted)', marginBottom: '14px' }} />
              <p style={{ color: 'var(--text-muted)' }}>{t('cart.ordersEmpty')}</p>
              <button className="btn btn-accent" style={{ marginTop: '18px' }} onClick={() => setCurrentView('home')}>{t('cart.continue')}</button>
            </div>
          ) : (
            <div className="orders-list">
              {myOrders.map(o => {
                const shop = shops.find(s => s.id === o.shop_id);
                return (
                  <div key={o.id} className="glass-panel order-card">
                    <div>
                      <div className="order-card-name">{o.part_name}</div>
                      <div className="order-card-sub">{[o.part_brand, shop?.name].filter(Boolean).join(' · ')}</div>
                      <div className="order-card-meta">{t('ord.num')}: {o.id} · ×{o.quantity} · {formatPrice(o.price * o.quantity)} сом.</div>
                    </div>
                    <div className="order-card-side">
                      <span className={`badge order-status order-status-${o.status}`}>{orderStatusLabel(o.status)}</span>
                      <button className="btn btn-secondary btn-sm" onClick={() => repeatOrder(o)}><ArrowLeftRight size={14} /> {t('cart.repeat')}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

          </SceneReveal>
        </PageTransition>
      </AnimatePresence>

      {/* ORDER MODAL */}
      {orderOffer && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setOrderOffer(null); }}>
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>{t('ord.title')}</h3>
              <button className="modal-close-btn" onClick={() => setOrderOffer(null)}><X size={20} /></button>
            </div>

            {orderSuccessMsg ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'var(--success-glow)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--success)', animation: 'popIn 0.4s var(--ease-spring)' }}><Check size={34} /></div>
                <h3>{t('ord.successT')}</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>{t('ord.num')}: <strong style={{ color: 'var(--accent)' }}>{orderSuccessMsg}</strong></p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>{t('ord.sendHint')}</p>
                <button className="btn btn-accent" style={{ marginTop: '20px', width: '100%' }} onClick={() => sendOrderToShop('wa')}>
                  <Phone size={16} /> {t('ord.sendWa')}
                </button>
                <button className="btn btn-secondary" style={{ marginTop: '10px', width: '100%' }} onClick={() => sendOrderToShop('tg')}>
                  {t('ord.sendTg')}
                </button>
                <button className="btn btn-secondary" style={{ marginTop: '10px', width: '100%', opacity: 0.8 }} onClick={() => setOrderOffer(null)}>{t('ord.great')}</button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder}>
                <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('ord.selected')}</div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                    <Thumb src={orderImg} box={56} />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{orderOffer.raw_name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{t('det.article')}: {orderOffer.raw_article}{orderOffer.part_brand ? ` · ${orderOffer.part_brand}` : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', marginTop: '12px', paddingTop: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('ord.shop')}:</span>
                    <strong style={{ color: 'var(--accent)' }}>{orderOffer.shop_name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('ord.priceLbl')}:</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>{formatPrice(orderOffer.price)} сом. {t('ord.perPc')}</strong>
                  </div>
                </div>

                <div className="form-group"><label className="form-label">{t('ord.name')} *</label><input type="text" className="form-control" required placeholder={t('ord.namePh')} value={buyerName} onChange={(e) => setBuyerName(e.target.value)} /></div>
                <div className="form-group"><label className="form-label">{t('ord.phone')} *</label><input type="tel" className="form-control" required placeholder="+992 90 123-45-67" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('ord.qty')} *</label>
                    <input type="number" className="form-control" required min="1" max={orderOffer.quantity} value={orderQty} onChange={(e) => setOrderQty(Math.min(orderOffer.quantity, Math.max(1, parseInt(e.target.value) || 1)))} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>{t('ord.available')}: {orderOffer.quantity} {t('unit.pcs')}</span>
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">{t('ord.total')}</label>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', paddingTop: '6px', fontFamily: 'var(--font-heading)' }}>{formatPrice(orderOffer.price * orderQty)} сом.</div>
                  </div>
                </div>
                <div className="form-group"><label className="form-label">{t('ord.comment')}</label><textarea className="form-control" rows="2" placeholder={t('ord.commentPh')} value={orderComment} onChange={(e) => setOrderComment(e.target.value)} /></div>
                <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '14px' }}>{t('ord.submit')}</button>
              </form>
            )}
          </div>
        </div>
      )}

      {toast && <div className="app-toast" role="status">{toast}</div>}
    </div>
  );
}
