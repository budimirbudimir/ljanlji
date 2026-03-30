import { config, collection, singleton, fields } from '@keystatic/core'

function BackToSite() {
  return (
    <a
      href="/"
      title="Nazad na sajt"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: 'inherit',
        opacity: 0.6,
        textDecoration: 'none',
        padding: '4px 8px',
        borderRadius: '6px',
        border: '1px solid currentColor',
        whiteSpace: 'nowrap',
      }}
      onMouseOver={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
      onMouseOut={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.6')}
    >
      ← Sajt
    </a>
  )
}

const translatedText = (label: string) =>
  fields.object(
    {
      bs: fields.text({ label: `${label} (Bosanski)` }),
      sr: fields.text({ label: `${label} (Српски)` }),
      de: fields.text({ label: `${label} (Deutsch)` }),
      en: fields.text({ label: `${label} (English)` }),
    },
    { label }
  )

const translatedDocument = (label: string) =>
  fields.object(
    {
      bs: fields.document({ label: `${label} (Bosanski)`, formatting: true, links: true }),
      sr: fields.document({ label: `${label} (Српски)`, formatting: true, links: true }),
      de: fields.document({ label: `${label} (Deutsch)`, formatting: true, links: true }),
      en: fields.document({ label: `${label} (English)`, formatting: true, links: true }),
    },
    { label }
  )

export default config({
  storage:
    process.env.KEYSTATIC_GITHUB_CLIENT_ID
      ? {
          kind: 'github',
          repo: {
            owner: 'budimirbudimir',
            name: 'ljanlji',
          },
        }
      : { kind: 'local' },

  ui: {
    brand: { name: 'Ljanlji', mark: BackToSite },
    navigation: {
      Sadržaj: ['products', 'blogPosts'],
      Stranice: ['homePage', 'aboutPage'],
      Postavke: ['productOrder'],
    },
  },

  collections: {
    products: collection({
      label: 'Proizvodi (Products)',
      slugField: 'slug',
      path: 'src/content/products/*',
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug (URL naziv)' } }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Objavljeno (Published)', value: 'published' },
            { label: 'Skica (Draft)', value: 'draft' },
          ],
          defaultValue: 'published',
        }),
        createdAt: fields.date({ label: 'Datum kreiranja' }),
        featured: fields.checkbox({ label: 'Istaknuto na naslovnici?', defaultValue: false }),
        category: fields.select({
          label: 'Kategorija',
          options: [
            { label: 'Sušeno cvijeće', value: 'dried-flowers' },
            { label: 'Uskrs', value: 'easter' },
            { label: '8. mart', value: 'march-8' },
            { label: 'Božić', value: 'christmas' },
            { label: 'Ostalo', value: 'other' },
          ],
          defaultValue: 'other',
        }),
        images: fields.array(
          fields.image({
            label: 'Slika',
            directory: 'public/images/products',
            publicPath: '/images/products/',
          }),
          { label: 'Fotografije (upload)', itemLabel: (props) => props.value?.filename ?? 'Slika' }
        ),
        imageUrls: fields.array(
          fields.text({ label: 'URL slike', validation: { isRequired: true } }),
          { label: 'Fotografije (URL)', itemLabel: (props) => props.value || 'URL' }
        ),
        title: translatedText('Naziv'),
        description: translatedDocument('Opis'),
      },
    }),

    blogPosts: collection({
      label: 'Blog objave',
      slugField: 'slug',
      path: 'src/content/blog/*',
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug (URL naziv)' } }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Objavljeno', value: 'published' },
            { label: 'Skica', value: 'draft' },
          ],
          defaultValue: 'published',
        }),
        publishedDate: fields.date({ label: 'Datum objave' }),
        coverImage: fields.image({
          label: 'Naslovna slika',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        title: translatedText('Naslov'),
        excerpt: translatedText('Kratki opis'),
        body: translatedDocument('Tekst'),
      },
    }),
  },

  singletons: {
    homePage: singleton({
      label: 'Naslovna stranica',
      path: 'src/content/pages/home',
      format: { data: 'yaml' },
      schema: {
        heroImage: fields.image({
          label: 'Hero slika',
          directory: 'public/images',
          publicPath: '/images/',
          description: 'Slika koja se prikazuje u pozadini naslovnice.',
        }),
        heroTitle: translatedText('Naslov heroja'),
        heroSubtitle: translatedText('Podnaslov heroja'),
        heroCta: translatedText('Dugme heroja'),
      },
    }),

    productOrder: singleton({
      label: 'Redoslijed proizvoda',
      path: 'src/content/pages/product-order',
      format: { data: 'yaml' },
      schema: {
        order: fields.array(
          fields.relationship({ label: 'Proizvod', collection: 'products' }),
          {
            label: 'Redoslijed proizvoda',
            description: 'Prevucite proizvode da promijenite redoslijed prikazivanja.',
            itemLabel: (props) => props.value ?? 'Proizvod',
          }
        ),
      },
    }),

    aboutPage: singleton({
      label: 'O nama stranica',
      path: 'src/content/pages/about',
      format: { data: 'yaml' },
      schema: {
        photo: fields.image({
          label: 'Fotografija',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        title: translatedText('Naslov'),
        body: translatedDocument('Tekst'),
      },
    }),
  },
})
