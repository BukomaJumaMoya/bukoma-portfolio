// The hero's three layers, edited in the CMS (/admin) and stored in src/content/hero.json.
// Order matches the plates from top to bottom: data enters at the devices and rests in the database.
import data from '@/content/hero.json'
import { getProject } from './projects'

export const heroLayers = (data.layers as { name: string; line: string; tools: string[]; project: string }[]).map((l) => ({
  ...l,
  project: { slug: l.project, title: getProject(l.project)?.title ?? '' },
}))
