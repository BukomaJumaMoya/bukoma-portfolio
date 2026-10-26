// Leadership and About content, edited in the CMS (/admin) and stored in
// src/content/leadership.json and src/content/about.json.
import leadership from '@/content/leadership.json'
import about from '@/content/about.json'

type TitledText = { title: string; body: string }

export const leadershipTimeline = leadership.timeline as { when: string; title: string; step: string; body: string; upcoming?: boolean }[]
export const lessons = leadership.lessons as TitledText[]
export const serviceBeyond = leadership.serviceBeyond as TitledText[]
export const talks = leadership.talks as TitledText[]
export const formats = leadership.formats as TitledText[]

export const engagements = about.engagements as (TitledText & { points: string[] })[]
export const process = about.process as TitledText[]
