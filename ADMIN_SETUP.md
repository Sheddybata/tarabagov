# Admin Panel Setup Guide

## How to Access the Admin Panel

1. **URL**: Navigate to `/admin/login` in your browser
   - Development: `http://localhost:3000/admin/login`
   - Production: `https://yourdomain.com/admin/login`

2. **Login Credentials**: Use the admin email and password you set up in Supabase

## Setting Up Admin Access

### Step 1: Create Admin User in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"** → **"Create new user"**
4. Enter:
   - **Email**: Your admin email (e.g., `admin@tarabastate.gov.ng`)
   - **Password**: A strong password
   - **Auto Confirm User**: ✅ Check this box
5. Click **"Create User"**

### Step 2: Set Environment Variable

Create or update your `.env.local` file in the project root:

```env
# Admin Email (must match the email you created in Supabase)
ADMIN_EMAIL=admin@tarabastate.gov.ng

# Or use NEXT_PUBLIC_ADMIN_EMAIL if you prefer public access
NEXT_PUBLIC_ADMIN_EMAIL=admin@tarabastate.gov.ng
```

**Note**: 
- `ADMIN_EMAIL` is server-side only (more secure)
- `NEXT_PUBLIC_ADMIN_EMAIL` is accessible on the client-side
- The code checks both, but `ADMIN_EMAIL` takes precedence

### Step 3: Restart Your Development Server

After setting the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## Security Features

- ✅ Single admin account (no role-based access control)
- ✅ Email-based authentication check
- ✅ Protected routes (redirects to login if not authenticated)
- ✅ Session management via Supabase Auth
- ✅ Automatic logout on invalid credentials

## Admin Panel Features

### Current Pages:
- **Dashboard** (`/admin/dashboard`) - Overview and statistics
- **Citizen Reports** (`/admin/reports`) - Manage citizen reports
- **Birth Registrations** (`/admin/birth-registrations`) - Review birth registrations
- **Land Services** (`/admin/land-services`) - TAGIS management
- **Tax Services** (`/admin/tax-services`) - TSIRS management
- **School Records** (`/admin/schools`) - School directory management
- **Hospital Records** (`/admin/hospitals`) - Hospital directory management
- **Document Verification** (`/admin/documents`) - Document verification requests
- **Social Services** (`/admin/social-services`) - Social services management
- **Settings** (`/admin/settings`) - System configuration

## Troubleshooting

### "Access denied" error
- Verify the email in `.env.local` matches the email in Supabase
- Check that the user is created and confirmed in Supabase
- Ensure environment variables are loaded (restart the server)

### Can't login
- Verify Supabase credentials are correct in `.env.local`
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Ensure the user exists in Supabase Authentication

### Redirect loop
- Clear browser cookies/localStorage
- Verify the admin email is correctly set in environment variables
- Check browser console for errors

## Next Steps

1. Connect admin pages to Supabase database
2. Implement data fetching for each service
3. Add CRUD operations for managing records
4. Implement approval/rejection workflows
5. Add analytics and reporting features

