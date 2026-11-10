import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CATEGORIES, MARKETS } from './data'
import { Arrow } from './parts'

type Mode = 'supply' | 'specify'
type Step = 'form' | 'times' | 'done'
type Values = { email: string; company: string; role: string; make: string; market: string; notes: string }

const FREE_MAIL = /@(gmail|googlemail|yahoo|hotmail|outlook|live|icloud|aol|proton|protonmail|gmx|mail)\./i

function validate(v: Values, mode: Mode) {
  const e: Partial<Record<keyof Values, string>> = {}
  if (!v.email.trim()) e.email = 'Add your work email so we can send the invite.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) e.email = 'That address is missing part of its domain, like name@company.com.'
  else if (FREE_MAIL.test(v.email)) e.email = 'Use your company address. It tells us who we are preparing for.'
  if (!v.company.trim()) e.company = 'Add the company name.'
  if (!v.role.trim()) e.role = 'Add your role, for example VP Sales.'
  if (mode === 'supply' && !v.make) e.make = 'Pick the closest category.'
  if (!v.market) e.market = 'Pick the market you want.'
  if (mode === 'specify' && v.notes.trim().length < 12) e.notes = 'A sentence on the problem helps us bring the right supplier.'
  return e
}

/** Next three business days in Boston, four slots each, shown in the visitor's own time. */
function useSlots() {
  return useMemo(() => {
    const days: { label: string; slots: { iso: string; time: string }[] }[] = []
    const d = new Date()
    while (days.length < 3) {
      d.setDate(d.getDate() + 1)
      const wd = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(d)
      if (wd === 'Sat' || wd === 'Sun') continue
      const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(d)
      const slots = ['09:00', '10:30', '13:00', '15:30'].map((t) => {
        // Boston is UTC-5 in winter, UTC-4 in summer; take the offset from the date itself
        const probe = new Date(`${ymd}T12:00:00Z`)
        const bostonNoon = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/New_York' }).format(probe))
        const offset = 12 - bostonNoon
        const [h, m] = t.split(':').map(Number)
        const at = new Date(Date.UTC(+ymd.slice(0, 4), +ymd.slice(5, 7) - 1, +ymd.slice(8, 10), h + offset, m))
        return { iso: at.toISOString(), time: new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(at) }
      })
      days.push({ label: new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(`${ymd}T12:00:00`)), slots })
    }
    return days
  }, [])
}

