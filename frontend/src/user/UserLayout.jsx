import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../shared/utils';
import UserAuthModal from './UserAuthModal';

export default function UserLayout({ children }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'signin' | 'signup' | null
  const [userProfile, setUserProfile] = useState({ name: 'User', email: 'pratik@gmail.com' });

  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const navItems = [
    { name: 'Dashboard', path: '/user/dashboard', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    )},
    { name: 'Performance', path: '/user/performance', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
    )},
    { name: 'Endpoints', path: '/user/endpoints', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path strokeLinecap="round" d="M8 21h8M12 17v4"/></svg>
    )},
    { name: 'Network', path: '/user/network', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
    )},
  ];

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserProfile({ name: 'User', email });
    setAuthModal(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
  };

  return (
    <div className={cn("flex h-screen w-full overflow-hidden font-sans transition-colors duration-300", isDarkMode ? "bg-slate-950 text-gray-100" : "bg-gray-50 text-slate-900")}>
      
      {/* Sidebar */}
      <aside className={cn("w-72 flex flex-col justify-between py-8 shrink-0 border-r transition-colors", isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-gray-100")}>
        
        {/* Logo */}
        <div>
          <div className="px-8 flex items-center gap-3 mb-12">
            <div className="w-11 h-11 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
              </svg>
            </div>
            <div>
              <span className="font-black text-lg tracking-tight">OCSafe</span>
              <span className="font-black text-lg tracking-tight text-purple-600 ml-1">GUARD</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5 px-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 font-semibold text-[15px]",
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-600/25"
                      : isDarkMode
                        ? "text-gray-400 hover:bg-slate-900 hover:text-white"
                        : "text-gray-500 hover:bg-gray-50 hover:text-slate-900"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dark Mode Toggle */}
        <div className="px-6">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl font-semibold text-[15px] transition-colors",
              isDarkMode
                ? "text-gray-400 hover:bg-slate-900 hover:text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-slate-900"
            )}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isDarkMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
              )}
            </svg>
            <span>Dark Mode</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header */}
        <header className={cn("h-16 flex items-center justify-end px-8 shrink-0 border-b transition-colors", isDarkMode ? "border-slate-800" : "border-gray-100")}>
          
          {!isLoggedIn ? (
            /* Guest State */
            <button
              onClick={() => setAuthModal('signin')}
              className={cn("flex items-center gap-3 px-5 py-2 rounded-full border-2 transition-colors font-bold text-sm", isDarkMode ? "border-slate-700 text-gray-300 hover:border-purple-500" : "border-gray-200 text-gray-600 hover:border-purple-500")}
            >
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isDarkMode ? "bg-slate-800" : "bg-gray-100")}>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">Sign In</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Guest</p>
              </div>
            </button>
          ) : (
            /* Logged In State */
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-600/20">
                  U
                </div>
                <div className="text-left">
                  <p className={cn("text-sm font-bold leading-tight", isDarkMode ? "text-white" : "text-slate-900")}>{userProfile.name}</p>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Protected</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className={cn("absolute right-0 top-14 w-64 rounded-2xl shadow-2xl border p-4 z-50 transition-colors", isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100")}>
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-slate-800 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">U</div>
                    <div>
                      <p className={cn("text-sm font-bold", isDarkMode ? "text-white" : "text-slate-900")}>{userProfile.name}</p>
                      <p className="text-xs text-gray-400">{userProfile.email}</p>
                    </div>
                  </div>
                  <Link to="/user/profile" onClick={() => setShowProfileDropdown(false)} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors", isDarkMode ? "text-gray-300 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-50")}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                    My Profile
                  </Link>
                  <Link to="/user/settings" onClick={() => setShowProfileDropdown(false)} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors", isDarkMode ? "text-gray-300 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-50")}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Account Settings
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-colors mt-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Page Content */}
        <div className={cn("flex-1 overflow-y-auto p-8 transition-colors", isDarkMode ? "bg-slate-950" : "bg-gray-50")}>
          {children}
        </div>
      </main>

      {/* Auth Modals */}
      {authModal && (
        <UserAuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={(mode) => setAuthModal(mode)}
          onLogin={handleLogin}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
