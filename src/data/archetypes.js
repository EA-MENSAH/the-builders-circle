// The Builder Assessment
// Members answer a short set of statements; we score six capabilities and
// derive a primary + secondary Builder Archetype, a contribution style, and
// growth areas — exactly as described in the Platform Requirements doc.

// The six capabilities every builder is scored on.
export const CAPABILITIES = [
  { key: 'vision', label: 'Vision', blurb: 'Seeing what could be.' },
  { key: 'execution', label: 'Execution', blurb: 'Turning ideas into reality.' },
  { key: 'influence', label: 'Influence', blurb: 'Communicating to move people.' },
  { key: 'connection', label: 'Connection', blurb: 'Building trust & relationships.' },
  { key: 'stewardship', label: 'Stewardship', blurb: 'Character & accountability.' },
  { key: 'contribution', label: 'Contribution', blurb: 'Lifting others as you climb.' },
]

// Weight vectors over [vision, execution, influence, connection, stewardship, contribution]
export const ARCHETYPES = {
  visionary: {
    key: 'visionary',
    name: 'The Visionary',
    pillar: 'Build',
    glyph: '✦',
    tagline: 'Sees what could be — and names it first.',
    description:
      'You are energised by possibility. You spot openings others miss and you give people a picture of the future worth building toward. Your gift is direction.',
    contributionStyle: 'Frames the vision and sets the direction.',
    weights: [3, 1, 2, 1, 1, 1],
  },
  architect: {
    key: 'architect',
    name: 'The Architect',
    pillar: 'Build',
    glyph: '◈',
    tagline: 'Designs the systems that make it stand.',
    description:
      'You turn ambition into structure. Plans, processes, foundations — you build the scaffolding that lets a vision actually hold weight. Your gift is execution.',
    contributionStyle: 'Builds the systems and gets it done.',
    weights: [2, 3, 1, 1, 2, 1],
  },
  catalyst: {
    key: 'catalyst',
    name: 'The Catalyst',
    pillar: 'Build',
    glyph: '⟡',
    tagline: 'Creates momentum where there was none.',
    description:
      'You move things. You pitch, you rally, you sell the idea and get people off the fence. When energy stalls, you are the spark. Your gift is influence.',
    contributionStyle: 'Drives momentum and rallies people to act.',
    weights: [1, 2, 3, 1, 1, 1],
  },
  connector: {
    key: 'connector',
    name: 'The Connector',
    pillar: 'Belong',
    glyph: '❖',
    tagline: 'The bridge between people and possibility.',
    description:
      'You build trust effortlessly and you remember who should meet whom. You are the relational tissue of the Circle — value flows through the connections you make. Your gift is connection.',
    contributionStyle: 'Builds relationships and makes introductions.',
    weights: [1, 1, 2, 3, 1, 2],
  },
  steward: {
    key: 'steward',
    name: 'The Steward',
    pillar: 'Belong',
    glyph: '⬡',
    tagline: 'Guards the trust the Circle is built on.',
    description:
      'You lead with character. You keep commitments, protect confidentiality, and hold the standard when it would be easier not to. People trust you with what matters. Your gift is stewardship.',
    contributionStyle: 'Protects trust and holds the standard.',
    weights: [1, 2, 1, 1, 3, 2],
  },
  cultivator: {
    key: 'cultivator',
    name: 'The Cultivator',
    pillar: 'Bridge',
    glyph: '✧',
    tagline: 'Grows people, then gets out of the way.',
    description:
      'You find real joy in another person’s growth. You mentor, you sponsor, you open doors and share what you have. You lift as you climb. Your gift is contribution.',
    contributionStyle: 'Mentors others and creates opportunities.',
    weights: [1, 1, 1, 2, 2, 3],
  },
}

export const ARCHETYPE_LIST = Object.values(ARCHETYPES)

// 12 statements, two per capability, answered on a 1–5 Likert scale.
export const ASSESSMENT_QUESTIONS = [
  { id: 'q1', cap: 'vision', text: 'I’m energised by imagining what something could become, even before it exists.' },
  { id: 'q2', cap: 'connection', text: 'I naturally build trust and form genuine relationships with new people.' },
  { id: 'q3', cap: 'execution', text: 'I turn ideas into concrete plans and follow them through to completion.' },
  { id: 'q4', cap: 'contribution', text: 'I find real fulfilment in helping other people grow and succeed.' },
  { id: 'q5', cap: 'influence', text: 'I can explain an idea clearly enough to get others to act on it.' },
  { id: 'q6', cap: 'stewardship', text: 'I hold myself accountable to my commitments, even when no one is watching.' },
  { id: 'q7', cap: 'vision', text: 'I often spot opportunities or possibilities that others tend to miss.' },
  { id: 'q8', cap: 'execution', text: 'I’m the person who makes sure things actually get done, on time.' },
  { id: 'q9', cap: 'influence', text: 'I enjoy persuading, pitching, or rallying people around a goal.' },
  { id: 'q10', cap: 'connection', text: 'People often come to me to be introduced or connected to others.' },
  { id: 'q11', cap: 'stewardship', text: 'I care deeply about integrity, character, and doing things the right way.' },
  { id: 'q12', cap: 'contribution', text: 'I regularly share opportunities, resources, or time with others.' },
]

export const LIKERT = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
]

const CAP_KEYS = CAPABILITIES.map((c) => c.key)

// Turn a map of {questionId: 1..5} into a full Builder Profile.
export function scoreAssessment(answers) {
  // Raw capability totals (max 10 each → 2 questions × 5).
  const raw = Object.fromEntries(CAP_KEYS.map((k) => [k, 0]))
  for (const q of ASSESSMENT_QUESTIONS) {
    raw[q.cap] += answers[q.id] || 0
  }
  // Normalise each capability to 0–100.
  const scores = Object.fromEntries(
    CAP_KEYS.map((k) => [k, Math.round((raw[k] / 10) * 100)])
  )

  // Rank archetypes by dot-product of their weights with capability scores.
  const ranked = ARCHETYPE_LIST.map((a) => {
    const fit = a.weights.reduce((sum, w, i) => sum + w * scores[CAP_KEYS[i]], 0)
    return { key: a.key, fit }
  }).sort((a, b) => b.fit - a.fit)

  // Growth areas = the two lowest-scoring capabilities.
  const growth = [...CAP_KEYS]
    .sort((a, b) => scores[a] - scores[b])
    .slice(0, 2)

  return {
    scores,
    primary: ranked[0].key,
    secondary: ranked[1].key,
    contributionStyle: ARCHETYPES[ranked[0].key].contributionStyle,
    growthAreas: growth,
    completedAt: new Date().toISOString(),
  }
}

export function capLabel(key) {
  return CAPABILITIES.find((c) => c.key === key)?.label || key
}
