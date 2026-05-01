import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const WatchHistoryContext = createContext();

export const WatchHistoryProvider = ({ children }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalHoursWatched: 0,
    totalAnimes: 0,
    favoriteGenre: null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch watch history
  useEffect(() => {
    if (!user) {
      setHistory([]);
      setStats({ totalHoursWatched: 0, totalAnimes: 0, favoriteGenre: null });
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('watch_history')
          .select('*')
          .eq('user_id', user.id)
          .order('last_watched_at', { ascending: false });

        if (error) throw error;
        setHistory(data || []);
        calculateStats(data || []);
      } catch (error) {
        console.error('Error fetching watch history:', error.message);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  const calculateStats = (historyData) => {
    const totalHours = historyData.reduce((sum, item) => sum + (item.minutes_watched || 0), 0) / 60;
    const totalAnimes = new Set(historyData.map(item => item.anime_slug)).size;
    
    setStats({
      totalHoursWatched: Math.round(totalHours * 10) / 10,
      totalAnimes,
      favoriteGenre: null, // Would need additional data to calculate
    });
  };

  const addToHistory = async (animeData, episodeData) => {
    if (!user) return;

    try {
      const { data: existingHistory } = await supabase
        .from('watch_history')
        .select('id')
        .eq('user_id', user.id)
        .eq('anime_slug', animeData.slug)
        .single();

      if (existingHistory) {
        // Update existing history
        const { data, error } = await supabase
          .from('watch_history')
          .update({
            current_episode: episodeData.number,
            minutes_watched: (existingHistory.minutes_watched || 0) + 1,
            last_watched_at: new Date().toISOString(),
          })
          .eq('id', existingHistory.id)
          .select();

        if (error) throw error;
        setHistory(history.map(h => h.id === existingHistory.id ? data[0] : h));
      } else {
        // Create new history entry
        const { data, error } = await supabase
          .from('watch_history')
          .insert({
            user_id: user.id,
            anime_slug: animeData.slug,
            anime_title: animeData.title,
            poster_url: animeData.posterUrl,
            current_episode: episodeData.number,
            minutes_watched: 1,
            last_watched_at: new Date().toISOString(),
            watched_at: new Date().toISOString(),
          })
          .select();

        if (error) throw error;
        setHistory([data[0], ...history]);
      }
    } catch (error) {
      console.error('Error adding to history:', error.message);
    }
  };

  const removeFromHistory = async (historyId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watch_history')
        .delete()
        .eq('id', historyId);

      if (error) throw error;
      setHistory(history.filter(h => h.id !== historyId));
    } catch (error) {
      console.error('Error removing from history:', error.message);
    }
  };

  const clearAllHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watch_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setHistory([]);
      setStats({ totalHoursWatched: 0, totalAnimes: 0, favoriteGenre: null });
    } catch (error) {
      console.error('Error clearing history:', error.message);
    }
  };

  const getContinueWatching = () => {
    return history.slice(0, 5); // Return top 5 recent
  };

  return (
    <WatchHistoryContext.Provider value={{
      history,
      stats,
      loading,
      addToHistory,
      removeFromHistory,
      clearAllHistory,
      getContinueWatching,
    }}>
      {children}
    </WatchHistoryContext.Provider>
  );
};

export const useWatchHistory = () => useContext(WatchHistoryContext);
