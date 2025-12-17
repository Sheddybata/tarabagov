# Pointing tarabastate.gov.ng to Vercel (NITDA Setup)

## Important: NITDA .gov.ng Domain Setup

Since **NITDA** (National Information Technology Development Agency) manages `.gov.ng` domains and **only allows nameserver modifications**, you have two options:

---

## Option 1: Use NITDA Nameservers + DNS Provider (Recommended)

### How It Works:
1. Keep domain registered with NITDA
2. Point nameservers to a DNS provider (Cloudflare, etc.)
3. Manage DNS records in that DNS provider
4. Point DNS records to Vercel

### Step-by-Step:

#### Step 1: Choose a DNS Provider
**Recommended: Cloudflare (Free)**
- Free DNS management
- Fast DNS resolution
- Easy to use
- Good for government domains

**Alternatives:**
- AWS Route 53
- Google Cloud DNS
- DigitalOcean DNS

#### Step 2: Set Up Cloudflare (or your chosen provider)

**If using Cloudflare:**
1. Sign up at https://cloudflare.com (free)
2. Add site: `tarabastate.gov.ng`
3. Cloudflare will scan your current DNS records
4. Cloudflare will provide **nameservers** (e.g., `ns1.cloudflare.com`, `ns2.cloudflare.com`)

#### Step 3: Update Nameservers in NITDA

1. **Contact NITDA** to update nameservers
2. **Provide them with:**
   - Domain: `tarabastate.gov.ng`
   - New nameservers: (from Cloudflare or your DNS provider)
     - Example: `ns1.cloudflare.com`
     - Example: `ns2.cloudflare.com`
     - (Usually 2-4 nameservers provided)

3. **NITDA will update** the nameservers (usually takes 24-48 hours)

#### Step 4: Configure DNS in Cloudflare (or your DNS provider)

Once nameservers are updated, manage DNS in Cloudflare:

**For www subdomain:**
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: DNS only (turn off proxy)
TTL: Auto
```

**For root domain:**
```
Type: A
Name: @
Target: 76.76.21.21 (get current IP from Vercel)
Proxy status: DNS only
TTL: Auto
```

#### Step 5: Add Domain in Vercel

1. Go to Vercel Dashboard → Settings → Domains
2. Add domain: `tarabastate.gov.ng` (and/or `www.tarabastate.gov.ng`)
3. Vercel will show DNS records to add
4. Add those records in Cloudflare (or your DNS provider)

---

## Option 2: Use Vercel's Nameservers (If Supported)

### Check if Vercel Provides Nameservers:

1. **Contact Vercel Support** to ask:
   - "Do you provide nameservers for .gov.ng domains?"
   - "Can I point my domain's nameservers directly to Vercel?"

2. **If Vercel provides nameservers:**
   - Get nameservers from Vercel (e.g., `ns1.vercel.com`, `ns2.vercel.com`)
   - Provide these to NITDA
   - NITDA updates nameservers
   - Vercel manages all DNS automatically

**Note:** Vercel typically doesn't provide nameservers for custom domains, but it's worth checking.

---

## Recommended Setup for NITDA .gov.ng Domains

### Best Approach: Cloudflare + Vercel

**Why Cloudflare?**
- ✅ Free DNS management
- ✅ Fast global DNS resolution
- ✅ Easy to manage
- ✅ Good for government domains
- ✅ Can handle both root and subdomain

**Architecture:**
```
tarabastate.gov.ng (NITDA)
    ↓
Nameservers → Cloudflare
    ↓
DNS Records → Vercel
    ↓
