# EBOMI International Bible Academy Portal

A modern, professional website for EBOMI International Bible Academy built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✅ Clean, professional design
- ✅ Responsive mobile-first layout
- ✅ All 10 academic programs showcased
- ✅ Program detail pages
- ✅ About page with vision and values
- ✅ Admissions information and process
- ✅ Contact form
- ✅ Fast performance and SEO optimized

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd eiba-portal
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
eiba-portal/
├── app/                    # Next.js app directory
│   ├── about/              # About page
│   ├── admissions/        # Admissions page
│   ├── contact/           # Contact page
│   ├── programs/          # Programs listing and detail pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── home/              # Homepage components
│   ├── layout/            # Header and Footer
│   ├── programs/          # Program-related components
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and data
│   ├── data/              # Programs data
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Design System

### Colors
- **Primary Blue:** `#1a365d` - Trust, stability, wisdom
- **Gold:** `#d97706` - Excellence, divine light
- **Light Blue:** `#3b82f6` - Hope, faith
- **Gray:** `#64748b` - Professional, neutral

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)

## Build for Production

```bash
npm run build
npm start
```

## Deployment

This project can be deployed on:
- Vercel (recommended for Next.js)
- Netlify
- Any platform that supports Next.js

## License

Private - EBOMI International Bible Academy


