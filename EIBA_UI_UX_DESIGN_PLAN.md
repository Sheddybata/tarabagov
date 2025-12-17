# EIBA Portal - UI/UX Design Plan (Phase 1)
## Senior UI/UX Designer Approach

---

## 🎯 Design Philosophy

**Goal:** Create a clean, professional, spiritually-inspired website that reflects the academy's mission while maintaining academic credibility and modern web standards.

**Key Principles:**
- **Clarity:** Easy navigation, clear information hierarchy
- **Professionalism:** Academic credibility with spiritual warmth
- **Accessibility:** WCAG 2.1 AA compliance
- **Responsiveness:** Mobile-first design
- **Performance:** Fast loading, optimized images
- **Trust:** Professional design builds confidence in the institution

---

## 📐 Site Structure & Navigation

### Main Navigation (Header)
```
[Logo]  Home | Programs | About | Admissions | Contact
```

### Footer Navigation
```
Quick Links:
- Home
- Programs
- About Us
- Admissions
- Contact

Programs:
- [All 10 programs listed]

Contact:
- Address
- Email
- Phone
- Social Media
```

### Page Structure:
1. **Homepage** (`/`)
2. **Programs** (`/programs`)
   - All Programs Overview
   - Individual Program Pages (`/programs/[slug]`)
3. **About** (`/about`)
4. **Admissions** (`/admissions`)
5. **Contact** (`/contact`)

---

## 🎨 Design System

### Color Palette

**Primary Colors:**
- **Deep Blue/Navy:** `#1a365d` or `#0f172a` (Trust, stability, wisdom)
- **Gold/Amber:** `#d97706` or `#f59e0b` (Excellence, divine light)
- **White:** `#ffffff` (Purity, clarity)

**Secondary Colors:**
- **Light Blue:** `#3b82f6` (Hope, faith)
- **Warm Gray:** `#64748b` (Neutral, professional)
- **Light Gray:** `#f1f5f9` (Background, subtle)

**Accent Colors:**
- **Green:** `#059669` (Growth, life)
- **Purple:** `#7c3aed` (Spiritual, royal)

**Usage:**
- Primary Blue: Headers, CTAs, navigation
- Gold: Accents, highlights, important info
- White: Background, text on dark
- Light Gray: Section backgrounds, cards

### Typography

**Headings:**
- **Font:** Inter, Poppins, or Playfair Display (elegant serif for headings)
- **Sizes:** 
  - H1: `3.5rem` (56px) - Hero titles
  - H2: `2.5rem` (40px) - Section titles
  - H3: `1.875rem` (30px) - Subsection titles
  - H4: `1.5rem` (24px) - Card titles

**Body:**
- **Font:** Inter or Open Sans (clean, readable)
- **Size:** `1rem` (16px) base, `1.125rem` (18px) for readability
- **Line Height:** `1.75` for body, `1.5` for headings

**Special:**
- **Script/Quotes:** Playfair Display or similar (for vision statement, quotes)

### Spacing System

**Base Unit:** `4px` (0.25rem)

**Scale:**
- `xs`: `0.5rem` (8px)
- `sm`: `1rem` (16px)
- `md`: `1.5rem` (24px)
- `lg`: `2rem` (32px)
- `xl`: `3rem` (48px)
- `2xl`: `4rem` (64px)
- `3xl`: `6rem` (96px)

### Component Styles

**Buttons:**
- Primary: Blue background, white text, rounded `0.5rem`
- Secondary: White background, blue text, border
- CTA: Gold background, dark text, larger padding

**Cards:**
- White background
- Subtle shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Rounded corners: `0.75rem`
- Padding: `1.5rem`

**Sections:**
- Alternating backgrounds (white/light gray)
- Padding: `4rem` vertical, `1.5rem` horizontal (mobile: `2rem` vertical)

---

## 📱 Page Layouts

### 1. Homepage (`/`)

#### Hero Section
- **Full-width background:** Deep blue gradient or subtle pattern
- **Content:**
  - Large logo (centered or left-aligned)
  - Vision statement (prominent, elegant typography)
  - Subheading: Brief tagline
  - CTA buttons: "Explore Programs" | "Apply Now"
- **Height:** `80vh` (viewport height) on desktop, `60vh` on mobile
- **Overlay:** Subtle dark overlay for text readability

#### Programs Preview Section
- **Title:** "Our Academic Programs"
- **Layout:** Grid of 10 program cards
  - Desktop: 3 columns
  - Tablet: 2 columns
  - Mobile: 1 column
- **Card Design:**
  - Icon or image (optional)
  - Program name
  - Brief description (2-3 lines)
  - "Learn More" link
