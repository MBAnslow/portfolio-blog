type ProfileIconProps = {
  label: string
}

const marks: Record<string, string> = {
  LinkedIn:
    'M4.7 3.2A1.7 1.7 0 0 0 3 4.9v14.2c0 .94.76 1.7 1.7 1.7h14.6c.94 0 1.7-.76 1.7-1.7V4.9c0-.94-.76-1.7-1.7-1.7H4.7Zm3.5 15.2H6.1V9.6h2.1v8.8ZM7.15 8.6a1.22 1.22 0 1 1 0-2.44 1.22 1.22 0 0 1 0 2.44Zm11.15 9.8h-2.1v-4.28c0-1.02-.02-2.34-1.42-2.34-1.43 0-1.65 1.11-1.65 2.26v4.36H11v-8.8h2.02v1.2h.03c.28-.53 1.17-1.42 2.5-1.42 2.67 0 3.16 1.76 3.16 4.05v4.97Z',
  'Google Scholar':
    'M12 3.1 2.2 8.1 12 13.1l7.7-3.9v5.5h1.7V8.1L12 3.1Zm-5.6 8.7v3.7c0 1.7 2.5 3.4 5.6 3.4s5.6-1.7 5.6-3.4v-3.7L12 15l-5.6-3.2Z',
  GitHub:
    'M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.49.1.67-.21.67-.47v-1.65c-2.72.6-3.3-1.31-3.3-1.31-.44-1.13-1.08-1.43-1.08-1.43-.88-.6.07-.59.07-.59.98.07 1.49 1 1.49 1 .86 1.48 2.27 1.05 2.82.8.09-.64.34-1.05.62-1.3-2.17-.25-4.45-1.09-4.45-4.84 0-1.07.38-1.94 1-2.63-.1-.24-.43-1.25.1-2.6 0 0 .82-.27 2.68 1a9.3 9.3 0 0 1 4.88 0c1.86-1.27 2.68-1 2.68-1 .53 1.35.2 2.36.1 2.6.63.69 1 1.56 1 2.63 0 3.76-2.29 4.59-4.47 4.83.35.3.66.9.66 1.82v2.7c0 .26.18.58.68.47A9.8 9.8 0 0 0 12 2.2Z',
}

export function ProfileIcon({ label }: ProfileIconProps) {
  const mark = marks[label]

  return (
    <svg
      className="connect-panel__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {label === 'Sony CSL' ? (
        <>
          <rect
            x="1.6"
            y="1.6"
            width="20.8"
            height="20.8"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <text
            x="12"
            y="15.6"
            textAnchor="middle"
            fill="currentColor"
            fontFamily="'DM Mono', ui-monospace, monospace"
            fontSize="7.4"
            fontWeight="500"
          >
            CSL
          </text>
        </>
      ) : (
        <path d={mark} />
      )}
    </svg>
  )
}
