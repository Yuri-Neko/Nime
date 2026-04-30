import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert('Cek email untuk konfirmasi!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white p-4">
      <div className="bg-[#16161a] border border-white/5 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
        <h2 className="text-2xl font-black mb-6 text-center">{isRegister ? 'Daftar' : 'Masuk'} ke NefuSoft</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" className="bg-black p-3 rounded-lg outline-none" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="bg-black p-3 rounded-lg outline-none" onChange={(e) => setPassword(e.target.value)} />
          <button className="bg-[#F6CF80] text-black font-black p-3 rounded-lg hover:bg-white transition">{isRegister ? 'Daftar' : 'Masuk'}</button>
        </form>

        <div className="my-6 border-t border-white/10 pt-6">
          <button onClick={signInWithGoogle} className="w-full bg-white/5 border border-white/10 p-3 rounded-lg font-bold hover:bg-white/10 transition">
            Masuk dengan Google
          </button>
        </div>

        <p className="text-center text-sm text-white/50 cursor-pointer" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
        </p>
      </div>
    </div>
  );
};

export default Login;
