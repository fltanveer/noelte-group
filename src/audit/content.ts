// Audit content, carried over verbatim from the original report.
// Inline markup: `code` and **bold** (see rich() in App.tsx).

export type Sev = 'critical' | 'major' | 'minor'

export interface Finding {
  id: string
  sev: Sev
  fw: string
  title: string
  observed: string
  impact: string
  fix: string
}

export const FINDINGS: Finding[] = [
  {
    id: 'F-01', sev: 'critical', fw: 'Business · N1 Visibility of system status',
    title: 'LinkedIn sends every visitor to a domain that does not exist',
    observed: 'The LinkedIn company page lists its website as `www.thenoeltegroup.com`. Neither `thenoeltegroup.com` nor `www.thenoeltegroup.com` returns any HTTP response — the host does not resolve. The live site is `www.noeltegroup.com` (no leading "the").',
    impact: "LinkedIn is the firm's only publicised channel and the only link on the website itself. Anyone who finds the company there and clicks the website field reaches a browser error. There is no way for them to know the real address. **This is the single most expensive defect on either property.**",
    fix: 'Change the LinkedIn website field to `https://www.noeltegroup.com` today. Then register `thenoeltegroup.com` as a defensive domain and 301 it to the live site, because the longer spelling matches the legal name "The Noelte Group Inc." and people will type it.',
  },
  {
    id: 'F-02', sev: 'critical', fw: 'Business · Conversion',
    title: 'No way to make contact anywhere on the site',
    observed: 'The rendered page contains exactly two anchor elements: a hidden Squarespace `/cart` link measuring 0 × 0 px, and a LinkedIn icon in the footer. No email address, no telephone number, no postal address, no form, no calendar link. The Boston headquarters and the UK, Germany and Korea offices are named in the hero sentence but never located.',
    impact: 'A buyer who is convinced must leave the site, open LinkedIn, find the right person and send a connection request — a path that loses most of the people who were ready to act, and produces no record the firm can measure.',
    fix: 'Add one primary action repeated in the header, after the hero, at mid-page and in the footer: **Book a 30-minute market call**, pointing at a real scheduling link. Add a footer with a monitored mailbox, a direct number and the four office cities. Add a short qualifying form on a dedicated page.',
  },
  {
    id: 'F-03', sev: 'critical', fw: 'IA · N3 User control and freedom · N6 Recognition over recall',
    title: 'One page, no navigation, nothing to explore',
    observed: '`sitemap.xml` contains a single URL, `/home`. There is no navigation bar, no menu, no footer links, no anchors. The full page is one screen at 1024 px and 1,766 px tall at 375 px.',
    impact: 'A buyer evaluating a partner for a multi-year design-in has three questions — who are you, what have you done, who else trusted you — and the site answers none of them with nowhere to go and look. It also leaves the firm with one indexable page, so no search query about radar, GNSS, AMR or in-cabin sensing can ever land anywhere specific.',
    fix: 'Build out to the structure in section 08, with a persistent header and a real footer. Each market and each technology category deserves its own indexable page.',
  },
  {
    id: 'F-04', sev: 'major', fw: 'Findability · Business',
    title: 'The site says less than the LinkedIn page it links to',
    observed: 'The LinkedIn About section carries a full positioning paragraph — who the client is ("global sensor, software, actuator and system solution providers"), which markets, which disciplines, and a long technology list. The website carries one 26-word sentence about being experienced and global, then three keyword lists.',
    impact: 'The owned property, which the firm controls and can rank, is weaker than the rented one. Anyone who reads both gets a better answer from LinkedIn and no reason to return to the site.',
    fix: 'Move the LinkedIn positioning paragraph onto the homepage as the primary argument, sharpened into an H1 plus a 40-word standfirst. Section 10 of this report writes it.',
  },
  {
    id: 'F-05', sev: 'major', fw: 'Business · Trust & credibility',
    title: 'No proof of any kind',
    observed: 'No client names, no logos, no case studies, no named people, no founding year, no team size, no credentials, no testimonials. All of these exist on LinkedIn: founded 2022, 2–10 employees, five employees listed, Ray Noelte and Greg Noelte named publicly.',
    impact: 'For a five-person advisory selling multi-year access to OEM and Tier-1 programmes, the people *are* the product. A site with no faces and no record reads as a shell, which is the most expensive impression a firm of this size can give.',
    fix: 'Add a team section with photographs, the two decades of operator background, and the companies each person worked at before. Add three anonymised engagements ("European radar supplier → two North American truck OEM platforms"). Add a partner strip, with permission.',
  },
  {
    id: 'F-06', sev: 'major', fw: 'Findability · AI discovery',
    title: 'robots.txt blocks every major AI crawler',
    observed: 'The Squarespace default `robots.txt` disallows `GPTBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `CCBot`, `Applebot-Extended`, `Bytespider`, `cohere-ai`, `PerplexityBot` and others.',
    impact: 'Buyers in this category increasingly ask an assistant to name consultancies that can open North American fleet accounts for a European sensor supplier. The firm is excluded from those answers by default, while competitors who opted in are not.',
    fix: 'Decide this deliberately rather than inheriting it. For a firm whose product is being known, allow the retrieval crawlers. Squarespace exposes this under Settings → Crawlers.',
  },
  {
    id: 'F-07', sev: 'major', fw: 'WCAG 1.3.1 Info and relationships · 2.4.6 Headings and labels',
    title: 'No <h1>; the heading hierarchy starts at level 3',
    observed: 'The document contains 0 `h1`, 0 `h2` and 3 `h3` elements ("MARKETS", "SERVICES", "TECHNICAL SOLUTIONS"). The hero sentence, which is the only positioning statement, is a styled `div`, not a heading.',
    impact: 'A screen-reader user navigating by heading jumps straight into three category labels with no page title. Search engines get no primary topic signal.',
    fix: 'One `h1` per page carrying the proposition. Demote the three category labels to `h2`, and the "PERCEPTION / POSITION / INTERIOR" labels to a definition list rather than bold text runs.',
  },
  {
    id: 'F-08', sev: 'major', fw: 'WCAG 1.1.1 Non-text content',
    title: 'The logo is the only image and it has an empty alt attribute',
    observed: 'One `<img>` on the page, the brand lockup, with `alt=""`. The lockup carries the company name and the tagline "Differentiated Insights & Results" as pixels.',
    impact: 'A non-sighted visitor receives the company name only from the `<title>` tag, and never receives the tagline at all.',
    fix: '`alt="The Noelte Group — Differentiated Insights & Results"`. Better: set the wordmark and tagline as live text beside an SVG mark, so both are selectable, scalable and translatable.',
  },
  {
    id: 'F-09', sev: 'major', fw: 'Findability · N2 Match with the real world',
    title: 'Empty meta description and a bare title',
    observed: '`<meta name="description" content="" />` — present but empty. `<title>The Noelte Group</title>` with no descriptor. `og:description` is absent and `twitter:card` is set to `summary`, which renders a small square thumbnail, despite an og image of 1311 × 441.',
    impact: 'Google writes its own snippet from the keyword lists, which reads as a word salad. A link shared in LinkedIn or email previews with no description and a cropped logo.',
    fix: 'Title: "The Noelte Group — growth for sensor, software and actuator suppliers". A 150-character description naming the markets. Add `og:description`, switch to `twitter:card=summary_large_image`, and serve the og image over `https`.',
  },
  {
    id: 'F-10', sev: 'major', fw: 'N8 Aesthetic and minimalist design · Cognitive load',
    title: 'Three parallel keyword dumps with no argument between them',
    observed: 'Three identically styled lists: 5 market items, 7 service items, 5 technology lines, totalling more than 36 comma-separated terms. Four of them trail off in an ellipsis ("Fleets…", "LWIR…", "DAS…"). The three lists are visually parallel but logically unrelated — one is who you sell to, one is what you do, one is what you know about.',
    impact: "A buyer cannot tell what the firm does from what the firm has heard of. Miller's limit is passed three times over in one screen, and the ellipses read as a list that was never finished.",
    fix: 'Separate the three axes onto different levels of the site: services become the homepage argument, markets become a coverage section with its own pages, and the technology taxonomy becomes a dedicated portfolio page. Replace every ellipsis with a real last item.',
  },
  {
    id: 'F-11', sev: 'major', fw: 'Visual craft · Typographic hierarchy',
    title: 'Everything is bold Montserrat at two sizes, and the positioning line is italic',
    observed: 'Resolved styles show Montserrat throughout at 26.7 px / 19.9 px desktop and 17 px mobile. Card titles, category labels and the hero are all weight 700. The hero statement — the only sentence that positions the firm — is set bold italic and wraps to seven lines at 375 px.',
    impact: 'With everything emphasised, nothing is. Extended bold italic is the slowest setting to read, and it is used on the one sentence that must land.',
    fix: 'A real scale: display 44–56 px / 700, section 28–32 px / 600, card title 18 px / 600, body 16 px / 400 regular upright. Reserve italic for pull quotes. Tighten display tracking to −0.025 em.',
  },
  {
    id: 'F-12', sev: 'major', fw: 'WCAG 1.4.3 Contrast (logo exemption noted)',
    title: 'The brand green is unreadable on white at 2.0:1',
    observed: 'Brand green resolves to `rgb(86,209,16)` — `#56D110`. Against white that is **2.0:1**. The tagline "Differentiated Insights & Results" sits in this colour on white inside the logo lockup. On the navy card background `#0A4871` the same green measures **4.83:1** and passes AA.',
    impact: 'Logo text is formally exempt from 1.4.3, so this is not a compliance failure — but it is a legibility failure. The tagline disappears at small sizes, in the LinkedIn avatar crop and in any greyscale reproduction. If the same green is ever used for body text or a button label on white, it becomes a real violation.',
    fix: 'Keep `#56D110` for surfaces and for text on navy. Introduce a deep variant, around `#2E7D15`, for green text on white. For buttons use the green as the fill with deep navy `#072B46` as the label — that pairing measures **7.65:1** and is both on-brand and comfortably accessible. The proposed design uses exactly that.',
  },
  {
    id: 'F-13', sev: 'major', fw: 'N4 Consistency and standards · Platform',
    title: 'Squarespace commerce left switched on',
    observed: 'A `/cart` anchor is present in the DOM with a 0 × 0 bounding box, and the page ships the universal cart stylesheet. The site sells nothing.',
    impact: 'A crawlable checkout surface on a consultancy site, extra payload on every page load, and one more sign that the template was never configured.',
    fix: 'Disable Commerce in site settings so the cart markup and assets stop being emitted.',
  },
  {
    id: 'F-14', sev: 'major', fw: 'Mobile · Conversion',
    title: 'On mobile the only link sits at the bottom of a 1,766 px scroll',
    observed: 'At 375 px the three cards stack into a single column with no sticky header, no anchor navigation and no in-content action. The LinkedIn icon is the last element on the page.',
    impact: 'A visitor arriving from a LinkedIn post — which is most of them — has to read three keyword lists before finding anything clickable.',
    fix: 'Design the mobile layout rather than letting the desktop grid stack: a sticky header carrying the call button, the proposition and action inside the first screen, and the coverage lists collapsed behind expandable groups.',
  },
  {
    id: 'F-15', sev: 'minor', fw: 'Visual craft · Platform',
    title: 'Default Squarespace favicon',
    observed: 'The icon link points at `assets.squarespace.com/universal/default-favicon.ico`.',
    impact: 'Every browser tab, bookmark and history entry shows a generic mark instead of the N.',
    fix: 'Export the N from the lockup at 512 × 512 on navy and upload it as the site icon.',
  },
  {
    id: 'F-16', sev: 'minor', fw: 'Visual craft · Layout',
    title: 'The three cards are visibly unequal in height',
    observed: 'At 1024 px the Technical Solutions card runs noticeably taller than Markets and Services, so the row has a stepped bottom edge and a gap under the shorter two. In the 1440 px re-capture the Markets subhead wraps into the first list item, and an empty band of brand green separates the cards from the footer.',
    impact: 'Reads as unfinished rather than deliberate; the eye has no stable baseline to rest on.',
    fix: 'Equalise heights across the row, or split the longest column so each card carries a comparable amount.',
  },
  {
    id: 'F-17', sev: 'minor', fw: 'WCAG 1.3.1 · Semantics',
    title: 'Technology categories are bold text runs, not a list',
    observed: '"PERCEPTION:", "POSITION:", "INTERIOR:", "SOFTWARE:", "ACTUATION:" are `<strong>` spans inside generic containers, each followed by a loose text run. The neighbouring two cards do use real `<ul>` markup.',
    impact: 'Assistive technology reads five long unbroken sentences instead of five labelled groups, and the three cards are structurally inconsistent with one another.',
    fix: 'Mark it up as a `<dl>`, with each category as `<dt>` and its technologies as `<dd>`.',
  },
  {
    id: 'F-18', sev: 'minor', fw: 'Content · Copy',
    title: 'Four lists trail off in an ellipsis',
    observed: '"Trailers, Last Mile Delivery, Fleets…", "Camera (Smart, LWIR…)", "Analytics, DAS…" and one more end mid-thought.',
    impact: 'Signals an unfinished draft, and leaves the reader to guess what the remaining capability is.',
    fix: 'Name the last item, or cut the list at a complete one. An ellipsis is never a capability.',
  },
]

