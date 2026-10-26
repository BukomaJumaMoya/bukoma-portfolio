import { Fragment, useRef, useState } from 'react'
import { pages } from '@/data/pages'
import { m, useScroll, useSpring } from 'motion/react'
import { useSearchParams } from 'react-router-dom'
import { kindFilters, timeline, type EntryKind } from '@/data/experience'
import { layers, notMe } from '@/data/skills'
import { getProject } from '@/data/projects'
import { facts, profile } from '@/data/profile'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { AccordionItem, Swap, Tabs } from '@/components/motion'
import { Download } from '@/components/icons'
import { Button, Container, Points, Reveal, Tag, TextLink, TitleBlock, cx } from '@/components/ui'

type View = 'career' | 'timeline' | 'stack'
const views: { id: View; label: string }[] = [
  { id: 'career', label: 'Career' },
  { id: 'timeline', label: 'Full timeline' },
  { id: 'stack', label: 'Stack' },
]

export default function Experience() {
  const [params, setParams] = useSearchParams()
  const view = (views.find((v) => v.id === params.get('tab'))?.id ?? 'career') as View
  const setView = (v: View) => setParams(v === 'career' ? {} : { tab: v }, { replace: true, preventScrollReset: true })

  return (
    <>
      <Seo
        title="Experience"
        description="Engineering roles at Auri Energy, Whave Solutions, Shamos Tech and KCCA; the full timeline; and the stack, with evidence for each skill."
      />
      <PageHero title={pages.experience.title} sub={pages.experience.sub}>
        <TitleBlock rows={facts.slice(0, 4)} />
        {profile.cv && (
          <Button href={profile.cv} download variant="solid" icon={<Download />} className="mt-8">
            Download CV
          </Button>
        )}
      </PageHero>

      <Container>
        <div className="sticky top-[70px] z-20 -mx-1 mb-10 bg-gradient-to-b from-ink via-ink to-transparent px-1 pt-2 pb-5 sm:top-[80px]">
          <Tabs label="Experience view" options={views} value={view} onChange={setView} className="shadow-[0_8px_30px_-10px_rgba(0,0,0,.8)]" />
        </div>
        <Swap k={view}>
          {view === 'career' && <Career />}
          {view === 'timeline' && <Timeline />}
          {view === 'stack' && <Stack />}
        </Swap>
      </Container>
    </>
  )
}

/* ------------------------------------------------------------------ */

