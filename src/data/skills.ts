// Content is edited in the CMS (/admin) and stored in src/content/skills.json.
import data from '@/content/skills.json'

export type Skill = {
  name: string
  evidence: string
  years: number
  /** Project slugs this skill was used on. */
  projects?: string[]
}

export type Layer = {
  id: string
  label: string
  title: string
  blurb: string
  /** Depth on a 1–5 scale; drawn as ticks, never as a percentage. */
  depth: number
  skills: Skill[]
}

export const layers = data.layers as Layer[]
export const notMe = data.notMe as { title: string; body: string }[]