- **CTA:** "View All Programs" button at bottom

#### About Preview Section
- **Layout:** Split layout (image left, content right on desktop)
- **Content:**
  - Brief about text
  - Key values/points (bullet list or icons)
  - "Learn More" link to About page

#### Admissions CTA Section
- **Background:** Gold accent or blue
- **Content:**
  - "Ready to Begin Your Journey?"
  - Brief admissions info
  - "Apply Now" button (prominent)

#### Footer
- **4-column layout** (desktop), stacked (mobile)
- **Sections:**
  - Logo + Vision snippet
  - Quick Links
  - Programs (all 10 listed)
  - Contact Info
- **Bottom:** Copyright, social links

---

### 2. Programs Page (`/programs`)

#### Header
- **Title:** "Academic Programs"
- **Subtitle:** Brief intro text
- **Breadcrumb:** Home > Programs

#### Programs Grid
- **Same card design as homepage**
- **10 program cards** in grid layout
- **Filter/Search:** (Optional for Phase 1, can add later)

#### Individual Program Pages (`/programs/[slug]`)
- **Hero:** Program name, brief intro
- **Content Sections:**
  - Overview
  - Curriculum/What You'll Learn
  - Who This Program Is For
  - Duration & Format
  - Faculty (if available)
- **Sidebar:** 
  - Quick facts box
  - "Apply Now" CTA
  - Related programs
- **CTA:** "Apply to This Program" button

---

### 3. About Page (`/about`)

#### Hero Section
- **Title:** "About EBOMI International Bible Academy"
- **Subtitle:** Vision statement (full)

#### Content Sections:

**1. Our Vision**
- Full vision statement
- Elegant typography, centered or left-aligned

**2. Our Mission** (if provided)
- Mission statement
- Key objectives

**3. Our Values**
- Grid of value cards (4-6 values)
- Icon + title + description

**4. Our History** (if provided)
- Timeline or narrative format

**5. Leadership** (if available)
- Grid of leadership team
- Photo, name, title, bio

**6. Why Choose EIBA**
- List of unique selling points
- Icons or numbers

---

### 4. Admissions Page (`/admissions`)

#### Hero Section
- **Title:** "Begin Your Journey"
- **Subtitle:** Brief intro

#### Content Sections:

**1. Application Process**
- Step-by-step process (numbered or timeline)
- Clear instructions

**2. Requirements**
- List of admission requirements
- Documents needed
- Eligibility criteria

**3. Important Dates**
- Application deadlines
- Semester start dates
- Calendar format (optional)

**4. How to Apply**
- Instructions
- Contact information
- "Start Application" CTA (if online form in Phase 2)

**5. FAQ Section**
- Common questions about admissions
- Expandable accordion format

---

### 5. Contact Page (`/contact`)

#### Layout: Split (Contact Form + Info)

**Left Side (or Top on Mobile):**
- **Contact Form:**
  - Name
  - Email
  - Phone (optional)
  - Subject
  - Message
  - Submit button

**Right Side (or Bottom on Mobile):**
- **Contact Information:**
  - Address
  - Phone
  - Email
  - Office Hours
  - Map (if location available)

**Additional:**
- Social media links
- "Visit Us" section (if applicable)

---

## 🧩 Component Breakdown

### 1. Header/Navigation
- **Sticky:** Yes (stays at top on scroll)
- **Logo:** Left side
- **Navigation:** Center or right
- **Mobile:** Hamburger menu
- **CTA:** "Apply Now" button (right side)

### 2. Hero Section
- **Variants:**
  - Full-width with background image/gradient
  - Centered content
  - Left-aligned content
- **Elements:**
  - Title (H1)
  - Subtitle/Description
  - CTA buttons (2-3)
  - Optional: Scroll indicator

### 3. Program Card
- **Layout:**
  - Icon/Image (top)
  - Title (H3)
  - Description (2-3 lines, truncated)
  - "Learn More" link
- **Hover:** Slight elevation, color accent
- **Click:** Navigate to program detail page

### 4. Section Container
- **Padding:** Consistent vertical/horizontal
- **Max-width:** `1280px` (centered)
- **Background:** Alternating white/light gray

### 5. CTA Button
- **Primary:** Blue background, white text
- **Secondary:** White background, blue border
- **Accent:** Gold background, dark text
- **Sizes:** Small, Medium, Large

### 6. Footer
- **Background:** Dark blue or dark gray
- **Text:** Light gray/white
- **Layout:** 4-column grid (desktop), stacked (mobile)
- **Links:** Organized by category

### 7. Form Elements
- **Input:** Rounded, border, focus state
- **Textarea:** Same styling
- **Button:** Primary CTA style
- **Validation:** Error states, success states

