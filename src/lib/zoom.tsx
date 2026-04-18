import { createContext, useContext, useState, type ReactNode } from 'react'

const ZOOM_LEVELS = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3]
const DEFAULT_ZOOM = 1.0
const STORAGE_PREFIX = 'page_zoom_'

interface ZoomContextValue {
  getZoom: (path: string) => number
  zoomIn: (path: string) => void
  zoomOut: (path: string) => void
  resetZoom: (path: string) => void
}

const ZoomContext = createContext<ZoomContextValue>({
  getZoom: () => DEFAULT_ZOOM,
  zoomIn: () => {},
  zoomOut: () => {},
  resetZoom: () => {},
})

const readStorage = (path: string): number => {
  const raw = localStorage.getItem(STORAGE_PREFIX + path)
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) ? parsed : DEFAULT_ZOOM
}

const writeStorage = (path: string, zoom: number) => {
  localStorage.setItem(STORAGE_PREFIX + path, String(zoom))
}

const nearestIndex = (zoom: number): number => {
  return ZOOM_LEVELS.reduce(
    (best, level, i) => (Math.abs(level - zoom) < Math.abs(ZOOM_LEVELS[best] - zoom) ? i : best),
    Math.floor(ZOOM_LEVELS.length / 2),
  )
}

export const ZoomProvider = ({ children }: { children: ReactNode }) => {
  const [zooms, setZooms] = useState<Record<string, number>>({})

  const getZoom = (path: string): number => (path in zooms ? zooms[path] : readStorage(path))

  const applyZoom = (path: string, zoom: number) => {
    writeStorage(path, zoom)
    setZooms((prev) => ({ ...prev, [path]: zoom }))
  }

  const zoomIn = (path: string) => {
    const idx = nearestIndex(getZoom(path))
    applyZoom(path, ZOOM_LEVELS[Math.min(idx + 1, ZOOM_LEVELS.length - 1)])
  }

  const zoomOut = (path: string) => {
    const idx = nearestIndex(getZoom(path))
    applyZoom(path, ZOOM_LEVELS[Math.max(idx - 1, 0)])
  }

  const resetZoom = (path: string) => {
    applyZoom(path, DEFAULT_ZOOM)
  }

  return (
    <ZoomContext.Provider value={{ getZoom, zoomIn, zoomOut, resetZoom }}>
      {children}
    </ZoomContext.Provider>
  )
}

export const useZoom = () => useContext(ZoomContext)
