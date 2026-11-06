import { useEffect, useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import type { PanelColourConfig } from '../data/panelColours'
import type { Project } from '../data/portfolio'
import { basePath } from '../utils/basePath'
import { createProjectSymbol } from '../utils/projectSymbol'
import { ProjectSymbol } from './ProjectSymbol'
import { SkillsDisclosure } from './SkillsDisclosure'

type ProjectCardProps = {
  project: Project
  colourConfig: PanelColourConfig
  expanded: boolean
  controls: string
  onToggle: () => void
}

type TiltProperties = CSSProperties & {
  '--tilt-x': string
  '--tilt-y': string
  '--title-texture-angle': string
  '--title-grain-filter': string
  '--title-halftone': string
  '--overlap-box-color'?: string
  '--description-box-background'?: string
  '--description-box-border-color'?: string
  '--description-title-overlap-color'?: string
  '--description-text-color'?: string
  '--description-text-outline-color'?: string
  '--description-overlap-text-color'?: string
  '--description-overlap-text-outline-color'?: string
  '--project-panel-color'?: string
  '--panel-title-outline-color'?: string
  '--panel-pattern-color'?: string
  '--panel-pattern-texture-color'?: string
  '--panel-pattern-backdrop-color'?: string
  '--panel-pattern-grain-color'?: string
  '--panel-pattern-stroke-color'?: string
  '--panel-pattern-crayon-color'?: string
  '--panel-pattern-wash-color'?: string
  '--panel-pattern-pencil-color'?: string
  '--panel-details-color'?: string
}

const neutralTilt: Pick<TiltProperties, '--tilt-x' | '--tilt-y'> = {
  '--tilt-x': '0deg',
  '--tilt-y': '0deg',
}

function renderDescriptionText(text: string) {
  return text.split(/(\s+)/).map((token, tokenIndex) =>
    /\s+/.test(token) ? (
      token
    ) : (
      <span
        className="project-card__description-word"
        data-description-word
        key={`${token}-${tokenIndex}`}
      >
        {Array.from(token).map((character, characterIndex) => (
          <span
            data-description-character
            key={`${character}-${characterIndex}`}
          >
            {character}
          </span>
        ))}
      </span>
    ),
  )
}

export function ProjectCard({
  project,
  colourConfig,
  expanded,
  controls,
  onToggle,
}: ProjectCardProps) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const body = bodyRef.current
    const title = titleRef.current
    const description = descriptionRef.current

    if (!body || !title || !description) return

    let fittedBodyWidth = -1
    let fittedBodyHeight = -1
    let fittedTitleWidth = -1
    let fittedTitleHeight = -1
    let lastBodyWidth = -1

    const fitTitle = () => {
      const bodyRect = body.getBoundingClientRect()
      const titleWidth = title.clientWidth
      const titleHeight = title.clientHeight

      if (
        Math.abs(bodyRect.width - fittedBodyWidth) < 0.5 &&
        Math.abs(titleWidth - fittedTitleWidth) < 0.5 &&
        Math.abs(titleHeight - fittedTitleHeight) < 0.5
      ) {
        return
      }

      fittedBodyWidth = bodyRect.width
      fittedBodyHeight = bodyRect.height
      fittedTitleWidth = titleWidth
      fittedTitleHeight = titleHeight
      title.style.removeProperty('font-size')

      const preferredSize = Number.parseFloat(
        window.getComputedStyle(title).fontSize,
      )
      const fits = () => {
        const frame = title.getBoundingClientRect()
        const styles = window.getComputedStyle(title)
        const innerTop =
          frame.top +
          Number.parseFloat(styles.borderTopWidth) +
          Number.parseFloat(styles.paddingTop)
        const innerRight =
          frame.right -
          Number.parseFloat(styles.borderRightWidth) -
          Number.parseFloat(styles.paddingRight)
        const words = title.querySelectorAll<HTMLElement>(
          '.project-card__title-word',
        )
        const letters = title.querySelectorAll<HTMLElement>(
          '[data-title-character]',
        )

        const clearsTopEdge = Array.from(words).every(
          (word) => word.getBoundingClientRect().top >= innerTop - 1,
        )
        const clearsRightEdge = Array.from(letters).every(
          (letter) => letter.getBoundingClientRect().right <= innerRight + 1,
        )
        const staysInsidePanel = Array.from(letters).every((letter) => {
          const rectangle = letter.getBoundingClientRect()

          return (
            rectangle.left >= bodyRect.left - 1 &&
            rectangle.right <= bodyRect.right + 1 &&
            rectangle.top >= bodyRect.top - 1 &&
            rectangle.bottom <= bodyRect.bottom + 1
          )
        })

        return clearsTopEdge && clearsRightEdge && staysInsidePanel
      }
      let minimumSize = 16
      let maximumSize = Math.max(
        preferredSize,
        title.clientHeight * 1.5,
        title.clientWidth * 0.5,
      )

      title.style.fontSize = `${maximumSize}px`

      while (fits() && maximumSize < 512) {
        minimumSize = maximumSize
        maximumSize = Math.min(512, maximumSize * 1.35)
        title.style.fontSize = `${maximumSize}px`
      }

      for (let iteration = 0; iteration < 14; iteration += 1) {
        const candidate = (minimumSize + maximumSize) / 2
        title.style.fontSize = `${candidate}px`

        if (fits()) {
          minimumSize = candidate
        } else {
          maximumSize = candidate
        }
      }

      title.style.fontSize = `${minimumSize}px`
    }

    const fitDescription = () => {
      const bodyRect = body.getBoundingClientRect()
      const compact = window.innerWidth < 901
      const minLeft = compact ? 24 : Math.max(48, bodyRect.width * 0.08)
      const rightPadding = compact ? 12 : 20
      const titleGap = compact ? 12 : 20
      const titleCharacters = title.querySelectorAll<HTMLElement>(
        '[data-title-character]',
      )
      const titleRight =
        titleCharacters.length > 0
          ? Math.max(
              ...Array.from(titleCharacters, (character) =>
                character.getBoundingClientRect().right,
              ),
            ) - bodyRect.left
          : body.clientWidth - 24
      const rightLimit = Math.min(
        body.clientWidth - rightPadding,
        Math.max(minLeft + 160, titleRight + titleGap),
      )
      const maxWidth = Math.max(160, rightLimit - minLeft)

      description.style.left = 'auto'
      description.style.right = `${body.clientWidth - rightLimit}px`
      description.style.width = `${maxWidth}px`
    }

    const updateOverlap = () => {
      const currentBodyWidth = body.getBoundingClientRect().width
      const compact = window.innerWidth < 901

      if (Math.abs(currentBodyWidth - lastBodyWidth) >= 0.5) {
        lastBodyWidth = currentBodyWidth
        title.style.removeProperty('height')
        title.style.removeProperty('font-size')
        body.style.removeProperty('min-height')
        fittedBodyWidth = -1
        fittedBodyHeight = -1
        fittedTitleWidth = -1
        fittedTitleHeight = -1
      }

      fitTitle()

      if (!compact) {
        title.style.height = `${title.offsetHeight}px`
      }

      fitDescription()

      const titleLetters = title.querySelectorAll<HTMLElement>(
        '[data-title-character]',
      )
      const descriptionLetters = description.querySelectorAll<HTMLElement>(
        '.project-card__description-copy [data-description-character]',
      )
      const clearOverlapBox = () => {
        delete body.dataset.overlapBox
        description.style.removeProperty('left')
        description.style.removeProperty('right')
        description.style.removeProperty('top')
        description.style.removeProperty('bottom')
        description.style.removeProperty('width')
        body.style.removeProperty('--description-title-mask')
        body.style.removeProperty('--description-copy-mask')
        body.style.removeProperty('--overlap-box-left')
        body.style.removeProperty('--overlap-box-top')
        body.style.removeProperty('--overlap-box-width')
        body.style.removeProperty('--overlap-box-height')
      }

      if (
        titleLetters.length === 0 ||
        descriptionLetters.length === 0
      ) {
        clearOverlapBox()
        return
      }

      const bodyRect = body.getBoundingClientRect()
      const canvasWidth = Math.max(1, Math.ceil(bodyRect.width))
      const canvasHeight = Math.max(1, Math.ceil(bodyRect.height))
      const titleCanvas = document.createElement('canvas')
      titleCanvas.width = canvasWidth
      titleCanvas.height = canvasHeight
      const titleContext = titleCanvas.getContext('2d')

      if (!titleContext) {
        clearOverlapBox()
        return
      }

      const drawLetter = (
        context: CanvasRenderingContext2D,
        letter: HTMLElement,
        styles: CSSStyleDeclaration,
        uppercase = false,
      ) => {
        const character = uppercase
          ? (letter.textContent ?? '').toLocaleUpperCase()
          : (letter.textContent ?? '')
        const rectangle = letter.getBoundingClientRect()
        context.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`
        context.textBaseline = 'alphabetic'
        context.fillStyle = '#000'

        const metrics = context.measureText(character)
        const ascent =
          metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent
        const descent =
          metrics.fontBoundingBoxDescent || metrics.actualBoundingBoxDescent
        const baseline =
          rectangle.top -
          bodyRect.top +
          (rectangle.height - ascent - descent) / 2 +
          ascent

        context.fillText(
          character,
          rectangle.left - bodyRect.left,
          baseline,
        )
      }

      const titleStyles = window.getComputedStyle(title)
      titleLetters.forEach((letter) => {
        drawLetter(titleContext, letter, titleStyles, true)
      })

      const titlePixels = titleContext.getImageData(
        0,
        0,
        canvasWidth,
        canvasHeight,
      ).data

      let titlePixelTop = canvasHeight
      let titlePixelBottom = -1

      for (let y = 0; y < canvasHeight; y += 1) {
        for (let x = 0; x < canvasWidth; x += 1) {
          if (titlePixels[(y * canvasWidth + x) * 4 + 3] > 0) {
            titlePixelTop = Math.min(titlePixelTop, y)
            titlePixelBottom = Math.max(titlePixelBottom, y)
          }
        }
      }

      if (titlePixelBottom >= titlePixelTop) {
        const titleLineCount = new Set(
          Array.from(
            title.querySelectorAll<HTMLElement>('.project-card__title-word'),
            (word) => Math.round(word.getBoundingClientRect().top),
          ),
        ).size
        const descriptionStartRatio = titleLineCount > 1 ? 0.72 : 0.65
        const descriptionStart =
          titlePixelTop +
          (titlePixelBottom - titlePixelTop + 1) * descriptionStartRatio

        description.style.top = `${descriptionStart}px`
        description.style.bottom = 'auto'
      }

      body.style.removeProperty('--description-font-size')

      const descriptionRect = description.getBoundingClientRect()

      if (compact) {
        body.style.minHeight = `${Math.ceil(
          descriptionRect.bottom - body.getBoundingClientRect().top + 20,
        )}px`
      } else {
        const overflow =
          descriptionRect.bottom + 48 - body.getBoundingClientRect().bottom

        if (overflow > 1) {
          body.style.minHeight = `${Math.ceil(body.clientHeight + overflow)}px`
        }
      }

      const maskWidth = Math.max(1, Math.ceil(descriptionRect.width))
      const maskHeight = Math.max(1, Math.ceil(descriptionRect.height))
      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = maskWidth
      maskCanvas.height = maskHeight
      const maskContext = maskCanvas.getContext('2d')

      if (maskContext) {
        const overlapMask = maskContext.createImageData(maskWidth, maskHeight)
        const copyMask = maskContext.createImageData(maskWidth, maskHeight)
        const offsetX = descriptionRect.left - bodyRect.left
        const offsetY = descriptionRect.top - bodyRect.top

        for (let y = 0; y < maskHeight; y += 1) {
          for (let x = 0; x < maskWidth; x += 1) {
            const maskIndex = (y * maskWidth + x) * 4
            const bodyX = Math.floor(offsetX + x)
            const bodyY = Math.floor(offsetY + y)
            const insideBody =
              bodyX >= 0 &&
              bodyX < canvasWidth &&
              bodyY >= 0 &&
              bodyY < canvasHeight
            const titleAlpha = insideBody
              ? titlePixels[(bodyY * canvasWidth + bodyX) * 4 + 3]
              : 0

            overlapMask.data[maskIndex] = 255
            overlapMask.data[maskIndex + 1] = 255
            overlapMask.data[maskIndex + 2] = 255
            overlapMask.data[maskIndex + 3] = titleAlpha
            copyMask.data[maskIndex] = 255
            copyMask.data[maskIndex + 1] = 255
            copyMask.data[maskIndex + 2] = 255
            copyMask.data[maskIndex + 3] = 255 - titleAlpha
          }
        }

        maskContext.putImageData(overlapMask, 0, 0)
        body.style.setProperty(
          '--description-title-mask',
          `url("${maskCanvas.toDataURL()}")`,
        )
        maskContext.putImageData(copyMask, 0, 0)
        body.style.setProperty(
          '--description-copy-mask',
          `url("${maskCanvas.toDataURL()}")`,
        )
      }
      const boxLeft = descriptionRect.left
      const boxTop = descriptionRect.top
      const boxRight = descriptionRect.right
      const boxBottom = descriptionRect.bottom

      const left = boxLeft - bodyRect.left
      const top = boxTop - bodyRect.top
      const right = boxRight - bodyRect.left
      const bottom = boxBottom - bodyRect.top

      body.dataset.overlapBox = 'true'
      body.style.setProperty('--overlap-box-left', `${left}px`)
      body.style.setProperty('--overlap-box-top', `${top}px`)
      body.style.setProperty('--overlap-box-width', `${right - left}px`)
      body.style.setProperty('--overlap-box-height', `${bottom - top}px`)
    }

    updateOverlap()

    const observer = new ResizeObserver(updateOverlap)
    observer.observe(body)
    observer.observe(title)
    observer.observe(description)
    void document.fonts.ready.then(() => {
      fittedBodyWidth = -1
      fittedBodyHeight = -1
      fittedTitleWidth = -1
      fittedTitleHeight = -1
      updateOverlap()
    })

    return () => observer.disconnect()
  }, [project.description, project.title])

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5

    event.currentTarget.style.setProperty('--tilt-y', `${x * 2.4}deg`)
    event.currentTarget.style.setProperty('--tilt-x', `${y * -2.4}deg`)
  }

  const resetTilt = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg')
    event.currentTarget.style.setProperty('--tilt-y', '0deg')
  }

  const symbol = createProjectSymbol(project.title)
  const titleGrainId = `project-title-grain-${project.number}`
  const cardSurfaceStyle = {
    ...neutralTilt,
    '--title-texture-angle': `${Number.parseInt(symbol.key.slice(0, 4), 16) % 360}deg`,
    '--title-grain-filter': `url(#${titleGrainId})`,
    '--title-halftone': `url(${basePath}media/halftone-ink.webp)`,
    '--overlap-box-color': colourConfig.descriptionBackgroundColor,
    '--description-box-background': colourConfig.descriptionBackgroundColor,
    '--description-box-border-color': colourConfig.descriptionBorderColor,
    '--description-title-overlap-color': colourConfig.boxTitleOverlapColor,
    '--description-text-color': colourConfig.descriptionTextColor,
    '--description-text-outline-color':
      colourConfig.descriptionTextOutlineColor,
    '--description-overlap-text-color': colourConfig.overlapTextColor,
    '--description-overlap-text-outline-color':
      colourConfig.overlapTextOutlineColor,
    '--project-panel-color': colourConfig.panelColor,
    '--panel-title-outline-color': colourConfig.titleOutlineColor,
    '--panel-pattern-color': colourConfig.patternColor,
    '--panel-pattern-texture-color': colourConfig.patternTextureColor,
    '--panel-pattern-backdrop-color': colourConfig.patternBackdropColor,
    '--panel-pattern-grain-color': colourConfig.patternGrainColor,
    '--panel-pattern-stroke-color': colourConfig.patternStrokeColor,
    '--panel-pattern-crayon-color': colourConfig.patternCrayonColor,
    '--panel-pattern-wash-color': colourConfig.patternWashColor,
    '--panel-pattern-pencil-color': colourConfig.patternPencilColor,
    '--panel-details-color': colourConfig.detailsColor,
    backgroundColor: colourConfig.panelColor,
    backgroundImage: 'none',
  } as TiltProperties

  return (
    <article
      className={`project-card project-card--${project.accent}${expanded ? ' project-card--expanded' : ''}`}
      data-project-number={project.number}
      style={cardSurfaceStyle}
      onClick={onToggle}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="project-card__topline">
        <span>{project.number}</span>
        <span>{project.eyebrow}</span>
        <span className="project-card__role">Role: {project.role}</span>
      </div>
      <div className="project-card__body" ref={bodyRef}>
        <svg
          className="project-card__title-defs"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter
              id={titleGrainId}
              x="-8%"
              y="-8%"
              width="116%"
              height="116%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.004 0.007"
                numOctaves="2"
                seed={Number.parseInt(symbol.key.slice(0, 6), 16) % 997}
                result="coarseNoise"
              />
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.12"
                numOctaves="4"
                seed={Number.parseInt(symbol.key.slice(-4), 16) % 991}
                result="fineNoise"
              />
              <feBlend
                in="coarseNoise"
                in2="fineNoise"
                mode="soft-light"
                result="variedNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="variedNoise"
                scale="1.15"
                xChannelSelector="R"
                yChannelSelector="G"
                result="roughType"
              />
              <feColorMatrix
                in="variedNoise"
                type="saturate"
                values="0"
                result="monoNoise"
              />
              <feComponentTransfer in="monoNoise" result="grain">
                <feFuncA type="linear" slope="0.14" />
              </feComponentTransfer>
              <feBlend
                in="roughType"
                in2="grain"
                mode="soft-light"
                result="grained"
              />
              <feComposite
                in="grained"
                in2="roughType"
                operator="in"
              />
            </filter>
          </defs>
        </svg>
        <ProjectSymbol title={project.title} />
        <div className="project-card__type-blend">
          <h3 ref={titleRef}>
            {project.title.split(/(\s+)/).map((token, tokenIndex) =>
              /\s+/.test(token) ? (
                token
              ) : (
                <span
                  className="project-card__title-word"
                  key={`${token}-${tokenIndex}`}
                >
                  {Array.from(token).map((character, characterIndex) => (
                    <span
                      data-title-character={character}
                      key={`${character}-${characterIndex}`}
                    >
                      {character}
                    </span>
                  ))}
                </span>
              ),
            )}
          </h3>
          <p
            className="project-card__description-overlap-original"
            aria-hidden="true"
          >
            {renderDescriptionText(project.description)}
          </p>
          <div className="project-card__description-blend-result">
            <div
              className="project-card__description-mix-base"
              aria-hidden="true"
            />
            <p className="project-card__description-overlap" aria-hidden="true">
              {renderDescriptionText(project.description)}
            </p>
          </div>
        </div>
        <p ref={descriptionRef}>
          <span className="project-card__description-copy">
            {renderDescriptionText(project.description)}
          </span>
        </p>
      </div>
      <div className="project-card__footer">
        <div className="project-card__footer-content">
          <SkillsDisclosure
            className="project-card__skills"
            technical={project.skills.technical}
            soft={project.skills.soft}
          />
        </div>
        <button
          className="project-card__action"
          type="button"
          aria-expanded={expanded}
          aria-controls={controls}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${project.title} project details`}
        >
          <span aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
      </div>
    </article>
  )
}
