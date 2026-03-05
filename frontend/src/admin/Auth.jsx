import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validation Rules
  const validateAuth = (e) => {
    e.preventDefault();
    setError('');

    // Rule 1: Email must end with @gmail.com
    if (!email.endsWith('@gmail.com')) {
      setError('Email must be a valid @gmail.com address.');
      return;
    }

    // Rule 2: Password complex validation
    // min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special symbol
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      setError('Password must be exactly 8+ characters, including Uppercase, Lowercase, Number, and Special Symbol.');
      return;
    }

    // Success Flow
    setSuccess(true);
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            <CheckCircle2 size={80} className="text-green-500 relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">Authorization Successful</h2>
          <p className="text-gray-500 dark:text-gray-400">Loading Enterprise Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Decorators */}
      <div className="absolute top-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-purple/5 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-brand-purple/10 border border-gray-100 dark:border-slate-800 relative z-10">
        
        <div className="flex flex-col items-center mb-10">
          <div className="bg-brand-purple p-4 rounded-2xl text-white mb-6 shadow-lg shadow-brand-purple/30">
            <ShieldCheck size={40} strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Portal</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center text-sm">
            Restricted access. Please authenticate using your enterprise credentials.
          </p>
        </div>

        <form onSubmit={validateAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-gray-300 px-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-900 dark:text-white transition-all placeholder-gray-400 font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-gray-300 px-1">Master Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-900 dark:text-white transition-all placeholder-gray-400 font-medium"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 px-6 bg-brand-purple hover:bg-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-brand-purple/25 transition-all outline-none focus:ring-4 focus:ring-brand-purple/30 active:scale-[0.98]"
          >
            Authenticate Access
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            OCsafe Cyberguard Pro
          </p>
        </div>

      </div>
    </div>
  );
}