Your Application
```

---

## Complete Setup Process

### Phase 1: Set Up Cloudflare (1-2 hours)

1. **Create Cloudflare Account**
   - Go to https://cloudflare.com
   - Sign up (free)

2. **Add Domain to Cloudflare**
   - Click "Add a Site"
   - Enter: `tarabastate.gov.ng`
   - Select Free plan
   - Cloudflare scans existing DNS records

3. **Get Nameservers from Cloudflare**
   - Cloudflare will show you nameservers like:
     - `ns1.cloudflare.com`
     - `ns2.cloudflare.com`
     - (Usually 2 nameservers)

4. **Note Down Nameservers**
   - Copy all nameservers provided
   - You'll need these for NITDA

### Phase 2: Update Nameservers with NITDA (24-48 hours)

1. **Contact NITDA**
   - Email or portal (however you normally contact them)
   - Request: "Update nameservers for tarabastate.gov.ng"

2. **Provide Information:**
   ```
   Domain: tarabastate.gov.ng
   New Nameservers:
   - ns1.cloudflare.com
   - ns2.cloudflare.com
   ```

3. **Wait for Confirmation**
   - NITDA will update nameservers
   - Usually takes 24-48 hours
   - You'll receive confirmation

4. **Verify Nameserver Update**
   - Use: https://dnschecker.org
   - Check: `tarabastate.gov.ng`
   - Verify nameservers show Cloudflare's nameservers globally

### Phase 3: Configure DNS in Cloudflare (After nameservers update)

1. **Log into Cloudflare Dashboard**
2. **Go to DNS → Records**
3. **Add DNS Records for Vercel:**

   **First, add domain in Vercel:**
   - Go to Vercel Dashboard → Settings → Domains
   - Add: `tarabastate.gov.ng`
   - Add: `www.tarabastate.gov.ng` (optional)
   - Vercel will show exact DNS values to use

   **Then, add records in Cloudflare:**
   
   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com (or value Vercel provides)
   Proxy: DNS only (OFF - important!)
   TTL: Auto
   ```

   **For root domain:**
   ```
   Type: A
   Name: @
   Target: 76.76.21.21 (or IP Vercel provides)
   Proxy: DNS only (OFF - important!)
   TTL: Auto
   ```

   **Important:** Turn OFF Cloudflare proxy (orange cloud) initially. You can enable it later if needed, but Vercel needs direct DNS resolution first.

4. **Save Records**

### Phase 4: Verify in Vercel (5-10 minutes)

1. **Check Vercel Dashboard**
   - Go to Settings → Domains
   - Check domain status
   - Should show "Valid" once DNS propagates

2. **Wait for SSL**
   - Vercel automatically provisions SSL
   - Usually 5-10 minutes after DNS propagates
   - Check SSL status in Vercel dashboard

3. **Test Domain**
   - Visit: `https://tarabastate.gov.ng`
   - Should load your Vercel deployment
   - SSL should be active (green padlock)

---

## DNS Records Summary

### In Cloudflare (after nameservers are updated):

**For www.tarabastate.gov.ng:**
```
Type: CNAME
Name: www
Target: [Value from Vercel - usually cname.vercel-dns.com]
Proxy: OFF (DNS only)
```

**For tarabastate.gov.ng (root):**
```
Type: A
Name: @
Target: [IP from Vercel - check Vercel dashboard]
Proxy: OFF (DNS only)
```

**Optional: Redirect root to www:**
```
Type: CNAME
Name: @
Target: www.tarabastate.gov.ng
Proxy: OFF
```

---

## Timeline

| Step | Duration | Notes |
|------|----------|-------|
| Set up Cloudflare | 1-2 hours | Quick setup |
| Request nameserver update from NITDA | 1 day | Submit request |
| NITDA processes request | 24-48 hours | Usually 1-2 business days |
| DNS propagation | 1-24 hours | After nameservers update |
| Configure DNS in Cloudflare | 15 minutes | Add Vercel records |
| Vercel SSL provisioning | 5-10 minutes | Automatic |
| **Total** | **3-5 business days** | Mostly waiting for NITDA |

---

## Important Notes for NITDA .gov.ng Domains

