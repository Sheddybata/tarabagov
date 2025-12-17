# Email Setup with Vercel

## ✅ Yes, You Can Use Email with Vercel!

Vercel doesn't provide email service directly, but you can easily integrate third-party email services. Here are the best options:

---

## Recommended Email Services for Vercel

### 1. **Resend** (Best for Next.js) ⭐ RECOMMENDED
**Best for**: Transactional emails, notifications, newsletters

**Pros:**
- ✅ Built specifically for developers
- ✅ Excellent Next.js/React support
- ✅ Great deliverability
- ✅ Simple API
- ✅ Free tier: 3,000 emails/month
- ✅ React Email templates support

**Pricing:**
- Free: 3,000 emails/month
- Pro: $20/month for 50,000 emails

**Setup Time:** 5 minutes

---

### 2. **SendGrid** (Popular Choice)
**Best for**: High volume, enterprise needs

**Pros:**
- ✅ Very reliable
- ✅ High deliverability
- ✅ Good analytics
- ✅ Free tier: 100 emails/day

**Pricing:**
- Free: 100 emails/day
- Essentials: $19.95/month for 50,000 emails

---

### 3. **Mailgun**
**Best for**: Developer-friendly, flexible

**Pros:**
- ✅ Good API
- ✅ Free tier available
- ✅ Good documentation

**Pricing:**
- Free: 5,000 emails/month (first 3 months)
- Foundation: $35/month for 50,000 emails

---

### 4. **AWS SES** (Cost-Effective)
**Best for**: High volume, cost savings

**Pros:**
- ✅ Very cheap ($0.10 per 1,000 emails)
- ✅ Highly scalable
- ✅ Reliable

**Cons:**
- ⚠️ More complex setup
- ⚠️ Requires AWS account

**Pricing:** $0.10 per 1,000 emails

---

### 5. **Supabase Edge Functions + Email Service**
**Best for**: If you want everything in one place

**Pros:**
- ✅ Already using Supabase
- ✅ Can use with Supabase Edge Functions

**Note:** Supabase doesn't have built-in email, but you can call email APIs from Edge Functions

---

## Quick Setup: Resend (Recommended)

### Step 1: Create Resend Account
1. Go to https://resend.com
2. Sign up for free account
3. Verify your domain (tarabastate.gov.ng) or use their test domain

### Step 2: Get API Key
1. Go to API Keys in dashboard
2. Create new API key
3. Copy the key (starts with `re_`)

### Step 3: Add to Vercel Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:
```
RESEND_API_KEY=re_your_api_key_here
```

### Step 4: Install Resend Package
```bash
npm install resend
```

### Step 5: Create Email API Route
Create `app/api/send-email/route.ts`:

```typescript
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, from = 'noreply@tarabastate.gov.ng' } = await request.json();

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
```

### Step 6: Use in Your Forms
Update `components/contact/contact-form.tsx`:

