// All landing-page copy lives here, taken from the audit's copy deck (section 10).
// Anything the firm still has to confirm or supply is marked with `pending`.

export const NAV = [
  { href: '#stages', label: 'How it works' },
  { href: '#technologies', label: 'Technologies' },
  { href: '#markets', label: 'Markets' },
  { href: '#results', label: 'Results' },
  { href: '#team', label: 'Team' },
]

export type CategoryKey = 'perception' | 'position' | 'interior' | 'software' | 'actuation'

export const CATEGORIES: { key: CategoryKey; name: string; line: string; items: string[] }[] = [
  {
    key: 'perception',
    name: 'Perception',
    line: 'What the vehicle sees.',
    items: ['Radar', 'Smart camera', 'LWIR thermal camera', 'Lidar'],
  },
  {
    key: 'position',
    name: 'Position',
    line: 'Where it is, to the lane.',
    items: ['IMU', 'GNSS', 'PPP correction', 'Wheel and ground speed'],
  },
  {
    key: 'interior',
    name: 'Interior',
    line: 'Who is driving, and how well.',
    items: ['Driver and occupant monitoring', 'Drowsiness', 'Breath and touch alcohol', 'In-cabin health'],
  },
  {
    key: 'software',
    name: 'Software',
    line: 'What it makes of all that.',
    items: ['Perception and fusion', 'SLAM and odometry', 'Calibration and labelling', 'Simulation and validation', 'Analytics and driver assistance'],
  },
  {
    key: 'actuation',
    name: 'Actuation',
    line: 'How it moves.',
    items: ['Encoders', 'Bearings', 'Reducers', 'Actuators', 'Dextrous hands'],
  },
]

export const STAGES = [
  {
    when: 'Weeks 1–3',
    name: 'Market read',
    body: 'Where your part actually wins. Platform volumes, programme timing, incumbents, and the price you have to hit.',
    get: 'A written market read',
  },
  {
    when: 'Weeks 4–8',
    name: 'Targets & positioning',
    body: 'The twelve to twenty accounts worth your quarter, and the one sentence that gets you the meeting.',
    get: 'A named account plan',
  },
  {
    when: 'Ongoing',
    name: 'Doors & pursuit',
    body: 'We make the introduction, sit in the technical review, and defend your specification against the incumbent.',
    get: 'Qualified pursuits',
  },
  {
    when: 'To SOP',
    name: 'Design-in & scale',
    body: 'From A-sample to start of production: application engineering, supply agreements, and the second platform.',
    get: 'Programmes in production',
  },
]

export const SERVICES = [
  ['Strategy', 'Where to play, and what to stop selling.'],
  ['Market analysis', 'Platform-level volume and timing, not analyst top-lines.'],
  ['Business development', 'Named introductions into OEM, Tier-1 and fleet accounts.'],
  ['Sales', 'We carry the number with you, not just the relationship.'],
  ['Application & design engineering', 'Engineers who can defend your specification in a technical review.'],
  ['Investment & partnerships', 'Co-development, licensing and distribution structures.'],
  ['M&A diligence', 'Commercial and technical diligence for buyers and sellers in sensing.'],
] as const

export type Coverage = 'active' | 'building' | 'request'
export const REGIONS = ['US', 'UK', 'DE', 'KR'] as const

export const MARKETS: { key: string; name: string; detail: string; image: string; alt: string; coverage: Coverage[] }[] = [
  { key: 'trucks', name: 'Cars & trucks', detail: 'Passenger platforms, light commercial and Class 8.', image: 'market-trucks', alt: 'A Class 8 truck on an interstate at dusk', coverage: ['active', 'active', 'active', 'building'] },
  { key: 'lastmile', name: 'Trailers, last mile & fleets', detail: 'Trailer OEMs, delivery fleets and their telematics partners.', image: 'market-lastmile', alt: 'Trailers and delivery vans at a distribution yard at dawn', coverage: ['active', 'building', 'active', 'request'] },
  { key: 'offroad', name: 'Construction, mining & agriculture', detail: 'Off-highway machines where uptime decides the purchase.', image: 'market-offroad', alt: 'A tractor working a field at first light', coverage: ['active', 'request', 'active', 'building'] },
  { key: 'robotics', name: 'Robotics & drones', detail: 'Forklifts, AMRs, humanoids and unmanned aircraft.', image: 'market-robotics', alt: 'Autonomous mobile robots in a warehouse aisle', coverage: ['active', 'building', 'building', 'active'] },
  { key: 'infra', name: 'Smart infrastructure', detail: 'Intelligent transport systems, smart buildings and smart health.', image: 'market-infra', alt: 'A city intersection at night from above', coverage: ['building', 'active', 'request', 'request'] },
]

export const ENGAGEMENTS = [
  {
    who: 'European radar supplier',
    title: 'Two North American truck platforms',
    body: 'No US presence at the start. A market read, eleven target accounts, and design-in on two platforms inside eighteen months.',
    stat: '18 months',
    statLabel: 'from market read to second award',
  },
  {
    who: 'In-cabin sensing',
    title: 'From pilot to fleet rollout',
    body: 'Regulatory timing made the case. We positioned the part against the EU deadline and ran the fleet pursuit.',
    stat: 'EU GSR',
    statLabel: 'deadline used as the buying trigger',
  },
  {
    who: 'Actuation · M&A',
    title: 'Commercial diligence on a robotics target',
    body: 'Six weeks. Customer interviews, pipeline quality, and a technical read on the dextrous-hand roadmap.',
    stat: '6 weeks',
    statLabel: 'to a signed diligence report',
  },
]

export const TEAM: { name: string; role: string; place: string; bio: string; pending: string; mono?: string }[] = [
  { name: 'Ray Noelte', role: 'Founder', place: 'Boston', bio: 'Two decades in automotive sensing.', pending: 'Bio and photo to confirm' },
  { name: 'Greg Noelte', role: 'Partner', place: 'Boston', bio: 'Business development and fleet accounts.', pending: 'Bio and photo to confirm' },
  { mono: 'EU', name: 'Europe lead', role: 'Partner', place: 'United Kingdom · Germany', bio: 'OEM and Tier-1 relationships across Europe.', pending: 'Name to supply' },
  { mono: 'KR', name: 'Korea lead', role: 'Partner', place: 'Seoul', bio: 'Supplier partnerships across Korea and Japan.', pending: 'Name to supply' },
]

export const OFFICES = [
  { city: 'Boston', note: 'Headquarters', tz: 'America/New_York' },
  { city: 'United Kingdom', note: 'Europe', tz: 'Europe/London' },
  { city: 'Germany', note: 'Europe', tz: 'Europe/Berlin' },
  { city: 'Korea', note: 'Asia-Pacific', tz: 'Asia/Seoul' },
]

export const LINKEDIN = 'https://www.linkedin.com/company/the-noelte-group/'
