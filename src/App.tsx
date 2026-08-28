import { useEffect, useMemo, useRef, useState } from 'react'
import L, { type Map as LeafletMap, type Marker as LeafletMarker } from 'leaflet'
import {
  ChevronLeft,
  Home,
  Info,
  LocateFixed,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Search,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react'
import { categoryList, HOME, places, type Place, type PlaceKind } from './places'

const MAP_BOUNDS = L.latLngBounds([22.2824, 114.1909], [22.3004, 114.2103])

function distanceFromHome(place: Place) {
  const lat = (place.position[0] - HOME[0]) * 111_320
  const lon = (place.position[1] - HOME[1]) * 111_320 * Math.cos((HOME[0] * Math.PI) / 180)
  return Math.hypot(lat, lon)
}

function osmUrl(osmId: string) {
  const types = { n: 'node', w: 'way', r: 'relation' }
  return `https://www.openstreetmap.org/${types[osmId[0] as keyof typeof types]}/${osmId.slice(1)}`
}

function KidsMap({
  visiblePlaces,
  selected,
  onSelect,
  mapRef,
}: {
  visiblePlaces: Place[]
  selected: Place | null
  onSelect: (place: Place) => void
  mapRef: React.MutableRefObject<LeafletMap | null>
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const markersRef = useRef<LeafletMarker[]>([])
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, {
      center: HOME,
      zoom: 16,
      minZoom: 15,
      maxZoom: 19,
      maxBounds: MAP_BOUNDS,
      maxBoundsViscosity: 0.9,
      zoomControl: false,
      attributionControl: false,
    })
    mapRef.current = map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 15,
      maxZoom: 19,
      className: 'soft-map-tiles',
    }).addTo(map)
    L.circle(HOME, {
      radius: 1000,
      color: '#58a88e',
      weight: 2,
      opacity: 0.6,
      fillColor: '#8ad2b8',
      fillOpacity: 0.07,
      dashArray: '7 8',
    }).addTo(map)
    return () => {
      mapRef.current = null
      map.remove()
    }
  }, [mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    visiblePlaces.forEach((place) => {
      const icon = L.divIcon({
        className: 'place-marker-wrap',
        html: `<span class="place-marker ${selected?.id === place.id ? 'is-selected' : ''}" style="--marker-color:${place.color}">
          <span class="marker-emoji">${place.emoji}</span>
          <span class="marker-label">${place.label}</span>
        </span>`,
        iconSize: [96, 76],
        iconAnchor: [48, 64],
      })
      const marker = L.marker(place.position, {
        icon,
        title: `${place.label}：${place.name}`,
        zIndexOffset: selected?.id === place.id ? 1000 : 0,
      }).on('click', () => onSelectRef.current(place)).addTo(map)
      markersRef.current.push(marker)
    })

    const homeIcon = L.divIcon({
      className: 'home-marker-wrap',
      html: '<div class="home-marker"><span>🏠</span><b>我的家</b></div>',
      iconSize: [96, 84],
      iconAnchor: [48, 69],
    })
    markersRef.current.push(L.marker(HOME, { icon: homeIcon, zIndexOffset: 900, interactive: false }).addTo(map))
  }, [visiblePlaces, selected, mapRef])

  useEffect(() => {
    if (selected) mapRef.current?.flyTo(selected.position, 16, { duration: 0.7 })
  }, [selected, mapRef])

  return <div ref={containerRef} className="map-container" />
}

function speak(place: Place) {
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(`${place.label}。${place.name}。${place.description}`)
  utterance.lang = 'zh-HK'
  utterance.rate = 0.76
  utterance.pitch = 1.08
  window.speechSynthesis.speak(utterance)
}

