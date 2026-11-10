# Noelte Group — audit & proposed landing page

Two static pages, built with Vite + React:

| Route | What it is |
|---|---|
| `/` | The UX, content & conversion audit of noeltegroup.com and the LinkedIn page — 18 findings, real screenshots presented as product shots (Stageshow kit), an animated LinkedIn → dead-domain demo, a before/after slider and the copy deck. |
| `/proposal/` | The proposed landing page: isometric sensor-stack hero, programme timeline, four stages, technology bento, market coverage board, engagements, team with live office clocks, two doors and a working (prototype) booking flow. |

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173  and  /proposal/
npm run build      # outputs dist/
npm run preview
```

## Deploy to Vercel

Either:

- **Dashboard:** push this folder to a Git repo, import it in Vercel. Framework preset *Vite* is detected; build `npm run build`, output `dist` (already set in `vercel.json`).
- **CLI:** `npx vercel` from this folder, then `npx vercel --prod`.

No environment variables are needed on Vercel. The generated photography is committed in `public/images`.

## Regenerating the photography (Gemini)

`scripts/images.json` holds one prompt per image; `scripts/generate-images.mjs` calls the Gemini API (`gemini-3-pro-image`, falling back to `gemini-3.1-flash-image` and `gemini-2.5-flash-image`) and writes WebP files to `public/images`.

```bash
cp .env.example .env.local     # add GEMINI_API_KEY=...
npm run images                 # only missing images
npm run images -- --force      # regenerate all
npm run images -- market-trucks
```

`.env.local` is git-ignored. The landing page falls back to a navy panel if an image is missing.

## Before launch

- Every amber **pending** tag on the proposal marks something the firm must supply or confirm: client logos, coverage by region, engagement details, team names, bios and photos, email and phone.
- The photography is AI-generated for the proposal; approve or replace it.
- The booking form validates and walks through time selection but sends nothing. Wire it to the firm's scheduler (Calendly, HubSpot Meetings, etc.).
- Both pages carry `noindex` while they are a proposal; remove it from `proposal/index.html` when it becomes the live site.

## Layout

```
index.html, proposal/index.html   entry pages
src/audit/                        audit report (content.ts holds every finding)
src/site/                         landing page (data.ts holds every string)
src/site/IsoScene.tsx             the isometric truck and its five layers
src/kit/                          Stageshow kit (MIT) used for the evidence stages
public/shots/                     screenshots of the live site and the proposal
public/images/                    Gemini photography
```
