# Pointing tarabastate.gov.ng to Vercel

## DNS Records Required

To point your domain `tarabastate.gov.ng` to Vercel, you need to configure **ONE** of these options:

---

## Option 1: CNAME Record (Recommended for Subdomains)

**Use this if:** You want to use a subdomain like `www.tarabastate.gov.ng` or `portal.tarabastate.gov.ng`

### DNS Configuration:
```
Type: CNAME
Name: www (or portal, or any subdomain)
Value: cname.vercel-dns.com
TTL: 3600 (or default)
```

**Example:**
- If you want `www.tarabastate.gov.ng`:
  - Type: `CNAME`
  - Name: `www`
  - Value: `cname.vercel-dns.com`

---

## Option 2: A Record (For Root Domain)

**Use this if:** You want to use the root domain `tarabastate.gov.ng` (without www)

### DNS Configuration:
```
Type: A
Name: @ (or leave blank, or use root domain)
Value: 76.76.21.21
TTL: 3600 (or default)
```

**Note:** Vercel provides an IP address for A records. The IP may change, so check Vercel's documentation for the current IP.

**Alternative:** Vercel also supports:
```
Type: A
Name: @
Value: 76.76.21.21
```

---

## Option 3: ALIAS/ANAME Record (Best for Root Domain)

