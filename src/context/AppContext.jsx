import React, { createContext, useState, useEffect, useCallback } from 'react';
import { translate, ADMIN_PASSWORD } from '../i18n';

export const AppContext = createContext();

// Clean article for lookup mapping
export const normalizeArticle = (art) => {
  if (!art) return '';
  return String(art).replace(/[^A-Z0-9]/gi, '').toUpperCase();
};

const INITIAL_PLANS = [
  { id: 'plan-basic', name: 'Базовый', price: 50, currency: 'TJS', max_offers: 100, features: ['Размещение до 100 товаров', 'Ручная загрузка прайса (Excel/CSV)'] },
  { id: 'plan-standard', name: 'Стандарт', price: 150, currency: 'TJS', max_offers: 1000, features: ['Размещение до 1000 товаров', 'Обновление по ссылке (URL)', 'Базовая статистика кликов'] },
  { id: 'plan-premium', name: 'Премиум', price: 400, currency: 'TJS', max_offers: 10000, features: ['Размещение до 10 000 товаров', 'Приоритетное место в поиске', 'Детальная аналитика лидов', 'Поддержка 24/7'] }
];

const INITIAL_CATEGORIES = [
  { id: 'cat-engine', name: 'Двигатель', icon: 'Cpu' },
  { id: 'cat-brakes', name: 'Тормозная система', icon: 'Disc' },
  { id: 'cat-suspension', name: 'Подвеска', icon: 'Activity' },
  { id: 'cat-steering', name: 'Рулевое управление', icon: 'Compass' },
  { id: 'cat-transmission', name: 'Трансмиссия и сцепление', icon: 'Shuffle' },
  { id: 'cat-filters', name: 'Фильтры', icon: 'Filter' },
  { id: 'cat-electrical', name: 'Электрика и освещение', icon: 'Lightbulb' },
  { id: 'cat-cooling-heating', name: 'Система охлаждения и отопления', icon: 'Thermometer' },
  { id: 'cat-exhaust', name: 'Выхлопная система', icon: 'Wind' },
  { id: 'cat-body', name: 'Кузовные детали', icon: 'Layout' },
  { id: 'cat-fuel-system', name: 'Топливная система', icon: 'Fuel' },
  { id: 'cat-ignition', name: 'Система зажигания', icon: 'Flame' },
  { id: 'cat-maintenance', name: 'Расходники и Автохимия (ТО)', icon: 'Droplets' }
];

// Aligned vehicles data from Exist / Koleso.tj / BIPMIX research
const CAR_MAKES_RAW = [
  {
    name: "Toyota",
    models: [
      { name: "Camry", start: 1996, end: 2026 },
      { name: "Corolla", start: 1997, end: 2026 },
      { name: "RAV4", start: 1994, end: 2026 },
      { name: "Land Cruiser Prado", start: 2002, end: 2026 }
    ]
  },
  {
    name: "BMW",
    models: [
      { name: "3-Series", start: 1998, end: 2026 },
      { name: "5-Series", start: 1995, end: 2026 },
      { name: "X5", start: 1999, end: 2026 }
    ]
  },
  {
    name: "Mercedes-Benz",
    models: [
      { name: "C-Class", start: 2000, end: 2026 },
      { name: "E-Class", start: 1995, end: 2026 },
      { name: "S-Class", start: 1998, end: 2026 }
    ]
  },
  {
    name: "Lada",
    models: [
      { name: "Vesta", start: 2015, end: 2026 },
      { name: "Granta", start: 2011, end: 2026 },
      { name: "Niva Legend (2121)", start: 1977, end: 2026 },
      { name: "Niva Travel (2123)", start: 2002, end: 2026 }
    ]
  },
  {
    name: "Hyundai",
    models: [
      { name: "Solaris", start: 2011, end: 2026 },
      { name: "Creta", start: 2016, end: 2026 },
      { name: "Tucson", start: 2004, end: 2026 }
    ]
  },
  {
    name: "Kia",
    models: [
      { name: "Rio", start: 2005, end: 2026 },
      { name: "Sportage", start: 2004, end: 2026 },
      { name: "Ceed", start: 2006, end: 2026 }
    ]
  },
  {
    name: "Volkswagen",
    models: [
      { name: "Golf", start: 1997, end: 2026 },
      { name: "Passat", start: 1996, end: 2026 },
      { name: "Polo", start: 2010, end: 2026 }
    ]
  },
  {
    name: "Audi",
    models: [
      { name: "A4", start: 1994, end: 2026 },
      { name: "A6", start: 1997, end: 2026 },
      { name: "Q5", start: 2008, end: 2026 }
    ]
  },
  {
    name: "Ford",
    models: [
      { name: "Focus", start: 1998, end: 2026 },
      { name: "Mondeo", start: 2000, end: 2026 },
      { name: "Kuga", start: 2008, end: 2026 }
    ]
  },
  {
    name: "Renault",
    models: [
      { name: "Logan", start: 2004, end: 2026 },
      { name: "Duster", start: 2010, end: 2026 },
      { name: "Sandero", start: 2008, end: 2026 }
    ]
  },
  {
    name: "Nissan",
    models: [
      { name: "Qashqai", start: 2006, end: 2026 },
      { name: "X-Trail", start: 2001, end: 2026 },
      { name: "Almera", start: 2000, end: 2026 }
    ]
  },
  {
    name: "Chevrolet",
    models: [
      { name: "Lacetti", start: 2004, end: 2026 },
      { name: "Cruze", start: 2008, end: 2026 },
      { name: "Aveo", start: 2005, end: 2026 }
    ]
  },
  {
    name: "Skoda",
    models: [
      { name: "Octavia", start: 1996, end: 2026 },
      { name: "Rapid", start: 2012, end: 2026 },
      { name: "Superb", start: 2001, end: 2026 }
    ]
  },
  {
    name: "Mitsubishi",
    models: [
      { name: "Lancer", start: 2000, end: 2026 },
      { name: "Outlander", start: 2001, end: 2026 },
      { name: "Pajero Sport", start: 1996, end: 2026 }
    ]
  },
  {
    name: "Mazda",
    models: [
      { name: "Mazda 3", start: 2003, end: 2026 },
      { name: "Mazda 6", start: 2002, end: 2026 },
      { name: "CX-5", start: 2011, end: 2026 }
    ]
  },
  {
    name: "Opel",
    models: [
      { name: "Astra", start: 1998, end: 2026 },
      { name: "Vectra", start: 1995, end: 2026 },
      { name: "Zafira", start: 1999, end: 2026 }
    ]
  }
];

// Flattener function to generate individual year records for selectors
const generateFlatVehicles = () => {
  const flat = [];
  let idCounter = 1;
  CAR_MAKES_RAW.forEach(make => {
    make.models.forEach(model => {
      // Step: Add years (every year, or skip to save performance - every year is best for precise matching)
      for (let yr = model.start; yr <= model.end; yr++) {
        flat.push({
          id: `v-${idCounter++}`,
          make: make.name,
          model: model.name,
          year: yr,
          engine: model.name === 'Camry' ? '2.5L VVTi' :
                  model.name === 'Solaris' ? '1.6L Gamma' :
                  model.name === 'Rio' ? '1.4L Kappa' :
                  model.name === 'Vesta' ? '1.6L 16V' : '2.0L Engine'
        });
      }
    });
  });
  return flat;
};

