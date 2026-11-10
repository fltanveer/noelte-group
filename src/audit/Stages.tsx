import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion, animate } from 'motion/react'
import { Badge, Button, Card, Phone, Spinner, Stage, Window, type Act } from '../kit'
import '../kit/stageshow.css'
import './stages.css'

/* ------------------------------------------------------------------ pins
   Numbered markers placed on the real screenshot, in % of the image. Each one
   links to the finding it evidences. */

export const LIVE_PINS = [
  { n: 1, x: 22.6, y: 4.2, ids: ['F-08', 'F-12'], text: 'The logo is the only image: `alt=""`, and its green tagline sits at 2.0:1 on white.' },
  { n: 2, x: 33.6, y: 4.2, ids: ['F-07', 'F-11'], text: 'The only positioning line is a bold-italic `div`, not an `h1`.' },
  { n: 3, x: 30.4, y: 21, ids: ['F-16'], text: 'At 1440 px the Markets subhead wraps into “Cars, Trucks”.' },
  { n: 4, x: 78.7, y: 58.6, ids: ['F-10', 'F-18'], text: '36+ comma-separated terms in three parallel lists; four end in an ellipsis.' },
  { n: 5, x: 50, y: 82, ids: ['F-16'], text: 'A 200 px band of empty brand green between the cards and the footer.' },
  { n: 6, x: 62.4, y: 93.4, ids: ['F-02', 'F-14'], text: 'The only action on the page: a LinkedIn icon, last thing on it.' },
]

const MOBILE_PINS = [
  { n: 1, x: 87, y: 3.9 },
  { n: 2, x: 92, y: 11.6 },
  { n: 4, x: 84, y: 25.6 },
]

