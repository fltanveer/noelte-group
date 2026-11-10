// Generates the landing-page photography with Gemini and writes optimised WebP
// files to public/images. Run locally once: `npm run images` (reads .env.local).
// Generated files are committed, so Vercel never needs the key.
//   npm run images                 -> only missing images
//   npm run images -- --force      -> regenerate all
//   npm run images -- market-trucks -> just these names
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public/images')
const key = process.env.GEMINI_API_KEY
if (!key) { console.error('GEMINI_API_KEY missing. Add it to .env.local'); process.exit(1) }

const MODELS = [process.env.GEMINI_IMAGE_MODEL, 'gemini-3-pro-image', 'gemini-3.1-flash-image', 'gemini-2.5-flash-image'].filter(Boolean)
const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.filter((a) => !a.startsWith('--'))
const { style, images } = JSON.parse(await readFile(join(root, 'scripts/images.json'), 'utf8'))
await mkdir(outDir, { recursive: true })

const exists = (p) => access(p).then(() => true, () => false)

async function generate(model, img) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${img.prompt}\n\n${style}` }] }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: img.aspect } },
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`${res.status} ${data.error?.message ?? ''}`.slice(0, 240))
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)
  if (!part) throw new Error('no image in response: ' + JSON.stringify(data).slice(0, 240))
  return Buffer.from(part.inlineData.data, 'base64')
}

for (const img of images) {
  if (only.length && !only.includes(img.name)) continue
  const file = join(outDir, `${img.name}.webp`)
  if (!force && !only.length && (await exists(file))) { console.log('skip', img.name); continue }
  let done = false
  for (const model of MODELS) {
    try {
      const buf = await generate(model, img)
      await mkdir(join(root, 'scripts/.cache'), { recursive: true })
      await writeFile(join(root, 'scripts/.cache', `${img.name}.png`), buf)
      await sharp(buf).resize({ width: img.aspect === '21:9' ? 2400 : 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file)
      console.log('ok  ', img.name, 'via', model)
      done = true
      break
    } catch (e) {
      console.warn('fail', img.name, model, e.message)
    }
  }
  if (!done) process.exitCode = 1
}