const INITIAL_VEHICLES = generateFlatVehicles();

const INITIAL_USERS = [
  { id: 'user-admin', email: 'admin@partseeker.tj', role: 'admin', is_verified: true },
  { id: 'user-partner-1', email: 'info@avto-dushanbe.tj', role: 'partner', is_verified: true },
  { id: 'user-partner-2', email: 'sales@sugd-avto.tj', role: 'partner', is_verified: true },
  { id: 'user-partner-3', email: 'bokhtar@avtochast.tj', role: 'partner', is_verified: true },
  { id: 'user-partner-4', email: 'info@kulob-parts.tj', role: 'partner', is_verified: true }
];

const INITIAL_SHOPS = [
  {
    id: 'shop-1',
    user_id: 'user-partner-1',
    name: 'Авто Душанбе',
    description: 'Магазин качественных запчастей для японских, корейских и европейских автомобилей. Быстрая доставка по Душанбе.',
    logo_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=160&auto=format&fit=crop&q=60',
    address: 'ш. Душанбе, хиёбони Рӯдакӣ, 84',
    city: 'Душанбе',
    lat: 38.5598,
    lng: 68.7870,
    phone: '+992 90 123-45-67',
    website_url: 'https://avto-dushanbe.tj',
    working_hours: { mon: '8:00-19:00', tue: '8:00-19:00', wed: '8:00-19:00', thu: '8:00-19:00', fri: '8:00-19:00', sat: '9:00-17:00', sun: 'Истироҳат' },
    status: 'active',
    subscription_plan: 'plan-premium',
    subscription_expires_at: '2026-12-31T23:59:59Z',
    created_at: '2026-01-10T12:00:00Z'
  },
  {
    id: 'shop-2',
    user_id: 'user-partner-2',
    name: 'Сугд-Авто',
    description: 'Оригинальные детали и качественные аналоги в наличии и под заказ. Склад в Худжанде.',
    logo_url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=160&auto=format&fit=crop&q=60',
    address: 'ш. Хуҷанд, хиёбони Исмоили Сомонӣ, 12',
    city: 'Худжанд',
    lat: 40.2833,
    lng: 69.6228,
    phone: '+992 92 765-43-21',
    website_url: 'https://sugd-avto.tj',
    working_hours: { mon: '8:00-20:00', tue: '8:00-20:00', wed: '8:00-20:00', thu: '8:00-20:00', fri: '8:00-20:00', sat: '9:00-18:00', sun: '10:00-15:00' },
    status: 'active',
    subscription_plan: 'plan-standard',
    subscription_expires_at: '2026-09-15T23:59:59Z',
    created_at: '2026-02-14T08:30:00Z'
  },
  {
    id: 'shop-3',
    user_id: 'user-partner-3',
    name: 'Бохтар Авточаст',
    description: 'Локальный склад автокомпонентов. Доступные цены и гарантия качества.',
    logo_url: 'https://images.unsplash.com/photo-1552656967-7a0991a13906?w=160&auto=format&fit=crop&q=60',
    address: 'ш. Бохтар, кӯчаи Айнӣ, 7',
    city: 'Бохтар',
    lat: 37.8364,
    lng: 68.7800,
    phone: '+992 93 999-88-77',
    website_url: 'https://avtochast.tj',
    working_hours: { mon: '9:00-18:00', tue: '9:00-18:00', wed: '9:00-18:00', thu: '9:00-18:00', fri: '9:00-18:00', sat: '10:00-15:00', sun: 'Истироҳат' },
    status: 'pending',
    subscription_plan: 'plan-basic',
    subscription_expires_at: '2026-07-01T23:59:59Z',
    created_at: '2026-06-01T10:00:00Z'
  },
  {
    id: 'shop-4',
    user_id: 'user-partner-4',
    name: 'Кӯлоб Запчасти',
    description: 'Широкий ассортимент расходников и автохимии. Подбор по марке авто, доставка по югу страны.',
    logo_url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=160&auto=format&fit=crop&q=60',
    address: 'ш. Кӯлоб, кӯчаи Борбад, 15',
    city: 'Куляб',
    lat: 37.9145,
    lng: 69.7808,
    phone: '+992 98 555-22-33',
    website_url: 'https://kulob-parts.tj',
    working_hours: { mon: '8:00-19:00', tue: '8:00-19:00', wed: '8:00-19:00', thu: '8:00-19:00', fri: '8:00-19:00', sat: '9:00-16:00', sun: 'Истироҳат' },
    status: 'active',
    subscription_plan: 'plan-standard',
    subscription_expires_at: '2026-11-20T23:59:59Z',
    created_at: '2026-03-05T09:00:00Z'
  }
];

// Product photos (Unsplash CDN — all IDs verified reachable). UI also has an SVG fallback on image error.
const photo = (id) => `https://images.unsplash.com/photo-${id}?w=400&auto=format&fit=crop&q=60`;
const CAT_IMG = {
  'cat-engine': photo('1492144534655-ae79c964c9d7'),
  'cat-brakes': photo('1552656967-7a0991a13906'),
  'cat-suspension': photo('1503376780353-7e6692767b70'),
  'cat-steering': photo('1568605117036-5fe5e7bab0b7'),
  'cat-transmission': photo('1605559424843-9e4c228bf1c2'),
  'cat-filters': photo('1542362567-b07e54358753'),
  'cat-electrical': photo('1487754180451-c456f719a1fc'),
  'cat-cooling-heating': photo('1493238792000-8113da705763'),
  'cat-exhaust': photo('1530046339160-ce3e530c7d2f'),
  'cat-body': photo('1558618666-fcd25c85cd64'),
  'cat-fuel-system': photo('1606577924006-27d39b132ae2'),
  'cat-ignition': photo('1581235720704-06d3acfcb36f'),
  'cat-maintenance': photo('1619767886558-efdc259cde1a')
};
const catImg = (cat) => CAT_IMG[cat] || photo('1552656967-7a0991a13906');
const mkPart = (p) => ({ oem_numbers: [], cross_numbers: [], applicable_vehicles: [], is_verified: true, image_url: catImg(p.category_id), ...p });

