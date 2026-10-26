import { useState, type FormEvent } from 'react'
import { pages } from '@/data/pages'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, m } from 'motion/react'
import { profile } from '@/data/profile'
import { send } from '@/lib/send'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { LocalTime } from '@/components/LocalTime'
import { Avatar } from '@/components/Avatar'
import { ease } from '@/components/motion'
import { ArrowUpRight, Check, Copy } from '@/components/icons'
import { Container, cx } from '@/components/ui'

const topics = [
  { id: 'role', label: 'A role' },
  { id: 'build', label: 'A build or architecture engagement' },
  { id: 'audit', label: 'An audit or second opinion' },
  { id: 'speaking', label: 'A speaking invitation' },
  { id: 'other', label: 'Something else' },
]

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error'

const field =
  'w-full rounded-[10px] border border-line bg-surface px-4 py-3.5 text-[0.98rem] text-bone transition-colors duration-300 placeholder:text-muted/60 focus:border-tint focus:outline-none aria-[invalid=true]:border-[#c97a6a]'

export default function Contact() {
  const [params] = useSearchParams()
  const [topic, setTopic] = useState(topics.find((t) => t.id === params.get('topic'))?.id ?? 'role')
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const next: Record<string, string> = {}
    if (!name) next.name = 'Add your name so I know who to reply to.'
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter an email address I can reply to.'
    if (message.length < 10) next.message = 'Add a sentence or two about what you need.'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      const label = topics.find((t) => t.id === topic)!.label
      const result = await send(`${label} from ${name}`, { Name: name, Email: email, Topic: label, Message: message })
      setStatus(result)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Seo title="Contact" description="Get in touch about a role, a build, an architecture engagement or a speaking invitation." />
      <PageHero title={pages.contact.title} sub={pages.contact.sub} />

      <Container className="grid gap-16 border-t border-line pt-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          {profile.portrait && (
            <div className="mb-10 flex items-center gap-4">
              <Avatar className="size-16 border border-line" />
              <div>
                <p className="font-display text-[1.1rem] font-semibold tracking-[-0.02em]">{profile.name}</p>
                <p className="text-[0.86rem] text-muted">Replies within two working days</p>
              </div>
            </div>
          )}
          <p className="text-[0.84rem] text-muted">Email</p>
          <div className="mt-1.5 flex items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="tap font-display text-[1.2rem] font-semibold tracking-[-0.02em] break-all transition-colors hover:text-tint"
            >
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copy}
              className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-muted transition-colors hover:border-tint hover:text-tint"
              aria-label="Copy email address"
            >
              {copied ? <Check /> : <Copy />}
            </button>
          </div>
          <p aria-live="polite" className="mt-1 h-5 text-[0.8rem] text-tint">
            {copied && 'Copied to clipboard'}
          </p>

          <dl className="mt-8 space-y-6 text-[0.95rem]">
            <div>
              <dt className="text-[0.84rem] text-muted">Phone</dt>
              <dd className="mt-1">
                <a href={profile.phoneHref} className="tap tnum transition-colors hover:text-tint">
                  {profile.phone}
                </a>
              </dd>
            </div>
            {profile.socials.map((s) => (
              <div key={s.href}>
                <dt className="text-[0.84rem] text-muted">{s.label}</dt>
                <dd className="mt-1">
                  <a href={s.href} target="_blank" rel="noreferrer" className="tap inline-flex items-center gap-1.5 transition-colors hover:text-tint">
                    {s.handle} <ArrowUpRight width={13} height={13} />
                  </a>
                </dd>
              </div>
            ))}
            <div>
              <dt className="text-[0.84rem] text-muted">Local time in Kampala</dt>
              <dd className="tnum mt-1">
                <LocalTime />
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            {status === 'sent' || status === 'mailto' ? (
              <m.div
                key="done"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease }}
                className="rounded-[10px] border border-pine bg-surface p-8"
              >
                <span className="grid size-10 place-items-center rounded-full bg-pine text-on-pine">
                  <Check />
                </span>
                <h2 className="mt-5 text-[1.6rem] font-extrabold tracking-[-0.04em]">
                  {status === 'sent' ? 'Message sent.' : 'Your email app should now be open.'}
                </h2>
                <p className="mt-2 max-w-[48ch] text-muted">
                  {status === 'sent'
                    ? "Thanks. I'll reply within two working days."
                    : `Your message is drafted there. Press send to deliver it. If nothing opened, write to ${profile.email} directly.`}
                </p>
                <button type="button" onClick={() => setStatus('idle')} className="mt-6 cursor-pointer text-[0.9rem] text-tint">
                  Write another message
                </button>
              </m.div>
            ) : (
              <m.form key="form" exit={{ opacity: 0 }} onSubmit={onSubmit} noValidate className="grid gap-7">
                <fieldset>
                  <legend className="mb-3 text-[0.84rem] text-muted">What&apos;s this about?</legend>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <label
                        key={t.id}
                        className={cx(
                          'cursor-pointer rounded-full border px-4 py-2 text-[0.86rem] transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-tint',
                          topic === t.id ? 'border-pine bg-pine text-on-pine' : 'border-line text-muted hover:border-line-hi hover:text-bone',
                        )}
                      >
                        <input type="radio" name="topic" value={t.id} checked={topic === t.id} onChange={() => setTopic(t.id)} className="sr-only" />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-7 sm:grid-cols-2">
                  {[
                    { id: 'name', label: 'Your name', type: 'text', auto: 'name' },
                    { id: 'email', label: 'Email', type: 'email', auto: 'email' },
                  ].map((f) => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="mb-2 block text-[0.84rem] text-muted">
                        {f.label}
                      </label>
                      <input
                        id={f.id}
                        name={f.id}
                        type={f.type}
                        autoComplete={f.auto}
                        aria-invalid={!!errors[f.id]}
                        aria-describedby={`${f.id}-err`}
                        className={field}
                      />
                      <p id={`${f.id}-err`} className="mt-1.5 text-[0.8rem] text-[#e09a8a]">
                        {errors[f.id]}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-[0.84rem] text-muted">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="What are you building, and what's in your way?"
                    aria-invalid={!!errors.message}
                    aria-describedby="message-err"
                    className={cx(field, 'resize-y')}
                  />
                  <p id="message-err" className="mt-1.5 text-[0.8rem] text-[#e09a8a]">
                    {errors.message}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-pine px-6 py-3.5 font-medium text-on-pine transition-colors hover:bg-pine-hi disabled:cursor-wait disabled:opacity-70"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                  </button>
                  {status === 'error' && (
                    <p role="alert" className="text-[0.88rem] text-[#e09a8a]">
                      The message didn&apos;t send. Try again, or email {profile.email} directly.
                    </p>
                  )}
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </>
  )
}
