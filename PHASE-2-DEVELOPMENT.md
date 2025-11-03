# Phase 2 Development Prompt - Partner Features & Advanced Sections

**Use this prompt when you're ready to extend beyond the MVP.**

---

## Overview

Extend the couples dashboard MVP with partner connection features, additional database sections (Talk Topics, Food & Recipes), and advanced UI improvements. Maintain the same code quality, mobile-first design, and minimalist aesthetic.

## Features to Add

### 1. Partner Connection System (Priority: HIGH)
**Time: 3-4 hours**

```
- Create "Settings" page with partner management
- Add email invite system
- Show partner profile with status
- Update database queries to show partner's shared items
- Add "shared_with" parameter to items
- Create partner badge on items
- Add toggle to create item as "shared" by default
- Add partner removal capability
```

**Database Changes**:
```sql
ALTER TABLE date_ideas ADD COLUMN shared_with UUID;
ALTER TABLE todos ADD COLUMN shared_with UUID;
ALTER TABLE events ADD COLUMN shared_with UUID;

CREATE TABLE partner_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES profiles(id),
  to_email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**UI Components**:
- Settings page with partner info
- Invite form with email
- Partner request notifications
- Shared items filter

---

### 2. Talk Topics Section (Priority: MEDIUM)
**Time: 2-3 hours**

```
- Create topics database
- Build topics page with add/view functionality
- Add category filtering (relationships, future, memories, dreams)
- Add "favorite" star system
- Add "discussed" checkbox
- Show topics in random order for conversation starters
```

**Database Schema**:
```sql
CREATE TABLE talk_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  topic TEXT NOT NULL,
  category TEXT,
  is_favorite BOOLEAN DEFAULT false,
  is_discussed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE topic_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES talk_topics(id),
  response_by UUID,
  response_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Features**:
- Quick add form
- Shuffle button to get random topic
- Category filter tabs
- Discussion history

---

### 3. Food & Recipes Section (Priority: MEDIUM)
**Time: 3-4 hours**

```
- Create recipes database
- Create restaurant database
- Add favorites system
- Add rating system
- Add recipe search/filter by cuisine
- Add restaurant filter by type/price
- Optional: API integration for recipe search
```

**Database Schema**:
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  ingredients TEXT[],
  instructions TEXT,
  cuisine TEXT,
  difficulty TEXT,
  prep_time INT,
  cook_time INT,
  servings INT,
  rating INT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  cuisine TEXT,
  location TEXT,
  rating INT,
  price_range TEXT,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  last_visited DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**UI Components**:
- Recipe cards with ingredients/instructions
- Restaurant cards with ratings
- Add/edit forms
- Filter by cuisine/price
- Favorites system

---

### 4. Advanced Dashboard Features (Priority: LOW)
**Time: 2-3 hours**

```
- Dashboard summary with:
  - Progress bars for event packing
  - Upcoming events widget
  - Recent activity feed
  - Quick stats (completed tasks this week, etc.)
- Activity log showing recent changes
- Progress indicators for multi-item tasks
```

**Features**:
- Show incomplete packing items
- Upcoming events timeline
- Task completion percentage
- Weekly/monthly summaries

---

### 5. UI/UX Improvements (Priority: MEDIUM)
**Time: 2-3 hours**

```
- Add side-by-side shared view (show both people's lists)
- Add edit functionality for all items
- Add delete with confirmation
- Add search functionality across sections
- Add sorting options (date, alphabetical, rating)
- Add tags/labels system
- Add progress indicators
- Add keyboard shortcuts for power users
```

---

## Implementation Order

1. **Week 1**: Partner System (foundation for shared features)
2. **Week 2**: Talk Topics (quick to build, high value)
3. **Week 3**: Food & Recipes (more complex, highly useful)
4. **Week 4**: Polish & optimize

---

## Code Quality Guidelines

- Keep components under 200 lines (extract sub-components if needed)
- Add TypeScript types for all new data
- Implement error boundaries
- Add loading states
- Use consistent naming conventions
- Document complex logic
- Maintain mobile-first approach
- Test with 2 users for shared features

---

## Testing Checklist for Phase 2

- [ ] Partner accepts/declines invite
- [ ] Shared items visible to partner
- [ ] Edits sync in real-time to partner
- [ ] Topics shuffle randomly
- [ ] Recipes can be marked favorite
- [ ] Restaurant ratings persist
- [ ] Activity feed updates in real-time
- [ ] All new components work on mobile
- [ ] Filters work correctly
- [ ] Delete confirmation appears
- [ ] Edit changes sync immediately

---

## Performance Optimization Tips

- Use `.select()` to fetch only needed fields
- Add pagination for large lists (100+ items)
- Implement search debouncing
- Cache partner profile
- Consider denormalizing shared data

---

## Next Phase (Phase 3)

- Mobile app (React Native)
- PWA features (offline support)
- Advanced filtering/search
- Import/export functionality
- Multi-user teams
- Analytics dashboard

---

**Ready to build? Start with partner system, it unlocks everything else!**