export function Book() {
  const [mode, setMode] = useState<Mode>('supply')
  const [step, setStep] = useState<Step>('form')
  const [v, setV] = useState<Values>({ email: '', company: '', role: '', make: '', market: '', notes: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [slot, setSlot] = useState<string | null>(null)
  const reduce = useReducedMotion()
  const slots = useSlots()
  const cardRef = useRef<HTMLDivElement>(null)
  const errors = validate(v, mode)
  const show = (k: keyof Values) => (submitted || touched[k]) && errors[k]

  // "Describe the problem" links elsewhere on the page arrive with #book?specify
  useEffect(() => {
    const sync = () => {
      if (location.hash.includes('specify')) setMode('specify')
      if (location.hash.includes('supply')) setMode('supply')
      if (location.hash.startsWith('#book?')) document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const set = (k: keyof Values) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }))
  const blur = (k: keyof Values) => () => setTouched((t) => ({ ...t, [k]: true }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const first = Object.keys(errors)[0] as keyof Values | undefined
    if (first) {
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    setStep('times')
    cardRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
  }

  const field = (k: keyof Values, label: string, input: JSX.Element, optional = false) => (
    <div className="field" data-error={show(k) ? '' : undefined}>
      <label htmlFor={`f-${k}`}>
        {label}
        {optional && <span className="field__opt"> (optional)</span>}
      </label>
      {input}
      <span className="field__msg" id={`f-${k}-msg`} role={show(k) ? 'alert' : undefined}>
        {show(k) || ' '}
      </span>
    </div>
  )

  const aria = (k: keyof Values) => ({ id: `f-${k}`, 'aria-invalid': !!show(k), 'aria-describedby': `f-${k}-msg`, onBlur: blur(k) })
  const fade = reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } }

  return (
    <section className="book" id="book" aria-labelledby="book-title">
      <div className="wrap book__grid">
        <div className="book__copy">
          <p className="kicker">Book a call</p>
          <h2 id="book-title" className="h2">Thirty minutes, and a straight answer.</h2>
          <p className="lede">
            Tell us what you sell and which market you want. On the call we will say whether we can open those accounts, roughly how long it takes, and what it costs. If we are the wrong partner we will say so and name someone better.
          </p>
          <ol className="book__steps">
            <li><span><b>You describe</b> the part and the target market.</span></li>
            <li><span><b>We give you our read</b> on timing and incumbents.</span></li>
            <li><span><b>We tell you</b> whether we can open those doors.</span></li>
            <li><span><b>If yes,</b> you get a written market-read proposal.</span></li>
          </ol>
          <div className="magnet">
            <div>
              <p className="magnet__title">Not ready to talk?</p>
              <p className="magnet__body">The North America market-entry checklist for sensor suppliers. Fourteen questions that decide whether a programme is worth chasing.</p>
            </div>
            <Magnet />
          </div>
        </div>

        <div className="book__card" ref={cardRef}>
          <AnimatePresence mode="wait" initial={false}>
            {step === 'form' && (
              <motion.form key="form" className="form" onSubmit={submit} noValidate {...fade}>
                <div className="seg" role="radiogroup" aria-label="I am" data-mode={mode}>
                  <span className="seg__pill" aria-hidden="true" />
                  {(['supply', 'specify'] as Mode[]).map((m) => (
                    <button key={m} type="button" role="radio" aria-checked={mode === m} className="seg__btn" onClick={() => setMode(m)}>
                      {m === 'supply' ? 'I supply technology' : 'I am specifying a solution'}
                    </button>
                  ))}
                </div>

                {field('email', 'Work email', <input type="email" autoComplete="email" placeholder="you@company.com" value={v.email} onChange={set('email')} {...aria('email')} />)}
                <div className="form__row">
                  {field('company', 'Company', <input autoComplete="organization" value={v.company} onChange={set('company')} {...aria('company')} />)}
                  {field('role', 'Your role', <input autoComplete="organization-title" placeholder="VP Sales, BD or Product" value={v.role} onChange={set('role')} {...aria('role')} />)}
                </div>
                <div className="form__row">
                  {mode === 'supply'
                    ? field('make', 'What you make', (
                        <select value={v.make} onChange={set('make')} {...aria('make')}>
                          <option value="">Choose a category</option>
                          {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
                          <option value="other">Something else</option>
                        </select>
                      ))
                    : field('make', 'Category, if known', (
                        <select value={v.make} onChange={set('make')} {...aria('make')}>
                          <option value="">Not sure yet</option>
                          {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
                        </select>
                      ), true)}
                  {field('market', mode === 'supply' ? 'Market you want' : 'Where it will run', (
                    <select value={v.market} onChange={set('market')} {...aria('market')}>
                      <option value="">Choose a market</option>
                      {MARKETS.map((m) => <option key={m.key} value={m.key}>{m.name}</option>)}
                    </select>
                  ))}
                </div>
                {mode === 'supply'
                  ? field('notes', 'Anything we should read first', <textarea rows={3} placeholder="Datasheet link, programme timing, incumbent" value={v.notes} onChange={set('notes')} {...aria('notes')} />, true)
                  : field('notes', 'The problem you are solving', <textarea rows={3} placeholder="What has to be detected, measured or moved, and under what conditions" value={v.notes} onChange={set('notes')} {...aria('notes')} />)}

                <button className="btn btn--cta btn--block" type="submit">
                  {mode === 'supply' ? 'Show me available times' : 'Send the problem'}
                  <Arrow />
                </button>
                <p className="form__fine">We reply within one business day. Nothing you send here is shared with a third party.</p>
              </motion.form>
            )}

            {step === 'times' && (
              <motion.div key="times" className="times" {...fade}>
                <button className="link-back" type="button" onClick={() => setStep('form')}>← Edit details</button>
                <p className="times__title">{mode === 'supply' ? 'Pick a time for your market call' : 'Pick a time to walk us through it'}</p>
                <p className="times__sub">30 minutes on video. Times are shown in your time zone.</p>
                <div className="times__days">
                  {slots.map((d) => (
                    <div key={d.label} className="times__day">
                      <p>{d.label}</p>
                      <div className="times__slots">
                        {d.slots.map((s) => (
                          <button key={s.iso} type="button" className="slot" aria-pressed={slot === s.iso} onClick={() => setSlot(s.iso)}>
                            {s.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn--cta btn--block" type="button" disabled={!slot} onClick={() => setStep('done')}>
                  Confirm this time <Arrow />
                </button>
              </motion.div>
            )}

            {step === 'done' && (
              <motion.div key="done" className="done" {...fade}>
                <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" className="done__mark">
                  <circle cx="22" cy="22" r="21" fill="#56D110" />
                  <motion.path d="M13 22.5l6 6 12-13" fill="none" stroke="#072B46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.15 }} />
                </svg>
                <p className="times__title">You are booked in.</p>
                <p className="times__sub">
                  {slot && new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(slot))}. The invite goes to <b>{v.email}</b>, with a short note on what we will prepare.
                </p>
                <p className="proto-note">Prototype: this form does not send anything yet. Wire it to the firm's scheduler before launch.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Magnet() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  return sent ? (
    <p className="magnet__done" role="status">On its way to {email}.</p>
  ) : (
    <form
      className="magnet__form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setErr('Add a full email address.')
        setSent(true)
      }}
    >
      <label htmlFor="magnet-email" className="sr-only">Work email</label>
      <input id="magnet-email" type="email" placeholder="Work email" value={email} onChange={(e) => { setEmail(e.target.value); setErr('') }} aria-invalid={!!err} aria-describedby="magnet-msg" />
      <button type="submit" className="btn btn--ghost-dark">Get the checklist</button>
      <span id="magnet-msg" className="magnet__msg" role={err ? 'alert' : undefined}>{err}</span>
    </form>
  )
}
