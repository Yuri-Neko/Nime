import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({ username: '', avatar_url: '' });
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setLoading(true);
      const { data: prof } = await supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single();
      if (prof) setProfile(prof);

      const { data: favs } = await supabase.from('favorites').select('*').eq('user_id', user.id);
      setFavorites(favs || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    
    setLoading(true);
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
    
    if (uploadError) { alert(uploadError.message); } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: data.publicUrl });
      setProfile(p => ({ ...p, avatar_url: data.publicUrl }));
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-[#F6CF80]">Loading ZaruSoft...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pt-24 pb-20">
      <Navbar />
      <div className="max-w-xl mx-auto px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <img src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username || 'Z'}`} className="w-32 h-32 rounded-full object-cover border-4 border-[#F6CF80]/20 shadow-2xl" />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-xs font-black uppercase">Ganti</span>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
          </div>
          <h1 className="text-2xl font-black mt-4">{profile.username || 'User ZaruSoft'}</h1>
          <div className="flex gap-8 mt-6 text-center">
            <div><p className="font-black text-xl">{favorites.length}</p><p className="text-[10px] text-white/50 uppercase">Favorit</p></div>
            <div><p className="font-black text-xl">0</p><p className="text-[10px] text-white/50 uppercase">Pengikut</p></div>
            <div><p className="font-black text-xl">0</p><p className="text-[10px] text-white/50 uppercase">Mengikuti</p></div>
          </div>
        </div>

        <h2 className="text-sm font-black uppercase tracking-widest text-[#F6CF80] mb-4">Koleksi Favorit</h2>
        <div className="grid grid-cols-3 gap-1">
          {favorites.map(f => (
            <div key={f.anime_slug} className="aspect-[3/4] bg-[#16161a] overflow-hidden">
              <img src={f.poster_url} className="w-full h-full object-cover hover:scale-105 transition-transform" />
            </div>
          ))}
        </div>
        
        <button onClick={signOut} className="w-full mt-10 bg-white/5 border border-white/10 p-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-500/10">Keluar</button>
      </div>
    </div>
  );
};

export default Profile;