const INITIAL_PARTS = [
  // ---- Фильтры ----
  mkPart({ id: 'part-1', article: 'OC90', brand: 'Knecht-Mahle', name: 'Масляный фильтр Knecht-Mahle OC90', category_id: 'cat-filters',
    description: 'Масляный фильтр высокого качества с отличным уровнем фильтрации. Подходит для широкого спектра моторов.',
    oem_numbers: ['21081012005', '21051012005'], cross_numbers: ['W71294', 'OP5201', 'LS206'],
    applicable_vehicles: [{ make: 'Lada', model: 'Vesta', year_from: 2015, year_to: 2026, engine: '1.6L / 1.8L' }, { make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2022, engine: '1.4L / 1.6L' }] }),
  mkPart({ id: 'part-2', article: 'W71294', brand: 'Mann-Filter', name: 'Масляный фильтр Mann W712/94', category_id: 'cat-filters',
    description: 'Премиальный немецкий фильтр очистки масла. Надёжная защита двигателя в экстремальных условиях.',
    oem_numbers: ['03C115561H'], cross_numbers: ['OC90', 'OP5201'],
    applicable_vehicles: [{ make: 'Volkswagen', model: 'Polo', year_from: 2010, year_to: 2026, engine: '1.6L' }, { make: 'Toyota', model: 'Camry', year_from: 2017, year_to: 2026, engine: '2.5L' }] }),
  mkPart({ id: 'part-3', article: 'C26168', brand: 'Mann-Filter', name: 'Воздушный фильтр Mann C26168', category_id: 'cat-filters',
    description: 'Воздушный фильтр двигателя. Высокая степень очистки впускного воздуха, длительный ресурс.',
    oem_numbers: ['281132E000'], cross_numbers: ['AP1380', 'LX2059'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2017, year_to: 2026, engine: '1.4L / 1.6L' }, { make: 'Kia', model: 'Rio', year_from: 2017, year_to: 2026, engine: '1.4L / 1.6L' }] }),
  mkPart({ id: 'part-4', article: 'CU2939', brand: 'Mann-Filter', name: 'Салонный фильтр Mann CU2939', category_id: 'cat-filters',
    description: 'Фильтр салона для защиты от пыли и пыльцы. Чистый воздух в салоне автомобиля.',
    oem_numbers: ['97133D1000'], cross_numbers: ['LA923', 'AC1234'],
    applicable_vehicles: [{ make: 'Kia', model: 'Sportage', year_from: 2016, year_to: 2026, engine: 'Все моторы' }, { make: 'Hyundai', model: 'Tucson', year_from: 2015, year_to: 2026, engine: 'Все моторы' }] }),

  // ---- Двигатель ----
  mkPart({ id: 'part-5', article: '21810-1R000', brand: 'Hyundai-Kia', name: 'Опора двигателя правая (подушка)', category_id: 'cat-engine',
    description: 'Оригинальная гидравлическая опора двигателя для снижения вибраций мотора.',
    oem_numbers: ['218101R000'], cross_numbers: ['901046', 'EM5001'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: '1.4L / 1.6L' }, { make: 'Kia', model: 'Rio', year_from: 2011, year_to: 2017, engine: '1.4L / 1.6L' }] }),
  mkPart({ id: 'part-6', article: '530194810', brand: 'INA', name: 'Комплект ГРМ INA (ремень + ролики)', category_id: 'cat-engine',
    description: 'Полный комплект газораспределительного механизма: ремень, натяжной и обводной ролики.',
    oem_numbers: ['1145080J50'], cross_numbers: ['KTB332', 'CT1028K1'],
    applicable_vehicles: [{ make: 'Toyota', model: 'Corolla', year_from: 2001, year_to: 2008, engine: '1.6L' }, { make: 'Renault', model: 'Logan', year_from: 2004, year_to: 2014, engine: '1.6L' }] }),

  // ---- Тормозная система ----
  mkPart({ id: 'part-7', article: '0986494002', brand: 'Bosch', name: 'Тормозные колодки дисковые Bosch передние', category_id: 'cat-brakes',
    description: 'Колодки Bosch обеспечивают короткий тормозной путь и долгий срок службы.',
    oem_numbers: ['581014LA00'], cross_numbers: ['SP1399', '2491501', 'GDB3548'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2017, year_to: 2026, engine: '1.4L / 1.6L' }, { make: 'Hyundai', model: 'Creta', year_from: 2016, year_to: 2026, engine: '1.6L / 2.0L' }] }),
  mkPart({ id: 'part-8', article: 'SP1399', brand: 'Sangsin', name: 'Тормозные колодки Sangsin Hi-Q SP1399', category_id: 'cat-brakes',
    description: 'Популярные корейские колодки Hi-Q. Минимальный износ диска, отсутствие шумов.',
    oem_numbers: ['581014LA00'], cross_numbers: ['0986494002', '2491501'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2017, year_to: 2026, engine: '1.4L / 1.6L' }, { make: 'Kia', model: 'Rio', year_from: 2017, year_to: 2026, engine: '1.4L / 1.6L' }] }),
  mkPart({ id: 'part-9', article: 'DF4451', brand: 'TRW', name: 'Тормозной диск TRW вентилируемый', category_id: 'cat-brakes',
    description: 'Передний вентилируемый тормозной диск. Точная геометрия, стойкость к перегреву.',
    oem_numbers: ['517123K000'], cross_numbers: ['DDF1503', '24.0125-0151'],
    applicable_vehicles: [{ make: 'Kia', model: 'Ceed', year_from: 2012, year_to: 2018, engine: '1.6L' }, { make: 'Hyundai', model: 'Creta', year_from: 2016, year_to: 2026, engine: '1.6L / 2.0L' }] }),

  // ---- Подвеска ----
  mkPart({ id: 'part-10', article: '54830-2V000', brand: 'CTR', name: 'Стойка переднего стабилизатора CTR', category_id: 'cat-suspension',
    description: 'Усиленная стойка стабилизатора поперечной устойчивости для улучшения управляемости.',
    oem_numbers: ['548302V000'], cross_numbers: ['CLKH46', '548304L000'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2026, engine: 'Все моторы' }, { make: 'Kia', model: 'Rio', year_from: 2011, year_to: 2026, engine: 'Все моторы' }] }),
  mkPart({ id: 'part-11', article: '339030', brand: 'KYB', name: 'Амортизатор передний KYB Excel-G', category_id: 'cat-suspension',
    description: 'Газомасляный амортизатор KYB. Комфорт и точная управляемость на любых дорогах.',
    oem_numbers: ['546511R000'], cross_numbers: ['G339030', 'BSF5345'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: 'Все моторы' }, { make: 'Kia', model: 'Rio', year_from: 2011, year_to: 2017, engine: 'Все моторы' }] }),
  mkPart({ id: 'part-12', article: 'CQ-0223', brand: 'CTR', name: 'Рычаг передней подвески нижний', category_id: 'cat-suspension',
    description: 'Нижний поперечный рычаг подвески в сборе с шаровой опорой и сайлентблоками.',
    oem_numbers: ['545012V000'], cross_numbers: ['QSJ3308S'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: 'Все моторы' }] }),

  // ---- Рулевое управление ----
  mkPart({ id: 'part-13', article: '54010-4L000', brand: 'CTR', name: 'Рулевой наконечник левый CTR', category_id: 'cat-steering',
    description: 'Надёжный наконечник рулевой тяги от ведущего корейского производителя CTR.',
    oem_numbers: ['568204L000'], cross_numbers: ['CEKH48L'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2026, engine: '1.4L / 1.6L' }, { make: 'Kia', model: 'Rio', year_from: 2011, year_to: 2026, engine: '1.4L / 1.6L' }] }),
  mkPart({ id: 'part-14', article: '577242V000', brand: 'Hyundai-Kia', name: 'Тяга рулевая в сборе', category_id: 'cat-steering',
    description: 'Боковая рулевая тяга для точного управления и стабильного схождения колёс.',
    oem_numbers: ['577242V000'], cross_numbers: ['CRKH28'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: 'Все моторы' }] }),

  // ---- Трансмиссия и сцепление ----
  mkPart({ id: 'part-15', article: '623314100', brand: 'LuK', name: 'Комплект сцепления LuK RepSet', category_id: 'cat-transmission',
    description: 'Полный комплект сцепления: диск, корзина, выжимной подшипник. Немецкое качество.',
    oem_numbers: ['414262710'], cross_numbers: ['826704', 'MK9892'],
    applicable_vehicles: [{ make: 'Volkswagen', model: 'Golf', year_from: 2004, year_to: 2012, engine: '1.6L' }, { make: 'Skoda', model: 'Octavia', year_from: 2004, year_to: 2013, engine: '1.6L' }] }),
  mkPart({ id: 'part-16', article: '495002B100', brand: 'GSP', name: 'ШРУС наружный (граната) GSP', category_id: 'cat-transmission',
    description: 'Наружный шарнир равных угловых скоростей в сборе с пыльником и смазкой.',
    oem_numbers: ['495012B100'], cross_numbers: ['218361', 'KH28-22'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: 'Все моторы' }, { make: 'Kia', model: 'Rio', year_from: 2011, year_to: 2017, engine: 'Все моторы' }] }),

  // ---- Электрика и освещение ----
  mkPart({ id: 'part-17', article: '60D23L', brand: 'Bosch', name: 'Аккумулятор Bosch S4 60Ah', category_id: 'cat-electrical',
    description: 'Необслуживаемый аккумулятор 60 А·ч, 540А пусковой ток. Надёжный запуск в жару и холод.',
    oem_numbers: [], cross_numbers: ['S4025', '0092S40250'],
    applicable_vehicles: [{ make: 'Toyota', model: 'Corolla', year_from: 2007, year_to: 2026, engine: 'Бензин' }, { make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2026, engine: 'Бензин' }] }),
  mkPart({ id: 'part-18', article: 'H4-100', brand: 'Osram', name: 'Лампа галогенная Osram H4 12V', category_id: 'cat-electrical',
    description: 'Галогенная лампа головного света H4. Яркий ровный свет, увеличенный срок службы.',
    oem_numbers: [], cross_numbers: ['64193', 'H4-STD'],
    applicable_vehicles: [{ make: 'Lada', model: 'Granta', year_from: 2011, year_to: 2026, engine: 'Все моторы' }, { make: 'Chevrolet', model: 'Lacetti', year_from: 2004, year_to: 2013, engine: 'Все моторы' }] }),
  mkPart({ id: 'part-19', article: '373002B300', brand: 'Valeo', name: 'Генератор Valeo 90A', category_id: 'cat-electrical',
    description: 'Генератор 90А в сборе. Стабильная зарядка бортовой сети, заводское качество.',
    oem_numbers: ['373002B300'], cross_numbers: ['TG11C015', 'CAL40435'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: '1.6L' }] }),

  // ---- Система охлаждения и отопления ----
  mkPart({ id: 'part-20', article: '253101R000', brand: 'Luzar', name: 'Радиатор охлаждения Luzar', category_id: 'cat-cooling-heating',
    description: 'Алюминиевый радиатор охлаждения двигателя. Эффективный теплообмен, антикоррозийная защита.',
    oem_numbers: ['253101R000'], cross_numbers: ['LRc0816', '53024'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: 'Все моторы' }, { make: 'Kia', model: 'Rio', year_from: 2011, year_to: 2017, engine: 'Все моторы' }] }),
  mkPart({ id: 'part-21', article: 'TH2839', brand: 'Wahler', name: 'Термостат Wahler 82°C', category_id: 'cat-cooling-heating',
    description: 'Термостат системы охлаждения с прокладкой. Поддержание рабочей температуры двигателя.',
    oem_numbers: ['2550025001'], cross_numbers: ['TH27082', '410082'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2026, engine: 'Все моторы' }] }),
  mkPart({ id: 'part-22', article: '251002B700', brand: 'Hepu', name: 'Помпа (насос системы охлаждения)', category_id: 'cat-cooling-heating',
    description: 'Водяной насос системы охлаждения в сборе с прокладкой. Надёжная циркуляция ОЖ.',
    oem_numbers: ['251002B700'], cross_numbers: ['P7474', 'GWHY-43A'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Creta', year_from: 2016, year_to: 2026, engine: '1.6L' }] }),

  // ---- Выхлопная система ----
  mkPart({ id: 'part-23', article: '232000', brand: 'Bosal', name: 'Глушитель задний Bosal', category_id: 'cat-exhaust',
    description: 'Задняя часть глушителя из алюминированной стали. Снижение шума и стойкость к коррозии.',
    oem_numbers: ['287001R000'], cross_numbers: ['BOSAL-232'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: '1.6L' }] }),
  mkPart({ id: 'part-24', article: '0258006537', brand: 'Bosch', name: 'Лямбда-зонд (датчик кислорода) Bosch', category_id: 'cat-exhaust',
    description: 'Кислородный датчик для контроля состава смеси и снижения расхода топлива.',
    oem_numbers: ['392102B100'], cross_numbers: ['LS-6537'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: '1.6L' }, { make: 'Kia', model: 'Rio', year_from: 2011, year_to: 2017, engine: '1.6L' }] }),

  // ---- Кузовные детали ----
  mkPart({ id: 'part-25', article: 'AP24U', brand: 'Bosch', name: 'Щётки стеклоочистителя Bosch Aerotwin (к-т)', category_id: 'cat-body',
    description: 'Комплект бескаркасных щёток стеклоочистителя. Чистое стекло и тихая работа.',
    oem_numbers: [], cross_numbers: ['3397007297'],
    applicable_vehicles: [{ make: 'Toyota', model: 'Camry', year_from: 2011, year_to: 2026, engine: 'Все' }, { make: 'Kia', model: 'Sportage', year_from: 2016, year_to: 2026, engine: 'Все' }] }),
  mkPart({ id: 'part-26', article: '876201R000', brand: 'Hyundai-Kia', name: 'Зеркало боковое левое в сборе', category_id: 'cat-body',
    description: 'Боковое зеркало заднего вида с электроприводом и обогревом.',
    oem_numbers: ['876101R000'], cross_numbers: [],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: 'Все' }] }),

  // ---- Топливная система ----
  mkPart({ id: 'part-27', article: '31110-1R000', brand: 'Hyundai-Kia', name: 'Топливный насос в сборе (модуль)', category_id: 'cat-fuel-system',
    description: 'Электрический бензонасос в сборе с фильтром и датчиком уровня топлива.',
    oem_numbers: ['311101R000'], cross_numbers: ['775312', 'E10768M'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: '1.4L / 1.6L' }, { make: 'Kia', model: 'Rio', year_from: 2011, year_to: 2017, engine: '1.4L / 1.6L' }] }),
  mkPart({ id: 'part-28', article: 'WK8141', brand: 'Mann-Filter', name: 'Топливный фильтр Mann WK814/1', category_id: 'cat-fuel-system',
    description: 'Фильтр тонкой очистки топлива. Защита форсунок и топливной аппаратуры.',
    oem_numbers: ['311123X000'], cross_numbers: ['KL248', 'G10097'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2017, year_to: 2026, engine: '1.6L' }] }),

  // ---- Система зажигания ----
  mkPart({ id: 'part-29', article: 'ZGR6STE2', brand: 'NGK', name: 'Свеча зажигания NGK Laser Platinum', category_id: 'cat-ignition',
    description: 'Иридиево-платиновая свеча повышенного ресурса. Идеальное искрообразование.',
    oem_numbers: ['12120037582'], cross_numbers: ['0242140507', 'PLZKBR7A-G'],
    applicable_vehicles: [{ make: 'BMW', model: '3-Series', year_from: 2015, year_to: 2020, engine: '2.0T B48' }, { make: 'BMW', model: 'X5', year_from: 2018, year_to: 2026, engine: '3.0T' }] }),
  mkPart({ id: 'part-30', article: '273012B010', brand: 'Hyundai-Kia', name: 'Катушка зажигания', category_id: 'cat-ignition',
    description: 'Индивидуальная катушка зажигания. Стабильная искра на всех режимах работы мотора.',
    oem_numbers: ['273012B010'], cross_numbers: ['ZSE186', 'CU1486'],
    applicable_vehicles: [{ make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2017, engine: '1.4L / 1.6L' }, { make: 'Kia', model: 'Rio', year_from: 2011, year_to: 2017, engine: '1.4L / 1.6L' }] }),

  // ---- Расходники и автохимия ----
  mkPart({ id: 'part-31', article: '5W40-4L', brand: 'Shell', name: 'Моторное масло Shell Helix Ultra 5W-40 4л', category_id: 'cat-maintenance',
    description: 'Полностью синтетическое моторное масло экстра-класса на технологии Shell PurePlus.',
    oem_numbers: [], cross_numbers: ['5W40-4L-SYN'],
    applicable_vehicles: [{ make: 'Toyota', model: 'Camry', year_from: 1996, year_to: 2026, engine: 'Бензин' }, { make: 'Volkswagen', model: 'Passat', year_from: 1996, year_to: 2026, engine: 'Бензин/Дизель' }] }),
  mkPart({ id: 'part-32', article: 'G12-5L', brand: 'Felix', name: 'Антифриз Felix Carbox G12 -40°C, 5л', category_id: 'cat-maintenance',
    description: 'Карбоксилатный антифриз с увеличенным сроком службы. Защита от коррозии и перегрева.',
    oem_numbers: [], cross_numbers: ['G12-RED-5L'],
    applicable_vehicles: [{ make: 'Lada', model: 'Vesta', year_from: 2015, year_to: 2026, engine: 'Все' }, { make: 'Hyundai', model: 'Solaris', year_from: 2011, year_to: 2026, engine: 'Все' }] }),
  mkPart({ id: 'part-33', article: 'DOT4-1L', brand: 'Bosch', name: 'Тормозная жидкость Bosch DOT4, 1л', category_id: 'cat-maintenance',
    description: 'Тормозная жидкость DOT4 с высокой температурой кипения. Надёжное торможение.',
    oem_numbers: [], cross_numbers: ['DOT-4-1000'],
    applicable_vehicles: [{ make: 'Toyota', model: 'Corolla', year_from: 2000, year_to: 2026, engine: 'Все' }, { make: 'Kia', model: 'Rio', year_from: 2011, year_to: 2026, engine: 'Все' }] })
];

