import { useState } from 'react'
import { pages } from '@/data/pages'
import { m } from 'motion/react'
import { formats, leadershipTimeline, lessons, serviceBeyond, talks } from '@/data/content'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { AccordionItem } from '@/components/motion'
import { SwipeDeck } from '@/components/SwipeDeck'
import { Button, Points, Reveal, Section, TitleBlock, cx } from '@/components/ui'

export default function Leadership() {
  const [step, setStep] = useState(3)
  const current = leadershipTimeline[step]

  return (
    <>
      <Seo
        title="Leadership"
        description="Founding a Rotaract club, leading it as president, and taking on planning and evaluation for a district of 68 clubs. Talks and workshops."
      />
      <PageHero title={pages.leadership.title} sub={pages.leadership.sub}>
        <TitleBlock
          rows={[
            { k: 'Club', v: 'Rotaract Club of Kitante' },
            { k: 'Founded', v: <span className="tnum">June 2022</span> },
            { k: 'District', v: '9218, 68 clubs' },
            { k: 'Next role', v: 'PIME Chair, from July 2027' },
          ]}
        />
      </PageHero>

      <Section title="Progression" intro="Member to president to district. Select a step, or swipe the card.">
        <Reveal>
          <ol className="relative grid grid-cols-5" aria-label="Leadership progression">
            <span aria-hidden="true" className="absolute top-[6px] right-[10%] left-[10%] h-px bg-line-hi" />
            <m.span
              aria-hidden="true"
              className="absolute top-[6px] left-[10%] h-px origin-left bg-tint"
              style={{ width: '80%' }}
              animate={{ scaleX: step / (leadershipTimeline.length - 1) }}
              transition={{ type: 'spring', stiffness: 160, damping: 26 }}
            />
            {leadershipTimeline.map((t, i) => (
              <li key={t.title} className="relative flex justify-center">
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-label={t.title}
                  aria-pressed={step === i}
                  className="group flex min-h-11 cursor-pointer flex-col items-center gap-3 text-center"
                >
                  <span
                    className={cx(
                      'relative block size-[13px] rotate-45 border transition-all duration-400',
                      i <= step ? 'border-tint bg-tint' : 'border-line-hi bg-ink group-hover:border-tint',
                      t.upcoming && i > step && 'border-dashed',
                    )}
                  />
                  <span className={cx('text-[0.78rem] leading-tight transition-colors', step === i ? 'text-bone' : 'text-muted')}>{t.step}</span>
                </button>
              </li>
            ))}
          </ol>
          <SwipeDeck count={leadershipTimeline.length} index={step} onIndex={setStep} label="Leadership progression detail" className="mt-10">
            <div className="min-h-[190px] sm:min-h-[150px]">
              <p className="tnum text-[0.84rem] text-tint">
                {current.when}
                {current.upcoming && ', upcoming'}
              </p>
              <h3 className="mt-2 text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight font-extrabold tracking-[-0.04em]">{current.title}</h3>
              <p className="mt-3 max-w-[60ch] text-muted">{current.body}</p>
            </div>
          </SwipeDeck>
        </Reveal>
      </Section>

      <Section title="The district" intro="Every club files reports, tracks members and gets assessed. That is the problem I've been handed.">
        <Reveal>
          <div
            className="grid max-w-[560px] grid-cols-12 gap-[5px] sm:grid-cols-17"
            role="img"
            aria-label="68 filled squares, one for each club in District 9218"
          >
            {Array.from({ length: 68 }, (_, i) => (
              <i
                key={i}
                className="block aspect-square scale-0 rounded-[2px] bg-pine transition-transform duration-500 ease-brand in-view:scale-100"
                style={{ transitionDelay: `${i * 14}ms` }}
              />
            ))}
          </div>
          <p className="mt-5 text-[0.88rem] text-muted">One square per club in Rotaract District 9218.</p>
          <p className="mt-10 max-w-[58ch] text-bone/85">
            As incoming Planning, Implementation, Monitoring and Evaluation Chair I&apos;m responsible for how the district plans its year, assesses club
            performance on a 100-point framework, and knows whether any of it worked. I&apos;m also building the information system that will carry it.
          </p>
        </Reveal>
      </Section>

      <Section title="What running things taught me">
        <Points items={lessons} />
      </Section>

      <Section title="Service beyond the title">
        <Points items={serviceBeyond} />
      </Section>

      <Section
        id="speaking"
        title="Speaking"
        intro="Talks and workshops on what happens when software meets a real institution. Each topic comes from something I built or ran."
        aside={
          <Button to="/contact?topic=speaking" variant="solid">
            Invite me to speak
          </Button>
        }
      >
        <div className="border-t border-line">
          {talks.map((t) => (
            <AccordionItem key={t.title} head={<h3 className="text-[1.2rem] leading-snug font-semibold tracking-[-0.025em]">{t.title}</h3>}>
              <p className="max-w-[60ch] text-muted">{t.body}</p>
            </AccordionItem>
          ))}
        </div>
        <dl className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {formats.map((f) => (
            <div key={f.title}>
              <dt className="font-display font-semibold tracking-[-0.015em]">{f.title}</dt>
              <dd className="mt-1 text-[0.92rem] text-muted">{f.body}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  )
}
