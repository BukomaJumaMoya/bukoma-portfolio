import { organisations, principles, profile } from '@/data/profile'
import { pages } from '@/data/pages'
import { engagements, process } from '@/data/content'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { AccordionItem } from '@/components/motion'
import { Button, Points, Reveal, Section, TextLink } from '@/components/ui'

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="Software engineer in Kampala, Uganda. Backend and distributed systems at Auri Energy; Rotaract founder and incoming district PIME Chair. Ways to work together."
      />
      <PageHero title={pages.about.title} sub={pages.about.sub} />

      <Section
        title="The short version"
        aside={
          profile.portrait && (
            <figure className="max-w-[260px] md:max-w-[300px]">
              <img
                src={profile.portrait}
                alt={`Portrait of ${profile.name}`}
                width={648}
                height={1080}
                className="aspect-[4/5] w-full rounded-[10px] border border-line object-cover object-[50%_18%]"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mt-3 text-[0.82rem] text-muted">
                {profile.name}, {profile.location}
              </figcaption>
            </figure>
          )
        }
      >
        <Reveal className="max-w-[62ch] space-y-5 text-[1.05rem] leading-relaxed text-bone/85">
          <p>
            I&apos;m a software engineer in Kampala, Uganda, currently R&amp;D Software Developer at Auri Energy, where I work on{' '}
            <TextLink to="/work/cetus-central">Cetus Central</TextLink>, an enterprise IoT platform handling real-time industrial energy data across distributed
            systems. Before that I architected a smart water dispenser system for Whave Solutions, and built marketplace and fintech backends at Shamos Tech
            Solutions.
          </p>
          <p className="text-muted">
            My stack is Node and Spring Boot over PostgreSQL, with Kafka and Redis where latency matters, deployed through Docker and Azure. I&apos;m
            comfortable in React when the work calls for it, but the interesting problems have mostly been behind it.
          </p>
          <p className="text-muted">
            In 2022 I was part of the group that founded the Rotaract Club of Kitante. I came in as a member, joined the board, served as president, and from
            July 2027 I take on Planning, Implementation, Monitoring and Evaluation for a district of 68 clubs. That isn&apos;t a hobby I list for colour.
            Running an organisation is where I learned what happens to good software on contact with real institutions.
          </p>
        </Reveal>
      </Section>

      <Section title="What I believe about building">
        <Points items={principles} />
      </Section>

      <Section title="Where I've done the work" intro="Organisations whose systems I've built, architected or rebuilt, or that I've helped run.">
        <Reveal>
          <ul className="grid sm:grid-cols-2">
            {organisations.map((o) => (
              <li key={o} className="border-t border-line py-4 font-display text-[1.15rem] font-semibold tracking-[-0.02em]">
                {o}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section
        id="work-with-me"
        title="Work with me"
        intro="Employed and remote is my first preference. I also take on a small number of defined engagements."
        aside={
          <Button to="/contact" variant="solid">
            Start a conversation
          </Button>
        }
      >
        <div className="border-t border-line">
          {engagements.map((e, i) => (
            <AccordionItem
              key={e.title}
              defaultOpen={i === 0}
              head={<h3 className="text-[1.25rem] leading-snug font-semibold tracking-[-0.025em]">{e.title}</h3>}
            >
              <p className="max-w-[60ch] text-muted">{e.body}</p>
              <ul className="mt-4 space-y-1.5 text-[0.93rem] text-bone/80">
                {e.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span className="mt-[0.65em] h-px w-3 shrink-0 bg-tint" />
                    {pt}
                  </li>
                ))}
              </ul>
            </AccordionItem>
          ))}
        </div>

        <h3 className="mt-16 mb-8 text-[1.2rem] font-semibold tracking-[-0.025em]">How an engagement runs</h3>
        <Points items={process} numbered />
      </Section>
    </>
  )
}
