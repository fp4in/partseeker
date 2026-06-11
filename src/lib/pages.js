// Static info pages content (RU / TG / EN). Rendered by InfoModal.
// Each page: { title, sections: [{ h?, text }] }  (text may contain \n for line breaks)

const PAGES = {
  ru: {
    about: {
      title: 'О сайте',
      sections: [
        { text: 'PARTSEEKER — агрегатор автозапчастей для Таджикистана. Мы объединяем прайс-листы проверенных магазинов Душанбе, Худжанда, Бохтара и Куляба в едином поиске, чтобы вы быстро находили нужную деталь по лучшей цене.' },
        { h: 'Как это работает', text: 'Введите артикул, название или подберите деталь по марке автомобиля. Сравните цены, наличие и сроки в разных магазинах и оформите заявку онлайн — продавец свяжется с вами по телефону.' },
        { h: 'Почему мы', text: '• Единый поиск по десяткам магазинов\n• Подбор аналогов и кросс-номеров\n• Проверенные магазины-партнёры\n• Актуальные цены в сомонӣ и наличие на складе' }
      ]
    },
    howto: {
      title: 'Как заказать',
      sections: [
        { h: '1. Найдите деталь', text: 'Поиск по артикулу/названию, по VIN или подбор по марке, модели и году автомобиля. Сохраните авто в «Гараж» для быстрого подбора.' },
        { h: '2. Сравните предложения', text: 'Откройте карточку детали — увидите цены всех магазинов, наличие, сроки доставки и аналоги (кросс-номера).' },
        { h: '3. Оформите заявку', text: 'Нажмите «Заказать», укажите имя и телефон. Заявка уходит в магазин, представитель перезвонит для подтверждения.' },
        { h: '4. Получите деталь', text: 'Заберите самовывозом или закажите доставку — условия уточняйте у магазина.' }
      ]
    },
    partner: {
      title: 'Магазинам — стать партнёром',
      sections: [
        { text: 'Размещайте свой ассортимент на PARTSEEKER и получайте заявки от покупателей по всему Таджикистану.' },
        { h: 'Загрузка прайса', text: 'Загружайте прайс-лист в формате Excel (.xlsx) или CSV. Система сама сопоставит товары с каталогом и аналогами.' },
        { h: 'Тарифы', text: 'Базовый — до 100 товаров, Стандарт — до 1000, Премиум — до 10 000 с приоритетом в поиске и аналитикой. Стоимость в сомонӣ в месяц.' },
        { h: 'Аналитика', text: 'Отслеживайте показы в поиске, переходы и заявки в личном кабинете партнёра.' },
        { text: 'Чтобы начать — нажмите «Для бизнеса» в шапке и зарегистрируйте магазин.' }
      ]
    },
    privacy: {
      title: 'Политика конфиденциальности',
      sections: [
        { text: 'Настоящая Политика описывает, как PARTSEEKER обрабатывает персональные данные пользователей.' },
        { h: '1. Какие данные мы собираем', text: 'Имя и номер телефона при оформлении заявки, поисковые запросы, технические данные (тип устройства, язык, выбранная тема). Платёжные данные мы не собираем.' },
        { h: '2. Цели обработки', text: 'Передача заявки магазину для связи с вами, улучшение поиска и каталога, обезличенная статистика.' },
        { h: '3. Передача третьим лицам', text: 'Контактные данные передаются только тому магазину, в котором вы оформили заявку. Мы не продаём данные третьим лицам.' },
        { h: '4. Хранение', text: 'Демо-версия хранит данные локально в вашем браузере (localStorage) и не передаёт их на внешние серверы.' },
        { h: '5. Ваши права', text: 'Вы можете запросить удаление своих данных, написав на support@partseeker.tj.' }
      ]
    },
    terms: {
      title: 'Условия использования',
      sections: [
        { text: 'Используя PARTSEEKER, вы принимаете настоящие условия.' },
        { h: '1. Сервис', text: 'PARTSEEKER — информационная площадка-агрегатор. Мы не продаём запчасти напрямую, а помогаем найти их у магазинов-партнёров.' },
        { h: '2. Цены и наличие', text: 'Цены, наличие и сроки указываются магазинами и могут меняться. Итоговые условия подтверждает магазин при обработке заявки.' },
        { h: '3. Ответственность', text: 'За качество товара, доставку и гарантию отвечает магазин-продавец. Проверяйте применимость детали к вашему авто перед покупкой.' },
        { h: '4. Контент партнёров', text: 'Магазины несут ответственность за достоверность загружаемых прайс-листов и характеристик товаров.' }
      ]
    },
    contacts: {
      title: 'Контакты',
      sections: [
        { h: 'Поддержка', text: 'E-mail: support@partseeker.tj\nТелефон: +992 44 600-00-00\nTelegram / WhatsApp: +992 90 000-00-00' },
        { h: 'Для магазинов', text: 'По вопросам партнёрства и размещения: partners@partseeker.tj' },
        { h: 'Адрес', text: 'ш. Душанбе, хиёбони Рӯдакӣ, 84' },
        { h: 'Режим работы', text: 'Пн–Пт: 9:00–18:00, Сб: 10:00–15:00, Вс: выходной' }
      ]
    }
  },

  tg: {
    about: {
      title: 'Дар бораи сайт',
      sections: [
        { text: 'PARTSEEKER — агрегатори эҳтиётқисмҳои автомобил барои Тоҷикистон. Мо прайс-листи мағозаҳои санҷидашудаи Душанбе, Хуҷанд, Бохтар ва Кӯлобро дар як ҷустуҷӯи ягона ҷамъ меорем, то шумо қисми даркориро бо нархи беҳтарин зуд ёбед.' },
        { h: 'Чӣ тавр кор мекунад', text: 'Артикул, ном ё аз рӯи бренди мошина ҷустуҷӯ кунед. Нарх, мавҷудӣ ва мӯҳлатро муқоиса карда, фармоишро онлайн расмӣ кунед — фурӯшанда бо шумо тамос мегирад.' },
        { h: 'Бартариҳои мо', text: '• Ҷустуҷӯи ягона аз даҳҳо мағоза\n• Интихоби аналог ва кросс-рақамҳо\n• Мағозаҳои санҷидашуда\n• Нархҳои воқеӣ ба сомонӣ ва мавҷудӣ' }
      ]
    },
    howto: {
      title: 'Чӣ тавр фармоиш додан',
      sections: [
        { h: '1. Қисмро ёбед', text: 'Ҷустуҷӯ аз рӯи артикул/ном, аз рӯи VIN ё интихоб аз рӯи бренд, модел ва соли мошина. Мошинаро ба «Гараж» нигоҳ доред.' },
        { h: '2. Пешниҳодҳоро муқоиса кунед', text: 'Корти қисмро кушоед — нархи ҳамаи мағозаҳо, мавҷудӣ, мӯҳлат ва аналогҳоро мебинед.' },
        { h: '3. Фармоиш диҳед', text: 'Тугмаи «Фармоиш»-ро пахш кунед, ном ва телефонро нависед. Дархост ба мағоза меравад ва намоянда занг мезанад.' },
        { h: '4. Қисмро гиред', text: 'Худатон гиред ё расондан фармоиш диҳед — шартҳоро аз мағоза пурсед.' }
      ]
    },
    partner: {
      title: 'Ба мағозаҳо — шарик шудан',
      sections: [
        { text: 'Молҳои худро дар PARTSEEKER ҷойгир кунед ва аз тамоми Тоҷикистон дархост гиред.' },
        { h: 'Боркунии прайс', text: 'Прайс-листро дар формати Excel (.xlsx) ё CSV бор кунед. Система молҳоро бо каталог ва аналогҳо мутобиқ мекунад.' },
        { h: 'Тарифҳо', text: 'Базавӣ — то 100 мол, Стандарт — то 1000, Премиум — то 10 000 бо афзалият дар ҷустуҷӯ. Нарх ба сомонӣ дар як моҳ.' },
        { h: 'Таҳлил', text: 'Намоишҳо, гузаришҳо ва дархостҳоро дар кабинети шарик пайгирӣ кунед.' },
        { text: 'Барои оғоз — дар сарлавҳа «Барои бизнес»-ро пахш карда, мағоза сабт кунед.' }
      ]
    },
    privacy: {
      title: 'Сиёсати махфият',
      sections: [
        { text: 'Ин сиёсат тарзи коркарди маълумоти шахсии корбаронро дар PARTSEEKER шарҳ медиҳад.' },
        { h: '1. Кадом маълумотро ҷамъ мекунем', text: 'Ном ва рақами телефон ҳангоми фармоиш, дархостҳои ҷустуҷӯ, маълумоти техникӣ. Маълумоти пардохтро ҷамъ намекунем.' },
        { h: '2. Мақсадҳо', text: 'Расондани дархост ба мағоза, беҳтар кардани ҷустуҷӯ ва омори беном.' },
        { h: '3. Интиқол ба шахсони сеюм', text: 'Маълумоти тамос танҳо ба мағозае, ки шумо фармоиш додед, дода мешавад. Мо маълумотро намефурӯшем.' },
        { h: '4. Нигоҳдорӣ', text: 'Версияи намоишӣ маълумотро дар браузери шумо (localStorage) нигоҳ медорад ва ба серверҳои берунӣ намефиристад.' },
        { h: '5. Ҳуқуқҳои шумо', text: 'Шумо метавонед нест кардани маълумоти худро ба support@partseeker.tj дархост кунед.' }
      ]
    },
    terms: {
      title: 'Шартҳои истифода',
      sections: [
        { text: 'Бо истифода аз PARTSEEKER шумо ин шартҳоро қабул мекунед.' },
        { h: '1. Хидмат', text: 'PARTSEEKER майдончаи иттилоотӣ-агрегатор аст. Мо қисмҳоро мустақим намефурӯшем, балки ёфтани онҳоро дар мағозаҳои шарик осон мекунем.' },
        { h: '2. Нарх ва мавҷудӣ', text: 'Нарх, мавҷудӣ ва мӯҳлатро мағозаҳо муайян мекунанд ва метавонанд тағйир ёбанд.' },
        { h: '3. Масъулият', text: 'Барои сифат, расондан ва кафолат мағозаи фурӯшанда масъул аст. Мувофиқати қисмро ба мошинаи худ санҷед.' },
        { h: '4. Контенти шарикон', text: 'Мағозаҳо барои дурустии прайс ва хусусиятҳои мол масъуланд.' }
      ]
    },
    contacts: {
      title: 'Тамос',
      sections: [
        { h: 'Дастгирӣ', text: 'E-mail: support@partseeker.tj\nТелефон: +992 44 600-00-00\nTelegram / WhatsApp: +992 90 000-00-00' },
        { h: 'Барои мағозаҳо', text: 'Оид ба шарикӣ: partners@partseeker.tj' },
        { h: 'Суроға', text: 'ш. Душанбе, хиёбони Рӯдакӣ, 84' },
        { h: 'Вақти корӣ', text: 'Душанбе–Ҷумъа: 9:00–18:00, Шанбе: 10:00–15:00, Якшанбе: истироҳат' }
      ]
    }
  },

  en: {
    about: {
      title: 'About',
      sections: [
        { text: 'PARTSEEKER is an auto parts aggregator for Tajikistan. We combine the price lists of verified shops in Dushanbe, Khujand, Bokhtar and Kulob into a single search so you can find the right part at the best price.' },
        { h: 'How it works', text: 'Search by part number or name, or pick a part by your car. Compare prices, stock and delivery across shops and place a request online — the seller will call you back.' },
        { h: 'Why us', text: '• Unified search across dozens of shops\n• Analog & cross-reference matching\n• Verified partner shops\n• Live prices in somoni and stock levels' }
      ]
    },
    howto: {
      title: 'How to order',
      sections: [
        { h: '1. Find the part', text: 'Search by part number/name, by VIN, or pick by make, model and year. Save a car to "My garage" for quick lookups.' },
        { h: '2. Compare offers', text: 'Open the part card to see all shops’ prices, stock, delivery times and analogs (cross numbers).' },
        { h: '3. Place a request', text: 'Click "Order", enter your name and phone. The request goes to the shop and a representative calls to confirm.' },
        { h: '4. Get the part', text: 'Pick it up or arrange delivery — terms are confirmed by the shop.' }
      ]
    },
    partner: {
      title: 'For shops — become a partner',
      sections: [
        { text: 'List your inventory on PARTSEEKER and receive requests from buyers across Tajikistan.' },
        { h: 'Price upload', text: 'Upload your price list in Excel (.xlsx) or CSV. The system matches items to the catalog and analogs automatically.' },
        { h: 'Plans', text: 'Basic — up to 100 items, Standard — up to 1,000, Premium — up to 10,000 with search priority and analytics. Priced in somoni per month.' },
        { h: 'Analytics', text: 'Track search impressions, clicks and requests in the partner cabinet.' },
        { text: 'To start — click "For business" in the header and register your shop.' }
      ]
    },
    privacy: {
      title: 'Privacy policy',
      sections: [
        { text: 'This policy explains how PARTSEEKER processes users’ personal data.' },
        { h: '1. Data we collect', text: 'Name and phone number when placing a request, search queries, technical data (device, language, theme). We do not collect payment data.' },
        { h: '2. Purposes', text: 'Forwarding your request to the shop, improving search and catalog, anonymized statistics.' },
        { h: '3. Sharing', text: 'Contact details are shared only with the shop where you placed a request. We do not sell data to third parties.' },
        { h: '4. Storage', text: 'The demo stores data locally in your browser (localStorage) and does not send it to external servers.' },
        { h: '5. Your rights', text: 'You can request deletion of your data at support@partseeker.tj.' }
      ]
    },
    terms: {
      title: 'Terms of use',
      sections: [
        { text: 'By using PARTSEEKER you accept these terms.' },
        { h: '1. Service', text: 'PARTSEEKER is an information aggregator. We do not sell parts directly; we help you find them at partner shops.' },
        { h: '2. Prices & stock', text: 'Prices, stock and lead times are set by shops and may change. Final terms are confirmed by the shop.' },
        { h: '3. Liability', text: 'The selling shop is responsible for product quality, delivery and warranty. Verify part fitment for your car before buying.' },
        { h: '4. Partner content', text: 'Shops are responsible for the accuracy of uploaded price lists and product specifications.' }
      ]
    },
    contacts: {
      title: 'Contacts',
      sections: [
        { h: 'Support', text: 'E-mail: support@partseeker.tj\nPhone: +992 44 600-00-00\nTelegram / WhatsApp: +992 90 000-00-00' },
        { h: 'For shops', text: 'Partnership inquiries: partners@partseeker.tj' },
        { h: 'Address', text: 'Dushanbe, Rudaki Ave, 84' },
        { h: 'Hours', text: 'Mon–Fri: 9:00–18:00, Sat: 10:00–15:00, Sun: closed' }
      ]
    }
  }
};

export const getPage = (lang, key) => (PAGES[lang] || PAGES.ru)[key] || PAGES.ru[key];