// Offers seed: part_id -> [ [shop_id, price(TJS), qty, delivery_days] ]
const OFFER_SEED = {
  'part-1':  [['shop-1', 55, 24, 0], ['shop-2', 60, 8, 1], ['shop-4', 58, 15, 1]],
  'part-2':  [['shop-1', 70, 18, 0], ['shop-2', 75, 6, 1]],
  'part-3':  [['shop-1', 85, 20, 0], ['shop-4', 82, 9, 1], ['shop-2', 90, 5, 2]],
  'part-4':  [['shop-2', 95, 14, 0], ['shop-1', 100, 7, 0]],
  'part-5':  [['shop-1', 480, 4, 0], ['shop-2', 510, 2, 2]],
  'part-6':  [['shop-1', 650, 5, 1], ['shop-2', 690, 3, 2]],
  'part-7':  [['shop-1', 320, 12, 0], ['shop-2', 340, 8, 1], ['shop-4', 315, 6, 1]],
  'part-8':  [['shop-2', 240, 30, 0], ['shop-1', 250, 10, 0]],
  'part-9':  [['shop-1', 410, 8, 1], ['shop-2', 430, 4, 2]],
  'part-10': [['shop-1', 110, 50, 0], ['shop-4', 105, 22, 1], ['shop-2', 120, 18, 1]],
  'part-11': [['shop-1', 520, 6, 1], ['shop-2', 560, 4, 2]],
  'part-12': [['shop-1', 390, 5, 1]],
  'part-13': [['shop-1', 150, 16, 0], ['shop-2', 160, 9, 1]],
  'part-14': [['shop-2', 180, 7, 1], ['shop-1', 190, 5, 1]],
  'part-15': [['shop-1', 980, 3, 2], ['shop-2', 1050, 2, 3]],
  'part-16': [['shop-1', 420, 6, 1], ['shop-4', 410, 4, 2]],
  'part-17': [['shop-1', 620, 10, 0], ['shop-2', 650, 6, 1], ['shop-4', 640, 8, 0]],
  'part-18': [['shop-1', 45, 60, 0], ['shop-4', 42, 40, 0], ['shop-2', 50, 25, 1]],
  'part-19': [['shop-1', 1450, 2, 2], ['shop-2', 1520, 1, 3]],
  'part-20': [['shop-1', 880, 4, 1], ['shop-2', 920, 2, 2]],
  'part-21': [['shop-1', 120, 18, 0], ['shop-4', 115, 10, 1]],
  'part-22': [['shop-1', 340, 7, 1], ['shop-2', 360, 4, 2]],
  'part-23': [['shop-2', 720, 3, 2], ['shop-1', 760, 2, 2]],
  'part-24': [['shop-1', 390, 6, 1], ['shop-2', 410, 4, 2]],
  'part-25': [['shop-1', 85, 40, 0], ['shop-4', 80, 22, 0], ['shop-2', 95, 15, 1]],
  'part-26': [['shop-1', 310, 3, 1]],
  'part-27': [['shop-1', 560, 5, 1], ['shop-2', 590, 2, 2]],
  'part-28': [['shop-1', 95, 22, 0], ['shop-4', 90, 12, 1]],
  'part-29': [['shop-1', 120, 80, 0], ['shop-2', 130, 40, 0], ['shop-4', 115, 30, 1]],
  'part-30': [['shop-1', 280, 9, 0], ['shop-2', 300, 5, 1]],
  'part-31': [['shop-1', 420, 30, 0], ['shop-4', 410, 18, 0], ['shop-2', 440, 12, 1]],
  'part-32': [['shop-1', 180, 25, 0], ['shop-4', 175, 14, 0]],
  'part-33': [['shop-1', 75, 35, 0], ['shop-2', 80, 20, 1], ['shop-4', 72, 16, 0]]
};

