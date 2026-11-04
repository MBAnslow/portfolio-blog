import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { AiPhiFeature } from './components/AiPhiFeature'
import { Arrow } from './components/Arrow'
import { BelongingFeature } from './components/BelongingFeature'
import { DebugBlendMenu } from './components/DebugBlendMenu'
import { PracticeOverview } from './components/Capabilities'
import { EducationFeature } from './components/EducationFeature'
import { FunikiFeature } from './components/FunikiFeature'
import { PoiesisFeature } from './components/PoiesisFeature'
import { ProjectCard } from './components/ProjectCard'
import { Reveal } from './components/Reveal'
import { ScrollProgressRail } from './components/ScrollProgressRail'
import { SectionHeading } from './components/SectionHeading'
import { TextureDebugPanel } from './components/TextureDebugPanel'
import { HeroTitleDebugPanel } from './components/HeroTitleDebugPanel'
import { heroSkylineRevision } from './heroSkylineRevision'
import {
  essays,
  otherWork,
  profileLinks,
  projects,
  publications,
} from './data/portfolio'
import {
  defaultPanelColourConfigs,
  type PanelColourConfig,
} from './data/panelColours'
import { basePath } from './utils/basePath'

const storySections = [
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Other work', id: 'other-work' },
  { label: 'Research', id: 'research' },
  { label: 'Writing', id: 'writing' },
]

type ProjectAccordionStyle = CSSProperties & {
  '--project-context-transition': string
  '--expanded-project-panel-color': string
  '--expanded-project-title-color': string
  '--expanded-project-title-text-color': string
  '--expanded-project-details-color': string
}

const navigation = storySections.filter(({ id }) =>
  ['about', 'projects', 'research'].includes(id),
)

