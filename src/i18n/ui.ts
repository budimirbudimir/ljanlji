export type Locale = 'bs' | 'sr' | 'de' | 'en'

export const locales: Locale[] = ['bs', 'sr', 'de', 'en']
export const defaultLocale: Locale = 'bs'

export const localeNames: Record<Locale, string> = {
  bs: 'Bosanski',
  sr: 'Српски',
  de: 'Deutsch',
  en: 'English',
}

export const ui = {
  bs: {
    // Nav
    'nav.home': 'Početna',
    'nav.products': 'Proizvodi',
    'nav.blog': 'Blog',
    'nav.about': 'O nama',
    'nav.contact': 'Kontakt',

    // Hero (fallback — real content comes from Keystatic)
    'hero.title': 'Ukras koji priča priču',
    'hero.subtitle': 'Ručni rad iz srca Balkana — sušeno cvijeće, uskršnje korpe i sezonski dekor.',
    'hero.cta': 'Pogledaj proizvode',

    // Products
    'products.title': 'Naši proizvodi',
    'products.filterAll': 'Sve',
    'products.empty': 'Nema proizvoda u ovoj kategoriji.',
    'products.viewProduct': 'Pogledaj',
    'products.photos': 'Fotografije',

    // Categories
    'cat.dried-flowers': 'Sušeno cvijeće',
    'cat.easter': 'Uskrs',
    'cat.march-8': '8. mart',
    'cat.christmas': 'Božić',
    'cat.other': 'Ostalo',

    // Blog
    'blog.title': 'Blog',
    'blog.subtitle': 'Priče iz atelje',
    'blog.readMore': 'Pročitaj više',
    'blog.published': 'Objavljeno',

    // About
    'about.title': 'O nama',

    // Contact
    'contact.title': 'Kontakt',
    'contact.subtitle': 'Pišite nam',
    'contact.name': 'Ime i prezime',
    'contact.email': 'Email adresa',
    'contact.message': 'Poruka',
    'contact.send': 'Pošalji poruku',
    'contact.sending': 'Šalje se...',
    'contact.success': 'Poruka je poslana! Javit ćemo se uskoro.',
    'contact.error': 'Nešto nije prošlo. Pokušajte ponovo ili nas kontaktirajte direktno.',
    'contact.phone': 'Telefon',
    'contact.address': 'Adresa',
    'contact.cta': 'Kontaktirajte nas',
    'contact.follow': 'Pratite nas',
    'contact.phonePlaceholder': '+387 66 321 916',
    'contact.emailPlaceholder': 'ljiljana3777@gmail.com',
    'contact.addressPlaceholder': 'Prijedor, Bosna i Hercegovina',

    // Footer
    'footer.tagline': 'Ručni rad iz srca Balkana',
    'footer.copyright': '© 2025 Ljanlji. Sva prava zadržana.',
    'footer.followUs': 'Pratite nas',

    // Social
    'social.facebook': 'Facebook',
    'social.instagram': 'Instagram',
  },

  sr: {
    'nav.home': 'Почетна',
    'nav.products': 'Производи',
    'nav.blog': 'Блог',
    'nav.about': 'О нама',
    'nav.contact': 'Контакт',

    'hero.title': 'Украс који прича причу',
    'hero.subtitle': 'Ручни рад из срца Балкана — сушено цвијеће, ускршње корпе и сезонски декор.',
    'hero.cta': 'Погледај производе',

    'products.title': 'Наши производи',
    'products.filterAll': 'Све',
    'products.empty': 'Нема производа у овој категорији.',
    'products.viewProduct': 'Погледај',
    'products.photos': 'Фотографије',

    'cat.dried-flowers': 'Сушено цвијеће',
    'cat.easter': 'Ускрс',
    'cat.march-8': '8. март',
    'cat.christmas': 'Божић',
    'cat.other': 'Остало',

    'blog.title': 'Блог',
    'blog.subtitle': 'Приче из атељеа',
    'blog.readMore': 'Прочитај више',
    'blog.published': 'Објављено',

    'about.title': 'О нама',

    'contact.title': 'Контакт',
    'contact.subtitle': 'Пишите нам',
    'contact.name': 'Име и презиме',
    'contact.email': 'Емаил адреса',
    'contact.message': 'Порука',
    'contact.send': 'Пошаљи поруку',
    'contact.sending': 'Шаље се...',
    'contact.success': 'Порука је послата! Јавићемо се ускоро.',
    'contact.error': 'Нешто није прошло. Покушајте поново или нас контактирајте директно.',
    'contact.phone': 'Телефон',
    'contact.address': 'Адреса',
    'contact.cta': 'Контактирајте нас',
    'contact.follow': 'Пратите нас',
    'contact.phonePlaceholder': '+387 66 321 916',
    'contact.emailPlaceholder': 'ljiljana3777@gmail.com',
    'contact.addressPlaceholder': 'Приједор, Босна и Херцеговина',

    'footer.tagline': 'Ручни рад из срца Балкана',
    'footer.copyright': '© 2025 Ljanlji. Сва права задржана.',
    'footer.followUs': 'Пратите нас',

    'social.facebook': 'Facebook',
    'social.instagram': 'Instagram',
  },

  de: {
    'nav.home': 'Startseite',
    'nav.products': 'Produkte',
    'nav.blog': 'Blog',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',

    'hero.title': 'Dekor, der Geschichten erzählt',
    'hero.subtitle': 'Handgemacht aus dem Herzen des Balkans — Trockenblumen, Osterkörbe und saisonaler Schmuck.',
    'hero.cta': 'Produkte ansehen',

    'products.title': 'Unsere Produkte',
    'products.filterAll': 'Alle',
    'products.empty': 'Keine Produkte in dieser Kategorie.',
    'products.viewProduct': 'Ansehen',
    'products.photos': 'Fotos',

    'cat.dried-flowers': 'Trockenblumen',
    'cat.easter': 'Ostern',
    'cat.march-8': '8. März',
    'cat.christmas': 'Weihnachten',
    'cat.other': 'Sonstiges',

    'blog.title': 'Blog',
    'blog.subtitle': 'Geschichten aus dem Atelier',
    'blog.readMore': 'Weiterlesen',
    'blog.published': 'Veröffentlicht',

    'about.title': 'Über uns',

    'contact.title': 'Kontakt',
    'contact.subtitle': 'Schreiben Sie uns',
    'contact.name': 'Vor- und Nachname',
    'contact.email': 'E-Mail-Adresse',
    'contact.message': 'Nachricht',
    'contact.send': 'Nachricht senden',
    'contact.sending': 'Wird gesendet...',
    'contact.success': 'Nachricht gesendet! Wir melden uns bald.',
    'contact.error': 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    'contact.phone': 'Telefon',
    'contact.address': 'Adresse',
    'contact.cta': 'Kontaktieren Sie uns',
    'contact.follow': 'Folgen Sie uns',
    'contact.phonePlaceholder': '+387 66 321 916',
    'contact.emailPlaceholder': 'ljiljana3777@gmail.com',
    'contact.addressPlaceholder': 'Prijedor, Bosnien und Herzegowina',

    'footer.tagline': 'Handgemacht aus dem Herzen des Balkans',
    'footer.copyright': '© 2025 Ljanlji. Alle Rechte vorbehalten.',
    'footer.followUs': 'Folgen Sie uns',

    'social.facebook': 'Facebook',
    'social.instagram': 'Instagram',
  },

  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.contact': 'Contact',

    'hero.title': 'Decor that tells a story',
    'hero.subtitle': 'Handcrafted from the heart of the Balkans — dried flowers, Easter baskets and seasonal decoration.',
    'hero.cta': 'View products',

    'products.title': 'Our products',
    'products.filterAll': 'All',
    'products.empty': 'No products in this category.',
    'products.viewProduct': 'View',
    'products.photos': 'Photos',

    'cat.dried-flowers': 'Dried flowers',
    'cat.easter': 'Easter',
    'cat.march-8': "March 8th",
    'cat.christmas': 'Christmas',
    'cat.other': 'Other',

    'blog.title': 'Blog',
    'blog.subtitle': 'Stories from the atelier',
    'blog.readMore': 'Read more',
    'blog.published': 'Published',

    'about.title': 'About us',

    'contact.title': 'Contact',
    'contact.subtitle': 'Get in touch',
    'contact.name': 'Full name',
    'contact.email': 'Email address',
    'contact.message': 'Message',
    'contact.send': 'Send message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message sent! We\'ll get back to you soon.',
    'contact.error': 'Something went wrong. Please try again or contact us directly.',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.cta': 'Contact us',
    'contact.follow': 'Follow us',
    'contact.phonePlaceholder': '+387 66 321 916',
    'contact.emailPlaceholder': 'ljiljana3777@gmail.com',
    'contact.addressPlaceholder': 'Prijedor, Bosnia and Herzegovina',

    'footer.tagline': 'Handcrafted from the heart of the Balkans',
    'footer.copyright': '© 2025 Ljanlji. All rights reserved.',
    'footer.followUs': 'Follow us',

    'social.facebook': 'Facebook',
    'social.instagram': 'Instagram',
  },
} as const

export type UiKey = keyof typeof ui.bs

export function t(locale: Locale, key: UiKey): string {
  return (ui[locale] as Record<string, string>)[key] ?? (ui.bs as Record<string, string>)[key] ?? key
}

const pluralStrings: Record<Locale, Record<string, Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }>> = {
  bs: {
    photos: { one: 'fotografija', few: 'fotografije', other: 'fotografija' },
  },
  sr: {
    photos: { one: 'fotografija', few: 'fotografije', other: 'fotografija' },
  },
  de: {
    photos: { one: 'Foto', other: 'Fotos' },
  },
  en: {
    photos: { one: 'photo', other: 'photos' },
  },
}

export function plural(locale: Locale, key: string, count: number): string {
  const forms = pluralStrings[locale]?.[key]
  if (!forms) return key
  const category = new Intl.PluralRules(locale).select(count)
  return forms[category] ?? forms.other
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/')
  if (locales.includes(lang as Locale)) return lang as Locale
  return defaultLocale
}
