#!/usr/bin/env node
/**
 * Auto-translate Keystatic content from Bosnian to sr/de/en.
 * Collects all texts needing translation, sends ONE batched request,
 * then distributes results back to YAML and mdoc files.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { readdir, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import yaml from 'js-yaml'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN is not set')
  process.exit(1)
}

const TARGETS = {
  sr: 'Serbian in Cyrillic script (not Latin)',
  de: 'German',
  en: 'English',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Send all texts in one request, get back all languages at once.
 * Input:  [{ id: '0', text: '...' }, ...]
 * Output: { sr: { '0': '...', ... }, de: { ... }, en: { ... } }
 */
async function translateBatch(texts, attempt = 0) {
  const numbered = Object.fromEntries(texts.map(({ id, text }) => [id, text]))
  const langList = Object.keys(TARGETS).join(', ')
  const langDescriptions = Object.entries(TARGETS)
    .map(([code, name]) => `"${code}" → ${name}`)
    .join('; ')

  const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            `You are a professional translator. You will receive a JSON object where keys are numeric IDs and values are Bosnian texts. ` +
            `Translate each text into these languages: ${langDescriptions}. ` +
            `Return a JSON object with language codes as top-level keys (${langList}), ` +
            `each containing an object mapping the same numeric IDs to their translated text. ` +
            `Preserve markdown formatting (bold, italic, bullet lists, line breaks) exactly as-is.`,
        },
        { role: 'user', content: JSON.stringify(numbered) },
      ],
      temperature: 0.2,
    }),
  })

  if (res.status === 429 && attempt < 3) {
    const body = await res.json()
    const waitMatch = body?.error?.message?.match(/wait (\d+) seconds/)
    const waitSec = waitMatch ? parseInt(waitMatch[1]) + 2 : 60
    console.log(`Rate limited — waiting ${waitSec}s...`)
    await sleep(waitSec * 1000)
    return translateBatch(texts, attempt + 1)
  }

  if (!res.ok) {
    throw new Error(`GitHub Models API error ${res.status}: ${await res.text()}`)
  }

  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}

async function run() {
  const collections = [
    { dir: 'src/content/products', mdocSubdir: 'description' },
    { dir: 'src/content/blog', mdocSubdir: 'body' },
  ]

  // Each job: one unique source text that needs translating.
  // applyByLang maps lang → callback that writes the result somewhere.
  const jobs = [] // { id, text, applyByLang: { sr: fn, de: fn, en: fn } }
  const dirtyYamls = new Map() // filePath → { doc }

  for (const { dir, mdocSubdir } of collections) {
    const files = (await readdir(dir)).filter((f) => f.endsWith('.yaml'))

    for (const file of files) {
      const filePath = join(dir, file)
      const slug = file.replace('.yaml', '')
      const doc = yaml.load(readFileSync(filePath, 'utf8'))

      // YAML text fields — one job per (field, source text) with callbacks per lang
      for (const field of ['title', 'excerpt']) {
        if (!doc[field] || typeof doc[field] !== 'object') continue
        const source = doc[field].bs
        if (!source?.trim()) continue

        const missingLangs = Object.keys(TARGETS).filter((l) => !doc[field][l]?.trim())
        if (missingLangs.length === 0) continue

        const id = String(jobs.length)
        const applyByLang = {}
        for (const lang of missingLangs) {
          applyByLang[lang] = (translated) => {
            doc[field][lang] = translated
            dirtyYamls.set(filePath, { doc })
          }
        }
        jobs.push({ id, text: source, applyByLang })
      }

      // mdoc files — one job per source text, callbacks write target files
      const bsPath = join(dir, slug, mdocSubdir, 'bs.mdoc')
      if (!existsSync(bsPath)) continue
      const bsContent = readFileSync(bsPath, 'utf8').trim()
      if (!bsContent) continue

      const missingLangs = Object.keys(TARGETS).filter((lang) => {
        const targetPath = join(dir, slug, mdocSubdir, `${lang}.mdoc`)
        return !existsSync(targetPath) || !readFileSync(targetPath, 'utf8').trim()
      })
      if (missingLangs.length === 0) continue

      const id = String(jobs.length)
      const applyByLang = {}
      for (const lang of missingLangs) {
        const targetPath = join(dir, slug, mdocSubdir, `${lang}.mdoc`)
        applyByLang[lang] = async (translated) => {
          await mkdir(dirname(targetPath), { recursive: true })
          writeFileSync(targetPath, translated + '\n')
          console.log(`  wrote ${targetPath}`)
        }
      }
      jobs.push({ id, text: bsContent, applyByLang })
    }
  }

  if (jobs.length === 0) {
    console.log('Nothing to translate.')
    return
  }

  console.log(`Sending ${jobs.length} text(s) for translation...`)

  const translations = await translateBatch(jobs.map(({ id, text }) => ({ id, text })))

  // Apply results
  for (const job of jobs) {
    for (const [lang, apply] of Object.entries(job.applyByLang)) {
      const translated = translations?.[lang]?.[job.id]
      if (translated) {
        await apply(translated)
      } else {
        console.warn(`  Missing translation id=${job.id} lang=${lang}`)
      }
    }
  }

  // Save dirty YAML files
  for (const [filePath, { doc }] of dirtyYamls) {
    writeFileSync(filePath, yaml.dump(doc, { lineWidth: -1, forceQuotes: false }))
    console.log(`  wrote ${filePath}`)
  }

  console.log('\nDone.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
