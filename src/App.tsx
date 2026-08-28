import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { type Map as MapLibreMap, type Marker as MapLibreMarker } from 'maplibre-gl'
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
import { HOME, places, type Place } from './places'

const MAP_BOUNDS: [[number, number], [number, number]] = [[114.174, 22.266], [114.235, 22.315]]

function explorationCircle() {
  const points = Array.from({ length: 65 }, (_, index) => {
    const angle = (index / 64) * Math.PI * 2
    const lat = HOME[0] + (Math.sin(angle) * 1000) / 111_320
    const lon = HOME[1] + (Math.cos(angle) * 1000) / (111_320 * Math.cos((HOME[0] * Math.PI) / 180))
    return [lon, lat]
  })
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: { type: 'Polygon' as const, coordinates: [points] },
  }
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
  mapRef: React.MutableRefObject<MapLibreMap | null>
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const markersRef = useRef<MapLibreMarker[]>([])
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [HOME[1], HOME[0]],
      zoom: 15,
      minZoom: 14,
      maxZoom: 16,
      maxBounds: MAP_BOUNDS,
      attributionControl: false,
    })
    mapRef.current = map
    map.on('load', () => {
      map.addSource('exploration-area', { type: 'geojson', data: explorationCircle() })
      map.addLayer({
        id: 'exploration-area-fill',
        type: 'fill',
        source: 'exploration-area',
        paint: { 'fill-color': '#8ad2b8', 'fill-opacity': 0.08 },
      })
      map.addLayer({
        id: 'exploration-area-line',
        type: 'line',
        source: 'exploration-area',
        paint: { 'line-color': '#58a88e', 'line-width': 2, 'line-opacity': 0.6, 'line-dasharray': [3, 3] },
      })
    })
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
      const element = document.createElement('button')
      element.className = 'place-marker-wrap'
      element.type = 'button'
      element.setAttribute('aria-label', `${place.label}：${place.name}`)
      element.innerHTML = `<span class="place-marker ${selected?.id === place.id ? 'is-selected' : ''}" style="--marker-color:${place.color}">
      <span class="marker-emoji">${place.emoji}</span>
      <span class="marker-label">${place.label}</span>
      </span>`
      element.addEventListener('click', () => onSelectRef.current(place))
      markersRef.current.push(new maplibregl.Marker({ element, anchor: 'bottom' }).setLngLat([place.position[1], place.position[0]]).addTo(map))
    })

    const homeElement = document.createElement('div')
    homeElement.className = 'home-marker-wrap'
    homeElement.innerHTML = '<div class="home-marker"><span>🏠</span><b>我的家</b></div>'
    markersRef.current.push(new maplibregl.Marker({ element: homeElement, anchor: 'bottom' }).setLngLat([HOME[1], HOME[0]]).addTo(map))
  }, [visiblePlaces, selected, mapRef])

  useEffect(() => {
    if (selected) mapRef.current?.flyTo({ center: [selected.position[1], selected.position[0]], zoom: 16, duration: 700 })
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
  const mapRef = useRef<MapLibreMap | null>(null)
  const [selected, setSelected] = useState<Place | null>(null)
  const [activeKind, setActiveKind] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  const categories = useMemo(() => places.map(({ kind, label, emoji, color }) => ({ kind, label, emoji, color })), [])
  const visiblePlaces = useMemo(
    () =>
      places.filter(
        (place) =>
          (activeKind === 'all' || place.kind === activeKind) &&
          (!query.trim() || `${place.label}${place.name}`.includes(query.trim())),
      ),
    [activeKind, query],
  )

  function selectPlace(place: Place) {
    setSelected(place)
    if (window.innerWidth < 740) setActiveKind(place.kind)
  }

  function resetHome() {
    mapRef.current?.flyTo({ center: [HOME[1], HOME[0]], zoom: 15, duration: 800 })
    setSelected(null)
    setActiveKind('all')
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
                onClick={() => {
                  setActiveKind(item.kind)
                  const place = places.find((candidate) => candidate.kind === item.kind)!
                  setSelected(place)
                }}
              >
                <span>{item.emoji}</span><b>{item.label}</b>
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
            <button onClick={() => mapRef.current?.zoomIn({ duration: 300 })} aria-label="放大地圖"><Plus /></button>
            <button onClick={() => mapRef.current?.zoomOut({ duration: 300 })} aria-label="縮小地圖"><Minus /></button>
            <button className="locate-button" onClick={resetHome} aria-label="回到我的家"><LocateFixed /></button>
          </div>
          <div className="attribution">© OpenStreetMap 貢獻者 · OpenFreeMap</div>

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
            <p>這是一張為 3–6 歲小朋友簡化的社區地圖。目前顯示北角附近約 4 公里範圍，綠色虛線是以「我的家」為中心的 1 公里探索圈。</p>
            <ul>
              <li>拖動地圖看看附近，縮放限制在 14–16 級。</li>
              <li>興趣點以大圖案和繁體中文呈現。</li>
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
