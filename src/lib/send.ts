import { profile } from '@/data/profile'

const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined

export type SendResult = 'sent' | 'mailto'

/**
 * Posts to VITE_CONTACT_ENDPOINT (e.g. Formspree) when configured.
 * Without one, opens the visitor's mail app with the message pre-filled,
 * so the form is never a dead end.
 */
export async function send(subject: string, fields: Record<string, string>): Promise<SendResult> {
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: subject, ...fields }),
    })
    if (!res.ok) throw new Error(`Send failed (${res.status})`)
    return 'sent'
  }
  const body = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n\n')
  window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  return 'mailto'
}
