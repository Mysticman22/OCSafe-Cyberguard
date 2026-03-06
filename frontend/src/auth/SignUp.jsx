import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../api/auth';

export default function SignUp() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!form.email.endsWith('@gmail.com')) {
      setError('Email must be a valid @gmail.com address.');
      return;
    }


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError('Password requires 8+ characters with uppercase, lowercase, number, and special character.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        email: form.email,
        password: form.password,
        organization_id: null,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* Success */
  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-brand-purple/10 blur-[150px]"></div>
        </div>
        <div className="flex flex-col items-center gap-6 relative z-10 text-center px-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
            <svg className="w-20 h-20 text-green-500 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Account Created</h2>
          <p className="text-gray-400 font-medium max-w-sm">
            Your enterprise account has been provisioned. Contact your administrator for access clearance.
          </p>
          <Link
            to="/signin"
            className="mt-4 px-8 py-3.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-xl shadow-lg shadow-brand-purple/25 transition-all"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-white overflow-hidden">

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[15%] w-[60%] h-[60%] rounded-full bg-brand-purple/8 blur-[150px]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-purple/5 blur-[120px]"></div>
      </div>

      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-5/12 items-center justify-center relative p-16">
        <div className="max-w-md relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-brand-purple rounded-2xl flex items-center justify-center shadow-lg shadow-brand-purple/30">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">OCsafe</h1>
              <p className="text-brand-purple-light text-sm font-bold tracking-widest uppercase">Cyberguard Pro</p>
            </div>
          </div>
          <h2 className="text-4xl font-black leading-tight mb-6 tracking-tight">
            Join the<br />
            <span className="text-brand-purple-light">Security Network</span>
          </h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10">
            Get enterprise-grade endpoint protection. Register your identity to be provisioned for secure access.
          </p>
          <div className="space-y-4">
            {[
              'Real-time threat detection & response',
              'On-device behavioral analysis',
              'Centralized fleet management',
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-brand-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <span className="text-gray-300 font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-lg">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-brand-purple rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-2xl font-black">OCsafe</span>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-10 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold tracking-tight">Create Account</h3>
              <p className="text-gray-400 mt-2 text-sm font-medium">Register your enterprise identity for provisioning.</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/60 focus:border-brand-purple transition-all font-medium"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/60 focus:border-brand-purple transition-all font-medium"
                  required
                />
              </div>



              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-5 py-3.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/60 focus:border-brand-purple transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">Min 8 chars: upper, lower, number, symbol</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/60 focus:border-brand-purple transition-all font-medium"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-xl shadow-lg shadow-brand-purple/25 transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-brand-purple/30 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-800"></div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-800"></div>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-400 font-medium">
              Already have an account?{' '}
              <Link to="/signin" className="text-brand-purple-light hover:text-brand-purple font-bold transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6 font-semibold tracking-wider uppercase">
            OCsafe Cyberguard Pro &bull; Enterprise Security
          </p>
        </div>
      </div>
    </div>
  );
}
