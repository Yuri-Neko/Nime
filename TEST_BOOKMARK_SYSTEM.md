# Test Bookmark & Favorite System

## System Overview
- **Favorites**: Public, displayed on Profile page, shows all user's favorite anime
- **Bookmarks**: Private, only visible to user at `/bookmarks`, used for personal tracking
- **History**: Tracks watched episodes, visible at `/history`

## Testing Checklist

### 1. Favorite Button on Anime Page
- [ ] Navigate to anime page (e.g., `/anime/6374-daikenja-riddle-no-jikan-gyakkou`)
- [ ] Click "❤️ Favorit" button
- [ ] Button should change to "❤️ Favorited" with red highlight
- [ ] Favorite should appear in `/profile` under "Anime Favorit"
- [ ] Click again to remove from favorites

### 2. Bookmark Button on Anime Page
- [ ] On same anime page, click "📌 Bookmark" button
- [ ] Button should change to "🔖 Bookmarked" with golden highlight
- [ ] Bookmark should appear in `/bookmarks` page (private, only for you)
- [ ] Click again to remove bookmark

### 3. Profile Page Favorites
- [ ] Go to `/profile`
- [ ] Under "Anime Favorit", see all favorite anime with posters
- [ ] Hover over each favorite to see delete button
- [ ] Click delete button to remove favorite
- [ ] Count should update

### 4. Bookmarks Page (Private)
- [ ] Go to `/bookmarks`
- [ ] Only see bookmarks added by you
- [ ] Can create bookmark lists
- [ ] Can move bookmarks to lists
- [ ] Can delete individual bookmarks
- [ ] Bookmark bar in navbar shows recent bookmarks

### 5. Navbar Bookmark Bar
- [ ] Check top-right of navbar for bookmark icon with count
- [ ] Hover to see 3 most recent bookmarks
- [ ] Click "Lihat Semua" to go to `/bookmarks`
- [ ] Icon shows properly as bookmark, not document

## Database Requirements

### Tables Needed (in Supabase):
1. **favorites** - Public, for favorites display on profile
   - id, user_id, anime_slug, anime_title, poster_url, created_at
   - RLS: Users can only see/edit their own

2. **bookmarks** - Private, for personal bookmarks
   - id, user_id, anime_slug, anime_title, poster_url, episode_id, episode_number, list_id, created_at
   - RLS: Users can only see/edit their own

3. **bookmark_lists** - Private, for organizing bookmarks
   - id, user_id, name, description, created_at
   - RLS: Users can only see/edit their own

## Troubleshooting

### Favorite not saving
- Check browser console for errors
- Verify user is logged in
- Check Supabase `favorites` table has data
- Verify RLS policy allows INSERT

### Bookmark not saving
- Check browser console logs with `[v0]` prefix
- Verify anime data is complete (slug, title, posterUrl)
- Check Supabase `bookmarks` table
- Ensure no duplicate bookmarks

### Buttons not updating
- Clear browser cache (Ctrl+Shift+Delete)
- Reload page (Ctrl+R)
- Check browser console for JavaScript errors

### Bookmark bar not showing
- Need at least 1 bookmark to appear
- Check navbar at `/bookmarks` route first to add bookmarks
- Hover timeout may need adjustment

## Expected Behavior

### Adding Favorite
1. Click favorite button
2. See loading state (button changes)
3. Button shows "Favorited" in red
4. Appears in `/profile` within seconds
5. Can be seen by others who visit your profile

### Adding Bookmark
1. Click bookmark button
2. See loading state (button changes)
3. Button shows "Bookmarked" in golden
4. Only visible to you at `/bookmarks`
5. Private - not shared with others

### History
1. Watch episode for >5 seconds
2. Automatically added to `/history`
3. Shows "Lanjutkan Nonton" if watched recently
4. Can be deleted individually or all at once
