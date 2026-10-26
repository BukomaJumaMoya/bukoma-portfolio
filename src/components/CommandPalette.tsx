import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { contactItem, nav } from '@/data/nav'
import { projects } from '@/data/projects'
import { profile } from '@/data/profile'
import { ArrowRight, Search } from './icons'
import { cx } from './ui'

type Item = { group: string; label: string; hint: string; run: () => void }

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  const items = useMemo<Item[]>(() => {
    const go = (to: string) => () => navigate(to)
    return [
      { group: 'Pages', label: 'Home', hint: 'Start here', run: go('/') },
      ...[...nav, contactItem].map((n) => ({ group: 'Pages', label: n.label, hint: n.hint, run: go(n.to) })),
      ...projects.map((p) => ({ group: 'Projects', label: p.title, hint: p.org, run: go(`/work/${p.slug}`) })),
      { group: 'Actions', label: 'Copy email address', hint: profile.email, run: () => navigator.clipboard?.writeText(profile.email) },
      { group: 'Actions', label: 'Send an email', hint: 'Opens your mail app', run: () => (window.location.href = `mailto:${profile.email}`) },
      ...(profile.cv ? [{ group: 'Actions', label: 'Download CV', hint: 'PDF', run: () => window.open(profile.cv!, '_blank') }] : []),
      ...profile.socials.map((s) => ({ group: 'Actions', label: `Open ${s.label}`, hint: s.handle, run: () => window.open(s.href, '_blank', 'noreferrer') })),
    ]
  }, [navigate])

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    return t ? items.filter((i) => `${i.label} ${i.hint} ${i.group}`.toLowerCase().includes(t)) : items
  }, [q, items])

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      setQ('')
      setActive(0)
      d.showModal()
      requestAnimationFrame(() => input.current?.focus())
    } else if (!open && d.open) d.close()
  }, [open])

  useEffect(() => setActive(0), [q])

  const choose = (i: Item | undefined) => {
    if (!i) return
    onClose()
    i.run()
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[active])
    }
  }

  useEffect(() => {
    document.getElementById(`cmd-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  let lastGroup = ''
  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      aria-label="Search the site"
      className="m-auto mt-[12vh] w-[min(620px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-line-hi bg-ink p-0 text-bone shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="text-muted" />
        <input
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Jump to a page, project or action…"
          className="w-full bg-transparent py-4 text-[0.95rem] outline-none placeholder:text-muted"
          role="combobox"
          aria-expanded="true"
          aria-controls="cmd-list"
          aria-activedescendant={results[active] ? `cmd-${active}` : undefined}
        />
        <kbd className="rounded border border-line px-1.5 py-0.5 text-[0.65rem] text-muted">esc</kbd>
      </div>
      <ul id="cmd-list" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
        {results.length === 0 && <li className="px-3 py-8 text-center text-[0.9rem] text-muted">Nothing matches “{q}”.</li>}
        {results.map((r, i) => {
          const showGroup = r.group !== lastGroup
          lastGroup = r.group
          return (
            <li key={`${r.group}-${r.label}`} role="presentation">
              {showGroup && <p className="px-3 pt-3 pb-1.5 text-[0.68rem] text-muted">{r.group}</p>}
              <div
                id={`cmd-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => choose(r)}
                className={cx('flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5', i === active && 'bg-surface')}
              >
                <span className="text-[0.92rem]">{r.label}</span>
                <span className="flex items-center gap-2 truncate text-[0.78rem] text-muted">
                  <span className="truncate">{r.hint}</span>
                  <ArrowRight className={cx('shrink-0 transition-opacity', i === active ? 'text-tint opacity-100' : 'opacity-0')} />
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </dialog>
  )
}
