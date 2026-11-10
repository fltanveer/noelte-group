import { useEffect, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

/** Generated photography with an on-brand fallback when a file is missing. */
export function Photo({ name, alt, className = '', sizes, priority }: { name: string; alt: string; className?: string; sizes?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`photo ${className}`} data-failed={failed || undefined}>
      {!failed && (
        <img
          src={`/images/${name}.webp`}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

/** One quiet entrance for content that arrives with the scroll. Used sparingly. */
export function Reveal({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' }) {
  const reduce = useReducedMotion()
  const M = as === 'li' ? motion.li : motion.div
  if (reduce) return <M className={className}>{children}</M>
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

export function Pending({ children }: { children: ReactNode }) {
  return <span className="pending">{children}</span>
}

export function Arrow() {
  return (
    <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Local time in an office, refreshed each minute. */
export function useClock(tz: string) {
  const fmt = () => {
    const now = new Date()
    const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(now)
    const parts = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, weekday: 'short', timeZone: tz }).formatToParts(now)
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24
    const day = parts.find((p) => p.type === 'weekday')?.value ?? ''
    const open = !['Sat', 'Sun'].includes(day) && hour >= 8 && hour < 18
    return { time, open }
  }
  const [state, setState] = useState(fmt)
  useEffect(() => {
    const id = window.setInterval(() => setState(fmt()), 30_000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tz])
  return state
}
