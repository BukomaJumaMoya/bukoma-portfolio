import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, m } from 'motion/react'
import { profile } from '@/data/profile'
import { Download } from './icons'
import { ease } from './motion'

/**
 * Phones only: the two things a visitor most likely wants, kept within thumb
 * reach. Appears once the opening has scrolled away; steps aside at the
 * footer (which has the same actions) and on the contact page itself.
 */
export function MobileDock() {
  const { pathname } = useLocation()
  const [pastHero, setPastHero] = useState(false)
  const [atFooter, setAtFooter] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const footer = document.querySelector('footer')
    const io = footer ? new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting)) : null
    if (footer) io!.observe(footer)
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [pathname])

  const show = pastHero && !atFooter && pathname !== '/contact'

  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="fixed inset-x-3 z-50 flex gap-2 rounded-full border border-line-hi bg-ink/90 p-1.5 backdrop-blur-xl md:hidden"
          style={{ bottom: 'calc(12px + env(safe-area-inset-bottom))' }}
        >
          <Link
            to="/contact"
            className="flex flex-1 items-center justify-center rounded-full bg-pine py-3 text-[0.92rem] font-medium text-on-pine transition-transform active:scale-[0.97]"
          >
            Get in touch
          </Link>
          {profile.cv && (
            <a
              href={profile.cv}
              download
              className="flex items-center gap-2 rounded-full px-5 text-[0.92rem] text-bone transition-transform active:scale-[0.97]"
            >
              CV <Download />
            </a>
          )}
        </m.div>
      )}
    </AnimatePresence>
  )
}
