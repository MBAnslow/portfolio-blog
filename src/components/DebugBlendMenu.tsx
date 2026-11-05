import { useState } from 'react'
import type { PanelColourConfig } from '../data/panelColours'

type DebugBlendMenuProps = {
  configs: Record<string, PanelColourConfig>
  onConfigChange: (panelNumber: string, config: PanelColourConfig) => void
}

const colourFields = [
  { key: 'panelColor', label: 'Panel' },
  { key: 'titleOutlineColor', label: 'Title outline' },
  { key: 'patternColor', label: 'Pattern' },
  { key: 'patternTextureColor', label: 'Texture' },
  { key: 'patternBackdropColor', label: 'Backdrop' },
  { key: 'patternGrainColor', label: 'Grain' },
  { key: 'patternStrokeColor', label: 'Stroke' },
  { key: 'patternCrayonColor', label: 'Crayon' },
  { key: 'patternWashColor', label: 'Wash' },
  { key: 'patternPencilColor', label: 'Pencil' },
  { key: 'detailsColor', label: 'Role & skills' },
  { key: 'descriptionBackgroundColor', label: 'Description' },
  { key: 'descriptionBorderColor', label: 'Border' },
  { key: 'boxTitleOverlapColor', label: 'Title overlap' },
  { key: 'descriptionTextColor', label: 'Description text' },
  { key: 'descriptionTextOutlineColor', label: 'Description outline' },
  { key: 'overlapTextColor', label: 'Overlap text' },
  { key: 'overlapTextOutlineColor', label: 'Overlap outline' },
] as const

export function DebugBlendMenu({
  configs,
  onConfigChange,
}: DebugBlendMenuProps) {
  const panelNumbers = Object.keys(configs).sort()
  const [selectedPanel, setSelectedPanel] = useState(panelNumbers[0] ?? '01')
  const [open, setOpen] = useState(true)
  const [copyStatus, setCopyStatus] = useState<
    'idle' | 'copied' | 'failed'
  >('idle')
  const activeConfig = configs[selectedPanel]

  const updateColour = (
    key: (typeof colourFields)[number]['key'],
    value: string,
  ) => {
    if (!activeConfig) return

    onConfigChange(selectedPanel, {
      ...activeConfig,
      [key]: value,
    })
  }

  const copyConfig = async () => {
    const config = JSON.stringify({ panels: configs }, null, 2)

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable')
      }

      await navigator.clipboard.writeText(config)
      setCopyStatus('copied')
      window.setTimeout(() => setCopyStatus('idle'), 1800)
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <aside className={`debug-blend${open ? '' : ' debug-blend--collapsed'}`}>
      <button
        className="debug-blend__toggle"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        Panel colours
      </button>
      {open && activeConfig && (
        <>
          <div className="debug-blend__control">
            <span>Select a panel to configure</span>
            <div
              className="debug-blend__swatches"
              role="group"
              aria-label="Panel colour configurations"
            >
              {panelNumbers.map((panelNumber) => {
                const config = configs[panelNumber]
                const stops = colourFields
                  .map(({ key }, index) => {
                    const start = (index / colourFields.length) * 100
                    const end = ((index + 1) / colourFields.length) * 100
                    return `${config[key]} ${start}% ${end}%`
                  })
                  .join(', ')

                return (
                  <button
                    key={panelNumber}
                    type="button"
                    className={
                      selectedPanel === panelNumber
                        ? 'debug-blend__swatch debug-blend__swatch--active'
                        : 'debug-blend__swatch'
                    }
                    style={{
                      background: `linear-gradient(90deg, ${stops})`,
                    }}
                    aria-label={`Configure panel ${panelNumber}`}
                    aria-pressed={selectedPanel === panelNumber}
                    onClick={() => setSelectedPanel(panelNumber)}
                  >
                    <span>{panelNumber}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="debug-blend__control">
            <span>Panel {selectedPanel} configuration</span>
            <div className="debug-blend__combo-editor">
              {colourFields.map(({ key, label }) => (
                <label key={key}>
                  <span>{label}</span>
                  <input
                    type="color"
                    value={activeConfig[key]}
                    onChange={(event) => updateColour(key, event.target.value)}
                  />
                  <code>{activeConfig[key]}</code>
                </label>
              ))}
            </div>
            <button
              className="debug-blend__copy"
              type="button"
              onClick={() => void copyConfig()}
            >
              {copyStatus === 'copied'
                ? 'Copied all panel configurations'
                : copyStatus === 'failed'
                  ? 'Copy failed'
                  : 'Copy all panel configurations'}
            </button>
          </div>
        </>
      )}
    </aside>
  )
}
