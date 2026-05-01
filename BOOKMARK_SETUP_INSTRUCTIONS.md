# Bookmark & Favorite System - Setup Instructions

## Quick Start

The bookmark and favorite system is now fully implemented. Follow these steps to ensure everything works:

### 1. Supabase Database Setup

Open your Supabase dashboard and run these SQL commands in the SQL Editor:

```sql
-- Run the schema file: supabase/schema.sql
```

Or manually create the tables:

**For Favorites (Public - shown on Profile):**
```sql
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_slug TEXT NOT NULL,
  anime_title TEXT NOT NULL,
  poster_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, anime_slug)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
```

**For Bookmarks (Private - only visible to user):**
```sql
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_slug TEXT NOT NULL,
  anime_title TEXT NOT NULL,
  poster_url TEXT,
  episode_id TEXT,
  episode_number INTEGER,
  list_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" ON bookmarks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);
```

**For Bookmark Lists (Private organization):**
```sql
CREATE TABLE IF NOT EXISTS bookmark_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE bookmark_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmark lists" ON bookmark_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmark lists" ON bookmark_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmark lists" ON bookmark_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmark lists" ON bookmark_lists
  FOR DELETE USING (auth.uid() = user_id);
```

### 2. Test the System

1. **Log in** to your account
2. **Navigate to an anime page** (e.g., `/anime/6374-daikenja-riddle-no-jikan-gyakkou`)
3. **Click the favorite button** (❤️ Favorit) - should save to public profile
4. **Click the bookmark button** (📌 Bookmark) - should save privately
5. **Go to Profile** (`/profile`) - see favorites under "Anime Favorit"
6. **Go to Bookmarks** (`/bookmarks`) - see only your bookmarks (private)
7. **Check Navbar** - see bookmark icon with count and hover dropdown

### 3. Features

#### Favorite System
- Public display on user profile
- Shows in "Anime Favorit" section on `/profile`
- Can be seen by other users visiting your profile
- Delete by clicking the X button on each favorite
- Heart icon (❤️) in watch page

#### Bookmark System
- Private - only you can see your bookmarks
- Access at `/bookmarks` page
- Can organize into custom lists
- Quick access via navbar dropdown
- Bookmark icon (🔖) in watch page

#### Watch History
- Automatically tracked when you play a video
- View at `/history`
- Shows statistics (total hours, anime count, continue watching)
- Can filter and sort by date/title/episodes
- Delete individual or all history

## Troubleshooting

### Tables Not Found Error
- Go to Supabase dashboard
- SQL Editor
- Run the SQL commands above
- Verify tables appear in "Tables" section

### Bookmark Not Saving
- Check browser console (F12) for errors with `[v0]` prefix
- Verify user is logged in
- Check Supabase table has data: `SELECT * FROM bookmarks WHERE user_id = 'your-user-id';`
- Verify RLS policy allows INSERT

### Favorite Not Showing on Profile
- Refresh the profile page
- Check Supabase: `SELECT * FROM favorites WHERE user_id = 'your-user-id';`
- Verify data is actually in the table

### Button Not Updating
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check browser console for JavaScript errors

## File Structure

- `/src/context/BookmarkContext.jsx` - Bookmark state management
- `/src/context/WatchHistoryContext.jsx` - History state management
- `/src/pages/Bookmarks.jsx` - Bookmarks page
- `/src/pages/History.jsx` - History page  
- `/src/pages/Watch.jsx` - Anime watch page with buttons
- `/src/pages/Profile.jsx` - Profile with favorite display
- `/supabase/schema.sql` - Database schema and RLS policies

## Key Implementation Details

### Favorite Button (Watch.jsx)
- Uses `toggleFavorite()` function
- Saves to `favorites` table
- Displayed on user's profile
- Public visibility

### Bookmark Button (Watch.jsx)
- Uses `toggleBookmark()` function
- Saves to `bookmarks` table
- Private to user only
- RLS policies restrict to user_id

### Profile Favorites
- Fetches from `favorites` table
- Shows poster and title
- Delete button on hover
- Grid layout responsive

### Bookmarks Page
- Shows all private bookmarks
- Can create/manage lists
- Private access only (protected route)
- Navbar bookmark bar shows recent bookmarks

## Next Steps

1. Ensure Supabase tables exist (run SQL above)
2. Test on an anime page from the provided URL
3. Add/remove favorites and bookmarks
4. Check Profile and Bookmarks pages
5. Report any console errors with `[v0]` prefix
