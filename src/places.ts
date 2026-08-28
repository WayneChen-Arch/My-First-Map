export type PlaceKind =
  | 'school'
  | 'kindergarten'
  | 'supermarket'
  | 'clinic'
  | 'pharmacy'
  | 'restaurant'
  | 'park'
  | 'playground'
  | 'library'
  | 'tram'
  | 'bus'
  | 'bakery'
  | 'cafe'
  | 'post'
  | 'police'
  | 'fire'
  | 'bank'
  | 'toilet'
  | 'market'
  | 'ferry'
  | 'sports'

export interface Place {
  id: string
  kind: PlaceKind
  label: string
  name: string
  emoji: string
  color: string
  description: string
  position: [number, number]
  osmId: string
}

export const HOME: [number, number] = [22.2914, 114.2006]

export const categoryList: Array<{
  kind: PlaceKind
  label: string
  emoji: string
  color: string
  description: string
}> = [
  { kind: 'school', label: '學校', emoji: '🏫', color: '#ff725e', description: '小朋友學習、看書和認識新朋友的地方。' },
  { kind: 'kindergarten', label: '幼稚園', emoji: '🧸', color: '#f48a72', description: '小朋友一起學習、唱歌和遊戲的地方。' },
  { kind: 'supermarket', label: '超市', emoji: '🛒', color: '#ff9d45', description: '和家人一起買蔬菜、水果和日用品。' },
  { kind: 'clinic', label: '診所', emoji: '🩺', color: '#ef6683', description: '身體不舒服時，醫護人員會幫忙照顧。' },
  { kind: 'pharmacy', label: '藥店', emoji: '💊', color: '#e66a91', description: '可以在這裏買藥和健康用品。' },
  { kind: 'restaurant', label: '餐廳', emoji: '🍜', color: '#f08b48', description: '一家人坐下來吃飯的地方。' },
  { kind: 'park', label: '公園', emoji: '🌳', color: '#55aa79', description: '看看大樹、花朵，也可以散步和休息。' },
  { kind: 'playground', label: '遊樂場', emoji: '🛝', color: '#65ae70', description: '有滑梯和空地，是開心玩耍的地方。' },
  { kind: 'library', label: '圖書館', emoji: '📚', color: '#8a72d6', description: '安靜地看圖書、聽故事和探索知識。' },
  { kind: 'tram', label: '電車站', emoji: '🚋', color: '#4a9c79', description: '在車站排隊，坐電車慢慢遊覽香港島。' },
  { kind: 'bus', label: '巴士站', emoji: '🚌', color: '#56a6b8', description: '在站牌旁排隊，坐巴士出發。' },
  { kind: 'bakery', label: '麵包店', emoji: '🥐', color: '#d99552', description: '聞一聞新鮮麵包香，挑選喜歡的點心。' },
  { kind: 'cafe', label: '咖啡店', emoji: '☕', color: '#b77950', description: '大人喝飲品，小朋友也可以休息一會兒。' },
  { kind: 'post', label: '郵局', emoji: '📮', color: '#df665b', description: '把信件和心意寄給遠方的家人朋友。' },
  { kind: 'police', label: '警署', emoji: '👮', color: '#537ec7', description: '警察叔叔和姐姐守護社區安全。' },
  { kind: 'fire', label: '消防局', emoji: '🚒', color: '#f05d4f', description: '消防員救火，也會在緊急時幫助大家。' },
  { kind: 'bank', label: '銀行', emoji: '🏦', color: '#6c85bd', description: '大人可以在這裏存錢和辦理銀行服務。' },
  { kind: 'toilet', label: '洗手間', emoji: '🚻', color: '#7489a6', description: '需要時可以使用，離開前記得洗手。' },
  { kind: 'market', label: '街市', emoji: '🥬', color: '#4ea879', description: '看看各種新鮮蔬菜、水果、魚和肉。' },
  { kind: 'ferry', label: '渡輪碼頭', emoji: '⛴️', color: '#3e9db4', description: '坐渡輪過海，沿途可以看看維多利亞港。' },
  { kind: 'sports', label: '運動場', emoji: '⚽', color: '#4b9e69', description: '一起跑步和做運動，讓身體更健康。' },
]

type RawPlace = [string, PlaceKind, string, number, number]