```typescript
const onSubmit = async (data: ContactFormValues) => {
  setIsSubmitting(true);
  
  try {
    // Save to database (existing code)
    // ... your Supabase insert code ...
    
    // Send email notification
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'admin@tarabastate.gov.ng',
        subject: `New Contact Form: ${data.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        `,
      }),
    });

    setSubmitSuccess(true);
    reset();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## Email Use Cases for Your Portal

### 1. **Contact Form Notifications**
- Send email to admin when someone submits contact form
- Send confirmation to user

### 2. **Application Status Updates**
- Birth registration status changes
- Document verification updates
- Land service request updates
- Social service enrollment confirmations

### 3. **Report Submissions**
- Notify admin of new citizen reports
- Send confirmation to reporter

### 4. **Newsletter Subscriptions**
- Welcome email for new subscribers
- Regular newsletter updates

### 5. **Admin Notifications**
- New application submissions
- System alerts
- Daily/weekly summaries

---

## Example: Complete Email Integration

### Create Email Utility
`lib/email.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  from = 'Taraba State Portal <noreply@tarabastate.gov.ng>',
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

// Pre-built email templates
export const emailTemplates = {
  contactFormNotification: (data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => ({
    subject: `New Contact Form: ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  }),

  applicationConfirmation: (data: {
    referenceId: string;
    type: string;
    applicantName: string;
  }) => ({
    subject: `Application Submitted: ${data.referenceId}`,
    html: `
      <h2>Application Received</h2>
      <p>Dear ${data.applicantName},</p>
      <p>Your ${data.type} application has been received.</p>
      <p><strong>Reference ID:</strong> ${data.referenceId}</p>
      <p>You will be notified once your application is reviewed.</p>
      <p>Thank you,<br>Taraba State Government</p>
    `,
  }),

  statusUpdate: (data: {
    referenceId: string;
    type: string;
    status: string;
    applicantName: string;
  }) => ({
    subject: `Application Status Update: ${data.referenceId}`,
    html: `
      <h2>Application Status Update</h2>
      <p>Dear ${data.applicantName},</p>
      <p>Your ${data.type} application (${data.referenceId}) status has been updated.</p>
      <p><strong>New Status:</strong> ${data.status}</p>
      <p>Thank you,<br>Taraba State Government</p>
    `,
  }),
};
```

### Use in API Routes
`app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';
import { createAdminClient } from '@/lib/supabase/server-admin';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Save to database
    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([data]);

    if (dbError) throw dbError;

    // Send notification to admin
    await sendEmail({
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@tarabastate.gov.ng',
      ...emailTemplates.contactFormNotification(data),
    });

    // Send confirmation to user
    await sendEmail({
      to: data.email,
      subject: 'Thank you for contacting us',
      html: `
        <h2>Thank you for contacting Taraba State Government</h2>
        <p>We have received your message and will get back to you soon.</p>
        <p>Best regards,<br>Taraba State Government</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
```

---

## Domain Verification (Important!)

To send emails from `@tarabastate.gov.ng`:

### Resend Domain Setup:
1. Go to Resend Dashboard → Domains
2. Add `tarabastate.gov.ng`
3. Add DNS records (provided by Resend):
   - SPF record
   - DKIM records
   - DMARC record (optional but recommended)
4. Wait for verification (usually 5-10 minutes)

### DNS Records Example:
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all

Type: CNAME
Name: resend._domainkey
Value: [provided by Resend]
```

---

## Cost Estimate

### For Taraba State Portal:

**Low Volume** (100-500 emails/month):
- **Resend Free Tier**: ✅ FREE (3,000 emails/month)
- **SendGrid Free Tier**: ✅ FREE (100 emails/day = 3,000/month)

**Medium Volume** (5,000-10,000 emails/month):
- **Resend**: $20/month
- **SendGrid**: $19.95/month
- **AWS SES**: ~$1/month (very cheap!)

**High Volume** (50,000+ emails/month):
- **Resend**: $20/month (up to 50k)
- **SendGrid**: $19.95/month (up to 50k)
- **AWS SES**: ~$5/month

---

## Recommendation

**For tarabastate.gov.ng, I recommend:**

### **Resend** (Best Choice)
- ✅ Easiest to set up
- ✅ Great for Next.js
- ✅ Free tier covers initial needs
- ✅ Simple API
- ✅ Good deliverability

### **Alternative: SendGrid**
- If you need more enterprise features
- If you're already familiar with it

---

## Next Steps

1. **Sign up for Resend** (https://resend.com)
2. **Get API key** and add to Vercel environment variables
3. **Install package**: `npm install resend`
4. **Create email utility** (`lib/email.ts`)
5. **Update API routes** to send emails
6. **Verify domain** (tarabastate.gov.ng) for better deliverability
7. **Test** with contact form and application submissions

---

## Testing

### Test Email (Before Domain Verification):
Use Resend's test domain:
```typescript
from: 'onboarding@resend.dev' // Test domain
to: 'your-email@example.com'
```

### After Domain Verification:
```typescript
from: 'noreply@tarabastate.gov.ng' // Your verified domain
to: 'user@example.com'
```

---

## Security Best Practices

1. ✅ **Never expose API keys** - Use environment variables only
2. ✅ **Rate limiting** - Add rate limits to email endpoints
3. ✅ **Input validation** - Validate email addresses and content
4. ✅ **SPF/DKIM/DMARC** - Set up for better deliverability and security
5. ✅ **Email templates** - Use templates to prevent injection attacks

---

**Need help implementing email?** Let me know and I can:
- Set up Resend integration
- Create email templates
- Update your forms to send emails
- Configure domain verification

