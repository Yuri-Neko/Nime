import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkLists, setBookmarkLists] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookmarks from Supabase
  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setBookmarkLists([]);
      return;
    }

    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBookmarks(data || []);
      } catch (error) {
        console.error('Error fetching bookmarks:', error.message);
      }

      try {
        const { data, error } = await supabase
          .from('bookmark_lists')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBookmarkLists(data || []);
      } catch (error) {
        console.error('Error fetching bookmark lists:', error.message);
      }

      setLoading(false);
    };

    fetchBookmarks();
  }, [user]);

  const addBookmark = async (animeData, episodeData = null, listId = null) => {
    if (!user) {
      console.error('[v0] User not authenticated');
      return null;
    }

    // Validate anime data
    if (!animeData || !animeData.slug || !animeData.title || !animeData.posterUrl) {
      console.error('[v0] Invalid anime data:', animeData);
      return null;
    }

    // Check if bookmark already exists
    const alreadyBookmarked = bookmarks.some(b => b.anime_slug === animeData.slug);
    if (alreadyBookmarked) {
      console.log('[v0] Anime already bookmarked:', animeData.slug);
      return null;
    }

    try {
      console.log('[v0] Adding bookmark:', { animeData, episodeData, userId: user.id });
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          anime_slug: animeData.slug,
          anime_title: animeData.title,
          poster_url: animeData.posterUrl,
          episode_id: episodeData?.id || null,
          episode_number: episodeData?.number || null,
          list_id: listId || null,
        })
        .select();

      if (error) {
        console.error('[v0] Bookmark insert error:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('[v0] Bookmark added successfully:', data[0]);
        setBookmarks([data[0], ...bookmarks]);
        return data[0];
      }
      return null;
    } catch (error) {
      console.error('[v0] Error adding bookmark:', error.message || error);
      return null;
    }
  };

  const removeBookmark = async (bookmarkId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Error removing bookmark:', error.message);
    }
  };

  const createList = async (listName, description = '') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookmark_lists')
        .insert({
          user_id: user.id,
          name: listName,
          description,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      setBookmarkLists([...bookmarkLists, data[0]]);
      return data[0];
    } catch (error) {
      console.error('Error creating list:', error.message);
    }
  };

  const deleteList = async (listId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bookmark_lists')
        .delete()
        .eq('id', listId);

      if (error) throw error;

      // Remove bookmarks in this list
      await supabase
        .from('bookmarks')
        .update({ list_id: null })
        .eq('list_id', listId);

      setBookmarkLists(bookmarkLists.filter(l => l.id !== listId));
      setBookmarks(bookmarks.map(b => b.list_id === listId ? { ...b, list_id: null } : b));
    } catch (error) {
      console.error('Error deleting list:', error.message);
    }
  };

  const isBookmarked = (animeSlug) => {
    return bookmarks.some(b => b.anime_slug === animeSlug);
  };

  return (
    <BookmarkContext.Provider value={{
      bookmarks,
      bookmarkLists,
      loading,
      addBookmark,
      removeBookmark,
      createList,
      deleteList,
      isBookmarked,
    }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);
