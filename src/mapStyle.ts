import {
  GeomType,
  LineSymbolizer,
  PolygonSymbolizer,
  exp,
  type Feature,
  type PaintRule,
} from 'protomaps-leaflet'

const kindIs = (...kinds: string[]) => (_zoom: number, feature: Feature) =>
  kinds.includes(String(feature.props.kind ?? ''))

const roadWidth = exp(1.6, [
  [12, 0],
  [15, 1.4],
  [17, 4],
  [19, 11],
])

const majorRoadWidth = exp(1.6, [
  [10, 0.8],
  [15, 3],
  [17, 8],
  [19, 20],
])

export const cleanMapPaintRules: PaintRule[] = [
  {
    dataLayer: 'earth',
    symbolizer: new PolygonSymbolizer({ fill: '#f7f2e8' }),
  },
  {
    dataLayer: 'landcover',
    symbolizer: new PolygonSymbolizer({
      fill: (_zoom, feature) => {
        const kind = String(feature?.props.kind ?? '')
        if (['forest', 'wood'].includes(kind)) return '#d7e8c7'
        if (['grassland', 'farmland'].includes(kind)) return '#e5edd2'
        if (kind === 'scrub') return '#dfe9ce'
        return '#f2ecdf'
      },
      opacity: 0.9,
    }),
  },
  {
    dataLayer: 'landuse',
    symbolizer: new PolygonSymbolizer({ fill: '#cfe5bd' }),
    filter: kindIs('park', 'playground', 'village_green', 'nature_reserve', 'forest'),
  },
  {
    dataLayer: 'landuse',
    symbolizer: new PolygonSymbolizer({ fill: '#f5e2dc' }),
    filter: kindIs('hospital'),
  },
  {
    dataLayer: 'landuse',
    symbolizer: new PolygonSymbolizer({ fill: '#f3e6c8' }),
    filter: kindIs('school', 'university', 'college'),
  },
  {
    dataLayer: 'landuse',
    symbolizer: new PolygonSymbolizer({ fill: '#eee7dc' }),
    filter: kindIs('industrial'),
  },
  {
    dataLayer: 'water',
    symbolizer: new PolygonSymbolizer({ fill: '#b8dfe8' }),
    filter: (_zoom, feature) => feature.geomType === GeomType.Polygon,
  },
  {
    dataLayer: 'water',
    symbolizer: new LineSymbolizer({ color: '#9bcfdd', width: 2 }),
    filter: (_zoom, feature) => feature.geomType === GeomType.Line,
  },
  {
    dataLayer: 'landuse',
    symbolizer: new PolygonSymbolizer({ fill: '#e8ddca' }),
    filter: kindIs('pier', 'pedestrian'),
  },
  {
    dataLayer: 'buildings',
    minzoom: 15,
    symbolizer: new PolygonSymbolizer({
      fill: '#ead7ca',
      stroke: '#d8c2b4',
      width: 0.6,
      opacity: 0.72,
    }),
  },
  {
    dataLayer: 'roads',
    symbolizer: new LineSymbolizer({
      color: '#e0d8c9',
      width: (zoom, feature) => roadWidth(zoom, feature) + 2,
    }),
    filter: kindIs('other', 'path', 'minor_road'),
  },
  {
    dataLayer: 'roads',
    symbolizer: new LineSymbolizer({
      color: '#fffdf8',
      width: roadWidth,
    }),
    filter: kindIs('other', 'path', 'minor_road'),
  },
  {
    dataLayer: 'roads',
    symbolizer: new LineSymbolizer({
      color: '#d9c8b2',
      width: (zoom, feature) => majorRoadWidth(zoom, feature) + 3,
    }),
    filter: kindIs('major_road'),
  },
  {
    dataLayer: 'roads',
    symbolizer: new LineSymbolizer({
      color: '#fff8e9',
      width: majorRoadWidth,
    }),
    filter: kindIs('major_road'),
  },
  {
    dataLayer: 'roads',
    symbolizer: new LineSymbolizer({
      color: '#dfb986',
      width: (zoom, feature) => majorRoadWidth(zoom, feature) + 4,
    }),
    filter: kindIs('highway'),
  },
  {
    dataLayer: 'roads',
    symbolizer: new LineSymbolizer({
      color: '#f7d7a8',
      width: majorRoadWidth,
    }),
    filter: kindIs('highway'),
  },
  {
    dataLayer: 'roads',
    symbolizer: new LineSymbolizer({
      color: '#aaa69f',
      width: 1.2,
      dash: [3, 3],
      opacity: 0.55,
    }),
    filter: kindIs('rail'),
  },
]
