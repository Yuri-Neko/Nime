import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useBookmarks } from '../context/BookmarkContext';

const Bookmarks = () => {
  const navigate = useNavigate();
  const { bookmarks, bookmarkLists, removeBookmark, createList, deleteList } = useBookmarks();
  const [selectedList, setSelectedList] = useState(null);
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleCreateList = async () => {
    if (newListName.trim()) {
      await createList(newListName, newListDesc);
      setNewListName('');
      setNewListDesc('');
      setShowCreateList(false);
    }
  };

  const handleDeleteList = async (listId) => {
    await deleteList(listId);
    if (selectedList === listId) {
      setSelectedList(null);
    }
    setShowDeleteConfirm(null);
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    await removeBookmark(bookmarkId);
  };

  const navigateToAnime = (animeSlug, episode) => {
    navigate(`/anime/${animeSlug}/${episode || 1}`);
  };

  const filteredBookmarks = selectedList
    ? bookmarks.filter(b => b.list_id === selectedList)
    : bookmarks.filter(b => !b.list_id);

  const activeListCount = selectedList
    ? bookmarks.filter(b => b.list_id === selectedList).length
    : bookmarks.filter(b => !b.list_id).length;

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-nunito selection:bg-[#F6CF80] selection:text-black pb-24">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div className="flex flex-col">
            <h2 className="text-white font-black uppercase text-lg">Bookmark Saya</h2>
            <span className="text-[10px] text-white/50 font-bold">Simpan anime favorit untuk ditonton nanti</span>
          </div>
          <button
            onClick={() => setShowCreateList(true)}
            className="bg-[#F6CF80] hover:bg-white text-black font-black px-4 py-2 rounded-lg transition text-sm"
          >
            + Buat List
          </button>
        </div>

        {/* Create List Modal */}
        {showCreateList && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#16161a] border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-white font-bold text-lg mb-4">Buat Daftar Bookmark Baru</h3>
              <input
                type="text"
                placeholder="Nama Daftar"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full bg-black text-white px-3 py-2 rounded-lg border border-white/10 focus:border-[#F6CF80] outline-none mb-3 text-sm"
              />
              <textarea
                placeholder="Deskripsi (opsional)"
                value={newListDesc}
                onChange={(e) => setNewListDesc(e.target.value)}
                className="w-full bg-black text-white px-3 py-2 rounded-lg border border-white/10 focus:border-[#F6CF80] outline-none mb-4 text-sm resize-none h-20"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateList(false);
                    setNewListName('');
                    setNewListDesc('');
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg transition text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateList}
                  className="flex-1 bg-[#F6CF80] hover:bg-white text-black font-bold py-2 rounded-lg transition text-sm"
                >
                  Buat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#16161a] border border-white/10 rounded-xl p-6 max-w-sm">
              <h3 className="text-white font-bold text-lg mb-2">Hapus Daftar?</h3>
              <p className="text-white/60 text-sm mb-6">Bookmark dalam daftar ini akan dipindahkan ke bookmark tanpa daftar.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg transition text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteList(showDeleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-[#16161a] border border-white/10 rounded-xl p-4 sticky top-24">
              <h3 className="text-white font-bold text-sm mb-4">Daftar Bookmark</h3>
              
              <button
                onClick={() => setSelectedList(null)}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition text-sm ${
                  selectedList === null
                    ? 'bg-[#F6CF80] text-black font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Semua Bookmark</span>
                <span className="float-right text-xs bg-white/10 px-2 py-1 rounded">{bookmarks.filter(b => !b.list_id).length}</span>
              </button>

              {bookmarkLists.map(list => (
                <div key={list.id} className="flex items-center gap-2 mb-2 group">
                  <button
                    onClick={() => setSelectedList(list.id)}
                    className={`flex-1 text-left px-4 py-2 rounded-lg transition text-sm ${
                      selectedList === list.id
                        ? 'bg-[#F6CF80] text-black font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{list.name}</span>
                    <span className="float-right text-xs bg-white/10 px-2 py-1 rounded">
                      {bookmarks.filter(b => b.list_id === list.id).length}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(list.id)}
                    className="text-white/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {bookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg className="w-16 h-16 text-white/5 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z"/>
                </svg>
                <p className="text-white/40 font-bold text-sm">Belum ada bookmark</p>
                <p className="text-white/30 text-xs mt-1">Mulai tambahkan anime favorit!</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-white font-bold text-lg">
                    {selectedList ? bookmarkLists.find(l => l.id === selectedList)?.name : 'Semua Bookmark'}
                  </h3>
                  <p className="text-white/50 text-sm">{activeListCount} anime</p>
                </div>

                {filteredBookmarks.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-white/40 font-bold text-sm">Daftar ini kosong</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredBookmarks.map(bookmark => (
                      <div key={bookmark.id} className="group">
                        <div className="relative overflow-hidden rounded-lg mb-2 bg-[#16161a] aspect-[3/4]">
                          <img
                            src={bookmark.poster_url}
                            alt={bookmark.anime_title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
                            onClick={() => navigateToAnime(bookmark.anime_slug, bookmark.episode_number)}
                          />
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition gap-2">
                            <button
                              onClick={() => navigateToAnime(bookmark.anime_slug, bookmark.episode_number)}
                              className="bg-[#F6CF80] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-white transition"
                            >
                              Tonton
                            </button>
                            <button
                              onClick={() => handleDeleteBookmark(bookmark.id)}
                              className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                        <p className="text-white text-xs font-bold truncate group-hover:text-[#F6CF80] transition">
                          {bookmark.anime_title}
                        </p>
                        {bookmark.episode_number && (
                          <p className="text-white/50 text-[10px]">Ep. {bookmark.episode_number}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
