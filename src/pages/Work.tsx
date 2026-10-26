import { useState } from 'react'
import { pages } from '@/data/pages'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'motion/react'
import { kindLabels, projects, type Project, type ProjectKind } from '@/data/projects'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { Schematic } from '@/components/Schematic'
import { Tabs, ease } from '@/components/motion'
import { Container, StatusDot, cx } from '@/components/ui'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { tap } from '@/lib/haptics'

type F = ProjectKind | 'all'

/** Phone row: tap to open the project in place, with its diagram and a way through to the case study. */
function MobileRow({ project: p, open, onToggle }: { project: Project; open: boolean; onToggle: () => void }) {
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          tap()
          onToggle()
        }}
        className="flex w-full cursor-pointer items-start gap-4 py-5 text-left transition-transform active:scale-[0.99]"
      >
        <span className="min-w-0 flex-1">
          <span
            className={cx(
              'block font-display text-[1.6rem] leading-[1.05] font-extrabold tracking-[-0.045em] transition-colors duration-300',
              open ? 'text-tint' : 'text-bone',
            )}
          >
            {p.title}
          </span>
          <span className="mt-1.5 block text-[0.86rem] text-muted">
            {p.org}, <span className="tnum">{p.period}</span>
          </span>
        </span>
        <span
          aria-hidden="true"
          className={cx(
            'relative mt-1.5 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-brand',
            open ? 'rotate-45 border-tint text-tint' : 'border-line-hi text-muted',
          )}
        >
          <span className="absolute h-px w-2.5 bg-current" />
          <span className="absolute h-2.5 w-px bg-current" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="overflow-hidden"
          >
            <div className="pb-7">
              <p className="inline-flex items-center gap-2 text-[0.82rem] text-bone/80">
                <StatusDot live={p.live} /> {p.status}
              </p>
              <p className="mt-3 text-[0.98rem] text-bone/85">{p.summary}</p>
              <div className="mt-6 rounded-[10px] border border-line bg-surface p-5">
                <Schematic stages={p.pipeline} vertical />
              </div>
              <p className="mt-5 text-[0.9rem]">
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
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Work() {
  const [filter, setFilter] = useState<F>('all')
  const shown = filter === 'all' ? projects : projects.filter((p) => p.kind === filter)
  const [hover, setHover] = useState(projects[0].slug)
  const preview = shown.find((p) => p.slug === hover) ?? shown[0]
  const desktop = useIsDesktop()
  // Phones have no hover, so one project at a time opens in place instead. The first starts open.
  const [openSlug, setOpenSlug] = useState<string | null>(projects[0].slug)

  const options = [
    { id: 'all' as F, label: 'All', count: projects.length },
    ...(Object.keys(kindLabels) as ProjectKind[]).map((k) => ({ id: k as F, label: kindLabels[k], count: projects.filter((p) => p.kind === k).length })),
  ]

  return (
    <>
      <Seo title="Work" description="Eight systems across industrial IoT, marketplaces, fintech and member organisations, each described problem first." />
      <PageHero title={pages.work.title} sub={pages.work.sub} />

      <Container>
        <div className="mb-8">
          <Tabs label="Filter projects" options={options} value={filter} onChange={setFilter} />
        </div>

        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <m.ol layout className="border-t border-line md:col-span-7">
            <AnimatePresence initial={false} mode="popLayout">
              {shown.map((p) => (
                <m.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="border-b border-line"
                >
                  {desktop ? (
                    <Link
                      to={`/work/${p.slug}`}
                      onMouseEnter={() => setHover(p.slug)}
                      onFocus={() => setHover(p.slug)}
                      className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1.5 py-6"
                    >
                      <span
                        className={cx(
                          'font-display text-[clamp(1.5rem,3.2vw,2.15rem)] leading-[1.05] font-extrabold tracking-[-0.045em] transition-all duration-500 ease-brand',
                          preview?.slug === p.slug ? 'translate-x-2 text-tint' : 'text-bone/90',
                        )}
                      >
                        {p.title}
                      </span>
                      <span className="tnum text-[0.82rem] text-muted">{p.period}</span>
                      <span className="col-span-2 text-[0.88rem] text-muted transition-transform duration-500 ease-brand group-hover:translate-x-2">
                        {p.org}
                      </span>
                    </Link>
                  ) : (
                    <MobileRow project={p} open={openSlug === p.slug} onToggle={() => setOpenSlug((s) => (s === p.slug ? null : p.slug))} />
                  )}
                </m.li>
              ))}
            </AnimatePresence>
          </m.ol>

          {/* Desktop preview of the hovered project */}
          <aside className="hidden md:col-span-5 md:block" aria-hidden="true">
            <div className="sticky top-28 rounded-[10px] border border-line bg-surface p-7">
              <AnimatePresence mode="wait">
                {preview && (
                  <m.div
                    key={preview.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <p className="inline-flex items-center gap-2 text-[0.82rem] text-bone/80">
                      <StatusDot live={preview.live} /> {preview.status}
                    </p>
                    <p className="mt-4 font-display text-[1.25rem] leading-snug tracking-[-0.025em]">{preview.summary}</p>
                    <Schematic stages={preview.pipeline} vertical className="mt-8" />
                    <p className="mt-8 border-t border-line pt-5 text-[0.9rem]">
                      <span className="text-muted">{preview.outcome.label}: </span>
                      {preview.outcome.value}
                    </p>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}
