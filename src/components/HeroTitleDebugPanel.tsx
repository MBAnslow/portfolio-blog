import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { basePath } from '../utils/basePath'

type TextureName = 'halftone' | 'watercolour' | 'splatter' | 'paintBurst'

export type HeroTextureSettings = {
  /* fill */
  fillColor: string
  /* blue layer */
  blueTexture: TextureName
  blueColor: string
  blueSize: number
  blueOffset: number
  blueOpacity: number
  /* black layer */
  blackTexture: TextureName
  blackColor: string
  blackSize: number
  blackOffset: number
  blackOpacity: number
  /* grey layer */
  greyTexture: TextureName
  greyColor: string
  greySize: number
  greyOffset: number
  greyOpacity: number
  /* white highlight layer */
  whiteTexture: TextureName
  whiteColor: string
  whiteSize: number
  whiteOffset: number
  whiteOpacity: number
}

type HeroLayoutSettings = {
  titleSize: number
  michaelWeight: number
  titleX: number
  titleY: number
  imageScale: number
  imageX: number
  imageY: number
}

const defaultHeroSettings: HeroTextureSettings = {
  fillColor: '#080808',
  blueTexture: 'halftone',
  blueColor: '#413f60',
  blueSize: 730,
  blueOffset: 95,
  blueOpacity: 0.71,
  blackTexture: 'watercolour',
  blackColor: '#317faf',
  blackSize: 1210,
  blackOffset: 308,
  blackOpacity: 0.72,
  greyTexture: 'watercolour',
  greyColor: '#f29f40',
  greySize: 770,
  greyOffset: 219,
  greyOpacity: 0.53,
  whiteTexture: 'paintBurst',
  whiteColor: '#9469c9',
  whiteSize: 390,
  whiteOffset: 370,
  whiteOpacity: 0.67,
}

const defaultLayoutSettings: HeroLayoutSettings = {
  titleSize: 180,
  michaelWeight: 260,
  titleX: -83,
  titleY: -205,
  imageScale: 1.61,
  imageX: 81,
  imageY: 37,
}

function textureUrl(texture: TextureName) {
  return `url(${basePath}media/${
    texture === 'halftone'
      ? 'halftone-navy.webp'
      : texture === 'watercolour'
        ? 'hero-texture-watercolour.png'
        : texture === 'splatter'
          ? 'hero-texture-splatter.png'
          : 'hero-texture-paint-splatter-burst.png'
  })`
}

