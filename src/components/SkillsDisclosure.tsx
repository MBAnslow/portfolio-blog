import { useId, useState } from 'react'
import type { MouseEvent } from 'react'

type SkillsDisclosureProps = {
  className: string
  technical: string[]
  soft: string[]
}

export function SkillsDisclosure({
  className,
  technical,
  soft,
}: SkillsDisclosureProps) {
  const [open, setOpen] = useState(false)
  const listId = useId()

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    // The toggle sits inside a clickable card or link row.
    event.preventDefault()
    event.stopPropagation()
    setOpen((value) => !value)
  }

  return (
    <div className="skills-disclosure" data-open={open || undefined}>
      <button
        className="skills-disclosure__toggle"
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={toggle}
      >
        <span className="skills-disclosure__label">Skills</span>
        <span className="skills-disclosure__count">
          {technical.length + soft.length}
        </span>
        <svg
          className="skills-disclosure__icon"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M3.5 6 8 10.5 12.5 6" />
        </svg>
      </button>
      <dl className={className} id={listId}>
        <div>
          <dt>Technical practice</dt>
          <dd>
            {technical.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </dd>
        </div>
        <div>
          <dt>Ways of working</dt>
          <dd>
            {soft.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  )
}
