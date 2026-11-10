import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { CATEGORIES, type CategoryKey } from './data'
import { IsoScene } from './IsoScene'

// The hero's signature: a Class 8 tractor-trailer seen from above, carrying the
// firm's own five-way taxonomy. Each tab lights one layer of the stack on the
// truck, so a buyer sees where their part sits before reading a word.
// Auto-advances until someone touches it; pauses offscreen; static under
// reduced motion.


export function SensorRig() {
  const [active, setActive] = useState<CategoryKey>('perception')
  const [touched, setTouched] = useState(false)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (touched || reduce || !inView) return
    const id = window.setInterval(() => {
      setActive((k) => {
        const i = CATEGORIES.findIndex((c) => c.key === k)
        return CATEGORIES[(i + 1) % CATEGORIES.length].key
      })
    }, 5200)
    return () => window.clearInterval(id)
  }, [touched, reduce, inView])

  const pick = (k: CategoryKey) => {
    setTouched(true)
    setActive(k)
  }

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = CATEGORIES.length
    let j = -1
    if (e.key === 'ArrowRight') j = (i + 1) % n
    if (e.key === 'ArrowLeft') j = (i - 1 + n) % n
    if (e.key === 'Home') j = 0
    if (e.key === 'End') j = n - 1
    if (j < 0) return
    e.preventDefault()
    pick(CATEGORIES[j].key)
    tabs.current[j]?.focus()
  }

  useEffect(() => {
    const svg = ref.current?.querySelector('svg') as SVGSVGElement | null
    if (!svg) return
    if (!inView || reduce) svg.pauseAnimations()
    else svg.unpauseAnimations()
  }, [inView, reduce])

  const cat = CATEGORIES.find((c) => c.key === active)!

  return (
    <div className="rig" ref={ref} data-active={active} data-paused={!inView || reduce || undefined}>
      <div className="rig__head">
        <span>Sensor stack</span>
        <span className="rig__sub">Class 8 tractor-trailer · isometric</span>
      </div>

      <div className="rig__stage" role="img" aria-label={`Isometric truck showing the ${cat.name.toLowerCase()} layer: ${cat.items.join(', ')}`}>
        <IsoScene active={active} />
      </div>

      <div className="rig__tabs" role="tablist" aria-label="Technology categories">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.key}
            ref={(el) => { tabs.current[i] = el }}
            role="tab"
            id={`rig-tab-${c.key}`}
            aria-selected={c.key === active}
            aria-controls="rig-panel"
            tabIndex={c.key === active ? 0 : -1}
            className="rig__tab"
            onClick={() => pick(c.key)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {c.name}
            {c.key === active && !touched && !reduce && <span className="rig__timer" aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className="rig__panel" id="rig-panel" role="tabpanel" aria-labelledby={`rig-tab-${active}`} aria-live="polite">
        <span className="rig__line">{cat.line}</span>
        <span className="rig__items">{cat.items.join(' · ')}</span>
      </div>
    </div>
  )
}