function Pins({ pins }: { pins: { n: number; x: number; y: number; ids?: string[] }[] }) {
  return (
    <>
      {pins.map((p) => (
        <a key={p.n} href={`#${(p.ids ?? LIVE_PINS.find((l) => l.n === p.n)?.ids ?? ['findings'])[0]}`} className="ev-pin" style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-label={`Marker ${p.n}`}>
          {p.n}
        </a>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ 1. evidence: today */

export function EvidenceToday() {
  return (
    <Stage width={1040} height={640} compact={{ below: 720, width: 358, height: 560 }} className="ev ev--today">
      {(_s, _r, layout) =>
        layout === 'wide' ? (
          <>
            <Window url="www.noeltegroup.com" urlShape="pill" nav className="ev-win ev-win--today">
              <div className="ev-shot">
                <img src="/shots/live-desktop.webp" alt="The current noeltegroup.com homepage at 1440 px wide" width={1600} height={1000} />
                <Pins pins={LIVE_PINS} />
              </div>
            </Window>
            <Phone width={250} frame="pro" className="ev-phone">
              <div className="ev-phone__screen">
                <img src="/shots/live-mobile.webp" alt="The current homepage on a 390 px phone" />
              </div>
            </Phone>
          </>
        ) : (
          <Phone width={300} frame="pro" className="ev-phone ev-phone--solo">
            <div className="ev-phone__screen">
              <img src="/shots/live-mobile.webp" alt="The current homepage on a 390 px phone" />
              <Pins pins={MOBILE_PINS} />
            </div>
          </Phone>
        )
      }
    </Stage>
  )
}

/* ------------------------------------------------------------------ 2. LinkedIn → dead domain */

type LS = { phase: 'profile' | 'loading' | 'error'; url: string; dns: boolean }
const LI_INITIAL: LS = { phase: 'profile', url: 'linkedin.com/company/the-noelte-group', dns: false }
const LI_POSTER: LS = { phase: 'error', url: 'www.thenoeltegroup.com', dns: true }

async function liScript(a: Act<LS>) {
  await a.wait(900)
  await a.move({ at: 'visit', x: 0.5, y: 0.55 })
  await a.wait(250)
  await a.click({ at: 'visit', x: 0.5, y: 0.55 })
  a.put({ phase: 'loading', url: 'www.thenoeltegroup.com' })
  await a.wait(1400)
  a.put({ phase: 'error' })
  await a.wait(900)
  a.put({ dns: true })
  await a.wait(4200)
}

export function LinkedInDemo() {
  const [run, setRun] = useState(0)
  return (
    <div className="li-host">
      <LinkedInStage key={run} />
      <button className="replay" onClick={() => setRun((n) => n + 1)}>
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Replay
      </button>
    </div>
  )
}

function LinkedInStage() {
  return (
    <Stage
      width={820}
      height={500}
      compact={{ below: 640, width: 358, height: 520 }}
      initial={LI_INITIAL}
      poster={LI_POSTER}
      script={liScript}
      play="once"
      cursor={{ at: { wide: { x: 760, y: 420 }, compact: { x: 320, y: 500 } }, ripple: true }}
      className="li"
    >
      {(s, _r, layout) => (
        <>
          <Window url={s.url} urlShape="pill" nav className="li-win">
            <div className="li-body" data-phase={s.phase}>
              <div className="li-profile">
                <div className="li-cover" />
                <div className="li-main">
                  <div className="li-logo"><img src="/brand/tng-logo.png" alt="" /></div>
                  <div className="li-name">The Noelte Group</div>
                  <div className="li-tag">Accelerating Growth through Differentiated Insights and Results</div>
                  <div className="li-meta">Transportation, Logistics, Supply Chain and Storage · Boston, MA · 105 followers</div>
                  <div className="li-actions">
                    <Button variant="primary" size="large">Follow</Button>
                    <span data-target="visit" data-cursor="pointer" className="li-visit">
                      <Button size="large" trailingIcon={<ExternalIcon />}>Visit website</Button>
                    </span>
                  </div>
                </div>
              </div>
              <div className="li-loading"><Spinner size={22} /></div>
              <div className="li-error">
                <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="li-error__icon"><rect x="6" y="9" width="28" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M6 15h28" stroke="currentColor" strokeWidth="2" /><path d="M16 21l8 6M24 21l-8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                <div className="li-error__title">This site can’t be reached</div>
                <div className="li-error__body">Check if there is a typo in <b>www.thenoeltegroup.com</b>.</div>
                <div className="li-error__code">DNS_PROBE_FINISHED_NXDOMAIN</div>
              </div>
            </div>
          </Window>
          <Card className="li-sat" pad="medium" gap={10}>
            <div className="li-sat__head">{layout === 'wide' ? 'LinkedIn website field' : 'Website field'}</div>
            <div className="li-sat__val">www.thenoeltegroup.com</div>
            <div className="li-sat__rows" data-on={s.dns || undefined}>
              <div className="li-sat__row"><span>DNS lookup</span><Badge tone="danger" dot>No record</Badge></div>
              <div className="li-sat__row"><span>noeltegroup.com</span><Badge tone="success" dot>Live site</Badge></div>
            </div>
          </Card>
        </>
      )}
    </Stage>
  )
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M9 3h4v4M13 3 7.5 8.5M12 9.5V13H3V4h3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  )
}

/* ------------------------------------------------------------------ 3. before / after slider */

export function CompareStage() {
  return (
    <Stage width={1040} height={640} compact={{ below: 720, width: 358, height: 300 }} className="ev ev--cmp">
      {() => (
        <Window url="www.noeltegroup.com" urlShape="pill" nav className="ev-win ev-win--cmp">
          <Compare />
        </Window>
      )}
    </Stage>
  )
}

function Compare() {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const touched = useRef(false)
  useEffect(() => {
    if (!inView || reduce || touched.current) return
    const c = animate(88, 50, { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3, onUpdate: (v) => !touched.current && setPos(v) })
    return () => c.stop()
  }, [inView, reduce])
  return (
    <div className="cmp" ref={ref} style={{ ['--pos' as string]: `${pos}%` }}>
      <img src="/shots/proposal-desktop.webp" alt="Proposed homepage, first screen" width={1600} height={1000} className="cmp__img" />
      <img src="/shots/live-desktop.webp" alt="Current homepage, first screen" width={1600} height={1000} className="cmp__img cmp__img--before" />
      <span className="cmp__tag cmp__tag--l">Today</span>
      <span className="cmp__tag cmp__tag--r">Proposed</span>
      <span className="cmp__handle" aria-hidden="true"><span className="cmp__knob"><svg width="18" height="18" viewBox="0 0 18 18"><path d="M7 5 3 9l4 4M11 5l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span></span>
      <input
        className="cmp__range"
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={pos}
        aria-label="Drag to compare the current homepage with the proposed one"
        onChange={(e) => { touched.current = true; setPos(Number(e.target.value)) }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ 4. after: device pair */

export function AfterPair() {
  return (
    <Stage width={1040} height={560} compact={{ below: 720, width: 358, height: 560 }} className="ev ev--after">
      {(_s, _r, layout) =>
        layout === 'wide' ? (
          <>
            <Window url="www.noeltegroup.com" urlShape="pill" nav className="ev-win ev-win--after">
              <div className="ev-shot"><img src="/shots/proposal-desktop.webp" alt="Proposed homepage at 1440 px" width={1600} height={1000} /></div>
            </Window>
            <Phone width={262} frame="pro" className="ev-phone ev-phone--after">
              <div className="ev-phone__screen"><img src="/shots/proposal-mobile.webp" alt="Proposed homepage on a 390 px phone" /></div>
            </Phone>
          </>
        ) : (
          <Phone width={300} frame="pro" className="ev-phone ev-phone--solo">
            <div className="ev-phone__screen"><img src="/shots/proposal-mobile.webp" alt="Proposed homepage on a 390 px phone" /></div>
          </Phone>
        )
      }
    </Stage>
  )
}

/* ------------------------------------------------------------------ 5. the whole page, scrolling */

export function FullScroll() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduce = useReducedMotion()
  return (
    <Stage width={1040} height={600} compact={{ below: 720, width: 358, height: 480 }} className="ev ev--full">
      {() => (
        <div className="fs-mask">
          <Window url="www.noeltegroup.com" urlShape="pill" nav className="ev-win ev-win--full">
            <div className="fs" ref={ref} data-run={(inView && !reduce) || undefined}>
              <img src="/shots/proposal-full.webp" alt="The proposed landing page from top to bottom" width={1000} height={6207} />
            </div>
          </Window>
        </div>
      )}
    </Stage>
  )
}
