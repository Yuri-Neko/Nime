-- Bookmarks table
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

-- Bookmark lists table
CREATE TABLE IF NOT EXISTS bookmark_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Watch history table
CREATE TABLE IF NOT EXISTS watch_history (
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_slug ON bookmarks(anime_slug);
CREATE INDEX IF NOT EXISTS idx_bookmark_lists_user ON bookmark_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_slug ON watch_history(anime_slug);

-- Enable Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmark_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" ON bookmarks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for bookmark_lists
CREATE POLICY "Users can view their own bookmark lists" ON bookmark_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmark lists" ON bookmark_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmark lists" ON bookmark_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmark lists" ON bookmark_lists
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for watch_history
CREATE POLICY "Users can view their own watch history" ON watch_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch history" ON watch_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watch history" ON watch_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watch history" ON watch_history
  FOR DELETE USING (auth.uid() = user_id);
