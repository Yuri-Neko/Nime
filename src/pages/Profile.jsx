import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) console.error('Error fetching profile:', error.message);
      if (data) {
        setUsername(data.username || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);
    };

    const fetchFavorites = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);
      setFavorites(data || []);
    };

    fetchUserProfile();
    fetchFavorites();
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      username,
      avatar_url: avatarUrl
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-8 pt-24">
      <Navbar />
      <h1 className="text-2xl font-black mb-6">Profil Saya</h1>
      
      {loading ? (
        <p>Loading profil...</p>
      ) : (
        <div className="bg-[#16161a] p-6 rounded-xl border border-white/10 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={avatarUrl || `https://ui-avatars.com/api/?name=${username || user?.email}&background=random&color=fff`}
              alt="Avatar" 
              className="w-20 h-20 rounded-full object-cover border-2 border-[#F6CF80]"
            />
            <div>
              <p className="text-xl font-bold">{username || user?.email}</p>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Edit Profil</h2>
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="block text-white/70 text-sm mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black p-3 rounded-lg outline-none border border-white/10 focus:border-[#F6CF80]"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">URL Gambar Profil</label>
              <input 
                type="text" 
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-black p-3 rounded-lg outline-none border border-white/10 focus:border-[#F6CF80]"
              />
            </div>
            <button onClick={updateProfile} className="bg-[#F6CF80] text-black font-black p-3 rounded-lg hover:bg-white transition">
              Simpan Perubahan
            </button>
          </div>

          <button onClick={signOut} className="mt-4 bg-red-600 px-4 py-2 rounded text-sm">Logout</button>
        </div>
      )}
      
      <h2 className="text-xl font-bold mb-4">Anime Favorit ({favorites.length})</h2>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map(f => (
            <div key={f.anime_slug} className="group relative bg-[#16161a] rounded-lg overflow-hidden border border-white/10 hover:border-[#F6CF80] transition cursor-pointer">
              <img 
                src={f.poster_url} 
                alt={f.anime_title} 
                className="w-full h-56 object-cover group-hover:opacity-75 transition" 
                onError={(e) => e.target.src = 'https://via.placeholder.com/200x300?text=No+Image'}
              />
              <div className="p-3">
                <p className="text-sm font-bold truncate text-white group-hover:text-[#F6CF80] transition">{f.anime_title}</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from('favorites')
                      .delete()
                      .eq('anime_slug', f.anime_slug)
                      .eq('user_id', user.id);
                    
                    if (error) throw error;
                    setFavorites(favorites.filter(fav => fav.anime_slug !== f.anime_slug));
                  } catch (err) {
                    console.error('Error removing favorite:', err);
                    alert('Gagal menghapus dari favorit');
                  }
                }}
                className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 p-2 rounded opacity-0 group-hover:opacity-100 transition"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#16161a] p-8 rounded-xl border border-white/10 text-center">
          <p className="text-white/60 mb-4">Belum ada anime favorit</p>
          <p className="text-white/40 text-sm">Tambahkan anime ke favorit dengan klik tombol hati saat menonton</p>
        </div>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Jaringan Sosial</h2>
      <div className="bg-[#16161a] p-6 rounded-xl border border-white/10">
        <p className="text-white/60 mb-2">Jumlah Pengikut: 0 (Fitur akan datang)</p>
        <p className="text-white/60">Mengikuti: 0 (Fitur akan datang)</p>
        {/* Tombol add friend dll di sini */}
      </div>
    </div>
  );
};

export default Profile;
