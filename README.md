# La Jolla Freedive Club — lajollafreediveclub.com

## Quick Start

```bash
# Extract the project
tar -xzf ljfc-site.tar.gz
cd ljfc

# Install dependencies
npm install

# Run locally
npm run dev
# → Opens at http://localhost:3000

# Build for production
npm run build
```

## Deploy to Vercel (Recommended)

Vercel is the fastest path to production. Free tier covers everything you need.

### Option A: CLI Deploy (fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# From the project directory
cd ljfc
vercel

# Follow prompts, then add your custom domain:
vercel domains add lajollafreediveclub.com
```

### Option B: GitHub → Vercel (recommended for ongoing)
1. Push this project to a GitHub repo
2. Go to vercel.com → New Project → Import from GitHub
3. Vercel auto-detects Next.js — just click Deploy
4. Add custom domain in Vercel dashboard → Settings → Domains
5. Update your domain's DNS to point to Vercel (they'll show you the records)

Every push to main will auto-deploy.

## Project Structure

```
ljfc/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (nav, footer, metadata)
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Tailwind + custom styles
│   │   ├── sitemap.ts          # Auto-generated sitemap
│   │   ├── robots.ts           # robots.txt
│   │   ├── programs/
│   │   │   └── page.tsx        # Programs listing
│   │   ├── camp-garibaldi/
│   │   │   └── page.tsx        # Camp Garibaldi page
│   │   ├── about/
│   │   │   └── page.tsx        # About + FAQ
│   │   ├── contact/
│   │   │   └── page.tsx        # Contact / lead capture form
│   │   └── blog/
│   │       ├── page.tsx        # Blog index
│   │       └── [slug]/
│   │           └── page.tsx    # Individual blog posts
│   ├── components/
│   │   ├── Nav.tsx             # Navigation (sticky, mobile menu)
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Logo.tsx            # SVG logo mark
│   │   ├── EmailCapture.tsx    # Email signup component
│   │   └── Reveal.tsx          # Scroll-reveal animation
│   └── lib/
│       └── blog.ts             # Blog post data + helpers
└── tailwind.config.ts          # Brand colors + fonts
```

## Adding New Blog Posts

1. Open src/lib/blog.ts
2. Add a new entry to the posts array:

```typescript
{
  slug: "your-url-slug",
  title: "Your Post Title",
  description: "SEO meta description",
  category: "Training",
  date: "April 2026",
  readTime: "8 min read",
  gradient: "from-ocean to-teal",
  content: `<p>Your HTML content here...</p>`,
}
```

3. The blog index and sitemap update automatically.

## Connecting Email Capture

The email form is ready to wire up. Options:

### ConvertKit (recommended for creators)
In src/components/EmailCapture.tsx, replace the TODO with:
```typescript
await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ api_key: 'YOUR_API_KEY', email }),
});
```

### Formspree (simplest for contact form)
In src/app/contact/page.tsx:
```typescript
await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

## Post-Launch Checklist

- [ ] Deploy to Vercel + connect domain
- [ ] Set up Google Search Console (verify ownership)
- [ ] Submit sitemap: https://lajollafreediveclub.com/sitemap.xml
- [ ] Create Google Business Profile (critical for local SEO)
- [ ] Set up email service (ConvertKit / Mailchimp)
- [ ] Connect contact form (Formspree or similar)
- [ ] Add real photos to replace gradient placeholders
- [ ] Set up analytics (Google Analytics or Plausible)
- [ ] Create social accounts (Instagram, TikTok, YouTube)
- [ ] Start publishing blog content per the 12-month calendar

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Hosting:** Vercel (recommended)
- **SEO:** Built-in sitemap, robots.txt, structured data, meta tags
