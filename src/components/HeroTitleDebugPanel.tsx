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

type HeroLensWashSettings = {
  angle: number
  color: string
  opacity: number
  colorEnd: string
  opacityEnd: number
  fade: number
  end: number
}

type HeroLayoutSettings = {
  titleSize: number
  michaelWeight: number
  titleX: number
  titleY: number
  imageScale: number
  imageX: number
  imageY: number
  skylineScale: number
  skylineX: number
  skylineY: number
  lensZoom: number
  lensX: number
  lensY: number
  lensBlur: number
  lensOpacity: number
  lensChroma: number
}

const defaultHeroSettings: HeroTextureSettings = {
  fillColor: '#1e0806',
  blueTexture: 'watercolour',
  blueColor: '#ff5542',
  blueSize: 1400,
  blueOffset: 320,
  blueOpacity: 0.43,
  blackTexture: 'watercolour',
  blackColor: '#3151af',
  blackSize: 1200,
  blackOffset: 258,
  blackOpacity: 0.38,
  greyTexture: 'watercolour',
  greyColor: '#fff700',
  greySize: 770,
  greyOffset: 210,
  greyOpacity: 0.13,
  whiteTexture: 'paintBurst',
  whiteColor: '#ff9214',
  whiteSize: 410,
  whiteOffset: 341,
  whiteOpacity: 0.25,
}

const defaultLayoutSettings: HeroLayoutSettings = {
  titleSize: 119,
  michaelWeight: 280,
  titleX: -265,
  titleY: -72,
  imageScale: 0.99,
  imageX: 219,
  imageY: 79,
  skylineScale: 2.13,
  skylineX: 31,
  skylineY: 115,
  lensZoom: 1.16,
  lensX: -1,
  lensY: -3,
  lensBlur: 0,
  lensOpacity: 0.93,
  lensChroma: 28,
}

const defaultLensWashSettings: HeroLensWashSettings = {
  angle: 347,
  color: '#e8a411',
  opacity: 0.8,
  colorEnd: '#d31717',
  opacityEnd: 0.45,
  fade: 54,
  end: 81,
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
  root.style.setProperty('--hero-skyline-scale', `${s.skylineScale}`)
  root.style.setProperty('--hero-skyline-x', `${s.skylineX}px`)
  root.style.setProperty('--hero-skyline-y', `${s.skylineY}px`)
  root.style.setProperty('--hero-lens-zoom', `${s.lensZoom}`)
  root.style.setProperty('--hero-lens-x', `${s.lensX}px`)
  root.style.setProperty('--hero-lens-y', `${s.lensY}px`)
  root.style.setProperty('--hero-lens-blur', `${s.lensBlur}px`)
  root.style.setProperty('--hero-lens-opacity', `${s.lensOpacity}`)
  root.style.setProperty('--hero-lens-chroma', `${s.lensChroma}`)
  document.querySelectorAll<HTMLElement>('.masthead__given-name').forEach((el) => {
    el.style.setProperty('font-weight', `${s.michaelWeight}`, 'important')
    el.style.setProperty(
      'font-variation-settings',
      `"wght" ${s.michaelWeight}`,
      'important',
    )
  })
}

