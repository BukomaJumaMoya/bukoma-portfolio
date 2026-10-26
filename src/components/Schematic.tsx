import { useInView } from '@/hooks/useInView'
import { cx } from './ui'

/**
 * A project's architecture as a single-line diagram: stages are nodes on one
 * bus, and a pulse runs along it while the diagram is on screen. Horizontal
 * from md up, vertical on phones.
 */
export function Schematic({ stages, compact, vertical, className }: { stages: string[]; compact?: boolean; vertical?: boolean; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  const dur = `${Math.max(stages.length * 0.7, 3)}s`
  const run = inView ? 'running' : 'paused'

  return (
    <figure ref={ref} className={cx('relative', className)}>
      {/* Horizontal (md+) */}
      <div className={cx('relative hidden', !vertical && 'md:block', compact ? 'pt-3 pb-1' : 'pt-4 pb-2')}>
        <div className="absolute right-0 left-0 h-px bg-line-hi" style={{ top: compact ? 'calc(0.75rem + 5px)' : 'calc(1rem + 5px)' }}>
          <span
            className="absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tint shadow-[0_0_0_4px_rgba(127,183,154,.18)]"
            style={{ animation: `bus-x ${dur} linear infinite`, animationPlayState: run }}
          />
        </div>
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))` }}>
          {stages.map((s, i) => (
            <li key={s} className="pr-3">
              <span
                className="block size-[11px] border border-line-hi bg-ink"
                style={{ animation: `node ${dur} linear ${(i / stages.length) * parseFloat(dur)}s infinite`, animationPlayState: run }}
              />
              <span className={cx('mt-3 block leading-snug text-bone/85', compact ? 'text-[0.76rem]' : 'text-[0.84rem]')}>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Vertical (phones) */}
      <div className={cx('relative', !vertical && 'md:hidden')}>
        <div className="absolute top-1.5 bottom-1.5 left-[5px] w-px bg-line-hi">
          <span
            className="absolute left-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tint shadow-[0_0_0_4px_rgba(127,183,154,.18)]"
            style={{ animation: `bus-y ${dur} linear infinite`, animationPlayState: run }}
          />
        </div>
        <ol className="relative space-y-2.5 sm:space-y-3.5">
          {stages.map((s, i) => (
            <li key={s} className="flex items-start gap-4">
              <span
                className="mt-1 block size-[11px] shrink-0 border border-line-hi bg-ink"
                style={{ animation: `node ${dur} linear ${(i / stages.length) * parseFloat(dur)}s infinite`, animationPlayState: run }}
              />
              <span className="text-[0.84rem] leading-snug text-bone/85 sm:text-[0.86rem]">{s}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="sr-only">System flow: {stages.join(', then ')}</figcaption>
    </figure>
  )
}
