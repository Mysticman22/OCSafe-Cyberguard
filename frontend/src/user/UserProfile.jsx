export default function UserProfile() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-10 text-center">
        
        {/* Avatar */}
        <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-purple-600/20 mb-6">
          U
        </div>

        {/* Name & Role */}
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">User</h2>
        <p className="text-sm font-bold text-purple-600 uppercase tracking-widest mt-1">Cyberguard Pro User</p>

        {/* Info Cards */}
        <div className="space-y-4 mt-8">
          <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">pratik@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Security</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Level 4 Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
