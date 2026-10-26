import { useRef, type ReactNode } from 'react'
import { AnimatePresence, m, type PanInfo } from 'motion/react'
import { tap } from '@/lib/haptics'
import { ArrowRight } from './icons'
import { ease } from './motion'
import { cx } from './ui'

/**
 * One card at a time from an ordered set. Swipe or drag sideways to move
 * between them; the arrows and keyboard do the same. The card slides in from
 * the side you're heading towards, so direction always reads correctly.
 */
export function SwipeDeck({
  count,
  index,
  onIndex,
  label,
  children,
  className,
  tone = 'surface',
}: {
  count: number
  index: number
  onIndex: (i: number) => void
  label: string
  children: ReactNode
  className?: string
  tone?: 'surface' | 'plain'
}) {
  const dir = useRef(1)
  const go = (next: number) => {
    if (next < 0 || next >= count || next === index) return
    dir.current = next > index ? 1 : -1
    tap()
    onIndex(next)
  }
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2
    if (swipe < -70) go(index + 1)
    else if (swipe > 70) go(index - 1)
  }

  const btn =
    'grid size-11 cursor-pointer place-items-center rounded-full border border-line-hi text-bone transition-[opacity,scale] duration-300 active:scale-[0.92] disabled:cursor-default disabled:opacity-25'

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1)
        if (e.key === 'ArrowLeft') go(index - 1)
      }}
      className={cx('outline-none', className)}
    >
      <div className={cx('relative overflow-hidden', tone === 'surface' && 'rounded-[10px] border border-line bg-surface')}>
        <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
          <m.div
            key={index}
            custom={dir.current}
            variants={{
              enter: (d: number) => ({ x: d * 60, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -60, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={onDragEnd}
            className={cx('cursor-grab touch-pan-y active:cursor-grabbing', tone === 'surface' && 'p-6 sm:p-7')}
            aria-live="polite"
          >
            {children}
          </m.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-[0.82rem] text-muted">
          <span className="tnum text-bone">{index + 1}</span> of <span className="tnum">{count}</span>
          <span className="ml-3 md:hidden">Swipe for more</span>
        </p>
        <div className="flex gap-2">
          <button type="button" className={btn} onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous">
            <ArrowRight className="rotate-180" />
          </button>
          <button type="button" className={btn} onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Next">
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}
