type SectionHeadingProps = {
  title: string
  note?: string
}

export function SectionHeading({ title, note }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <h2>{title}</h2>
      {note && <p>{note}</p>}
    </header>
  )
}
