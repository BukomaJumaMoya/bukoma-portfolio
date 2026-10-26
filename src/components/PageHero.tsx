import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { Container } from './ui'

/**
 * Inner-page opening: a plain statement set large, a short paragraph, and
 * optionally a row of facts beneath. No ornament: the type does the work.
 */
export function PageHero({ title, sub, back, children }: { title: string; sub: ReactNode; back?: ReactNode; children?: ReactNode }) {
  const words = title.split(' ')
  return (
    <section className="pt-36 pb-16 md:pt-48 md:pb-20">
      <Container>
        {back && <div className="fade-in mb-10">{back}</div>}
        <h1 className="max-w-[16ch] text-[clamp(2.6rem,7.4vw,5.6rem)] leading-[0.95] font-extrabold tracking-[-0.055em]">
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                <span className="rise" style={{ '--d': `${60 + i * 45}ms` } as CSSProperties}>
                  {w}
                </span>
              </span>{' '}
            </Fragment>
          ))}
        </h1>
        <p className="fade-in mt-7 max-w-[52ch] text-[1.1rem] leading-relaxed text-muted" style={{ '--d': '420ms' } as CSSProperties}>
          {sub}
        </p>
        {children && (
          <div className="fade-in mt-12" style={{ '--d': '540ms' } as CSSProperties}>
            {children}
          </div>
        )}
      </Container>
    </section>
  )
}
