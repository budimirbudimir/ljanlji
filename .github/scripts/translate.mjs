#!/usr/bin/env node
/**
 * Auto-translate Keystatic content from Bosnian to sr/de/en.
 * Called by the GitHub Action on every push that touches src/content/.
 * Uses GitHub Models API (gpt-4o-mini) with the built-in GITHUB_TOKEN.
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
  sr: 'Serbian written in Cyrillic script (not Latin)',
  de: 'German',
  en: 'English',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function translate(text, targetLang) {
  await sleep(300) // stay well within rate limits

  const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            `You are a professional translator. Translate the following text from Bosnian to ${TARGETS[targetLang]}. ` +
            `Return only the translated text — no explanations, no quotes around the result. ` +
            `Preserve any markdown formatting (bold, italic, bullet lists, line breaks) exactly as-is.`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.2,
    }),
  })

  if (!res.ok) {
    throw new Error(`GitHub Models API error ${res.status}: ${await res.text()}`)
  }

  const data = await res.json()
  return data.choices[0].message.content.trim()
}

/** Translate empty lang fields in a product/blog YAML file. */
async function processYaml(filePath) {
  const raw = readFileSync(filePath, 'utf8')
  const doc = yaml.load(raw)
  let changed = false

  for (const field of ['title', 'excerpt']) {
    if (!doc[field] || typeof doc[field] !== 'object') continue
    const source = doc[field].bs
    if (!source?.trim()) continue

    for (const lang of Object.keys(TARGETS)) {
      if (!doc[field][lang]?.trim()) {
        console.log(`  translating [${lang}] ${field}`)
        doc[field][lang] = await translate(source, lang)
        changed = true
      }
    }
  }

  if (changed) {
    writeFileSync(filePath, yaml.dump(doc, { lineWidth: -1, forceQuotes: false }))
  }
  return changed
}

/** Translate an empty target mdoc from the Bosnian source mdoc. */
async function processMdoc(bsPath, lang, targetPath) {
  if (!existsSync(bsPath)) return false
  const source = readFileSync(bsPath, 'utf8').trim()
  if (!source) return false

  const existing = existsSync(targetPath) ? readFileSync(targetPath, 'utf8').trim() : ''
  if (existing) return false

  console.log(`  translating [${lang}] ${targetPath}`)
  const translated = await translate(source, lang)
  await mkdir(dirname(targetPath), { recursive: true })
  writeFileSync(targetPath, translated + '\n')
  return true
}

async function run() {
  let totalChanged = 0

  const collections = [
    { dir: 'src/content/products', mdocSubdir: 'description' },
    { dir: 'src/content/blog', mdocSubdir: 'body' },
  ]

  for (const { dir, mdocSubdir } of collections) {
    const files = (await readdir(dir)).filter((f) => f.endsWith('.yaml'))

    for (const file of files) {
      const slug = file.replace('.yaml', '')
      console.log(`\n${slug}`)

      if (await processYaml(join(dir, file))) totalChanged++

      const bsPath = join(dir, slug, mdocSubdir, 'bs.mdoc')
      for (const lang of Object.keys(TARGETS)) {
        const targetPath = join(dir, slug, mdocSubdir, `${lang}.mdoc`)
        if (await processMdoc(bsPath, lang, targetPath)) totalChanged++
      }
    }
  }

  console.log(`\nDone — ${totalChanged} file(s) updated.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