export const SCORES = [
  { label: 'Conversion path', value: 6 },
  { label: 'Content & proof', value: 16 },
  { label: 'Findability (SEO / AI)', value: 21 },
  { label: 'Visual craft & hierarchy', value: 38 },
  { label: 'Accessibility', value: 52 },
  { label: 'Responsive behaviour', value: 64 },
]

export const FRAMEWORKS = [
  ['Business & conversion', 2, 3, 0],
  ['Information architecture & content', 1, 4, 2],
  ['WCAG 2.1 AA / accessibility', 0, 3, 1],
  ['Visual & platform craft', 0, 1, 1],
] as const

export const LINKEDIN_ROWS = [
  ['Website', '`www.thenoeltegroup.com`', '**Dead domain.** Highest-priority fix on either property.'],
  ['Tagline', '"Accelerating Growth through Differentiated Insights and Results"', 'Third different positioning line across two properties — the logo says "Differentiated Insights & Results", the site hero says something else again. Pick one and use it everywhere.'],
  ['About', 'Full paragraph naming the client type, the markets and the technology portfolio', 'The strongest copy the firm has written. It belongs on the homepage.'],
  ['Followers', '105', 'Low for a 2022 founding with five senior operators. Each partner post reaches a few hundred people at most.'],
  ['Industry', 'Transportation, Logistics, Supply Chain and Storage', 'Describes the end market, not the service. Buyers searching LinkedIn for a growth or BD partner filter on "Business Consulting and Services". Worth testing.'],
  ['Posting', 'Mostly reposts of partner announcements; one original post in the last month', "The reposts are good signal — Si-Ware and AIVE content shows live relationships — but a reposter is not an authority. The firm's own market reads are the asset nobody else can publish."],
  ['People', 'Ray Noelte, Greg Noelte named; 5 employees listed', 'Two named operators that the website never mentions. The gap between the two properties is the whole credibility problem in one line.'],
] as const

