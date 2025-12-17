# Deployment Requirements for tarabastate.gov.ng

## Current Tech Stack

### Frontend Framework
- **Next.js 14.2.5** (App Router)
- **React 18.3.1**
- **TypeScript 5.4.5**
- **Node.js 18+** (required)

### Build Requirements
- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm/yarn/pnpm**: Package manager
- **Build Command**: `npm run build`
- **Start Command**: `npm start` (for production)
- **Output**: Static and dynamic routes (hybrid)

### Backend Services
- **Supabase**: PostgreSQL database, Auth, Storage
- **API Routes**: Server-side Next.js API routes

---

## Hosting Provider Requirements

### Essential Requirements

#### 1. **Node.js Support**
- ✅ Node.js 18.x or higher
- ✅ Ability to run `npm install` and `npm run build`
- ✅ Support for Next.js 14 App Router

#### 2. **Server Requirements**
- **Minimum RAM**: 512MB (1GB+ recommended)
- **CPU**: 1 vCPU minimum (2+ recommended for better performance)
- **Storage**: 10GB minimum (for build artifacts and dependencies)
- **Bandwidth**: Unlimited or high limit (for file uploads)

#### 3. **Next.js Specific Features**
- ✅ **Server-Side Rendering (SSR)** support
- ✅ **API Routes** support (serverless functions or Node.js runtime)
- ✅ **Static Site Generation (SSG)** support
- ✅ **Image Optimization** (Next.js Image component)
- ✅ **Environment Variables** configuration

#### 4. **Domain & SSL**
- ✅ Custom domain support (tarabastate.gov.ng)
- ✅ SSL/TLS certificate (HTTPS) - Let's Encrypt or custom
- ✅ DNS management or CNAME support

#### 5. **Database & Storage**
- ✅ External Supabase connection (already configured)
- ✅ No local database required (uses Supabase)

---

## Recommended Hosting Providers

### Option 1: **Vercel** (Easiest - Recommended)
**Best for**: Quick deployment, zero configuration

**Pros:**
- ✅ Built by Next.js creators - perfect compatibility
- ✅ Automatic deployments from GitHub
- ✅ Free SSL certificates
- ✅ Global CDN included
- ✅ Automatic image optimization
- ✅ Serverless functions included
- ✅ Free tier available

**Cons:**
- ⚠️ Limited server-side customization
- ⚠️ Pricing can scale with usage

**Pricing**: Free tier available, then $20/month for Pro

**Setup**: Connect GitHub repo → Auto-deploy

---

### Option 2: **Netlify**
**Best for**: Similar to Vercel, good Next.js support

**Pros:**
- ✅ Excellent Next.js support
- ✅ Free SSL
- ✅ Global CDN
- ✅ Easy GitHub integration
- ✅ Free tier available

**Cons:**
- ⚠️ Slightly less optimized for Next.js than Vercel

**Pricing**: Free tier available, then $19/month for Pro

---

### Option 3: **DigitalOcean App Platform**
**Best for**: More control, predictable pricing

**Pros:**
- ✅ Full Node.js control
- ✅ Predictable pricing
- ✅ Good performance
- ✅ Easy scaling
- ✅ Custom domain support

**Cons:**
- ⚠️ Requires more configuration
- ⚠️ No free tier

**Pricing**: ~$12/month for basic plan

**Requirements:**
- Node.js 18+ runtime
- Build command: `npm run build`
- Start command: `npm start`

---

### Option 4: **AWS (EC2, Elastic Beanstalk, or Amplify)**
**Best for**: Enterprise scale, maximum control

**AWS Amplify** (Recommended for Next.js):
- ✅ Next.js optimized
- ✅ Free tier available
- ✅ Global CDN
- ✅ Auto-scaling

**AWS EC2** (More control):
- ✅ Full server control
- ✅ Custom configurations
- ⚠️ Requires server management
- ⚠️ More complex setup

**Pricing**: Pay-as-you-go, varies

---

### Option 5: **Railway**
**Best for**: Simple deployment, good DX

**Pros:**
- ✅ Easy deployment
- ✅ Good Next.js support
- ✅ Free tier available
- ✅ Simple pricing

**Pricing**: $5/month after free tier

---

### Option 6: **Self-Hosted (VPS)**
**Best for**: Full control, government requirements

**Providers**: DigitalOcean Droplet, Linode, Vultr, AWS EC2