const buildOffers = () => {
  const out = [];
  let i = 1;
  Object.entries(OFFER_SEED).forEach(([pid, rows]) => {
    const part = INITIAL_PARTS.find(p => p.id === pid);
    if (!part) return;
    rows.forEach(([shopId, price, qty, days]) => {
      out.push({
        id: `off-${i++}`,
        shop_id: shopId,
        part_id: pid,
        raw_article: part.article,
        raw_name: part.name,
        price,
        currency: 'TJS',
        quantity: qty,
        is_available: qty > 0,
        delivery_days: days,
        updated_at: '2026-06-08T12:00:00Z',
        source_file: 'pricelist.xlsx'
      });
    });
  });
  return out;
};

const INITIAL_OFFERS = buildOffers();

const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    buyer_name: 'Фирдавс Раҳимов',
    buyer_phone: '+992 90 234-56-78',
    shop_id: 'shop-1',
    offer_id: 'off-1',
    part_name: 'Масляный фильтр Knecht-Mahle OC90',
    part_article: 'OC90',
    part_brand: 'Knecht-Mahle',
    price: 55,
    quantity: 2,
    status: 'completed',
    comment: 'Заберу сам сегодня вечером.',
    created_at: '2026-06-05T14:20:00Z',
    updated_at: '2026-06-05T18:00:00Z'
  },
  {
    id: 'ord-1002',
    buyer_name: 'Сафар Қодиров',
    buyer_phone: '+992 92 345-67-89',
    shop_id: 'shop-2',
    offer_id: 'off-12',
    part_name: 'Тормозные колодки Sangsin Hi-Q SP1399',
    part_article: 'SP1399',
    part_brand: 'Sangsin',
    price: 240,
    quantity: 1,
    status: 'new',
    comment: 'Уточните применимость на Солярис 2019 года.',
    created_at: '2026-06-06T20:10:00Z',
    updated_at: '2026-06-06T20:10:00Z'
  },
  {
    id: 'ord-1003',
    buyer_name: 'Далер Назаров',
    buyer_phone: '+992 98 456-78-90',
    shop_id: 'shop-1',
    offer_id: 'off-40',
    part_name: 'Свеча зажигания NGK Laser Platinum',
    part_article: 'ZGR6STE2',
    part_brand: 'NGK',
    price: 120,
    quantity: 4,
    status: 'accepted',
    comment: 'Нужны 4 свечи на Камри.',
    created_at: '2026-06-07T09:30:00Z',
    updated_at: '2026-06-07T10:05:00Z'
  }
];

