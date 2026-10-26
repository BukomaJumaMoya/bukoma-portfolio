import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { tap } from '@/lib/haptics'
import { cx } from './ui'

export const ease = [0.22, 1, 0.36, 1] as const

/** Segmented control. The selection slides between options rather than jumping. */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { id: T; label: string; count?: number }[]
  value: T
  onChange: (v: T) => void
  label: string
  className?: string
}) {
  const id = useId()
  const bar = useRef<HTMLDivElement>(null)

  // On narrow screens the row scrolls sideways; keep the selected option in view.
  useEffect(() => {
    const c = bar.current
    const on = c?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!c || !on || c.scrollWidth <= c.clientWidth) return
    c.scrollTo({ left: on.offsetLeft - (c.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' })
  }, [value])

  return (
    <div
      ref={bar}
      role="tablist"
      aria-label={label}
      className={cx('no-scrollbar inline-flex max-w-full gap-0.5 overflow-x-auto rounded-full border border-line bg-ink p-1', className)}
    >
      {options.map((o) => {
        const on = o.id === value
        return (
          <button
            key={o.id}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => {
              tap()
              onChange(o.id)
            }}
            className={cx(
              'relative shrink-0 cursor-pointer rounded-full px-4 py-2 text-[0.86rem] whitespace-nowrap transition-[color,scale] duration-300 active:scale-[0.95]',
              on ? 'text-on-pine' : 'text-muted hover:text-bone',
            )}
          >
            {on && (
              <m.span layoutId={`tab-${id}`} className="absolute inset-0 rounded-full bg-pine" transition={{ type: 'spring', stiffness: 420, damping: 38 }} />
            )}
            <span className="relative">
              {o.label}
              {o.count !== undefined && <span className={cx('tnum ml-1.5 text-[0.76rem]', on ? 'text-on-pine/70' : 'text-muted/70')}>{o.count}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Swaps content when a tab changes, with a short cross-fade. */
export function Swap({ k, children }: { k: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.32, ease }}>
        {children}
      </m.div>
    </AnimatePresence>
  )
}

/** A row that opens to show detail. Summaries first, everything else on request. */
export function AccordionItem({ head, children, defaultOpen = false }: { head: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          tap()
          setOpen((o) => !o)
        }}
        className="group flex w-full cursor-pointer items-start gap-6 py-6 text-left"
      >
        <div className="min-w-0 flex-1">{head}</div>
        <span
          aria-hidden="true"
          className={cx(
            'relative mt-1.5 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-brand',
            open ? 'rotate-45 border-tint text-tint' : 'border-line-hi text-muted group-hover:text-bone',
          )}
        >
          <span className="absolute h-px w-2.5 bg-current" />
          <span className="absolute h-2.5 w-px bg-current" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="overflow-hidden"
          >
            <div className="pb-8">{children}</div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
