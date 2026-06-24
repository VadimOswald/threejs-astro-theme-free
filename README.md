3D Assets Store
A single-page Astro theme for selling exclusive Three.js scenes. Video previews, cart, order form, manual payment flow. One buyer per asset, no double selling.

Quick Start
bash
# Clone the repo
git clone <your-repo-url> my-3d-store
cd my-3d-store

# Install dependencies
npm install

# Start dev server
npm run dev
Open http://localhost:4321 in your browser.

Project Structure
text
/
├── public/assets/
│   ├── videos/          # Your MP4 previews go here
│   └── posters/         # Poster images for video fallback
├── src/
│   ├── components/      # Static Astro components
│   │   ├── Hero.astro
│   │   ├── ProductCatalog.astro
│   │   ├── ProductCard.astro
│   │   ├── HowItWorks.astro
│   │   ├── FAQ.astro
│   │   └── Footer.astro
│   ├── islands/         # Interactive client-side components
│   │   ├── CartForm.tsx          # Cart + order form (Preact)
│   │   ├── ContactPopup.tsx      # Modal contact form (Preact + GSAP)
│   │   ├── PageAnimations.ts     # Scroll animations (GSAP)
│   │   └── FaqAccordion.ts       # FAQ accordion (Vanilla JS)
│   ├── data/            # All text content — edit these files
│   │   ├── products.js
│   │   ├── steps.js
│   │   └── faqs.js
│   ├── styles/
│   │   └── design-system.css     # CSS custom properties
│   └── pages/
│       └── index.astro           # Main page
└── astro.config.mjs
Customization
1. Add your products
Edit src/data/products.js:

js
export const products = [
  {
    id: "your-product-id",
    name: "Your Product Name",
    description: "Your description here.",
    price: 29,
    videoSrc: "/assets/videos/your-video.mp4",
    posterSrc: "/assets/posters/your-poster.jpg"
  },
  // Add or remove products as needed
];
2. Update text content
Edit the files in src/data/:

products.js — product names, descriptions, prices

steps.js — "How It Works" steps

faqs.js — FAQ questions and answers

3. Rebrand the design
Edit src/styles/design-system.css. All colors, fonts, spacing, and radii are CSS custom properties. Change them and the whole site updates.

css
:root {
  --color-primary: #your-color;
  --font-heading: 'Your Font', sans-serif;
  --spacing-section: 6rem;
  /* ... and more */
}
4. Set your form endpoint
In src/islands/CartForm.tsx, update the fetch URL:

ts
const response = await fetch("https://your-endpoint.com/submit", {
  method: "POST",
  // ...
});
Do the same in src/islands/ContactPopup.tsx for the contact form.

You can point these at:

A serverless function (Vercel, Netlify, Cloudflare)

A Telegram bot webhook

An email service like Resend or SendGrid

A Google Apps Script endpoint

Anything that accepts POST requests

5. Update page metadata
Edit the <head> section in src/pages/index.astro:

Page title

Meta description

Open Graph image