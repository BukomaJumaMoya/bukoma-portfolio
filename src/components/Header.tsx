import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, m } from 'motion/react'
import { contactItem, nav } from '@/data/nav'
import { profile } from '@/data/profile'
import { LogoMark } from './Logo'
import { Search } from './icons'
import { ease } from './motion'
import { cx } from './ui'

/** Floating pill header: logo · four links with a sliding indicator · search · contact. */
const shortcut = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K'

export function Header({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const active = nav.find((n) => pathname.startsWith(n.to))?.to

  return (
    <>
      <m.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        className={cx(
          'fixed inset-x-0 top-0 z-60 px-3 pt-3 pb-3 transition-[background] duration-500 sm:px-5 sm:pt-4',
          stuck && !open && 'bg-gradient-to-b from-ink via-ink/85 to-transparent',
        )}
      >
        <div
          className={cx(
            'mx-auto flex max-w-[1160px] items-center justify-between gap-3 rounded-full border py-2 pr-2 pl-4 transition-all duration-500 ease-brand',
            stuck || open ? 'border-line bg-ink/80 backdrop-blur-xl' : 'border-transparent',
          )}
        >
          <Link to="/" className="tap flex items-center gap-2.5" aria-label={`${profile.name}, home`}>
            <LogoMark size={22} />
            <b className="font-display text-[0.95rem] font-extrabold tracking-[-0.035em]">
              Bukoma<span className="hidden sm:inline"> Juma Moya</span>
            </b>
          </Link>

          <nav aria-label="Primary" className="hidden items-center rounded-full border border-line bg-surface/60 p-1 md:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={cx(
                  'relative rounded-full px-4 py-1.5 text-[0.86rem] transition-colors duration-300',
                  active === n.to ? 'text-bone' : 'text-muted hover:text-bone',
                )}
              >
                {active === n.to && (
                  <m.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-raised ring-1 ring-line-hi"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{n.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden h-9 cursor-pointer items-center gap-2 rounded-full px-3 text-muted transition-colors hover:text-bone sm:flex"
              aria-label="Search the site"
            >
              <Search />
              <kbd className="font-sans text-[0.76rem]">{shortcut}</kbd>
            </button>
            <Link
              to={contactItem.to}
              className="hidden items-center gap-1.5 rounded-full bg-pine px-4 py-2 text-[0.85rem] font-medium text-on-pine transition-colors duration-300 hover:bg-pine-hi md:inline-flex"
            >
              Get in touch
            </Link>
            <button
              type="button"
              className="relative size-10 cursor-pointer rounded-full bg-surface md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <i
                className={cx('absolute right-3 left-3 h-[1.5px] bg-bone transition-all duration-400 ease-brand', open ? 'top-[19px] rotate-45' : 'top-[15px]')}
              />
              <i
                className={cx(
                  'absolute right-3 left-3 h-[1.5px] bg-bone transition-all duration-400 ease-brand',
                  open ? 'top-[19px] -rotate-45' : 'top-[23px]',
                )}
              />
            </button>
          </div>
        </div>
      </m.header>

      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease }}
            className="fixed inset-0 z-55 flex flex-col justify-between bg-ink px-6 pt-28 pb-10 md:hidden"
          >
            <div className="flex flex-col">
              {[{ to: '/', label: 'Home', hint: '' }, ...nav, contactItem].map((n, i) => (
                <m.div key={n.to} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease }}>
                  <NavLink
                    to={n.to}
                    end={n.to === '/'}
                    className={({ isActive }) =>
                      cx(
                        'flex items-baseline gap-4 border-b border-line py-3.5 font-display text-[2.1rem] leading-none font-extrabold tracking-[-0.045em]',
                        isActive ? 'text-tint' : 'text-bone',
                      )
                    }
                  >
                    {n.label}
                  </NavLink>
                </m.div>
              ))}
            </div>
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-1 text-[0.78rem] text-muted">
              <a href={`mailto:${profile.email}`} className="block text-tint">
                {profile.email}
              </a>
              <p>{profile.location}</p>
            </m.div>
          </m.nav>
        )}
      </AnimatePresence>
    </>
  )
}