function Career() {
  const jobs = timeline.filter((e) => e.kind === 'work' && e.org)
  // A line that draws down the left of the roles as you scroll through them.
  const list = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 75%', 'end 55%'] })
  const drawn = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-8">
      <p className="text-muted md:col-span-4">Four roles across energy, water, fintech and city government. Open any of them for the detail.</p>
      <div className="md:col-span-8">
        <div ref={list} className="relative border-t border-line pl-7">
          <span aria-hidden="true" className="absolute top-8 bottom-8 left-[5px] w-px bg-line" />
          <m.span aria-hidden="true" className="absolute top-8 bottom-8 left-[5px] w-px origin-top bg-tint" style={{ scaleY: drawn }} />
          {jobs.map((e, i) => (
            <Reveal key={e.title + e.org} className="relative">
              {/* Marker: lights up once the role has scrolled into view. */}
              <span
                aria-hidden="true"
                className="absolute top-[1.95rem] -left-7 size-[11px] rounded-full border border-line-hi bg-ink transition-colors delay-300 duration-500 in-view:border-tint in-view:bg-tint"
              />
              <AccordionItem
                defaultOpen={i === 0}
                head={
                  <div className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-6">
                    <div>
                      <h3 className="text-[clamp(1.3rem,2.6vw,1.75rem)] leading-tight font-extrabold tracking-[-0.04em]">{e.org}</h3>
                      <p className="mt-1 text-[0.95rem] text-muted">{e.title}</p>
                    </div>
                    <span className="tnum text-[0.85rem] text-muted sm:pt-2">{e.when}</span>
                  </div>
                }
              >
                <p className="max-w-[62ch] text-bone/85">{e.body}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Tag>{e.tag}</Tag>
                  {e.project && <TextLink to={`/work/${e.project}`}>Case study: {getProject(e.project)?.title}</TextLink>}
                </div>
              </AccordionItem>
            </Reveal>
          ))}
        </div>
        <p className="py-6 text-[0.95rem] text-muted">
          Education: BSc Information Systems and Technology, Makerere University, 2024. Before that, King&apos;s College Budo. References from Auri Energy, KCCA
          and Shamos Tech are available on request.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Timeline() {
  const [kind, setKind] = useState<EntryKind | 'all'>('all')
  const shown = timeline.filter((e) => kind === 'all' || e.kind === kind)
  const years = [...new Set(shown.map((e) => e.year))]
  const options = kindFilters.map((f) => ({ ...f, count: f.id === 'all' ? timeline.length : timeline.filter((e) => e.kind === f.id).length }))

  return (
    <div>
      <Tabs label="Filter the timeline" options={options} value={kind} onChange={setKind} className="mb-10" />
      <div aria-live="polite">
        {years.map((y) => (
          <div key={y} className="grid gap-2 border-t border-line pt-6 md:grid-cols-12 md:gap-8">
            <h2 className="tnum font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-none font-extrabold tracking-[-0.05em] text-line-hi md:col-span-4">{y}</h2>
            <div className="md:col-span-8">
              {shown
                .filter((e) => e.year === y)
                .map((e) => (
                  <AccordionItem
                    key={e.title + e.when}
                    head={
                      <div>
                        <p className="text-[0.82rem] text-muted">
                          <span className="tnum">{e.when}</span>
                          {e.org && <span className="ml-3">{e.org}</span>}
                        </p>
                        <h3 className="mt-1 text-[1.12rem] leading-snug font-semibold tracking-[-0.02em]">{e.title}</h3>
                      </div>
                    }
                  >
                    <p className="max-w-[62ch] text-[0.95rem] text-muted">{e.body}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <Tag>{e.tag}</Tag>
                      {e.project && <TextLink to={`/work/${e.project}`}>Case study</TextLink>}
                    </div>
                  </AccordionItem>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Stack() {
  const [active, setActive] = useState(layers[0].id)
  const layer = layers.find((l) => l.id === active)!
  const panel = (
    <>
      <p className="mb-6 font-display text-[1.35rem] tracking-[-0.025em]">{layer.blurb}</p>
      <ul className="border-t border-line">
        {layer.skills.map((s) => (
          <li key={s.name} className="grid gap-1.5 border-b border-line py-5 sm:grid-cols-[180px_1fr_60px] sm:gap-6">
            <b className="font-display text-[1.02rem] font-semibold tracking-[-0.02em]">{s.name}</b>
            <div>
              <p className="text-[0.93rem] text-muted">{s.evidence}</p>
              {s.projects && (
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.84rem]">
                  {s.projects.map((slug) => (
                    <TextLink key={slug} to={`/work/${slug}`}>
                      {getProject(slug)?.title}
                    </TextLink>
                  ))}
                </p>
              )}
            </div>
            <span className="tnum text-[0.84rem] text-tint sm:text-right">
              {s.years} {s.years === 1 ? 'year' : 'years'}
            </span>
          </li>
        ))}
      </ul>
    </>
  )

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <p className="mb-6 max-w-[34ch] text-muted">
            No percentages. What I&apos;ve used, for how long, and what I built with it, ordered by where I actually spend my time.
          </p>
          <div role="tablist" aria-label="Skill areas" className="flex flex-col border-t border-line">
            {layers.map((l) => (
              <Fragment key={l.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={l.id === active}
                  onClick={() => setActive(l.id)}
                  className={cx(
                    'flex cursor-pointer items-center justify-between gap-4 border-b border-line py-3.5 text-left transition-colors duration-300',
                    l.id === active ? 'text-bone' : 'text-muted hover:text-bone',
                  )}
                >
                  <span className="font-display text-[1.05rem] font-semibold tracking-[-0.02em]">{l.title}</span>
                  <span className="flex gap-[3px]" aria-label={`Depth ${l.depth} of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <i
                        key={n}
                        className={cx(
                          'block h-2.5 w-[3px] transition-colors duration-300',
                          n <= l.depth ? (l.id === active ? 'bg-tint' : 'bg-pine') : 'bg-line',
                        )}
                      />
                    ))}
                  </span>
                </button>
                {l.id === active && <div className="py-6 md:hidden">{panel}</div>}
              </Fragment>
            ))}
          </div>
        </div>

        <div role="tabpanel" className="hidden md:col-span-8 md:block">
          <Swap k={active}>{panel}</Swap>
        </div>
      </div>

      <div className="mt-24 grid gap-10 border-t border-line pt-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <h2 className="text-[clamp(1.75rem,3.2vw,2.35rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">What I&apos;d rather not do</h2>
          <p className="mt-4 max-w-[34ch] text-[0.95rem] text-muted">A skills list that includes everything tells you nothing.</p>
        </div>
        <div className="md:col-span-8">
          <Points items={notMe} />
        </div>
      </div>
    </div>
  )
}
