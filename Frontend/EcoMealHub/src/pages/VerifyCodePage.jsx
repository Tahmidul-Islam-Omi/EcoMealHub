import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Leaf, AlertCircle } from 'lucide-react';

const VerifyCodePage = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5432/api/v1/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }

      // Navigate to reset password page
      navigate('/reset-password', { state: { email, code } });

    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5432/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      // Reset countdown
      setCountdown(120);
      setCanResend(false);
      setError('');
      alert('New verification code sent to your email!');

    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Verify Code</h1>
          <p className="text-slate-400">
            Enter the 6-digit code sent to <span className="text-green-400">{email}</span>
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Input */}
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-slate-200 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(value);
                    if (error) setError('');
                  }}
                  required
                  maxLength="6"
                  pattern="\d{6}"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400 text-center">
                Code expires in 10 minutes
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verify Code
                </>
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-sm text-green-400 hover:text-green-300 transition-colors font-semibold"
              >
                Resend Code
              </button>
            ) : (
              <p className="text-sm text-slate-400">
                Resend code in <span className="text-green-400 font-mono">{formatTime(countdown)}</span>
              </p>
            )}
          </div>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Use different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;
