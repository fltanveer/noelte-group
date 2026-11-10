import type { ReactNode } from 'react'
import type { CategoryKey } from './data'

/* Isometric sensor stack.
   True 30° isometric. World: x along the road (the truck heads toward -x,
   down-left on screen), y across it (+y faces the viewer, bottom-right),
   z up. Faces are flat rounded rects mapped onto their plane with matrix(),
   so every corner is round and every stroke is one hairline weight
   (non-scaling). Painted back to front by (y - x). One accent: the layer
   the reader is looking at. */

const K = 1
const C = Math.cos(Math.PI / 6)
const S = 0.5

const P = (x: number, y: number, z = 0): [number, number] => [K * C * (x + y), K * S * (y - x) - K * z]
const pts = (list: [number, number, number?][]) => list.map(([x, y, z]) => P(x, y, z ?? 0).map((n) => n.toFixed(1)).join(',')).join(' ')
const f = (n: number) => n.toFixed(3)
/** plane z = h; local (x, y) */
const ground = (h = 0) => `matrix(${f(K * C)} ${f(-K * S)} ${f(K * C)} ${f(K * S)} 0 ${f(-K * h)})`
/** plane y = y0; local (x, z) */
const side = (y0: number) => `matrix(${f(K * C)} ${f(-K * S)} 0 ${f(-K)} ${f(K * C * y0)} ${f(K * S * y0)})`
/** plane x = x0; local (y, z) */
const front = (x0: number) => `matrix(${f(K * C)} ${f(K * S)} 0 ${f(-K)} ${f(K * C * x0)} ${f(-K * S * x0)})`

type BoxProps = { x: [number, number]; y: [number, number]; z: [number, number]; r?: number; tone?: string; top?: ReactNode; frontFace?: ReactNode; sideFace?: ReactNode }

/** A solid: the two visible walls (front = -x, side = +y) and the top. */
function Box({ x: [x0, x1], y: [y0, y1], z: [z0, z1], r = 2.5, tone = '', top, frontFace, sideFace }: BoxProps) {
  return (
    <g className={`iso-box ${tone}`}>
      <g transform={side(y1)}>
        <rect className="f-side" x={x0} y={z0} width={x1 - x0} height={z1 - z0} rx={r} />
        {sideFace}
      </g>
      <g transform={front(x0)}>
        <rect className="f-front" x={y0} y={z0} width={y1 - y0} height={z1 - z0} rx={r} />
        {frontFace}
      </g>
      <g transform={ground(z1)}>
        <rect className="f-top" x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={r} />
        {top}
      </g>
    </g>
  )
}

/** Upright cylinder on the floor plane. */
function Cyl({ x, y, z: [z0, z1], r, tone = '' }: { x: number; y: number; z: [number, number]; r: number; tone?: string }) {
  const [cx, cy0] = P(x, y, z0)
  const [, cy1] = P(x, y, z1)
  const w = K * C * r * Math.SQRT2
  return (
    <g className={`iso-cyl ${tone}`}>
      <g transform={ground(z0)}><circle className="f-side" cx={x} cy={y} r={r} /></g>
      <rect className="f-side f-flat" x={cx - w} y={cy1} width={w * 2} height={cy0 - cy1} />
      <line className="edge" x1={cx - w} y1={cy0} x2={cx - w} y2={cy1} />
      <line className="edge" x1={cx + w} y1={cy0} x2={cx + w} y2={cy1} />
      <g transform={ground(z1)}><circle className="f-top" cx={x} cy={y} r={r} /></g>
    </g>
  )
}

/** A wheel on the +y side: tyre, rim, four spokes that turn. */
function Wheel({ x, y = 29, z = 11, r = 11, speed = 1.4 }: { x: number; y?: number; z?: number; r?: number; speed?: number }) {
  return (
    <g transform={side(y)} className="iso-wheel">
      <circle className="tyre" cx={x} cy={z} r={r} />
      <circle className="rim" cx={x} cy={z} r={r * 0.52} />
      <g className="spokes">
        <path d={`M${x - r * 0.5} ${z}H${x + r * 0.5}M${x} ${z - r * 0.5}V${z + r * 0.5}`} />
        <animateTransform attributeName="transform" type="rotate" from={`0 ${x} ${z}`} to={`360 ${x} ${z}`} dur={`${speed}s`} repeatCount="indefinite" />
      </g>
      <circle className="hub" cx={x} cy={z} r={1.6} />
    </g>
  )
}

