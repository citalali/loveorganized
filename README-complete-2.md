# Couples Dashboard MVP - Complete Setup Guide

## 📋 What's Included

### ✅ Features in MVP
- **Authentication**: Email/password signup & login with Supabase Auth
- **Date Ideas**: Create, filter by category/cost level
- **To-Dos**: Create shared/personal tasks with checkboxes
- **Events & Packing**: Event creation with packing list management
- **Real-time Updates**: Instant sync across tabs using Supabase subscriptions
- **Mobile-First Design**: Responsive UI with Tailwind CSS
- **Dark Mode Ready**: Easy to customize color scheme

### 📦 Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State**: Zustand for notifications
- **Deployment**: Vercel (1-click deploy)

---

## 🚀 Quick Start (10 minutes)

### Step 1: Create Project
```bash
npx create-next-app@latest couples-app --typescript --tailwind --no-eslint
cd couples-app
```

### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js zustand
```

### Step 3: Set Up Supabase
1. Go to [supabase.com](https://supabase.com) → Create free account
2. Create new project (choose free tier)
3. Go to **Settings** → **API** and copy:
   - Project URL
   - Anon Key

### Step 4: Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key
```

### Step 5: Create Supabase Tables
In Supabase dashboard, go to **SQL Editor** and run this:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  partner_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create date_ideas table
CREATE TABLE date_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cost_level TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create todos table
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_shared BOOLEAN DEFAULT false,
  assigned_to UUID,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create packing_items table
CREATE TABLE packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  assigned_to UUID,
  is_packed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;

-- Set up RLS Policies (basic - allows users to see their own data)
CREATE POLICY "Users can read own data"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Step 6: Copy Code Files
Copy all provided files into your project:
- `lib/supabase.ts`
- `lib/stores.ts`
- `components/Navbar.tsx`
- `components/TaskItem.tsx`
- `components/DatabaseCard.tsx`
- `components/Notification.tsx`
- `app/layout.tsx`
- `app/page.tsx`
- `app/dashboard/layout.tsx`
- `app/dashboard/page.tsx`
- `app/dashboard/todos/page.tsx`
- `app/dashboard/date-ideas/page.tsx`
- `app/dashboard/events/page.tsx`

### Step 7: Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000`

### Step 8: Deploy to Vercel
```bash
git add .
git commit -m "Initial commit"
git push
```
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repo
- Add env variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Deploy!

---

## 📁 File Structure
```
couples-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (auth page)
│   └── dashboard/
│       ├── layout.tsx
│       ├── page.tsx (main dashboard)
│       ├── todos/
│       │   └── page.tsx
│       ├── date-ideas/
│       │   └── page.tsx
│       └── events/
│           └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── TaskItem.tsx
│   ├── DatabaseCard.tsx
│   └── Notification.tsx
├── lib/
│   ├── supabase.ts (Supabase client)
│   └── stores.ts (Zustand stores)
├── .env.local (environment variables)
└── package.json
```

---

## 🎨 Customization

### Change Colors
Edit Tailwind classes in components. Example:
```tsx
className="bg-pink-600 text-white" // Change pink-600 to blue-600, etc.
```

### Add New Database Sections
1. Create table in Supabase
2. Add page in `app/dashboard/[section]/page.tsx`
3. Add link in `components/Navbar.tsx`
4. Add card in dashboard home

### Add Partner Connection
1. Add `partner_id` field to profiles (already in schema)
2. Create "Add Partner" page with invitation system
3. Show partner's items in shared views

---

## 🔐 Security Notes

- Row Level Security (RLS) is basic - update policies for production
- Use JWT verification for API routes
- Never commit `.env.local` to git
- Enable email verification in Supabase Auth settings

---

## 📝 What's NOT in MVP (Future Development)

### Phase 2 Features
- Real partner connections & sharing
- Talk topics database
- Food & recipes section
- Progress summaries
- Notification system
- Image uploads
- Mobile app
- Dark mode
- Activity feed
- Advanced filtering

See the "Development Roadmap" section below for implementation guides.

---

## 🛣️ Development Roadmap

### Feature: Partner Connections
**Estimated Time**: 2 hours
```
1. Create invite system (email-based)
2. Add partner profile page
3. Update RLS policies for shared data
4. Add partner selector to item creation
5. Filter shared vs personal items
```

### Feature: Talk Topics
**Estimated Time**: 1 hour
```
1. Create topics table
2. Add page in dashboard
3. Add favorite/rating system
4. Add category tags
```

### Feature: Food & Recipes
**Estimated Time**: 1.5 hours
```
1. Create recipes table
2. Create restaurants table
3. Add import from API (optional)
4. Add favorites/ratings
```

### Feature: Dashboard Summary
**Estimated Time**: 1 hour
```
1. Add progress bars
2. Add upcoming events widget
3. Add recent activity feed
4. Add quick stats
```

### Feature: Notifications
**Estimated Time**: 1.5 hours
```
1. Create notifications table
2. Set up email alerts via Supabase Functions
3. Add in-app notification center
4. Add preferences page
```

---

## 🐛 Troubleshooting

**"No session found"**: Check Supabase URL and Anon Key in `.env.local`

**"Table doesn't exist"**: Run SQL setup again in Supabase SQL Editor

**"Real-time not working"**: Enable Realtime in Supabase → Replication Settings

**Build fails**: Run `npm run lint` to check for errors

---

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://zustand-demo.vercel.app/

---

## 💡 Pro Tips

1. **Add seed data**: Create a script to add sample date ideas
2. **Create custom hooks**: Extract data fetching logic for reuse
3. **Add validation**: Validate inputs before sending to DB
4. **Optimize queries**: Use `.select()` to limit fields
5. **Error boundaries**: Add error handling for better UX

---

**Built with ❤️ for couples. Happy planning!**
