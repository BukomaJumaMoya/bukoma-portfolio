import { useEffect, useState } from 'react'
import { Tabs } from './motion'
import { Container } from './ui'

/**
 * A sticky bar of the page's sections. It tracks the one being read and jumps
 * to any of them, so a long case study always shows where you are in it.
 */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0].id)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting)
        if (seen.length) setActive(seen[0].target.id)
      },
      // A section counts as "being read" when it crosses a band just above the middle of the screen.
      { rootMargin: '-38% 0px -55% 0px' },
    )
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [items])

  const jump = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setActive(id)
    // Land below the header and this bar rather than under them.
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' })
  }

  return (
    <div className="sticky top-[70px] z-30 bg-gradient-to-b from-ink via-ink to-transparent pt-2 pb-5 sm:top-[80px]">
      <Container>
        <Tabs label="Sections of this case study" options={items} value={active} onChange={jump} className="shadow-[0_8px_30px_-10px_rgba(0,0,0,.85)]" />
      </Container>
    </div>
  )
}