const blogPath = `${basePath}blog/`
const projectAnchor = (title: string) =>
  title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function App() {
  const [activeSection, setActiveSection] = useState('about')
  const [panelColourConfigs, setPanelColourConfigs] = useState<
    Record<string, PanelColourConfig>
  >(
    () => defaultPanelColourConfigs,
  )
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    () => new Set(),
  )
  const [transitioningProject, setTransitioningProject] = useState<
    string | null
  >(null)
  const [revealingProject, setRevealingProject] = useState<string | null>(null)
  const revealTimerRef = useRef<number | null>(null)
  const [showBlendDebug, setShowBlendDebug] = useState(false)
  const [showTextureDebug, setShowTextureDebug] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setShowBlendDebug(params.has('debug'))
    setShowTextureDebug(params.has('texture-debug'))
  }, [])

  useEffect(() => {
    const stage = document.querySelector<HTMLElement>('.masthead__stage')
    if (!stage) return

    const updateAnchor = () => {
      const stageTop = stage.getBoundingClientRect().top + window.scrollY
      stage.style.setProperty(
        '--hero-anchor-y',
        `${window.innerHeight / 2 - stageTop}px`,
      )
    }

    updateAnchor()
    const resizeObserver = new ResizeObserver(updateAnchor)
    resizeObserver.observe(stage)
    window.addEventListener('resize', updateAnchor)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateAnchor)
    }
  }, [])

  useEffect(() => {
    const sections = storySections
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.25, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Punches the page's dry-brush specks out around the name so they never
  // land on its outline; see `body:not(.blog-theme)::after`.
  useEffect(() => {
    const title = document.getElementById('hero-title')
    if (!title) return

    const bleed = 16
    const updateHole = () => {
      const bodyBox = document.body.getBoundingClientRect()
      const lines = Array.from(title.children, (line) =>
        line.getBoundingClientRect(),
      )
      const left = Math.min(...lines.map((line) => line.left)) - bleed
      const top = Math.min(...lines.map((line) => line.top)) - bleed
      const right = Math.max(...lines.map((line) => line.right)) + bleed
      const bottom = Math.max(...lines.map((line) => line.bottom)) + bleed
      const style = document.body.style

      style.setProperty('--title-hole-x', `${left - bodyBox.left}px`)
      style.setProperty('--title-hole-y', `${top - bodyBox.top}px`)
      style.setProperty('--title-hole-w', `${right - left}px`)
      style.setProperty('--title-hole-h', `${bottom - top}px`)
    }
    const observer = new ResizeObserver(updateHole)

    observer.observe(title)
    observer.observe(document.body)
    document.fonts.ready.then(updateHole)

    return () => observer.disconnect()
  }, [])

  useEffect(
    () => () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current)
      }
    },
    [],
  )

  const toggleProject = (projectNumber: string) => {
    const isCollapsing = expandedProjects.has(projectNumber)

    const updateExpandedProjects = () => {
      setExpandedProjects((current) => {
        const next = new Set(current)

        if (next.has(projectNumber)) {
          next.delete(projectNumber)
        } else {
          next.add(projectNumber)
        }

        return next
      })
    }

    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      updateExpandedProjects()
      return
    }

    flushSync(() => {
      setTransitioningProject(projectNumber)
      setRevealingProject(null)
    })

    document.documentElement.dataset.projectTransition = isCollapsing
      ? 'collapse'
      : 'expand'
    document.documentElement.style.setProperty(
      '--active-project-accent',
      panelColourConfigs[projectNumber]?.detailsColor ?? '#566595',
    )

    const transition = document.startViewTransition(() => {
      flushSync(updateExpandedProjects)
    })

    const finishTransition = () => {
      setTransitioningProject(null)
      delete document.documentElement.dataset.projectTransition
      document.documentElement.style.removeProperty('--active-project-accent')

      if (!isCollapsing) {
        setRevealingProject(projectNumber)

        if (revealTimerRef.current !== null) {
          window.clearTimeout(revealTimerRef.current)
        }

        revealTimerRef.current = window.setTimeout(() => {
          setRevealingProject((current) =>
            current === projectNumber ? null : current,
          )
          revealTimerRef.current = null
        }, 1400)
      }
    }

    void transition.finished.then(finishTransition, finishTransition)
  }

  const updatePanelColourConfig = (
    panelNumber: string,
    config: PanelColourConfig,
  ) => {
    setPanelColourConfigs((current) => ({
      ...current,
      [panelNumber]: config,
    }))
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {showBlendDebug && (
          <DebugBlendMenu
            configs={panelColourConfigs}
            onConfigChange={updatePanelColourConfig}
          />
        )}
      {showTextureDebug && <TextureDebugPanel />}
      <HeroTitleDebugPanel />

      <header className="site-header">
        <div className="site-header__inner">
          <a className="monogram" href="#top" aria-label="Michael Anslow, home">
            <span>M</span>
            <span>A</span>
          </a>
          <nav aria-label="Primary navigation">
            <ul>
              {navigation.map(({ label, id }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={
                      activeSection === id ? 'location' : undefined
                    }
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="mobile-blog-nav">
                <a href={blogPath}>Blog</a>
              </li>
            </ul>
          </nav>
          <a className="header-link" href={blogPath}>
            <span>Explore the</span>
            <strong>Blog</strong>
            <Arrow />
          </a>
        </div>
      </header>

      <ScrollProgressRail
        sections={storySections}
        activeSection={activeSection}
      />

      <main id="main">
        <section className="masthead" id="top" aria-labelledby="hero-title">
          <div className="masthead__frame">
            <div className="masthead__bar">
              <p className="masthead__role">Research Engineer / Innovator</p>
              <ul className="masthead__practice" aria-label="Core practice">
                <li>AI</li>
                <li>Interactive systems</li>
                <li>Creative technology</li>
                <li>Research</li>
              </ul>
              <span className="masthead__place">Paris / France</span>
            </div>

            <div className="masthead__stage">
              <h1
                id="hero-title"
                style={
                  {
                    '--hero-halftone': `url(${basePath}media/halftone-navy.webp)`,
                    '--hero-watercolour': `url(${basePath}media/hero-texture-watercolour.png)`,
                    '--hero-splatter': `url(${basePath}media/hero-texture-splatter.png)`,
                    '--hero-paint-burst': `url(${basePath}media/hero-texture-paint-splatter-burst.png)`,
                  } as CSSProperties
                }
              >
                <span className="masthead__given-name">Michael</span>
                <span className="masthead__surname" aria-label="Anslow">
                  {Array.from('Anslow').map((character, index) => (
                    <span
                      className="hero-title__character"
                      aria-hidden="true"
                      key={`${character}-${index}`}
                    >
                      <span className="hero-title__base">{character}</span>
                      {['blue', 'black', 'grey', 'white'].map((layer) => (
                        <span
                          className={`hero-title__texture hero-title__texture--${layer}`}
                          key={layer}
                        >
                          {character}
                        </span>
                      ))}
                      </span>
                  ))}
                </span>
              </h1>

              <div className="masthead__skyline" aria-hidden="true">
                <svg
                  className="masthead__defs"
                  aria-hidden="true"
                  focusable="false"
                >
                  <defs>
                    <filter
                      id="hero-title-grain"
                      x="0%"
                      y="0%"
                      width="100%"
                      height="100%"
                      colorInterpolationFilters="sRGB"
                    >
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.004 0.006"
                        numOctaves="2"
                        seed="41"
                        result="coarseNoise"
                      />
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.11"
                        numOctaves="4"
                        seed="78"
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
                        <feFuncR type="linear" slope="1.25" intercept="-0.12" />
                        <feFuncG type="linear" slope="1.25" intercept="-0.12" />
                        <feFuncB type="linear" slope="1.25" intercept="-0.12" />
                        <feFuncA type="linear" slope="0.035" />
                      </feComponentTransfer>
                      <feComposite
                        in="grain"
                        in2="SourceGraphic"
                        operator="in"
                        result="clippedGrain"
                      />
                      <feBlend
                        in="SourceGraphic"
                        in2="clippedGrain"
                        mode="soft-light"
                        result="textured"
                      />
                      <feComposite
                        in="textured"
                        in2="SourceGraphic"
                        operator="in"
                      />
                    </filter>
                  </defs>
                </svg>
                <img
                  src={`${basePath}media/hero-watercolour-skyline.png?v=${heroSkylineRevision}`}
                  alt=""
                  width="2172"
                  height="724"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className="page-section statement-section"
          id="intro"
          aria-label="Introduction"
        >
          <Reveal>
            <p className="statement-section__copy">
              I build new <strong>technological experiences,</strong> embedded
              in research and informed by a wider{' '}
              <strong>societal vision.</strong>
            </p>
          </Reveal>
        </section>

        <section className="page-section about-section" id="about">
          <SectionHeading
            index="01"
            title="Between systems and stories"
            note="A practice grounded in engineering, expanded through research and philosophy."
          />
          <Reveal>
            <PracticeOverview />
          </Reveal>
        </section>

        <section className="page-section work-section" id="projects">
          <SectionHeading
            index="02"
            title="Selected work"
            note="Projects that move between artificial intelligence, creative practice and collective inquiry."
          />
          <div className="project-list">
            {projects.map((project, index) => (
              <Reveal
                variant={index % 2 === 0 ? 'left' : 'right'}
                key={project.title}
              >
                <div
                  className={`project-accordion${project.number === '05' ? ' side-interest-accordion' : ''}${transitioningProject === project.number ? ' project-accordion--transitioning' : ''}${revealingProject === project.number ? ' project-accordion--revealing' : ''}`}
                  id={`project-${projectAnchor(project.title)}`}
                  style={
                    {
                      '--project-context-transition':
                        transitioningProject === project.number
                          ? `project-context-${project.number}`
                          : 'none',
                      '--expanded-project-panel-color':
                        panelColourConfigs[project.number]?.panelColor ??
                        '#ffffff',
                      '--expanded-project-title-color':
                        panelColourConfigs[project.number]?.accentColor ??
                        '#333333',
                      '--expanded-project-title-text-color':
                        '#ffffff',
                      '--expanded-project-details-color':
                        panelColourConfigs[project.number]?.detailsColor ??
                        '#566595',
                    } as ProjectAccordionStyle
                  }
                >
                  <ProjectCard
                    project={project}
                    colourConfig={panelColourConfigs[project.number]}
                    expanded={expandedProjects.has(project.number)}
                    controls={`project-details-${project.number}`}
                    onToggle={() => toggleProject(project.number)}
                  />
                  <div
                    className="project-expansion"
                    id={`project-details-${project.number}`}
                    hidden={!expandedProjects.has(project.number)}
                    aria-hidden={!expandedProjects.has(project.number)}
                    inert={
                      expandedProjects.has(project.number) ? undefined : true
                    }
                  >
                    {project.number === '01' && (
                      <FunikiFeature
                        onCollapse={() => toggleProject(project.number)}
                      />
                    )}
                    {project.number === '02' && (
                      <BelongingFeature
                        onCollapse={() => toggleProject(project.number)}
                      />
                    )}
                    {project.number === '03' && (
                      <AiPhiFeature
                        onCollapse={() => toggleProject(project.number)}
                      />
                    )}
                    {project.number === '04' && (
                      <PoiesisFeature
                        onCollapse={() => toggleProject(project.number)}
                      />
                    )}
                    {project.number === '05' && (
                      <EducationFeature
                        onCollapse={() => toggleProject(project.number)}
                      />
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          className="page-section other-work-section"
          id="other-work"
        >
          <SectionHeading
            index="03"
            title="Other work"
            note="Previous projects, collaborations, research threads, wider practice."
          />
          <Reveal>
            <div className="other-work-list">
              {otherWork.map((item, index) => (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  key={item.title}
                >
                  <span className="other-work-list__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="other-work-list__title">
                    <span>{item.eyebrow}</span>
                    <h3>{item.title}</h3>
                    <strong>Role: {item.role}</strong>
                  </div>
                  <div className="other-work-list__details">
                    <p>{item.description}</p>
                    <dl className="other-work-list__skills">
                      <div>
                        <dt>Technical practice</dt>
                        <dd>
                          {item.skills.technical.map((skill) => (
                            <span key={skill}>{skill}</span>
                          ))}
                        </dd>
                      </div>
                      <div>
                        <dt>Ways of working</dt>
                        <dd>
                          {item.skills.soft.map((skill) => (
                            <span key={skill}>{skill}</span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Arrow />
                </a>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="page-section research-section" id="research">
          <SectionHeading
            index="04"
            title="Research"
            note="Selected publications across music AI, natural language processing, knowledge representation and data analysis."
          />
          <Reveal>
            <div className="research-intro">
              <p>
                The through-line is an interest in how complex representations
                become useful, navigable experiences.
              </p>
              <a
                className="text-link"
                href="https://scholar.google.com/citations?user=VjnHrW8AAAAJ&hl=en"
                target="_blank"
                rel="noreferrer"
              >
                Full profile on Scholar
                <Arrow />
              </a>
            </div>
            <ol className="publication-list">
              {publications.map((publication, index) => (
                <li key={publication.title}>
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="publication-list__number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="publication-list__title">
                      {publication.title}
                      <small>{publication.authors}</small>
                    </span>
                    <span className="publication-list__meta">
                      {publication.venue}
                      <strong>{publication.year}</strong>
                    </span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <section className="writing-section" id="writing">
          <div className="writing-section__inner">
            <div className="blog-gateway">
              <div className="blog-gateway__meta">
                <span>Portfolio ends / Writing begins</span>
                <span>An outlet for exploring and crystallising ideas</span>
              </div>
              <div className="blog-gateway__body">
                <div>
                  <span className="blog-gateway__eyebrow">Beyond the work</span>
                  <a href={blogPath} aria-label="Enter the blog">
                    <h2>
                      Enter the
                      <strong>blog</strong>
                    </h2>
                  </a>
                </div>
                <div className="blog-gateway__copy">
                  <p>
                    A place to think in public through essays and creative
                    outputs. Some pieces become speculative targets for
                    research—making ideas concrete enough to question, test and
                    develop.
                  </p>
                  <a href={blogPath}>
                    Open the writing site
                    <Arrow />
                  </a>
                </div>
              </div>
            </div>
            <div className="essay-grid__heading">
              <span>Selected writing</span>
              <span>{String(essays.length).padStart(2, '0')} essays</span>
            </div>
            <Reveal>
              <div className="essay-grid">
                {essays.map((essay, index) => (
                  <a
                    className={index === 0 ? 'essay-card essay-card--featured' : 'essay-card'}
                    href={
                      essay.localSlug
                        ? `${blogPath}${essay.localSlug}/`
                        : essay.url
                    }
                    target={essay.localSlug ? undefined : '_blank'}
                    rel={essay.localSlug ? undefined : 'noreferrer'}
                    key={`${essay.title}-${essay.subtitle}`}
                  >
                    <span className="essay-card__date">{essay.date}</span>
                    <div>
                      <h3>{essay.title}</h3>
                      <p>{essay.subtitle}</p>
                    </div>
                    <Arrow />
                  </a>
                ))}
              </div>
            </Reveal>
            <a
              className="writing-profile-link"
              href={blogPath}
            >
              Browse the complete blog
              <Arrow />
            </a>
          </div>
        </section>

        <section className="connect-section" id="connect">
          <div className="connect-section__kicker">
            <span>Have an unusual idea?</span>
            <span>Let&apos;s make it tangible.</span>
          </div>
          <div className="connect-section__compact">
            <h2>Let&apos;s connect.</h2>
            <div className="connect-section__footer">
              <p>
                Open to conversations about creative AI, research prototypes,
                philosophy and emerging forms of experience.
              </p>
              <ul>
                {profileLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                      <Arrow />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>Michael Anslow © {new Date().getFullYear()}</span>
        <a href="#top">Back to top ↑</a>
        <span>Built with curiosity in Paris</span>
      </footer>
    </>
  )
}

export default App
