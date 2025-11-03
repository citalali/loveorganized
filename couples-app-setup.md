# Couples Dashboard - Complete MVP Codebase

## Quick Setup (10 minutes)

### 1. Prerequisites
- Node.js 18+
- npm or yarn

### 2. Create Next.js Project
```bash
npx create-next-app@latest couples-app --typescript --tailwind
cd couples-app
```

### 3. Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs next-auth zustand date-fns
```

### 4. Set Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Create Supabase Tables (Run in SQL Editor)
```sql
-- Users table (extends auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  partner_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Date Ideas
CREATE TABLE date_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cost_level TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- To-Dos
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  is_shared BOOLEAN DEFAULT false,
  assigned_to UUID,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  date DATE,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Event Packing Lists
CREATE TABLE packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  item_name TEXT NOT NULL,
  assigned_to UUID,
  is_packed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
```

### 6. Deploy to Vercel
```bash
git add .
git commit -m "Initial commit"
git push
```
Visit [vercel.com](https://vercel.com), connect your GitHub repo, add env variables, and deploy.

---

## File Structure
```
couples-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── date-ideas/
│   │   ├── todos/
│   │   └── events/
│   └── auth/
│       └── callback.tsx
├── components/
│   ├── Navbar.tsx
│   ├── DatabaseCard.tsx
│   ├── TaskItem.tsx
│   ├── FilterTabs.tsx
│   └── ...
├── lib/
│   ├── supabase.ts
│   └── stores.ts
└── .env.local
```

See the complete code files below for implementation.
