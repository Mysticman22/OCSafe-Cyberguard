export default function UserPerformance() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Performance</h1>
      <p className="text-gray-400 font-medium mb-8">System resource utilization and performance metrics.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'CPU Usage', value: '32%', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
          { label: 'Memory', value: '54%', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Disk', value: '67%', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
        ].map(m => (
          <div key={m.label} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{m.label}</p>
            <p className={`text-4xl font-black ${m.color}`}>{m.value}</p>
            <div className="mt-4 w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full rounded-full ${m.bg.includes('green') ? 'bg-green-500' : m.bg.includes('blue') ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ width: m.value }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
