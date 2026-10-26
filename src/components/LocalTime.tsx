import { useEffect, useState } from 'react'
import { profile } from '@/data/profile'

const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: profile.timezone })

/** Live clock in Kampala, so a remote employer can see at a glance when I'm online. */
export function LocalTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return (
    <time dateTime={now.toISOString()}>
      {fmt.format(now)} {profile.utc}
    </time>
  )
}
