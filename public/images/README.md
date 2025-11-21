# Images Directory

This directory contains all static images for the Taraba State Portal.

## Folder Structure

```
public/
├── images/
│   ├── hero/          # Hero section background images
│   ├── gallery/       # Gallery section images
│   ├── logo/          # Logo and branding images
│   └── README.md      # This file
```

## Usage in Next.js

### Using Next.js Image Component (Recommended)

```tsx
import Image from "next/image";

<Image
  src="/images/hero/government-house.jpg"
  alt="Government House"
  width={1920}
  height={1080}
/>
```

### Using Regular img Tag

```tsx
<img src="/images/hero/government-house.jpg" alt="Government House" />
```

### Using in CSS/Background

```tsx
<div style={{ backgroundImage: "url('/images/hero/government-house.jpg')" }} />
```

## Image Guidelines

- **Hero Images**: Recommended size 1920x1080px (Full HD)
- **Gallery Images**: Recommended size 800x600px or 1200x900px
- **Logo**: SVG or PNG with transparent background
- **File Formats**: Use JPG for photos, PNG for graphics with transparency, SVG for logos

## Notes

- All paths in the `public` folder are served from the root URL (`/`)
- Example: `public/images/hero/image.jpg` → `/images/hero/image.jpg`
- Always use descriptive file names
- Optimize images before uploading (use tools like TinyPNG or ImageOptim)

