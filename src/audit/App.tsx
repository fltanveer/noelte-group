import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { COPY_DECK, FINDINGS, FIRST_FIVE, FRAMEWORKS, LINKEDIN_ROWS, ROLLOUT, SCORES, SITEMAP, WORKS, type Sev } from './content'
import { AfterPair, CompareStage, EvidenceToday, FullScroll, LinkedInDemo, LIVE_PINS } from './Stages'

const EASE = [0.22, 1, 0.36, 1] as const
const PROPOSAL = '/proposal/'
/** Links to the live proposal are held back until it is sent to the client. Flip to true to show them. */
const SHOW_PROPOSAL_LINKS = false

/** `code`, **bold** and *em* inside content strings. */
export function rich(s: string): ReactNode {
  return s.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>
    if (part.startsWith('**')) return <b key={i}>{part.slice(2, -2)}</b>
    if (part.startsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
    return <Fragment key={i}>{part}</Fragment>
  })
}

const SECTIONS = [
  ['score', '01', 'Where it stands'],
  ['evidence', '02', 'What a buyer sees'],
  ['method', '03', 'Method & scope'],
  ['findings', '04', 'Findings'],
  ['linkedin', '05', 'The LinkedIn page'],
  ['works', '06', 'What works'],
  ['priority', '07', 'Do these five first'],
  ['strategy', '08', 'What the site has to do'],
  ['rebuild', '09', 'The proposed landing page'],
  ['copy', '10', 'Copy, written'],
  ['rollout', '11', 'Rollout'],
] as const

const SEV_LABEL: Record<Sev, string> = { critical: 'Critical', major: 'Major', minor: 'Minor' }

