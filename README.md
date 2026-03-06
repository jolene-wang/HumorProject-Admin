# HumorProject Admin

Admin dashboard for managing the HumorProject database with Google OAuth authentication.

## Features

- **Google OAuth Authentication**: Only users with `is_superadmin=true` can access
- **Dashboard Statistics**: View interesting metrics about users, images, and captions
- **User Management**: Read user profiles
- **Image Management**: Full CRUD operations for images
- **Caption Management**: Read captions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
   - Set up Google OAuth credentials at https://console.cloud.google.com/
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Generate a secure `NEXTAUTH_SECRET`: `openssl rand -base64 32`

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Solving the Bootstrap Problem

**Question**: If `profiles.is_superadmin==TRUE` is required to access the admin area, how do you grant yourself access?

**Answer**: You need to manually update the database to set your profile's `is_superadmin` field to `true`. Here are the options:

### Option 1: Using Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run this query (replace with your email):
```sql
UPDATE profiles SET is_superadmin = true WHERE email = 'your-email@example.com';
```

### Option 2: Using Supabase Table Editor
1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select the `profiles` table
4. Find your profile row
5. Edit the `is_superadmin` column to `true`

### Option 3: Using a Script
Create a one-time script to update your profile:
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://qihsgnfjqmkjmoowyfbn.supabase.co',
  'YOUR_SUPABASE_ANON_KEY'
);

async function grantSuperadmin() {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_superadmin: true })
    .eq('email', 'your-email@example.com');
  
  console.log('Updated:', data, error);
}

grantSuperadmin();
```

After setting `is_superadmin=true` for your profile, you'll be able to sign in and access the admin area.