function App() {
  const mapRef = useRef<LeafletMap | null>(null)
  const [selected, setSelected] = useState<Place | null>(null)
  const [activeKind, setActiveKind] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  const categories = useMemo(
    () => categoryList.map((category) => ({ ...category, count: places.filter((place) => place.kind === category.kind).length })),
    [],
  )
  const visiblePlaces = useMemo(
    () => {
      const matching = places
        .filter(
          (place) =>
            (activeKind === 'all' || place.kind === activeKind) &&
            (!query.trim() || `${place.label}${place.name}`.toLowerCase().includes(query.trim().toLowerCase())),
        )
        .sort((a, b) => distanceFromHome(a) - distanceFromHome(b))

      if (activeKind !== 'all' || query.trim()) return matching

      const nearestByKind = new Map<PlaceKind, Place>()
      matching.forEach((place) => {
        if (!nearestByKind.has(place.kind)) nearestByKind.set(place.kind, place)
      })
      return [...nearestByKind.values()]
    },
    [activeKind, query],
  )

  function selectPlace(place: Place) {
    setSelected(place)
    if (window.innerWidth < 740) setActiveKind(place.kind)
  }

  function resetHome() {
    mapRef.current?.flyTo(HOME, 16, { duration: 0.8 })
    setSelected(null)
    setActiveKind('all')
  }

  function showCategory(kind: PlaceKind) {
    setActiveKind(kind)
    setSelected(null)
    const categoryPlaces = places.filter((place) => place.kind === kind)
    if (categoryPlaces.length > 1) {
      mapRef.current?.flyToBounds(L.latLngBounds(categoryPlaces.map((place) => place.position)), {
        padding: [90, 90],
        maxZoom: 17,
        duration: 0.7,
      })
    } else if (categoryPlaces[0]) {
      mapRef.current?.flyTo(categoryPlaces[0].position, 18, { duration: 0.7 })
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={resetHome} aria-label="回到我的家">
          <span className="brand-mark" aria-hidden="true">
            <MapPin size={25} strokeWidth={3} />
          </span>
          <span>
            <strong>我的第一張地圖</strong>
            <small>北角 · 小小探索家</small>
          </span>
        </button>
        <div className="header-actions">
          <span className="area-pill"><span className="pulse-dot" /> 北角附近</span>
          <button className="round-button" onClick={() => setShowInfo(true)} aria-label="地圖說明">
            <Info size={22} />
          </button>
        </div>
      </header>

      <section className="workspace">
        <aside className="places-panel">
          <div className="panel-heading">
            <p><Sparkles size={16} /> 今天想去哪裏？</p>
            <h1>找找附近的地方</h1>
          </div>
          <label className="search-box">
            <Search size={20} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="找一找……" />
            {query && <button onClick={() => setQuery('')} aria-label="清除搜尋"><X size={16} /></button>}
          </label>
          <div className="category-grid">
            <button
              className={`category-item all-item ${activeKind === 'all' ? 'active' : ''}`}
              onClick={() => { setActiveKind('all'); setSelected(null) }}
            >
              <span>✨</span><b>全部</b>
            </button>
            {categories.map((item) => (
              <button
                key={item.kind}
                className={`category-item ${activeKind === item.kind ? 'active' : ''}`}
                style={{ '--category-color': item.color } as React.CSSProperties}
                onClick={() => showCategory(item.kind)}
              >
                <span>{item.emoji}</span><b>{item.label}</b><small>{item.count} 個</small>
              </button>
            ))}
          </div>
          <div className="panel-tip">
            <span>☝️</span>
            <p><strong>試試看！</strong><br />按一下圖案，認識這個地方。</p>
          </div>
        </aside>

        <section className="map-stage" aria-label="北角兒童探索地圖">
          <KidsMap visiblePlaces={visiblePlaces} selected={selected} onSelect={selectPlace} mapRef={mapRef} />

          <div className="map-caption">
            <Navigation size={16} fill="currentColor" /> 以我的家為中心 · 1 公里探索圈
          </div>
          <div className="map-controls">
            <button onClick={() => mapRef.current?.zoomIn(1, { animate: true })} aria-label="放大地圖"><Plus /></button>
            <button onClick={() => mapRef.current?.zoomOut(1, { animate: true })} aria-label="縮小地圖"><Minus /></button>
            <button className="locate-button" onClick={resetHome} aria-label="回到我的家"><LocateFixed /></button>
          </div>
          <div className="attribution">© OpenStreetMap 貢獻者</div>

          {visiblePlaces.length === 0 && (
            <div className="empty-state"><span>🔎</span><b>找不到這個地方</b><p>試試搜尋「公園」或「學校」吧！</p></div>
          )}

          {selected && (
            <article className="place-card" style={{ '--place-color': selected.color } as React.CSSProperties}>
              <button className="card-close" onClick={() => setSelected(null)} aria-label="關閉"><X /></button>
              <div className="card-icon">{selected.emoji}</div>
              <div className="card-copy">
                <span className="eyebrow">這裏是</span>
                <h2>{selected.label}</h2>
                <h3>{selected.name}</h3>
                <p>{selected.description}</p>
                <a className="osm-source" href={osmUrl(selected.osmId)} target="_blank" rel="noreferrer">
                  OpenStreetMap 已核對 ↗
                </a>
              </div>
              <button className="speak-button" onClick={() => speak(selected)}>
                <Volume2 size={26} fill="currentColor" />
                <span>聽一聽</span>
              </button>
            </article>
          )}
        </section>
      </section>

      {showWelcome && (
        <div className="modal-backdrop">
          <section className="welcome-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
            <button className="modal-close" onClick={() => setShowWelcome(false)} aria-label="關閉"><X /></button>
            <div className="welcome-illustration">
              <span className="sun">☀️</span>
              <span className="cloud">☁️</span>
              <span className="kid">🧒🏻</span>
              <span className="tree">🌳</span>
              <span className="house">🏠</span>
            </div>
            <span className="welcome-kicker">歡迎，小小探索家！</span>
            <h2 id="welcome-title">一起認識<br />我們的社區吧</h2>
            <p>按一按地圖上的大圖案，看看家附近有甚麼地方。</p>
            <button className="start-button" onClick={() => setShowWelcome(false)}>
              出發探索 <span>→</span>
            </button>
            <small><Home size={14} /> 地圖只顯示家附近的安全探索範圍</small>
          </section>
        </div>
      )}

      {showInfo && (
        <div className="modal-backdrop">
          <section className="info-card" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={() => setShowInfo(false)} aria-label="關閉"><X /></button>
            <div className="info-icon">🗺️</div>
            <h2>給大人的小提示</h2>
            <p>這是一張為 3–6 歲小朋友簡化的社區地圖。目前只顯示北角附近約 1 公里範圍，綠色虛線是以「我的家」為中心的探索圈。</p>
            <ul>
              <li>拖動地圖看看附近，縮放限制在 15–19 級。</li>
              <li>每類最多顯示 5 個經 OSM 核對的真實地點。</li>
              <li>按「聽一聽」可播放粵語文字。</li>
              <li>地圖與興趣點會儲存在裝置，方便再次瀏覽。</li>
            </ul>
            <button className="got-it-button" onClick={() => setShowInfo(false)}><ChevronLeft size={18} /> 返回地圖</button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
