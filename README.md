################################################################################
#                                                                              #
#                         PROJECT STRUCTURE                                    #
#                                                                              #
################################################################################

/
├── public/
│   └── assets/
│       ├── videos/          # Your MP4 previews go here
│       └── posters/         # Poster images for video fallback
│
├── src/
│   ├── components/          # Static Astro components
│   │   ├── Hero.astro
│   │   ├── ProductCatalog.astro
│   │   ├── ProductCard.astro
│   │   ├── HowItWorks.astro
│   │   ├── FAQ.astro
│   │   └── Footer.astro
│   │
│   ├── islands/             # Interactive client-side components
│   │   ├── CartForm.tsx     # Cart + order form (Preact)
│   │   ├── ContactPopup.tsx # Modal contact form (Preact + GSAP)
│   │   ├── PageAnimations.ts # Scroll animations (GSAP)
│   │   └── FaqAccordion.ts  # FAQ accordion (Vanilla JS)
│   │
│   ├── data/                # All text content — edit these files
│   │   ├── products.js
│   │   ├── steps.js
│   │   └── faqs.js
│   │
│   ├── styles/
│   │   └── design-system.css # CSS custom properties
│   │
│   └── pages/
│       └── index.astro      # Main page
│
├── astro.config.mjs
├── package.json
└── README.md


################################################################################
#                                                                              #
#                         CUSTOMIZATION GUIDE                                  #
#                                                                              #
################################################################################

# ------------------------------------------------------------------------------
# CONTENT EDITING
# ------------------------------------------------------------------------------

# All text content is centralized in the src/data/ directory:

# File              Purpose
# ------------------------------------------------------------------------------
# products.js       Product listings and descriptions
# steps.js          "How It Works" step-by-step guide
# faqs.js           Frequently asked questions


# ------------------------------------------------------------------------------
# STYLING
# ------------------------------------------------------------------------------

# Global design tokens live in src/styles/design-system.css
# Uses CSS custom properties for theming
# Modify colors, spacing, typography in one place


# ------------------------------------------------------------------------------
# MEDIA
# ------------------------------------------------------------------------------

# Add video previews to public/assets/videos/
# Add poster images to public/assets/posters/
# Supported formats: MP4, WebM, JPG, PNG


# ------------------------------------------------------------------------------
# INTERACTIVE COMPONENTS
# ------------------------------------------------------------------------------

# Component            Technology        Purpose
# ------------------------------------------------------------------------------
# CartForm.tsx         Preact            Shopping cart + order form
# ContactPopup.tsx     Preact + GSAP     Modal contact form
# PageAnimations.ts    GSAP              Scroll and entrance animations
# FaqAccordion.ts      Vanilla JS        Accessible accordion


################################################################################
#                                                                              #
#                         QUICK START                                          #
#                                                                              #
################################################################################

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview


################################################################################
#                                                                              #
#                         TECH STACK                                           #
#                                                                              #
################################################################################

# Technology         Purpose
# ------------------------------------------------------------------------------
# Astro              Static site generator
# Preact             Interactive islands
# GSAP               Animations
# CSS                Custom properties + utility classes


################################################################################
#                                                                              #
#                         KEY DIRECTORIES                                      #
#                                                                              #
################################################################################

# Directory           Description
# ------------------------------------------------------------------------------
# public/             Static assets (videos, images, posters)
# src/components/     Static Astro components (no JS)
# src/islands/        Interactive client-side components
# src/data/           All editable content in one place
# src/styles/         Global CSS and design tokens
# src/pages/          Page routes (Astro files)


################################################################################
#                                                                              #
#                         CONFIGURATION                                        #
#                                                                              #
################################################################################

# Edit astro.config.mjs to customize:
# 
# - Build output settings
# - Integration options
# - Server configuration
# - Site metadata


################################################################################
#                                                                              #
#                         PROJECT OVERVIEW                                     #
#                                                                              #
################################################################################

# Aspect               Details
# ------------------------------------------------------------------------------
# Framework            Astro 4.x
# UI Library           Preact
# Animation            GSAP
# Styling              CSS Custom Properties
# Deployment           Static Site


################################################################################
#                                                                              #
#                         CONTRIBUTING                                         #
#                                                                              #
################################################################################

# 1. Fork the repository
# 2. Create a feature branch (git checkout -b feature/amazing)
# 3. Commit changes (git commit -m 'Add amazing feature')
# 4. Push to branch (git push origin feature/amazing)
# 5. Open a Pull Request


################################################################################
#                                                                              #
#                         LICENSE                                              #
#                                                                              #
################################################################################

# This project is licensed under the MIT License
# See the LICENSE file for details


################################################################################
#                                                                              #
#                         SUPPORT                                              #
#                                                                              #
################################################################################

# For questions or issues:
# - Open an issue on GitHub
# - Contact the maintainers
