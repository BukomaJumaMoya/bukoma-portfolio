import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export const layerNames = ['Devices', 'Services', 'Data'] as const

const plates = [
  { label: 'Data', z: 0, off: 38, delay: 380 },
  { label: 'Services', z: 62, off: 19, delay: 240 },
  { label: 'Devices', z: 125, off: 0, delay: 100 },
]

// Where the falling pulses enter the stack, as % of the plate, with staggered timing.
const pulses = [
  { x: 22, y: 30, delay: 0 },
  { x: 58, y: 18, delay: 1.1 },
  { x: 40, y: 62, delay: 2.2 },
  { x: 74, y: 48, delay: 0.6 },
  { x: 30, y: 78, delay: 1.7 },
]

/**
 * The brand's three-layer stack, tilting with the pointer (or phone) and with scroll.
 * `active` lifts one layer out of the stack; `flowing` drops pulses of data
 * through the layers, top to bottom, the way telemetry moves through a system.
 */
export function PlateStack({ className, active, flowing }: { className?: string; active?: number; flowing?: boolean }) {
  const stack = useRef<HTMLDivElement>(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const el = stack.current
    if (!el || reduce) return
    let px = 0
    let py = 0
    let frame = 0
    const apply = () => {
      frame = 0
      const s = Math.min(window.scrollY, 500)
      el.style.transform = `rotateX(${58 - py * 16 - s / 26}deg) rotateZ(${-40 + px * 16 + s / 30}deg)`
    }
    const queue = () => (frame ||= requestAnimationFrame(apply))
    const onMove = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth - 0.5
      py = e.clientY / window.innerHeight - 0.5
      queue()
    }
    // On phones, follow the tilt of the device. Android grants this freely; iOS
    // would need a permission prompt, which isn't worth it for decoration.
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      px = Math.max(-0.5, Math.min(0.5, e.gamma / 50))
      py = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 60))
      queue()
    }
    const fine = window.matchMedia('(hover: hover)').matches
    if (fine) window.addEventListener('pointermove', onMove, { passive: true })
    else window.addEventListener('deviceorientation', onTilt, { passive: true })
    window.addEventListener('scroll', queue, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onTilt)
      window.removeEventListener('scroll', queue)
      cancelAnimationFrame(frame)
    }
  }, [reduce])

  return (
    <div className={className} style={{ perspective: 1300 }} aria-hidden="true">
      <div
        ref={stack}
        className="absolute inset-0 transition-transform duration-700 ease-brand"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(58deg) rotateZ(-40deg)' }}
      >
        <div
          className="grid-mesh fade-in absolute inset-0"
          style={{ transform: 'translateZ(-44px) translate(56px,56px)', '--d': '520ms' } as React.CSSProperties}
        />
        {plates.map((p) => {
          const layer = layerNames.indexOf(p.label as (typeof layerNames)[number])
          const on = active !== undefined && layer === active
          const dim = active !== undefined && !on
          // Exploded view: the plates above the active one rise to open a gap over it.
          const lift = active === undefined ? 0 : layer < active ? 70 : on ? 26 : 0
          return (
            <div
              key={p.label}
              className="fade-in absolute inset-0 flex items-end border p-4 transition-[transform,border-color,background] duration-700 ease-brand"
              style={
                {
                  transform: `translateZ(${p.z + lift}px) translate(${p.off}px,${p.off}px)`,
                  borderColor: `color-mix(in oklab, var(--tint) ${on ? 90 : dim ? 26 : 42}%, transparent)`,
                  background: `linear-gradient(140deg, color-mix(in oklab, var(--pine) ${on ? 62 : dim ? 22 : 34}%, transparent), color-mix(in oklab, var(--surface) 70%, transparent))`,
                  '--d': `${p.delay}ms`,
                } as React.CSSProperties
              }
            >
              <b className={`font-display text-[0.9rem] font-semibold tracking-[-0.02em] transition-colors duration-500 ${on ? 'text-bone' : 'text-tint'}`}>
                {p.label}
              </b>
            </div>
          )
        })}
        {flowing &&
          !reduce &&
          pulses.map((d) => (
            <span
              key={d.x}
              className="absolute size-[6px] rounded-full bg-tint shadow-[0_0_10px_2px_rgba(127,183,154,.55)]"
              style={{ left: `${d.x}%`, top: `${d.y}%`, animation: `drop 3.4s cubic-bezier(.45,0,.55,1) ${d.delay}s infinite`, opacity: 0 }}
            />
          ))}
      </div>
    </div>
  )
}