function paintLayer(
  selector: string,
  color: string,
  opacity: number,
  size: number,
  offset: number,
  texture: TextureName,
) {
  const image = textureUrl(texture)
  const mix = `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.style.setProperty('background-color', mix)
    el.style.setProperty('mask-image', image)
    el.style.setProperty('-webkit-mask-image', image)
    el.style.setProperty('mask-size', `${size}px ${size}px`)
    el.style.setProperty('-webkit-mask-size', `${size}px ${size}px`)
    el.style.setProperty('mask-position', `${offset}px ${offset}px`)
    el.style.setProperty('-webkit-mask-position', `${offset}px ${offset}px`)
  })
}

function applyToDOM(s: HeroTextureSettings) {
  document.querySelectorAll<HTMLElement>('.hero-title__base').forEach((el) => {
    el.style.color = s.fillColor
  })
  paintLayer(
    '.hero-title__texture--blue',
    s.blueColor,
    s.blueOpacity,
    s.blueSize,
    s.blueOffset,
    s.blueTexture,
  )
  paintLayer(
    '.hero-title__texture--black',
    s.blackColor,
    s.blackOpacity,
    s.blackSize,
    s.blackOffset,
    s.blackTexture,
  )
  paintLayer(
    '.hero-title__texture--grey',
    s.greyColor,
    s.greyOpacity,
    s.greySize,
    s.greyOffset,
    s.greyTexture,
  )
  paintLayer(
    '.hero-title__texture--white',
    s.whiteColor,
    s.whiteOpacity,
    s.whiteSize,
    s.whiteOffset,
    s.whiteTexture,
  )
}

function applyLayoutToDOM(s: HeroLayoutSettings) {
  const root = document.body
  root.style.setProperty('--hero-title-size', `${s.titleSize}px`)
  root.style.setProperty('--hero-michael-weight', `${s.michaelWeight}`)
  root.style.setProperty('--hero-title-x', `${s.titleX}px`)
  root.style.setProperty('--hero-title-y', `${s.titleY}px`)
  root.style.setProperty('--hero-image-scale', `${s.imageScale}`)
  root.style.setProperty('--hero-image-x', `${s.imageX}px`)
  root.style.setProperty('--hero-image-y', `${s.imageY}px`)
  document.querySelectorAll<HTMLElement>('.masthead__given-name').forEach((el) => {
    el.style.setProperty('font-weight', `${s.michaelWeight}`, 'important')
    el.style.setProperty(
      'font-variation-settings',
      `"wght" ${s.michaelWeight}`,
      'important',
    )
  })
}

type SectionProps = {
  label: string
  texture: TextureName
  color: string
  size: number
  offset: number
  opacity: number
  textureKey: keyof HeroTextureSettings
  colorKey: keyof HeroTextureSettings
  sizeKey: keyof HeroTextureSettings
  offsetKey: keyof HeroTextureSettings
  opacityKey: keyof HeroTextureSettings
  onUpdate: (k: keyof HeroTextureSettings, v: string | number) => void
}

function LayerSection({
  label, texture, color, size, offset, opacity,
  textureKey, colorKey, sizeKey, offsetKey, opacityKey, onUpdate,
}: SectionProps) {
  return (
    <div style={{ minWidth: 0, padding: 8, background: '#1a1a1a', borderRadius: 6 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        Texture
        <select
          value={texture}
          onChange={(e) => onUpdate(textureKey, e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        >
          <option value="halftone">Original halftone</option>
          <option value="watercolour">Watercolour wash</option>
          <option value="splatter">Fine splatter</option>
          <option value="paintBurst">Paint splatter burst</option>
        </select>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        Colour
        <input type="color" value={color} onChange={e => onUpdate(colorKey, e.target.value)} />
        <span style={{ fontSize: 10, opacity: 0.7 }}>{color}</span>
      </label>
      {([
        [sizeKey, 'Scale (px)', size, 60, 1400, 10],
        [offsetKey, 'Offset (px)', offset, 0, 600, 1],
        [opacityKey, 'Opacity', opacity, 0, 1, 0.01],
      ] as [keyof HeroTextureSettings, string, number, number, number, number][]).map(
        ([k, lbl, val, min, max, step]) => (
          <label key={k as string} style={{ display: 'block', marginTop: 5 }}>
            {lbl}: <strong>{val}</strong>
            <input
              type="range" min={min} max={max} step={step} value={val}
              onInput={(e) => onUpdate(k, Number(e.currentTarget.value))}
              onChange={(e) => onUpdate(k, Number(e.currentTarget.value))}
              style={{ width: '100%' }}
            />
          </label>
        ),
      )}
    </div>
  )
}

const presetId = JSON.stringify({ defaultHeroSettings, defaultLayoutSettings })

export function HeroTitleDebugPanel() {
  const [s, setS] = useState(defaultHeroSettings)
  const [layout, setLayout] = useState(defaultLayoutSettings)
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const stateRef = useRef(s)
  stateRef.current = s
  const layoutRef = useRef(layout)
  layoutRef.current = layout

  useLayoutEffect(() => {
    setS(defaultHeroSettings)
    setLayout(defaultLayoutSettings)
  }, [presetId])

  useLayoutEffect(() => {
    applyToDOM(s)
    applyLayoutToDOM(layout)
  }, [s, layout])

  const update = useCallback((k: keyof HeroTextureSettings, v: string | number) => {
    setS((prev) => ({ ...prev, [k]: v }))
  }, [])

  const updateLayout = useCallback((key: keyof HeroLayoutSettings, value: number) => {
    setLayout((prev) => ({ ...prev, [key]: value }))
  }, [])

  const layers: Omit<SectionProps, 'onUpdate'>[] = [
    { label: '🔵 Blue layer', texture: s.blueTexture, color: s.blueColor, size: s.blueSize, offset: s.blueOffset, opacity: s.blueOpacity, textureKey: 'blueTexture', colorKey: 'blueColor', sizeKey: 'blueSize', offsetKey: 'blueOffset', opacityKey: 'blueOpacity' },
    { label: '⚫ Black layer', texture: s.blackTexture, color: s.blackColor, size: s.blackSize, offset: s.blackOffset, opacity: s.blackOpacity, textureKey: 'blackTexture', colorKey: 'blackColor', sizeKey: 'blackSize', offsetKey: 'blackOffset', opacityKey: 'blackOpacity' },
    { label: '🩶 Grey layer', texture: s.greyTexture, color: s.greyColor, size: s.greySize, offset: s.greyOffset, opacity: s.greyOpacity, textureKey: 'greyTexture', colorKey: 'greyColor', sizeKey: 'greySize', offsetKey: 'greyOffset', opacityKey: 'greyOpacity' },
    { label: '⬜ White highlight', texture: s.whiteTexture, color: s.whiteColor, size: s.whiteSize, offset: s.whiteOffset, opacity: s.whiteOpacity, textureKey: 'whiteTexture', colorKey: 'whiteColor', sizeKey: 'whiteSize', offsetKey: 'whiteOffset', opacityKey: 'whiteOpacity' },
  ]

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      maxHeight: '36vh',
      overflow: 'auto',
      padding: '8px 12px 10px',
      font: '11px/1.3 ui-monospace, monospace',
      color: '#fff',
      background: 'rgb(0 0 0 / 94%)',
      borderTop: '2px solid #ffd257',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: open ? 8 : 0 }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{ all: 'unset', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}
        >
          Hero name texture {open ? '▾' : '▸'}
        </button>
        {open && (
          <>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 180 }}>
              Michael thickness: <strong>{layout.michaelWeight}</strong>
              <input
                type="range"
                min={100}
                max={900}
                step={10}
                value={layout.michaelWeight}
                onInput={(event) =>
                  updateLayout('michaelWeight', Number(event.currentTarget.value))
                }
                onChange={(event) =>
                  updateLayout('michaelWeight', Number(event.currentTarget.value))
                }
                style={{ flex: 1 }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Fill
              <input type="color" value={s.fillColor} onChange={e => update('fillColor', e.target.value)} />
            </label>
            <button
              type="button"
              style={{ color: '#000', cursor: 'pointer' }}
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify({
                  layout: layoutRef.current,
                  textures: stateRef.current,
                }, null, 2))
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}
            >
              {copied ? '✓ Copied!' : 'Copy values'}
            </button>
            <button
              type="button"
              style={{ color: '#000', cursor: 'pointer' }}
              onClick={() => {
                setS(defaultHeroSettings)
                setLayout(defaultLayoutSettings)
                applyToDOM(defaultHeroSettings)
                applyLayoutToDOM(defaultLayoutSettings)
              }}
            >
              Reset
            </button>
          </>
        )}
      </div>

      {open && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0, padding: 8, background: '#1a1a1a', borderRadius: 6 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Layout</div>
            {([
              ['titleSize', 'Title size', layout.titleSize, 70, 280, 1],
              ['titleX', 'Title X', layout.titleX, -700, 700, 1],
              ['titleY', 'Title Y', layout.titleY, -500, 500, 1],
              ['imageScale', 'Image scale', layout.imageScale, 0.4, 3, 0.01],
              ['imageX', 'Image X', layout.imageX, -900, 900, 1],
              ['imageY', 'Image Y', layout.imageY, -700, 700, 1],
            ] as [keyof HeroLayoutSettings, string, number, number, number, number][]).map(
              ([key, label, value, min, max, step]) => (
                <label key={key} style={{ display: 'block', marginTop: 4 }}>
                  {label}: <strong>{value}</strong>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onInput={(event) => updateLayout(key, Number(event.currentTarget.value))}
                    onChange={(event) => updateLayout(key, Number(event.target.value))}
                    style={{ width: '100%' }}
                  />
                </label>
              ),
            )}
          </div>
          {layers.map(layer => (
            <LayerSection key={layer.label} {...layer} onUpdate={update} />
          ))}
        </div>
      )}
    </div>
  )
}