export const WORKS = [
  ['The technology taxonomy is genuinely ownable.', 'PERCEPTION / POSITION / INTERIOR / SOFTWARE / ACTUATION is a clean five-way cut of a messy portfolio, and almost no competitor publishes one. It should become a navigation level, not a paragraph.'],
  ['The three-way split is the right top-level structure.', 'Markets, Services and Technical Solutions is exactly how a buyer in this category thinks. The skeleton is correct; it has no body on it.'],
  ['White on navy `#0A4871` measures 9.6:1', '— well past the 4.5:1 AA threshold, and comfortable at the sizes used.'],
  ['Green is used with restraint.', 'It appears only on category headings and list markers inside the navy cards, where it measures 4.83:1 and passes AA. The discipline of one accent is already there.'],
  ['The logo mark reads at small sizes.', 'The N with the forward arrow carries motion, survives monochrome, and works as a favicon and an app icon.'],
  ['The grid stacks cleanly at 375 px', 'with no horizontal overflow and no clipped text — the responsive behaviour is sound even though the mobile layout was never designed.'],
  ['Montserrat is a defensible brand face', 'and matches the geometry of the logo. The problem is how few weights are used, not the choice.'],
  ['`lang="en-US"` and the viewport meta are set correctly,', 'so the basics of localisation and scaling are in place.'],
] as const

