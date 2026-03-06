import { useState, useEffect } from 'react';
import { getLatestTelemetry } from '../api/auth';

export default function UserPerformance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Try device ID 1 for now — will be dynamic after enrollment
        const result = await getLatestTelemetry(1);
        if (result.data && result.data.system) {
          setData(result.data.system);
        }
      } catch (e) {
        console.error('Failed to fetch telemetry:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const metrics = data ? [
    { label: 'CPU Usage', value: `${data.cpu_percent}%`, pct: data.cpu_percent, color: data.cpu_percent > 80 ? 'text-red-500' : data.cpu_percent > 50 ? 'text-orange-500' : 'text-green-500', bar: data.cpu_percent > 80 ? 'bg-red-500' : data.cpu_percent > 50 ? 'bg-orange-500' : 'bg-green-500' },
    { label: 'Memory', value: `${data.ram_percent}%`, pct: data.ram_percent, sub: `${data.ram_used_gb} / ${data.ram_total_gb} GB`, color: data.ram_percent > 80 ? 'text-red-500' : data.ram_percent > 50 ? 'text-blue-500' : 'text-green-500', bar: data.ram_percent > 80 ? 'bg-red-500' : data.ram_percent > 50 ? 'bg-blue-500' : 'bg-green-500' },
    { label: 'Disk', value: `${data.disk_percent}%`, pct: data.disk_percent, sub: `${data.disk_used_gb} / ${data.disk_total_gb} GB`, color: data.disk_percent > 90 ? 'text-red-500' : data.disk_percent > 70 ? 'text-orange-500' : 'text-green-500', bar: data.disk_percent > 90 ? 'bg-red-500' : data.disk_percent > 70 ? 'bg-orange-500' : 'bg-green-500' },
  ] : [
    { label: 'CPU Usage', value: '--', pct: 0, color: 'text-gray-400', bar: 'bg-gray-300' },
    { label: 'Memory', value: '--', pct: 0, color: 'text-gray-400', bar: 'bg-gray-300' },
    { label: 'Disk', value: '--', pct: 0, color: 'text-gray-400', bar: 'bg-gray-300' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Performance</h1>
      <p className="text-gray-400 font-medium mb-8">
        {data ? `Live system metrics from ${data.hostname || 'device'} (${data.os_name || ''})` : 'System resource utilization and performance metrics.'}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {metrics.map(m => (
              <div key={m.label} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{m.label}</p>
                <p className={`text-4xl font-black ${m.color}`}>{m.value}</p>
                {m.sub && <p className="text-xs text-gray-400 mt-1 font-medium">{m.sub}</p>}
                <div className="mt-4 w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${m.bar} transition-all duration-1000`} style={{ width: `${m.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              {[
                { label: 'CPU Cores', value: data.cpu_count || '--' },
                { label: 'CPU Freq', value: data.cpu_freq_mhz ? `${data.cpu_freq_mhz} MHz` : '--' },
                { label: 'Uptime', value: data.uptime_hours ? `${data.uptime_hours}h` : '--' },
                { label: 'OS', value: data.os_name || '--' },
              ].map(s => (
                <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-100 dark:border-slate-800 text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {!data && (
            <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-6 mt-6 text-center">
              <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
                No telemetry data yet. Install the OCSafe Agent on this device to see live performance metrics.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
