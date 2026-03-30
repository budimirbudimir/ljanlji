/**
 * Helpers for reading Keystatic content files.
 * Keystatic stores YAML files in src/content/ — we read them
 * directly using Astro's glob imports rather than the Keystatic
 * reader SDK to keep things simple and build-time-friendly.
 */

import type { Locale } from '@/i18n/ui'

export type ProductData = {
  slug: string
  status: 'published' | 'draft'
  createdAt: string | null
  featured: boolean
  category: string
  images: string[]
  title: Record<Locale, string>
  description: Record<Locale, object[]> // document nodes
}

export type BlogPostData = {
  slug: string
  status: 'published' | 'draft'
  publishedDate: string
  coverImage: string
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  body: Record<Locale, object[]>
}

export type HomePageData = {
  heroTitle: Record<Locale, string>
  heroSubtitle: Record<Locale, string>
  heroCta: Record<Locale, string>
}

export type AboutPageData = {
  photo: string
  title: Record<Locale, string>
  body: Record<Locale, object[]>
}

/** Pick the correct locale string, falling back to Bosnian */
export function pick<T>(obj: Record<string, T> | undefined | null, locale: Locale): T {
  if (!obj) return '' as unknown as T
  return (obj[locale] ?? obj['bs'] ?? Object.values(obj)[0]) as T
}
