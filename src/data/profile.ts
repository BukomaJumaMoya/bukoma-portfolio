// Content is edited in the CMS (/admin) and stored in src/content/profile.json.
import data from '@/content/profile.json'

type TitledText = { title: string; body: string }

export const profile = {
  name: data.name,
  shortName: data.shortName,
  title: data.title,
  role: data.role,
  company: data.company,
  location: data.location,
  timezone: data.timezone,
  utc: data.utc,
  email: data.email,
  phone: data.phone,
  phoneHref: `tel:${data.phone.replace(/[^\d+]/g, '')}`,
  siteUrl: data.siteUrl,
  /** Empty in the CMS hides every CV link. */
  cv: (data.cv || null) as string | null,
  /** Empty in the CMS hides the portrait everywhere. */
  portrait: (data.portrait || null) as string | null,
  availability: data.availability,
  socials: data.socials as { label: string; handle: string; href: string }[],
}

export const principles = data.principles as TitledText[]
export const facts = data.facts as { k: string; v: string }[]
export const organisations = data.organisations as string[]
