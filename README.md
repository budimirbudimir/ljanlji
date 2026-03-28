# Ljanlji — Website

Astro 5 + Keystatic CMS + Cloudflare Pages

## Local development

```bash
bun install
cp .env.example .env   # fill in values
bun dev                # http://localhost:4321
```

Keystatic admin runs at `http://localhost:4321/keystatic` in local mode — no login needed during development.

## Deployment (Cloudflare Pages)

### 1. Push repo to GitHub

Create a repo at github.com and push this project.

### 2. Connect to Cloudflare Pages

1. Go to Cloudflare dashboard → Workers & Pages → Create application → Pages
2. Connect to GitHub → select the `ljanlji` repo
3. Build settings:
   - Framework: Astro
   - Build command: `npx astro build` (or `bun run build`)
   - Output directory: `dist`
4. Click **Save and Deploy**

### 3. Set environment variables in Cloudflare Pages

Settings → Environment variables → Add all vars from `.env.example`:
- `RESEND_API_KEY`
- `CONTACT_TO`
- `CONTACT_FROM`
- `GITHUB_REPO_OWNER`
- `GITHUB_REPO_NAME`
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET`

### 4. Set up GitHub OAuth App (one-time, for the /keystatic admin)

1. Go to github.com → Settings → Developer settings → OAuth Apps → **New OAuth App**
2. Fill in:
   - Application name: `Ljanlji CMS`
   - Homepage URL: `https://ljanlji.com`
   - Authorization callback URL: `https://ljanlji.com/api/keystatic/github/oauth/callback`
3. Click **Register application**
4. Copy **Client ID** → paste as `KEYSTATIC_GITHUB_CLIENT_ID` in Cloudflare
5. Generate a **Client Secret** → paste as `KEYSTATIC_GITHUB_CLIENT_SECRET`

### 5. Set up Resend (free email)

1. Go to resend.com → sign up (free, no credit card)
2. Add your domain `ljanlji.com` → verify DNS records in Cloudflare
3. Create an API key → paste as `RESEND_API_KEY`

### 6. Add custom domain

Cloudflare Pages → your project → Custom domains → `ljanlji.com`
(Since your domain is already on Cloudflare DNS, this is one click.)

---

## How to add content (for the website owner)

### Add a new product

1. Go to `https://ljanlji.com/keystatic`
2. Log in with your GitHub account
3. Click **Proizvodi (Products)** in the left menu
4. Click the green **+ Add entry** button
5. Fill in:
   - **Naziv (Title)** — fill all 4 languages (Bosanski, Српски, Deutsch, English)
   - **Kategorija** — pick from the dropdown
   - **Fotografije** — click "Add item", then upload photos (drag & drop)
   - **Istaknuto na naslovnici** — tick if it should appear on the home page
6. Set **Status** to **Objavljeno (Published)**
7. Click **Create** (top right)
8. ✅ Done — the site rebuilds in ~30 seconds

### Add a blog post

Same steps, but click **Blog objave** instead of **Proizvodi**.

---

## Stack

- **Astro 5** — static site with hybrid rendering
- **Keystatic** — git-based CMS, admin at `/keystatic`
- **Cloudflare Pages** — free hosting, global CDN
- **Resend** — transactional email (contact form), 3000/month free
- **yet-another-react-lightbox** — product photo lightbox
