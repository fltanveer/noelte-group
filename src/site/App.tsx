import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { SensorRig } from './SensorRig'
import { Book } from './Book'
import { Arrow, Pending, Photo, Reveal, useClock } from './parts'
import { CATEGORIES, ENGAGEMENTS, LINKEDIN, MARKETS, NAV, OFFICES, REGIONS, SERVICES, STAGES, TEAM, type Coverage } from './data'

const EASE = [0.22, 1, 0.36, 1] as const

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <ProofStrip />
        <Problem />
        <Stages />
        <Technologies />
        <Markets />
        <Results />
        <Team />
        <Doors />
        <Book />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}

/* ---------------------------------------------------------------- header */

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])
  return (
    <header className="hdr" data-scrolled={scrolled || undefined}>
      <div className="wrap hdr__in">
        <a href="#top" className="hdr__logo" aria-label="The Noelte Group, home">
          <img src="/brand/tng-logo.png" alt="The Noelte Group — Differentiated Insights & Results" width="149" height="50" />
        </a>
        <nav className="hdr__nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>{n.label}</a>
          ))}
        </nav>
        <a href="#book" className="btn btn--cta hdr__cta">
          <span className="hide-sm">Book a 30-min call</span>
          <span className="show-sm">Book a call</span>
        </a>
        <button className="hdr__menu" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'}>
          <span /><span />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mnav"
            className="mnav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
            ))}
            <a href={LINKEDIN} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>LinkedIn</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ---------------------------------------------------------------- hero */

function Hero() {
  const reduce = useReducedMotion()
  const item = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay: 0.08 * i } }
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <motion.p className="kicker kicker--dark" {...item(0)}>Growth for sensing &amp; actuation suppliers</motion.p>
          <motion.h1 id="hero-title" className="h1" {...item(1)}>
            Design-in wins,<br />not introductions.
          </motion.h1>
          <motion.p className="hero__lede" {...item(2)}>
            We run strategy, business development and sales for perception, position, interior-sensing, software and actuation suppliers selling into cars, trucks, trailers, robotics and smart infrastructure.<span className="hide-sm"> Boston headquarters, with operators in the United Kingdom, Germany and Korea.</span>
          </motion.p>
          <motion.div className="hero__ctas" {...item(3)}>
            <a href="#book" className="btn btn--cta btn--lg">Book a 30-min market call <Arrow /></a>
            <a href="#stages" className="btn btn--ghost-light btn--lg">See the four stages</a>
          </motion.div>
          <motion.p className="hero__fine" {...item(4)}>
            For OEM and fleet engineers: <a href="#book?specify">describe the problem</a> and we will point you at the right supplier.
          </motion.p>
        </div>
        <motion.div
          className="hero__rig"
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
        >
          <SensorRig />
        </motion.div>
      </div>
    </section>
  )
}

