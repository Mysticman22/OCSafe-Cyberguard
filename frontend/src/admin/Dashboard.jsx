import { useState, useEffect } from 'react';
import { getOrgTelemetrySummary, getDevices, getUsers } from '../api/auth';
import { cn } from '../shared/utils';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [deviceCount, setDeviceCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [telSummary, devices, users] = await Promise.all([
          getOrgTelemetrySummary(),
          getDevices(),
          getUsers(),
        ]);
        setSummary(telSummary);
        setDeviceCount(Array.isArray(devices) ? devices.length : 0);
        setUserCount(Array.isArray(users) ? users.length : 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchAll();
    const i = setInterval(fetchAll, 30000);
    return () => clearInterval(i);
  }, []);

  // Calculate org-wide health score
  const devices = summary?.devices || [];
  let healthScore = 0;
  if (devices.length > 0) {
    let total = 0;
    devices.forEach(d => {
      let s = 100;
      if (!d.firewall_enabled) s -= 20;
      if (!d.antivirus_enabled) s -= 20;
      if (d.disk_percent > 90) s -= 10;
      total += Math.max(0, s);
    });
    healthScore = Math.round(total / devices.length);
  }

  const scoreLabel = healthScore >= 80 ? 'SECURE' : healthScore >= 50 ? 'WARNING' : healthScore > 0 ? 'AT RISK' : 'PENDING SCAN';
  const scoreColor = healthScore >= 80 ? 'text-green-500' : healthScore >= 50 ? 'text-amber-500' : healthScore > 0 ? 'text-red-500' : 'text-gray-400';
  const scoreBorder = healthScore >= 80 ? 'border-green-400/30' : healthScore >= 50 ? 'border-amber-400/30' : healthScore > 0 ? 'border-red-400/30' : 'border-gray-100 dark:border-slate-800';

  const threatCount = devices.filter(d => !d.firewall_enabled || !d.antivirus_enabled).length;

  const cards = [
    { title: 'Connected Devices', value: deviceCount, sub: `${devices.filter(d => d.last_seen).length} reporting`, color: 'text-blue-500', icon: '💻' },
    { title: 'Active Threats', value: threatCount, sub: threatCount === 0 ? 'All clear' : 'Needs attention', color: threatCount > 0 ? 'text-red-500' : 'text-green-500', icon: '🛡️' },
    { title: 'Team Members', value: userCount, sub: 'In organization', color: 'text-purple-500', icon: '👥' },
    { title: 'Avg. CPU Usage', value: devices.length > 0 ? `${Math.round(devices.reduce((a, d) => a + (d.cpu_percent || 0), 0) / devices.length)}%` : '--', sub: 'Across fleet', color: 'text-orange-500', icon: '⚡' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Live monitoring of your enterprise security posture.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health Score */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 self-start w-full">System Health Score</h2>
            <div className={cn("relative w-64 h-64 rounded-full border-[16px] flex items-center justify-center transition-colors", scoreBorder)}>
              <div className="flex flex-col items-center">
                <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {healthScore}<span className="text-3xl text-gray-400">/100</span>
                </span>
                <span className={cn("mt-4 px-3 py-1 rounded-full text-xs font-bold tracking-wider",
                  healthScore >= 80 ? "bg-green-100 dark:bg-green-500/10 text-green-600" :
                  healthScore >= 50 ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600" :
                  healthScore > 0 ? "bg-red-100 dark:bg-red-500/10 text-red-600" :
                  "bg-gray-100 dark:bg-slate-800 text-gray-500"
                )}>
                  {scoreLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-6">
            {cards.map((card) => (
              <div key={card.title} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col items-start justify-between min-h-[190px]">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-2xl">
                  {card.icon}
                </div>
                <div>
                  <p className={cn("text-3xl font-black", card.color)}>{card.value}</p>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{card.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fleet Device Table */}
          {devices.length > 0 && (
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Fleet Status</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-slate-800">
                      <th className="pb-4">Device</th>
                      <th className="pb-4">OS</th>
                      <th className="pb-4">CPU</th>
                      <th className="pb-4">RAM</th>
                      <th className="pb-4">Disk</th>
                      <th className="pb-4">Firewall</th>
                      <th className="pb-4">AV</th>
                      <th className="pb-4">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                    {devices.map((d) => (
                      <tr key={d.device_id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 font-bold text-slate-900 dark:text-white">{d.hostname}</td>
                        <td className="py-4 text-sm text-gray-500">{d.os_type || '--'}</td>
                        <td className="py-4">
                          <span className={cn("font-bold text-sm", d.cpu_percent > 80 ? "text-red-500" : d.cpu_percent > 50 ? "text-orange-500" : "text-green-500")}>
                            {d.cpu_percent}%
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={cn("font-bold text-sm", d.ram_percent > 80 ? "text-red-500" : "text-blue-500")}>
                            {d.ram_percent}%
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={cn("font-bold text-sm", d.disk_percent > 90 ? "text-red-500" : "text-green-500")}>
                            {d.disk_percent}%
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold",
                            d.firewall_enabled ? "bg-green-100 dark:bg-green-500/10 text-green-600" : "bg-red-100 dark:bg-red-500/10 text-red-600"
                          )}>
                            {d.firewall_enabled ? 'ON' : 'OFF'}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold",
                            d.antivirus_enabled ? "bg-green-100 dark:bg-green-500/10 text-green-600" : "bg-red-100 dark:bg-red-500/10 text-red-600"
                          )}>
                            {d.antivirus_enabled ? 'ON' : 'OFF'}
                          </span>
                        </td>
                        <td className="py-4 text-xs text-gray-400 font-medium">
                          {d.last_seen ? new Date(d.last_seen).toLocaleString() : '--'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