export default function App() {
  const active = useActiveSection()
  return (
    <>
      <a className="skip" href="#main">Skip to report</a>
      <TopBar />
      <div className="shell">
        <aside className="index" aria-label="Report sections">
          <p className="index__title">Contents</p>
          <ol>
            {SECTIONS.map(([id, n, label]) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
                  <span className="mono">{n}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
          {SHOW_PROPOSAL_LINKS && <a className="index__cta" href={PROPOSAL}>Open the proposed page <ArrowUpRight /></a>}
        </aside>
        <main id="main">
          <Hero />
          <Score />
          <Evidence />
          <Method />
          <Findings />
          <LinkedIn />
          <Works />
          <Priority />
          <Strategy />
          <Rebuild />
          <CopyDeck />
          <Rollout />
        </main>
      </div>
      <footer className="foot">
        <div>UX, content and conversion audit of www.noeltegroup.com and the LinkedIn company page.</div>
        <div className="mono">10 November 2026 · 18 findings · 3 critical</div>
      </footer>
    </>
  )
}

function useActiveSection() {
  const [active, setActive] = useState<string>('score')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  return active
}

function ArrowUpRight() {
  return <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function SevBadge({ sev }: { sev: Sev }) {
  return <span className={`sev sev--${sev}`}><i aria-hidden="true" />{SEV_LABEL[sev]}</span>
}

function Head({ n, title, sub }: { n: string; title: string; sub?: ReactNode }) {
  return (
    <header className="head">
      <p className="head__n mono">{n}</p>
      <h2>{title}</h2>
      {sub && <p className="head__sub">{sub}</p>}
    </header>
  )
}

/* ---------------------------------------------------------------- top bar */

function TopBar() {
  const counts = { critical: 3, major: 11, minor: 4 }
  return (
    <div className="top">
      <div className="top__in">
        <a href="#top" className="top__brand">The Noelte Group <span>/ audit &amp; rebuild</span></a>
        <div className="top__rail" aria-label="18 findings: 3 critical, 11 major, 4 minor" role="img">
          {(Object.keys(counts) as Sev[]).flatMap((s) => Array.from({ length: counts[s] }).map((_, i) => <i key={`${s}${i}`} className={`r-${s}`} />))}
        </div>
        {SHOW_PROPOSAL_LINKS && <a className="top__cta" href={PROPOSAL}>Proposed landing page <ArrowUpRight /></a>}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="hero" id="top">
      <p className="eyebrow mono">UX, content &amp; conversion audit · 10 November 2026</p>
      <h1>The site is a slide, not a business.</h1>
      <p className="lede">
        noeltegroup.com is a single Squarespace page carrying three keyword lists, a logo and one LinkedIn icon. It has no heading, no description, no contact method and no second page. The LinkedIn company page, the firm's only live distribution channel, links to a domain that does not resolve. This report sets out 18 findings, shows the evidence, and proposes a landing page with the copy written.
      </p>
      <div className="hero__actions">
        {SHOW_PROPOSAL_LINKS && <a className="btn btn--primary" href={PROPOSAL}>Open the proposed landing page <ArrowUpRight /></a>}
        <a className={SHOW_PROPOSAL_LINKS ? 'btn' : 'btn btn--primary'} href="#priority">Jump to the five fixes</a>
      </div>
      <dl className="meta">
        {[
          ['Property', 'www.noeltegroup.com'],
          ['Platform', 'Squarespace 7.1'],
          ['Pages in sitemap', '1'],
          ['Outbound links', '1 (LinkedIn)'],
          ['Contact methods', '0'],
          ['Findings', '3 / 11 / 4'],
        ].map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd className="tnum">{v}</dd></div>
        ))}
      </dl>
    </section>
  )
}

/* ---------------------------------------------------------------- score */

function Score() {
  const reduce = useReducedMotion()
  return (
    <section id="score" className="sec">
      <Head n="01" title="Where it stands" sub="Each axis is scored 0–100 against what a buyer in this category needs to make a shortlist decision. Scores are judgement, not a tool output; the evidence behind each one is in the findings." />
      <div className="score">
        <div className="score__big">
          <p className="score__num tnum">29<span>/100</span></p>
          <p className="score__note">Weighted mean of the six axes. A site that simply existed with a contact page and a positioning paragraph would score around 55.</p>
        </div>
        <div className="bars">
          {SCORES.map((s) => (
            <div key={s.label} className="bar">
              <div className="bar__lbl"><span>{s.label}</span><b className="mono">{s.value}</b></div>
              <div className="bar__track">
                <motion.i
                  className={s.value < 30 ? 'lo' : s.value < 60 ? 'mid' : 'hi'}
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1, ease: EASE }}
                  style={{ width: `${s.value}%` }}
                />
                <span className="bar__base" style={{ left: '55%' }} />
              </div>
            </div>
          ))}
          <div className="bar__scale mono"><span>0</span><span>55 baseline</span><span>100</span></div>
        </div>
      </div>
      <div className="kpis">
        <div><b className="tnum">1,766<small>px</small></b><span>Full mobile page height at 375 px — the whole company in two thumb scrolls.</span><em className="mono">Measured in-browser</em></div>
        <div><b className="tnum">0</b><span><code>&lt;h1&gt;</code> elements. The document has 0 h1, 0 h2 and 3 h3.</span><em className="mono">DOM query</em></div>
        <div><b className="tnum">36+</b><span>Comma-separated technical terms in the three lists, four ending in an ellipsis.</span><em className="mono">Page text</em></div>
        <div><b className="tnum">105</b><span>LinkedIn followers — against 5 listed employees and a 2022 founding.</span><em className="mono">Company page, logged out</em></div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- evidence */

function Evidence() {
  return (
    <section id="evidence" className="sec band">
      <Head n="02" title="What a buyer sees today" sub="Captured 10 November 2026 at 1440 px and on a 390 px phone. Each marker opens the finding it evidences." />
      <div className="stage-frame"><EvidenceToday /></div>
      <ol className="legend">
        {LIVE_PINS.map((p) => (
          <li key={p.n}>
            <span className="legend__n mono">{p.n}</span>
            <span>{rich(p.text)}</span>
            <span className="legend__ids">{p.ids.map((id) => <a key={id} href={`#${id}`} className="mono">{id}</a>)}</span>
          </li>
        ))}
      </ol>

      <div className="band__split">
        <div className="band__copy">
          <p className="band__kicker mono">F-01 · Critical</p>
          <h3>One click from LinkedIn, one browser error.</h3>
          <p>The company page's website field reads <code>www.thenoeltegroup.com</code>. That host has no DNS record. Every visitor who takes the firm's only outbound path lands here, with no way to learn the real address.</p>
          <a href="#F-01" className="band__link">Read F-01 →</a>
        </div>
        <div className="stage-frame stage-frame--li"><LinkedInDemo /></div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- method */

function Method() {
  const tot = FRAMEWORKS.reduce((a, r) => [a[0] + r[1], a[1] + r[2], a[2] + r[3]], [0, 0, 0])
  return (
    <section id="method" className="sec">
      <Head n="03" title="Method and scope" sub={<>Live inspection of the rendered page at 1024 px, 1440 px and 375 px, the served HTML, <code>robots.txt</code>, <code>sitemap.xml</code>, DNS resolution for both domain spellings, and the public (logged-out) LinkedIn company page. Graded against Nielsen's heuristics, WCAG 2.1 AA, web and responsive conventions, and conversion criteria for a B2B advisory with a long sales cycle. Contrast ratios are computed from the browser's resolved colour values.</>} />
      <div className="table">
        <table>
          <thead><tr><th>Framework</th><th className="n">Critical</th><th className="n">Major</th><th className="n">Minor</th><th className="n">Total</th></tr></thead>
          <tbody>
            {FRAMEWORKS.map(([name, c, m, n]) => (
              <tr key={name}><td>{name}</td><td className="n">{c}</td><td className="n">{m}</td><td className="n">{n}</td><td className="n">{c + m + n}</td></tr>
            ))}
          </tbody>
          <tfoot><tr><td>Total</td><td className="n">{tot[0]}</td><td className="n">{tot[1]}</td><td className="n">{tot[2]}</td><td className="n">{tot[0] + tot[1] + tot[2]}</td></tr></tfoot>
        </table>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- findings */

type Filter = 'all' | Sev

function Findings() {
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<Set<string>>(() => new Set(FINDINGS.filter((f) => f.sev === 'critical').map((f) => f.id)))
  const reduce = useReducedMotion()
  const list = useMemo(() => FINDINGS.filter((f) => filter === 'all' || f.sev === filter), [filter])
  const counts = { all: FINDINGS.length, critical: 3, major: 11, minor: 4 }

  // Arriving on #F-08 (from a screenshot marker) opens that finding
  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(location.hash.slice(1))
      if (!/^F-\d\d$/.test(id)) return
      setFilter('all')
      setOpen((s) => new Set(s).add(id))
      const jump = (smooth: boolean) => document.getElementById(id)?.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' })
      requestAnimationFrame(() => jump(true))
      // Stages above scale to fit once their images load; land again after they settle
      window.setTimeout(() => jump(false), 900)
    }
    go()
    window.addEventListener('hashchange', go)
    return () => window.removeEventListener('hashchange', go)
  }, [reduce])

  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const allOpen = list.every((f) => open.has(f.id))

  return (
    <section id="findings" className="sec">
      <Head n="04" title="Findings" sub="Critical first. Each finding names what was observed, who it costs, and the fix." />
      <div className="ftools">
        <div className="seg" role="radiogroup" aria-label="Filter by severity">
          {(['all', 'critical', 'major', 'minor'] as Filter[]).map((k) => (
            <button key={k} role="radio" aria-checked={filter === k} onClick={() => setFilter(k)} className="seg__btn">
              {filter === k && <motion.span layoutId="fseg" className="seg__pill" transition={{ type: 'spring', bounce: 0, duration: 0.35 }} />}
              <span className="seg__lbl">{k === 'all' ? 'All' : SEV_LABEL[k]}<span className="mono seg__count">{counts[k]}</span></span>
            </button>
          ))}
        </div>
        <button className="linkbtn" onClick={() => setOpen(allOpen ? new Set() : new Set(list.map((f) => f.id)))}>{allOpen ? 'Collapse all' : 'Expand all'}</button>
      </div>
      <motion.ol className="findings" layout={!reduce}>
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((f) => {
            const isOpen = open.has(f.id)
            return (
              <motion.li
                key={f.id}
                id={f.id}
                layout={!reduce}
                className={`find find--${f.sev}`}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <button className="find__head" aria-expanded={isOpen} aria-controls={`${f.id}-body`} onClick={() => toggle(f.id)}>
                  <span className="find__id mono">{f.id}</span>
                  <SevBadge sev={f.sev} />
                  <span className="find__title">{f.title}</span>
                  <span className="find__fw">{f.fw}</span>
                  <svg className="find__chev" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${f.id}-body`}
                      className="find__body"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                    >
                      <dl>
                        <div><dt>Observed</dt><dd>{rich(f.observed)}</dd></div>
                        <div><dt>Impact</dt><dd>{rich(f.impact)}</dd></div>
                        <div className="find__fix"><dt>Fix</dt><dd>{rich(f.fix)}</dd></div>
                      </dl>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ol>
    </section>
  )
}

/* ---------------------------------------------------------------- LinkedIn */

function LinkedIn() {
  return (
    <section id="linkedin" className="sec">
      <Head n="05" title="The LinkedIn page" sub="Reviewed logged out, which is how a prospect sees it first. The page is better written than the website, and is currently doing all the work." />
      <div className="table">
        <table>
          <thead><tr><th>Field</th><th>What it says now</th><th>Assessment</th></tr></thead>
          <tbody>
            {LINKEDIN_ROWS.map(([a, b, c]) => (
              <tr key={a}><td><b>{a}</b></td><td>{rich(b)}</td><td>{rich(c)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note"><b>One positioning line, used everywhere.</b> The logo lockup, the LinkedIn tagline and the site hero currently say three different things. Settle on one sentence, put it in the logo tagline, the LinkedIn tagline, the <code>&lt;title&gt;</code>, the meta description and the H1, and let every other sentence support it.</p>
    </section>
  )
}

/* ---------------------------------------------------------------- works */

function Works() {
  return (
    <section id="works" className="sec">
      <Head n="06" title="What works, and should be kept" sub="The current page has real assets inside it. The rebuild keeps all of them." />
      <ul className="works">
        {WORKS.map(([a, b]) => (
          <li key={a}><b>{rich(a)}</b> {rich(b)}</li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------------------------------------------------- priority */

function Priority() {
  return (
    <section id="priority" className="sec">
      <Head n="07" title="Do these five first" sub="Ordered by business impact per hour spent, not by severity label." />
      <ol className="steps">
        {FIRST_FIVE.map(([t, d, id], i) => (
          <li key={t}>
            <span className="steps__n mono">0{i + 1}</span>
            <div>
              <p className="steps__t">{t}</p>
              <p className="steps__d">{rich(d)}</p>
            </div>
            <a href={`#${id}`} className="steps__ref mono">{id}</a>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ---------------------------------------------------------------- strategy */

function Strategy() {
  return (
    <section id="strategy" className="sec">
      <Head n="08" title="What the new site has to do" sub="A site converts when it is built around one decision taken by one person. Everything below follows from naming that person and that decision." />
      <div className="who">
        <div className="who__main">
          <p className="who__k mono">Who converts</p>
          <p className="who__v">A VP of Sales, BD or Product at a sensor, software or actuator supplier — often European or Korean — who has a working product and no route into North American OEM, Tier-1 and fleet programmes.</p>
          <p className="who__k mono">The one decision</p>
          <p className="who__q">“Is it worth thirty minutes to find out whether these people can get me into the accounts I can't reach?”</p>
        </div>
        <div className="who__side">
          <p className="who__k mono">The second audience</p>
          <p>An OEM, fleet or integrator engineer looking for a part that solves a specific problem. They convert differently and need their own door.</p>
        </div>
      </div>
      <div className="actions3">
        <div><span className="mono">Primary</span><b>Book a 30-minute market call</b><p>One action, repeated in four places, styled identically every time.</p></div>
        <div><span className="mono">Secondary</span><b>The market-entry checklist</b><p>An email capture for people who are nine months early.</p></div>
        <div><span className="mono">Tertiary</span><b>Follow on LinkedIn</b><p>From a link that works both directions.</p></div>
      </div>
      <p className="note"><b>Why a call and not “Contact us”.</b> This category has an eighteen-month cycle and a high deal value. A named, time-boxed, obviously-useful first step converts several times better than a generic contact form, because it tells the buyer exactly what they are agreeing to. “Contact us” asks them to invent the next step themselves.</p>

      <h3 className="sub">Site structure, after the landing page</h3>
      <p className="head__sub">The landing page ships first. These pages follow in weeks three to six, each with one job and one next step.</p>
      <div className="sitemap">
        {SITEMAP.map(([name, d, job, hub]) => (
          <div key={name} className={`sm ${hub ? 'sm--hub' : ''}`}>
            <b>{name}</b>
            <p>{d}</p>
            <span className="mono">{job}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- rebuild */

const ANNOTATIONS = [
  ['The action is in the header and never moves.', 'Green fill, deep-navy label — 7.65:1, on-brand, and the only filled element on the page wearing that colour.'],
  ['A claim a competitor cannot copy.', '“Design-in” is the word this industry uses for being written into the platform. Cover the logo and the sentence still identifies the company.'],
  ['The taxonomy becomes the hero.', 'An isometric tractor-trailer carries the five categories. Each tab lights its layer on the truck — radar and lidar, GNSS fixes, the cabin under a lifted roof, the fusion chip, the actuators — so a supplier finds their part before reading a word.'],
  ['Proof sits under the claim,', 'at the first point of hesitation: founding year, four offices, team size, and a client strip marked as pending until names are cleared.'],
  ['The problem is shown on a timeline,', 'not asserted: most suppliers arrive at RFQ; the firm starts at concept, years earlier.'],
  ['Numbering only where it is true.', 'The four stages are a real sequence with durations and a deliverable each; nothing else on the page is numbered.'],
  ['The coverage board replaces the keyword dump.', 'Same markets, now carrying information: active, building, on request, by region. Hover a row and its photograph takes the panel.'],
  ['Two doors, then the form.', 'Suppliers and specifiers want opposite things; the form switches its fields for each, validates as you go, and ends on real time slots.'],
  ['Everything unverified is labelled.', 'Amber pending tags mark every claim the firm still has to supply or clear, so nothing invented can ship by accident.'],
]

function Rebuild() {
  return (
    <section id="rebuild" className="sec band">
      <Head n="09" title="The proposed landing page" sub={<>Built, not drawn: a working page in the firm's own navy and green, with photography generated for it. Drag the divider to compare the first screen.{SHOW_PROPOSAL_LINKS && <> <a href={PROPOSAL} className="band__link">Open it full size →</a></>}</>} />
      <div className="stage-frame"><CompareStage /></div>
      <div className="band__split band__split--rev">
        <div className="stage-frame"><AfterPair /></div>
      </div>
      <ol className="annot">
        {ANNOTATIONS.map(([a, b], i) => (
          <li key={a}><span className="mono">{i + 1}</span><p><b>{a}</b> {b}</p></li>
        ))}
      </ol>
      <h3 className="band__h3">The whole page, top to bottom</h3>
      <div className="stage-frame"><FullScroll /></div>
      {SHOW_PROPOSAL_LINKS && (
        <div className="band__cta">
          <a className="btn btn--green" href={PROPOSAL}>Open the proposed landing page <ArrowUpRight /></a>
          <span>Desktop and phone. The booking form validates and walks through time selection; nothing is sent.</span>
        </div>
      )}
    </section>
  )
}

/* ---------------------------------------------------------------- copy */

function CopyDeck() {
  return (
    <section id="copy" className="sec">
      <Head n="10" title="Landing-page copy, written" sub="Every string for the page, ready to paste. Anything the firm has to confirm or supply is flagged. Nothing here invents a client name, a metric or a quotation." />
      <div className="deck">
        {COPY_DECK.map(([slot, text, flag]) => (
          <div key={slot} className="deck__row">
            <span className="deck__slot mono">{slot}</span>
            <p>{rich(text)}{flag && <span className="flag">{flag}</span>}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- rollout */

function Rollout() {
  return (
    <section id="rollout" className="sec">
      <Head n="11" title="Rollout" sub="The first block is worth doing before anything is designed. It takes about a day and removes the two defects that cost real enquiries." />
      <ol className="steps steps--rollout">
        {ROLLOUT.map(([t, d], i) => (
          <li key={t}>
            <span className="steps__n mono">0{i + 1}</span>
            <div><p className="steps__t">{t}</p><p className="steps__d">{d}</p></div>
          </li>
        ))}
      </ol>
      <p className="note"><b>What this report did not check.</b> Page-speed and Core Web Vitals were not measured. Analytics, form handling and any password-protected area were not inspected. The LinkedIn page was reviewed logged out, so employee count, banner, Services tab and post history reflect only the public view. Client names, metrics and team biographies are marked as placeholders throughout and must be supplied by the firm — none of them are invented here. The landing-page photography is AI-generated (Gemini) for the proposal and should be replaced or approved before launch.</p>
    </section>
  )
}
