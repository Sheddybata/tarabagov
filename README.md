# Taraba State Unified Citizen Portal

A secure e-governance platform for Taraba State Government built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage)
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Sidebar and Header
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles and Tailwind config
├── components/
│   ├── layout/            # Layout components (Sidebar, Header)
│   └── ui/                # Shadcn/UI components
├── lib/
│   ├── supabase/          # Supabase client configuration
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Design System

### Colors
- **Primary**: Deep Green (#1B5E20) - Taraba State theme
- **Accent**: Gold (#D4AF37) - Official accent color
- **Background**: White with gray-50 for content areas

### Typography
- **Font**: Inter (Google Fonts)
- Clean, professional sans-serif typography

## Features

- ✅ Responsive Sidebar Navigation
- ✅ Top Header with Coat of Arms and User Profile
- ✅ Professional, accessible design
- ✅ Supabase integration ready
- ✅ Form validation setup (React Hook Form + Zod)

## Next Steps

1. Set up Supabase database schema
2. Implement authentication
3. Add form components with validation
4. Create service pages
5. Add more features as needed

## License

© 2024 Taraba State Government. All rights reserved.