export const FIRST_FIVE = [
  ['Point LinkedIn at the live domain — today.', 'One field edit. Until it is changed, every click from the firm\'s only channel lands on a browser error. Then buy `thenoeltegroup.com` and redirect it.', 'F-01'],
  ['Put a way to make contact on the page.', 'A scheduling link in the header and the footer, a monitored mailbox, a direct number, four office cities. This can ship on the existing Squarespace page within a day and will outperform everything else in this list.', 'F-02'],
  ['Move the LinkedIn About paragraph onto the site, under a real H1.', 'The copy already exists and is better than what is published. Sharpening it into a headline plus a standfirst fixes the positioning, the heading hierarchy and the meta description in one pass.', 'F-04'],
  ['Add the people and three engagements.', 'Five named operators with two decades each is the product. Without faces and a record, a five-person firm asking for a multi-year design-in relationship reads as a shell.', 'F-05'],
  ['Build out from one page, and fix the head.', 'Meta description, title, favicon, `https` og image, `summary_large_image`, commerce off, AI crawlers reconsidered. Each market and technology category gets a page that can actually rank.', 'F-09'],
] as const

export const SITEMAP = [
  ['Home', 'The argument, the four-stage model, proof, and the two doors.', 'Convince & route', true],
  ['What we do', 'The seven services, each with the outcome it produces and what the client receives.', 'Qualify', false],
  ['Markets', 'Hub page, plus a child page for each: cars & trucks, trailers & last mile, construction & agriculture, robotics, smart infrastructure.', 'Rank & land', false],
  ['Technologies', 'The five-category portfolio — perception, position, interior, software, actuation — each with a child page.', 'Rank & land', false],
  ['Results', 'Three to five anonymised engagements with the situation, the work and the outcome.', 'Prove', false],
  ['Team', 'Five people, the companies behind them, the four offices and the founding story.', 'Trust', false],
  ['Book a call', 'Scheduler plus a six-field qualifying form. The destination of every primary button on the site.', 'Convert', true],
  ['Specify a solution', 'The second door, for OEM and fleet engineers: describe the problem, get routed to the right supplier.', 'Convert (secondary)', true],
  ['Insights', 'Optional, phase two. The market reads the firm already writes privately, published monthly.', 'Authority', false],
] as const

