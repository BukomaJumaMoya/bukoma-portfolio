import { Link } from 'react-router-dom'
import { contactItem, nav } from '@/data/nav'
import { profile } from '@/data/profile'
import { pages } from '@/data/pages'
import { LocalTime } from './LocalTime'
import { LogoMark } from './Logo'
import { Avatar } from './Avatar'
import { Container, TextLink } from './ui'

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <Container className="grid gap-14 pt-16 pb-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <p className="max-w-[18ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1] font-extrabold tracking-[-0.05em]">{pages.footer.line}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-pine py-1.5 pr-6 pl-1.5 font-medium text-on-pine transition-[background-color,scale] hover:bg-pine-hi active:scale-[0.97]"
            >
              <Avatar className="size-10" />
              Start a conversation
            </Link>
            <TextLink href={`mailto:${profile.email}`}>{profile.email}</TextLink>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-[0.92rem] md:col-span-5">
          <nav aria-label="Footer" className="flex flex-col gap-2.5">
            {[{ to: '/', label: 'Home' }, ...nav, contactItem].map((n) => (
              <Link key={n.to} to={n.to} className="w-fit text-muted transition-colors hover:text-bone">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2.5">
            {profile.socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="w-fit text-muted transition-colors hover:text-bone">
                {s.label}
              </a>
            ))}
            {profile.cv && (
              <a href={profile.cv} download className="w-fit text-muted transition-colors hover:text-bone">
                CV
              </a>
            )}
            <a href={profile.phoneHref} className="w-fit text-muted transition-colors hover:text-bone">
              Phone
            </a>
          </div>
        </div>
      </Container>

      <Container className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-[0.8rem] text-muted">
        <span className="inline-flex items-center gap-2.5">
          <LogoMark size={14} />
          {profile.name}, {new Date().getFullYear()}
        </span>
        <span className="tnum">
          Kampala, <LocalTime />
        </span>
      </Container>
    </footer>
  )
}
