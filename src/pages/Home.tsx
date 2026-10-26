import { useState, type CSSProperties } from 'react'
import { pages } from '@/data/pages'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'motion/react'
import { profile, principles } from '@/data/profile'
import { projects } from '@/data/projects'
import { roles } from '@/data/experience'
import { Seo } from '@/components/Seo'
import { HeroModel } from '@/components/HeroModel'
import { Schematic } from '@/components/Schematic'
import { ProjectDeck } from '@/components/ProjectDeck'
import { SwipeDeck } from '@/components/SwipeDeck'
import { LocalTime } from '@/components/LocalTime'
import { ease } from '@/components/motion'
import { Download } from '@/components/icons'
import { Button, Container, Reveal, Section, StatusDot, TextLink, TitleBlock, cx } from '@/components/ui'

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export default function Home() {
  const featured = projects.filter((p) => p.featured)
  const [principle, setPrinciple] = useState(0)

  return (
    <>
      <Seo description="Backend engineer and community leader in Kampala, Uganda. Real-time distributed systems, industrial IoT and data pipelines." />

      {/* ---------------- Opening ---------------- */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
        <Container className="relative grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          {/* Who: name and statement. First on every screen. */}
          <div className="relative z-10 md:col-span-7">
            <p className="fade-in mb-6 inline-flex items-center gap-2.5 text-[0.86rem] text-muted" style={d(0)}>
              <StatusDot live />
              {profile.availability}
            </p>
            <h1 className="text-[clamp(3rem,11.5vw,8rem)] leading-[0.86] font-extrabold tracking-[-0.06em]">
              {['Bukoma', 'Juma Moya'].map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[0.05em]">
                  <span className="rise" style={d(80 + i * 120)}>
                    {l}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="fade-in mt-8 max-w-[30ch] font-display text-[clamp(1.25rem,2.4vw,1.8rem)] leading-[1.25] tracking-[-0.03em] text-bone/90 md:mt-10"
              style={d(420)}
            >
              {pages.home.statement}
            </p>
          </div>

          {/* What: the working model. Right column on desktop, between statement and buttons on phones. */}
          <HeroModel
            className="fade-in mt-24 md:col-span-5 md:col-start-8 md:row-span-2 md:row-start-1 md:mt-0 md:self-center"
            stackClassName="mx-auto size-[62vw] max-w-[290px] translate-x-[-6%] md:size-[min(30vw,380px)] md:max-w-none md:translate-x-0"
          />

          <div className="fade-in mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 md:col-span-7 md:mt-12" style={d(560)}>
            <Button to="/work" variant="solid">
              See the work
            </Button>
            <TextLink href={`mailto:${profile.email}`}>{profile.email}</TextLink>
          </div>
        </Container>

        <Container>
          <div className="fade-in mt-20 md:mt-28" style={d(700)}>
            <TitleBlock
              rows={[
                { k: 'Currently', v: `${profile.role}, ${profile.company}` },
                {
                  k: 'Based in',
                  v: (
                    <>
                      Kampala,{' '}
                      <span className="tnum font-normal text-muted">
                        <LocalTime />
                      </span>
                    </>
                  ),
                },
                {
                  k: 'Availability',
                  v: (
                    <span className="inline-flex items-center gap-2">
                      <StatusDot live /> Open to remote roles
                    </span>
                  ),
                },
                {
                  k: 'CV',
                  v: profile.cv ? (
                    <a href={profile.cv} download className="tap inline-flex items-center gap-2 transition-colors hover:text-tint">
                      Download CV <Download />
                    </a>
                  ) : (
                    <Link to="/experience">Experience</Link>
                  ),
                },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* ---------------- Selected work ---------------- */}
      <Section title="Selected work" intro={pages.home.workIntro} aside={<TextLink to="/work">All {projects.length} projects</TextLink>}>
        <div className="md:hidden">
          <ProjectDeck projects={featured} />
        </div>
        <div className="hidden md:block">
          {featured.map((p, i) => (
            <Reveal key={p.slug} as="article" className={cx('pb-14', i > 0 && 'border-t border-line pt-10')}>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.84rem] text-muted">
                <span className="inline-flex items-center gap-2 text-bone/80">
                  <StatusDot live={p.live} /> {p.status}
                </span>
                <span>{p.org}</span>
                <span className="tnum">{p.period}</span>
              </p>
              <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] leading-none font-extrabold tracking-[-0.05em]">
                <Link to={`/work/${p.slug}`} className="transition-colors duration-300 hover:text-tint">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-4 max-w-[60ch] text-muted">{p.problem}</p>
              <Schematic stages={p.pipeline} compact className="mt-9" />
              <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
                <p className="text-[0.95rem]">
                  <span className="text-muted">{p.outcome.label}: </span>
                  {p.outcome.value}
                </p>
                <TextLink to={`/work/${p.slug}`}>Read the case study</TextLink>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------- Two disciplines ---------------- */}
      <Section title="Engineer and organiser" intro="Engineering is the job. Running an organisation is where I learned what the job is for.">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <h3 className="text-[1.2rem] font-semibold tracking-[-0.025em]">Engineering</h3>
            <p className="mt-3 max-w-[44ch] text-[0.95rem] text-muted">
              Backend first: services, pipelines and schemas, where being wrong is expensive. Energy, water, marketplaces, fintech and city government.
            </p>
            <ol className="mt-7">
              {roles.map((r) => (
                <li key={r.org} className="border-t border-line py-4">
                  <p className="flex items-baseline justify-between gap-4">
                    <span className="font-display font-semibold tracking-[-0.015em]">{r.org}</span>
                    <span className="tnum shrink-0 text-[0.8rem] text-muted">{r.when}</span>
                  </p>
                  <p className="mt-0.5 text-[0.88rem] text-muted">{r.title}</p>
                </li>
              ))}
            </ol>
            <TextLink to="/experience" className="mt-4 inline-block">
              Full experience and stack
            </TextLink>
          </Reveal>

          <Reveal delay={100}>
            <h3 className="text-[1.2rem] font-semibold tracking-[-0.025em]">Leadership</h3>
            <p className="mt-3 max-w-[44ch] text-[0.95rem] text-muted">
              Founding member and past president of the Rotaract Club of Kitante. From July 2027, Planning, Implementation, Monitoring and Evaluation Chair for
              District 9218.
            </p>
            <figure className="mt-7">
              <div className="grid max-w-[340px] grid-cols-12 gap-[4px]" role="img" aria-label="68 squares, one for each club in District 9218">
                {Array.from({ length: 72 }, (_, i) => (
                  <i
                    key={i}
                    className={cx(
                      'block aspect-square scale-0 rounded-[2px] transition-transform duration-500 ease-brand in-view:scale-100',
                      i < 68 ? 'bg-pine' : 'border border-line',
                    )}
                    style={{ transitionDelay: `${Math.floor(i / 12) * 60 + (i % 12) * 18}ms` }}
                  />
                ))}
              </div>
              <figcaption className="mt-3 text-[0.82rem] text-muted">
                One square per club. I&apos;m building the system that gives all 68 one reporting standard.
              </figcaption>
            </figure>
            <TextLink to="/leadership" className="mt-6 inline-block">
              The leadership record
            </TextLink>
          </Reveal>
        </div>
      </Section>

      {/* ---------------- Principles ---------------- */}
      <Section title="How I work" intro="Four positions I'll defend in an interview.">
        {/* Phones: one position at a time, swiped through. */}
        <SwipeDeck count={principles.length} index={principle} onIndex={setPrinciple} label="How I work" className="md:hidden">
          <div className="min-h-[200px]">
            <h3 className="text-[1.3rem] leading-tight font-extrabold tracking-[-0.035em] text-tint">{principles[principle].title}</h3>
            <p className="mt-3 font-display text-[1.2rem] leading-[1.35] tracking-[-0.025em]">{principles[principle].body}</p>
          </div>
        </SwipeDeck>
        <div className="hidden gap-8 md:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div role="tablist" aria-label="Principles" className="flex flex-col">
            {principles.map((p, i) => (
              <button
                key={p.title}
                type="button"
                role="tab"
                aria-selected={principle === i}
                onClick={() => setPrinciple(i)}
                onMouseEnter={() => setPrinciple(i)}
                className={cx(
                  'relative cursor-pointer border-t border-line py-4 pl-5 text-left font-display text-[1.15rem] font-semibold tracking-[-0.025em] transition-colors duration-300 last:border-b',
                  principle === i ? 'text-bone' : 'text-muted hover:text-bone',
                )}
              >
                {principle === i && (
                  <m.span
                    layoutId="principle-mark"
                    className="absolute top-3 bottom-3 left-0 w-[2px] bg-tint"
                    transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                  />
                )}
                {p.title}
              </button>
            ))}
          </div>
          <div role="tabpanel" aria-live="polite" className="min-h-[150px] lg:pt-3">
            <AnimatePresence mode="wait">
              <m.p
                key={principle}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease }}
                className="font-display text-[clamp(1.3rem,2.4vw,1.75rem)] leading-[1.32] tracking-[-0.03em]"
              >
                {principles[principle].body}
              </m.p>
            </AnimatePresence>
          </div>
        </div>
      </Section>
    </>
  )
}