---

## 📐 Responsive Breakpoints

- **Mobile:** `0px - 640px` (1 column, stacked)
- **Tablet:** `641px - 1024px` (2 columns, adjusted spacing)
- **Desktop:** `1025px+` (3-4 columns, full layout)

**Mobile-First Approach:**
- Design for mobile first
- Progressive enhancement for larger screens
- Touch-friendly buttons (min 44x44px)

---

## 🎯 User Flows

### Flow 1: Prospective Student
```
Homepage → Programs → [Program Detail] → Admissions → Contact
```

### Flow 2: Quick Application
```
Homepage → Admissions → Contact Form
```

### Flow 3: Information Seeking
```
Homepage → About → Programs → [Program Detail]
```

---

## ✨ Interactive Elements

### Hover States
- **Buttons:** Slight scale or color change
- **Cards:** Elevation increase, subtle shadow
- **Links:** Underline or color change

### Animations
- **Subtle:** Fade-in on scroll (optional)
- **Smooth:** Page transitions
- **Micro-interactions:** Button clicks, form submissions

### Loading States
- **Skeleton screens:** For content loading
- **Spinners:** For form submissions

---

## 🖼️ Imagery Strategy

### Hero Images
- **Options:**
  - Academic setting (library, classroom)
  - Spiritual imagery (subtle, professional)
  - Abstract patterns/textures
  - Institution photos (if available)

### Program Icons
- **Style:** Line icons or filled icons
- **Consistent:** Same style across all programs
- **Meaningful:** Icons relate to program content

### About Page
- **Photos:** Leadership, campus, students (if available)
- **Placeholders:** Professional stock photos if needed

---

## ♿ Accessibility Considerations

1. **Color Contrast:** WCAG AA (4.5:1 for text)
2. **Keyboard Navigation:** All interactive elements accessible
3. **Screen Readers:** Proper ARIA labels, semantic HTML
4. **Alt Text:** All images have descriptive alt text
5. **Focus States:** Visible focus indicators
6. **Font Sizes:** Minimum 16px for body text

---

## 🚀 Performance Optimization

1. **Images:** Optimized, WebP format, lazy loading
2. **Code Splitting:** Route-based code splitting
3. **Fonts:** Self-hosted or optimized web fonts
4. **CSS:** Minimal, purged unused styles
5. **JavaScript:** Minimal, only what's needed

---

## 📋 Implementation Checklist

### Design Phase:
- [ ] Finalize color palette
- [ ] Select typography
- [ ] Create component library
- [ ] Design all page layouts
- [ ] Create responsive mockups
- [ ] Get approval on design direction

### Development Phase:
- [ ] Set up Next.js project structure
- [ ] Implement design system (colors, typography, spacing)
- [ ] Build reusable components
- [ ] Create all pages
- [ ] Add responsive styles
- [ ] Implement navigation
- [ ] Add forms
- [ ] Optimize images
- [ ] Test accessibility
- [ ] Test on devices
- [ ] Performance optimization

---

## 🎨 Design Mockup Structure

```
Homepage:
├── Header (sticky)
├── Hero Section
│   ├── Logo
│   ├── Vision Statement
│   └── CTAs
├── Programs Preview (10 cards)
├── About Preview
├── Admissions CTA
└── Footer

Programs:
├── Header
├── Page Title
└── Programs Grid (10 cards)

About:
├── Hero
├── Vision
├── Values
├── History (if available)
└── Leadership (if available)

Admissions:
├── Hero
├── Process
├── Requirements
├── Dates
└── FAQ

Contact:
├── Hero
├── Contact Form
└── Contact Info
```

---

## 🎯 Design Goals

1. **Professional:** Academic credibility
2. **Spiritual:** Warmth and inspiration (without being overly religious)
3. **Modern:** Contemporary design trends
4. **Clear:** Easy to find information
5. **Trustworthy:** Builds confidence in the institution
6. **Accessible:** Usable by everyone
7. **Fast:** Quick loading, smooth experience

---

## 📝 Next Steps

1. **Review this plan** - Get feedback and approval
2. **Gather assets** - Logo, images, content
3. **Create wireframes** - Low-fidelity layouts
4. **Design mockups** - High-fidelity designs
5. **Get approval** - Finalize design direction
6. **Implement** - Build the website

---

**Ready to proceed?** This plan provides:
- ✅ Complete design system
- ✅ All page layouts
- ✅ Component specifications
- ✅ Responsive strategy
- ✅ Accessibility considerations
- ✅ Performance optimization

**Would you like me to:**
1. Adjust any design elements?
2. Start implementing the design?
3. Create detailed wireframes first?

Let me know and I'll proceed! 🚀