// 2026-08-28 以 Nominatim 核對的 OpenStreetMap 資料；每類最多保留最近五個具名地點。
const rawPlaces: RawPlace[] = [
  ['w229631203', 'school', '漢基國際學校', 22.2834019, 114.1979910],
  ['r7254146', 'school', '培僑中學', 22.2874405, 114.2048067],
  ['w112908010', 'school', '張祝珊英文中學', 22.2862058, 114.1960719],
  ['w112908176', 'school', '蘇浙公學', 22.2870099, 114.2006356],
  ['w229297764', 'school', '北角官立小學（雲景道）', 22.2842537, 114.1948480],
  ['n4856159937', 'kindergarten', 'Epoch Anglo-Chinese Kindergarten', 22.2884530, 114.2101226],
  ['n4860741660', 'kindergarten', 'Hamilton Hill International Kindergarten', 22.2888986, 114.1969640],
  ['n8353850616', 'kindergarten', '明慧國際幼稚園', 22.2906096, 114.2005959],
  ['w113279511', 'kindergarten', '多多國際幼兒園暨幼稚園', 22.2846935, 114.2000903],
  ['n1282179145', 'supermarket', 'Market Place by Jasons', 22.2857188, 114.1963128],
  ['n4265737631', 'supermarket', '佳寶食品超級市場', 22.2913697, 114.1979303],
  ['n4855869975', 'supermarket', 'International', 22.2826231, 114.1923507],
  ['n11752363008', 'supermarket', '實惠', 22.2917523, 114.2043233],
  ['n1298704546', 'supermarket', '華潤萬家', 22.2868559, 114.1951381],
  ['n4860805977', 'clinic', 'Spring Family Medical Clinic', 22.2825361, 114.1922915],
  ['w101959236', 'clinic', '柏立基夫人健康院', 22.2913236, 114.2050052],
  ['n4856511521', 'clinic', '宏健醫務中心', 22.2900345, 114.1949011],
  ['n4858263680', 'clinic', 'Priority Healthcare Medical Centre', 22.2918121, 114.1982121],
  ['n10199143630', 'clinic', '柏立基夫人家庭醫學診所', 22.2912718, 114.2048536],
  ['n4855897680', 'pharmacy', 'Unicorn Pharmacy', 22.2887792, 114.1937620],
  ['n4858622462', 'pharmacy', 'Kenway', 22.2909816, 114.2001282],
  ['n4860805974', 'pharmacy', '新寧藥房', 22.2829110, 114.1924921],
  ['n4860308487', 'pharmacy', '萬寧', 22.2881541, 114.1924418],
  ['n4856511533', 'pharmacy', 'Best Tai', 22.2905520, 114.1965679],
  ['n2451904642', 'restaurant', 'The Glasshouse', 22.2847893, 114.1997387],
  ['n10859535508', 'restaurant', '海家・小品', 22.2913678, 114.2004852],
  ['n8353890024', 'restaurant', 'Villa Villa Cafe & Bar', 22.2903624, 114.2003370],
  ['n6851465399', 'restaurant', '新福記酒家', 22.2872822, 114.1920031],
  ['n10137526455', 'restaurant', '活一鮮', 22.2904174, 114.2000531],
  ['w715705487', 'park', '北角海濱花園（一期）', 22.2933315, 114.2006030],
  ['r15916410', 'park', '油街休憩處', 22.2897558, 114.1921551],
  ['w113279515', 'park', '寶馬山道遊樂場', 22.2841058, 114.1995461],
  ['w763003335', 'park', '北角渡海輪碼頭廣場海濱花園', 22.2934789, 114.2039212],
  ['w296724529', 'park', '百福道遊樂場', 22.2903104, 114.2072461],
  ['w205417528', 'playground', '百福道交通安全城', 22.2904735, 114.2065616],
  ['w543021338', 'playground', '電照街兒童遊樂場', 22.2931232, 114.2031288],
  ['w1448540595', 'playground', '北角街市天台兒童遊樂場', 22.2912172, 114.2054477],
  ['n3483504797', 'library', '電氣道公共圖書館', 22.2895915, 114.1936245],
  ['n6512584423', 'library', '北角公共圖書館', 22.2911036, 114.2054782],
  ['n2153940105', 'library', '香港樹仁大學圖書館', 22.2857239, 114.1970917],
  ['n2941505389', 'tram', '渣華道電車站', 22.2907378, 114.2090979],
  ['n3005197213', 'tram', '芬尼街電車站', 22.2886120, 114.2098593],
  ['n3005247190', 'tram', '健康東街電車站', 22.2917159, 114.2075160],
  ['n2099848101', 'tram', '炮台山電車站', 22.2891216, 114.1942731],
  ['n296293116', 'tram', '北角總站', 22.2910685, 114.1987723],
  ['n3005556786', 'bus', '北角官立小學巴士站', 22.2888207, 114.2096663],
  ['n7975737404', 'bus', '北角消防局巴士站', 22.2921856, 114.2077551],
  ['n3005302610', 'bus', '民新街巴士站', 22.2900152, 114.2092742],
  ['n2719226687', 'bus', '張祝珊英文中學巴士站', 22.2856361, 114.1955388],
  ['n4265737649', 'bus', '北角道巴士站', 22.2917780, 114.1970680],
  ['n4855846529', 'bakery', 'Ka Ka Bakery Shop', 22.2920507, 114.2000359],
  ['n11807125896', 'bakery', 'Blossom Cakes', 22.2850383, 114.1918470],
  ['n4265737614', 'bakery', '包點達人', 22.2912552, 114.1973735],
  ['n2719229091', 'bakery', 'Mr.W 即烘蛋糕', 22.2843309, 114.1915730],
  ['n4855921038', 'bakery', '山崎麵包', 22.2896455, 114.1945271],
  ['n4860203957', 'cafe', 'Flash Coffee', 22.2880362, 114.1925954],
  ['n7334683571', 'cafe', 'NOC Coffee', 22.2857564, 114.1919849],
  ['n13930252163', 'cafe', '太平洋咖啡', 22.2921883, 114.2064577],
  ['n9763887562', 'cafe', '星巴克', 22.2929568, 114.1993444],
  ['n4265740940', 'cafe', '香港仔魚蛋王', 22.2910760, 114.1964846],
  ['n2203331621', 'post', '興發街郵政局', 22.2831673, 114.1913264],
  ['n5388814041', 'post', '英皇道郵政局', 22.2897228, 114.1945911],
  ['n2014726468', 'post', '七姊妹郵政局', 22.2907036, 114.2088822],
  ['w101959322', 'police', '北角警署', 22.2920971, 114.2090764],
  ['w154644667', 'fire', '北角消防局', 22.2924834, 114.2077897],
  ['w112908063', 'fire', '寶馬山消防局暨救護站', 22.2880884, 114.2017603],
  ['n4858622471', 'bank', '富邦銀行', 22.2902890, 114.1969388],
  ['n1299465498', 'bank', '交通銀行', 22.2857931, 114.1927891],
  ['n1298704639', 'bank', '渣打銀行', 22.2896641, 114.1950548],
  ['n1299465494', 'bank', '中國建設銀行（亞洲）', 22.2905193, 114.1980350],
  ['n1299465507', 'bank', '創興銀行', 22.2904813, 114.1978689],
  ['n4282108630', 'toilet', '北角碼頭公共洗手間', 22.2933902, 114.2017241],
  ['w266353344', 'toilet', '永興街公廁', 22.2854651, 114.1920069],
  ['w1223186675', 'toilet', '渣華道公廁', 22.2931039, 114.2034324],
  ['w1334365717', 'toilet', '油街公廁', 22.2882234, 114.1929090],
  ['n653111606', 'toilet', '糖水道公廁', 22.2918540, 114.1987140],
  ['n2374461156', 'market', '渣華道街市', 22.2921799, 114.1989396],
  ['w418204766', 'ferry', '北角渡輪碼頭', 22.2931491, 114.2020213],
  ['n1684368872', 'sports', '渣華道體育館', 22.2923649, 114.1997455],
  ['n5023761143', 'sports', 'Verm City Climbing Club', 22.2925318, 114.2071098],
]

const categoryByKind = new Map(categoryList.map((category) => [category.kind, category]))

export const places: Place[] = rawPlaces.map(([osmId, kind, name, lat, lon]) => {
  const category = categoryByKind.get(kind)!
  return {
    id: osmId,
    osmId,
    kind,
    name,
    position: [lat, lon],
    label: category.label,
    emoji: category.emoji,
    color: category.color,
    description: category.description,
  }
})
