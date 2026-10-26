import { Link, useParams } from 'react-router-dom'
import { getProject, kindLabels, projects } from '@/data/projects'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { Schematic } from '@/components/Schematic'
import { SectionNav } from '@/components/SectionNav'
import { Button, Container, Reveal, Section, StatusDot, Tag, TextLink, TitleBlock } from '@/components/ui'
import { ArrowUpRight } from '@/components/icons'
import NotFound from './NotFound'

const sections = [
  { id: 'problem', label: 'Problem' },
  { id: 'approach', label: 'Approach' },
  { id: 'what-i-did', label: 'What I did' },
  { id: 'result', label: 'Result' },
]

export default function CaseStudy() {
  const { slug = '' } = useParams()
  const p = getProject(slug)
  if (!p) return <NotFound />

  const i = projects.indexOf(p)
  const next = projects[(i + 1) % projects.length]

  return (
    <>
      <Seo title={p.title} description={p.summary} />

      <PageHero title={p.title} sub={p.summary} back={<TextLink to="/work">All projects</TextLink>}>
        <TitleBlock
          rows={[
            { k: 'Organisation', v: p.org },
            { k: 'Role', v: p.role },
            { k: 'Period', v: <span className="tnum">{p.period}</span> },
            {
              k: 'Status',
              v: (
                <span className="inline-flex items-center gap-2">
                  <StatusDot live={p.live} /> {p.status}
                </span>
              ),
            },
          ]}
        />
      </PageHero>

      <div>
        <SectionNav items={sections} />

        <Section id="problem" title="The problem">
          <Reveal>
            <p className="max-w-[34ch] font-display text-[clamp(1.4rem,2.8vw,2rem)] leading-[1.28] tracking-[-0.03em]">{p.problem}</p>
          </Reveal>
        </Section>

        <Section id="approach" title="The approach" intro={kindLabels[p.kind]}>
          <Reveal>
            <p className="max-w-[60ch] text-[1.05rem] leading-relaxed text-muted">{p.approach}</p>
            <div className="mt-12 rounded-[10px] border border-line p-6 md:p-8">
              <p className="mb-7 text-[0.84rem] text-muted">How data moves through the system</p>
              <Schematic stages={p.pipeline} />
            </div>
          </Reveal>
        </Section>

        <Section id="what-i-did" title="What I did" intro={p.role}>
          <Reveal>
            <ul>
              {p.highlights.map((h) => (
                <li key={h} className="border-t border-line py-4 text-bone/85 last:border-b">
                  {h}
                </li>
              ))}
            </ul>
            {p.note && <p className="mt-8 max-w-[58ch] border-l-2 border-pine pl-5 text-muted">{p.note}</p>}
          </Reveal>
        </Section>

        <Section id="result" title="Result" intro={p.outcome.label}>
          <Reveal>
            <p className="font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.2] font-semibold tracking-[-0.035em] text-tint">{p.outcome.value}</p>
            <div className="mt-10 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
            {!!p.links?.length && (
              <div className="mt-10 flex flex-wrap gap-3">
                {p.links.map((l) => (
                  <Button key={l.url} href={l.url} icon={<ArrowUpRight />}>
                    {l.label}
                  </Button>
                ))}
              </div>
            )}
          </Reveal>
        </Section>
      </div>

      <Container>
        <Link to={`/work/${next.slug}`} className="group block border-t border-line pt-10">
          <span className="text-[0.84rem] text-muted">Next project</span>
          <span className="mt-2 block font-display text-[clamp(2.2rem,6vw,4.4rem)] leading-none font-extrabold tracking-[-0.055em] transition-colors duration-500 group-hover:text-tint">
            {next.title}
          </span>
          <span className="mt-3 block text-[0.92rem] text-muted">{next.org}</span>
        </Link>
      </Container>
    </>
  )
}
