import { Suspense, useEffect, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { m, useScroll, useSpring } from 'motion/react'
import { Header } from './Header'
import { Footer } from './Footer'
import { CommandPalette } from './CommandPalette'
import { MobileDock } from './MobileDock'
import { ease } from './motion'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  return <m.div aria-hidden="true" className="fixed top-0 left-0 z-80 h-0.5 w-full origin-left bg-tint" style={{ scaleX }} />
}

export function Layout() {
  const { pathname } = useLocation()
  const [palette, setPalette] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a href="#main" className="sr-only z-90 rounded-full bg-pine px-4 py-2 text-on-pine focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />
      <Header onOpenPalette={() => setPalette(true)} />

      {/* A pine sweep marks each route change; the page lifts in beneath it. */}
      <m.div
        key={`wipe-${pathname}`}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[85] h-[3px] origin-left bg-pine"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ scaleX: { duration: 0.5, ease }, opacity: { delay: 0.45, duration: 0.3 } }}
      />
      <main id="main" key={pathname} className="page-in">
        <Suspense fallback={<div className="min-h-[100svh]" />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <MobileDock />
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
      <ScrollRestoration />
    </>
  )
}
