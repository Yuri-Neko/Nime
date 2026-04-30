import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white">
      <button 
        onClick={signInWithGoogle}
        className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
