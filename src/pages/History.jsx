import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useWatchHistory } from '../context/WatchHistoryContext';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history, stats, getContinueWatching, removeFromHistory, clearAllHistory } = useWatchHistory();
  
  const [filterType, setFilterType] = useState('all'); // all, recent, oldest
  const [sortBy, setSortBy] = useState('date'); // date, title, episodes
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const continueWatching = getContinueWatching();
  
  const sortedHistory = [...history].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.anime_title.localeCompare(b.anime_title);
      case 'episodes':
        return (b.current_episode || 0) - (a.current_episode || 0);
      case 'date':
      default:
        return new Date(b.last_watched_at) - new Date(a.last_watched_at);
    }
  });

  const filteredHistory = filterType === 'all' ? sortedHistory : 
    filterType === 'recent' ? sortedHistory.slice(0, 10) : sortedHistory.slice(-10);

  const handleDelete = async (historyId) => {
    await removeFromHistory(historyId);
  };

  const handleClearAll = async () => {
    await clearAllHistory();
    setShowDeleteConfirm(false);
  };

  const navigateToAnime = (animeSlug, episode) => {
    navigate(`/anime/${animeSlug}/${episode || 1}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-nunito selection:bg-[#F6CF80] selection:text-black pb-24">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col">
          <h2 className="text-white font-black uppercase text-lg">Riwayat Nonton</h2>
          <span className="text-[10px] text-white/50 font-bold">Lanjutkan anime yang sedang kamu tonton</span>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-16 h-16 text-white/5 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p className="text-white/40 font-bold text-sm">Belum ada riwayat tontonan</p>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#16161a] to-[#0a0a0c] p-6 rounded-xl border border-white/10">
                <div className="text-[#F6CF80] text-2xl font-black">{stats.totalHoursWatched}h</div>
                <div className="text-white/60 text-sm mt-1">Total Jam Ditonton</div>
              </div>
              <div className="bg-gradient-to-br from-[#16161a] to-[#0a0a0c] p-6 rounded-xl border border-white/10">
                <div className="text-[#F6CF80] text-2xl font-black">{stats.totalAnimes}</div>
                <div className="text-white/60 text-sm mt-1">Total Anime Ditonton</div>
              </div>
              <div className="bg-gradient-to-br from-[#16161a] to-[#0a0a0c] p-6 rounded-xl border border-white/10">
                <div className="text-[#F6CF80] text-2xl font-black">{continueWatching.length}</div>
                <div className="text-white/60 text-sm mt-1">Lanjutkan Nonton</div>
              </div>
            </div>

            {/* Continue Watching Section */}
            {continueWatching.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-bold text-lg mb-4">Lanjutkan Nonton</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {continueWatching.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigateToAnime(item.anime_slug, item.current_episode)}
                      className="group cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-lg mb-2 bg-[#16161a] aspect-video md:aspect-[3/4]">
                        <img
                          src={item.poster_url}
                          alt={item.anime_title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <svg className="w-8 h-8 text-[#F6CF80]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                          <p className="text-[#F6CF80] text-xs font-bold">Ep. {item.current_episode}</p>
                        </div>
                      </div>
                      <p className="text-white text-xs font-bold truncate group-hover:text-[#F6CF80] transition">{item.anime_title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#16161a] text-white text-sm px-3 py-2 rounded-lg border border-white/10 focus:border-[#F6CF80] outline-none"
                >
                  <option value="date">Urutkan: Terbaru</option>
                  <option value="title">Urutkan: Judul</option>
                  <option value="episodes">Urutkan: Episode Terbanyak</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[#16161a] text-white text-sm px-3 py-2 rounded-lg border border-white/10 focus:border-[#F6CF80] outline-none"
                >
                  <option value="all">Filter: Semua</option>
                  <option value="recent">Filter: 10 Terbaru</option>
                  <option value="oldest">Filter: 10 Terlama</option>
                </select>
              </div>
              {filteredHistory.length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-500 hover:text-red-400 text-sm font-bold transition"
                >
                  Hapus Semua Riwayat
                </button>
              )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#16161a] border border-white/10 rounded-xl p-6 max-w-sm">
                  <h3 className="text-white font-bold text-lg mb-2">Hapus Semua Riwayat?</h3>
                  <p className="text-white/60 text-sm mb-6">Tindakan ini tidak dapat dibatalkan.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* History List */}
            <div className="space-y-3">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#16161a] border border-white/10 rounded-lg p-4 hover:border-[#F6CF80]/50 transition flex items-center gap-4"
                  >
                    <img
                      src={item.poster_url}
                      alt={item.anime_title}
                      className="w-16 h-24 object-cover rounded cursor-pointer hover:opacity-80 transition"
                      onClick={() => navigateToAnime(item.anime_slug, item.current_episode)}
                    />
                    <div className="flex-1">
                      <h3
                        onClick={() => navigateToAnime(item.anime_slug, item.current_episode)}
                        className="text-white font-bold hover:text-[#F6CF80] cursor-pointer transition"
                      >
                        {item.anime_title}
                      </h3>
                      <div className="flex gap-4 text-white/60 text-sm mt-2">
                        <span>Ep. {item.current_episode}</span>
                        <span>{Math.round(item.minutes_watched)} menit ditonton</span>
                        <span className="text-[10px]">
                          {new Date(item.last_watched_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-white/40 hover:text-red-500 transition"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-white/40 font-bold text-sm">Tidak ada riwayat</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