export const COPY_DECK: [string, string, string?][] = [
  ['Title tag', 'The Noelte Group — growth for sensor, software and actuator suppliers'],
  ['Meta description', 'Strategy, business development and sales for perception, position, interior-sensing, software and actuation suppliers selling into cars, trucks, trailers, robotics and smart infrastructure. Boston, UK, Germany, Korea.'],
  ['Logo tagline', 'Differentiated Insights & Results', 'Keep — and use this exact line on LinkedIn too'],
  ['Hero', '**Design-in wins, not introductions.** We run strategy, business development and sales for perception, position, interior-sensing, software and actuation suppliers selling into cars, trucks, trailers, robotics and smart infrastructure. Boston headquarters, with operators in the United Kingdom, Germany and Korea.'],
  ['Primary CTA', 'Book a 30-min market call'],
  ['Proof strip', 'Founded 2022 · Boston · United Kingdom · Germany · Korea · five senior operators', 'Client logos to clear'],
  ['The problem', "**The best sensor in the room loses to the one the buyer already trusts.** OEM and fleet programmes are decided years before a purchase order exists. By the time an RFQ reaches your inbox, the specification has usually been written around someone else's part. Suppliers lose on access and timing, not on silicon. We work the years in between."],
  ['Four stages', '**Market read** (weeks 1–3) · **Targets & positioning** (weeks 4–8) · **Doors & pursuit** (ongoing) · **Design-in & scale** (to SOP). Each ends with a named deliverable.'],
  ['Sales service', 'We carry the number with you, not just the relationship.', 'Confirm commercial model'],
  ['Sixth tile', 'Not on the list? We take on two or three new portfolio lines a year.', 'Confirm the number'],
  ['Dual CTA', '**I supply technology** → Book a 30-min market call · **I am specifying a solution** → Describe the problem'],
  ['Booking page', '**Thirty minutes, and a straight answer.** Fields: work email · company · your role · what you make · market you want · anything we should read first (optional). Button: Show me available times.'],
  ['Lead magnet', 'The North America market-entry checklist for sensor suppliers — fourteen questions that decide whether a programme is worth chasing.', 'To be written'],
  ['Footer', 'The Noelte Group Inc. · Boston, Massachusetts · United Kingdom · Germany · Korea · email, direct line, LinkedIn', 'Real details to supply'],
]

export const ROLLOUT = [
  ['Day one — stop the leak.', 'Correct the LinkedIn website field. Put an email address, a direct number, the four office cities and a scheduling link on the existing page. Set the meta description and the title. Upload the favicon. Switch Commerce off.'],
  ['Weeks one and two — say what you do.', 'Rebuild the homepage against the proposed landing page and the copy deck: one H1, the problem statement, the four stages, the five technology categories, the two doors.'],
  ['Weeks three to six — build out the structure.', 'What we do, Markets with five children, Technologies with five children, Results, Team, Book a call. Header and footer navigation. Proper heading hierarchy and alt text throughout.'],
  ['Weeks six to eight — put the proof in.', 'Photograph the five people. Write three anonymised engagements. Clear two or three client logos. Decide the AI-crawler policy. Publish the checklist and wire up the email capture.'],
  ['Ongoing — publish the thing only you have.', 'One market read a month, posted on the site first and on LinkedIn second, so the traffic lands somewhere you own. This is what moves 105 followers and converts the people who are nine months early.'],
] as const
