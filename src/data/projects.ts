// Each project is one file in src/content/projects/, edited in the CMS (/admin).

export type ProjectKind = 'systems' | 'platform' | 'mobile' | 'tool'

export type Project = {
  slug: string
  /** Position on the Work page, lowest first. */
  order: number
  title: string
  org: string
  period: string
  role: string
  kind: ProjectKind
  status: string
  live?: boolean
  featured?: boolean
  /** One sentence for cards. */
  summary: string
  problem: string
  approach: string
  /** The concrete pieces of work, one per line. */
  highlights: string[]
  outcome: { label: string; value: string }
  stack: string[]
  /** Left-to-right flow of the system, rendered as a diagram. */
  pipeline: string[]
  note?: string
  links?: { label: string; url: string }[]
}

export const kindLabels: Record<ProjectKind, string> = {
  systems: 'Industrial & IoT',
  platform: 'Platforms',
  mobile: 'Mobile',
  tool: 'Tools',
}

const files = import.meta.glob<Project>('../content/projects/*.json', { eager: true, import: 'default' })

export const projects: Project[] = Object.values(files).sort((a, b) => a.order - b.order)

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