function applyLensWashToDOM(s: HeroLensWashSettings) {
  const root = document.body
  root.style.setProperty('--hero-lens-wash-angle', `${s.angle}deg`)
  root.style.setProperty('--hero-lens-wash-color', s.color)
  root.style.setProperty('--hero-lens-wash-opacity', `${s.opacity}`)
  root.style.setProperty('--hero-lens-wash-color-end', s.colorEnd)
  root.style.setProperty('--hero-lens-wash-opacity-end', `${s.opacityEnd}`)
  root.style.setProperty('--hero-lens-wash-fade', `${s.fade}%`)
  root.style.setProperty('--hero-lens-wash-end', `${s.end}%`)
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

const presetId = JSON.stringify({
  defaultHeroSettings,
  defaultLayoutSettings,
  defaultLensWashSettings,
})

export function HeroTitleDebugPanel() {
  const [s, setS] = useState(defaultHeroSettings)
  const [layout, setLayout] = useState(defaultLayoutSettings)
  const [wash, setWash] = useState(defaultLensWashSettings)
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const stateRef = useRef(s)
  stateRef.current = s
  const layoutRef = useRef(layout)
  layoutRef.current = layout
  const washRef = useRef(wash)
  washRef.current = wash

  useLayoutEffect(() => {
    setS(defaultHeroSettings)
    setLayout(defaultLayoutSettings)
    setWash(defaultLensWashSettings)
  }, [presetId])

  useLayoutEffect(() => {
    applyToDOM(s)
    applyLayoutToDOM(layout)
    applyLensWashToDOM(wash)
  }, [s, layout, wash])

  const update = useCallback((k: keyof HeroTextureSettings, v: string | number) => {
    setS((prev) => ({ ...prev, [k]: v }))
  }, [])

  const updateLayout = useCallback((key: keyof HeroLayoutSettings, value: number) => {
    setLayout((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateWash = useCallback(
    (key: keyof HeroLensWashSettings, value: string | number) => {
      setWash((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

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
                  lensWash: washRef.current,
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
                setWash(defaultLensWashSettings)
                applyToDOM(defaultHeroSettings)
                applyLayoutToDOM(defaultLayoutSettings)
                applyLensWashToDOM(defaultLensWashSettings)
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
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 8,
          }}
        >
          {(
            [
              [
                'Title',
                [
                  ['titleSize', 'Size', layout.titleSize, 70, 280, 1],
                  ['titleX', 'X', layout.titleX, -700, 700, 1],
                  ['titleY', 'Y', layout.titleY, -500, 500, 1],
                ],
              ],
              [
                'Hex mark',
                [
                  ['imageScale', 'Size', layout.imageScale, 0.4, 3, 0.01],
                  ['imageX', 'X', layout.imageX, -900, 900, 1],
                  ['imageY', 'Y', layout.imageY, -700, 700, 1],
                ],
              ],
              [
                'Skyline',
                [
                  ['skylineScale', 'Size', layout.skylineScale, 0.25, 2.4, 0.01],
                  ['skylineX', 'X', layout.skylineX, -900, 900, 1],
                  ['skylineY', 'Y', layout.skylineY, -700, 700, 1],
                ],
              ],
              [
                'Lens',
                [
                  ['lensZoom', 'Zoom', layout.lensZoom, 1, 1.8, 0.01],
                  ['lensX', 'X', layout.lensX, -400, 400, 1],
                  ['lensY', 'Y', layout.lensY, -400, 400, 1],
                  ['lensBlur', 'Blur', layout.lensBlur, 0, 8, 0.1],
                  ['lensOpacity', 'Opacity', layout.lensOpacity, 0, 1, 0.01],
                  ['lensChroma', 'Chroma', layout.lensChroma, 0, 48, 0.5],
                ],
              ],
            ] as [
              string,
              [keyof HeroLayoutSettings, string, number, number, number, number][],
            ][]
          ).map(([title, sliders]) => (
            <div
              key={title}
              style={{ minWidth: 0, padding: 8, background: '#1a1a1a', borderRadius: 6 }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{title}</div>
              {sliders.map(([key, label, value, min, max, step]) => (
                <label key={key} style={{ display: 'block', marginTop: 4 }}>
                  {label}: <strong>{value}</strong>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onInput={(event) =>
                      updateLayout(key, Number(event.currentTarget.value))
                    }
                    onChange={(event) =>
                      updateLayout(key, Number(event.target.value))
                    }
                    style={{ width: '100%' }}
                  />
                </label>
              ))}
              {title === 'Lens' && (
                <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #333' }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Gradient</div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Start
                    <input
                      type="color"
                      value={wash.color}
                      onChange={(event) => updateWash('color', event.target.value)}
                    />
                    <span style={{ fontSize: 10, opacity: 0.7 }}>{wash.color}</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    End
                    <input
                      type="color"
                      value={wash.colorEnd}
                      onChange={(event) => updateWash('colorEnd', event.target.value)}
                    />
                    <span style={{ fontSize: 10, opacity: 0.7 }}>{wash.colorEnd}</span>
                  </label>
                  {(
                    [
                      ['angle', 'Angle', wash.angle, 0, 360, 1],
                      ['opacity', 'Start strength', wash.opacity, 0, 1, 0.01],
                      ['opacityEnd', 'End strength', wash.opacityEnd, 0, 1, 0.01],
                      ['fade', 'Fade start %', wash.fade, 0, 100, 1],
                      ['end', 'Fade end %', wash.end, 0, 100, 1],
                    ] as [keyof HeroLensWashSettings, string, number, number, number, number][]
                  ).map(([key, label, value, min, max, step]) => (
                    <label key={key} style={{ display: 'block', marginTop: 4 }}>
                      {label}: <strong>{value}</strong>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onInput={(event) =>
                          updateWash(key, Number(event.currentTarget.value))
                        }
                        onChange={(event) =>
                          updateWash(key, Number(event.currentTarget.value))
                        }
                        style={{ width: '100%' }}
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          {layers.map(layer => (
            <LayerSection key={layer.label} {...layer} onUpdate={update} />
          ))}
        </div>
      )}
    </div>
  )
}
