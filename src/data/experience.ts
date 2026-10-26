// Content is edited in the CMS (/admin) and stored in src/content/experience.json.
import data from '@/content/experience.json'

export type EntryKind = 'work' | 'service' | 'milestone'

export type Entry = {
  year: string
  when: string
  kind: EntryKind
  title: string
  org?: string
  body: string
  tag: string
  project?: string
}

export const kindFilters: { id: EntryKind | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'work', label: 'Engineering' },
  { id: 'service', label: 'Service & leadership' },
  { id: 'milestone', label: 'Education & milestones' },
]

/** The professional roles, for the compact list on the home page. */
export const roles = data.roles as { when: string; title: string; org: string; note: string; current?: boolean }[]

export const timeline = data.timeline as Entry[]
