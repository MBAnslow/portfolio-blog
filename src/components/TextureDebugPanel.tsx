import { useEffect, useState } from 'react'
import { basePath } from '../utils/basePath'

const textureFiles = {
  ink: 'halftone-ink.webp',
  halftone: 'halftone-navy.webp',
  watercolour: 'hero-texture-watercolour.png',
  splatter: 'hero-texture-splatter.png',
  paintBurst: 'hero-texture-paint-splatter-burst.png',
} as const

type TextureName = keyof typeof textureFiles

const textureLabels: Record<TextureName, string> = {
  ink: 'Ink halftone (card default)',
  halftone: 'Navy halftone',
  watercolour: 'Watercolour',
  splatter: 'Splatter',
  paintBurst: 'Paint splatter burst',
}

type Settings = {
  fillColor: string
  strokeColor: string
  useStrokeOverride: boolean
  strokeWidth: number
  halftoneTexture: TextureName
  halftoneSize: number
  halftoneOpacity: number
  tintHalftone: boolean
  halftoneColor: string
  highlights: boolean
  highlightColor: string
  highlightTexture: TextureName
  highlightSize: number
  highlightOpacity: number
  highlightOffset: number
}

const defaults: Settings = {
  fillColor: '#080808',
  strokeColor: '#2b3f8f',
  useStrokeOverride: false,
  strokeWidth: 7,
  halftoneTexture: 'ink',
  halftoneSize: 520,
  halftoneOpacity: 0.92,
  tintHalftone: true,
  halftoneColor: '#242429',
  highlights: true,
  highlightColor: '#ffffff',
  highlightTexture: 'ink',
  highlightSize: 930,
  highlightOpacity: 0.15,
  highlightOffset: 398,
}

const rowStyle = { display: 'block', marginTop: 8 }

function apply(s: Settings, touched: Set<keyof Settings>) {
  const root = document.body
  const set = (name: string, value: string | null) =>
    value === null
      ? root.style.removeProperty(name)
      : root.style.setProperty(name, value)

  set('--debug-title-fill', touched.has('fillColor') ? s.fillColor : null)
  set('--debug-title-stroke', s.useStrokeOverride ? s.strokeColor : null)
  set(
    '--debug-title-stroke-width',
    touched.has('strokeWidth') ? `${s.strokeWidth}px` : null,
  )
  set(
    '--debug-halftone-size',
    touched.has('halftoneSize') ? `${s.halftoneSize}px` : null,
  )
  set(
    '--debug-halftone-opacity',
    touched.has('halftoneOpacity') ? `${s.halftoneOpacity}` : null,
  )
  const textureUrl = (texture: TextureName) =>
    `url(${basePath}media/${textureFiles[texture]})`
  set(
    '--debug-halftone-texture',
    touched.has('halftoneTexture') ? textureUrl(s.halftoneTexture) : null,
  )
  set(
    '--debug-highlight-texture',
    touched.has('highlightTexture') ? textureUrl(s.highlightTexture) : null,
  )
  set('--debug-halftone-color', s.halftoneColor)
  root.classList.toggle('debug-halftone-original', !s.tintHalftone)
  set('--debug-highlight-color', s.highlightColor)
  set('--debug-highlight-size', `${s.highlightSize}px`)
  set('--debug-highlight-opacity', `${s.highlightOpacity}`)
  set('--debug-highlight-offset', `${s.highlightOffset}px`)
  root.classList.toggle('debug-no-highlights', !s.highlights)
}

export function TextureDebugPanel() {
  const [s, setS] = useState(defaults)
  const [touched, setTouched] = useState(new Set<keyof Settings>())
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => apply(s, touched), [s, touched])

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setS((prev) => ({ ...prev, [key]: value }))
    setTouched((prev) => new Set(prev).add(key))
  }

  const reset = () => {
    setS(defaults)
    setTouched(new Set())
  }

  const texturePicker = (
    key: 'halftoneTexture' | 'highlightTexture',
    label: string,
  ) => (
    <label style={rowStyle}>
      {label}{' '}
      <select
        value={s[key]}
        onChange={(e) => update(key, e.target.value as TextureName)}
        style={{ width: '100%', color: '#000' }}
      >
        {Object.entries(textureLabels).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  )

  const slider = (
    key:
      | 'strokeWidth'
      | 'halftoneSize'
      | 'halftoneOpacity'
      | 'highlightSize'
      | 'highlightOpacity'
      | 'highlightOffset',
    label: string,
    min: number,
    max: number,
    step: number,
  ) => (
    <label style={rowStyle}>
      {label}: {s[key]}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={s[key]}
        onChange={(e) => update(key, Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </label>
  )

  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 9999,
        width: 280,
        padding: 12,
        font: '12px/1.4 ui-monospace, monospace',
        color: '#fff',
        background: 'rgb(0 0 0 / 85%)',
        borderRadius: 8,
        maxHeight: 'calc(100vh - 32px)',
        overflowY: 'auto',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ all: 'unset', cursor: 'pointer', fontWeight: 700 }}
      >
        Card title texture {open ? '▾' : '▸'}
      </button>
      {open && (
        <>
          <label style={rowStyle}>
            Letter fill{' '}
            <input
              type="color"
              value={s.fillColor}
              onChange={(e) => update('fillColor', e.target.value)}
            />
          </label>
          <label style={rowStyle}>
            <input
              type="checkbox"
              checked={s.useStrokeOverride}
              onChange={(e) => update('useStrokeOverride', e.target.checked)}
            />{' '}
            Override outline colour{' '}
            <input
              type="color"
              value={s.strokeColor}
              onChange={(e) => {
                update('strokeColor', e.target.value)
                update('useStrokeOverride', true)
              }}
            />
          </label>
          {slider('strokeWidth', 'Outline width (px)', 0, 16, 0.5)}
          {texturePicker('halftoneTexture', 'Dot texture')}
          {slider('halftoneSize', 'Halftone scale (px)', 100, 1200, 10)}
          {slider('halftoneOpacity', 'Halftone opacity', 0, 1, 0.01)}
          <label style={rowStyle}>
            <input
              type="checkbox"
              checked={s.tintHalftone}
              onChange={(e) => update('tintHalftone', e.target.checked)}
            />{' '}
            Recolour halftone dots{' '}
            <input
              type="color"
              value={s.halftoneColor}
              onChange={(e) => {
                update('halftoneColor', e.target.value)
                update('tintHalftone', true)
              }}
            />
          </label>
          <label style={{ ...rowStyle, marginTop: 14, fontWeight: 700 }}>
            <input
              type="checkbox"
              checked={s.highlights}
              onChange={(e) => update('highlights', e.target.checked)}
            />{' '}
            Highlight dots{' '}
            <input
              type="color"
              value={s.highlightColor}
              onChange={(e) => {
                update('highlightColor', e.target.value)
                update('highlights', true)
              }}
            />
          </label>
          {texturePicker('highlightTexture', 'Highlight texture')}
          {slider('highlightSize', 'Highlight scale (px)', 60, 1200, 10)}
          {slider('highlightOpacity', 'Highlight opacity', 0, 1, 0.01)}
          {slider('highlightOffset', 'Highlight offset (px)', 0, 520, 1)}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <button
              type="button"
              style={{ flex: 1, color: '#000' }}
              onClick={() => {
                const values = Object.fromEntries(
                  [...touched].map((key) => [key, s[key]]),
                )
                navigator.clipboard.writeText(JSON.stringify(values, null, 2))
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}
            >
              {copied ? 'Copied!' : 'Copy values'}
            </button>
            <button type="button" onClick={reset} style={{ color: '#000' }}>
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  )
}