/** A compact car, heading -x. */
function Car({ x, y, tracked }: { x: number; y: number; tracked: boolean }) {
  const L = 52, W = 36
  return (
    <g className="iso-car">
      <Box x={[x, x + L]} y={[y - W / 2, y + W / 2]} z={[6, 20]} r={4} />
      <Box x={[x + 12, x + L - 8]} y={[y - W / 2 + 3, y + W / 2 - 3]} z={[20, 32]} r={4}
        frontFace={<rect className="glass" x={y - W / 2 + 6} y={22} width={W - 12} height={8} rx={2} />}
        sideFace={<rect className="glass" x={x + 15} y={22} width={L - 26} height={8} rx={2} />} />
      <Wheel x={x + 10} y={y + W / 2 + 0.5} z={7} r={7} speed={0.9} />
      <Wheel x={x + L - 10} y={y + W / 2 + 0.5} z={7} r={7} speed={0.9} />
      {tracked && <Bracket x={[x - 4, x + L + 4]} y={[y - W / 2 - 4, y + W / 2 + 4]} z={[0, 38]} />}
    </g>
  )
}

/** A 3D tracking box: twelve edges in the accent, drawn only where a detection is. */
function Bracket({ x: [x0, x1], y: [y0, y1], z: [z0, z1] }: { x: [number, number]; y: [number, number]; z: [number, number] }) {
  const c = [
    [x0, y0], [x1, y0], [x1, y1], [x0, y1],
  ] as const
  const d = [
    'M' + pts(c.map(([a, b]) => [a, b, z0] as [number, number, number])).replace(/ /g, 'L') + 'Z',
    'M' + pts(c.map(([a, b]) => [a, b, z1] as [number, number, number])).replace(/ /g, 'L') + 'Z',
    ...c.map(([a, b]) => 'M' + pts([[a, b, z0], [a, b, z1]]).replace(' ', 'L')),
  ].join('')
  return <path className="bracket" d={d} />
}

const sector = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const rad = (a: number) => (a * Math.PI) / 180
  const p0 = [cx + r * Math.cos(rad(a0)), cy + r * Math.sin(rad(a0))]
  const p1 = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))]
  return `M${cx} ${cy}L${p0[0].toFixed(1)} ${p0[1].toFixed(1)}A${r} ${r} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}Z`
}

