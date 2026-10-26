import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '@/hooks/useInView'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export function Container({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return (
    <div id={id} className={cx('mx-auto w-full max-w-[1200px] px-5 sm:px-8', className)}>
      {children}
    </div>
  )
}

/** Lifts content in once when it scrolls into view. Children can use `in-view:` styles. */
export function Reveal({
  className,
  delay = 0,
  children,
  as: Tag = 'div',
  id,
}: {
  className?: string
  delay?: number
  children: ReactNode
  as?: 'div' | 'li' | 'article' | 'section'
  id?: string
}) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <Tag ref={ref as never} id={id} className={cx('reveal', inView && 'is-in', className)} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}

/** Small sentence-case label for data, never decoration. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx('block text-[0.8rem] text-muted', className)}>{children}</span>
}

/**
 * The site's main layout device: a side-head in the left four columns that
 * stays put while the content on the right scrolls past it.
 */
export function Section({
  title,
  intro,
  aside,
  children,
  id,
  className,
}: {
  title: ReactNode
  intro?: ReactNode
  aside?: ReactNode
  children: ReactNode
  id?: string
  className?: string
}) {
  return (
    <section id={id} className={cx('scroll-mt-28 border-t border-line pt-10 pb-24 md:pb-32', className)}>
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <h2 className="text-[clamp(1.75rem,3.2vw,2.35rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">{title}</h2>
            {intro && <p className="mt-4 max-w-[34ch] text-[0.95rem] text-muted">{intro}</p>}
            {aside && <div className="mt-6">{aside}</div>}
          </div>
        </div>
        <div className="min-w-0 md:col-span-8">{children}</div>
      </Container>
    </section>
  )
}

type ButtonProps = { children: ReactNode; variant?: 'solid' | 'ghost'; className?: string; icon?: ReactNode } & (
  { to: string; href?: never; download?: never } | { href: string; to?: never; download?: boolean }
)

export function Button({ children, variant = 'ghost', className, icon, ...rest }: ButtonProps) {
  const cls = cx(
    'inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-[0.92rem] font-medium transition-[color,background-color,border-color,scale] duration-300 active:scale-[0.97]',
    variant === 'solid' ? 'border-pine bg-pine text-on-pine hover:border-pine-hi hover:bg-pine-hi' : 'border-line-hi text-bone hover:border-tint',
    className,
  )
  const inner = (
    <>
      {children}
      {icon}
    </>
  )
  if ('to' in rest && rest.to)
    return (
      <Link to={rest.to} className={cls}>
        {inner}
      </Link>
    )
  const external = rest.href?.startsWith('http')
  return (
    <a href={rest.href} className={cls} download={rest.download} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {inner}
    </a>
  )
}

/** Inline text link with an underline that draws in on hover. */
export function TextLink({ to, href, children, className }: { to?: string; href?: string; children: ReactNode; className?: string }) {
  const cls = cx(
    'tap text-tint bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-brand hover:bg-[length:100%_1px]',
    className,
  )
  return to ? (
    <Link to={to} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls} {...(href?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {children}
    </a>
  )
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx('rounded-full border border-line px-3 py-1 text-[0.78rem] text-muted', className)}>{children}</span>
}

/**
 * Facts set out like the title block in the corner of an engineering drawing.
 * Every cell is a real label/value pair.
 */
export function TitleBlock({ rows, cols = 4, className }: { rows: { k: string; v: ReactNode }[]; cols?: 2 | 3 | 4; className?: string }) {
  // Two across even on phones, so a row of facts never becomes a tall stack.
  const colCls = { 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4' }[cols]
  return (
    <dl className={cx('grid overflow-hidden rounded-[10px] border border-line', colCls, className)}>
      {rows.map((r) => (
        <div key={r.k} className="-mt-px -ml-px min-w-0 border-t border-l border-line px-3.5 py-3.5 sm:px-5 sm:py-4">
          <dt className="text-[0.76rem] text-muted">{r.k}</dt>
          <dd className="mt-1 font-display text-[0.92rem] leading-snug font-semibold tracking-[-0.015em] break-words sm:text-[1.02rem]">{r.v}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Short titled paragraphs in two columns. Numbered only when the content is a sequence. */
export function Points({ items, numbered, cols = 2 }: { items: { title: string; body: string }[]; numbered?: boolean; cols?: 1 | 2 }) {
  return (
    <ol className={cx('grid gap-x-10 gap-y-9', cols === 2 && 'sm:grid-cols-2')}>
      {items.map((it, i) => (
        <li key={it.title} className="border-t border-line pt-5">
          <h3 className="flex gap-3 text-[1.12rem] leading-tight font-semibold tracking-[-0.025em]">
            {numbered && <span className="tnum text-tint">{i + 1}</span>}
            {it.title}
          </h3>
          <p className="mt-2.5 max-w-[46ch] text-[0.95rem] text-muted">{it.body}</p>
        </li>
      ))}
    </ol>
  )
}

export function StatusDot({ live }: { live?: boolean }) {
  return <span className={cx('inline-block size-[7px] shrink-0 rounded-full', live ? 'live-dot bg-tint' : 'bg-pine')} />
}
