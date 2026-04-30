import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);
      setFavorites(data || []);
    };
    if (user) fetchFavorites();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-8 pt-24">
      <Navbar />
      <h1 className="text-2xl font-black mb-6">Profil Saya</h1>
      <div className="bg-[#16161a] p-6 rounded-xl border border-white/10 mb-8">
        <p>Email: {user?.email}</p>
        <button onClick={signOut} className="mt-4 bg-red-600 px-4 py-2 rounded text-sm">Logout</button>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Anime Favorit</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {favorites.map(f => (
          <div key={f.anime_slug} className="bg-[#16161a] p-2 rounded">
            <img src={f.poster_url} alt={f.anime_title} className="w-full h-48 object-cover rounded" />
            <p className="mt-2 text-sm font-bold truncate">{f.anime_title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;