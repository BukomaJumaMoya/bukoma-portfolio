export type NavItem = { to: string; label: string; hint: string }

/**
 * Four destinations, in the order a hiring manager reads them.
 * Skills live inside Experience, speaking inside Leadership, services inside About.
 */
export const nav: NavItem[] = [
  { to: '/work', label: 'Work', hint: 'Eight systems, problem first' },
  { to: '/experience', label: 'Experience', hint: 'Roles, timeline and stack' },
  { to: '/leadership', label: 'Leadership', hint: 'Rotaract, district and speaking' },
  { to: '/about', label: 'About', hint: 'Who I am and how to work with me' },
]

export const contactItem: NavItem = { to: '/contact', label: 'Contact', hint: 'Roles, builds, invitations' }
