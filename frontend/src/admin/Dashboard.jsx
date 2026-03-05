export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Live monitoring of your enterprise security posture.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Score Skeleton */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 self-start w-full">System Health Score</h2>
          <div className="relative w-64 h-64 rounded-full border-[16px] border-gray-100 dark:border-slate-800 flex items-center justify-center">
             <div className="flex flex-col items-center">
               <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">0<span className="text-3xl text-gray-400">/100</span></span>
               <span className="mt-4 px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-full text-xs font-bold tracking-wider">PENDING SCAN</span>
             </div>
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          {['Analytics', 'Active Alerts', 'Connected Devices', 'Client Tenants'].map((action) => (
             <button key={action} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none hover:border-brand-purple/50 transition-colors flex flex-col items-start justify-between min-h-[190px] group text-left">
               <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 group-hover:bg-brand-purple/10 flex items-center justify-center transition-colors">
                 <div className="w-6 h-6 rounded bg-gray-300 dark:bg-gray-600 group-hover:bg-brand-purple transition-colors"></div>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{action}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Click to manage and review details</p>
               </div>
             </button>
          ))}
        </div>
      </div>
    </div>
  );
}
