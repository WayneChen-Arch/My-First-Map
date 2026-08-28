export type PlaceKind =
  | 'school'
  | 'supermarket'
  | 'hospital'
  | 'pharmacy'
  | 'restaurant'
  | 'park'
  | 'playground'
  | 'library'
  | 'mtr'
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
  id: number
  kind: PlaceKind
  label: string
  name: string
  emoji: string
  color: string
  description: string
  position: [number, number]
}

export const HOME: [number, number] = [22.2914, 114.2006]

export const places: Place[] = [
  { id: 1, kind: 'school', label: '學校', name: '北角官立小學', emoji: '🏫', color: '#ff725e', description: '小朋友學習、看書和認識新朋友的地方。', position: [22.2917, 114.1984] },
  { id: 2, kind: 'supermarket', label: '超市', name: '英皇道超級市場', emoji: '🛒', color: '#ff9d45', description: '和家人一起買蔬菜、水果和日用品。', position: [22.2902, 114.2017] },
  { id: 3, kind: 'hospital', label: '醫院', name: '東區尤德夫人那打素醫院', emoji: '🏥', color: '#ef6683', description: '醫生和護士照顧病人、幫大家恢復健康。', position: [22.2691, 114.2361] },
  { id: 4, kind: 'pharmacy', label: '藥店', name: '北角藥房', emoji: '💊', color: '#e66a91', description: '可以在這裏買藥和健康用品。', position: [22.2911, 114.2026] },
  { id: 5, kind: 'restaurant', label: '餐廳', name: '春秧街小餐廳', emoji: '🍜', color: '#f08b48', description: '一家人坐下來吃飯的地方。', position: [22.2918, 114.1971] },
  { id: 6, kind: 'park', label: '公園', name: '北角海濱花園', emoji: '🌳', color: '#55aa79', description: '看看大樹、花朵，也可以散步和休息。', position: [22.2925, 114.2101] },
  { id: 7, kind: 'playground', label: '遊樂場', name: '和富道兒童遊樂場', emoji: '🛝', color: '#65ae70', description: '有滑梯和空地，是開心玩耍的地方。', position: [22.2938, 114.2039] },
  { id: 8, kind: 'library', label: '圖書館', name: '北角公共圖書館', emoji: '📚', color: '#8a72d6', description: '安靜地看圖書、聽故事和探索知識。', position: [22.2928, 114.2004] },
  { id: 9, kind: 'mtr', label: '港鐵站', name: '北角站', emoji: '🚇', color: '#e35b62', description: '坐港鐵去香港不同地方，記得牽好大人的手。', position: [22.2912, 114.2005] },
  { id: 10, kind: 'bus', label: '巴士站', name: '北角碼頭巴士總站', emoji: '🚌', color: '#56a6b8', description: '在站牌旁排隊，坐巴士出發。', position: [22.2931, 114.2092] },
  { id: 11, kind: 'bakery', label: '麵包店', name: '英皇道麵包店', emoji: '🥐', color: '#d99552', description: '聞一聞新鮮麵包香，挑選喜歡的點心。', position: [22.2897, 114.1958] },
  { id: 12, kind: 'cafe', label: '茶餐廳', name: '北角茶餐廳', emoji: '🥪', color: '#b77950', description: '可以吃早餐、喝飲品和休息一會兒。', position: [22.2907, 114.2055] },
  { id: 13, kind: 'post', label: '郵局', name: '北角郵政局', emoji: '📮', color: '#df665b', description: '把信件和心意寄給遠方的家人朋友。', position: [22.2898, 114.1991] },
  { id: 14, kind: 'police', label: '警署', name: '北角警署', emoji: '👮', color: '#537ec7', description: '警察叔叔和姐姐守護社區安全。', position: [22.2861, 114.2138] },
  { id: 15, kind: 'fire', label: '消防局', name: '北角消防局', emoji: '🚒', color: '#f05d4f', description: '消防員救火，也會在緊急時幫助大家。', position: [22.2912, 114.1942] },
  { id: 16, kind: 'bank', label: '銀行', name: '英皇道銀行', emoji: '🏦', color: '#6c85bd', description: '大人可以在這裏存錢和辦理銀行服務。', position: [22.2916, 114.2046] },
  { id: 17, kind: 'toilet', label: '洗手間', name: '渣華道公共洗手間', emoji: '🚻', color: '#7489a6', description: '需要時可以使用，離開前記得洗手。', position: [22.2937, 114.2071] },
  { id: 18, kind: 'market', label: '街市', name: '渣華道街市', emoji: '🥬', color: '#4ea879', description: '看看各種新鮮蔬菜、水果、魚和肉。', position: [22.2927, 114.1993] },
  { id: 19, kind: 'ferry', label: '渡輪碼頭', name: '北角渡輪碼頭', emoji: '⛴️', color: '#3e9db4', description: '坐渡輪過海，沿途可以看看維多利亞港。', position: [22.2935, 114.2098] },
  { id: 20, kind: 'sports', label: '運動場', name: '鰂魚涌公園足球場', emoji: '⚽', color: '#4b9e69', description: '一起跑步、踢球，讓身體更健康。', position: [22.2863, 114.2177] },
]