1. **Nameservers Only:** NITDA only allows nameserver changes, not individual DNS record management
2. **Use DNS Provider:** You need a DNS provider (Cloudflare recommended) to manage DNS records
3. **Contact NITDA:** You must contact NITDA to update nameservers - you can't do it yourself
4. **Processing Time:** NITDA usually takes 24-48 hours to process nameserver updates
5. **Verification:** Always verify nameserver changes using dnschecker.org before proceeding

---

## Alternative: If You Can't Use Cloudflare

### Option A: AWS Route 53
- More complex setup
- Paid service (but very cheap)
- Good for enterprise

### Option B: Google Cloud DNS
- Paid service
- Reliable
- Good integration

### Option C: DigitalOcean DNS
- Simple setup
- Paid but affordable
- Good performance

**All follow the same process:**
1. Get nameservers from provider
2. Provide to NITDA
3. Wait for update
4. Configure DNS records
5. Point to Vercel

---

## Troubleshooting

### Nameservers Not Updated?

1. **Check with NITDA:**
   - Confirm they received your request
   - Ask for status update
   - Verify they updated correctly

2. **Verify Nameservers:**
   - Use: https://dnschecker.org
   - Check: `tarabastate.gov.ng`
   - Should show Cloudflare (or your provider's) nameservers

3. **Wait Longer:**
   - DNS changes can take up to 48 hours
   - Be patient

### DNS Records Not Working?

1. **Verify in Cloudflare:**
   - Check DNS records are correct
   - Make sure proxy is OFF (DNS only)
   - Verify TTL settings

2. **Check Vercel:**
   - Verify domain is added
   - Check for error messages
   - Verify DNS values match

3. **Test DNS Propagation:**
   - Use: https://dnschecker.org
   - Check if records propagate globally

### SSL Not Working?

1. **Wait:** SSL takes 5-10 minutes after DNS propagates
2. **Check Vercel:** Look for SSL status in dashboard
3. **Verify DNS:** Make sure DNS is fully propagated
4. **Contact Vercel:** If still not working after 24 hours

---

## Contact Information

### NITDA
- **Website:** https://nitda.gov.ng
- **Email:** (Check NITDA website for current contact)
- **Portal:** (Check if they have a domain management portal)

### Vercel Support
- **Email:** support@vercel.com
- **Docs:** https://vercel.com/docs/concepts/projects/domains
- **Status:** https://vercel-status.com

### Cloudflare Support
- **Docs:** https://developers.cloudflare.com/dns
- **Community:** https://community.cloudflare.com

---

## Quick Checklist

### Before Starting:
- [ ] Have access to contact NITDA
- [ ] Know your domain registration details
- [ ] Have a Vercel account and deployed project

### Setup Steps:
1. [ ] Create Cloudflare account
2. [ ] Add domain to Cloudflare
3. [ ] Get nameservers from Cloudflare
4. [ ] Contact NITDA to update nameservers
5. [ ] Wait for NITDA to process (24-48 hours)
6. [ ] Verify nameservers are updated (dnschecker.org)
7. [ ] Add domain in Vercel dashboard
8. [ ] Get DNS values from Vercel
9. [ ] Add DNS records in Cloudflare
10. [ ] Wait for DNS propagation
11. [ ] Verify domain works in Vercel
12. [ ] Wait for SSL (5-10 minutes)
13. [ ] Test: Visit https://tarabastate.gov.ng
14. [ ] Done! 🎉

---

## Summary

**For NITDA .gov.ng domains:**

1. **Use Cloudflare** (or another DNS provider) to manage DNS
2. **Get nameservers** from Cloudflare
3. **Contact NITDA** to update nameservers
4. **Wait** for NITDA to process (24-48 hours)
5. **Configure DNS** in Cloudflare to point to Vercel
6. **Add domain** in Vercel and follow their instructions
7. **Done!** SSL will auto-provision

**Key Point:** Since NITDA only allows nameserver changes, you need an intermediate DNS provider (Cloudflare) to manage the actual DNS records that point to Vercel.

---

**Need help with any step?** Let me know and I can provide more detailed instructions!

