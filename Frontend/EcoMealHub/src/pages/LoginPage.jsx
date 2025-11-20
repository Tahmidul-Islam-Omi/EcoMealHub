import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5432/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('user', JSON.stringify(data));
      window.location.href = '/';
      
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-10 h-10 text-green-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-indigo-400 bg-clip-text text-transparent">
              EcoMealHub
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to continue your sustainable journey</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Note */}
        <div className="mt-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 text-center">
          <p className="text-sm text-indigo-300">
            <strong>Demo Mode:</strong> Use any email and password to sign in
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