function ProofStrip() {
  return (
    <section className="proof" aria-label="About the firm">
      <div className="wrap proof__in">
        <ul className="proof__facts">
          <li><b>Founded 2022</b><span>Operators, not analysts</span></li>
          <li><b>Boston · UK · Germany · Korea</b><span>Four offices, three time zones of OEMs</span></li>
          <li><b>Five senior operators</b><span>Each with two decades in the industry</span></li>
        </ul>
        <div className="proof__logos" aria-label="Client and partner logos, pending clearance">
          {[0, 1, 2].map((i) => <span key={i} className="logo-slot">Logo</span>)}
          <Pending>Client logos to clear</Pending>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- problem */

const MILESTONES = [
  { at: 0, label: 'Concept', sub: 'Y−4' },
  { at: 25, label: 'Supplier shortlist', sub: 'Y−3' },
  { at: 52, label: 'RFQ', sub: 'Y−2' },
  { at: 70, label: 'Award', sub: 'Y−1.5' },
  { at: 100, label: 'Start of production', sub: 'Y0' },
]

function Problem() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const grow = (from: number, delay: number) =>
    reduce
      ? { style: { left: `${from}%`, right: 0 } }
      : { style: { left: `${from}%`, right: 0, transformOrigin: 'left' }, initial: { scaleX: 0 }, animate: inView ? { scaleX: 1 } : {}, transition: { duration: 1.4, ease: EASE, delay } }
  return (
    <section className="problem" aria-labelledby="problem-title">
      <div className="wrap problem__grid">
        <Reveal className="problem__copy">
          <h2 id="problem-title" className="h2">The best sensor in the room loses to the one the buyer already trusts.</h2>
          <p className="lede">
            OEM and fleet programmes are decided years before a purchase order exists. By the time an RFQ reaches your inbox, the specification has usually been written around someone else's part. Suppliers lose on access and timing, not on silicon.
          </p>
          <p className="problem__punch">We work the years in between.</p>
        </Reveal>
        <Reveal className="problem__media" delay={0.1}>
          <Photo name="problem-lab" alt="An automotive radar module on an engineering test bench" className="photo--lab" />
        </Reveal>
      </div>

      <div className="wrap">
        <div className="tl" ref={ref} role="img" aria-label="Typical vehicle programme timeline. Most suppliers arrive at the RFQ, two years before production. We start at concept, four years before.">
          <div className="tl__head">
            <span>Typical vehicle programme</span>
            <span className="tl__note">Illustrative timing</span>
          </div>
          <div className="tl__axis">
            {MILESTONES.map((m) => (
              <div key={m.label} className="tl__mile" style={{ left: `${m.at}%` }} data-edge={m.at === 100 ? 'end' : m.at === 0 ? 'start' : undefined}>
                <span className="tl__tick" />
                <b>{m.label}</b>
                <span>{m.sub}</span>
              </div>
            ))}
          </div>
          <div className="tl__tracks">
            <div className="tl__track">
              <span className="tl__name">Most suppliers</span>
              <div className="tl__lane">
                <span className="tl__spec" style={{ left: '25%' }}>Spec written around the incumbent</span>
                <motion.span className="tl__bar tl__bar--late" {...grow(52, 0.6)} />
              </div>
            </div>
            <div className="tl__track">
              <span className="tl__name">With Noelte</span>
              <div className="tl__lane">
                <motion.span className="tl__bar tl__bar--early" {...grow(0, 0.1)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- stages */

function Stages() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <section className="stages" id="stages" aria-labelledby="stages-title">
      <div className="wrap">
        <div className="sec-head">
          <p className="kicker">How an engagement runs</p>
          <h2 id="stages-title" className="h2">Four stages, from first read to start of production.</h2>
          <p className="lede">Each stage ends with something you can hold. You can stop after any of them.</p>
        </div>
        <div className="stages__rail" ref={ref}>
          <div className="stages__line" aria-hidden="true">
            <motion.span style={{ scaleX: fill }} />
          </div>
          <ol className="stages__list">
            {STAGES.map((s, i) => (
              <Reveal as="li" key={s.name} className="stage" delay={i * 0.08}>
                <span className="stage__dot" aria-hidden="true" />
                <span className="stage__num">0{i + 1}</span>
                <span className="stage__when">{s.when}</span>
                <h3 className="h3">{s.name}</h3>
                <p>{s.body}</p>
                <p className="stage__get"><span>You get</span>{s.get}</p>
              </Reveal>
            ))}
          </ol>
        </div>
        <div className="services">
          <p className="services__title">What sits inside those stages</p>
          <dl className="services__list">
            {SERVICES.map(([name, line]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{line}{name === 'Sales' && <Pending>Confirm commercial model</Pending>}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- technologies */

function Technologies() {
  const [first, ...rest] = CATEGORIES
  return (
    <section className="tech" id="technologies" aria-labelledby="tech-title">
      <div className="wrap">
        <div className="sec-head sec-head--split">
          <div>
            <p className="kicker kicker--dark">What we can sell for you</p>
            <h2 id="tech-title" className="h2">One portfolio, five layers of the stack.</h2>
          </div>
          <p className="lede">Our own cut of a messy market. If your part sits in one of these layers, we already know the people who buy it.</p>
        </div>
        <div className="bento">
          <Reveal className="tile tile--hero">
            <Photo name="perception-macro" alt="Close-up of a roof-mounted lidar unit" className="tile__photo" />
            <div className="tile__body">
              <p className="tile__name">{first.name}</p>
              <p className="tile__line">{first.line}</p>
              <p className="tile__items">{first.items.join(' · ')}</p>
            </div>
          </Reveal>
          {rest.map((c, i) => (
            <Reveal key={c.key} className="tile" delay={0.05 * (i + 1)}>
              <p className="tile__name">{c.name}</p>
              <p className="tile__line">{c.line}</p>
              <p className="tile__items">{c.items.join(' · ')}</p>
            </Reveal>
          ))}
          <Reveal className="tile tile--open" delay={0.3}>
            <p className="tile__name">Not on the list?</p>
            <p className="tile__line">We take on two or three new portfolio lines a year. <Pending>Confirm the number</Pending></p>
            <a href="#book" className="tile__link">Talk to us about yours <Arrow /></a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- markets */

const COVER_LABEL: Record<Coverage, string> = { active: 'Active', building: 'Building', request: 'On request' }

function Markets() {
  const [active, setActive] = useState(0)
  const m = MARKETS[active]
  return (
    <section className="markets" id="markets" aria-labelledby="markets-title">
      <div className="wrap">
        <div className="sec-head">
          <p className="kicker">Where we are active</p>
          <h2 id="markets-title" className="h2">Find your market. Read your row.</h2>
          <p className="lede">Where we already run programmes, where we are building, and where we take work on request. <Pending>Coverage to confirm</Pending></p>
        </div>
        <div className="markets__grid">
          <div className="markets__media" aria-hidden="true">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div key={m.key} className="markets__frame" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
                <Photo name={m.image} alt="" />
              </motion.div>
            </AnimatePresence>
            <div className="markets__cap">
              <b>{m.name}</b>
              <span>{m.detail}</span>
            </div>
          </div>
          <div className="board" role="table" aria-label="Market coverage by region">
            <div className="board__row board__row--head" role="row">
              <span role="columnheader">Market</span>
              {REGIONS.map((r) => <span key={r} role="columnheader" className="board__region">{r}</span>)}
            </div>
            {MARKETS.map((mk, i) => (
              <div
                key={mk.key}
                role="row"
                className="board__row"
                data-active={i === active || undefined}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
              >
                <span role="rowheader" className="board__market">
                  <Photo name={mk.image} alt="" className="board__thumb" />
                  <span><b>{mk.name}</b><small>{mk.detail}</small></span>
                </span>
                {mk.coverage.map((c, j) => (
                  <span key={j} role="cell" className="board__cell">
                    <span className={`cov cov--${c}`} title={`${REGIONS[j]}: ${COVER_LABEL[c]}`} />
                    <span className="sr-only">{COVER_LABEL[c]}</span>
                  </span>
                ))}
              </div>
            ))}
            <div className="board__legend">
              {(Object.keys(COVER_LABEL) as Coverage[]).map((c) => (
                <span key={c}><span className={`cov cov--${c}`} />{COVER_LABEL[c]}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- results */

function Results() {
  return (
    <section className="results" id="results" aria-labelledby="results-title">
      <div className="wrap">
        <div className="sec-head sec-head--split">
          <div>
            <p className="kicker">Engagements</p>
            <h2 id="results-title" className="h2">What it looks like when it works.</h2>
          </div>
          <p className="lede">Anonymised at our clients' request. Names on the call, under NDA. <Pending>Illustrative — replace with three real engagements</Pending></p>
        </div>
        <div className="cases">
          {ENGAGEMENTS.map((e, i) => (
            <Reveal key={e.title} className={`case ${i === 0 ? 'case--lead' : ''}`} delay={i * 0.08}>
              <p className="case__who">{e.who}</p>
              <h3 className="h3">{e.title}</h3>
              <p className="case__body">{e.body}</p>
              <div className="case__stat">
                <b>{e.stat}</b>
                <span>{e.statLabel}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- team */

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2)
}

function Team() {
  return (
    <section className="team" id="team" aria-labelledby="team-title">
      <div className="wrap">
        <div className="sec-head sec-head--split">
          <div>
            <p className="kicker">The people doing the work</p>
            <h2 id="team-title" className="h2">Five operators. The people you meet are the people who do it.</h2>
          </div>
          <p className="lede">No junior hand-off after the pitch. Every engagement is run by a partner who has sold into the account before.</p>
        </div>
        <ul className="people">
          {TEAM.map((p, i) => (
            <Reveal as="li" key={p.name} className="person" delay={i * 0.06}>
              <span className="person__avatar" data-placeholder={p.mono ? '' : undefined} aria-hidden="true">{p.mono ?? initials(p.name)}</span>
              <div>
                <p className="person__name">{p.name}</p>
                <p className="person__role">{p.role} · {p.place}</p>
                <p className="person__bio">{p.bio}</p>
                <Pending>{p.pending}</Pending>
              </div>
            </Reveal>
          ))}
        </ul>
        <ul className="offices" aria-label="Offices and local time">
          {OFFICES.map((o) => <Office key={o.city} {...o} />)}
        </ul>
      </div>
    </section>
  )
}

function Office({ city, note, tz }: { city: string; note: string; tz: string }) {
  const { time, open } = useClock(tz)
  return (
    <li className="office">
      <span className="office__city">{city}</span>
      <span className="office__note">{note}</span>
      <span className="office__time">
        <span className="office__state" data-open={open || undefined} />
        {time} · {open ? 'In office' : 'Out of hours'}
      </span>
    </li>
  )
}

/* ---------------------------------------------------------------- doors */

function Doors() {
  return (
    <section className="doors" aria-label="Choose your door">
      <Photo name="cta-highway" alt="" className="doors__bg" />
      <div className="wrap doors__grid">
        <Reveal className="door door--primary">
          <p className="door__tag">I supply technology</p>
          <p className="door__title">You have a product and no route into the accounts that matter.</p>
          <p className="door__body">Thirty minutes, and we will tell you straight whether we can open them.</p>
          <a href="#book?supply" className="btn btn--cta btn--lg">Book a 30-min market call <Arrow /></a>
        </Reveal>
        <Reveal className="door" delay={0.1}>
          <p className="door__tag">I am specifying a solution</p>
          <p className="door__title">You need a part that solves a specific problem.</p>
          <p className="door__body">Describe it and we will point you at the right supplier, whether or not we represent them.</p>
          <a href="#book?specify" className="btn btn--ghost-light btn--lg">Describe the problem</a>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- footer */

function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr__grid">
        <div>
          <p className="ftr__brand">The Noelte Group Inc.</p>
          <p className="ftr__tag">Differentiated Insights &amp; Results</p>
          <p className="ftr__addr">Boston, Massachusetts · United Kingdom · Germany · Korea</p>
          <p className="ftr__addr">
            <a href="mailto:hello@noeltegroup.com">hello@noeltegroup.com</a> · +1 617 000 0000 <Pending>Real details to supply</Pending>
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="ftr__head">Site</p>
          {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          <a href="#book">Book a call</a>
        </nav>
        <div>
          <p className="ftr__head">Follow</p>
          <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
          <p className="ftr__fine">Market reads, monthly. Published here first.</p>
        </div>
      </div>
      <div className="wrap ftr__base">
        <span>© 2026 The Noelte Group Inc.</span>
        <span>Proposed design · prototype</span>
      </div>
    </footer>
  )
}

/* ---------------------------------------------------------------- mobile CTA */

function MobileBar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('top')
    const book = document.getElementById('book')
    if (!hero || !book) return
    let heroOut = false
    let bookIn = false
    const sync = () => setShow(heroOut && !bookIn)
    const io1 = new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; sync() }, { threshold: 0 })
    const io2 = new IntersectionObserver(([e]) => { bookIn = e.isIntersecting; sync() }, { threshold: 0 })
    io1.observe(hero)
    io2.observe(book)
    return () => { io1.disconnect(); io2.disconnect() }
  }, [])
  return (
    <div className="mbar" data-show={show || undefined} aria-hidden={!show}>
      <span>Thirty minutes, a straight answer.</span>
      <a href="#book" className="btn btn--cta" tabIndex={show ? 0 : -1}>Book a call</a>
    </div>
  )
}