export function IsoScene({ active }: { active: CategoryKey }) {
  const on = (k: CategoryKey) => (active === k ? 'is-on' : '')
  const lift = active === 'interior'
  const antenna = P(24, 0, 86)
  const fusion = { x: 6, y: 0, z: 150 }

  return (
    <svg className="iso" viewBox="-250 -280 500 440" data-active={active} aria-hidden="true">
      <defs>
        <radialGradient id="iso-fade" cx="50%" cy="50%" r="65%">
          <stop offset=".55" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="iso-mask" maskUnits="userSpaceOnUse" x="-250" y="-280" width="500" height="440">
          <rect x="-250" y="-280" width="500" height="440" fill="url(#iso-fade)" />
        </mask>
        <radialGradient id="iso-cone" cx="0" cy="0" r="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#56D110" stopOpacity=".4" />
          <stop offset="1" stopColor="#56D110" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ---------------- ground ---------------- */}
      <g mask="url(#iso-mask)">
        <g transform={ground(0)}>
          {Array.from({ length: 21 }).map((_, i) => (
            <line key={`gx${i}`} className="grid" x1={-420 + i * 40} y1={-300} x2={-420 + i * 40} y2={300} />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`gy${i}`} className="grid" x1={-420} y1={-300 + i * 40} x2={420} y2={-300 + i * 40} />
          ))}
          <rect className="road" x={-420} y={-108} width={840} height={216} />
          <line className="shoulder" x1={-420} y1={-108} x2={420} y2={-108} />
          <line className="shoulder" x1={-420} y1={108} x2={420} y2={108} />
          <line className="lane" x1={-420} y1={-36} x2={420} y2={-36} />
          <line className="lane" x1={-420} y1={36} x2={420} y2={36} />

          {/* software: occupancy grid */}
          <g className={`layer ${on('software')}`}>
            {Array.from({ length: 16 }).map((_, i) =>
              Array.from({ length: 9 }).map((__, j) => {
                const gx = -330 + i * 20
                const gy = -90 + j * 20
                const occ = (gx >= -240 && gx < -170 && gy >= -30 && gy < 30) || (gx >= -210 && gx < -140 && gy >= 50 && gy < 90)
                const free = !occ && gy >= -30 && gy < 30 && gx < -70
                return <rect key={`${i}-${j}`} className={occ ? 'cell occ' : free ? 'cell free' : 'cell'} x={gx + 1.5} y={gy + 1.5} width={17} height={17} rx={2} style={{ animationDelay: `${(i * 9 + j) * 18}ms` }} />
              }),
            )}
            <path className="path-pred" d="M-74 0 C -160 0, -220 4, -330 20" />
          </g>

          {/* perception: camera FOV, long-range radar, corner radars, lidar */}
          <g className={`layer ${on('perception')}`}>
            <path className="fov" d={sector(-66, 0, 230, 125, 235)} />
            <path className="radar" d="M-72 -4 L-360 -34 L-360 34 L-72 4 Z" />
            <path className="corner" d={sector(-68, 24, 90, 100, 160)} />
            <path className="corner" d={sector(-68, -24, 90, 200, 260)} />
            <circle className="lidar" cx={-26} cy={0} r={150} />
            <g className="sweep">
              <path d={sector(-26, 0, 150, -20, 20)} />
              <animateTransform attributeName="transform" type="rotate" from="0 -26 0" to="360 -26 0" dur="3.4s" repeatCount="indefinite" />
            </g>
          </g>

          {/* position: lane-level path with uncertainty */}
          <g className={`layer ${on('position')}`}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <g key={i} opacity={1 - i * 0.12}>
                <ellipse className="unc" cx={-100 - i * 36} cy={0} rx={7} ry={4.5} />
                <circle className="fix" cx={-100 - i * 36} cy={0} r={2.2} />
              </g>
            ))}
          </g>

          {/* actuation: steering arc at the front axle */}
          <g className={`layer ${on('actuation')}`}>
            <path className="steer" d="M-58 46 A 40 40 0 0 1 -88 22" />
            <path className="steer" d="M-86 30 l-2 -8 l7 3" />
          </g>
        </g>
      </g>

      {/* ---------------- vehicles, back to front ---------------- */}

      {/* trailer */}
      <Box x={[40, 262]} y={[-28, 28]} z={[16, 86]} r={3}
        sideFace={<>{Array.from({ length: 10 }).map((_, i) => <line key={i} className="rib" x1={58 + i * 20} y1={20} x2={58 + i * 20} y2={82} />)}<rect className="skirt" x={90} y={5} width={110} height={9} rx={2} /></>} />
      <Wheel x={216} />
      <Wheel x={240} />
      <g className={`layer ${on('actuation')}`}>
        {[216, 240].map((x) => (
          <g key={x} transform={side(30)}><rect className="act" x={x - 4} y={22} width={8} height={5} rx={1.5} /></g>
        ))}
      </g>

      {/* sleeper with GNSS dome */}
      <Box x={[12, 34]} y={[-26, 26]} z={[12, 84]} r={3} />
      <Cyl x={24} y={0} z={[84, 88]} r={5} tone={active === 'position' ? 'is-lit' : ''} />

      {/* cab lower, with the cabin interior on its top */}
      <Box x={[-44, 12]} y={[-26, 26]} z={[12, 48]} r={3}
        sideFace={<><rect className="tank" x={-14} y={15} width={22} height={11} rx={5} /><line className="seam" x1={-30} y1={14} x2={-30} y2={46} /></>} />
      <g className={`interior ${lift ? 'is-on' : ''}`}>
        <Box x={[-22, -6]} y={[4, 20]} z={[48, 62]} r={3} tone="seat" />
        <Box x={[-22, -6]} y={[-20, -4]} z={[48, 62]} r={3} tone="seat" />
        <g transform={ground(58)}><circle className="wheel-s" cx={-32} cy={12} r={7} /><circle className="touch" cx={-36} cy={7} r={1.8} /></g>
        <circle className="head" cx={P(-13, 12, 72)[0]} cy={P(-13, 12, 72)[1]} r={5.5} />
        <polygon className="dms" points={pts([[-40, 12, 58], [-14, 6, 74], [-14, 18, 70]])} />
        <Box x={[-42, -38]} y={[9, 15]} z={[54, 58]} r={1} tone="cam" />
      </g>
      {/* cab upper, lifts to show the cabin */}
      <g className="cab-top" style={{ transform: `translateY(${lift ? -K * 56 : 0}px)` }}>
        <Box x={[-40, 12]} y={[-26, 26]} z={[48, 78]} r={3}
          frontFace={<><rect className="glass" x={-22} y={51} width={44} height={22} rx={3} /><circle className={`sensor ${active === 'perception' ? 'is-lit' : ''}`} cx={0} cy={70} r={1.6} /></>}
          sideFace={<rect className="glass" x={-36} y={52} width={22} height={18} rx={3} />} />
        <Cyl x={-24} y={0} z={[78, 86]} r={6} tone={active === 'perception' ? 'is-lit' : ''} />
      </g>

      {/* hood and bumper */}
      <Box x={[-68, -44]} y={[-22, 22]} z={[16, 40]} r={4}
        frontFace={<><rect className="grille" x={-13} y={20} width={26} height={15} rx={2} />{[23, 26, 29, 32].map((z) => <line key={z} className="rib" x1={-11} y1={z} x2={11} y2={z} />)}<rect className="lamp" x={15} y={30} width={5} height={5} rx={1.5} /><rect className="lamp" x={-20} y={30} width={5} height={5} rx={1.5} /></>} />
      <Box x={[-74, -66]} y={[-26, 26]} z={[8, 18]} r={2}
        frontFace={<rect className={`sensor ${active === 'perception' ? 'is-lit' : ''}`} x={-6} y={10} width={12} height={6} rx={1.5} />} />
      <Box x={[-46, -40]} y={[26, 32]} z={[54, 66]} r={1.5} />
      <Wheel x={-54} />
      <Wheel x={4} />
      <Wheel x={24} />

      <g className={`layer ${on('actuation')}`}>
        {[-54, 4, 24].map((x) => (
          <g key={x} transform={side(29.5)}>
            <circle className="enc" cx={x} cy={11} r={14}>
              <animateTransform attributeName="transform" type="rotate" from={`0 ${x} 11`} to={`360 ${x} 11`} dur="2.4s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </g>

      <Car x={-196} y={72} tracked={active === 'perception' || active === 'software'} />
      <Car x={-250} y={0} tracked={active === 'perception' || active === 'software'} />

      {/* ---------------- above the truck ---------------- */}
      <g className={`layer ${on('position')}`}>
        {[[-120, -90, 200], [60, -60, 180], [160, 60, 210]].map(([x, y, z], i) => {
          const [sx, sy] = P(x, y, z)
          return (
            <g key={i}>
              <line className="signal" x1={sx} y1={sy} x2={antenna[0]} y2={antenna[1]} />
              <Box x={[x - 5, x + 5]} y={[y - 5, y + 5]} z={[z - 5, z + 5]} r={1.5} />
              <g transform={side(y + 5)}><rect className="panel" x={x + 7} y={z - 3} width={18} height={6} rx={1} /><rect className="panel" x={x - 25} y={z - 3} width={18} height={6} rx={1} /></g>
            </g>
          )
        })}
        <g className="imu">
          {(() => {
            const o = P(-12, 0, 48)
            const ax = [P(-40, 0, 48), P(-12, 28, 48), P(-12, 0, 76)]
            return ax.map(([x, y], i) => <line key={i} className="axis" x1={o[0]} y1={o[1]} x2={x} y2={y} />)
          })()}
        </g>
      </g>

      <g className={`layer ${on('software')}`}>
        {[P(-70, 0, 13), P(-24, 0, 86), P(-40, 0, 70)].map(([x, y], i) => {
          const [fx, fy] = P(fusion.x, fusion.y, fusion.z - 8)
          return <path key={i} className="signal" d={`M${x} ${y} Q ${x} ${fy + 20} ${fx} ${fy}`} />
        })}
        <Box x={[fusion.x - 16, fusion.x + 16]} y={[-16, 16]} z={[fusion.z - 8, fusion.z]} r={2} tone="chip"
          top={<>{[-8, 0, 8].map((v) => <line key={v} className="pin" x1={fusion.x - 12} y1={v} x2={fusion.x + 12} y2={v} />)}</>} />
      </g>
    </svg>
  )
}
