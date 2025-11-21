# Image Storage Guide

## Where to Save Images

All images should be saved in the **`public/images/`** folder. This is the standard location for static assets in Next.js.

## Folder Structure

I've created the following folder structure for you:

```
public/
└── images/
    ├── hero/          # Hero section background images
    ├── gallery/       # Gallery section images
    ├── logo/          # Logo and branding images
    └── README.md      # Image guidelines
```

## How to Add Images

### 1. Hero Section Image

**Location:** `public/images/hero/`

**File name:** `government-house.jpg` (or any name you prefer)

**Recommended size:** 1920x1080px (Full HD)

**Usage:** The hero section is already configured to use `/images/hero/government-house.jpg`

### 2. Gallery Images

**Location:** `public/images/gallery/`

**File names:** 
- `government-event-1.jpg`
- `infrastructure-1.jpg`
- `public-service-1.jpg`
- `community-1.jpg`
- `agriculture-1.jpg`
- `education-1.jpg`

**Recommended size:** 800x600px or 1200x900px

**Usage:** Update the `galleryImages` array in `components/landing/gallery-section.tsx` with your actual image paths.

### 3. Logo Images

**Location:** `public/images/logo/`

**File names:**
- `coat-of-arms.png` or `.svg`
- `logo.png` or `.svg`

**Recommended format:** SVG (scalable) or PNG with transparent background

## How to Reference Images in Code

### Method 1: Using Next.js Image Component (Recommended)

```tsx
import Image from "next/image";

<Image
  src="/images/hero/government-house.jpg"
  alt="Government House"
  width={1920}
  height={1080}
  priority // For above-the-fold images
/>
```

### Method 2: Using Regular img Tag

```tsx
<img 
  src="/images/gallery/government-event-1.jpg" 
  alt="Government event" 
/>
```

### Method 3: Using in CSS/Background

```tsx
<div 
  style={{ 
    backgroundImage: "url('/images/hero/government-house.jpg')" 
  }} 
/>
```

## Important Notes

1. **Path Reference:** All paths in the `public` folder are served from the root URL (`/`)
   - Example: `public/images/hero/image.jpg` → `/images/hero/image.jpg`

2. **File Naming:** Use descriptive, lowercase names with hyphens
   - ✅ Good: `government-house.jpg`, `agriculture-1.jpg`
   - ❌ Bad: `IMG_1234.jpg`, `photo (1).jpg`

3. **Image Optimization:** 
   - Compress images before uploading (use tools like TinyPNG, ImageOptim, or Squoosh)
   - Use appropriate formats:
     - **JPG** for photos
     - **PNG** for graphics with transparency
     - **SVG** for logos and icons

4. **File Sizes:** Keep images optimized for web
   - Hero images: < 500KB
   - Gallery images: < 200KB each
   - Logos: < 50KB

## Quick Start

1. **Add your hero image:**
   - Save it as `public/images/hero/government-house.jpg`
   - The hero section will automatically use it

2. **Add gallery images:**
   - Save 6+ images in `public/images/gallery/`
   - Update the file names in `components/landing/gallery-section.tsx` to match your actual files

3. **Add logo (optional):**
   - Save logo files in `public/images/logo/`
   - Update the Logo component if needed

## Example Workflow

```bash
# 1. Create your images folder structure (already done)
# 2. Add your images to the appropriate folders
# 3. Reference them in your components using the paths above
```

That's it! Your images will be automatically served by Next.js from the `public` folder.

