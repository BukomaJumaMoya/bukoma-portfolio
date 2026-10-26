import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'motion/react'
import type { Project } from '@/data/projects'
import { tap } from '@/lib/haptics'
import { Schematic } from './Schematic'
import { StatusDot, cx } from './ui'

/**
 * Phones only: projects as a deck of cards you swipe through, with a progress
 * bar that tracks the card in view. Desktop shows the same projects as a list.
 */
export function ProjectDeck({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const t = track.current
    if (!t) return
    const card = t.firstElementChild as HTMLElement | null
    if (!card) return
    const i = Math.round(t.scrollLeft / (card.offsetWidth + 12))
    if (i !== active) {
      setActive(i)
      tap()
    }
  }

  const goTo = (i: number) => {
    const t = track.current
    const card = t?.children[i] as HTMLElement | undefined
    if (t && card) t.scrollTo({ left: card.offsetLeft - t.offsetLeft - parseFloat(getComputedStyle(t).paddingLeft), behavior: 'smooth' })
  }

  return (
    <div className="-mx-5 sm:-mx-8">
      <div
        ref={track}
        onScroll={onScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:scroll-px-8 sm:px-8"
      >
        {projects.map((p, i) => (
          <article
            key={p.slug}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${projects.length}: ${p.title}`}
            className={cx(
              'flex w-[84vw] max-w-[380px] shrink-0 snap-start flex-col rounded-[10px] border bg-surface p-6 transition-colors duration-500',
              i === active ? 'border-line-hi' : 'border-line',
            )}
          >
            <p className="flex items-center justify-between gap-3 text-[0.8rem] text-muted">
              <span className="inline-flex items-center gap-2 text-bone/80">
                <StatusDot live={p.live} /> {p.status}
              </span>
              <span className="tnum">{p.period}</span>
            </p>
            <h3 className="mt-4 text-[1.85rem] leading-[1] font-extrabold tracking-[-0.045em]">{p.title}</h3>
            <p className="mt-1.5 text-[0.85rem] text-tint">{p.org}</p>
            <p className="mt-4 line-clamp-4 text-[0.93rem] text-muted">{p.problem}</p>
            <Schematic stages={p.pipeline} vertical className="mt-7" />
            <div className="mt-auto pt-7">
              <p className="border-t border-line pt-4 text-[0.88rem]">
                <span className="text-muted">{p.outcome.label}: </span>
                {p.outcome.value}
              </p>
              <Link
                to={`/work/${p.slug}`}
                className="mt-5 flex items-center justify-center rounded-full bg-pine py-3 text-[0.9rem] font-medium text-on-pine transition-transform active:scale-[0.97]"
              >
                Read the case study
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Progress: one segment per card; the active one fills and slides. */}
      <div className="mt-5 flex gap-1.5 px-5 sm:px-8" role="tablist" aria-label="Choose a project">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={p.title}
            onClick={() => goTo(i)}
            className="relative h-11 flex-1 cursor-pointer"
          >
            <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line" />
            {i === active && (
              <m.span
                layoutId="deck-progress"
                className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-tint"
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              />
            )}
          </button>
        ))}
      </div>
      <p className="mt-1 px-5 text-[0.78rem] text-muted sm:px-8">Swipe to see the next system.</p>
    </div>
  )
}
