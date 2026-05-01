# System Bookmarks & Watch History Setup Guide

## Overview
This guide will help you set up the Bookmark and Watch History features for the Nime anime app.

## Required Supabase Tables

You need to create the following tables in your Supabase database. Run the SQL commands from `supabase/schema.sql`:

### 1. Bookmarks Table
```sql
CREATE TABLE bookmarks (
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
```

### 2. Bookmark Lists Table
```sql
CREATE TABLE bookmark_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Watch History Table
```sql
CREATE TABLE watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_slug TEXT NOT NULL,
  anime_title TEXT NOT NULL,
  poster_url TEXT,
  current_episode INTEGER,
  minutes_watched INTEGER DEFAULT 0,
  watched_at TIMESTAMP DEFAULT NOW(),
  last_watched_at TIMESTAMP DEFAULT NOW()
);
```

## Setup Steps

1. **Go to Supabase Console**
   - Navigate to your Supabase project
   - Go to SQL Editor
   - Copy and paste the SQL from `supabase/schema.sql`
   - Execute the SQL

2. **Verify Tables Created**
   - Go to the "Table Editor" in Supabase
   - Confirm you see: `bookmarks`, `bookmark_lists`, and `watch_history` tables
   - Check that Row Level Security (RLS) is enabled

3. **Update Environment Variables**
   - Make sure `.env` file exists with:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Test the Features**
   - Log in to the app
   - Go to an anime details page
   - Click the "📌 Bookmark" button
   - Check `/bookmarks` page to see saved bookmarks
   - Click play on an episode - it should be added to watch history
   - Go to `/history` to see watch history and statistics

## Features

### Bookmarks
- **Add/Remove Bookmarks**: Click the bookmark button on anime pages
- **Organize**: Create custom bookmark lists
- **Quick Access**: View recent bookmarks from the navbar dropdown
- **Bookmark Management**: Full page at `/bookmarks` to manage all bookmarks

### Watch History
- **Automatic Tracking**: When you start playing a video, it's automatically added to history
- **Statistics**: View total hours watched, total anime watched
- **Continue Watching**: Quick access to resume recent anime
- **Filters & Sorting**: Sort by date, title, or episodes; filter by recent/oldest
- **Delete Options**: Remove individual items or clear all history

## Troubleshooting

### Bookmarks not saving?
1. Check browser console for errors (F12 → Console)
2. Verify Supabase tables are created
3. Ensure you're logged in
4. Check that `user_id` matches authenticated user

### Chat not working?
1. Verify `messages` table exists in Supabase
2. Check that profiles relationship is properly configured
3. Enable RLS policies for chat messages
4. Check browser console for connection errors

### History not tracking?
1. Make sure you're logged in before playing videos
2. Check that `watch_history` table exists
3. Verify that episodes have proper data structure

## Related Files

- **Contexts**: 
  - `src/context/BookmarkContext.jsx` - Bookmark management
  - `src/context/WatchHistoryContext.jsx` - Watch history tracking

- **Pages**:
  - `src/pages/Bookmarks.jsx` - Bookmark management UI
  - `src/pages/History.jsx` - Watch history UI
  - `src/pages/Watch.jsx` - Video player with bookmark/history integration

- **Components**:
  - `src/components/Navbar.jsx` - Bookmark quick-access bar
  - `src/components/Chat.jsx` - Global chat

## Database Schema with RLS

All tables include Row Level Security (RLS) policies:
- Users can only view/edit their own data
- Indexes are created for better performance
- Timestamps are auto-generated

## Notes

- Bookmarks and watch history are user-specific and stored in Supabase
- All data is encrypted at rest in Supabase
- The app handles authentication through AuthContext
- Real-time updates work through Supabase Realtime subscriptions