**Use this if:** Your DNS provider supports ALIAS/ANAME records (some providers do, some don't)

### DNS Configuration:
```
Type: ALIAS (or ANAME)
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

**Note:** Not all DNS providers support ALIAS/ANAME. Check with your provider.

---

## Step-by-Step: Adding Domain in Vercel

### Step 1: Add Domain in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain:
   - For root: `tarabastate.gov.ng`
   - For subdomain: `www.tarabastate.gov.ng` or `portal.tarabastate.gov.ng`
5. Click **Add**

### Step 2: Vercel Shows DNS Instructions

After adding the domain, Vercel will show you:
- **Exact DNS records** to add
- **Specific values** for your domain
- **Verification status**

**Important:** Vercel will give you specific values. Use those exact values, not generic ones!

---

## Common DNS Provider Instructions

### If Using Cloudflare:
1. Go to Cloudflare Dashboard → DNS
2. Add record:
   - **Type:** `CNAME` (for subdomain) or `A` (for root)
   - **Name:** `www` (or `@` for root)
   - **Target:** `cname.vercel-dns.com` (or IP from Vercel)
   - **Proxy status:** 🟠 DNS only (turn off proxy initially)
3. Save

### If Using GoDaddy:
1. Go to GoDaddy → DNS Management
2. Add record:
   - **Type:** `CNAME` or `A`
   - **Name:** `www` (or `@`)
   - **Value:** `cname.vercel-dns.com` (or IP from Vercel)
   - **TTL:** 1 hour
3. Save

### If Using Namecheap:
1. Go to Namecheap → Domain List → Manage → Advanced DNS
2. Add record:
   - **Type:** `CNAME Record` or `A Record`
   - **Host:** `www` (or `@`)
   - **Value:** `cname.vercel-dns.com` (or IP from Vercel)
   - **TTL:** Automatic
3. Save

### If Using AWS Route 53:
1. Go to Route 53 → Hosted Zones → tarabastate.gov.ng
2. Create record:
   - **Record type:** `CNAME` or `A`
   - **Record name:** `www` (or leave blank for root)
   - **Value:** `cname.vercel-dns.com` (or IP from Vercel)
   - **TTL:** 300
3. Save

### If Using Google Domains:
1. Go to Google Domains → DNS
2. Add record:
   - **Type:** `CNAME` or `A`
   - **Name:** `www` (or `@`)
   - **Data:** `cname.vercel-dns.com` (or IP from Vercel)
   - **TTL:** 3600
3. Save

---

## Recommended Setup

### For tarabastate.gov.ng, I recommend:

**Option A: Use www subdomain (Easiest)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```
- Then redirect root domain to www (see below)

**Option B: Use root domain directly**
```
Type: A
Name: @
Value: 76.76.21.21 (check Vercel for current IP)
```

---

## Redirect Root to www (Optional but Recommended)

If you use `www.tarabastate.gov.ng`, you may want to redirect `tarabastate.gov.ng` → `www.tarabastate.gov.ng`

### In Vercel:
1. Add both domains:
   - `tarabastate.gov.ng` (root)
   - `www.tarabastate.gov.ng` (subdomain)
2. Vercel automatically redirects root to www

### Or in DNS:
Add a redirect record (if your DNS provider supports it):
```
Type: URL Redirect
Name: @
Value: https://www.tarabastate.gov.ng
```

---

## SSL Certificate (Automatic)

✅ **Good News:** Vercel automatically provisions SSL certificates via Let's Encrypt!

**What you need to do:**
- Nothing! Just add the domain and configure DNS
- Vercel will automatically:
  - Request SSL certificate
  - Verify domain ownership
  - Install certificate
  - Enable HTTPS

**Timeline:** SSL certificate is usually ready within 5-10 minutes after DNS propagates.

---

## DNS Propagation

### How Long Does It Take?
- **Usually:** 5 minutes to 24 hours
- **Average:** 1-2 hours
- **Maximum:** 48 hours (rare)

### Check DNS Propagation:
Use these tools to check if DNS has propagated:
- https://dnschecker.org
- https://www.whatsmydns.net
- https://dns.google/query?name=tarabastate.gov.ng

### Check Vercel Status:
1. Go to Vercel Dashboard → Domains
2. Check domain status:
   - 🟡 **Pending:** DNS not propagated yet
   - 🟢 **Valid:** Domain is live!
   - 🔴 **Invalid:** Check DNS configuration

---

## Complete Checklist

### Before You Start:
- [ ] You have access to your domain's DNS settings
- [ ] You know your DNS provider (Cloudflare, GoDaddy, etc.)
- [ ] You have a Vercel account and project deployed

### Steps:
1. [ ] Deploy your project to Vercel
2. [ ] Go to Vercel Dashboard → Settings → Domains
3. [ ] Add domain: `tarabastate.gov.ng` (or `www.tarabastate.gov.ng`)
4. [ ] **Copy the exact DNS values** Vercel shows you
5. [ ] Go to your DNS provider's dashboard
6. [ ] Add the DNS record (CNAME or A record) with Vercel's values
7. [ ] Save the DNS record
8. [ ] Wait for DNS propagation (check status in Vercel)
9. [ ] SSL certificate will auto-provision (usually 5-10 minutes)
10. [ ] Test: Visit `https://tarabastate.gov.ng` (should work!)

---

## Troubleshooting

### Domain Not Working?

1. **Check DNS Propagation:**
   - Use dnschecker.org to verify DNS has propagated globally
   - Wait up to 24 hours if needed

2. **Verify DNS Records:**
   - Make sure you used the exact values from Vercel
   - Check for typos in the DNS record

3. **Check Vercel Status:**
   - Go to Vercel Dashboard → Domains
   - Look for error messages
   - Check if domain shows as "Valid"

4. **Common Issues:**
   - **Wrong DNS value:** Use the exact value Vercel provides
   - **DNS not propagated:** Wait longer (up to 48 hours)
   - **Cached DNS:** Clear your browser cache or use incognito mode
   - **Proxy enabled (Cloudflare):** Turn off proxy (orange cloud) initially

### SSL Certificate Not Working?

1. **Wait:** SSL usually takes 5-10 minutes after DNS propagates
2. **Check Vercel:** Look for SSL status in domain settings
3. **Verify DNS:** Make sure DNS is fully propagated
4. **Contact Support:** If still not working after 24 hours, contact Vercel support

---

## Example: Complete DNS Configuration

### Scenario: Using www subdomain

**In Vercel:**
1. Add domain: `www.tarabastate.gov.ng`
2. Vercel shows: `CNAME www → cname.vercel-dns.com`

**In Your DNS Provider (e.g., Cloudflare):**
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: DNS only (off)
TTL: Auto
```

**Optional: Redirect root to www**
```
Type: CNAME
Name: @
Target: www.tarabastate.gov.ng
```

**Result:**
- ✅ `www.tarabastate.gov.ng` → Works
- ✅ `tarabastate.gov.ng` → Redirects to www (if configured)

---

## Important Notes

1. **Use Vercel's Exact Values:** Don't use generic values from this guide. Vercel will show you specific values for your domain - use those!

2. **DNS Propagation Takes Time:** Be patient. It can take up to 48 hours, though usually much faster.

3. **SSL is Automatic:** Vercel handles SSL certificates automatically. No manual configuration needed.

4. **Both www and root:** You can add both `tarabastate.gov.ng` and `www.tarabastate.gov.ng` in Vercel, and Vercel will handle redirects.

5. **Check Vercel Dashboard:** The Vercel dashboard will show you the exact DNS records to add and verify when they're working.

---

## Quick Reference

### For Subdomain (www):
```
Type: CNAME
Name: www
Value: [Vercel will provide exact value]
```

### For Root Domain:
```
Type: A
Name: @
Value: [Vercel will provide exact IP]
```

**Remember:** Always use the exact values Vercel shows you in the dashboard!

---

## Need Help?

1. **Vercel Documentation:** https://vercel.com/docs/concepts/projects/domains
2. **Vercel Support:** support@vercel.com
3. **Check Status:** Vercel Dashboard → Domains → Your domain

---

**Next Steps:**
1. Deploy your project to Vercel
2. Add domain in Vercel dashboard
3. Copy the DNS values Vercel provides
4. Add DNS record in your DNS provider
5. Wait for propagation
6. SSL will auto-provision
7. Done! 🎉

