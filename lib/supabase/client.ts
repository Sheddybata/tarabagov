import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Return a safe mock client if env vars are missing
  // This prevents the app from crashing
  if (!supabaseUrl || !supabaseKey || supabaseUrl === '' || supabaseKey === '') {
    // Return a minimal client that won't crash
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder',
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {
            // No-op
          },
        },
      }
    );
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          if (typeof document === 'undefined') return [];
          return document.cookie.split(';').map(cookie => {
            const [name, ...rest] = cookie.split('=')
            return { name: name.trim(), value: rest.join('=') }
          })
        },
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') return;
          cookiesToSet.forEach(({ name, value, options }) => {
            document.cookie = `${name}=${value}; path=${options?.path || '/'}; max-age=${options?.maxAge || 3600 * 24 * 365}; SameSite=${options?.sameSite || 'Lax'}${options?.secure ? '; Secure' : ''}`
          })
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    // Return safe fallback
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder',
      {
        cookies: {
          getAll() { return []; },
          setAll() {},
        },
      }
    );
  }
}

