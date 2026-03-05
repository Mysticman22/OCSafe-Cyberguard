import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  AlertOctagon, 
  Users, 
  FileText, 
  HelpCircle, 
  Settings,
  LogOut,
  Moon,
  Sun,
  Bell,
  Search
} from 'lucide-react';
import { cn } from './utils';
import FloatingChat from './FloatingChat';

export default function Layout({ children, isDarkMode, toggleDarkMode }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Threats', path: '/admin/threats', icon: AlertOctagon },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Help & Support', path: '/admin/support', icon: HelpCircle },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-gray-100 overflow-hidden">
      
      {/* Sidebar - w-72 */}
      <aside className="w-72 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between py-6 shrink-0">
        <div>
          {/* Logo & Theme Toggle Area */}
          <div className="px-8 flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-brand-purple p-2 rounded-xl text-white">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight">OCsafe</span>
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-900 text-gray-500 hover:text-brand-purple transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 px-4">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 font-medium",
                    isActive 
                      ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20" 
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900 dark:text-gray-400 dark:hover:text-gray-200"
                  )}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="px-4">
          <button className="flex w-full items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header - h-20 */}
        <header className="h-20 border-b border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm flex items-center justify-between px-8 shrink-0">
          
          {/* Search Bar */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search threats, users, or reports..." 
              className="w-full bg-gray-100 dark:bg-slate-900 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 dark:text-gray-200 placeholder-gray-400"
            />
          </div>

          {/* Admin Profile Area */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:text-brand-purple transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold shadow-sm">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Shreya Wankhede</span>
                <span className="text-xs text-gray-400 font-medium">System Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-slate-950">
          {children}
        </div>

        {/* Floating AI Chat Component */}
        <FloatingChat />

      </main>

    </div>
  );
}
