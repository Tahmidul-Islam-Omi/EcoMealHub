import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Leaf } from 'lucide-react';

const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      alert('Google authentication failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Update auth context with token and user data
        setAuthData(token, user);
        
        // Navigate to home
        navigate('/');
      } catch (err) {
        console.error('Error during Google auth:', err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setAuthData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="w-10 h-10 text-green-400 animate-pulse" />
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-indigo-400 bg-clip-text text-transparent">
            EcoMealHub
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-200 mb-2">Signing you in...</h1>
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
