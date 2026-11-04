type ToolkitTone = 'paper' | 'yellow' | 'blue' | 'red'

const innovationStages: {
  stage: string
  outcome: string
  activities: string[]
  tone: ToolkitTone | 'ink'
}[] = [
  {
    stage: 'Inspiration',
    outcome: 'Vague intuitions',
    activities: ['Observation', 'Possibility mapping', 'Initial hypotheses'],
    tone: 'yellow',
  },
  {
    stage: 'Conceptualisation',
    outcome: 'Articulated concepts embedded in research',
    activities: ['Literature review', 'Concept framing', 'Research questions'],
    tone: 'red',
  },
  {
    stage: 'Systematisation',
    outcome: 'Systematised understanding and requirements',
    activities: [
      'Principles',
      'Requirements',
      'Data, model and evaluation design',
    ],
    tone: 'blue',
  },
  {
    stage: 'Implementation',
    outcome: 'Concrete implementations',
    activities: ['Prototyping', 'Integration', 'Testing and iteration'],
    tone: 'ink',
  },
]

const sequenceNumber = (index: number) => String(index + 1).padStart(2, '0')

export function PracticeOverview() {
  return (
    <div className="practice-panel">
      <p className="practice-panel__copy">
        <strong>
          I turn early ideas into working technological experiences.
        </strong>{' '}
        I take early-stage AI ideas from vague opportunity through research
        framing,
          data and model development, interactive prototyping, evaluation and
          communication. My work is deliberately practical: research questions
          are explored inside systems that people can use, test and respond to.
          Across natural language processing and multimodal AI, I have built
          systems for knowledge representation, document exploration, public
          discourse analysis, creative writing and text–audio modelling. This
          includes an AI writing assistant used by professional musicians and
          Funiki, which extends generative technology into dynamic
          light-and-sound experiences for physical spaces. I also lead
          collaborations, communicate complex research and create spaces where
          technical and human questions can meet. I co-founded an
          interdisciplinary AI and philosophy community, and contribute
          technical support and research to discussions about the potential
          role of AI in education.
      </p>
      <div className="practice-panel__journey">
        <p className="section-label" aria-hidden="true">
          Innovation journey
        </p>
        <ol className="practice-journey" aria-label="Innovation journey">
          {innovationStages.map((stage, index) => (
            <li
              className={`practice-journey__step tone--${stage.tone}`}
              key={stage.stage}
            >
              <div className="practice-journey__arrow">
                <span>{sequenceNumber(index)}</span>
                <span>{stage.stage}</span>
              </div>
              <p className="practice-journey__outcome">{stage.outcome}</p>
              <ul className="practice-journey__activities">
                {stage.activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
