// -------------------------------------------------------------
// PARTSEEKER — Lightweight i18n (RU / TG / EN)
// Public site + chrome + auth + dashboard nav are fully localized.
// Missing keys fall back to Russian, then to the key itself.
// -------------------------------------------------------------

export const ADMIN_PASSWORD = 'partseeker2026';

export const LANGS = [
  { code: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
  { code: 'tg', label: 'Тоҷикӣ', short: 'TJ', flag: '🇹🇯' },
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' }
];

const dict = {
  ru: {
    // chrome
    'brand.tagline': 'Агрегатор автозапчастей',
    'nav.searchParts': 'Поиск запчастей',
    'nav.partnerCabinet': 'Кабинет партнёра',
    'nav.admin': 'Администрирование',
    'btn.partnerLogin': 'Для бизнеса',
    'btn.logout': 'Выйти',
    'theme.toLight': 'Светлая тема',
    'theme.toDark': 'Тёмная тема',
    'app.exitHint': 'Нажмите «Назад» ещё раз для выхода',
    'app.offline': 'Нет подключения к интернету',
    'app.online': 'Соединение восстановлено',
    'role.buyer': 'Покупатель',
    'role.partner': 'Магазин-партнёр',
    'role.admin': 'Администратор',

    // hero
    'hero.eyebrow': '{parts}+ деталей · {shops} магазинов · цены онлайн',
    'hero.title': 'Найдите нужную автозапчасть за секунды',
    'hero.subtitle': 'Поиск по артикулу, бренду, названию или марке авто. Сравнивайте предложения магазинов вашего города и заказывайте по лучшей цене.',
    'search.placeholderText': 'Введите артикул (например, OC90) или название...',
    'search.placeholderVin': 'Введите VIN (17 символов), например WVWZZZ1KZAW000001',
    'search.find': 'Найти',
    'search.byText': 'По артикулу',
    'search.byVin': 'По VIN',
    'search.popular': 'Популярное:',
    'vin.hint': 'Поиск по VIN подбирает детали под конкретный автомобиль (демо).',

    // features
    'feat.prices.t': 'Лучшие цены', 'feat.prices.d': 'Сравниваем предложения всех магазинов и показываем минимальную цену.',
    'feat.cross.t': 'Аналоги и кроссы', 'feat.cross.d': 'Подбираем замены по кросс-номерам, если оригинала нет в наличии.',
    'feat.verified.t': 'Проверенные магазины', 'feat.verified.d': 'Все партнёры проходят модерацию администрацией платформы.',
    'feat.stock.t': 'Наличие и сроки', 'feat.stock.d': 'Видите остатки и срок доставки до оформления заявки.',

    // car selector / garage
    'car.title': 'Подбор по автомобилю',
    'car.catalog': 'Весь каталог',
    'car.make': 'Марка авто', 'car.model': 'Модель', 'car.year': 'Год выпуска', 'car.engine': 'Двигатель',
    'car.clear': 'Очистить', 'car.pick': 'Подобрать детали', 'car.toGarage': 'В гараж',
    'garage.title': 'Мой гараж', 'garage.empty': 'Сохраните авто, чтобы быстро подбирать детали.', 'garage.remove': 'Удалить',

    // sections
    'sec.categories': 'Категории запчастей',
    'sec.popular': 'Часто ищут',
    'sec.shops': 'Магазины-партнёры',

    // results
    'res.filters': 'Фильтры', 'res.category': 'Категория', 'res.allCategories': 'Все категории',
    'res.price': 'Цена, сом.', 'res.from': 'От', 'res.to': 'До', 'res.brand': 'Производитель', 'res.shop': 'Магазин',
    'res.inStock': 'Только в наличии', 'res.reset': 'Сбросить фильтры',
    'res.byQuery': 'По запросу', 'res.byCategory': 'Категория', 'res.found': 'найдено',
    'res.sort': 'Сортировка', 'res.cheap': 'Сначала дешевле', 'res.expensive': 'Сначала дороже', 'res.offers': 'Больше предложений',
    'res.notFoundT': 'Запчасти не найдены', 'res.notFoundD': 'Попробуйте изменить запрос, сбросить фильтры или выбрать другую категорию.',
    'res.showCatalog': 'Показать весь каталог',
    'res.pricesFrom': 'цены от', 'res.noStock': 'Нет в наличии', 'res.pricesAvail': 'Цены и наличие',
    'res.offer1': 'предложение', 'res.offer2': 'предложения', 'res.offer5': 'предложений',

    // detail
    'det.notVerified': 'Не верифицировано', 'det.inStock': 'В наличии', 'det.article': 'Артикул',
    'det.bestPrice': 'Лучшая цена', 'det.offersCount': 'Предложений', 'det.pricesInShops': 'Цены в магазинах',
    'det.shopAddr': 'Магазин и адрес', 'det.term': 'Срок', 'det.avail': 'Наличие', 'det.price': 'Цена', 'det.action': 'Действие',
    'det.today': 'Сегодня', 'det.day': 'день', 'det.days': 'дня', 'det.order': 'Заказать', 'det.bestTag': 'лучшая цена',
    'det.analogs': 'Аналоги и кросс-номера', 'det.noAnalogs': 'Для этой детали в базе пока нет аналогов.',
    'det.watch': 'Смотреть', 'det.applicability': 'Применимость к автомобилям', 'det.noOffers': 'Нет активных предложений для этой детали.',

    // shop
    'shop.catalog': 'Каталог магазина', 'shop.map': 'Расположение на карте', 'shop.noItems': 'В магазине пока нет товаров.',
    'shop.today': 'Сегодня', 'shop.openMap': 'Открыть в Яндекс.Картах', 'shop.route': 'Построить маршрут',

    // order
    'ord.title': 'Оформление заказа', 'ord.selected': 'ВЫБРАННЫЙ ТОВАР', 'ord.shop': 'Магазин', 'ord.priceLbl': 'Цена',
    'ord.name': 'Ваше имя', 'ord.phone': 'Номер телефона', 'ord.qty': 'Количество', 'ord.available': 'Доступно',
    'ord.total': 'Итого', 'ord.comment': 'Комментарий (необязательно)', 'ord.commentPh': 'VIN авто для проверки, время самовывоза и т.д.',
    'ord.submit': 'Оформить заказ', 'ord.successT': 'Заказ успешно создан!', 'ord.num': 'Номер заказа',
    'ord.successD': 'Заявка отправлена в магазин. Представитель свяжется с вами по телефону.', 'ord.great': 'Закрыть',
    'ord.sendHint': 'Отправьте заказ магазину, чтобы он связался с вами быстрее:',
    'ord.sendWa': 'Отправить в WhatsApp', 'ord.sendTg': 'Отправить в Telegram',
    'ord.waHeader': 'Новый заказ через', 'ord.noPhone': 'У магазина не указан номер для связи',
    'ord.namePh': 'Например, Иван', 'ord.perPc': '/ шт.',

    // common nav
    'common.back': 'Назад', 'common.results': 'Результаты поиска', 'common.detail': 'Карточка детали', 'common.shopProfile': 'Профиль магазина',

    // auth
    'auth.partnerTitle': 'Вход для партнёров', 'auth.adminTitle': 'Вход администратора',
    'auth.email': 'E-mail', 'auth.password': 'Пароль', 'auth.login': 'Войти', 'auth.cancel': 'Отмена',
    'auth.toRegister': 'Нет аккаунта? Зарегистрировать магазин', 'auth.partnerDemo': 'Демо: e-mail существующего магазина, пароль — любой.',
    'auth.adminHint': 'Доступ только для администратора платформы.', 'auth.wrongPass': 'Неверный пароль.', 'auth.wrongEmail': 'Магазин с таким e-mail не найден.',
    'auth.register': 'Регистрация магазина',
    'buyer.authTitle': 'Добро пожаловать', 'buyer.authSubtitle': 'Войдите или зарегистрируйтесь, чтобы искать запчасти и оформлять заказы.',
    'buyer.tabLogin': 'Вход', 'buyer.tabRegister': 'Регистрация', 'buyer.name': 'Имя', 'buyer.namePh': 'Ваше имя',
    'buyer.signIn': 'Войти', 'buyer.signUp': 'Создать аккаунт', 'buyer.logout': 'Выйти', 'buyer.hi': 'Привет, {name}!',
    'buyer.localNote': 'Аккаунт хранится на этом устройстве.', 'buyer.partnerLink': 'Вы магазин-партнёр? Вход — в шапке.',
    'buyer.badEmail': 'Введите корректный e-mail.', 'buyer.shortPass': 'Пароль — минимум 4 символа.',
    'buyer.exists': 'Аккаунт с таким e-mail уже есть — войдите.', 'buyer.noUser': 'Аккаунт не найден — зарегистрируйтесь.',
    'buyer.wrongPass': 'Неверный пароль.',
    'cart.add': 'В корзину', 'cart.added': 'Добавлено в корзину', 'cart.title': 'Корзина', 'cart.empty': 'Корзина пуста',
    'cart.emptyHint': 'Добавьте детали из поиска — и они появятся здесь.', 'cart.myOrders': 'Мои заказы',
    'cart.ordersEmpty': 'У вас пока нет заказов.', 'cart.total': 'Итого', 'cart.checkout': 'Оформить заказ',
    'cart.repeat': 'Повторить', 'cart.continue': 'Продолжить покупки', 'cart.qty': 'Кол-во', 'cart.remove': 'Убрать',
    'cart.shopOrder': 'Заказ магазину', 'cart.placedOk': 'Заказы оформлены!', 'cart.placedHint': 'Отправьте их магазинам в один тап.',
    'cart.sendShop': 'Отправить магазину', 'cart.positions': 'позиций', 'cart.goCart': 'Перейти в корзину',
    'cart.st.new': 'Новый', 'cart.st.accepted': 'Принят', 'cart.st.ready': 'Готов к выдаче', 'cart.st.completed': 'Выдан', 'cart.st.cancelled': 'Отменён',

    // footer
    'foot.about': 'Агрегатор автозапчастей: единый поиск по артикулу, бренду и марке авто. Сравнивайте цены магазинов-партнёров и заказывайте выгодно.',
    'foot.buyers': 'Покупателям', 'foot.shops': 'Магазинам', 'foot.contacts': 'Контакты',
    'foot.l1': 'Поиск по артикулу', 'foot.l2': 'Подбор по авто', 'foot.l3': 'Аналоги и кроссы', 'foot.l4': 'Как заказать',
    'foot.s1': 'Стать партнёром', 'foot.s2': 'Загрузка прайса', 'foot.s3': 'Тарифы', 'foot.s4': 'Аналитика',
    'foot.copy': 'Демо-платформа агрегатора автозапчастей',

    // partner/admin nav + headings
    'p.overview': 'Обзор профиля', 'p.pricelist': 'Управление прайсом', 'p.orders': 'Заказы', 'p.stats': 'Статистика',
    'a.partners': 'Партнёры', 'a.orders': 'Все заказы', 'a.tariffs': 'Тарифные планы', 'a.searchLogs': 'Лог поисков',
    'a.resetDb': 'Сбросить демо-БД',

    'unit.pcs': 'шт.', 'common.close': 'Закрыть',
    'share.title': 'Поделиться', 'share.copied': 'Ссылка скопирована',
    'foot.aboutLink': 'О сайте', 'foot.privacy': 'Политика конфиденциальности', 'foot.terms': 'Условия использования',

    'cat.cat-engine': 'Двигатель', 'cat.cat-brakes': 'Тормозная система', 'cat.cat-suspension': 'Подвеска',
    'cat.cat-steering': 'Рулевое управление', 'cat.cat-transmission': 'Трансмиссия и сцепление', 'cat.cat-filters': 'Фильтры',
    'cat.cat-electrical': 'Электрика и освещение', 'cat.cat-cooling-heating': 'Охлаждение и отопление', 'cat.cat-exhaust': 'Выхлопная система',
    'cat.cat-body': 'Кузовные детали', 'cat.cat-fuel-system': 'Топливная система', 'cat.cat-ignition': 'Система зажигания',
    'cat.cat-maintenance': 'Расходники и автохимия'
  },

  tg: {
    'brand.tagline': 'Агрегатори эҳтиётқисмҳои автомобил',
    'nav.searchParts': 'Ҷустуҷӯи қисмҳо',
    'nav.partnerCabinet': 'Кабинети шарик',
    'nav.admin': 'Маъмурият',
    'btn.partnerLogin': 'Барои бизнес',
    'btn.logout': 'Баромадан',
    'theme.toLight': 'Мавзӯи равшан',
    'theme.toDark': 'Мавзӯи торик',
    'app.exitHint': 'Барои баромадан «Бозгашт»-ро боз як бор пахш кунед',
    'app.offline': 'Пайвасти интернет нест',
    'app.online': 'Пайваст барқарор шуд',
    'role.buyer': 'Харидор',
    'role.partner': 'Мағозаи шарик',
    'role.admin': 'Маъмур',

    'hero.eyebrow': '{parts}+ қисм · {shops} мағоза · нархҳо онлайн',
    'hero.title': 'Қисми даркориро дар якчанд сония ёбед',
    'hero.subtitle': 'Ҷустуҷӯ аз рӯи артикул, бренд, ном ё мошина. Пешниҳодҳои мағозаҳои шаҳри худро муқоиса кунед ва бо нархи беҳтарин фармоиш диҳед.',
    'search.placeholderText': 'Артикул (масалан, OC90) ё номро ворид кунед...',
    'search.placeholderVin': 'VIN-ро ворид кунед (17 аломат), масалан WVWZZZ1KZAW000001',
    'search.find': 'Ёфтан',
    'search.byText': 'Аз рӯи артикул',
    'search.byVin': 'Аз рӯи VIN',
    'search.popular': 'Машҳур:',
    'vin.hint': 'Ҷустуҷӯ аз рӯи VIN қисмҳоро ба мошинаи мушаххас интихоб мекунад (намоиш).',

    'feat.prices.t': 'Беҳтарин нархҳо', 'feat.prices.d': 'Пешниҳоди ҳамаи мағозаҳоро муқоиса карда, нархи камтаринро нишон медиҳем.',
    'feat.cross.t': 'Аналогҳо ва кроссҳо', 'feat.cross.d': 'Агар асл набошад, аз рӯи кросс-рақамҳо ивазкунанда меёбем.',
    'feat.verified.t': 'Мағозаҳои санҷидашуда', 'feat.verified.d': 'Ҳамаи шарикон аз модератсияи маъмурият мегузаранд.',
    'feat.stock.t': 'Мавҷудӣ ва мӯҳлат', 'feat.stock.d': 'Боқимонда ва мӯҳлати расонданро пеш аз фармоиш мебинед.',

    'car.title': 'Интихоб аз рӯи мошина',
    'car.catalog': 'Тамоми каталог',
    'car.make': 'Бренди мошина', 'car.model': 'Модел', 'car.year': 'Соли истеҳсол', 'car.engine': 'Муҳаррик',
    'car.clear': 'Тоза кардан', 'car.pick': 'Интихоби қисмҳо', 'car.toGarage': 'Ба гараж',
    'garage.title': 'Гаражи ман', 'garage.empty': 'Мошинаро нигоҳ доред, то зуд қисм интихоб кунед.', 'garage.remove': 'Нест кардан',

    'sec.categories': 'Категорияҳои қисмҳо',
    'sec.popular': 'Бештар меҷӯянд',
    'sec.shops': 'Мағозаҳои шарик',

    'res.filters': 'Филтрҳо', 'res.category': 'Категория', 'res.allCategories': 'Ҳамаи категорияҳо',
    'res.price': 'Нарх, сом.', 'res.from': 'Аз', 'res.to': 'То', 'res.brand': 'Истеҳсолкунанда', 'res.shop': 'Мағоза',
    'res.inStock': 'Танҳо мавҷуд', 'res.reset': 'Бекор кардани филтрҳо',
    'res.byQuery': 'Аз рӯи дархост', 'res.byCategory': 'Категория', 'res.found': 'ёфт шуд',
    'res.sort': 'Мураттабсозӣ', 'res.cheap': 'Аввал арзонтар', 'res.expensive': 'Аввал гаронтар', 'res.offers': 'Бештар пешниҳод',
    'res.notFoundT': 'Қисмҳо ёфт нашуданд', 'res.notFoundD': 'Дархостро тағйир диҳед, филтрҳоро бекор кунед ё категорияи дигар интихоб кунед.',
    'res.showCatalog': 'Тамоми каталогро нишон диҳед',
    'res.pricesFrom': 'нарх аз', 'res.noStock': 'Мавҷуд нест', 'res.pricesAvail': 'Нарх ва мавҷудӣ',
    'res.offer1': 'пешниҳод', 'res.offer2': 'пешниҳод', 'res.offer5': 'пешниҳод',

    'det.notVerified': 'Тасдиқнашуда', 'det.inStock': 'Мавҷуд', 'det.article': 'Артикул',
    'det.bestPrice': 'Беҳтарин нарх', 'det.offersCount': 'Пешниҳодҳо', 'det.pricesInShops': 'Нархҳо дар мағозаҳо',
    'det.shopAddr': 'Мағоза ва суроға', 'det.term': 'Мӯҳлат', 'det.avail': 'Мавҷудӣ', 'det.price': 'Нарх', 'det.action': 'Амал',
    'det.today': 'Имрӯз', 'det.day': 'рӯз', 'det.days': 'рӯз', 'det.order': 'Фармоиш', 'det.bestTag': 'беҳтарин нарх',
    'det.analogs': 'Аналогҳо ва кросс-рақамҳо', 'det.noAnalogs': 'Барои ин қисм ҳоло аналог нест.',
    'det.watch': 'Дидан', 'det.applicability': 'Мувофиқат ба мошинаҳо', 'det.noOffers': 'Барои ин қисм пешниҳоди фаъол нест.',

    'shop.catalog': 'Каталоги мағоза', 'shop.map': 'Ҷойгиршавӣ дар харита', 'shop.noItems': 'Дар мағоза ҳоло мол нест.',
    'shop.today': 'Имрӯз', 'shop.openMap': 'Кушодан дар Яндекс.Харита', 'shop.route': 'Сохтани масир',

    'ord.title': 'Расмиёти фармоиш', 'ord.selected': 'МОЛИ ИНТИХОБШУДА', 'ord.shop': 'Мағоза', 'ord.priceLbl': 'Нарх',
    'ord.name': 'Номи шумо', 'ord.phone': 'Рақами телефон', 'ord.qty': 'Миқдор', 'ord.available': 'Мавҷуд',
    'ord.total': 'Ҳамагӣ', 'ord.comment': 'Шарҳ (ихтиёрӣ)', 'ord.commentPh': 'VIN барои санҷиш, вақти гирифтан ва ғ.',
    'ord.submit': 'Фармоиш додан', 'ord.successT': 'Фармоиш бомуваффақият сохта шуд!', 'ord.num': 'Рақами фармоиш',
    'ord.successD': 'Дархост ба мағоза фиристода шуд. Намоянда бо шумо тамос мегирад.', 'ord.great': 'Пӯшидан',
    'ord.sendHint': 'Фармоишро ба мағоза фиристед, то зудтар бо шумо тамос гирад:',
    'ord.sendWa': 'Ба WhatsApp фиристодан', 'ord.sendTg': 'Ба Telegram фиристодан',
    'ord.waHeader': 'Фармоиши нав тавассути', 'ord.noPhone': 'Мағоза рақами тамос надорад',
    'ord.namePh': 'Масалан, Алӣ', 'ord.perPc': '/ дона',

    'common.back': 'Бозгашт', 'common.results': 'Натиҷаҳои ҷустуҷӯ', 'common.detail': 'Корти қисм', 'common.shopProfile': 'Профили мағоза',

    'auth.partnerTitle': 'Вуруд барои шарикон', 'auth.adminTitle': 'Вуруди маъмур',
    'auth.email': 'E-mail', 'auth.password': 'Парол', 'auth.login': 'Ворид шудан', 'auth.cancel': 'Бекор',
    'auth.toRegister': 'Аккаунт надоред? Мағоза сабт кунед', 'auth.partnerDemo': 'Намоиш: e-mail-и мағозаи мавҷуда, парол — ҳар гуна.',
    'auth.adminHint': 'Дастрасӣ танҳо барои маъмури платформа.', 'auth.wrongPass': 'Пароли нодуруст.', 'auth.wrongEmail': 'Мағоза бо ин e-mail ёфт нашуд.',
    'auth.register': 'Сабти мағоза',
    'buyer.authTitle': 'Хуш омадед', 'buyer.authSubtitle': 'Барои ҷустуҷӯи қисмҳо ва фармоиш ворид шавед ё сабти ном кунед.',
    'buyer.tabLogin': 'Ворид шудан', 'buyer.tabRegister': 'Сабти ном', 'buyer.name': 'Ном', 'buyer.namePh': 'Номи шумо',
    'buyer.signIn': 'Ворид шудан', 'buyer.signUp': 'Сабти ном', 'buyer.logout': 'Баромадан', 'buyer.hi': 'Салом, {name}!',
    'buyer.localNote': 'Аккаунт дар ҳамин дастгоҳ нигоҳ дошта мешавад.', 'buyer.partnerLink': 'Шумо мағоза-шарик ҳастед? Вуруд дар сарлавҳа.',
    'buyer.badEmail': 'E-mail-и дурустро ворид кунед.', 'buyer.shortPass': 'Парол — ҳадди ақал 4 аломат.',
    'buyer.exists': 'Аккаунт бо ин e-mail аллакай ҳаст — ворид шавед.', 'buyer.noUser': 'Аккаунт ёфт нашуд — сабти ном кунед.',
    'buyer.wrongPass': 'Пароли нодуруст.',
    'cart.add': 'Ба сабад', 'cart.added': 'Ба сабад илова шуд', 'cart.title': 'Сабад', 'cart.empty': 'Сабад холӣ аст',
    'cart.emptyHint': 'Қисмҳоро аз ҷустуҷӯ илова кунед — онҳо дар ин ҷо пайдо мешаванд.', 'cart.myOrders': 'Фармоишҳои ман',
    'cart.ordersEmpty': 'Шумо ҳоло фармоиш надоред.', 'cart.total': 'Ҳамагӣ', 'cart.checkout': 'Расмӣ кардан',
    'cart.repeat': 'Такрор', 'cart.continue': 'Идомаи харид', 'cart.qty': 'Шумора', 'cart.remove': 'Хориҷ кардан',
    'cart.shopOrder': 'Фармоиш ба мағоза', 'cart.placedOk': 'Фармоишҳо расмӣ шуданд!', 'cart.placedHint': 'Онҳоро бо як зер ба мағозаҳо фиристед.',
    'cart.sendShop': 'Ба мағоза фиристодан', 'cart.positions': 'мавқеъ', 'cart.goCart': 'Ба сабад гузаштан',
    'cart.st.new': 'Нав', 'cart.st.accepted': 'Қабул шуд', 'cart.st.ready': 'Барои гирифтан тайёр', 'cart.st.completed': 'Дода шуд', 'cart.st.cancelled': 'Бекор шуд',

    'foot.about': 'Агрегатори эҳтиётқисмҳо: ҷустуҷӯи ягона аз рӯи артикул, бренд ва мошина. Нархҳои шарикро муқоиса кунед.',
    'foot.buyers': 'Ба харидорон', 'foot.shops': 'Ба мағозаҳо', 'foot.contacts': 'Тамос',
    'foot.l1': 'Ҷустуҷӯ аз рӯи артикул', 'foot.l2': 'Интихоб аз рӯи мошина', 'foot.l3': 'Аналогҳо ва кроссҳо', 'foot.l4': 'Чӣ тавр фармоиш',
    'foot.s1': 'Шарик шудан', 'foot.s2': 'Боркунии прайс', 'foot.s3': 'Тарифҳо', 'foot.s4': 'Таҳлил',
    'foot.copy': 'Платформаи намоишии агрегатори эҳтиётқисмҳо',

    'p.overview': 'Шарҳи профил', 'p.pricelist': 'Идораи прайс', 'p.orders': 'Фармоишҳо', 'p.stats': 'Омор',
    'a.partners': 'Шарикон', 'a.orders': 'Ҳамаи фармоишҳо', 'a.tariffs': 'Тарифҳо', 'a.searchLogs': 'Журнали ҷустуҷӯ',
    'a.resetDb': 'Бознишондани базаи намоишӣ',

    'unit.pcs': 'дона', 'common.close': 'Пӯшидан',
    'share.title': 'Мубодила', 'share.copied': 'Истинод нусхабардорӣ шуд',
    'foot.aboutLink': 'Дар бораи сайт', 'foot.privacy': 'Сиёсати махфият', 'foot.terms': 'Шартҳои истифода',

    'cat.cat-engine': 'Муҳаррик', 'cat.cat-brakes': 'Системаи тормоз', 'cat.cat-suspension': 'Муаллақот (подвеска)',
    'cat.cat-steering': 'Идоракунии руль', 'cat.cat-transmission': 'Трансмиссия ва сцепление', 'cat.cat-filters': 'Филтрҳо',
    'cat.cat-electrical': 'Барқ ва рӯшноӣ', 'cat.cat-cooling-heating': 'Хунуккунӣ ва гармкунӣ', 'cat.cat-exhaust': 'Системаи ихроҷ',
    'cat.cat-body': 'Қисмҳои кузов', 'cat.cat-fuel-system': 'Системаи сӯзишворӣ', 'cat.cat-ignition': 'Системаи оташгиранӣ',
    'cat.cat-maintenance': 'Маводи сарфшаванда ва автохимия'
  },

  en: {
    'brand.tagline': 'Auto parts aggregator',
    'nav.searchParts': 'Parts search',
    'nav.partnerCabinet': 'Partner cabinet',
    'nav.admin': 'Administration',
    'btn.partnerLogin': 'For business',
    'btn.logout': 'Log out',
    'theme.toLight': 'Light theme',
    'theme.toDark': 'Dark theme',
    'app.exitHint': 'Press Back again to exit',
    'app.offline': 'No internet connection',
    'app.online': 'Connection restored',
    'role.buyer': 'Buyer',
    'role.partner': 'Partner shop',
    'role.admin': 'Administrator',

    'hero.eyebrow': '{parts}+ parts · {shops} shops · live prices',
    'hero.title': 'Find the right auto part in seconds',
    'hero.subtitle': 'Search by part number, brand, name or vehicle. Compare offers from local shops and order at the best price.',
    'search.placeholderText': 'Enter a part number (e.g. OC90) or name...',
    'search.placeholderVin': 'Enter VIN (17 chars), e.g. WVWZZZ1KZAW000001',
    'search.find': 'Search',
    'search.byText': 'By part №',
    'search.byVin': 'By VIN',
    'search.popular': 'Popular:',
    'vin.hint': 'VIN search matches parts to a specific vehicle (demo).',

    'feat.prices.t': 'Best prices', 'feat.prices.d': 'We compare all shop offers and show the lowest price.',
    'feat.cross.t': 'Analogs & cross-refs', 'feat.cross.d': 'We find replacements by cross numbers when the original is out of stock.',
    'feat.verified.t': 'Verified shops', 'feat.verified.d': 'Every partner is moderated by the platform administration.',
    'feat.stock.t': 'Stock & delivery', 'feat.stock.d': 'See quantities and delivery time before placing an order.',

    'car.title': 'Pick by vehicle',
    'car.catalog': 'Full catalog',
    'car.make': 'Make', 'car.model': 'Model', 'car.year': 'Year', 'car.engine': 'Engine',
    'car.clear': 'Clear', 'car.pick': 'Find parts', 'car.toGarage': 'To garage',
    'garage.title': 'My garage', 'garage.empty': 'Save a vehicle to pick parts quickly.', 'garage.remove': 'Remove',

    'sec.categories': 'Part categories',
    'sec.popular': 'Frequently searched',
    'sec.shops': 'Partner shops',

    'res.filters': 'Filters', 'res.category': 'Category', 'res.allCategories': 'All categories',
    'res.price': 'Price, сом.', 'res.from': 'From', 'res.to': 'To', 'res.brand': 'Manufacturer', 'res.shop': 'Shop',
    'res.inStock': 'In stock only', 'res.reset': 'Reset filters',
    'res.byQuery': 'For query', 'res.byCategory': 'Category', 'res.found': 'found',
    'res.sort': 'Sort', 'res.cheap': 'Cheapest first', 'res.expensive': 'Most expensive first', 'res.offers': 'Most offers',
    'res.notFoundT': 'No parts found', 'res.notFoundD': 'Try changing the query, resetting filters or choosing another category.',
    'res.showCatalog': 'Show full catalog',
    'res.pricesFrom': 'from', 'res.noStock': 'Out of stock', 'res.pricesAvail': 'Prices & stock',
    'res.offer1': 'offer', 'res.offer2': 'offers', 'res.offer5': 'offers',

    'det.notVerified': 'Not verified', 'det.inStock': 'In stock', 'det.article': 'Part №',
    'det.bestPrice': 'Best price', 'det.offersCount': 'Offers', 'det.pricesInShops': 'Prices in shops',
    'det.shopAddr': 'Shop & address', 'det.term': 'Lead time', 'det.avail': 'Stock', 'det.price': 'Price', 'det.action': 'Action',
    'det.today': 'Today', 'det.day': 'day', 'det.days': 'days', 'det.order': 'Order', 'det.bestTag': 'best price',
    'det.analogs': 'Analogs & cross numbers', 'det.noAnalogs': 'No analogs for this part yet.',
    'det.watch': 'View', 'det.applicability': 'Vehicle applicability', 'det.noOffers': 'No active offers for this part.',

    'shop.catalog': 'Shop catalog', 'shop.map': 'Location on map', 'shop.noItems': 'No items in this shop yet.',
    'shop.today': 'Today', 'shop.openMap': 'Open in Yandex Maps', 'shop.route': 'Get directions',

    'ord.title': 'Place an order', 'ord.selected': 'SELECTED ITEM', 'ord.shop': 'Shop', 'ord.priceLbl': 'Price',
    'ord.name': 'Your name', 'ord.phone': 'Phone number', 'ord.qty': 'Quantity', 'ord.available': 'Available',
    'ord.total': 'Total', 'ord.comment': 'Comment (optional)', 'ord.commentPh': 'VIN for verification, pickup time, etc.',
    'ord.submit': 'Place order', 'ord.successT': 'Order placed successfully!', 'ord.num': 'Order number',
    'ord.successD': 'The request was sent to the shop. A representative will call you shortly.', 'ord.great': 'Close',
    'ord.sendHint': 'Send the order to the shop so they reach you faster:',
    'ord.sendWa': 'Send via WhatsApp', 'ord.sendTg': 'Send via Telegram',
    'ord.waHeader': 'New order via', 'ord.noPhone': 'The shop has no contact number',
    'ord.namePh': 'e.g. John', 'ord.perPc': '/ pc.',

    'common.back': 'Back', 'common.results': 'Search results', 'common.detail': 'Part card', 'common.shopProfile': 'Shop profile',

    'auth.partnerTitle': 'Partner login', 'auth.adminTitle': 'Administrator login',
    'auth.email': 'E-mail', 'auth.password': 'Password', 'auth.login': 'Log in', 'auth.cancel': 'Cancel',
    'auth.toRegister': 'No account? Register a shop', 'auth.partnerDemo': 'Demo: e-mail of an existing shop, any password.',
    'auth.adminHint': 'Access for the platform administrator only.', 'auth.wrongPass': 'Wrong password.', 'auth.wrongEmail': 'No shop found with this e-mail.',
    'auth.register': 'Register a shop',
    'buyer.authTitle': 'Welcome', 'buyer.authSubtitle': 'Sign in or create an account to search for parts and place orders.',
    'buyer.tabLogin': 'Sign in', 'buyer.tabRegister': 'Sign up', 'buyer.name': 'Name', 'buyer.namePh': 'Your name',
    'buyer.signIn': 'Sign in', 'buyer.signUp': 'Create account', 'buyer.logout': 'Log out', 'buyer.hi': 'Hi, {name}!',
    'buyer.localNote': 'Account is stored on this device.', 'buyer.partnerLink': 'Are you a partner shop? Login is in the header.',
    'buyer.badEmail': 'Enter a valid e-mail.', 'buyer.shortPass': 'Password must be at least 4 characters.',
    'buyer.exists': 'An account with this e-mail already exists — sign in.', 'buyer.noUser': 'Account not found — sign up.',
    'buyer.wrongPass': 'Wrong password.',
    'cart.add': 'Add to cart', 'cart.added': 'Added to cart', 'cart.title': 'Cart', 'cart.empty': 'Your cart is empty',
    'cart.emptyHint': 'Add parts from search — they will appear here.', 'cart.myOrders': 'My orders',
    'cart.ordersEmpty': 'You have no orders yet.', 'cart.total': 'Total', 'cart.checkout': 'Place order',
    'cart.repeat': 'Reorder', 'cart.continue': 'Continue shopping', 'cart.qty': 'Qty', 'cart.remove': 'Remove',
    'cart.shopOrder': 'Order to shop', 'cart.placedOk': 'Orders placed!', 'cart.placedHint': 'Send them to the shops in one tap.',
    'cart.sendShop': 'Send to shop', 'cart.positions': 'items', 'cart.goCart': 'Go to cart',
    'cart.st.new': 'New', 'cart.st.accepted': 'Accepted', 'cart.st.ready': 'Ready for pickup', 'cart.st.completed': 'Delivered', 'cart.st.cancelled': 'Cancelled',

    'foot.about': 'Auto parts aggregator: unified search by part number, brand and vehicle. Compare partner prices and order smart.',
    'foot.buyers': 'For buyers', 'foot.shops': 'For shops', 'foot.contacts': 'Contacts',
    'foot.l1': 'Search by part №', 'foot.l2': 'Pick by vehicle', 'foot.l3': 'Analogs & cross-refs', 'foot.l4': 'How to order',
    'foot.s1': 'Become a partner', 'foot.s2': 'Upload price list', 'foot.s3': 'Plans', 'foot.s4': 'Analytics',
    'foot.copy': 'Demo auto parts aggregator platform',

    'p.overview': 'Profile overview', 'p.pricelist': 'Price list', 'p.orders': 'Orders', 'p.stats': 'Statistics',
    'a.partners': 'Partners', 'a.orders': 'All orders', 'a.tariffs': 'Tariff plans', 'a.searchLogs': 'Search log',
    'a.resetDb': 'Reset demo DB',

    'unit.pcs': 'pcs', 'common.close': 'Close',
    'share.title': 'Share', 'share.copied': 'Link copied',
    'foot.aboutLink': 'About', 'foot.privacy': 'Privacy policy', 'foot.terms': 'Terms of use',

    'cat.cat-engine': 'Engine', 'cat.cat-brakes': 'Brake system', 'cat.cat-suspension': 'Suspension',
    'cat.cat-steering': 'Steering', 'cat.cat-transmission': 'Transmission & clutch', 'cat.cat-filters': 'Filters',
    'cat.cat-electrical': 'Electrical & lighting', 'cat.cat-cooling-heating': 'Cooling & heating', 'cat.cat-exhaust': 'Exhaust system',
    'cat.cat-body': 'Body parts', 'cat.cat-fuel-system': 'Fuel system', 'cat.cat-ignition': 'Ignition system',
    'cat.cat-maintenance': 'Consumables & chemicals'
  }
};

export function translate(lang, key, vars) {
  const table = dict[lang] || dict.ru;
  let str = table[key];
  if (str === undefined) str = dict.ru[key];
  if (str === undefined) return key;
  if (vars) {
    for (const k in vars) str = str.split(`{${k}}`).join(vars[k]);
  }
  return str;
}

export default dict;
