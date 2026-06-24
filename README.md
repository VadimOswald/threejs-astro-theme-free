🛠️ Customization Guide
📝 Content Editing
All text content is centralized in the src/data/ directory:

File	Purpose
products.js	Product listings and descriptions
steps.js	"How It Works" step-by-step guide
faqs.js	Frequently asked questions
🎨 Styling
Global design tokens live in src/styles/design-system.css

Uses CSS custom properties for theming

Modify colors, spacing, typography in one place

🖼️ Media
Add video previews to public/assets/videos/

Add poster images to public/assets/posters/

Supported formats: MP4, WebM, JPG, PNG

⚡ Interactive Components
Component	Technology	Purpose
CartForm.tsx	Preact	Shopping cart + order form
ContactPopup.tsx	Preact + GSAP	Modal contact form
PageAnimations.ts	GSAP	Scroll and entrance animations
FaqAccordion.ts	Vanilla JS	Accessible accordion
🚀 Quick Start
bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
📦 Tech Stack
Technology	Purpose
Astro	Static site generator
Preact	Interactive islands
GSAP	Animations
CSS	Custom properties + utility classes
📂 Key Directories
Directory	Description
public/	Static assets (videos, images, posters)
src/components/	Static Astro components (no JS)
src/islands/	Interactive client-side components
src/data/	All editable content in one place
src/styles/	Global CSS and design tokens
src/pages/	Page routes (Astro files)
🔧 Configuration
Edit astro.config.mjs to customize:

Build output settings

Integration options

Server configuration

Site metadata
