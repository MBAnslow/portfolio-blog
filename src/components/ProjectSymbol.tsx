import { createProjectSymbol } from '../utils/projectSymbol'

type ProjectSymbolProps = {
  title: string
}

export function ProjectSymbol({ title }: ProjectSymbolProps) {
  const geometry = createProjectSymbol(title)
  const gradientAngle = Number.parseInt(geometry.key.slice(0, 4), 16) % 360
  const textureIndex = Number.parseInt(geometry.key.slice(-2), 16) % 9
  const textureId = `project-symbol-texture-${geometry.key}`
  const gritId = `project-symbol-grit-${geometry.key}`
  const crayonId = `project-symbol-crayon-${geometry.key}`
  const crayonTextureId = `project-symbol-crayon-texture-${geometry.key}`
  const backdropClipId = `project-symbol-backdrop-clip-${geometry.key}`
  const backdropGrainId = `project-symbol-backdrop-grain-${geometry.key}`
  const gritSeed = Number.parseInt(geometry.key.slice(0, 6), 16) % 997
  const textureOpacity = 0.94

  return (
    <svg
      className="project-symbol"
      viewBox={geometry.viewBox}
      aria-hidden="true"
      focusable="false"
      data-symbol-key={geometry.key}
      data-symbol-layout={geometry.layout}
      data-symbol-texture={textureIndex}
    >
      <defs>
        <filter
          id={gritId}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.006"
            numOctaves="2"
            seed={gritSeed}
            result="coarseNoise"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.11"
            numOctaves="4"
            seed={gritSeed + 37}
            result="fineNoise"
          />
          <feBlend
            in="coarseNoise"
            in2="fineNoise"
            mode="soft-light"
            result="variedNoise"
          />
          <feColorMatrix
            in="variedNoise"
            type="saturate"
            values="0"
            result="monochromeNoise"
          />
          <feComponentTransfer in="monochromeNoise" result="grain">
            <feFuncR type="linear" slope="3.4" intercept="-1.15" />
            <feFuncG type="linear" slope="3.4" intercept="-1.15" />
            <feFuncB type="linear" slope="3.4" intercept="-1.15" />
            <feFuncA type="linear" slope="0.36" />
          </feComponentTransfer>
          <feComposite in="grain" in2="SourceGraphic" operator="in" />
        </filter>
        <filter
          id={crayonTextureId}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.34 0.19"
            numOctaves="3"
            seed={gritSeed + 71}
            result="waxNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="waxNoise"
            scale="0.85"
            xChannelSelector="R"
            yChannelSelector="B"
            result="roughStrokes"
          />
          <feComponentTransfer in="waxNoise" result="waxContrast">
            <feFuncR type="linear" slope="2.8" intercept="-0.82" />
            <feFuncG type="linear" slope="2.8" intercept="-0.82" />
            <feFuncB type="linear" slope="2.8" intercept="-0.82" />
          </feComponentTransfer>
          <feColorMatrix
            in="waxContrast"
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.333 0.333 0.333 0 0"
            result="waxMask"
          />
          <feComposite in="roughStrokes" in2="waxMask" operator="in" />
        </filter>
        <filter
          id={backdropGrainId}
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="2"
            seed={gritSeed + 113}
            result="mottleNoise"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.15"
            numOctaves="2"
            seed={gritSeed + 151}
            result="speckleNoise"
          />
          <feComposite
            in="speckleNoise"
            in2="mottleNoise"
            operator="arithmetic"
            k2="0.72"
            k3="0.38"
            result="mixedNoise"
          />
          <feColorMatrix
            in="mixedNoise"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 4.2 0 0 0 -2.05"
            result="speckleMask"
          />
          <feComposite in="SourceGraphic" in2="speckleMask" operator="in" />
        </filter>
        {geometry.blobs.map((blob, index) => (
          <clipPath
            id={`project-symbol-blob-clip-${geometry.key}-${index}`}
            key={`clip-${geometry.key}-${index}`}
          >
            <path d={blob.d} />
          </clipPath>
        ))}
        <clipPath id={backdropClipId}>
          <path d={geometry.backdropD} />
        </clipPath>
        <pattern
          id={crayonId}
          width="18"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${gradientAngle % 70 - 35})`}
          color="var(--panel-pattern-crayon-color, var(--panel-pattern-color))"
        >
          <path
            d="M -3 0.8 C 2 0 5 1.8 10 0.65 S 17 1.4 21 0.3"
            fill="none"
            stroke="currentColor"
            strokeDasharray="6 0.7 3 0.45"
            strokeLinecap="round"
            strokeOpacity="0.62"
            strokeWidth="1.65"
          />
          <path
            d="M -2 2.5 C 3 1.6 6 3.35 11 2.15 S 17 3 20 1.9"
            fill="none"
            stroke="currentColor"
            strokeDasharray="3.7 0.55 7 0.8"
            strokeLinecap="round"
            strokeOpacity="0.48"
            strokeWidth="1.3"
          />
          <path
            d="M -3 4.2 C 1 3.2 6 5.1 9 3.85 S 15 4.9 21 3.35"
            fill="none"
            stroke="currentColor"
            strokeDasharray="8 0.65 2.4 0.55"
            strokeLinecap="round"
            strokeOpacity="0.68"
            strokeWidth="1.85"
          />
          <path
            d="M -2 6 C 2 5 7 6.9 11 5.55 S 17 6.4 20 5.2"
            fill="none"
            stroke="currentColor"
            strokeDasharray="4.8 0.5 5.6 0.7"
            strokeLinecap="round"
            strokeOpacity="0.5"
            strokeWidth="1.45"
          />
          <path
            d="M -3 7.8 C 2 6.5 5 8.9 10 7.25 S 16 8.35 21 6.9"
            fill="none"
            stroke="currentColor"
            strokeDasharray="7 0.8 3.2 0.45"
            strokeLinecap="round"
            strokeOpacity="0.64"
            strokeWidth="1.75"
          />
          <path
            d="M -2 9.5 C 3 8.5 7 10.3 12 8.95 S 17 9.8 20 8.6"
            fill="none"
            stroke="currentColor"
            strokeDasharray="3 0.45 6.5 0.7"
            strokeLinecap="round"
            strokeOpacity="0.46"
            strokeWidth="1.25"
          />
        </pattern>
        <pattern
          className="project-symbol__texture"
          id={textureId}
          width={textureIndex === 3 ? 6 : 10}
          height={textureIndex === 3 ? 6 : 10}
          patternUnits="userSpaceOnUse"
          color="var(--panel-pattern-texture-color, var(--panel-pattern-color))"
        >
          {textureIndex === 0 && (
            <path
              d="M -2 10 L 10 -2 M 3 15 L 15 3"
              fill="none"
              stroke="currentColor"
              strokeOpacity={textureOpacity}
              strokeWidth="3"
            />
          )}
          {textureIndex === 1 && (
            <>
              <circle
                cx="2.5"
                cy="2.5"
                r="1.5"
                fill="currentColor"
                fillOpacity={textureOpacity}
              />
              <circle
                cx="7.5"
                cy="7.5"
                r="1.5"
                fill="currentColor"
                fillOpacity={textureOpacity}
              />
            </>
          )}
          {textureIndex === 2 && (
            <path
              d="M -2 10 L 10 -2 M 3 15 L 15 3 M -2 0 L 10 12 M 3 -5 L 15 7"
              fill="none"
              stroke="currentColor"
              strokeOpacity={textureOpacity}
              strokeWidth="2.7"
            />
          )}
          {textureIndex === 3 && (
            <>
              <rect
                width="3"
                height="3"
                fill="currentColor"
                fillOpacity={textureOpacity}
              />
              <rect
                x="3"
                y="3"
                width="3"
                height="3"
                fill="currentColor"
                fillOpacity={textureOpacity}
              />
            </>
          )}
          {textureIndex === 4 && (
            <path
              d="M 0 2.5 H 10 M 0 7.5 H 10"
              fill="none"
              stroke="currentColor"
              strokeOpacity={textureOpacity}
              strokeWidth="3"
            />
          )}
          {textureIndex === 5 && (
            <path
              d="M 2 0 V 4 M 7 5 V 10"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeOpacity={textureOpacity}
              strokeWidth="3.4"
            />
          )}
          {textureIndex === 6 && (
            <path
              d="M -2 3 Q 0 0 2 3 T 6 3 T 10 3 T 14 3 M -2 8 Q 0 5 2 8 T 6 8 T 10 8 T 14 8"
              fill="none"
              stroke="currentColor"
              strokeOpacity={textureOpacity}
              strokeWidth="2.7"
            />
          )}
          {textureIndex === 7 && (
            <path
              d="M 2 0 V 4 M 0 2 H 4 M 8 6 V 10 M 6 8 H 10"
              fill="none"
              stroke="currentColor"
              strokeOpacity={textureOpacity}
              strokeWidth="3"
            />
          )}
          {textureIndex === 8 && (
            <path
              d="M 5 0 L 10 5 L 5 10 L 0 5 Z"
              fill="none"
              stroke="currentColor"
              strokeOpacity={textureOpacity}
              strokeWidth="2.7"
            />
          )}
        </pattern>
        {geometry.blobs.map((blob, index) => (
          <linearGradient
            id={`project-symbol-gradient-${geometry.key}-${index}`}
            gradientTransform={`rotate(${gradientAngle} 0.5 0.5)`}
            key={`gradient-${geometry.key}-${index}`}
          >
            <stop
              offset="0%"
              stopColor="currentColor"
              stopOpacity={Math.min(0.32, blob.opacity + 0.06)}
            />
            <stop
              offset="52%"
              stopColor="currentColor"
              stopOpacity={Math.min(0.18, blob.opacity)}
            />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
          </linearGradient>
        ))}
      </defs>
      {geometry.blobs.map((blob, index) => (
        <path
          className="project-symbol__wash"
          d={blob.d}
          fill="currentColor"
          fillOpacity={Math.min(0.14, blob.opacity * 0.48)}
          stroke="none"
          transform={`translate(${blob.washOffsetX} ${blob.washOffsetY})`}
          key={`wash-${geometry.key}-${index}`}
        />
      ))}
      {geometry.blobs.map((blob, index) => {
        const isOutline = blob.treatment === 'outline'

        return (
          <path
            className={`project-symbol__blob project-symbol__blob--${blob.treatment} project-symbol__blob--${blob.family} project-symbol__blob--${blob.prominence}`}
            d={blob.d}
            fill={
              isOutline
                ? 'none'
                : `url(#project-symbol-gradient-${geometry.key}-${index})`
            }
            stroke="none"
            key={`${geometry.key}-${index}`}
          />
        )
      })}
      {geometry.blobs.map((_, index) => (
        <g
          clipPath={`url(#project-symbol-blob-clip-${geometry.key}-${index})`}
          key={`grit-${geometry.key}-${index}`}
        >
          <rect
            className="project-symbol__grain-layer"
            x="-100"
            y="-100"
            width="300"
            height="300"
            fill="var(--panel-pattern-color)"
            filter={`url(#${gritId})`}
          />
        </g>
      ))}
      {geometry.blobs.map((_, index) => (
        <g
          clipPath={`url(#project-symbol-blob-clip-${geometry.key}-${index})`}
          key={`crayon-${geometry.key}-${index}`}
        >
          <rect
            className="project-symbol__crayon-layer"
            x="-100"
            y="-100"
            width="300"
            height="300"
            fill={`url(#${crayonId})`}
            filter={`url(#${crayonTextureId})`}
          />
        </g>
      ))}
      {geometry.blobs.map((blob, index) => (
        <path
          className="project-symbol__pencil-outline"
          d={blob.outlineD}
          fill="var(--panel-pattern-pencil-color, var(--blue-dark))"
          fillOpacity="0.2"
          fillRule="evenodd"
          stroke="none"
          key={`pencil-${geometry.key}-${index}`}
        />
      ))}
      <path
        className="project-symbol__backdrop-fill"
        d={geometry.backdropD}
        fill="var(--panel-pattern-backdrop-color, var(--panel-pattern-color))"
        stroke="none"
      />
      <g clipPath={`url(#${backdropClipId})`}>
        <rect
          className="project-symbol__backdrop-grain"
          x="-100"
          y="-100"
          width="300"
          height="300"
          fill="var(--panel-pattern-grain-color, var(--panel-pattern-color))"
          filter={`url(#${backdropGrainId})`}
        />
        <rect
          className="project-symbol__backdrop-crayon"
          x="-100"
          y="-100"
          width="300"
          height="300"
          fill={`url(#${crayonId})`}
          filter={`url(#${crayonTextureId})`}
        />
      </g>
      <path
        className="project-symbol__backdrop"
        d={geometry.backdropD}
        fill={`url(#${textureId})`}
        stroke="var(--panel-pattern-stroke-color, var(--panel-pattern-color))"
        strokeOpacity="0.96"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  )
}
