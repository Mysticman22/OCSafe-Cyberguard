import { useState } from 'react';
import { cn } from '../shared/utils';

export default function UserAuthModal({ mode, onClose, onSwitch, onLogin, isDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    onLogin(email);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-md rounded-3xl p-10 shadow-2xl border transition-colors",
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
      )}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn("absolute top-6 right-6 p-1 rounded-lg transition-colors", isDarkMode ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-slate-900")}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        {/* Title */}
        <h2 className={cn("text-2xl font-black tracking-tight mb-8", isDarkMode ? "text-white" : "text-slate-900")}>
          {mode === 'signin' ? 'Sign In' : 'Join OCSafe'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className={cn(
                "w-full px-5 py-4 rounded-full border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/40",
                isDarkMode
                  ? "bg-slate-950 border-slate-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-200 text-slate-900 placeholder-gray-400"
              )}
            />
          )}

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className={cn(
              "w-full px-5 py-4 rounded-full border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/40",
              isDarkMode
                ? "bg-slate-950 border-slate-700 text-white placeholder-gray-500"
                : "bg-gray-50 border-gray-200 text-slate-900 placeholder-gray-400"
            )}
          />

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={cn(
              "w-full px-5 py-4 rounded-full border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/40",
              isDarkMode
                ? "bg-slate-950 border-slate-700 text-white placeholder-gray-500"
                : "bg-gray-50 border-gray-200 text-slate-900 placeholder-gray-400"
            )}
          />

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm font-medium px-2">{error}</p>
          )}

          {/* Submit Button - Purple Gradient */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold rounded-full shadow-xl shadow-purple-500/25 transition-all active:scale-[0.98] text-[15px] mt-2"
          >
            {mode === 'signin' ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex justify-between mt-6 px-1">
          <button
            onClick={() => onSwitch(mode === 'signin' ? 'signup' : 'signin')}
            className="text-sm font-medium text-gray-400 hover:text-purple-600 transition-colors"
          >
            {mode === 'signin' ? 'Sign Up' : 'Log In'}
          </button>
          <button className="text-sm font-medium text-gray-400 hover:text-purple-600 transition-colors">
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}
