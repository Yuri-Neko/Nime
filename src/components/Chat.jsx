import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Filter from 'bad-words';

const filter = new Filter();

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const channel = supabase.channel('public:messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
      setMessages(prev => [...prev, payload.new]);
    }).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const cleanContent = filter.clean(input);
    await supabase.from('messages').insert({ content: cleanContent });
    setInput('');
  };

  return (
    <div className="bg-[#16161a] p-4 rounded-xl border border-white/10 h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((m, i) => <p key={i} className="text-sm mb-1">{m.content}</p>)}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 bg-black p-2 rounded" />
        <button onClick={sendMessage} className="bg-[#F6CF80] px-4 py-2 rounded text-black font-bold">Kirim</button>
      </div>
    </div>
  );
};

export default Chat;