const INITIAL_SEARCH_LOGS = [
  { id: 'sl-1', query: 'OC90', ip: '192.168.1.5', results_count: 2, created_at: '2026-06-06T12:00:00Z' },
  { id: 'sl-2', query: 'колодки солярис', ip: '192.168.1.12', results_count: 2, created_at: '2026-06-06T13:45:00Z' },
  { id: 'sl-3', query: 'свечи NGK', ip: '192.168.1.99', results_count: 1, created_at: '2026-06-06T15:20:00Z' },
  { id: 'sl-4', query: 'фильтр салона', ip: '192.168.1.200', results_count: 0, created_at: '2026-06-06T16:10:00Z' }
];

// Bump this when the seed data schema changes to auto-reset old localStorage caches.
const DATA_VERSION = '2026.06-tj-2';

const loadState = (key, fallback) => {
  try {
    if (localStorage.getItem('agg_data_version') !== DATA_VERSION) return fallback;
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch (e) {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  // Database States loaded from LocalStorage or defaults (version-gated)
  const [users, setUsers] = useState(() => loadState('agg_users', INITIAL_USERS));
  const [shops, setShops] = useState(() => loadState('agg_shops', INITIAL_SHOPS));
  const [parts, setParts] = useState(() => loadState('agg_parts', INITIAL_PARTS));
  const [offers, setOffers] = useState(() => loadState('agg_offers', INITIAL_OFFERS));
  const [orders, setOrders] = useState(() => loadState('agg_orders', INITIAL_ORDERS));
  const [searchLogs, setSearchLogs] = useState(() => loadState('agg_search_logs', INITIAL_SEARCH_LOGS));

  // Constants
  const [categories] = useState(INITIAL_CATEGORIES);
  const [vehicles] = useState(INITIAL_VEHICLES);
  const [plans, setPlans] = useState(() => loadState('agg_plans', INITIAL_PLANS));

  // Mark the active data version (runs after first paint, so the gated loads above see the old/mismatched version first)
  useEffect(() => { localStorage.setItem('agg_data_version', DATA_VERSION); }, []);

  // Active User / Session Simulator
  const [currentRole, setCurrentRole] = useState('buyer'); // 'buyer' | 'partner' | 'admin'
  const [activePartnerUserId, setActivePartnerUserId] = useState('user-partner-1'); // Default active partner dashboard is Shop 1

  // Auth gates (separate entrances per role; admin is hidden)
  const [partnerAuthed, setPartnerAuthed] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);

  // UI: theme + language
  const [theme, setTheme] = useState(() => localStorage.getItem('agg_theme') || 'dark');
  const [lang, setLang] = useState(() => localStorage.getItem('agg_lang') || 'ru');

  // Buyer "garage" — saved vehicles for quick part lookup
  const [garage, setGarage] = useState(() => JSON.parse(localStorage.getItem('agg_garage')) || []);

  // Apply + persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('agg_theme', theme);
  }, [theme]);
  useEffect(() => { localStorage.setItem('agg_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('agg_garage', JSON.stringify(garage)); }, [garage]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);

  const addToGarage = (vehicle) => {
    setGarage(prev => {
      const key = `${vehicle.make}|${vehicle.model}|${vehicle.year}`;
      if (prev.some(v => `${v.make}|${v.model}|${v.year}` === key)) return prev;
      return [{ id: `g-${Date.now()}`, ...vehicle }, ...prev].slice(0, 8);
    });
  };
  const removeFromGarage = (id) => setGarage(prev => prev.filter(v => v.id !== id));

  // Auth actions
  const loginPartner = (email, password) => {
    const user = users.find(u => u.role === 'partner' && u.email.toLowerCase() === String(email).trim().toLowerCase());
    if (!user) return { success: false, error: 'wrongEmail' };
    if (!password) return { success: false, error: 'wrongPass' };
    setActivePartnerUserId(user.id);
    setPartnerAuthed(true);
    setCurrentRole('partner');
    return { success: true };
  };
  const loginAdmin = (password) => {
    if (password !== ADMIN_PASSWORD) return { success: false, error: 'wrongPass' };
    setAdminAuthed(true);
    setCurrentRole('admin');
    return { success: true };
  };
  const logout = () => {
    setPartnerAuthed(false);
    setAdminAuthed(false);
    setCurrentRole('buyer');
    window.location.hash = '';
  };

  // Parsing & File upload logs
  const [parsingLogs, setParsingLogs] = useState(() => JSON.parse(localStorage.getItem('agg_parsing_logs')) || {});

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('agg_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('agg_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('agg_parts', JSON.stringify(parts));
  }, [parts]);

  useEffect(() => {
    localStorage.setItem('agg_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('agg_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('agg_search_logs', JSON.stringify(searchLogs));
  }, [searchLogs]);

  useEffect(() => {
    localStorage.setItem('agg_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('agg_parsing_logs', JSON.stringify(parsingLogs));
  }, [parsingLogs]);

  // Derived Values
  const activeShop = shops.find(s => s.user_id === activePartnerUserId);

  // Reset Database function (for developer testing)
  const resetDatabase = () => {
    if (window.confirm('Вы действительно хотите сбросить базу данных к начальным демо-значениям?')) {
      setUsers(INITIAL_USERS);
      setShops(INITIAL_SHOPS);
      setParts(INITIAL_PARTS);
      setOffers(INITIAL_OFFERS);
      setOrders(INITIAL_ORDERS);
      setSearchLogs(INITIAL_SEARCH_LOGS);
      setPlans(INITIAL_PLANS);
      setParsingLogs({});
      setCurrentRole('buyer');
      setActivePartnerUserId('user-partner-1');
      alert('База данных успешно сброшена!');
    }
  };

  /* -------------------------------------------------------------
     API SIMULATIONS (GETTERS & SETTERS)
     ------------------------------------------------------------- */

  // 1. Search Parts by query or car filters
  const searchParts = (query, make, model, year) => {
    // Log search query
    if (query && query.trim()) {
      const newLog = {
        id: `sl-${Date.now()}`,
        query: query.trim(),
        ip: '192.168.1.1',
        results_count: 0,
        created_at: new Date().toISOString()
      };
      
      // We will update results_count after filtering
      setTimeout(() => {
        setSearchLogs(prev => {
          const updated = [...prev];
          const logIdx = updated.findIndex(l => l.id === newLog.id);
          if (logIdx !== -1) {
            updated[logIdx].results_count = filtered.length;
          }
          return updated;
        });
      }, 100);

      setSearchLogs(prev => [newLog, ...prev]);
    }

    let filtered = [...parts];

    // Filter by text search (article or name or brand)
    if (query && query.trim()) {
      const q = query.trim().toUpperCase();
      const normQ = normalizeArticle(q);
      
      filtered = filtered.filter(p => {
        const matchArticle = normalizeArticle(p.article).includes(normQ);
        const matchName = p.name.toUpperCase().includes(q);
        const matchBrand = p.brand.toUpperCase().includes(q);
        const matchCross = p.cross_numbers.some(cross => normalizeArticle(cross).includes(normQ));
        const matchOem = p.oem_numbers && p.oem_numbers.some(oem => normalizeArticle(oem).includes(normQ));
        
        return matchArticle || matchName || matchBrand || matchCross || matchOem;
      });
    }

    // Filter by vehicle
    if (make || model || year) {
      filtered = filtered.filter(p => {
        if (!p.applicable_vehicles) return false;
        return p.applicable_vehicles.some(v => {
          const matchMake = make ? v.make.toLowerCase() === make.toLowerCase() : true;
          const matchModel = model ? v.model.toLowerCase() === model.toLowerCase() : true;
          const matchYear = year ? (year >= v.year_from && (v.year_to ? year <= v.year_to : true)) : true;
          return matchMake && matchModel && matchYear;
        });
      });
    }

    // Map each part to its lowest price and active offers count
    return filtered.map(p => {
      // Find all offers from ACTIVE shops
      const partOffers = offers.filter(o => {
        const shop = shops.find(s => s.id === o.shop_id);
        return o.part_id === p.id && o.is_available && o.quantity > 0 && shop && shop.status === 'active';
      });

      const prices = partOffers.map(o => o.price);
      const minPrice = prices.length > 0 ? Math.min(...prices) : null;
      const totalQuantity = partOffers.reduce((sum, o) => sum + o.quantity, 0);

      return {
        ...p,
        min_price: minPrice,
        offers_count: partOffers.length,
        total_quantity: totalQuantity,
        all_offers: partOffers
      };
    });
  };

  // Get details of a single part and its shop offers
  const getPartDetails = (partId) => {
    const part = parts.find(p => p.id === partId);
    if (!part) return null;

    // Get offers from active shops
    const partOffers = offers
      .filter(o => {
        const shop = shops.find(s => s.id === o.shop_id);
        return o.part_id === partId && o.is_available && o.quantity > 0 && shop && shop.status === 'active';
      })
      .map(o => {
        const shop = shops.find(s => s.id === o.shop_id);
        return {
          ...o,
          shop_name: shop ? shop.name : 'Неизвестный магазин',
          shop_address: shop ? shop.address : '',
          shop_phone: shop ? shop.phone : '',
          shop_hours: shop ? shop.working_hours : {}
        };
      })
      .sort((a, b) => a.price - b.price); // Cheapest first

    // Find cross-reference parts (alternatives)
    const normalizedCrosses = part.cross_numbers.map(c => normalizeArticle(c));
    const normalizedArticle = normalizeArticle(part.article);

    const crossParts = parts.filter(p => {
      if (p.id === partId) return false;
      const isCrossMatch = p.cross_numbers.some(c => normalizeArticle(c) === normalizedArticle) ||
                          normalizedCrosses.includes(normalizeArticle(p.article));
      return isCrossMatch;
    }).map(cp => {
      const cpOffers = offers.filter(o => {
        const shop = shops.find(s => s.id === o.shop_id);
        return o.part_id === cp.id && o.is_available && o.quantity > 0 && shop && shop.status === 'active';
      });
      const minPrice = cpOffers.length > 0 ? Math.min(...cpOffers.map(o => o.price)) : null;
      return { ...cp, min_price: minPrice, offers_count: cpOffers.length };
    });

    return {
      ...part,
      offers: partOffers,
      crosses: crossParts
    };
  };

  // 2. Submit new order
  const createOrder = (offerId, buyerName, buyerPhone, quantity, comment) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return { success: false, message: 'Предложение не найдено' };

    const part = parts.find(p => p.id === offer.part_id);
    if (!part) return { success: false, message: 'Деталь не найдена' };

    const newOrder = {
      id: `ord-${1000 + orders.length + 1}`,
      buyer_name: buyerName,
      buyer_phone: buyerPhone,
      shop_id: offer.shop_id,
      offer_id: offerId,
      part_name: part.name,
      part_article: part.article,
      part_brand: part.brand,
      price: offer.price,
      quantity: parseInt(quantity, 10) || 1,
      status: 'new',
      comment: comment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Decrease the offer's stock quantity locally
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        const newQty = Math.max(0, o.quantity - newOrder.quantity);
        return { ...o, quantity: newQty, is_available: newQty > 0 };
      }
      return o;
    }));

    return { success: true, order: newOrder };
  };

  // 3. Shop Partner actions
  const registerPartnerShop = (shopData) => {
    const newUserId = `user-partner-${Date.now()}`;
    const newShopId = `shop-${Date.now()}`;

    const newUser = {
      id: newUserId,
      email: shopData.email,
      role: 'partner',
      is_verified: true
    };

    const newShop = {
      id: newShopId,
      user_id: newUserId,
      name: shopData.name,
      description: shopData.description || '',
      logo_url: shopData.logo_url || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=160&auto=format&fit=crop&q=60',
      address: shopData.address,
      city: shopData.city || 'Душанбе',
      lat: 38.5598,
      lng: 68.7870,
      phone: shopData.phone,
      website_url: shopData.website_url || '',
      working_hours: shopData.working_hours || { mon: '9:00-18:00', tue: '9:00-18:00', wed: '9:00-18:00', thu: '9:00-18:00', fri: '9:00-18:00', sat: '10:00-15:00', sun: 'Истироҳат' },
      status: 'pending',
      subscription_plan: shopData.subscription_plan || 'plan-basic',
      subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setShops(prev => [...prev, newShop]);

    // Automatically set as active workspace partner to test
    setActivePartnerUserId(newUserId);
    setPartnerAuthed(true);
    setCurrentRole('partner');

    return { success: true, shop: newShop };
  };

  // Enter the partner registration screen (no shop yet)
  const enterPartnerRegistration = () => {
    setActivePartnerUserId('');
    setPartnerAuthed(true);
    setCurrentRole('partner');
  };

  const updateShopProfile = (shopId, updatedFields) => {
    setShops(prev => prev.map(s => {
      if (s.id === shopId) {
        return { ...s, ...updatedFields };
      }
      return s;
    }));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus, updated_at: new Date().toISOString() };
      }
      return o;
    }));
  };

  // 4. Admin actions
  const updateShopStatus = (shopId, newStatus) => {
    setShops(prev => prev.map(s => {
      if (s.id === shopId) {
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const createOrUpdateTariff = (planData) => {
    setPlans(prev => {
      const idx = prev.findIndex(p => p.id === planData.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...planData };
        return updated;
      } else {
        const newPlan = { ...planData, id: `plan-${Date.now()}` };
        return [...prev, newPlan];
      }
    });
  };

  /* -------------------------------------------------------------
     PARSING & MAPPING PRICELIST ALGORITHM (EXCEL / CSV)
     ------------------------------------------------------------- */
  const parseAndApplyPricelist = (shopId, rows, filename) => {
    if (!shopId) return { success: false, error: 'Магазин не выбран' };

    let parsedCount = 0;
    let addedOffers = 0;
    let updatedOffers = 0;
    let newPartsCreated = 0;
    const errors = [];

    const updatedOffersList = [...offers];
    const updatedPartsList = [...parts];

    // Find shop's plan to enforce limits
    const shop = shops.find(s => s.id === shopId);
    const plan = plans.find(p => p.id === shop?.subscription_plan);
    const limit = plan ? plan.max_offers : 100;

    const otherShopsOffers = updatedOffersList.filter(o => o.shop_id !== shopId);
    const shopNewOffers = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNum = i + 2;

      // Validate required fields
      if (!row.article || !row.brand || !row.name) {
        errors.push(`Строка ${lineNum}: Пропущены обязательные поля (Артикул, Бренд или Название)`);
        continue;
      }
      
      const price = parseFloat(row.price);
      const quantity = parseInt(row.quantity, 10);

      if (isNaN(price) || price < 0) {
        errors.push(`Строка ${lineNum}: Некорректная цена "${row.price}"`);
        continue;
      }

      if (isNaN(quantity) || quantity < 0) {
        errors.push(`Строка ${lineNum}: Некорректное количество "${row.quantity}"`);
        continue;
      }

      parsedCount++;

      // Enforce subscription limits
      if (shopNewOffers.length >= limit) {
        errors.push(`Строка ${lineNum}: Достигнут лимит тарифного плана в ${limit} товаров. Пропуск.`);
        continue;
      }

      const rawArticle = String(row.article);
      const normalizedArt = normalizeArticle(rawArticle);
      const brandClean = String(row.brand).trim();

      // MAPPING LOGIC
      let part = updatedPartsList.find(p => 
        normalizeArticle(p.article) === normalizedArt && 
        p.brand.toLowerCase() === brandClean.toLowerCase()
      );

      if (!part) {
        part = updatedPartsList.find(p => 
          p.cross_numbers.map(c => normalizeArticle(c)).includes(normalizedArt) && 
          p.brand.toLowerCase() === brandClean.toLowerCase()
        );
      }

      if (!part) {
        part = {
          id: `part-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          article: rawArticle.toUpperCase(),
          brand: brandClean,
          name: String(row.name).trim(),
          category_id: row.category_id || 'cat-filters',
          description: `Создано автоматически при загрузке прайс-листа из файла ${filename}.`,
          image_url: 'https://images.unsplash.com/photo-1552656967-7a0991a13906?w=400&auto=format&fit=crop&q=60',
          oem_numbers: [],
          cross_numbers: [],
          applicable_vehicles: row.make ? [
            {
              make: row.make,
              model: row.model || '',
              year_from: parseInt(row.year_from, 10) || 2010,
              year_to: parseInt(row.year_to, 10) || null,
              engine: row.engine || ''
            }
          ] : [],
          is_verified: false
        };
        updatedPartsList.push(part);
        newPartsCreated++;
      } else {
        if (row.make) {
          const hasVeh = part.applicable_vehicles.some(v => 
            v.make.toLowerCase() === row.make.toLowerCase() && 
            v.model.toLowerCase() === (row.model || '').toLowerCase()
          );
          if (!hasVeh) {
            part.applicable_vehicles.push({
              make: row.make,
              model: row.model || '',
              year_from: parseInt(row.year_from, 10) || 2010,
              year_to: parseInt(row.year_to, 10) || null,
              engine: row.engine || ''
            });
          }
        }
      }

      const newOffer = {
        id: `off-${shopId}-${normalizedArt}-${Date.now()}`,
        shop_id: shopId,
        part_id: part.id,
        raw_article: rawArticle,
        raw_name: String(row.name),
        price: price,
        currency: row.currency || 'TJS',
        quantity: quantity,
        is_available: quantity > 0,
        delivery_days: parseInt(row.delivery_days, 10) || 0,
        updated_at: new Date().toISOString(),
        source_file: filename
      };

      shopNewOffers.push(newOffer);
    }

    setOffers([...otherShopsOffers, ...shopNewOffers]);
    setParts(updatedPartsList);

    const log = {
      timestamp: new Date().toISOString(),
      filename: filename,
      rowsCount: rows.length,
      parsedCount: parsedCount,
      addedOffers: shopNewOffers.length,
      newPartsCreated: newPartsCreated,
      errors: errors
    };

    setParsingLogs(prev => ({
      ...prev,
      [shopId]: log
    }));

    return {
      success: true,
      log: log
    };
  };

  return (
    <AppContext.Provider value={{
      users,
      shops,
      parts,
      offers,
      orders,
      categories,
      vehicles,
      plans,
      searchLogs,
      currentRole,
      setCurrentRole,
      activePartnerUserId,
      setActivePartnerUserId,
      activeShop,
      parsingLogs,
      // UI
      theme,
      toggleTheme,
      lang,
      setLang,
      t,
      // garage
      garage,
      addToGarage,
      removeFromGarage,
      // auth
      partnerAuthed,
      adminAuthed,
      loginPartner,
      loginAdmin,
      logout,
      enterPartnerRegistration,
      resetDatabase,
      searchParts,
      getPartDetails,
      createOrder,
      registerPartnerShop,
      updateShopProfile,
      updateOrderStatus,
      updateShopStatus,
      createOrUpdateTariff,
      parseAndApplyPricelist
    }}>
      {children}
    </AppContext.Provider>
  );
};
