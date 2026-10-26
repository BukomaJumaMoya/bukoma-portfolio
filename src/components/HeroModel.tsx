import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { heroLayers } from '@/data/layers'
import { tap } from '@/lib/haptics'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { PlateStack } from './PlateStack'
import { ease } from './motion'
import { TextLink, cx } from './ui'

const CYCLE_MS = 4200

/**
 * The hero's working model: the three-layer stack with data falling through it,
 * and a list of the layers beside it. Hover or tap a layer to lift it and see
 * what I do there. Until the visitor touches it, the layers take turns on their own.
 */
export function HeroModel({ className, stackClassName }: { className?: string; stackClassName?: string }) {
  const [active, setActive] = useState(0)
  const [touched, setTouched] = useState(false)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (touched || reduce) return
    const id = setInterval(() => setActive((a) => (a + 1) % heroLayers.length), CYCLE_MS)
    return () => clearInterval(id)
  }, [touched, reduce])

  const choose = (i: number) => {
    if (i !== active) tap()
    setTouched(true)
    setActive(i)
  }

  const layer = heroLayers[active]

  return (
    <div className={className}>
      <PlateStack className={cx('pointer-events-none relative', stackClassName)} active={active} flowing />

      <div className="relative mt-8 md:mt-10">
        <div role="tablist" aria-label="Layers of a system" className="grid grid-cols-3 gap-1 rounded-full border border-line bg-ink/80 p-1 backdrop-blur">
          {heroLayers.map((l, i) => (
            <button
              key={l.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="hero-layer"
              onClick={() => choose(i)}
              onMouseEnter={() => choose(i)}
              className={cx(
                'relative min-h-10 cursor-pointer rounded-full px-2 text-[0.86rem] transition-[color,scale] duration-300 active:scale-[0.95]',
                i === active ? 'text-on-pine' : 'text-muted hover:text-bone',
              )}
            >
              {i === active && (
                <m.span
                  layoutId="hero-layer-pill"
                  className="absolute inset-0 rounded-full bg-pine"
                  transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                />
              )}
              <span className="relative">{l.name}</span>
              {/* Shows how long until the next layer takes over, until the visitor takes control. */}
              {i === active && !touched && !reduce && (
                <m.span
                  key={`timer-${active}`}
                  aria-hidden="true"
                  className="absolute inset-x-4 bottom-1 h-px origin-left bg-on-pine/50"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>

        <div id="hero-layer" role="tabpanel" aria-live="polite" className="mt-5 min-h-[128px] px-1">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={layer.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease }}
            >
              <p className="text-[0.98rem] text-bone/90">{layer.line}</p>
              <p className="mt-3 flex flex-wrap gap-1.5">
                {layer.tools.map((t) => (
                  <span key={t} className="rounded-full border border-line px-2.5 py-0.5 text-[0.76rem] text-muted">
                    {t}
                  </span>
                ))}
              </p>
              <p className="mt-3 text-[0.84rem] text-muted">
                Used in <TextLink to={`/work/${layer.project.slug}`}>{layer.project.title}</TextLink>
              </p>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