**Requirements:**
- Ubuntu 22.04 LTS or similar
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx or Apache reverse proxy
- SSL certificate (Let's Encrypt)

**Setup Complexity**: High (requires server administration)

---

## Recommended: Vercel or DigitalOcean App Platform

### For Quick Deployment → **Vercel**
- Zero configuration
- Automatic deployments
- Best Next.js optimization
- Free tier to start

### For Government/Enterprise → **DigitalOcean App Platform** or **AWS**
- More control
- Predictable costs
- Better for compliance requirements
- Can host on Nigerian servers (if available)

---

## Deployment Checklist

### Before Deployment:

1. **Environment Variables** (Set in hosting provider dashboard)
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   NEXT_PUBLIC_ADMIN_EMAIL=admin@tarabastate.gov.ng
   ```

2. **Domain Configuration**
   - Point `tarabastate.gov.ng` to hosting provider
   - Configure DNS records (A record or CNAME)
   - Enable SSL certificate

3. **Supabase Production Setup**
   - Create production Supabase project (or use existing)
   - Update RLS policies for production
   - Create storage buckets
   - Seed initial data

4. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next` (auto-detected by Next.js)
   - Node Version: `18.x` or `20.x`

---

## Step-by-Step: Vercel Deployment (Recommended)

### 1. Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub account

### 2. Import Project
- Click "Add New Project"
- Import from GitHub: `Sheddybata/tarabagov`
- Vercel auto-detects Next.js settings

### 3. Configure Environment Variables
- Go to Project Settings → Environment Variables
- Add all required variables (see above)

### 4. Configure Domain
- Go to Project Settings → Domains
- Add `tarabastate.gov.ng`
- Follow DNS instructions
- SSL certificate auto-provisioned

### 5. Deploy
- Click "Deploy"
- Wait for build to complete
- Site is live!

---

## Step-by-Step: DigitalOcean App Platform

### 1. Create DigitalOcean Account
- Sign up at https://digitalocean.com

### 2. Create App
- Go to App Platform
- Connect GitHub repository
- Select `Sheddybata/tarabagov`

### 3. Configure Build Settings
- **Build Command**: `npm run build`
- **Run Command**: `npm start`
- **Node Version**: 18.x or 20.x

### 4. Add Environment Variables
- Add all required variables in App Settings

### 5. Configure Domain
- Add custom domain: `tarabastate.gov.ng`
- Configure DNS as instructed
- SSL auto-provisioned

### 6. Deploy
- Click "Create Resources"
- App deploys automatically

---

## Cost Comparison

| Provider | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| **Vercel** | ✅ Yes | $20/month | Quick setup, best Next.js support |
| **Netlify** | ✅ Yes | $19/month | Similar to Vercel |
| **DigitalOcean** | ❌ No | $12/month | More control, predictable |
| **Railway** | ✅ Yes | $5/month | Simple, affordable |
| **AWS Amplify** | ✅ Yes | Pay-as-you-go | Enterprise scale |
| **Self-Hosted VPS** | ❌ No | $5-20/month | Full control |

---

## Performance Considerations

### CDN (Content Delivery Network)
- ✅ **Vercel/Netlify**: Built-in global CDN
- ✅ **DigitalOcean**: Can add CDN
- ⚠️ **Self-Hosted**: Need to configure CDN separately (Cloudflare recommended)

### Image Optimization
- ✅ **Vercel**: Automatic Next.js Image optimization
- ✅ **Netlify**: Automatic optimization
- ⚠️ **Others**: May need configuration

### Serverless Functions
- ✅ **Vercel/Netlify**: Automatic scaling
- ✅ **DigitalOcean**: Auto-scaling included
- ⚠️ **Self-Hosted**: Manual scaling required

---

## Security Requirements

### SSL/TLS Certificate
- ✅ All providers offer free SSL (Let's Encrypt)
- ✅ Required for HTTPS
- ✅ Auto-renewal recommended

### Environment Variables
- ✅ Secure storage in hosting provider
- ✅ Never commit to Git
- ✅ Different values for production

### Database Security
- ✅ Supabase RLS policies configured
- ✅ Service role key server-side only
- ✅ Admin authentication required

---

## Monitoring & Maintenance

### Recommended Tools:
1. **Error Tracking**: Sentry (free tier available)
2. **Analytics**: Vercel Analytics or Google Analytics
3. **Uptime Monitoring**: UptimeRobot (free)
4. **Performance**: Lighthouse CI

---

## Recommendation

**For tarabastate.gov.ng, I recommend:**

### Primary Choice: **Vercel**
- Best Next.js support
- Zero configuration
- Automatic deployments
- Global CDN
- Free SSL
- Easy domain setup

### Alternative: **DigitalOcean App Platform**
- If you need more control
- Predictable pricing
- Good for government compliance
- Still easy to use

---

## Next Steps

1. **Choose hosting provider** (Vercel recommended)
2. **Set up account** and connect GitHub
3. **Configure environment variables**
4. **Add custom domain** (tarabastate.gov.ng)
5. **Deploy** and test
6. **Set up monitoring** (optional but recommended)

---

**Need help with a specific provider?** Let me know which one you choose and I can provide detailed setup instructions!

